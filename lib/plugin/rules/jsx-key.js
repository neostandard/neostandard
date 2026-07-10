'use strict'

// Detection logic is a minimal, ESLint-10-native reimplementation of the
// `jsx-key` rule from eslint-plugin-react (MIT). It is dependency-free and only
// covers the common cases (array literals, `.map`/`.flatMap`/`Array.from`
// callbacks); see issue #350 for context. Like upstream, a spread attribute
// (`<li {...x} />`) is NOT treated as an implicit key. Known gaps (parity with
// upstream, asserted in test/rules/jsx-key.test.js): a named helper
// (`arr.map(renderRow)`), imperatively-built arrays, and `try`/`switch`/loops
// are not followed. Deliberate supersets vs upstream (also asserted): `.flatMap`
// / `Array.from` callbacks are matched, and `LogicalExpression` /
// `ConditionalExpression` array-literal elements (`[x || <li/>]`,
// `[x ? <li/> : <span/>]`) are unwrapped like iterator-callback returns —
// upstream only unwraps those inside callbacks (eslint-plugin-react#3986).

/** @typedef {import('../jsx-types').JSXElement} JSXElement */
/** @typedef {import('../jsx-types').JSXFragment} JSXFragment */
/** @typedef {import('../jsx-types').JSXOpeningElement} JSXOpeningElement */

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord (value) {
  return typeof value === 'object' && value !== null
}

/**
 * The single untyped→typed boundary: ESLint/espree emit JSX nodes that
 * `@types/estree` does not type, so we narrow `unknown` to our local typedefs.
 * @param {unknown} node
 * @returns {node is JSXElement}
 */
function isJSXElement (node) {
  return isRecord(node) && node['type'] === 'JSXElement'
}

/**
 * @param {unknown} node
 * @returns {node is JSXFragment}
 */
function isJSXFragment (node) {
  return isRecord(node) && node['type'] === 'JSXFragment'
}

/**
 * @param {JSXOpeningElement} openingElement
 * @returns {boolean}
 */
function hasKeyProp (openingElement) {
  return openingElement.attributes.some(attr =>
    attr.type === 'JSXAttribute' &&
    attr.name.type === 'JSXIdentifier' &&
    attr.name.name === 'key'
  )
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow missing `key` props in iterators/collection literals',
      url: 'https://github.com/neostandard/neostandard',
    },
    schema: [{
      type: 'object',
      properties: {
        checkFragmentShorthand: {
          type: 'boolean',
          default: false,
        },
      },
      additionalProperties: false,
    }],
    messages: {
      missingArrayKey: 'Missing "key" prop for element in array',
      missingArrayKeyWithFragment: 'Missing "key" prop for element in array. Shorthand fragment syntax does not support providing keys. Use the React.Fragment syntax instead',
      missingIterKey: 'Missing "key" prop for element in iterator',
      missingIterKeyWithFragment: 'Missing "key" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use the React.Fragment syntax instead',
    },
  },
  create (context) {
    const options = /** @type {{ checkFragmentShorthand?: boolean } | undefined} */ (context.options[0])
    const checkFragmentShorthand = options?.checkFragmentShorthand ?? false
    const sourceCode = context.sourceCode

    /**
     * `React.Children.toArray(...)` / `Children.toArray(...)` add keys
     * automatically, so JSX within such a call should not be reported.
     * @param {import('estree').CallExpression} node
     * @returns {boolean}
     */
    function isChildrenToArray (node) {
      const callee = node.callee
      if (callee.type !== 'MemberExpression') return false
      if (callee.property.type !== 'Identifier' || callee.property.name !== 'toArray') return false
      const obj = callee.object
      if (obj.type === 'Identifier') return obj.name === 'Children'
      return obj.type === 'MemberExpression' &&
        obj.object.type === 'Identifier' && obj.object.name === 'React' &&
        obj.property.type === 'Identifier' && obj.property.name === 'Children'
    }

    /**
     * @param {import('estree').Node} node
     * @returns {boolean}
     */
    function isWithinChildrenToArray (node) {
      return sourceCode.getAncestors(node).some(
        ancestor => ancestor.type === 'CallExpression' && isChildrenToArray(ancestor)
      )
    }

    /**
     * @param {unknown} node
     * @returns {boolean}
     */
    function isKeylessJSXElement (node) {
      return isJSXElement(node) && !hasKeyProp(node.openingElement)
    }

    /**
     * Report `node` if it is a keyless JSX element, or a shorthand fragment
     * when `checkFragmentShorthand` is enabled. `node` stays typed as an ESTree
     * node (so it is reportable) — JSX narrowing is contained in the helpers.
     * @param {import('estree').Node} node
     * @param {'array'|'iter'} kind
     */
    function reportIfKeyless (node, kind) {
      if (isKeylessJSXElement(node)) {
        context.report({ node, messageId: kind === 'array' ? 'missingArrayKey' : 'missingIterKey' })
      } else if (checkFragmentShorthand && isJSXFragment(node)) {
        context.report({ node, messageId: kind === 'array' ? 'missingArrayKeyWithFragment' : 'missingIterKeyWithFragment' })
      }
    }

    /**
     * Collect the argument expressions of `return` statements reachable in a
     * block, recursing only into `if`/nested blocks (parity with the upstream
     * rule — `try`/`switch`/loops are intentionally out of scope).
     * @param {import('estree').Statement} statement
     * @param {import('estree').Expression[]} acc
     */
    function collectReturns (statement, acc) {
      if (statement.type === 'ReturnStatement') {
        if (statement.argument) acc.push(statement.argument)
      } else if (statement.type === 'IfStatement') {
        collectReturns(statement.consequent, acc)
        if (statement.alternate) collectReturns(statement.alternate, acc)
      } else if (statement.type === 'BlockStatement') {
        for (const inner of statement.body) collectReturns(inner, acc)
      }
    }

    /**
     * Unwrap conditional/logical wrappers (both ternary branches, the rendered
     * right side of `&&`/`||`/`??`) and report every keyless JSX leaf.
     * @param {import('estree').Expression} expression
     * @param {'array'|'iter'} kind
     */
    function checkExpression (expression, kind) {
      if (expression.type === 'ConditionalExpression') {
        checkExpression(expression.consequent, kind)
        checkExpression(expression.alternate, kind)
      } else if (expression.type === 'LogicalExpression') {
        checkExpression(expression.right, kind)
      } else {
        reportIfKeyless(expression, kind)
      }
    }

    /**
     * @param {import('estree').BlockStatement | import('estree').Expression} body
     */
    function walkReturnedJSX (body) {
      if (body.type === 'BlockStatement') {
        /** @type {import('estree').Expression[]} */
        const returns = []
        for (const statement of body.body) collectReturns(statement, returns)
        for (const expression of returns) checkExpression(expression, 'iter')
      } else {
        checkExpression(body, 'iter')
      }
    }

    /**
     * Handle `x.map(fn)` / `x.flatMap(fn)` (callback is arg 0) and
     * `Array.from(x, fn)` (callback is arg 1). Optional chaining (`x?.map(fn)`)
     * is covered because espree represents the member access as a plain
     * `MemberExpression`.
     * @param {import('estree').CallExpression} node
     */
    function handleIteratorCall (node) {
      const callee = node.callee
      if (callee.type !== 'MemberExpression' || callee.property.type !== 'Identifier') return

      /** @type {import('estree').Expression | import('estree').SpreadElement | undefined} */
      let callback
      if (callee.property.name === 'map' || callee.property.name === 'flatMap') {
        callback = node.arguments[0]
      } else if (
        callee.property.name === 'from' &&
        callee.object.type === 'Identifier' && callee.object.name === 'Array'
      ) {
        callback = node.arguments[1]
      } else {
        return
      }

      if (!callback) return
      if (callback.type !== 'ArrowFunctionExpression' && callback.type !== 'FunctionExpression') return
      walkReturnedJSX(callback.body)
    }

    return {
      ArrayExpression (node) {
        if (isWithinChildrenToArray(node)) return
        for (const element of node.elements) {
          // Spread elements stay out of scope (like imperatively-built arrays).
          if (element != null && element.type !== 'SpreadElement') {
            checkExpression(element, 'array')
          }
        }
      },
      CallExpression (node) {
        if (isWithinChildrenToArray(node)) return
        handleIteratorCall(node)
      },
    }
  },
}

module.exports = rule

'use strict'

const test = require('node:test')
const { RuleTester } = require('eslint')
const { parser: tsParser } = require('typescript-eslint')

const rule = require('../../lib/plugin/rules/jsx-key')

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
})

// RuleTester.run() throws on the first mismatch, failing this node:test.
test('neostandard/jsx-key', () => {
  ruleTester.run('jsx-key', rule, {
    valid: [
      // arrays / iterators with keys
      'const a = [<li key="a" />, <li key="b" />]',
      'items.map(x => <li key={x.id} />)',
      'items.map(function (x) { return <li key={x.id} /> })',
      'Array.from(items, x => <li key={x} />)',
      'items?.map(x => <li key={x} />)',
      // not a collection of JSX
      'const a = [1, 2, 3]',
      // JSX children are not array elements / iterator returns
      'const tree = <ul><li>a</li><li>b</li></ul>',
      // a keyed React.Fragment element (not shorthand) is fine
      'const a = [<React.Fragment key="a">x</React.Fragment>]',
      // shorthand fragment without checkFragmentShorthand (default) is allowed
      'const a = [<></>, <></>]',
      // React.Children.toArray adds keys → suppressed
      'React.Children.toArray(items.map(x => <li />))',
      'Children.toArray(items.map(x => <li />))',
      // documented out-of-scope gaps (asserted valid on purpose)
      'items.map(renderRow)', // named helper not followed
      'const a = []; a.push(<li />)', // imperative build not tracked
      'items.map(x => { try { return <li /> } catch (e) { return null } })', // try not walked
      // no-crash shapes
      'const a = [, <li key="a" />]', // sparse hole
      'items.map()', // no callback
      'Array.from(items)', // no mapper
      'foo(x => <li />)', // not .map / Array.from
      'notArray.from(items, x => <li />)', // only the literal `Array` identifier is matched
      // out-of-scope array-literal gaps (parity with upstream react/jsx-key — array
      // elements are not unwrapped the way iterator-callback returns are):
      'const a = [x || <li />]', // LogicalExpression element
      'const a = [x ? <li /> : <span />]', // ConditionalExpression element
    ],
    invalid: [
      {
        code: 'const a = [<li />, <li />]',
        errors: [{ messageId: 'missingArrayKey' }, { messageId: 'missingArrayKey' }],
      },
      {
        code: 'const a = [<li key="a" />, <li />]',
        errors: [{ messageId: 'missingArrayKey' }],
      },
      {
        code: 'items.map(x => <li />)',
        errors: [{ messageId: 'missingIterKey' }],
      },
      {
        code: 'items.map(x => { return <li /> })',
        errors: [{ messageId: 'missingIterKey' }],
      },
      {
        code: 'items.map(function (x) { return <li /> })',
        errors: [{ messageId: 'missingIterKey' }],
      },
      {
        code: 'items.map(x => x ? <li /> : <span />)',
        errors: [{ messageId: 'missingIterKey' }, { messageId: 'missingIterKey' }],
      },
      {
        code: 'items.map(x => x && <li />)',
        errors: [{ messageId: 'missingIterKey' }],
      },
      {
        code: 'items.map(x => { if (x) { return <li /> } return <span /> })',
        errors: [{ messageId: 'missingIterKey' }, { messageId: 'missingIterKey' }],
      },
      {
        code: 'Array.from(items, x => <li />)',
        errors: [{ messageId: 'missingIterKey' }],
      },
      {
        // deliberate superset vs upstream (which only matches `.map`)
        code: 'items.flatMap(x => <li />)',
        errors: [{ messageId: 'missingIterKey' }],
      },
      {
        code: 'items?.map(x => <li />)',
        errors: [{ messageId: 'missingIterKey' }],
      },
      {
        code: 'const a = [<></>]',
        options: [{ checkFragmentShorthand: true }],
        errors: [{ messageId: 'missingArrayKeyWithFragment' }],
      },
      {
        code: 'items.map(x => <></>)',
        options: [{ checkFragmentShorthand: true }],
        errors: [{ messageId: 'missingIterKeyWithFragment' }],
      },
      // a spread attribute is NOT treated as an implicit key — parity with
      // upstream react/jsx-key (jsx-ast-utils `hasProp` is spreadStrict by default)
      {
        code: 'const a = [<li {...x} />]',
        errors: [{ messageId: 'missingArrayKey' }],
      },
      {
        code: 'items.map(x => <li {...x} />)',
        errors: [{ messageId: 'missingIterKey' }],
      },
      // nested ternary in an iterator callback: every leaf is checked
      {
        code: 'items.map(x => x ? (y ? <li /> : <li />) : <li />)',
        errors: [
          { messageId: 'missingIterKey' },
          { messageId: 'missingIterKey' },
          { messageId: 'missingIterKey' },
        ],
      },
    ],
  })
})

// The rule reaches .tsx only because lib/main.js scopes the jsx layer to include
// `**/*.tsx`; the TS block from typescriptify() does NOT carry the rule. Run the
// matrix through the typescript-eslint parser to guard that .tsx wiring (the rule
// is parser-agnostic — JSXElement/JSXFragment nodes are identical).
const ruleTesterTsx = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
})

test('neostandard/jsx-key — typescript-eslint parser (.tsx wiring)', () => {
  ruleTesterTsx.run('jsx-key (tsx)', rule, {
    valid: [
      'items.map(x => <li key={x.id} />)',
    ],
    invalid: [
      {
        code: 'items.map(x => <li />)',
        errors: [{ messageId: 'missingIterKey' }],
      },
      {
        code: 'const a = [<li />, <li />]',
        errors: [{ messageId: 'missingArrayKey' }, { messageId: 'missingArrayKey' }],
      },
    ],
  })
})

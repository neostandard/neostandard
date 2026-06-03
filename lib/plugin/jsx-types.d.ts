// Minimal JSX AST node typedefs for the `neostandard/jsx-key` rule.
//
// `@types/estree` (which ESLint's `Rule.Node` bottoms out at) does not include
// JSX nodes — JSX is a non-ECMAScript syntax extension, so it is deliberately
// out of the ESTree spec. Rather than add a dependency (`@types/estree-jsx` or
// `@typescript-eslint/types`), we hand-declare only the handful of node shapes
// this rule actually reads. To grow the surface later, this file can be swapped
// for `@types/estree-jsx` in one place. Named `*-types.d.ts` so it survives the
// `clean:declarations-lib` script and ships via the `lib/**/*.d.ts` files entry.

export interface JSXIdentifier {
  type: 'JSXIdentifier'
  name: string
}

export interface JSXNamespacedName {
  type: 'JSXNamespacedName'
  namespace: JSXIdentifier
  name: JSXIdentifier
}

export interface JSXAttribute {
  type: 'JSXAttribute'
  name: JSXIdentifier | JSXNamespacedName
}

export interface JSXSpreadAttribute {
  type: 'JSXSpreadAttribute'
}

export interface JSXOpeningElement {
  type: 'JSXOpeningElement'
  attributes: Array<JSXAttribute | JSXSpreadAttribute>
}

export interface JSXElement {
  type: 'JSXElement'
  openingElement: JSXOpeningElement
}

export interface JSXFragment {
  type: 'JSXFragment'
}

export type JsxNode = JSXElement | JSXFragment

import { createRequire, stripTypeScriptTypes } from 'node:module'

const require = createRequire(import.meta.url)
const espree = /** @type {{ parse: (code: string, options: object) => import('estree').Program }} */ (require('espree'))

/**
 * @typedef {import('eslint').Linter.ParserOptions} ParserOptions
 */

/** @type {import('eslint').Linter.Parser} */
export const nodeStripParser = {
  meta: {
    name: 'neostandard/node-strip-parser',
  },
  /**
   * @param {string} code
   * @param {ParserOptions} options
   * @returns {{ ast: import('estree').Program }}
   */
  parseForESLint (code, options) {
    return { ast: espree.parse(stripTypeScriptTypes(code), options) }
  },
}

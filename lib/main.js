'use strict'

const { config } = require('typescript-eslint')

const base = require('./configs/base.js')
const {
  modernization,
  modernizationStyles,
} = require('./configs/modernization.js')
const semiConfig = require('./configs/semi.js')
const style = require('./configs/style.js')
const { typescriptify } = require('./ts.js')

// TODO: Ensure both commonjs and esm are evaluated properly: https://github.com/eslint/eslint/discussions/18300#discussioncomment-9062217 And how does it interact with TS?

/**
 * @typedef NeostandardOptions
 * @property {string[]|undefined} [globals]
 * @property {string[]|undefined} [ignores]
 * @property {boolean|undefined} [noStyle] - skip style rules
 * @property {boolean|undefined} [noTs] - skip TypeScript checks
 * @property {boolean|undefined} [semi] - enforce rather than forbid semicolons
 */

/**
 * @param {NeostandardOptions} [options]
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
function neostandard (options) {
  const {
    globals,
    ignores,
    noStyle = false,
    noTs = false,
    semi = false,
  } = options || {}

  const styleConfigs = noStyle
    ? []
    : [
        style,
        modernizationStyles,
        ...(semi ? [semiConfig] : []),
      ]

  const resolved = config({
    ...globals && {
      languageOptions: {
        globals: Object.fromEntries(globals.map(global => [global, true])),
      },
    },
    ...ignores && { ignores },
    extends: [
      base,
      modernization,
      ...styleConfigs,
    ],
  })

  return [
    ...resolved,
    ...(noTs ? [] : typescriptify(resolved, { files: ['**/*.ts'] })),
  ]
}

module.exports = {
  neostandard,
}

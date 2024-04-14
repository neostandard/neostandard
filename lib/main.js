'use strict'

const base = require('./configs/base.js')
const modernization = require('./configs/modernization.js')
const semiConfig = require('./configs/semi.js')
const { typescriptify } = require('./ts.js')

const core = [
  base,
  modernization,
]

// FIXME: Separate style rules from non-style rules and use eslint-stylistic for those + make them optional (to work well with Prettier)
// TODO: Ensure both commonjs and esm are evaluated properly: https://github.com/eslint/eslint/discussions/18300#discussioncomment-9062217 And how does it interact with TS?

/**
 * @typedef NeostandardOptions
 * @property {boolean|undefined} [semi] - enforce rather than forbid semicolons
 */

/**
 * @param {NeostandardOptions} [options]
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
function neostandard (options) {
  const {
    semi = false,
  } = options || {}

  /** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
  const config = [
    ...core,
    ...(semi ? [semiConfig] : []),
  ]

  return [
    ...config,
    ...typescriptify(config, { files: ['**/*.ts'] }),
  ]
}

module.exports = {
  neostandard,
}

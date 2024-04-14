'use strict'

const base = require('./configs/base.js')
const modernization = require('./configs/modernization.js')
const semiConfig = require('./configs/semi.js')
const { typescriptify } = require('./ts.js')

const core = [
  base,
  modernization,
]

// FIXME: Add a CLI
// FIXME: Separate style rules from non-style rules and use eslint-stylistic for those + make them optional (to work well with Prettier)
// FIXME: Generate files for publishing for every possible combination of options. Do so before type generation. This to enable to work like "eslint -c neostandard/semi-typechecking" and to enable the CLI to function as a wrapper around ESLint CLI
// TODO: Ensure both commonjs and esm are evaluated properly: https://github.com/eslint/eslint/discussions/18300#discussioncomment-9062217 And how does it interact with TS?

/**
 * @typedef NeostandardOptions
 * @property {boolean|undefined} [noTs] - deactivates all TypeScript based linting
 * @property {string[] | string | boolean | null | undefined} [project] - same as {@link https://typescript-eslint.io/packages/parser/#project}, useful together with `typeChecking`
 * @property {boolean|undefined} [semi] - enforces rather than bannes semicolons
 * @property {string | undefined} [tsconfigRootDir] - same as {@link https://typescript-eslint.io/packages/parser/#tsconfigrootdir}, useful together with `typeChecking`
 * @property {boolean|undefined} [tsForJs] - activates TypeScript based linting for JavaScript files as well
 * @property {boolean|undefined} [typeChecking] - activates type checking rules
 */

/**
 * @param {NeostandardOptions} options
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
function neostandard (options) {
  const {
    noTs = false,
    semi = false,
    tsForJs = false,
    typeChecking = false,
  } = options || {}

  /** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
  const config = [
    ...core,
    ...(semi ? [semiConfig] : []),
  ]

  if (noTs) {
    if (tsForJs) throw new Error('Can not use "tsForJs" with "noTs"')
    if (typeChecking) throw new Error('Can not use "typeChecking" with "noTs"')

    return config
  }

  return tsForJs
    ? typescriptify(config, { typeChecking })
    : [
        ...config,
        ...typescriptify(config, { files: ['**/*.ts'], typeChecking }),
      ]
}

module.exports = {
  neostandard,
}

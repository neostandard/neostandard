import { base } from './configs/base.js'
import { modernization } from './configs/modernization.js'
import { semiConfig } from './configs/semi.js'

import { typescriptify } from './ts.js'

export const core = /** @type {const} */ ([
  base,
  modernization,
])

/** @typedef {'noTs' | 'semi' | 'tsForJs' | 'typeChecking'} NeostandardChoices */

export const availableChoices = /** @satisfies {NeostandardChoices[]} */(/** @type {const} */([
  'noTs',
  'semi',
  'tsForJs',
  'typeChecking',
]))

/** @type {Partial<Record<NeostandardChoices, NeostandardChoices[]>>} */
export const incompatibleChoices = {
  noTs: ['tsForJs', 'typeChecking'],
}

// FIXME: Add a CLI
// FIXME: Separate style rules from non-style rules and use eslint-stylistic for those + make them optional (to work well with Prettier)
// FIXME: Generate files for publishing for every possible combination of options. Do so before type generation. This to enable to work like "eslint -c neostandard/semi-typechecking" and to enable the CLI to function as a wrapper around ESLint CLI
// TODO: Ensure both commonjs and esm are evaluated properly: https://github.com/eslint/eslint/discussions/18300#discussioncomment-9062217 And how does it interact with TS?

/**
 * @typedef NeostandardOptions
 * @property {boolean|undefined} [noTs] - deactivates all TypeScript based linting
 * @property {string[] | string | boolean | null | undefined} [project] - same as {@link https://typescript-eslint.io/packages/parser/#project}, useful together with `typeChecking`
 * @property {boolean|undefined} [semi] - enforces rather than bans semicolons
 * @property {string | undefined} [tsconfigRootDir] - same as {@link https://typescript-eslint.io/packages/parser/#tsconfigrootdir}, useful together with `typeChecking`
 * @property {boolean|undefined} [tsForJs] - activates TypeScript based linting for JavaScript files as well
 * @property {boolean|undefined} [typeChecking] - activates type checking rules
 */

/**
 * @param {NeostandardOptions} options
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
export function neostandard (options) {
  const {
    noTs = false,
    semi = false,
    tsForJs = false,
    typeChecking = false,
    project,
    tsconfigRootDir,
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

  const typescriptOptions = {
    project,
    tsconfigRootDir,
    typeChecking,
  }
  return tsForJs
    ? typescriptify(config, typescriptOptions)
    : [
        ...config,
        ...typescriptify(config, { files: ['**/*.ts'], ...typescriptOptions }),
      ]
}

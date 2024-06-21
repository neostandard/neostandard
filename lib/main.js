'use strict'

const globals = require('globals')

const base = require('./configs/base')
const {
  modernization,
  modernizationStyles,
} = require('./configs/modernization')
const semiConfig = require('./configs/semi')
const style = require('./configs/style')

const { typescriptify } = require('./ts')
const { isNonEmpty } = require('./utils')

/**
 * @typedef NeostandardOptions
 * @property {Array<keyof import('globals')>|undefined} [env] - resolves globals for the provided environment names using the {@link https://www.npmjs.com/package/globals|globals module}
 * @property {string[]|undefined} [files] - file patterns, in minimatch syntax, the config applies to, see {@link https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores|ESLint Docs}
 * @property {string[]|undefined} [filesTs] - additional file patterns, in minimatch syntax, that TS rules will to apply to
 * @property {import('@typescript-eslint/utils/ts-eslint').FlatConfig.GlobalsConfig|string[]|undefined} [globals] - the base globals that should be considered available, see {@link https://eslint.org/docs/latest/use/configure/language-options#specifying-globals|ESLint Docs}
 * @property {string[]|undefined} [ignores] - patterns in minimatch syntax for files to ignore
 * @property {boolean|undefined} [noStyle] - when set, skips style rules
 * @property {boolean|undefined} [semi] - when set, enforces rather than forbids semicolons
 * @property {boolean|undefined} [ts] - when set, enables TypeScript checks
 */

/**
 * @param {NeostandardOptions} [options]
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
function neostandard (options) {
  const {
    env,
    files,
    filesTs,
    globals: rawGlobals,
    ignores,
    noStyle = false,
    ts = false,
    semi = false,
  } = options || {}

  if (filesTs && !ts) {
    throw new Error('"filesTs" is only usable with the "ts" option')
  }

  /** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.GlobalsConfig} */
  const resolvedGlobals = Array.isArray(rawGlobals)
    ? Object.fromEntries(rawGlobals.map(global => [global, true]))
    : { ...rawGlobals }

  for (const key of env || []) {
    if (!globals[key]) {
      throw new Error(`Invalid env definition: ${env}`)
    }
    const envGlobals = globals[key]
    for (const [key, value] of Object.entries(envGlobals)) {
      resolvedGlobals[key] = resolvedGlobals[key] || value
    }
  }

  const styleConfigs = noStyle
    ? []
    : [
        style,
        modernizationStyles,
        ...(semi ? [semiConfig] : []),
      ]

  const jsConfigs = [
    base,
    modernization,
    ...styleConfigs,
  ]

  /** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */
  const meta = {
    ...isNonEmpty(resolvedGlobals) && { languageOptions: { globals: resolvedGlobals } },
    ...files && { files },
  }

  return [
    // To make it a global ignore, "ignores" has to be the lone key of the config: https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
    ...ignores ? [{ ignores }] : [],
    ...isNonEmpty(meta) ? [{ name: 'neostandard/meta', ...meta }] : [],
    ...jsConfigs,
    ...ts
      ? [typescriptify(jsConfigs, {
          files: ['**/*.ts', ...filesTs || []],
          ignores,
          name: 'neostandard/ts',
        })]
      : [],
  ]
}

module.exports = {
  neostandard,
}

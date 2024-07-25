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
const { reactify } = require('./react')
const { isNonEmpty } = require('./utils')

/**
 * @typedef NeostandardOptions
 * @property {Array<keyof import('globals')>|undefined} [env] - resolves globals for the provided environment names using the {@link https://www.npmjs.com/package/globals|globals module}
 * @property {string[]|undefined} [files] - file patterns, in minimatch syntax, the config applies to, see {@link https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores|ESLint Docs}
 * @property {string[]|undefined} [filesTs] - additional file patterns, in minimatch syntax, that TS rules will to apply to
 * @property {import('eslint').ESLint.Globals|string[]|undefined} [globals] - the base globals that should be considered available, see {@link https://eslint.org/docs/latest/use/configure/language-options#specifying-globals|ESLint Docs}
 * @property {string[]|undefined} [ignores] - patterns in minimatch syntax for files to ignore
 * @property {boolean|undefined} [noStyle] - when set, skips style rules
 * @property {boolean|undefined} [semi] - when set, enforces rather than forbids semicolons
 * @property {boolean|undefined} [ts] - when set, enables TypeScript checks
 * @property {import('./react').ReactConfig|undefined} [react] = when set, enables React rules from selected configuration, see {@link https://www.npmjs.com/package/eslint-plugin-react|React plugin Docs}
 */

/**
 * @param {NeostandardOptions} [options]
 * @returns {import('eslint').Linter.FlatConfig[]}
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
    react = 'recommended',
  } = options || {}

  if (filesTs && !ts) {
    throw new Error('"filesTs" is only usable with the "ts" option')
  }

  /** @type {import('eslint').ESLint.Globals} */
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

  /** @satisfies {import('eslint').Linter.FlatConfig} */
  const meta = {
    ...isNonEmpty(resolvedGlobals) && { languageOptions: { globals: resolvedGlobals } },
    ...files && { files },
  }

  const tsConfig = typescriptify(jsConfigs, {
    files: ['**/*.ts', ...filesTs || []],
    ignores,
    name: 'neostandard/ts',
  })

  return [
    // To make it a global ignore, "ignores" has to be the lone key of the config: https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
    ...ignores ? [{ ignores }] : [],
    ...isNonEmpty(meta) ? [{ name: 'neostandard/meta', ...meta }] : [],
    ...jsConfigs,
    ...ts
      ? [tsConfig]
      : [],
    ...react
      ? reactify({
        ignores,
        tsConfig: ts ? tsConfig : undefined,
        reactConfig: react,
      })
      : [],
  ]
}

module.exports = {
  neostandard,
}

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

const DEFAULT_FILES = [
  '**/*.js',
  '**/*.cjs',
  '**/*.mjs',
]

const DEFAULT_TS_FILES = [
  '**/*.ts',
]

/** @typedef {NonNullable<Parameters<neostandard>[0]>} NeostandardOptions */

/**
 * @param {object} [options]
 * @param {Array<keyof import('globals')>|undefined} [options.env] - resolves globals for the provided environment names using the {@link https://www.npmjs.com/package/globals|globals module}
 * @param {string[]|undefined} [options.files] - file patterns, in minimatch syntax, the config applies to, see {@link https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores|ESLint Docs}
 * @param {string[]|undefined} [options.filesTs] - additional file patterns, in minimatch syntax, that TS rules will to apply to
 * @param {import('@typescript-eslint/utils/ts-eslint').FlatConfig.GlobalsConfig|string[]|undefined} [options.globals] - the base globals that should be considered available, see {@link https://eslint.org/docs/latest/use/configure/language-options#specifying-globals|ESLint Docs}
 * @param {string[]|undefined} [options.ignores] - patterns in minimatch syntax for files to ignore
 * @param {boolean|undefined} [options.noStyle] - when set, skips style rules
 * @param {boolean|undefined} [options.semi] - when set, enforces rather than forbids semicolons
 * @param {boolean|undefined} [options.ts] - when set, enables TypeScript checks
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
    // We need to add DEFAULT_FILES here as else the TS-rules would limit all config to TS-files
    ...(files || ts) && { files: [...(files || DEFAULT_FILES), ...(filesTs || DEFAULT_TS_FILES)] },
  }

  return [
    // If ignores is the lone key, then that amounts to being global ignores: https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
    ...ignores ? [{ ignores }] : [],
    ...isNonEmpty(meta) ? [{ name: 'neostandard/meta', ...meta }] : [],
    ...jsConfigs,
    ...ts
      ? [typescriptify(jsConfigs, {
          files: DEFAULT_TS_FILES,
          ignores,
          name: 'neostandard/ts',
        })]
      : [],
  ]
}

module.exports = {
  neostandard,
}

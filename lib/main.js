'use strict'

const globals = require('globals')

const base = require('./configs/base')
const {
  modernization,
  modernizationStyles,
} = require('./configs/modernization')
const semiConfig = require('./configs/semi')
const style = require('./configs/style')
const { configExtend } = require('./config-extend')
const { typescriptify } = require('./ts')

// TODO: Ensure both commonjs and esm are evaluated properly: https://github.com/eslint/eslint/discussions/18300#discussioncomment-9062217 And how does it interact with TS?

const DEFAULT_FILES = [
  '**/*.js',
  '**/*.cjs',
  '**/*.mjs',
]

const DEFAULT_TS_FILES = [
  '**/*.ts',
]

/**
 * @typedef NeostandardOptions
 * @property {Array<keyof import('globals')>|undefined} [env]
 * @property {import('@typescript-eslint/utils/ts-eslint').FlatConfig.GlobalsConfig|string[]|undefined} [globals]
 * @property {string[]|undefined} [ignores]
 * @property {boolean|undefined} [noStyle] - skip style rules
 * @property {boolean|undefined} [semi] - enforce rather than forbid semicolons
 * @property {boolean|undefined} [ts] - enable TypeScript checks
 */

/**
 * @param {NeostandardOptions} [options]
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
function neostandard (options) {
  const {
    env,
    globals: rawGlobals,
    ignores,
    noStyle = false,
    ts = false,
    semi = false,
  } = options || {}

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

  const configs = configExtend(jsConfigs, {
    files: ts ? [...DEFAULT_FILES, ...DEFAULT_TS_FILES] : DEFAULT_FILES,
    globals: Object.keys(resolvedGlobals).length ? resolvedGlobals : undefined,
    ignores,
  })

  if (ts) {
    configs.push(typescriptify(configs, {
      files: DEFAULT_TS_FILES,
      ignores,
      name: 'Neostandard TypeScript Adaptions',
    }))
  }

  return configs
}

module.exports = {
  neostandard,
}

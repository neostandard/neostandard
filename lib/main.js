'use strict'

const { config } = require('typescript-eslint')
const globals = require('globals')

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
 * @property {Array<keyof import('globals')>|undefined} [env]
 * @property {import('@typescript-eslint/utils/ts-eslint').FlatConfig.GlobalsConfig|string[]|undefined} [globals]
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
    env,
    globals: rawGlobals,
    ignores,
    noStyle = false,
    noTs = false,
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

  const resolved = config({
    ...resolvedGlobals && {
      languageOptions: {
        globals: resolvedGlobals,
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

'use strict'

const { plugin } = require('typescript-eslint')
// @ts-ignore
const reactPlugin = require('eslint-plugin-react')

/**
 * @typedef { 'recommended' | 'all' } ReactConfig
 */

/**
 * @typedef ReactifyOptions
 * @property {string[]|undefined} [ignores]
 * @property {string} [name]
 * @property {import('eslint').Linter.FlatConfig|undefined} tsConfig
 * @property {ReactConfig|undefined} [reactConfig]
 * @property {boolean} [requireReactImport]
 */

/**
 * @param {ReactifyOptions} [options]
 * @returns {Array<import('eslint').Linter.FlatConfig>}
 */
function reactify (options) {
  const configName = options?.reactConfig || 'recommended'
  const { ignores, name, tsConfig, requireReactImport } = options || {}

  const reactConfig = reactPlugin.configs.flat[configName]
  if (reactConfig == null || typeof reactConfig !== 'object') {
    throw Error('Unexpected type of React ESLint config from "eslint-plugin-react"')
  }

  const jsxRuntimeConfig = !requireReactImport ? reactPlugin.configs.flat['jsx-runtime'] : {}
  if (jsxRuntimeConfig == null || typeof jsxRuntimeConfig !== 'object') {
    throw Error('Unexpected type of React ESLint config from "eslint-plugin-react"')
  }

  const settings = {
    react: {
      version: 'detect',
    },
  }

  const reactConfigs = [
    {
      files: ['**/*.{jsx,cjsx,mjsx}'],
      ...ignores && { ignores: ignores || [] },
      name: name || `react/${configName}${!requireReactImport ? '+jsx-runtime' : ''}`,
      ...{
        ...reactConfig,
        ...jsxRuntimeConfig,
        rules: {
          // ...reactConfig.rules,
          ...jsxRuntimeConfig.rules,
        },
        settings,
      },
    },
    ...tsConfig
      ? [{
          files: ['**/*.{tsx,ctsx,mtsx}'],
          ...ignores && { ignores: ignores || [] },
          name: name || `react-ts/${configName}${!requireReactImport ? '+jsx-runtime' : ''}`,
          ...{
            ...reactConfig,
            rules: {
              ...tsConfig.rules,
              // ...reactConfig.rules,
              ...jsxRuntimeConfig.rules,
            },
            plugins: {
              ...reactConfig.plugins,
              '@typescript-eslint': plugin,
            },
            languageOptions: {
              ...tsConfig.languageOptions,
              parserOptions: {
                ...tsConfig.languageOptions?.parserOptions,
                ...reactConfig.languageOptions.parserOptions,
                ...jsxRuntimeConfig.languageOptions?.parserOptions,
              },
            },
            settings,
          },
        }]
      : [],
  ]

  return reactConfigs
}

module.exports = {
  reactify,
}

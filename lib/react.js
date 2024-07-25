'use strict'

const { plugin } = require('typescript-eslint')
// @ts-ignore
const reactPlugin = require('eslint-plugin-react')

/**
 * @typedef { 'recommended' | 'all' | 'jsx-runtime' } ReactConfig
 */

/**
 * @typedef ReactifyOptions
 * @property {string[]|undefined} [ignores]
 * @property {string} [name]
 * @property {import('eslint').Linter.FlatConfig|undefined} tsConfig
 * @property {ReactConfig|undefined} [reactConfig]
 */

/**
 * @param {ReactifyOptions} [options]
 * @returns {Array<import('eslint').Linter.FlatConfig>}
 */
function reactify (options) {
  const configName = options?.reactConfig || 'recommended'

  const reactConfig = reactPlugin.configs.flat[configName]
  if (options?.reactConfig == null) {
    reactConfig.rules = {}
  }

  if (reactConfig == null || typeof reactConfig !== 'object') {
    throw Error('Unexpected type of React ESLint config from "eslint-plugin-react"')
  }

  const { ignores, name, tsConfig } = options || {}
  const reactSettings = {
    version: 'detect',
  }

  const reactConfigs = [
    {
      files: ['**/*.{jsx,cjsx,mjsx}'],
      ignores,
      name: name || `react/${configName}`,
      ...{
        ...reactConfig,
        settings: {
          react: {
            ...reactSettings,
          },
        },
      },
    },
    ...tsConfig
      ? [{
          files: ['**/*.{tsx,ctsx,mtsx}'],
          ignores,
          name: `${name || `react/${configName}`}-ts`,
          ...{
            ...reactConfig,
            rules: {
              ...tsConfig.rules,
              ...reactConfig.rules,
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
              },
            },
            settings: {
              react: {
                ...reactSettings,
              },
            },
          },
        }]
      : [],
  ]

  return reactConfigs
}

module.exports = {
  reactify,
}

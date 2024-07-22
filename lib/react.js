'use strict'

const { plugin } = require('typescript-eslint')
// @ts-ignore
const reactPlugin = require('eslint-plugin-react')

/**
 * @typedef { 'recommended' | 'all' | 'jsx-runtime' } ReactConfigName
 */

/**
 * @typedef ReactConfig
 * @property {ReactConfigName} name
 * @property {ReactSettings} settings
 */

/**
 * @typedef ReactSettings
 * @property {string} [createClass]
 * @property {string} [pragma]
 * @property {string} [fragment]
 * @property {string} [version]
 * @property {string} [defaultVersion]
 * @property {string} [flowVersion]
 */

/**
 * @typedef ReactifyOptions
 * @property {string[]|undefined} [ignores]
 * @property {string} [name]
 * @property {import('eslint').Linter.FlatConfig|undefined} tsConfig
 * @property {ReactSettings} [settings]
 */

/**
 * @param {ReactConfigName|ReactConfig|undefined} config
 * @param {ReactifyOptions} options
 * @returns {Array<import('eslint').Linter.FlatConfig>}
 */
function reactify (config, options) {
  if (!config) {
    return []
  }

  const configName = typeof config === 'object' ? config.name : config

  if (!configName) {
    return []
  }

  const reactConfig = reactPlugin.configs.flat[configName]

  if (reactConfig == null || typeof reactConfig !== 'object') {
    throw Error('Unexpected type of React ESLint config from "eslint-plugin-react"')
  }

  const { ignores, name, tsConfig } = options
  const settings = typeof config === 'object'
    ? config.settings
    : {
        version: 'detect',
      }

  const reactConfigs = [
    {
      files: ['**/*.{jsx,mjsx}'],
      ignores,
      name: name || `react/${configName}`,
      ...reactConfig,
    },
    ...tsConfig
      ? [{
          files: ['**/*.{tsx,mtsx}'],
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
                ...settings,
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

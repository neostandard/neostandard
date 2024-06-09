'use strict'

const tsEslintPlugin = require('@typescript-eslint/eslint-plugin')
const { parser } = require('typescript-eslint')

const style = require('./configs/style.js')
const tsRedundant = require('./configs/ts-redundant')

/**
 * @typedef TypescriptifyOptions
 * @property {import('typescript-eslint').ConfigWithExtends['files']} [files]
 * @property {string[]|undefined} [ignores]
 * @property {string} [name]
 * @property {string[] | string | boolean | null} [project]
 * @property {string} [tsconfigRootDir]
 * @property {boolean} [typeChecking]
 */

/**
 * @param {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} configs
 * @param {TypescriptifyOptions} options
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config}
 */
function typescriptify (configs, options) {
  const {
    files,
    ignores,
    name,
    project,
    tsconfigRootDir,
    typeChecking = false,
  } = options || {}

  /** @type {Record<string, 'off'>} */
  const deactivatedRules = {}
  /** @type {Record<string, import('@typescript-eslint/utils/ts-eslint').FlatConfig.RuleEntry>} */
  const replacementRules = {}

  for (const config of configs) {
    for (const ruleId in tsRedundant) {
      if (config.rules?.[ruleId]) {
        deactivatedRules[ruleId] = 'off'
      }
    }
    // TODO: Readd when https://github.com/eslint-stylistic/eslint-stylistic/issues/414 is fixed
    for (const ruleId in style.rules) {
      if (config.rules?.[ruleId]) {
        deactivatedRules[ruleId] = 'off'
      }
    }
    for (const [ruleId, ruleDefinition] of Object.entries(tsEslintPlugin.rules)) {
      const currentRule = config.rules?.[ruleId]

      if (currentRule === undefined) {
        continue
      }

      if (!ruleDefinition.meta.docs?.extendsBaseRule) {
        continue
      }
      if (ruleDefinition.meta.docs.requiresTypeChecking && !typeChecking) {
        continue
      }

      deactivatedRules[ruleId] = 'off'

      if (ruleId !== 'dot-notation') {
        replacementRules['@typescript-eslint/' + ruleId] = currentRule
      }
    }
  }

  const result = /** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */ ({
    ...name && { name },
    ...files && { files },
    ...ignores && { ignores },
    languageOptions: {
      parser,
      parserOptions: {
        project: project === undefined ? typeChecking : project,
        ...tsconfigRootDir ? { tsconfigRootDir } : undefined,
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      ...deactivatedRules,
      ...replacementRules,
    },
  })

  return result
}

module.exports = {
  typescriptify,
}

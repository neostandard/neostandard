'use strict'

const tsEslintPlugin = require('@typescript-eslint/eslint-plugin')
const { config, parser } = require('typescript-eslint')

/**
 * @typedef TypescriptifyOptions
 * @property {import('typescript-eslint').ConfigWithExtends['files']} [files]
 * @property {string[] | string | boolean | null} [project]
 * @property {string} [tsconfigRootDir]
 * @property {boolean} [typeChecking]
 */

/**
 * @param {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} configs
 * @param {TypescriptifyOptions} options
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
function typescriptify (configs, options) {
  const {
    files = ['**/*.{js,mjs,cjs,ts}'],
    project,
    tsconfigRootDir,
    typeChecking = false,
  } = options || {}

  /** @type {Record<string, 'off'>} */
  const deactivatedRules = {}
  /** @type {Record<string, import('@typescript-eslint/utils/ts-eslint').FlatConfig.RuleEntry>} */
  const replacementRules = {}

  for (const config of configs) {
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

  return config({
    files,
    extends: configs,
    ...result,
  })
}

module.exports = {
  typescriptify,
}

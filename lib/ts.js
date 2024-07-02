'use strict'

const { parser, plugin } = require('typescript-eslint')

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
 * @param {import('eslint').Linter.FlatConfig[]} configs
 * @param {TypescriptifyOptions} options
 * @returns {import('eslint').Linter.FlatConfig}
 */
function typescriptify (configs, options) {
  if (typeof plugin.rules !== 'object') {
    throw Error('Unexpected type of "plugin" export from "typescript-eslint"')
  }

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
  /** @type {Record<string, import('eslint').Linter.RuleEntry>} */
  const replacementRules = {}

  for (const config of configs) {
    for (const ruleId in tsRedundant) {
      if (config.rules?.[ruleId]) {
        deactivatedRules[ruleId] = 'off'
      }
    }
    for (const [ruleId, ruleDefinition] of Object.entries(plugin.rules)) {
      const currentRule = config.rules?.[ruleId]

      if (currentRule === undefined) {
        continue
      }

      if (!('meta' in ruleDefinition) || !ruleDefinition.meta || !('docs' in ruleDefinition.meta) || !ruleDefinition.meta.docs || typeof ruleDefinition.meta.docs !== 'object') {
        continue
      }

      const docs = ruleDefinition.meta.docs

      if (!('extendsBaseRule' in docs) || !docs.extendsBaseRule) {
        continue
      }
      if ('requiresTypeChecking' in docs && docs.requiresTypeChecking && !typeChecking) {
        continue
      }

      deactivatedRules[ruleId] = 'off'

      if (ruleId !== 'dot-notation') {
        replacementRules['@typescript-eslint/' + ruleId] = currentRule
      }
    }
  }

  const result = /** @satisfies {import('eslint').Linter.FlatConfig } */ ({
    ...name && { name },
    ...files && { files },
    ...ignores && { ignores },
    languageOptions: {
      // @ts-ignore - FlatConfigParserModule type mismatch between typescript-eslint and ESLint
      parser,
      parserOptions: {
        project: project === undefined ? typeChecking : project,
        ...tsconfigRootDir ? { tsconfigRootDir } : undefined,
      },
    },
    plugins: {
      // @ts-ignore - Plugin type mismatch between typescript-eslint and ESLint
      '@typescript-eslint': plugin,
    },
    rules: {
      ...deactivatedRules,
      ...replacementRules,
    },
  })

  // @ts-ignore - FlatConfig type mismatch between typescript-eslint and ESLint
  return result
}

module.exports = {
  typescriptify,
}

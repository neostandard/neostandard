import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import tseslint from 'typescript-eslint'

/**
 * @param {Array<import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config & { rules: import('@typescript-eslint/utils/ts-eslint').FlatConfig.Rules }>} configs
 * @param {import('@typescript-eslint/utils/ts-eslint').FlatConfig.FileSpec[]} files
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
export function typescriptify (configs, files = ['**/*.{js,mjs,cjs,ts}']) {
  /** @type {Record<string, 'off'>} */
  const deactivatedRules = {}
  /** @type {Record<string, import('@typescript-eslint/utils/ts-eslint').FlatConfig.RuleEntry>} */
  const replacementRules = {}

  for (const config of configs) {
    for (const [ruleId, ruleDefinition] of Object.entries(tsEslintPlugin.rules)) {
      if (!ruleDefinition.meta.docs?.extendsBaseRule) {
        continue
      }

      const currentRule = config.rules[ruleId]

      if (currentRule === undefined) {
        continue
      }

      deactivatedRules[ruleId] = 'off'
      if (ruleId !== 'dot-notation') {
        replacementRules['@typescript-eslint/' + ruleId] = currentRule
      }
    }
  }

  const result = /** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */ ({
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      ...deactivatedRules,
      ...replacementRules,
    },
  })

  return tseslint.config({
    files,
    extends: configs,
    ...result,
  })
}

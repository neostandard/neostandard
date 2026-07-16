import { parser, plugin } from 'typescript-eslint'

import tsRedundant from './configs/ts-redundant.js'
import { isRecord } from './utils.js'

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
 * @param {import('eslint').Linter.Config[]} configs
 * @param {TypescriptifyOptions} options
 * @returns {import('eslint').Linter.Config}
 */
function typescriptify (configs, options) {
  // @ts-expect-error - Plugin type mismatch between typescript-eslint and ESLint
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
  /** @type {import('eslint').Linter.RulesRecord} */
  const replacementRules = {}

  for (const config of configs) {
    for (const ruleId in tsRedundant) {
      if (config.rules?.[ruleId]) {
        deactivatedRules[ruleId] = 'off'
      }
    }
    // @ts-expect-error - Plugin type mismatch between typescript-eslint and ESLint
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

  // @stylistic 5 (eslint-stylistic #805) extended operator-linebreak to TS type
  // operators. Union `|` / intersection `&` placement was never a declared part
  // of standard style (leading pipes are the dominant idiom in hand-written
  // d.ts files), so those tokens are ignored on TS files while inheriting
  // whatever the JS layers declare for everything else. The `?`/`:` of TS
  // conditional types deliberately stay governed by the declared ternary
  // preferences — that IS standard style applied to an analogous construct.
  //
  // Known limitation: overrides are keyed by token, not node type, so the `|`/`&`
  // ignores also stop checking multiline JS *bitwise* expressions within TS files
  // (rare; JS files are unaffected). If eslint-stylistic ever gains node-type-
  // scoped overrides for the #805 operators, narrow these to the type operators.
  /** @type {import('eslint').Linter.RulesRecord} */
  const tsStyleAdaptions = {}
  for (const config of configs) {
    const operatorLinebreak = config.rules?.['@stylistic/operator-linebreak']
    if (Array.isArray(operatorLinebreak) && operatorLinebreak.length >= 2) {
      // isRecord narrows a stable variable, not an element/index access, so bind
      // each to a local first before narrowing it.
      const rawOptions = operatorLinebreak[2]
      /** @type {Record<string, unknown>} */
      const options = isRecord(rawOptions) ? rawOptions : {}
      const rawOverrides = options['overrides']
      /** @type {Record<string, unknown>} */
      const overrides = isRecord(rawOverrides) ? rawOverrides : {}
      tsStyleAdaptions['@stylistic/operator-linebreak'] = /** @type {import('eslint').Linter.RuleEntry} */ ([
        operatorLinebreak[0],
        operatorLinebreak[1],
        { ...options, overrides: { ...overrides, '|': 'ignore', '&': 'ignore' } },
      ])
    }
  }

  const result = /** @satisfies {import('eslint').Linter.Config } */ ({
    ...name && { name },
    ...files && { files },
    ...ignores && { ignores },
    languageOptions: {
      // @ts-ignore - Parser type mismatch between typescript-eslint and ESLint
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
      ...tsStyleAdaptions,
    },
  })

  // @ts-ignore - Config type mismatch between typescript-eslint and ESLint
  return result
}

export {
  typescriptify,
}

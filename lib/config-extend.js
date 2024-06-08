/**
 * @typedef ConfigExtensions
 * @property {import('typescript-eslint').ConfigWithExtends['files']} [files]
 * @property {import('@typescript-eslint/utils/ts-eslint').FlatConfig.GlobalsConfig|undefined} [globals]
 * @property {string[]|undefined} [ignores]
 */

/**
 * @param {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} configs
 * @param {ConfigExtensions} extensions
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
function configExtend (configs, { files, globals, ignores }) {
  if (!files && !globals && !ignores) {
    return configs
  }

  /** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
  const result = []

  for (const config of configs) {
    /** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */
    const extension = {
      ...files && { files: [...files, ...config.files || []] },
      ...ignores && { ignores: [...ignores, ...config.ignores || []] },
    }

    if (globals) {
      extension.languageOptions = {
        ...config.languageOptions,
        globals: {
          ...config.languageOptions?.globals,
          ...globals,
        },
      }
    }

    result.push({
      ...config,
      ...extension,
    })
  }

  return result
}

module.exports = {
  configExtend,
}

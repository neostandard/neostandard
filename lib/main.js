import { base } from './configs/base.js'
import { modernization } from './configs/modernization.js'
import { semiConfig } from './configs/semi.js'

import { typescriptify } from './ts.js'

const core = [
  base,
  modernization,
]

export default core

/**
 * @typedef NeostandardOptions
 * @property {boolean|undefined} [noTs]
 * @property {boolean|undefined} [typeAwareJs]
 * @property {boolean|undefined} [semi]
 */

/**
 * @param {NeostandardOptions} options
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
export function neostandard (options = {}) {
  const {
    noTs,
    semi,
    typeAwareJs,
  } = options

  /** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
  const config = [
    ...core,
    ...(semi ? [semiConfig] : []),
  ]

  if (noTs) {
    return config
  }

  return typeAwareJs
    ? typescriptify(config)
    : [
        ...config,
        ...typescriptify(config, ['**/*.ts']),
      ]
}

import { createRequire } from 'node:module'

import base from './configs/base.js'
import {
  modernization,
  modernizationStyles,
} from './configs/modernization.js'
import semiConfig from './configs/semi.js'

// The jsx/style/ts layers are loaded lazily inside neostandard() so their plugin
// dependencies (@stylistic, typescript-eslint) only load when the options call
// for them. Static imports would be eager, so those sites use require(esm) —
// which shares the ESM module registry, keeping plugin instances identical to
// the ones the `plugins` getters on the public surface hand out.
const require = createRequire(import.meta.url)

/**
 * @param {import('./helper-types.js').NoUndefinedProperties<Omit<import('./neostandard-types.d.ts').NeostandardJsConfigsOptions, 'ts'>>} options
 * @returns {Record<'jsConfigs' | 'jsxConfigs', import('eslint').Linter.Config[]>}
 */
export function resolveJsConfigs (options) {
  const {
    noJsx,
    noStyle,
    semi,
  } = options

  /** @type {import('eslint').Linter.Config[]} */
  const jsxConfigs = []

  /** @type {import('eslint').Linter.Config[]} */
  const styleConfigs = []

  if (!noJsx) {
    const {
      jsx,
      jsxStyles,
    } = /** @type {typeof import('./configs/jsx.js')} */ (require('./configs/jsx.js'))

    jsxConfigs.push(jsx)

    if (!noStyle) {
      jsxConfigs.push(jsxStyles)
    }
  }

  if (!noStyle) {
    const {
      default: styles
    } = /** @type {typeof import('./configs/style.js')} */ (require('./configs/style.js'))

    styleConfigs.push(styles)
    styleConfigs.push(modernizationStyles)

    if (semi) {
      styleConfigs.push(semiConfig)
    }
  }

  /** @type {import('eslint').Linter.Config[]} */
  const jsConfigs = [
    base,
    modernization,
    ...jsxConfigs,
    ...styleConfigs,
  ]

  return {
    jsConfigs,
    jsxConfigs,
  }
}

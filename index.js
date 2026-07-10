import { createRequire } from 'node:module'

import { neostandard } from './lib/main.js'
import { resolveIgnoresFromGitignore } from './lib/resolve-gitignore.js'

/** @typedef {import('./lib/main.js').NeostandardOptions} NeostandardOptions */

// The getters below stay lazy so heavyweight plugin modules only load when
// accessed. require(esm) shares the ESM module registry, so every getter hands
// out the exact same plugin instance neostandard's own config layers use.
const require = createRequire(import.meta.url)

const plugins = /** @type {const} */ ({
  get '@stylistic' () {
    return /** @type {typeof import('./lib/configs/style.js')} */ (require('./lib/configs/style.js')).default.plugins['@stylistic']
  },
  get n () {
    return /** @type {typeof import('./lib/configs/base.js')} */ (require('./lib/configs/base.js')).default.plugins.n
  },
  get promise () {
    return /** @type {typeof import('./lib/configs/base.js')} */ (require('./lib/configs/base.js')).default.plugins.promise
  },
  // The `react` plugin export remains disabled while the React *logic* rules are
  // paused for ESLint 10 (issue #350); the one reimplemented rule is exposed via
  // the internal `neostandard` plugin below (`neostandard/jsx-key`).
  // get react () {
  //   return require('eslint-plugin-react')
  // },
  /** @returns {import('eslint').ESLint.Plugin} */
  get neostandard () {
    return /** @type {typeof import('./lib/plugin/index.js')} */ (require('./lib/plugin/index.js')).default
  },
  get 'typescript-eslint' () {
    return /** @type {typeof import('./lib/tseslint.js')} */ (require('./lib/tseslint.js')).typescriptEslint
  },
})

// Named exports are the primary API.
export {
  neostandard,
  plugins,
  resolveIgnoresFromGitignore,
}

// Compat alias for the 0.13-era documented `import neostandard from 'neostandard'`.
export default neostandard

// require() interop (require(esm), available across the supported Node range):
// keeps `require('neostandard')` returning the callable, so CJS configs created
// by `neostandard --migrate` and the 0.13 docs keep working. Unlike 0.13,
// `resolveIgnoresFromGitignore` and `plugins` are no longer attached to the
// function — they are named exports (an ESM config is needed to reach them).
export { neostandard as 'module.exports' }

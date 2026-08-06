import { createRequire } from 'node:module'

// The getters below stay lazy so heavyweight plugin modules only load when
// accessed. require(esm) shares the ESM module registry, so every getter hands
// out the exact same plugin instance neostandard's own config layers use.
const require = createRequire(import.meta.url)

export const plugins = /** @type {const} */ ({
  get '@stylistic' () {
    return /** @type {typeof import('./configs/style.js')} */ (require('./configs/style.js')).default.plugins['@stylistic']
  },
  get n () {
    return /** @type {typeof import('./configs/base.js')} */ (require('./configs/base.js')).default.plugins.n
  },
  get promise () {
    return /** @type {typeof import('./configs/base.js')} */ (require('./configs/base.js')).default.plugins.promise
  },
  get neostandard () {
    return /** @type {typeof import('./plugin/index.js')} */ (require('./plugin/index.js')).default
  },
  get 'typescript-eslint' () {
    return /** @type {typeof import('./tseslint.js')} */ (require('./tseslint.js')).typescriptEslint
  },
})

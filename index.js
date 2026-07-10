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

// 0.13 compat: the default export stays callable and also carries the other two
// exports as properties — `neostandard.resolveIgnoresFromGitignore()` (and the
// require() flavor) were the documented patterns and are used in the wild
// (canary: npm-run-all2, fastify-multipart, cpx2). Harmless in ESM: the CJS-era
// TS7/cjs-module-lexer conflict that once forbade this shape does not apply.
const neostandardWithCompatProps = Object.assign(neostandard, { resolveIgnoresFromGitignore, plugins })

export default neostandardWithCompatProps

// require() interop (require(esm), available across the supported Node range):
// keeps `require('neostandard')` returning the callable with the same attached
// properties as 0.13, so CJS configs created by `neostandard --migrate` and the
// 0.13 docs keep working unchanged.
export { neostandardWithCompatProps as 'module.exports' }

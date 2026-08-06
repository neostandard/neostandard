import { neostandard } from './lib/main.js'
import { plugins } from './lib/plugins.js'
import { resolveIgnoresFromGitignore } from './lib/resolve-gitignore.js'

export {
  defaultFileIgnores,
  defaultFilePatterns,
  resolveFilePatterns,
} from './lib/file-patterns.js'

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
const neostandardWithCompatProps = Object.assign(neostandard, {
  /** @deprecated import the `resolveIgnoresFromGitignore` named export instead */
  resolveIgnoresFromGitignore,
  /** @deprecated import the `plugins` named export instead */
  plugins,
})

export default neostandardWithCompatProps

// require() interop (require(esm), available across the supported Node range):
// keeps `require('neostandard')` returning the callable with the same attached
// properties as 0.13, so CJS configs created by `neostandard --migrate` and the
// 0.13 docs keep working unchanged.
export { neostandardWithCompatProps as 'module.exports' }

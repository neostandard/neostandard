// Hand-authored (mirrors voxpelli/node-module-template): the TypeScript
// declaration emitter mishandles this file's surface — it drops the quotes from
// the `'module.exports'` interop export name (TS <= 6.0) and drops the JSDoc
// `@deprecated` tags on the compat properties (all emitters incl. 7.0).
// declaration.tsconfig.json sets `files: []` so the build never emits/clobbers
// this file; keep it in sync with index.js.

import { neostandard } from './lib/main.js'
import { plugins } from './lib/plugins.js'
import { resolveIgnoresFromGitignore } from './lib/resolve-gitignore.js'

export type {
  NeostandardOptions,
} from './lib/neostandard-types.d.ts'

export {
  defaultFileIgnores,
  defaultFilePatterns,
  resolveFilePatterns,
} from './lib/file-patterns.js'

declare const neostandardWithCompatProps: typeof neostandard & {
  /** @deprecated import the `resolveIgnoresFromGitignore` named export instead */
  resolveIgnoresFromGitignore: typeof resolveIgnoresFromGitignore
  /** @deprecated import the `plugins` named export instead */
  plugins: typeof plugins
}

export default neostandardWithCompatProps

export {
  neostandard,
  plugins,
  resolveIgnoresFromGitignore,
}

// Interoperability with require()
export { neostandardWithCompatProps as 'module.exports' }

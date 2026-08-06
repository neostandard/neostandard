// Lazy-load indirection: the `plugins['typescript-eslint']` getter in index.js
// require(esm)'s this module so typescript-eslint only loads when accessed,
// while sharing the exact ESM module instances that lib/ts.js imports (a bare
// require('typescript-eslint') would resolve the dual package's CJS build and
// hand consumers different plugin instances).
export * as typescriptEslint from 'typescript-eslint'

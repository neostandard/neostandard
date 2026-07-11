// The positive file-scope globs neostandard applies to its own rule-bearing
// layers (see lib/main.js and issue #296), exported so extenders can scope
// their additional layers to the same files. An unscoped rule-tweak layer
// (e.g. adjusting `@stylistic/*` rules) applies to EVERY lintable file — and
// once another language is linted (package.json via eslint-plugin-package-json,
// @eslint/json, @eslint/markdown, …) that file gets the rule reference without
// neostandard's plugin definition, which is a fatal "could not find plugin"
// config error. Scoping the layer with these globs avoids that. This is the
// ecosystem workaround pending eslint/eslint#20999 / #20590.
//
// Note: these are the option-independent defaults — user-supplied `files` /
// `filesTs` additions widen neostandard's own scopes but not these constants.

export const globs = Object.freeze(/** @type {const} */ ({
  js: Object.freeze(['**/*.js', '**/*.cjs', '**/*.mjs']),
  jsx: Object.freeze(['**/*.jsx']),
  ts: Object.freeze(['**/*.ts']),
  tsx: Object.freeze(['**/*.tsx']),
  /** Every file a default `neostandard({ ts: true })` touches */
  all: Object.freeze(['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.jsx', '**/*.ts', '**/*.tsx']),
}))

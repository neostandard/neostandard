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

const jsFilePatterns = Object.freeze(/** @type {const} */ ([
  '**/*.js',
  '**/*.cjs',
  '**/*.mjs',
]))
const jsxFilePatterns = Object.freeze(/** @type {const} */ ([
  '**/*.jsx',
]))
const tsFilePatterns = Object.freeze(/** @type {const} */ ([
  '**/*.ts',
]))
const tsxFilePatterns = Object.freeze(/** @type {const} */ ([
  '**/*.tsx',
]))

export const defaultFilePatterns = Object.freeze(/** @type {const} */ ({
  js: jsFilePatterns,
  jsx: jsxFilePatterns,
  ts: tsFilePatterns,
  tsx: tsxFilePatterns,
  /** Every file a default `neostandard({ ts: true })` touches */
  all: Object.freeze(/** @type {const} */ ([
    ...jsFilePatterns,
    ...jsxFilePatterns,
    ...tsFilePatterns,
    ...tsxFilePatterns,
  ]))
}))

// neostandard does not lint fenced code blocks inside Markdown — keep its
// rules off the virtual `file.md/*.js` children (see issue #296 follow-up).
const mdBlockIgnore = /** @type {const} */ (['**/*.md/**'])

export const defaultFileIgnores = Object.freeze(/** @type {const} */ ([
  ...mdBlockIgnore,
]))

/**
 * @typedef NeostandardFilePatterns
 * @property {string[]} jsTsFiles
 * @property {string[]} jsxFiles
 * @property {string[]} ignores
 * @property {string[]} tsFiles
*/

/**
 * @param {import('./helper-types.js').NoUndefinedProperties<import('./neostandard-types.js').NeostandardFilePatternOptions>} options
 * @returns {NeostandardFilePatterns}
 */
export function resolveFilePatterns (options) {
  const {
    files,
    filesTs,
    ignores,
    noJsx,
    ts,
  } = options

  if (filesTs.length && !ts) {
    throw new Error('"filesTs" is only usable with the "ts" option')
  }

  // Positive file scopes so neostandard only ever applies to the JS/TS files it
  // owns — never to other languages a consumer layers on (eg. @eslint/markdown,
  // @eslint/json). See issue #296.
  const jsAndJsxFiles = [
    ...defaultFilePatterns.js,
    ...noJsx ? [] : defaultFilePatterns.jsx,
    ...files,
  ]

  const tsFiles = ts
    ? [
        ...defaultFilePatterns.ts,
        ...noJsx ? [] : defaultFilePatterns.tsx,
        ...filesTs,
      ]
    : []

  // The core rule layers (and globals) must cover JS *and* TS, because the TS
  // block from typescriptify() only adds parser + rule overrides on top — the
  // actual ruleset reaches .ts/.tsx via these layers.
  const jsTsFiles = [...jsAndJsxFiles, ...tsFiles]

  // The JSX layers apply to JSX-capable files (`.jsx`, plus `.tsx` under `ts`).
  // User-supplied `files` are folded in too, preserving the pre-#296 behaviour
  // where the JSX layers (via negative `ignores`) applied to any extension a
  // consumer added through `files`.
  const jsxFiles = [
    ...defaultFilePatterns.jsx,
    ...ts ? defaultFilePatterns.tsx : [],
    ...files,
  ]

  return {
    jsTsFiles,
    jsxFiles,
    ignores: [
      ...defaultFileIgnores,
      ...ignores,
    ],
    tsFiles,
  }
}

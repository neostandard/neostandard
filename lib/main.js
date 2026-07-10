import { createRequire } from 'node:module'

import globals from 'globals'

import base from './configs/base.js'
import {
  modernization,
  modernizationStyles,
} from './configs/modernization.js'
import semiConfig from './configs/semi.js'

import { isNonEmpty } from './utils.js'

// The jsx/style/ts layers are loaded lazily inside neostandard() so their plugin
// dependencies (@stylistic, typescript-eslint) only load when the options call
// for them. Static imports would be eager, so those sites use require(esm) —
// which shares the ESM module registry, keeping plugin instances identical to
// the ones the `plugins` getters on the public surface hand out.
const require = createRequire(import.meta.url)

/**
 * @typedef NeostandardOptions
 * @property {Array<keyof typeof import('globals')>|undefined} [env] - resolves globals for the provided environment names using the {@link https://www.npmjs.com/package/globals|globals module}
 * @property {string[]|undefined} [files] - file patterns, in minimatch syntax, the config applies to, see {@link https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores|ESLint Docs}
 * @property {string[]|undefined} [filesTs] - additional file patterns, in minimatch syntax, that TS rules will to apply to
 * @property {import('eslint').Linter.Globals|string[]|undefined} [globals] - the base globals that should be considered available, see {@link https://eslint.org/docs/latest/use/configure/language-options#specifying-globals|ESLint Docs}
 * @property {string[]|undefined} [ignores] - patterns in minimatch syntax for files to ignore
 * @property {boolean|undefined} [noJsx] - when set, skips JSX parsing and JSX style rules. Note: React-specific logic rules (eslint-plugin-react) are currently not included regardless, pending ESLint 10 support — see issue #350
 * @property {boolean|undefined} [noStyle] - when set, skips style rules
 * @property {boolean|undefined} [semi] - when set, enforces rather than forbids semicolons
 * @property {boolean|undefined} [ts] - when set, enables TypeScript checks
 */

/**
 * @param {NeostandardOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 * @throws {Error} When `filesTs` is provided without `ts: true`
 */
function neostandard (options) {
  const {
    env,
    files: rawFiles,
    filesTs,
    globals: rawGlobals,
    ignores,
    noJsx = false,
    noStyle = false,
    ts = false,
    semi = false,
  } = options || {}

  if (filesTs && !ts) {
    throw new Error('"filesTs" is only usable with the "ts" option')
  }

  /** @type {import('eslint').Linter.Globals} */
  const resolvedGlobals = Array.isArray(rawGlobals)
    ? Object.fromEntries(rawGlobals.map(global => [global, true]))
    : { ...rawGlobals }

  for (const key of env || []) {
    if (!globals[key]) {
      throw new Error(`Invalid env definition: ${env}`)
    }
    const envGlobals = globals[key]
    for (const [key, value] of Object.entries(envGlobals)) {
      resolvedGlobals[key] = resolvedGlobals[key] || value
    }
  }

  // Positive file scopes so neostandard only ever applies to the JS/TS files it
  // owns — never to other languages a consumer layers on (eg. @eslint/markdown,
  // @eslint/json). See issue #296.
  const jsFiles = [
    '**/*.js',
    '**/*.cjs',
    '**/*.mjs',
    ...noJsx ? [] : ['**/*.jsx'],
    ...rawFiles || [],
  ]
  const tsFiles = ts
    ? [
        '**/*.ts',
        ...noJsx ? [] : ['**/*.tsx'],
        ...filesTs || [],
      ]
    : []
  // The core rule layers (and globals) must cover JS *and* TS, because the TS
  // block from typescriptify() only adds parser + rule overrides on top — the
  // actual ruleset reaches .ts/.tsx via these layers.
  const jsTsFiles = [...jsFiles, ...tsFiles]
  // The JSX layers apply to JSX-capable files (`.jsx`, plus `.tsx` under `ts`).
  // User-supplied `files` are folded in too, preserving the pre-#296 behaviour
  // where the JSX layers (via negative `ignores`) applied to any extension a
  // consumer added through `files`.
  const jsxFiles = [
    '**/*.jsx',
    ...ts ? ['**/*.tsx'] : [],
    ...rawFiles || [],
  ]
  // neostandard does not lint fenced code blocks inside Markdown — keep its
  // rules off the virtual `file.md/*.js` children (see issue #296 follow-up).
  const mdBlockIgnore = ['**/*.md/**']

  /** @type {import('eslint').Linter.Config[]} */
  let jsxConfigs = []

  if (!noJsx) {
    const {
      jsx,
      jsxStyles,
    } = /** @type {typeof import('./configs/jsx.js')} */ (require('./configs/jsx.js'))

    jsxConfigs = [
      jsx,
      ...(noStyle ? [] : [jsxStyles]),
    ]
  }

  const styleConfigs = noStyle
    ? []
    : [
        // require(esm) returns the module namespace — the config is its default
        /** @type {typeof import('./configs/style.js')} */ (require('./configs/style.js')).default,
        modernizationStyles,
        ...(semi ? [semiConfig] : []),
      ]

  const jsConfigs = [
    base,
    modernization,
    ...jsxConfigs,
    ...styleConfigs,
  ]

  // Apply the positive file scopes (the JSX layers get the narrower jsxFiles
  // scope; every other layer gets jsTsFiles). Order is preserved so rule
  // precedence is unchanged. The unscoped `jsConfigs` is still handed to
  // typescriptify() below, which only reads `.rules`.
  //
  // Invariant this relies on: the `lib/configs/*` layers carry no `files`/`ignores`
  // of their own, so the spread below can set them wholesale. The Set membership
  // test is by reference — safe because `jsxConfigs` holds the same module-singleton
  // objects required above (don't clone a jsx config into `jsConfigs`).
  const jsxConfigsSet = new Set(jsxConfigs)
  const scopedJsConfigs = jsConfigs.map(config => ({
    ...config,
    files: jsxConfigsSet.has(config) ? jsxFiles : jsTsFiles,
    ignores: mdBlockIgnore,
  }))

  const typescriptify = ts
    ? /** @type {typeof import('./ts.js')} */ (require('./ts.js')).typescriptify
    : undefined

  return [
    // To make it a global ignore, "ignores" has to be the lone key of the config, hence no "name": https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
    ...ignores
      ? [{
          ignores,
        }]
      : [],

    // Resolved globals apply to every JS/TS file neostandard handles
    ...isNonEmpty(resolvedGlobals)
      ? [{
          name: 'neostandard/globals',
          files: jsTsFiles,
          ignores: mdBlockIgnore,
          languageOptions: { globals: resolvedGlobals },
        }]
      : [],

    // All the main configs, scoped to JS/TS files
    ...scopedJsConfigs,

    // If targeting TypeScript, this will ensure those files are targeted with a TypeScript specific parser and any needed rule adaptions rules
    ...typescriptify
      ? [typescriptify(jsConfigs, {
          files: tsFiles,
          ignores: [...ignores || [], ...mdBlockIgnore],
          name: 'neostandard/ts',
        })]
      : [],
  ]
}

export {
  neostandard,
}

import { createRequire } from 'node:module'

import { resolveFilePatterns } from './file-patterns.js'
import { isNonEmpty } from './utils.js'
import { resolveJsConfigs } from './js-configs.js'
import { resolveGlobals } from './globals.js'

// The jsx/style/ts layers are loaded lazily inside neostandard() so their plugin
// dependencies (@stylistic, typescript-eslint) only load when the options call
// for them. Static imports would be eager, so those sites use require(esm) —
// which shares the ESM module registry, keeping plugin instances identical to
// the ones the `plugins` getters on the public surface hand out.
const require = createRequire(import.meta.url)

/**
 * @param {import('./neostandard-types.js').NeostandardOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
function neostandard (options) {
  const {
    env,
    files: rawFiles = [],
    filesTs = [],
    globals,
    ignores: rawIgnores = [],
    noJsx = false,
    noStyle = false,
    ts = false,
    semi = false,
  } = options || {}

  const resolvedGlobals = resolveGlobals({
    env,
    globals,
  })

  const {
    jsConfigs,
    jsxConfigs,
  } = resolveJsConfigs({
    noJsx,
    noStyle,
    semi,
  })

  const {
    tsFiles,
    jsTsFiles,
    jsxFiles,
    ignores,
  } = resolveFilePatterns({
    files: rawFiles,
    filesTs,
    ignores: rawIgnores,
    noJsx,
    ts,
  })

  const typescriptify = ts
    ? /** @type {typeof import('./ts.js')} */ (require('./ts.js')).typescriptify
    : undefined

  return [
    // Resolved globals apply to every JS/TS file neostandard handles
    ...isNonEmpty(resolvedGlobals)
      ? [{
          name: 'neostandard/globals',
          files: jsTsFiles,
          ignores,
          languageOptions: { globals: resolvedGlobals },
        }]
      : [],

    // All the main configs, scoped to JS/TS files (the JSX layers get the narrower jsxFiles
    // scope; every other layer gets jsTsFiles).
    ...jsConfigs.map(config => ({
      ...config,
      files: jsxConfigs.includes(config) ? jsxFiles : jsTsFiles,
      ignores,
    })),

    // If targeting TypeScript, this will ensure those files are targeted with a TypeScript specific parser and any needed rule adaptions rules
    ...typescriptify
      ? [typescriptify(jsConfigs, {
          files: tsFiles,
          ignores,
          name: 'neostandard/ts',
        })]
      : [],
  ]
}

export {
  neostandard,
}

import globals from 'globals'

/**
 * @param {import('./neostandard-types.d.ts').NeostandardEnvOptions} options
 * @returns {import('eslint').Linter.Globals}
 */
export function resolveGlobals (options) {
  const {
    env,
    globals: rawGlobals
  } = options

  /** @type {import('eslint').Linter.Globals} */
  const resolvedGlobals = Array.isArray(rawGlobals)
    ? Object.fromEntries(rawGlobals.map(global => [global, true]))
    : { ...rawGlobals }

  for (const key of env || []) {
    if (!globals[key]) {
      throw new Error(`Invalid env definition: ${key}`)
    }
    const envGlobals = globals[key]
    for (const [key, value] of Object.entries(envGlobals)) {
      resolvedGlobals[key] = resolvedGlobals[key] || value
    }
  }

  return resolvedGlobals
}

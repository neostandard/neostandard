import { createRequire } from 'node:module'

import jsxKey from './rules/jsx-key.js'

// createRequire instead of a JSON import attribute: `with { type: 'json' }` is
// not available across the whole supported Node.js range.
const require = createRequire(import.meta.url)
const { version } = /** @type {{ version: string }} */ (require('../../package.json'))

export default /** @type {import('eslint').ESLint.Plugin} */ ({
  meta: {
    name: 'neostandard',
    version,
  },
  rules: {
    'jsx-key': jsxKey,
  },
})

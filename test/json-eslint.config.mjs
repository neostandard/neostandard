import json from '@eslint/json'

import neostandard from '../index.js'

// Regression test for the "etc" in issue #296: neostandard must compose with
// @eslint/json without leaking its JS parser/rules onto `.json` files. `.json`
// only matches the `json/json` language config below — neostandard's positive
// `files` scopes (JS/TS only) keep it away entirely.
export default [
  ...neostandard(),
  {
    ...json.configs.recommended,
    files: ['**/*.json'],
    language: 'json/json',
  },
]

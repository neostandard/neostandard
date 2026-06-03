'use strict'

const { version } = /** @type {{ version: string }} */ (require('../../package.json'))

module.exports = /** @type {import('eslint').ESLint.Plugin} */ ({
  meta: {
    name: 'neostandard',
    version,
  },
  rules: {
    'jsx-key': require('./rules/jsx-key'),
  },
})

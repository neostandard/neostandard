'use strict'

module.exports = require('./')({
  ignores: [
    ...require('./').resolveIgnoresFromGitignore(),
    '**/should-be-ignored/**',
  ],
  ts: true,
})

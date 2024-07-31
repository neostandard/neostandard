'use strict'

module.exports = require('./')({
  globals: ['assertsFoo'],
  env: ['mocha'],
  ignores: [
    ...require('./').resolveIgnoresFromGitignore(),
    '**/should-be-ignored/**',
  ],
  ts: true,
})

'use strict'

module.exports = require('./')({
  ignores: require('./').resolveIgnoresFromGitignore(),
  ts: true,
})

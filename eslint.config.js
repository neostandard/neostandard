'use strict'

module.exports = require('./')({
  // Added for testing purposes, see test/should-work-with-globals/*
  globals: ['assertsFoo'],
  // Added for testing purposes, see test/should-work-with-globals/*
  env: ['mocha'],
  ignores: [
    ...require('./').resolveIgnoresFromGitignore(),
    // Added for testing purposes
    '**/should-be-ignored/**',
  ],
  ts: true,
})

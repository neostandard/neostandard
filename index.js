'use strict'

/** @typedef {import('./lib/main').NeostandardOptions} NeostandardOptions */

module.exports = require('./lib/main').neostandard

module.exports.resolveIgnoresFromGitignore = require('./lib/resolve-gitignore').resolveIgnoresFromGitignore

module.exports.plugins = /** @type {const} */ ({
  get '@stylistic' () {
    return require('@stylistic/eslint-plugin')
  },
  get '@typescript-eslint' () {
    return require('@typescript-eslint/eslint-plugin')
  },
  get n () {
    return require('eslint-plugin-n')
  },
})

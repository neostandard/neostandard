'use strict'

/** @typedef {import('./lib/main').NeostandardOptions} NeostandardOptions */

module.exports = require('./lib/main').neostandard

module.exports.resolveIgnoresFromGitignore = require('./lib/resolve-gitignore').resolveIgnoresFromGitignore

module.exports.plugins = /** @type {const} */ ({
  get '@stylistic' () {
    return require('@stylistic/eslint-plugin')
  },
  get import () {
    // @ts-ignore
    return require('eslint-plugin-import')
  },
  get n () {
    return require('eslint-plugin-n')
  },
  get promise () {
    // @ts-ignore
    return require('eslint-plugin-promise')
  },
  get react () {
    // @ts-ignore
    return require('eslint-plugin-react')
  },
  get 'typescript-eslint' () {
    return require('typescript-eslint')
  },
})

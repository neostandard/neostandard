'use strict'

/** @typedef {import('./lib/main').NeostandardOptions} NeostandardOptions */

module.exports = require('./lib/main').neostandard

module.exports.resolveIgnoresFromGitignore = require('./lib/resolve-gitignore').resolveIgnoresFromGitignore

module.exports.plugins = /** @type {const} */ ({
  get '@stylistic' () {
    // @stylistic v5 is ESM-only; require(esm) returns the module namespace, so unwrap the default export
    const stylistic = require('@stylistic/eslint-plugin')
    return stylistic.default ?? stylistic
  },
  get n () {
    return require('eslint-plugin-n')
  },
  get promise () {
    // @ts-ignore
    return require('eslint-plugin-promise')
  },
  // JSX support temporarily removed for ESLint 10 (issue #350); `react` plugin export disabled.
  // get react () {
  //   return require('eslint-plugin-react')
  // },
  get 'typescript-eslint' () {
    return require('typescript-eslint')
  },
})

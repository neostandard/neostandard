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
  // The `react` plugin export remains disabled while the React *logic* rules are
  // paused for ESLint 10 (issue #350); the one reimplemented rule is exposed via
  // the internal `neostandard` plugin below (`neostandard/jsx-key`).
  // get react () {
  //   return require('eslint-plugin-react')
  // },
  /** @returns {import('eslint').ESLint.Plugin} */
  get neostandard () {
    return require('./lib/plugin/index')
  },
  get 'typescript-eslint' () {
    return require('typescript-eslint')
  },
})

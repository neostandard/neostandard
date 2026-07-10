'use strict'

/** @typedef {import('./lib/main').NeostandardOptions} NeostandardOptions */

const neostandard = require('./lib/main').neostandard

const resolveIgnoresFromGitignore = require('./lib/resolve-gitignore').resolveIgnoresFromGitignore

// Assigned onto the callable in a single export assignment below — TypeScript 7
// no longer synthesizes named exports from the merged `module.exports.prop = …`
// CommonJS pattern. The getters object is passed by reference; spreading it here
// would eagerly evaluate every lazy getter.
const plugins = /** @type {const} */ ({
  get '@stylistic' () {
    // @stylistic v5 is ESM-only. On the supported Node range require(esm) resolves
    // to the plugin object directly (no `.default`), so the `?? stylistic` branch is
    // the one taken; the `.default` unwrap is a fallback for a namespaced shape.
    const stylistic = require('@stylistic/eslint-plugin')
    return stylistic.default ?? stylistic
  },
  get n () {
    // eslint-plugin-n v18 is ESM-only; unwrap the default export (see style.js).
    const n = require('eslint-plugin-n')
    return n.default ?? n
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

module.exports = Object.assign(neostandard, { resolveIgnoresFromGitignore, plugins })

#!/usr/bin/env node

import { readFile } from 'node:fs/promises'

import { peowly } from 'peowly'

const packagePath = new URL('./package.json', import.meta.url)
const pkg = JSON.parse(await readFile(packagePath, { encoding: 'utf8' }))

const {
  flags: {
    esm,
    ...flags
  },
  showHelp,
} = peowly({
  options: {
    esm: {
      listGroup: 'Output options',
      description: 'Outputs as ESM instead of as CJS',
      type: 'boolean',

    },
    global: {
      listGroup: 'Config options',
      description: 'Adds the provided string as a global',
      type: 'string',
      multiple: true,
      short: 'g',
    },
    ignore: {
      listGroup: 'Config options',
      description: 'Ignores the provided pattern when linting files',
      type: 'string',
      multiple: true,
      short: 'i',
    },
    'no-style': {
      listGroup: 'Config options',
      description: 'Deactivates all style linting',
      type: 'boolean',
    },
    'no-ts': {
      listGroup: 'Config options',
      description: 'Deactivates all TypeScript based linting',
      type: 'boolean',
    },
    semi: {
      listGroup: 'Config options',
      description: 'Enforces rather than bans semi-colons',
      type: 'boolean',
    },
  },
  description: 'Generate a neostandard config for eslint',
  examples: [
    '--semi --no-style > eslint.config.js',
  ],
  name: 'neostandard',
  pkg,
})

const flagMapping = /** @satisfies {Record<keyof typeof flags, keyof import('./index.js').NeostandardOptions>} */ ({
  global: 'globals',
  ignore: 'ignores',
  'no-style': 'noStyle',
  'no-ts': 'noTs',
  semi: 'semi',
})

const flagKeys = /** @type {Array<keyof typeof flagMapping>} */ (Object.keys(flagMapping))

/** @type {string[]} */
const config = []

for (const flag of flagKeys) {
  if (flags[flag]) {
    const value = JSON.stringify(flags[flag])
      .replaceAll('"', '\'')
      .replaceAll('\',\'', '\', \'')

    config.push(`${flagMapping[flag]}: ${value}`)
  }
}

if (!config.length) {
  showHelp()
}

const formattedConfig = config.length > 1
  ? `{\n  ${config.join(',\n  ')},\n}`
  : `{ ${config.join(', ')} }`
const semiEnding = flags.semi ? ';' : ''

console.log(
  esm
    ? `import neostandard from 'neostandard'${semiEnding}

export default neostandard(${formattedConfig})${semiEnding}
`
    : `'use strict'${semiEnding}

module.exports = require('neostandard')(${formattedConfig})${semiEnding}
`)

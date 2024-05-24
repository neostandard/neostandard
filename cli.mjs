#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { peowly } from 'peowly'
import { isStringArray } from './lib/utils.js'

const packagePath = new URL('./package.json', import.meta.url)
// type-coverage:ignore-next-line
const pkg = JSON.parse(await readFile(packagePath, { encoding: 'utf8' }))

const {
  flags: {
    esm,
    migrate,
    ...flags
  },
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
    migrate: {
      listGroup: 'Input options',
      description: 'Migrates the standardjs config in the package.json in the current directory',
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

/** @type {Partial<typeof flags>} */
const flagsFromMigration = {}

if (migrate) {
  /** @type {unknown} */
  let sourcePkg

  try {
    sourcePkg = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8'))
  } catch (cause) {
    console.log('Failed to read package.json:', cause)
    process.exit(1)
  }

  if (sourcePkg && typeof sourcePkg === 'object' && 'standard' in sourcePkg && sourcePkg.standard && typeof sourcePkg.standard === 'object') {
    for (const [key, value] of Object.entries(sourcePkg.standard)) {
      if (key === 'global' || key === 'globals' || key === 'ignore' || key === 'ignores') {
        const targetKey = key === 'ignore' || key === 'ignores' ? 'ignore' : 'global'

        if (typeof value === 'string') {
          flagsFromMigration[targetKey] = [value]
        } else if (Array.isArray(value) && isStringArray(value)) {
          flagsFromMigration[targetKey] = value
        } else {
          console.log(`Invalid migration value for "standard.${key}". Expected an array of strings, got:`, value)
          process.exit(1)
        }
      } else {
        console.warn(`Migration for "standard.${key}" is not yet supported. Open an issue at https://github.com/neostandard/neostandard`)
      }
    }
  }
}

/** @type {string[]} */
const config = []

for (const flag of flagKeys) {
  const value = flags[flag] || flagsFromMigration[flag]

  if (value) {
    const formattedValue = JSON.stringify(value)
      .replaceAll('"', '\'')
      .replaceAll('\',\'', '\', \'')

    config.push(`${flagMapping[flag]}: ${formattedValue}`)
  }
}

const formattedConfig = config.length > 1
  ? `{\n  ${config.join(',\n  ')},\n}`
  : (
      config.length
        ? `{ ${config.join(', ')} }`
        : '{}'
    )
const semiEnding = flags.semi ? ';' : ''

console.log(
  esm
    ? `import neostandard from 'neostandard'${semiEnding}

export default neostandard(${formattedConfig})${semiEnding}`
    : `'use strict'${semiEnding}

module.exports = require('neostandard')(${formattedConfig})${semiEnding}`)

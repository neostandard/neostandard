#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { formatHelpMessage, peowly } from 'peowly'
import { availableChoices } from './lib/options.js'
import { intersection } from './lib/utils.js'

const resolvedDirname = dirname(fileURLToPath(import.meta.url))

const pkg = JSON.parse(await readFile(join(resolvedDirname, 'package.json'), 'utf8'))

/** @type {Record<Lowercase<import('./lib/options.js').NeostandardChoices>, import('peowly').AnyFlag>} */
const options = {
  semi: {
    listGroup: 'Config options',
    description: 'Enforce rather than ban semi-colons',
    type: 'boolean',
  },
  nots: {
    listGroup: 'Config options',
    description: 'Deactivates all TypeScript based linting',
    type: 'boolean',
  },
  tsforjs: {
    listGroup: 'Config options',
    description: 'Activates TypeScript based linting for JavaScript files as well',
    type: 'boolean',
  },
  typechecking: {
    listGroup: 'Config options',
    description: 'Activates type checking rules ',
    type: 'boolean',
  },
}

const [execPath, filename, ...args] = process.argv

const {
  flags,
  remainderArgs,
} = peowly({
  args,
  help: formatHelpMessage('neostandard', {
    flags: {
      ...options,
      '..': {
        listGroup: 'ESLint options',
        description: 'All ESLint options are supported',
      },
    },
    usage: '',
  }),
  options,
  name: 'neostandard',
  pkg,
  returnRemainderArgs: true,
})

const unsupportedFlags = intersection(remainderArgs, [
  '--config',
  '--init',
  '--inspect-config',
  '--no-config-lookup',
  '--stdin', // TODO: Would be possible to support
  '-c',
])

if (unsupportedFlags.length) {
  console.error('neostandard can not be used with these ESLint flags:', unsupportedFlags.join(', '))
  process.exit(1)
}

const config = availableChoices
  .map(choice => /** @type {Lowercase<choice>} */ (choice.toLowerCase()))
  .filter(choice => flags[choice])

const configFile = join(resolvedDirname, config.length ? `configs/neostandard-${config.join('-')}.config.js` : 'index.js')

if (remainderArgs.includes('--debug')) {
  const { default: { enable } } = await import('debug')
  enable('eslint:*,-eslint:code-path,eslintrc:*')
}

const { default: cli } =
  // FIXME: Make eslint actually allow this import
  // @ts-ignore
  await import('eslint/cli')

const exitCode = await cli.execute(
  [execPath, filename, ...remainderArgs, '--no-config-lookup', '--config', configFile],
  null,
  true
)

process.exit(exitCode)

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const cli = fileURLToPath(new URL('../../cli.js', import.meta.url))
const migrationSource = fileURLToPath(new URL('../migration-source/', import.meta.url))
const invalidMigrationSource = fileURLToPath(new URL('../migration-source-invalid/', import.meta.url))

/**
 * @param {string[]} args
 * @param {string} [cwd]
 */
function runCli (args, cwd) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' })
}

test('default CLI usage generates a CommonJS config', () => {
  const result = runCli([])
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout, "'use strict'\n\nmodule.exports = require('neostandard')({})\n")
  assert.equal(result.stderr, '')
})

test('CLI negatable options generate only disabled settings', () => {
  /** @type {Array<[string[], string]>} */
  const cases = [
    [['--no-jsx'], '{ noJsx: true }'],
    [['--no-style'], '{ noStyle: true }'],
    [['--no-jsx', '--no-style'], '{\n  noJsx: true,\n  noStyle: true,\n}'],
    [['--jsx', '--style'], '{}'],
    [['--no-jsx', '--jsx', '--no-style', '--style'], '{}'],
  ]
  for (const [args, expected] of cases) {
    const result = runCli(args)
    assert.equal(result.status, 0, result.stderr)
    assert.ok(result.stdout.includes(`require('neostandard')(${expected})`))
  }
})

test('CLI accepts output, config, and repeated short options', () => {
  const result = runCli(['--esm', '--semi', '--ts', '--env', 'node', '-g', 'foo', '--global', 'bar', '-i', 'dist', '--ignore', 'build', '--no-jsx', '--no-style'])
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout, `import { neostandard } from 'neostandard';

export default neostandard({
  env: ['node'],
  globals: ['foo', 'bar'],
  ignores: ['dist', 'build'],
  noJsx: true,
  noStyle: true,
  semi: true,
  ts: true,
});
`)
})

test('CLI help and version work', () => {
  const help = runCli(['--help'])
  assert.equal(help.status, 0, help.stderr)
  assert.match(help.stdout, /--\[no-\]jsx/)
  assert.match(help.stdout, /--\[no-\]style/)
  assert.match(help.stdout, /--migrate/)
  const version = runCli(['--version'])
  assert.equal(version.status, 0, version.stderr)
  assert.match(version.stdout, /^\d+\.\d+\.\d+/)
})

test('CLI migration combines flags with migrated values', () => {
  const result = runCli(['--migrate', '--env', 'node', '-g', 'custom', '-i', 'dist', '--no-jsx'], migrationSource)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout, `'use strict'

module.exports = require('neostandard')({
  env: ['node', 'browser', 'mocha', 'serviceworker'],
  globals: ['custom', 'describe', 'it'],
  ignores: ['dist', '**/bench/**'],
  noJsx: true,
})
`)
  assert.match(result.stderr, /Migration for "standard.random" is not yet supported/)
})

test('CLI migration rejects invalid values', () => {
  const result = runCli(['--migrate'], invalidMigrationSource)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Invalid migration value for "standard.ignore"/)
  assert.equal(result.stdout, '')
})

'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')

const neostandard = require('../../index.js')

// `filesTs` requires `ts` — runtime guard in lib/main.js
test('throws when filesTs is used without ts', () => {
  assert.throws(
    () => neostandard({ filesTs: ['**/*.ts'] }),
    { message: '"filesTs" is only usable with the "ts" option' }
  )
})

test('default () — array of configs, no TS block', () => {
  const configs = neostandard()
  assert.ok(Array.isArray(configs))
  assert.ok(!configs.some(c => c.name === 'neostandard/ts'))
})

test('ts: true — emits the TS block', () => {
  const configs = neostandard({ ts: true })
  assert.ok(configs.some(c => c.name === 'neostandard/ts'))
})

test('noJsx: true — no jsx layer', () => {
  const configs = neostandard({ noJsx: true })
  assert.ok(!configs.some(c => c.name === 'neostandard/jsx'))
})

test('noStyle: true — no style layers', () => {
  const configs = neostandard({ noStyle: true })
  assert.ok(!configs.some(c => c.name === 'neostandard/style' || c.name === 'neostandard/style/jsx'))
})

test('semi: true — flips @stylistic/semi to always', () => {
  const configs = neostandard({ semi: true })
  const rules = Object.assign({}, ...configs.map(c => c.rules || {}))
  const semi = rules['@stylistic/semi']
  assert.ok(semi !== undefined)
  assert.equal(Array.isArray(semi) ? semi[1] : semi, 'always')
})

test('files — custom patterns are added to the scope', () => {
  const configs = neostandard({ files: ['**/*.js.flow'] })
  const allFiles = configs.flatMap(c => c.files || [])
  assert.ok(allFiles.includes('**/*.js.flow'))
})

test('filesTs — custom patterns land in the TS block scope', () => {
  const configs = neostandard({ ts: true, filesTs: ['**/*.ts.flow'] })
  const tsBlock = configs.find(c => c.name === 'neostandard/ts')
  assert.ok(tsBlock && Array.isArray(tsBlock.files))
  assert.ok(tsBlock.files.includes('**/*.ts.flow'))
})

// #296: neostandard must not leak onto non-JS languages — its rule-bearing
// layers carry positive `files` scopes, so no layer matches a bare `.md`/`.json`.
test('scoping: no rule-bearing layer matches plain .md or .json', () => {
  const configs = neostandard({ ts: true })
  for (const c of configs) {
    if (!c.files) continue // the lone-key global { ignores } block has no files
    for (const pattern of c.files.flat()) {
      assert.ok(!pattern.endsWith('.md'), `layer ${c.name} should not match **/*.md`)
      assert.ok(!pattern.endsWith('.json'), `layer ${c.name} should not match **/*.json`)
    }
  }
})

import assert from 'node:assert/strict'
import test from 'node:test'

import { globs, neostandard } from '../../index.js'

// The TS block must extend the declared operator-linebreak preferences with
// ignores for the TS-only `|`/`&` type operators (@stylistic 5 / #805 drift
// absorption, see lib/ts.js) without touching the JS-declared placements.
test('ts: true — TS block ignores union/intersection operator placement', () => {
  const configs = neostandard({ ts: true })
  const tsBlock = configs.find(config => config.name === 'neostandard/ts')
  assert.ok(tsBlock, 'has a neostandard/ts block')
  const entry = tsBlock.rules?.['@stylistic/operator-linebreak']
  assert.ok(Array.isArray(entry), 'TS block re-declares operator-linebreak')
  const options = /** @type {{ overrides: Record<string, string> }} */ (entry[2])
  assert.equal(options.overrides['|'], 'ignore')
  assert.equal(options.overrides['&'], 'ignore')
  assert.equal(options.overrides['?'], 'before', 'declared ternary preference preserved')
  assert.equal(options.overrides[':'], 'before', 'declared ternary preference preserved')
})

// Without ts, no layer may carry the TS-only operator ignores
test('default — no TS operator-linebreak adaption leaks into JS layers', () => {
  for (const config of neostandard()) {
    const entry = config.rules?.['@stylistic/operator-linebreak']
    if (Array.isArray(entry) && typeof entry[2] === 'object' && entry[2] !== null) {
      const overrides = /** @type {{ overrides?: Record<string, string> }} */ (entry[2]).overrides
      assert.notEqual(overrides?.['|'], 'ignore', `unexpected TS ignore in ${config.name}`)
    }
  }
})

// The exported globs must be exactly the scopes neostandard applies to its own
// rule-bearing layers — extenders rely on them to scope additional layers so
// their rule tweaks never leak onto other languages (see lib/globs.js).
test('globs export matches the applied default scopes', () => {
  const base = neostandard({ ts: true }).find(config => config.name === 'neostandard/base')
  assert.ok(base, 'has a neostandard/base layer')
  assert.deepEqual(base.files, [...globs.js, ...globs.jsx, ...globs.ts, ...globs.tsx])
  assert.deepEqual(base.files, [...globs.all])
  const baseNoJsx = neostandard({ noJsx: true }).find(config => config.name === 'neostandard/base')
  assert.deepEqual(baseNoJsx?.files, [...globs.js])
})

// 0.13 compat: property access on the default export must keep working —
// `neostandard.resolveIgnoresFromGitignore()` / `require('neostandard').plugins`
// were documented patterns (canary: npm-run-all2, fastify-multipart, cpx2).
test('default export carries compat properties', async () => {
  const { default: def, plugins, resolveIgnoresFromGitignore } = await import('../../index.js')
  assert.equal(def.resolveIgnoresFromGitignore, resolveIgnoresFromGitignore)
  assert.equal(def.plugins, plugins)
  assert.equal(typeof def, 'function')
})

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

import assert from 'node:assert/strict'
import test from 'node:test'

import { Linter } from 'eslint'
import { neostandard } from '../../index.js'
import { nodeStripParser } from '../../lib/node-strip.js'

const parserOptions = {
  ecmaVersion: 'latest',
  loc: true,
  range: true,
  sourceType: 'module',
}

const parse = /** @type {{ parseForESLint: (code: string, options: object) => { ast: import('estree').Program } }} */ (/** @type {unknown} */ (nodeStripParser)).parseForESLint

test('node-strip parser parses erasable TypeScript as JavaScript', () => {
  const source = 'type Item = { value: number };\nconst item: Item = { value: 1 }\n'
  const ast = parse(source, parserOptions).ast

  assert.equal(ast.type, 'Program')
  assert.equal(ast.body.length, 1)
  const node = ast.body[0]
  assert.ok(node)
  if (node.type !== 'VariableDeclaration') assert.fail('expected a variable declaration')
  const id = node.declarations[0]?.id
  assert.ok(id && id.type === 'Identifier')
  assert.equal(id.name, 'item')
})

test('node-strip parser preserves source offsets after erasing types', () => {
  const source = 'const item: number = 1'
  const ast = parse(source, parserOptions).ast
  const declaration = ast.body[0]
  assert.ok(declaration)
  if (declaration.type !== 'VariableDeclaration') assert.fail('expected a variable declaration')

  assert.deepEqual(declaration.range, [0, source.length])
  const id = declaration.declarations[0]?.id
  assert.ok(id && id.type === 'Identifier')
  assert.equal(id.name, 'item')
  assert.deepEqual(id.range, [6, 10])
  assert.equal(source.slice(...id.range), 'item')
})

test('node-strip parser propagates unsupported syntax errors', () => {
  assert.throws(
    () => parse('enum Direction { Up }', parserOptions),
    { code: 'ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX' }
  )
})

test('ESLint lints stripped .ts source with the regular JavaScript rules', () => {
  const linter = new Linter()
  const messages = linter.verify(
    'const value: number = 1\nconsole.log(value)\n',
    neostandard({ ts: 'strip' }),
    { filename: 'fixture.ts' }
  )

  assert.ok(!messages.some(message => message.fatal), JSON.stringify(messages))
})

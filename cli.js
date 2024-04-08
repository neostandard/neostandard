import { parseArgs } from 'node:util'

import cli from 'eslint/cli'

// FIXME: Extract as a parseArg with passthrough / remainder

const options = {
  semi: {
    type: 'boolean',
  },
}

const [first, second, ...foo] = process.argv

const { values, tokens } = parseArgs({
  strict: false,
  tokens: true,
})

for (const token of tokens) {
  if (token.kind !== 'option') {
    continue
  }
  if (!options[token.name]) {
    continue
  }
  foo[token.index] = undefined
}

const processedArgv = [first, second, ...foo.filter(item => item !== undefined)];

console.log(processedArgv);

await cli.execute(
  processedArgv,
  null,
  true
)

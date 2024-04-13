import { writeFile } from 'node:fs/promises'

import { trimNewlines } from 'trim-newlines'
import redent from 'redent'
import { availableChoices, incompatibleChoices } from './lib/options.js'

/**
 * @param {import('./lib/options.js').NeostandardChoices[]} parents
 * @param {readonly import('./lib/options.js').NeostandardChoices[]} input
 * @returns {Record<string, Record<string, true>>}
 */
function mapRemainder (parents, input) {
  /** @type {Record<string, Record<string, true>>} */
  let result = {}

  for (let i = 0; i < input.length; i++) {
    const value = input[i]

    if (!value) continue

    let remaining = input.slice(i + 1)

    const filter = incompatibleChoices[value]
    if (filter) {
      remaining = remaining.filter(item => !filter.includes(item))
    }

    const current = [...parents, value]
    const currentKey = current.join('-').toLowerCase()

    result = {
      ...result,
      [currentKey]: Object.fromEntries(current.map(item => [item, true])),
      ...mapRemainder(current, remaining),
    }
  }

  return result
}

const finalResult = mapRemainder([], availableChoices)

await Promise.all(Object.entries(finalResult).map(async ([fileSuffix, choices]) => {
  const filename = `configs/neostandard-${fileSuffix}.config.js`

  console.log('Writing', filename)

  const formattedChoices = JSON.stringify(choices)
    .replaceAll('":', ': ')
    .replaceAll('"', ' ')
    .replaceAll('true}', 'true }')

  return writeFile(filename, redent(trimNewlines(
    `
    import { neostandard } from '../index.js'

    export default neostandard(${formattedChoices})
    `
  )))
}))

import { base } from './configs/base.js'
import { modernization } from './configs/modernization.js'
import { semi } from './configs/semi.js'

import { typescriptify } from './ts.js'

export const neostandard = [
  base,
  modernization,
]

export const neostandardSemi = [
  ...neostandard,
  semi,
]

export const neostandardTs = typescriptify(neostandard)
export const neostandardTsSemi = typescriptify(neostandardSemi)

export const neostandardTsOnly = typescriptify(neostandardSemi, ['**/*.ts'])
export const neostandardTsOnlySemi = typescriptify(neostandardSemi, ['**/*.ts'])

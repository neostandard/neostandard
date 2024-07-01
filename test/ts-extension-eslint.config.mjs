import neostandard, { plugins } from '../index.js'

export default [
  ...neostandard({
    ts: true,
  }),
  ...plugins['typescript-eslint'].configs.recommended,
]

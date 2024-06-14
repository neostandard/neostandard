'use strict'

module.exports = /** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */({
  name: 'neostandard/semi',

  rules: {
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/no-extra-semi': 'error',
  },
})

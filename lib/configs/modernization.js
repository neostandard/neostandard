'use strict'

module.exports.modernization = /** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */ ({
  name: 'neostandard/modernization-since-standard-17',

  rules: {
    'dot-notation': 'off',
    // Caused many regressions
    // 'no-unused-vars': ['error', {
    //   vars: 'all',
    //   args: 'all',
    //   argsIgnorePattern: '^_',
    //   ignoreRestSiblings: true,
    // }],
    'n/no-deprecated-api': 'warn',
  },
})

module.exports.modernizationStyles = /** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */ ({
  name: 'neostandard/style/modernization-since-standard-17',

  rules: {
    '@stylistic/comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true }],
  },
})

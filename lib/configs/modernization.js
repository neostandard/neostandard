'use strict'

module.exports.modernization = /** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */ ({
  rules: {
    'dot-notation': 'off',
    'no-unused-vars': ['error', {
      vars: 'all',
      args: 'all',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }],
    'n/no-deprecated-api': 'warn',
  },
})

module.exports.modernizationStyles = /** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */ ({
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

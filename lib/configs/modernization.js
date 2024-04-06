// TODO: Use eslint-stylistic

/** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */
export const modernization = {
  rules: {
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'dot-notation': 'off',
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-unused-vars': ['error', {
      vars: 'all',
      args: 'all',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }],
    'n/no-deprecated-api': 'warn',
  },
}

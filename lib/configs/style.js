import stylistic from '@stylistic/eslint-plugin'

export default /** @satisfies {import('eslint').Linter.Config} */ ({
  name: 'neostandard/style',

  plugins: {
    // TODO: Remove type cast once https://github.com/eslint-stylistic/eslint-stylistic/issues/506 is fixed
    '@stylistic': /** @type {import('eslint').ESLint.Plugin} */ (stylistic),
  },
  rules: {
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
    '@stylistic/block-spacing': ['error', 'always'],
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/comma-dangle': ['error', {
      arrays: 'never',
      objects: 'never',
      imports: 'never',
      exports: 'never',
      functions: 'never',
    }],
    '@stylistic/comma-spacing': ['error', { before: false, after: true }],
    '@stylistic/comma-style': ['error', 'last'],
    '@stylistic/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
    '@stylistic/dot-location': ['error', 'property'],
    '@stylistic/eol-last': 'error',
    '@stylistic/function-call-spacing': ['error', 'never'],
    '@stylistic/generator-star-spacing': ['error', { before: true, after: true }],
    '@stylistic/indent': ['error', 2, {
      SwitchCase: 1,
      VariableDeclarator: 1,
      outerIIFEBody: 1,
      MemberExpression: 1,
      FunctionDeclaration: { parameters: 1, body: 1 },
      FunctionExpression: { parameters: 1, body: 1 },
      CallExpression: { arguments: 1 },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      ignoreComments: false,
      // Restores the pre-@stylistic-5.4 behaviour of not policing the indent of
      // the operator/RHS after a line-broken `=` (eslint-stylistic #933 added
      // this option with a new default of 1) — standard never had an opinion here.
      assignmentOperator: 'off',
      // JSX nodes were previously ignored here and handled by the (now removed)
      // @stylistic/jsx-indent rule; @stylistic/indent handles JSX natively
      // (eslint-stylistic #447 deprecated jsx-indent in favour of indent; #1019 removed it)
      ignoredNodes: [
        'TemplateLiteral *',
        // Opts out these from linting to avoid the regression noted in #393
        'TSTypeParameterInstantiation',
      ],
      // Restores pre-2.12 indentation behaviour (eslint-stylistic #633 regression / #636).
      // v5 object form of the former `offsetTernaryExpressions: true` + `offsetTernaryExpressionsOffsetCallExpressions: false`.
      offsetTernaryExpressions: { CallExpression: false, AwaitExpression: false, NewExpression: false },
    }],
    '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
    '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
    '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    '@stylistic/multiline-ternary': ['error', 'always-multiline'],
    '@stylistic/new-parens': 'error',
    '@stylistic/no-extra-parens': ['error', 'functions'],
    '@stylistic/no-floating-decimal': 'error',
    '@stylistic/no-mixed-operators': ['error', {
      groups: [
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
      allowSamePrecedence: true,
    }],
    '@stylistic/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    '@stylistic/no-tabs': 'error',
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/no-whitespace-before-property': 'error',
    '@stylistic/object-curly-newline': ['error', { multiline: true, consistent: true }],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    '@stylistic/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before', '|>': 'before' } }],
    '@stylistic/padded-blocks': ['error', { blocks: 'never', switches: 'never', classes: 'never' }],
    '@stylistic/quote-props': ['error', 'as-needed'],
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'never' }],
    '@stylistic/rest-spread-spacing': ['error', 'never'],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/semi-spacing': ['error', { before: false, after: true }],
    '@stylistic/space-before-blocks': ['error', 'always'],
    '@stylistic/space-before-function-paren': ['error', 'always'],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/space-unary-ops': ['error', { words: true, nonwords: false }],
    '@stylistic/spaced-comment': ['error', 'always', {
      line: { markers: ['*package', '!', '/', ',', '='] },
      block: { balanced: true, markers: ['*package', '!', ',', ':', '::', 'flow-include'], exceptions: ['*'] },
    }],
    '@stylistic/template-curly-spacing': ['error', 'never'],
    '@stylistic/template-tag-spacing': ['error', 'never'],
    '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
    '@stylistic/yield-star-spacing': ['error', 'both'],
  },
})

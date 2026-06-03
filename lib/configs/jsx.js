'use strict'

const JSX_IGNORES = ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts']

// React-specific *logic* rules (eslint-plugin-react) are temporarily removed
// because eslint-plugin-react is not yet compatible with ESLint 10
// (jsx-eslint/eslint-plugin-react#3977 — it peer-caps at ^9.7 and crashes at
// runtime). JSX *parsing* and the @stylistic JSX *style* rules below work
// without it. To reintroduce the React logic rules once a v10-compatible React
// plugin is adopted (classic eslint-plugin-react once #3977 ships, or
// @eslint-react), re-add eslint-plugin-react to package.json, re-enable the
// `react` plugin getter in index.js, and uncomment the `reactPlugin` require
// plus the `plugins`/`settings`/`rules` block marked below.
//
// const reactPlugin = require('eslint-plugin-react')

module.exports.jsx = /** @satisfies {import('eslint').Linter.Config} */ ({
  name: 'neostandard/jsx',

  ignores: [...JSX_IGNORES],

  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },

  // --- React logic rules: temporarily removed pending ESLint 10 support (issue #350) ---
  // plugins: {
  //   react: /** @type {import('eslint').ESLint.Plugin} */ (reactPlugin),
  // },
  //
  // settings: {
  //   react: {
  //     version: '17',
  //   },
  //   linkComponents: [
  //     'Link',
  //   ],
  // },
  //
  // rules: {
  //   'react/jsx-boolean-value': 'error',
  //   'react/jsx-fragments': ['error', 'syntax'],
  //   'react/jsx-handler-names': 'error',
  //   'react/jsx-key': ['error', {
  //     checkFragmentShorthand: true,
  //   }],
  //   'react/jsx-no-comment-textnodes': 'error',
  //   'react/jsx-no-duplicate-props': 'error',
  //   'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
  //   'react/jsx-no-undef': ['error', { allowGlobals: true }],
  //   'react/jsx-uses-react': 'error',
  //   'react/jsx-uses-vars': 'error',
  //   'react/no-children-prop': 'error',
  //   'react/no-danger-with-children': 'error',
  //   'react/no-deprecated': 'error',
  //   'react/no-direct-mutation-state': 'error',
  //   'react/no-find-dom-node': 'error',
  //   'react/no-is-mounted': 'error',
  //   'react/no-string-refs': ['error', {
  //     noTemplateLiterals: true,
  //   }],
  //   'react/no-unescaped-entities': ['error', {
  //     forbid: ['>', '}'],
  //   }],
  //   'react/no-render-return-value': 'error',
  //   'react/require-render-return': 'error',
  //   'react/self-closing-comp': 'error',
  // },
})

module.exports.jsxStyles = /** @satisfies {import('eslint').Linter.Config} */ ({
  name: 'neostandard/style/jsx',

  ignores: [...JSX_IGNORES],

  rules: {
    '@stylistic/jsx-quotes': ['error', 'prefer-single'],
    '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],
    '@stylistic/jsx-closing-tag-location': 'error',
    '@stylistic/jsx-curly-brace-presence': ['error', {
      props: 'never',
      children: 'never',
    }],
    '@stylistic/jsx-curly-newline': ['error', {
      multiline: 'consistent',
      singleline: 'consistent',
    }],
    '@stylistic/jsx-curly-spacing': ['error', {
      attributes: { when: 'never', allowMultiline: true },
      children: { when: 'never', allowMultiline: true },
    }],
    '@stylistic/jsx-equals-spacing': ['error', 'never'],
    '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    // @stylistic/jsx-indent (deprecated in v5) replaced by @stylistic/indent handling JSX — see lib/configs/style.js
    // @stylistic/jsx-props-no-multi-spaces (deprecated in v5) replaced by @stylistic/no-multi-spaces (in modernizationStyles)
    '@stylistic/jsx-indent-props': ['error', 2],
    '@stylistic/jsx-pascal-case': ['error', { allowAllCaps: false }],
    '@stylistic/jsx-tag-spacing': ['error', {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'never',
    }],
    '@stylistic/jsx-wrap-multilines': ['error', {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'ignore',
      condition: 'ignore',
      logical: 'ignore',
      prop: 'ignore',
    }],
  },
})

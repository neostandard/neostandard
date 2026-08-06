// File scoping (which extensions these configs apply to) is applied centrally
// in lib/main.js — see the `jsxFiles` scope there. These objects intentionally
// carry no `files`/`ignores` of their own.

// React-specific *logic* rules (eslint-plugin-react) are temporarily removed
// because eslint-plugin-react is not yet compatible with ESLint 10
// (jsx-eslint/eslint-plugin-react#3977 — it peer-caps at ^9.7 and crashes at
// runtime). JSX *parsing*, the @stylistic JSX *style* rules below, and the one
// high-value React *logic* rule — `key` in iterators — work without it: jsx-key
// is reimplemented natively in lib/plugin (the `neostandard/jsx-key` rule). To
// reintroduce the remaining React logic rules once a v10-compatible React plugin
// is adopted (classic eslint-plugin-react once #3977 ships, or @eslint-react),
// re-add eslint-plugin-react to package.json, re-enable the `react` plugin getter
// in index.js, and uncomment the `reactPlugin` import plus the
// `plugins`/`settings`/`rules` block marked below — but leave `react/jsx-key` out
// of it: it is superseded by the native `neostandard/jsx-key` rule above, and
// enabling both would double-report the same missing keys.
//
// import reactPlugin from 'eslint-plugin-react'

import neostandardPlugin from '../plugin/index.js'

export const jsx = /** @satisfies {import('eslint').Linter.Config} */ ({
  name: 'neostandard/jsx',

  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },

  plugins: {
    neostandard: neostandardPlugin,
  },

  rules: {
    'neostandard/jsx-key': ['error', { checkFragmentShorthand: true }],
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
  //   // superseded by neostandard/jsx-key above — leave disabled to avoid double-reporting
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

export const jsxStyles = /** @satisfies {import('eslint').Linter.Config} */ ({
  name: 'neostandard/style/jsx',

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

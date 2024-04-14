# neostandard

A modern equivalent to `standard`

## Usage

1. `npm install -D neostandard`
2. Add an `eslint.config.js` like:

    ```js
    import { neostandard } from 'neostandard'

    export default neostandard({
      // options
    })
    ```

    In CommonJS:

    ```js
    module.exports = require('neostandard')({
      // options
    })
    ```
3. Run `neostandard` by running ESLint, eg. using `npx eslint`, `npx eslint --fix` or similar

## Options

* `ignores` - _string[]_ - an array of glob patterns indicating the files that the config should not apply to
* `noStyle` - _boolean_ - if set, no style rules will be added
* `semi` - _boolean_ - if set, enforce rather than forbid semicolons

## Differences to standard / eslint-config-standard 17.x

* Uses ESLint flat configs to bundle plugins rather than relying on `standard-engine`
* Built upon ESLint 9
* Support for `.ts` files out of the box
* Contains `semistandard` as option in main package
* Uses [`eslint-stylistic`](https://eslint.style/) instead of [deprecated ESLint style rules](https://eslint.org/blog/2023/10/deprecating-formatting-rules/)
* Enables opting out of style rules (no need for eg. [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) anymore)

### Changed rules

* [`@stylistic/comma-dangle`](https://eslint.org/docs/rules/comma-dangle) – *changed* – set to prefer dangling commas in everything but functions and is it set to `warn` rather than `error`

### Relaxed rules

* [`@stylistic/no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) – *changed* – sets `ignoreEOLComments` to `true`, useful aligning comments across multiple line
* [`dot-notation`](https://eslint.org/docs/rules/dot-notation) – *deactivated* – clashes with the [`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature) check in TypeScript
* [`no-unused-vars`](https://eslint.org/docs/rules/no-unused-vars) – *changed* – sets `"args": "all", "argsIgnorePattern": "^_",` to be in sync with TypeScript `noUnusedParameters`
* [`n/no-deprecated-api`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-deprecated-api.md) – *changed* – changed to `warn` instead of `error` as they are not an urgent things to fix

### Missing bits

* Some plugins are not yet supporting ESLint 9 or flat configs and has thus not yet been added. These are: `eslint-plugin-import` and `eslint-plugin-promise`
* JSX parsing is not supported out of the box

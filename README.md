# neostandard

A modern equivalent to `standard`

## Usage

1. `npm install -D neostandard`
2. Add an `eslint.config.js`:

    Using config helper:

    ```sh
    npx neostandard --esm > eslint.config.js
    ```

    Or to get CommonJS:

    ```sh
    npx neostandard > eslint.config.js
    ```

    Or manually create the file as ESM:

    ```js
    import { neostandard } from 'neostandard'

    export default neostandard({
      // options
    })
    ```

    Or as CommonJS:

    ```js
    module.exports = require('neostandard')({
      // options
    })
    ```
3. Run `neostandard` by running ESLint, eg. using `npx eslint`, `npx eslint --fix` or similar

## Options

* `env` - _`string[]`_ - adds additional globals by importing them from the [globals](https://www.npmjs.com/package/globals) npm module
* `globals` - _`string[] | object`_ - an array of names of globals or an object of the same shape as ESLint [`languageOptions.globals`](https://eslint.org/docs/latest/use/configure/language-options#using-configuration-files)
* `ignores` - _`string[]`_ - an array of glob patterns indicating the files that the config should not apply to
* `noStyle` - _`boolean`_ - if set, no style rules will be added
* `noTs` - _`boolean`_ - if set, no `*.ts` (or `*.d.ts`) will be checked
* `semi` - _`boolean`_ - if set, enforce rather than forbid semicolons

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

* [`@stylistic/no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) – *changed* – sets `ignoreEOLComments` to `true`, useful for aligning comments across multiple line
* [`dot-notation`](https://eslint.org/docs/rules/dot-notation) – *deactivated* – clashes with the [`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature) check in TypeScript
* [`n/no-deprecated-api`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-deprecated-api.md) – *changed* – changed to `warn` instead of `error` as they are not an urgent things to fix

### Missing bits

* Some plugins are not yet supporting ESLint 9 or flat configs and has thus not yet been added. These are: `eslint-plugin-import` and `eslint-plugin-promise`
* JSX parsing is not supported out of the box

## Config helper

You can use the provided CLI tool to generate a config for you:

```sh
neostandard --semi --no-ts > eslint.config.js
```

To see all available flags, run:

```sh
neostandard --help
```

### Config migration

The CLI tool can also migrate an existing `"standard"` configuration from `package.json`:

```sh
neostandard --migrate > eslint.config.js
```

Migrations can also be extended, so to eg. migrate a `semistandard` setup, do:

```sh
neostandard --semi --migrate > eslint.config.js
```

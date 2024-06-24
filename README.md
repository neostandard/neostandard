<div align="center">
  <img
    src="assets/neostandard3.svg"
    width="650"
    height="auto"
    alt="neostandard"
  />
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/neostandard.svg?style=flat)](https://www.npmjs.com/package/neostandard)
[![npm downloads](https://img.shields.io/npm/dm/neostandard.svg?style=flat)](https://www.npmjs.com/package/neostandard)
[![neostandard javascript style](https://img.shields.io/badge/neo-standard-7fffff?style=flat\&labelColor=ff80ff)](https://github.com/neostandard/neostandard)

A spiritual successor to the [`standard`](https://github.com/standard/standard) javascript style guide

**Initial development sponsored by:**

<a href="https://platformatic.dev/"><img
src="assets/platformatic.svg"
width="450"
height="auto"
alt="platformatic"
/></a>

</div>

## Table of Contents

* [Quick Start](#quick-start)
  * [Migrate from `standard`](#migrate-from-standard)
  * [Add to new project](#add-to-new-project)
* [Configuration options](#configuration-options)
* [resolveIgnoresFromGitignore()](#resolveignoresfromgitignore)
* [Missing for 1.0.0 release](#missing-for-100-release)
* [Differences to standard / eslint-config-standard 17.x](#differences-to-standard--eslint-config-standard-17x)
  * [Changed rules](#changed-rules)
  * [Relaxed rules](#relaxed-rules)
  * [Missing bits](#missing-bits)
* [Config helper](#config-helper)
  * [Config migration](#config-migration)
* [Readme badges](#readme-badges)

## Quick Start

### Migrate from `standard`

1. `npm install -D neostandard eslint`
2. `npx neostandard --migrate > eslint.config.js` (uses our [config helper](#config-helper))
3. Replace `standard` with `eslint` in all places where you run `standard`, eg. `"scripts"` and `.github/workflows/` (`neostandard` CLI tracked in [#2](https://github.com/neostandard/neostandard/issues/2))
4. (Add ESLint editor integration, eg. [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint))
5. Cleanup:
   * `npm uninstall standard`
   * Remove unused `"standard"` top level key from your `package.json`
   * Deactivate `standard` specific integrations if you no longer use them (eg. [vscode-standard](https://marketplace.visualstudio.com/items?itemName=standard.vscode-standard)))

### Add to new project

1. `npm install -D neostandard eslint`
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

## Configuration options

* `env` - *`string[]`* - adds additional globals by importing them from the [globals](https://www.npmjs.com/package/globals) npm module
* `files` - *`string[]`* - additional file patterns to match. Uses the same shape as ESLint [`files`](https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores)
* `filesTs` - *`string[]`* - additional file patterns for the TypeScript configs to match. Uses the same shape as ESLint [`files`](https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores)
* `globals` - *`string[] | object`* - an array of names of globals or an object of the same shape as ESLint [`languageOptions.globals`](https://eslint.org/docs/latest/use/configure/language-options#using-configuration-files)
* `ignores` - *`string[]`* - an array of glob patterns for files that the config should not apply to, see [ESLint documentation](https://eslint.org/docs/latest/use/configure/ignore) for details
* `noStyle` - *`boolean`* - if set, no style rules will be added. Especially useful when combined with [Prettier](https://prettier.io/), [dprint](https://dprint.dev/) or similar
* `semi` - *`boolean`* - if set, enforce rather than forbid semicolons (same as `semistandard` did)
* `ts` - *`boolean`* - if set, TypeScript syntax will be supported and `*.ts` (including `*.d.ts`) will be checked. To add additional file patterns to the TypeScript checks, use `filesTs`

## resolveIgnoresFromGitignore()

Finds a `.gitignore` file that recides in the same directory as the ESLint config file and returns an array of ESLint ignores that matches the same files.

ESM:

```js
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'

export default neostandard({
  ignores: resolveIgnoresFromGitignore(),
})
```

CommonJS:

```js
module.exports = require('neostandard')({
  ignores: require('neostandard').resolveIgnoresFromGitignore(),
})
```

## Missing for 1.0.0 release

* Add JSX/TSX support: [#11](https://github.com/neostandard/neostandard/issues/11)
* Migrate `eslint-plugin-promise` rules from `standard`: [#14](https://github.com/neostandard/neostandard/issues/14)
* Migrate `eslint-plugin-import` rules from `standard`: [#15](https://github.com/neostandard/neostandard/issues/15)
* Investigate a dedicated `neostandard` runner: [#2](https://github.com/neostandard/neostandard/issues/2)
* Style rules for TypeScript files: [eslint-stylistic#414](https://github.com/eslint-stylistic/eslint-stylistic/issues/414)

Full list in [1.0.0 milestone](https://github.com/neostandard/neostandard/milestone/1)

## Differences to standard / eslint-config-standard 17.x

* Uses ESLint flat configs to bundle plugins rather than relying on `standard-engine`
* Built upon ESLint 9
* Support for `.ts` as option in main package
* Contains `semistandard` as option in main package
* Uses [`eslint-stylistic`](https://eslint.style/) instead of [deprecated ESLint style rules](https://eslint.org/blog/2023/10/deprecating-formatting-rules/)
* Enables opting out of style rules (no need for eg. [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) anymore)

### Changed rules

* [`@stylistic/comma-dangle`](https://eslint.org/docs/rules/comma-dangle) – *changed* – set to prefer dangling commas in everything but functions and is it set to `warn` rather than `error`

### Relaxed rules

* [`@stylistic/no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) – *changed* – sets `ignoreEOLComments` to `true`, useful for aligning comments across multiple line
* [`dot-notation`](https://eslint.org/docs/rules/dot-notation) – *deactivated* – clashes with the [`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature) check in TypeScript
* [`n/no-deprecated-api`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-deprecated-api.md) – *changed* – changed to `warn` instead of `error` as they are not urgent to fix

### Missing bits

* Some plugins are not yet supporting ESLint 9 or flat configs and has thus not yet been added. These are: `eslint-plugin-import` and `eslint-plugin-promise`
* JSX parsing is not supported out of the box

## Config helper

You can use the provided CLI tool to generate a config for you:

```sh
neostandard --semi --ts > eslint.config.js
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

## Readme badges

Yes! If you use `neostandard` in your project, you can include one of these badges in
your readme to let people know that your code is using the neostandard style.

[![neostandard javascript style](https://img.shields.io/badge/neo-standard-7fffff?style=flat\&labelColor=ff80ff)](https://github.com/neostandard/neostandard)

```md
[![neostandard javascript style](https://img.shields.io/badge/neo-standard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
```

[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat\&labelColor=ff80ff)](https://github.com/neostandard/neostandard)

```md
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
```

[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

```md
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)
```

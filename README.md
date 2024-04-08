# neostandard

A modern equivalent to `standard`

## Usage as CLI

TODO

## Usage as config

1. `npm install -D eslint@^9.0.0 neostandard`
2. Add an `eslint.config.js` like:

    ```js
    import { neostandard } from 'neostandard'

    export default neostandard({ semi: true, typeAwareJs: true })
    ```

    Or for the most basic setup:

    ```js
    export { default } from 'neostandard'
    ```

3. Run ESLint using `npx eslint .`, `npx eslint . --fix` or in some other way

## Options

* `semi` – _boolean_ – when set semi-colons will be enforced rather than banned (defaults to `false`)
* `noTs` – _boolean_ – deactivates type aware linting (defaults to `false`)
* `typeAwareJs` – _boolean_ – makes the type aware linting apply to JS-files as well, not just TS-files (defaults to `false`)

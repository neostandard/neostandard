# neostandard

A modern equivalent to `standard`

## Usage as CLI

1. `npm install -D neostandard`
2. `npx neostandard` / `npx neostandard --fix` / `npx neostandard --help`

## Usage as config

1. `npm install -D eslint@^9.0.0 neostandard`
2. Add an `eslint.config.js` like:

    ```js
    import { neostandard } from 'neostandard'

    export default neostandard({ semi: true, tsForJs: true })
    ```

    Or for the most basic setup:

    ```js
    export { default } from 'neostandard'
    ```

3. Run ESLint using `npx eslint .`, `npx eslint . --fix` or in some other way

## Options

* `semi` - _boolean_ - when set semi-colons will be enforced rather than banned (defaults to `false`)
* `noTs` - _boolean_ - deactivates all TypeScript based linting (defaults to `false`)
* `tsForJs` - _boolean_ - activates TypeScript based linting for JavaScript files (defaults to `false`)
* `typeChecking` - _boolean_ - activates type checking rules (defaults to `false`)

### Additional TypeScript Eslint Parser options

* [`project`](https://typescript-eslint.io/packages/parser/#project) - can be useful when `typeChecking` is on
* [`tsconfigRootDir`](https://typescript-eslint.io/packages/parser/#tsconfigrootdir) - can be useful when `typeChecking` is on

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
    module.exports = require('./')({
      // options
    })
    ```
3. Run `neostandard` by running ESLint, eg. using `npx eslint`, `npx eslint --fix` or similar

## Options

* `semi` - _boolean_ - enforce rather than forbid semicolons (defaults to `false`)

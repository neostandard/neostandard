# Example

Prose that lints clean under `@eslint/markdown`'s own rules.

The fenced JavaScript block below intentionally violates neostandard rules
(`no-var`, `@stylistic/semi`). neostandard must NOT lint it — fenced code blocks
are out of scope (see issue #296). If neostandard leaked onto the block, this
fixture would fail `test:markdown`.

```js
var x = 1;
console.log(x);
```

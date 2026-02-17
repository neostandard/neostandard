## Summary

Upgrade neostandard to support ESLint 10.

**BREAKING CHANGE:** Requires Node.js ^20.19.0 || ^22.13.0 || >=24.0.0

## Changes

### Dependencies
- `eslint` peer dependency: `^9.0.0` → `^10.0.0`
- `@stylistic/eslint-plugin`: `2.11.0` → `^5.8.0` (ESM-only, works via require(esm))
- `@types/node`: `^18.19.130` → `^20.19.33`

### Rule Changes (@stylistic/eslint-plugin 5.x)
- `@stylistic/func-call-spacing` → `@stylistic/function-call-spacing` (renamed)
- `allowMultiplePropertiesPerLine` → `allowAllPropertiesOnSameLine` (option renamed in `object-property-newline`)
- `allowTemplateLiterals: false` → `allowTemplateLiterals: 'never'` (deprecated boolean value in `quotes`)

### TypeScript Config
- Extended from `node20.json` instead of `node18.json`
- Added `module: "nodenext"` and `moduleResolution: "nodenext"` to support require(esm) for ESM-only dependencies

### CI
- Dropped Node.js 18 from test matrix (no longer supported with ESLint 10)

## Upstream Blockers

The following plugins **work correctly** with ESLint 10 but don't yet declare it in their peer dependencies:

| Plugin | Issue | Status |
|--------|-------|--------|
| `typescript-eslint` | [#11952](https://github.com/typescript-eslint/typescript-eslint/issues/11952) | Blocked by [#11762](https://github.com/typescript-eslint/typescript-eslint/issues/11762) |
| `eslint-plugin-promise` | [#616](https://github.com/eslint-community/eslint-plugin-promise/issues/616) | Open |
| `eslint-plugin-react` | [#3977](https://github.com/jsx-eslint/eslint-plugin-react/issues/3977) | Open |

## Deprecation Warnings

The following @stylistic rules show deprecation warnings (still functional):
- `jsx-indent` - suggests using `indent` instead
- `jsx-props-no-multi-spaces` - suggests using `no-multi-spaces` instead

These are kept for now as they provide specific JSX handling.

## What's Left To Do

- [ ] Wait for `typescript-eslint` to add ESLint 10 peer dependency support
- [ ] Wait for `eslint-plugin-promise` to add ESLint 10 peer dependency support
- [ ] Wait for `eslint-plugin-react` to add ESLint 10 peer dependency support
- [ ] Once all plugins support ESLint 10, `check-peer-compatibility` will pass
- [ ] Consider addressing @stylistic deprecation warnings (optional)

## Test Plan

- [x] `npm test` passes
- [x] `npm run check:lint` passes
- [x] `npm run check:tsc` passes
- [ ] `npm run check-peer-compatibility` fails (blocked by upstream)

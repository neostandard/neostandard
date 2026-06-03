# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**neostandard** is a modern successor to `standard` — an ESLint **shareable config** distributed as a flat-config (ESLint 9+) array. It is plain JavaScript (CommonJS) typed with JSDoc; `tsc` only type-checks and emits `.d.ts` declarations — there is **no compile step**, the `.js` you edit is the `.js` that ships.

It replaces a family of separate packages with one configurable function:
- `ts: true` → what `ts-standard` did
- `semi: true` → what `semistandard` did
- `noStyle: true` → drops all formatting rules (pair with Prettier/dprint)
- `noJsx: true` → drops React/JSX rules

It sits at the **base of a dependency stack** (`eslint → @voxpelli/eslint-config → neostandard → @stylistic`). Consumers inherit its choices, so **stability governs version ranges over novelty** (see the @stylistic pin below).

## Architecture

`neostandard(options)` returns an `import('eslint').Linter.Config[]` — a flat-config **array**, not a single object. Tracing the data flow matters because order and composition are deliberate:

- **`index.js`** — public surface. Re-exports the `neostandard` function, `resolveIgnoresFromGitignore()`, and a `plugins` object. `plugins` uses **lazy getters** (`@stylistic`, `n`, `promise`, `react`, `typescript-eslint`) so consumers can layer extra config using the *exact same plugin instances* neostandard uses, without eager `require()` cost.
- **`lib/main.js`** — the composer. Resolves `env`/`globals` (via the `globals` package), computes the positive **file scopes**, then assembles the array in this order: lone-key `{ ignores }` first (must be alone to count as a *global* ignore per ESLint), then `neostandard/globals`, then the JS layers, then a single TypeScript block last. Throws if `filesTs` is passed without `ts`. **Every emitted layer carries a positive `files` scope** so neostandard only ever touches the JS/TS files it owns and never leaks onto other languages a consumer layers on (`@eslint/markdown`, `@eslint/json`, …) — this is the #296 fix. The scopes: the core rule layers + `globals` get `jsTsFiles` (`**/*.{js,cjs,mjs,jsx}` + user `files`, plus `**/*.{ts,tsx}` + `filesTs` when `ts`) because the TS block only *adds overrides* (see `lib/ts.js`) and relies on these layers for the actual ruleset; the `jsx`/`style/jsx` layers get the narrower `jsxFiles` (`**/*.jsx`, `**/*.tsx`); the TS block gets `tsFiles`. Every layer also carries `ignores: ['**/*.md/**']` so neostandard's rules stay off Markdown fenced code blocks (the virtual `*.md/*.js` files from `@eslint/markdown`'s processor).
- **`lib/configs/*`** — each file is one (or two) complete flat-config object(s), composed as layers:
  - `base.js` — core best-practice rules + `n` and `promise` plugins (always on)
  - `modernization.js` — exports `modernization` (relaxations since standard 17, e.g. `n/no-deprecated-api` → warn, `dot-notation` relaxed) and `modernizationStyles` (always on; style-only relaxations gated by `noStyle`)
  - `style.js` — `@stylistic` rules; default is **no semicolons**
  - `semi.js` — flips `@stylistic/semi` to `always`; included only when `semi: true`
  - `jsx.js` — exports `jsx` (react rules) and `jsxStyles`; included unless `noJsx`
  - `ts-redundant.js` — map of ~20 core rules set to `off` because TypeScript already enforces them
- **`lib/ts.js`** — `typescriptify(jsConfigs, opts)`. Takes the assembled JS configs and produces **one** TS config block: swaps in the typescript-eslint parser/plugin, turns off `ts-redundant` rules, and replaces core rules with their `@typescript-eslint/*` equivalents where one exists. This is why there's no duplicated TS ruleset — the JS rules are transformed, not re-authored.
- **`lib/resolve-gitignore.js`** — `resolveIgnoresFromGitignore()`: walks up to the flat-config dir, converts `.gitignore` lines to minimatch via `@humanwhocodes/gitignore-to-minimatch`. Consumers call it inside their `ignores`.
- **`cli.mjs`** — the `neostandard` bin is a **config generator, not a linter**. It prints an ESLint flat-config file (CJS or `--esm`) and supports `--migrate` (reads `package.json`, lifts `env`/`globals`/`ignore` from a `standard`/`semistandard`/`ts-standard` config). Built on `peowly` for arg parsing.

## Commands

```bash
npm test                  # full gate: runs `check` then `test:*`  (also the pre-push husky hook)
npm run check             # clean, then all check:* IN PARALLEL (run-p)
npm run check:lint        # eslint --report-unused-disable-directives .
npm run check:tsc         # tsc type-check only (no emit)
npm run check:knip        # dead-code / unused-export detection
npm run check:type-coverage   # type-coverage --strict --at-least 95 (test/* exempt)
npm run check:installed-check  # dependency version + engines check
npm run build             # clean + emit .d.ts via declaration.tsconfig.json
```

There is **no unit-test runner** (no Jest/node:test). The test suite *is* ESLint linting itself:
- `npm run test:eslint` — runs `eslint .` over the repo. The fixtures in `test/should-work-with-*/` must lint clean and `test/should-be-ignored/` must be skipped. The repo's own `eslint.config.js` is the config under test.
- `npm run test:tseslint-extension` — lints `test/test-types.d.ts` with `test/ts-extension-eslint.config.mjs` to verify neostandard composes with extra typescript-eslint rules.

To exercise a single behaviour, add or edit a fixture under `test/should-work-with-*/` and run `npm run test:eslint` (or `npx eslint <path>` directly). To verify a config-shape change, also run `npm run check:tsc`.

## Conventions and gotchas

- **`@stylistic/eslint-plugin` is pinned exactly (`2.11.0`, no caret) — keep it that way.** @stylistic treats *adding rules to shared configs* as non-breaking, so a caret range would silently inject new lint errors into every downstream consumer. Bumping it is a deliberate, tested migration, not a Renovate auto-merge.
- **JSDoc is the type source.** `type-coverage` enforces ≥95% (tests exempt). Every new param/return needs annotation or `check:type-coverage` fails. Prefer `unknown` + type guards over `any`.
- **Two-tsconfig split:** `tsconfig.json` checks everything (incl. tests, `jsx: preserve`); `declaration.tsconfig.json` extends it but emits `.d.ts` for `index.js` only. Don't merge them.
- **`.npmrc` sets `legacy-peer-deps=true`** — installs here tolerate peer mismatches by design.
- **No import-checking plugin.** `eslint-plugin-import-x` was removed in 0.13.0; TS projects rely on `tsc` for import validation. Don't add it back without discussion (README documents how consumers opt back in).
- Peer dependency is currently `eslint: ^9.0.0`. Releases are automated via **release-please** — don't hand-edit `CHANGELOG.md` or bump `version`.

## dependents-data/ — ecosystem compatibility tracking

A distinctive subsystem: a curated, filtered registry of real-world npm packages that depend on `standard`/`semistandard`/`ts-standard`/`neostandard`, used to catch breaking changes *in the wild* before release. Most of the `chore(dependents): …` commits come from here.

- `source/*.ndjson` raw registry data → `*-filtered.ndjson` (download/age gated, known-failures excluded) → `*.json` simplified repo lists.
- `known-failures/*.json` whitelist legitimate incompatibilities (with reasons) so CI signal stays clean.
- Maintainer scripts (rarely run by hand): `sync-refresh` (metadata only), `sync-update` (full re-discovery), `sync-update-canary` (neostandard only). These run on schedules via `.github/workflows/sync-*.yml` and open auto-PRs. `canary.yml` tests HEAD against direct + indirect dependents on every push to main.

This data is maintenance tooling — changes to it are almost never part of a feature/fix to the config itself.

## Governance

Decisions follow **lazy consensus** (ASF-style): silence is consent after ~1 week, with a minimum of 1 lead + 2 team approvals for active consent. See `GOVERNANCE.md`.

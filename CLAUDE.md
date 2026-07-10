# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**neostandard** is a modern successor to `standard` — an ESLint **shareable config** distributed as a flat-config (ESLint 9/10) array. It is plain JavaScript (ESM, `"type": "module"`) typed with JSDoc; `tsc` only type-checks and emits `.d.ts` declarations — there is **no compile step**, the `.js` you edit is the `.js` that ships. CommonJS consumers are served via require(esm): `index.js` has an `export { neostandard as 'module.exports' }` interop export, so `require('neostandard')` returns the callable (but NOT `plugins`/`resolveIgnoresFromGitignore` — those are ESM named exports only).

It replaces a family of separate packages with one configurable function:
- `ts: true` → what `ts-standard` did
- `semi: true` → what `semistandard` did
- `noStyle: true` → drops all formatting rules (pair with Prettier/dprint)
- `noJsx: true` → drops JSX parsing and JSX style rules (React logic rules from `eslint-plugin-react` are currently absent pending ESLint 10 support — see issue #350)

It sits at the **base of a dependency stack** (`eslint → @voxpelli/eslint-config → neostandard → @stylistic`). Consumers inherit its choices, so **stability governs version ranges over novelty** (see the @stylistic pin below).

## Architecture

`neostandard(options)` returns an `import('eslint').Linter.Config[]` — a flat-config **array**, not a single object. Tracing the data flow matters because order and composition are deliberate:

- **`index.js`** — public surface. **Named exports are the primary API**: `neostandard`, `resolveIgnoresFromGitignore`, `plugins` (a default export of the bare `neostandard` function remains as a 0.13-era compat alias). `plugins` uses **lazy getters** (`@stylistic`, `n`, `promise`, `neostandard`, `typescript-eslint`) so consumers can layer extra config using the *exact same plugin instances* neostandard uses, without eager loading cost. The getters (and the lazy jsx/style/ts layer loads in `lib/main.js`) go through `createRequire` + require(esm), which shares the ESM module registry — including `lib/tseslint.js`, a tiny indirection that pins the getter to the ESM build of the dual-published `typescript-eslint` (a bare `require` would grab its CJS build and break instance identity). (`react` is omitted while `eslint-plugin-react` is incompatible with ESLint 10 — issue #350; the one reimplemented rule is exposed via the `neostandard` getter — see `lib/plugin/` below.)
- **`lib/main.js`** — the composer. Resolves `env`/`globals` (via the `globals` package), computes the positive **file scopes**, then assembles the array in this order: lone-key `{ ignores }` first (must be alone to count as a *global* ignore per ESLint), then `neostandard/globals`, then the JS layers, then a single TypeScript block last. Throws if `filesTs` is passed without `ts`. **Every rule-bearing layer carries a positive `files` scope** so neostandard only ever touches the JS/TS files it owns and never leaks onto other languages a consumer layers on (`@eslint/markdown`, `@eslint/json`, …) — this is the #296 fix. (The lone-key `{ ignores }` block is the exception: ESLint requires it to have no other keys to count as a *global* ignore, so it carries neither `files` nor the md-block `ignores`.) The scopes: the core rule layers + `globals` get `jsTsFiles` (`**/*.{js,cjs,mjs,jsx}` + user `files`, plus `**/*.{ts,tsx}` + `filesTs` when `ts`) because the TS block only *adds overrides* (see `lib/ts.js`) and relies on these layers for the actual ruleset; the `jsx`/`style/jsx` layers get the narrower `jsxFiles` (`**/*.jsx`, `**/*.tsx`, + user `files`); the TS block gets `tsFiles`. Every rule-bearing layer also carries `ignores: ['**/*.md/**']` so neostandard's rules stay off Markdown fenced code blocks (the virtual `*.md/*.js` files from `@eslint/markdown`'s processor).
- **`lib/configs/*`** — each file is one (or two) complete flat-config object(s), composed as layers:
  - `base.js` — core best-practice rules + `n` and `promise` plugins (always on)
  - `modernization.js` — exports `modernization` (relaxations since standard 17, e.g. `n/no-deprecated-api` → warn, `dot-notation` relaxed) and `modernizationStyles` (always on; style-only relaxations gated by `noStyle`)
  - `style.js` — `@stylistic` rules; default is **no semicolons**
  - `semi.js` — flips `@stylistic/semi` to `always`; included only when `semi: true`
  - `jsx.js` — exports `jsx` (JSX parsing via `ecmaFeatures.jsx`, plus the `neostandard/jsx-key` rule via the internal plugin) and `jsxStyles` (`@stylistic` JSX formatting rules); included unless `noJsx`. React-specific logic rules (`eslint-plugin-react`) are currently absent pending ESLint 10 support (issue #350)
  - `ts-redundant.js` — map of ~20 core rules set to `off` because TypeScript already enforces them
- **`lib/ts.js`** — `typescriptify(jsConfigs, opts)`. Takes the assembled JS configs and produces **one** TS config block: swaps in the typescript-eslint parser/plugin, turns off `ts-redundant` rules, and replaces core rules with their `@typescript-eslint/*` equivalents where one exists. This is why there's no duplicated TS ruleset — the JS rules are transformed, not re-authored.
- **`lib/plugin/`** — the internal `neostandard` ESLint plugin (`lib/plugin/index.js`). Currently exposes one rule: `neostandard/jsx-key` (`lib/plugin/rules/jsx-key.js`), a dependency-free ESLint-10-native reimplementation of the `jsx-key` rule from `eslint-plugin-react`, covering the common cases (array literals, `.map`/`.flatMap`/`Array.from` callbacks; spread attributes are *not* treated as an implicit key — parity with upstream). Logical/conditional wrappers (`x && <li/>`, ternaries) are unwrapped both in callback returns *and* as array-literal elements — the latter is a deliberate superset of upstream, which only unwraps inside callbacks (see the header comment in `jsx-key.js` for the full parity/superset list). JSX AST node typedefs live in `lib/plugin/jsx-types.d.ts` (named `*-types.d.ts` so `clean:declarations-lib` does not delete it). The plugin instance is also exposed as `plugins.neostandard` on the public surface (`index.js`).
- **`lib/resolve-gitignore.js`** — `resolveIgnoresFromGitignore()`: walks up to the flat-config dir, converts `.gitignore` lines to minimatch via `@humanwhocodes/gitignore-to-minimatch`. Consumers call it inside their `ignores`.
- **`cli.js`** — the `neostandard` bin is a **config generator, not a linter**. It prints an ESLint flat-config file (CJS or `--esm`) and supports `--migrate` (reads `package.json`, lifts `env`/`globals`/`ignore` from a `standard`/`semistandard`/`ts-standard` config). Built on `peowly` for arg parsing.

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

The test suite has two kinds of tests:

**ESLint-as-tests** (linting IS the assertion):
- `npm run test:eslint` — runs `eslint .` over the repo. The fixtures in `test/should-work-with-*/` must lint clean and `test/should-be-ignored/` must be skipped. The repo's own `eslint.config.js` is the config under test.
- `npm run test:json` — lints `test/should-work-with-json/` with `test/json-eslint.config.js` via `@eslint/json` (proves neostandard doesn't leak onto `.json`).
- `npm run test:markdown` — lints `test/should-work-with-markdown/` with `test/markdown-eslint.config.js` via `@eslint/markdown` (proves neostandard doesn't leak onto Markdown or its fenced blocks).
- `npm run test:tseslint-extension` — lints `test/test-types.d.ts` with `test/ts-extension-eslint.config.js` to verify neostandard composes with extra typescript-eslint rules.

**`node:test` unit tests** (for the internal plugin rules + option shape):
- `npm run test:rules` — `node --test test/rules/*.test.js`. Covers `neostandard/jsx-key` (`test/rules/jsx-key.test.js`) and the `neostandard()` option matrix (`test/rules/options.test.js`). This is the first `node:test` runner in the repo.

To exercise a single behaviour, add or edit a fixture under `test/should-work-with-*/` and run `npm run test:eslint` (or `npx eslint <path>` directly). To verify a config-shape change, also run `npm run check:tsc`. To test a plugin rule or option change, run `npm run test:rules`.

## Conventions and gotchas

- **`@stylistic/eslint-plugin` is pinned exactly (`5.10.0`, no caret) — keep it that way.** @stylistic treats *adding rules to shared configs* as non-breaking, so a caret range would silently inject new lint errors into every downstream consumer. Bumping it is a deliberate, tested migration, not a Renovate auto-merge.
- **JSDoc is the type source.** `type-coverage` enforces ≥95% (tests exempt). Every new param/return needs annotation or `check:type-coverage` fails. Prefer `unknown` + type guards over `any`.
- **Two-tsconfig split:** `tsconfig.json` checks everything (incl. tests, `jsx: preserve`); `declaration.tsconfig.json` extends it but emits `.d.ts` for `index.js` only. Don't merge them.
- **`.npmrc` sets `legacy-peer-deps=true`** — installs here tolerate peer mismatches by design.
- **No import-checking plugin.** `eslint-plugin-import-x` was removed in 0.13.0; TS projects rely on `tsc` for import validation. Don't add it back without discussion (README documents how consumers opt back in).
- Peer dependency is currently `eslint: ^9.22.0 || ^10.0.0` (the `9.22` floor is where `eslint/config`'s `defineConfig` landed, which the README's extending examples use). Engines: `node ^22.13.0 || >=24` — matches ESLint 10's own Node 22 floor, and everything the ESM package relies on (require(esm) + the `'module.exports'` interop export) shipped in Node 22.12. Releases are automated via **release-please** — don't hand-edit `CHANGELOG.md` or bump `version`.
- **Effective TypeScript ceiling is 6.0** — `typescript-eslint`'s peer is `>=4.8.4 <6.1.0`, and TypeScript 7 (the Go-native compiler) cannot be the installed `typescript` package for linting at all: its main export has no compiler API (until TS 7.1), so `@typescript-eslint/parser` fails at runtime even for non-type-aware use, and npm ERESOLVEs the peer. TS7 users keep `typescript@npm:@typescript/typescript6` for tooling and alias TS7 separately for `tsc` (Microsoft's documented side-by-side setup).
- **`build:2-quote-interop-export` is a workaround for a TypeScript ≤6.0 emitter bug**: declaration emit drops the quotes from `export { … as 'module.exports' }`, producing a syntactically invalid `index.d.ts` (fixed in TS 7). Remove the step once the repo's TypeScript emits it correctly.

## dependents-data/ — ecosystem compatibility tracking

A distinctive subsystem: a curated, filtered registry of real-world npm packages that depend on `standard`/`semistandard`/`ts-standard`/`neostandard`, used to catch breaking changes *in the wild* before release. Most of the `chore(dependents): …` commits come from here.

- `source/*.ndjson` raw registry data → `*-filtered.ndjson` (download/age gated, known-failures excluded) → `*.json` simplified repo lists.
- `known-failures/*.json` whitelist legitimate incompatibilities (with reasons) so CI signal stays clean.
- Maintainer scripts (rarely run by hand): `sync-refresh` (metadata only), `sync-update` (full re-discovery), `sync-update-canary` (neostandard only). These run on schedules via `.github/workflows/sync-*.yml` and open auto-PRs. `canary.yml` tests HEAD against direct + indirect dependents on every push to main.

This data is maintenance tooling — changes to it are almost never part of a feature/fix to the config itself.

## Governance

Decisions follow **lazy consensus** (ASF-style): silence is consent after ~1 week, with a minimum of 1 lead + 2 team approvals for active consent. See `GOVERNANCE.md`.

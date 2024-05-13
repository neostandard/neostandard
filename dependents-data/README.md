# Dependents data

## Created using

In `./dependents-data/source/`:

```sh
npx list-dependents init -n eslint-config-semistandard
npx list-dependents init -n eslint-config-standard-with-typescript
npx list-dependents init -n eslint-config-standard
npx list-dependents init -n semistandard
npx list-dependents init -n snazzy
npx list-dependents init -n standard
npx list-dependents init -n standardx
npx list-dependents init -n ts-standard
```

## Update using

In `./dependents-data/source/`:

```sh
npx list-dependents update -n eslint-config-semistandard
npx list-dependents update -n eslint-config-standard-with-typescript
npx list-dependents update -n eslint-config-standard
npx list-dependents update -n semistandard
npx list-dependents update -n snazzy
npx list-dependents update -n standard
npx list-dependents update -n standardx
npx list-dependents update -n ts-standard
```

## Refresh using

In `./dependents-data/source/`:

```sh
npx list-dependents refresh eslint-config-semistandard.ndjson
npx list-dependents refresh eslint-config-standard-with-typescript.ndjson
npx list-dependents refresh eslint-config-standard.ndjson
npx list-dependents refresh semistandard.ndjson
npx list-dependents refresh snazzy.ndjson
npx list-dependents refresh standard.ndjson
npx list-dependents refresh standardx.ndjson
npx list-dependents refresh ts-standard.ndjson
```

## Filter using

From `./`:

```sh
npx list-dependents filter -i dependents-data/source/standard.ndjson -o dependents-data/standard-filtered.ndjson --min-downloads=100000 --max-count=30 --sort-download
```

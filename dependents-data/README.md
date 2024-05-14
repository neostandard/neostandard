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
npx list-dependents refresh -n eslint-config-semistandard
npx list-dependents refresh -n eslint-config-standard-with-typescript
npx list-dependents refresh -n eslint-config-standard
npx list-dependents refresh -n semistandard
npx list-dependents refresh -n snazzy
npx list-dependents refresh -n standard
npx list-dependents refresh -n standardx
npx list-dependents refresh -n ts-standard
```

## Filter using

From `./`:

```sh
npx list-dependents filter -i dependents-data/source/standard.ndjson -o dependents-data/standard-filtered.ndjson --min-downloads=100000 --max-count=30 --sort-download --max-age=550 --repository-prefix=https://github.com/
npx list-dependents filter -i dependents-data/source/eslint-config-standard.ndjson -o dependents-data/eslint-config-standard-filtered.ndjson --min-downloads=5000 --max-count=30 --sort-download --max-age=550 --repository-prefix=https://github.com/
```

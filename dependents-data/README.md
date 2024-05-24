# Dependents data

## Update using

```sh
npm run dependents-update
```

Or, to update a single one:

```sh
npm run dependents-update-one -- standard
```

## Refresh using

```sh
npm run dependents-refresh
```

Or, to refresh a single one:

```sh
npm run dependents-refresh-one -- standard
```

## Filter using

```sh
npx list-dependents filter -i dependents-data/source/standard.ndjson -o dependents-data/standard-filtered.ndjson --min-downloads=100000 --max-count=30 --sort-download --max-age=550 --repository-prefix=https://github.com/ --target-version=">=16.0.0"
npx list-dependents filter -i dependents-data/source/eslint-config-standard.ndjson -o dependents-data/eslint-config-standard-filtered.ndjson --min-downloads=5000 --max-count=30 --sort-download --max-age=550 --repository-prefix=https://github.com/ --target-version=">=16.0.0"
npx list-dependents filter -i dependents-data/source/eslint-config-semistandard.ndjson -o dependents-data/eslint-config-semistandard-filtered.ndjson --min-downloads=5000 --max-count=30 --sort-download --max-age=550 --repository-prefix=https://github.com/ --target-version=">=16.0.0"
```

## Add dependents for another project

Add the module to [`projects.json`](./projects.json)

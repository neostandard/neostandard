// Exists to ensure there is some *.ts file for the linting to target

// Leading-pipe unions are the dominant hand-written d.ts idiom. @stylistic 5
// started checking TS type operators (eslint-stylistic #805); neostandard
// ignores `|`/`&` placement on TS files (see lib/ts.js) so this stays valid.
type FooKind =
  | 'bar'
  | 'abc'

interface Foo {
  bar: string
  abc?: boolean
  kind: FooKind
}

import markdown from '@eslint/markdown'

import neostandard from '../index.js'

// Regression test for issue #296: neostandard must compose with @eslint/markdown
// without leaking its JS rules onto Markdown. neostandard is intentionally NOT
// given `files: ['**/*.md']` — it should keep its hands off non-JS files on its
// own. The markdown processor extracts fenced code into virtual `*.md/*.js`
// files; neostandard's `**/*.md/**` ignore keeps its rules off those too.
export default [
  ...neostandard(),
  ...markdown.configs.processor,
]

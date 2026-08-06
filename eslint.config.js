import { neostandard, resolveIgnoresFromGitignore } from './index.js'

export default neostandard({
  // Added for testing purposes, see test/should-work-with-globals/*
  globals: ['assertsFoo'],
  // Added for testing purposes, see test/should-work-with-globals/*
  env: ['mocha'],
  ignores: [
    ...resolveIgnoresFromGitignore(),
    // Added for testing purposes
    '**/should-be-ignored/**',
  ],
  ts: true,
})

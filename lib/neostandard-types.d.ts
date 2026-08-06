import type { Linter } from 'eslint'

export interface NeostandardEnvOptions {
  /**
   * Resolves globals for the provided environment names using the globals module
   *
   * @see {@link https://www.npmjs.com/package/globals}
   */
  env?: Array<keyof typeof import('globals')> | undefined;
  /**
   * The base globals that should be considered available
   *
   * @see {@link https://eslint.org/docs/latest/use/configure/language-options#specifying-globals}
   */
  globals?: Linter.Globals | string[] | undefined;
}

export interface NeostandardSyntaxOptions {
  /**
   * When set, skips JSX parsing and JSX style rules.
   *
   * Note: React-specific logic rules (eslint-plugin-react) are currently not included regardless, pending ESLint 10 support — see issue #350
   */
  noJsx?: boolean | undefined;
  /** When set, enables same checks for TypeScript files */
  ts?: boolean | undefined;
}

export interface NeostandardStyleOptions {
  /** When set, skips style rules */
  noStyle?: boolean | undefined;
  /** When set, enforces rather than forbids semicolons (classic "semistandard" style) */
  semi?: boolean | undefined;
}

export interface NeostandardFilePatternOptions extends NeostandardSyntaxOptions {
  /**
   * File patterns, in minimatch syntax, the config applies to
   * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores}
   */
  files?: string[] | undefined;
  /** Additional file patterns, in minimatch syntax, that TS rules will to apply to */
  filesTs?: string[] | undefined;
  /** Patterns in minimatch syntax for files to ignore */
  ignores?: string[] | undefined;
}

export interface NeostandardJsConfigsOptions extends NeostandardSyntaxOptions, NeostandardStyleOptions {}

export interface NeostandardOptions extends NeostandardFilePatternOptions, NeostandardEnvOptions, NeostandardStyleOptions {}

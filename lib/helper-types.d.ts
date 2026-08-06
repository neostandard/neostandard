type NoUndefined<T> = T extends undefined ? never : T
/** Useful when you want to keep defaults at a central place */
export type NoUndefinedProperties<T> = { [P in keyof T]-?: NoUndefined<T[P]> }

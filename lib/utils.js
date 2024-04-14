/**
 * @template A
 * @template B
 * @param {A[]} a
 * @param {B[]} b
 * @returns {Array<A & B>}
 */
export function intersection (a, b) {
  /** @type {Array<A & B>} */
  const result = []

  for (const item of a) {
    const typedItem = /** @type {A & B} */ (/** @type {unknown} */ (item))
    if (b.includes(typedItem)) {
      result.push(typedItem)
    }
  }

  return result
}

/** Preserve pool order when filtering selected ids. */
export function orderedPoolSelection<TId extends string | number>(
  pool: readonly TId[],
  selected: readonly TId[],
): TId[] {
  const selectedSet = new Set(selected)
  return pool.filter((id) => selectedSet.has(id))
}

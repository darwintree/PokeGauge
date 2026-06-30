/** Preserve pool order when filtering selected ids. */
export function orderedPoolSelection(
  pool: readonly string[],
  selected: readonly string[],
): string[] {
  const selectedSet = new Set(selected)
  return pool.filter((id) => selectedSet.has(id))
}

export function convolveSparseDistributions(
  distributions: readonly ReadonlyMap<number, number>[],
): ReadonlyMap<number, number> {
  let result = new Map([[0, 1]])

  for (const distribution of distributions) {
    const next = new Map<number, number>()

    for (const [leftValue, leftProbability] of result) {
      for (const [rightValue, rightProbability] of distribution) {
        const value = leftValue + rightValue
        next.set(
          value,
          (next.get(value) ?? 0) + leftProbability * rightProbability,
        )
      }
    }

    result = next
  }

  return result
}

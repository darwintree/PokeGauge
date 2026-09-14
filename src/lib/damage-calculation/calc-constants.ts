import { Generations } from "@smogon/calc"
import type { Generation, ID } from "@smogon/calc/dist/data/interface"
import type { CalculationRules } from "@/lib/calculation-rules"

/** The general catalog remains independent of calculation rules. */
export const CALC_GEN = 9

/** VGC Level 50 — tournament standard for doubles */
export const VGC_LEVEL = 50

/**
 * Shared Gen 9 Generation singleton.
 * @smogon/calc's Generations.get() rebuilds six data collections on every
 * call, and its Pokemon/Move/calculate entry points re-invoke it whenever they
 * receive a numeric gen. Reusing one instance avoids that per-call churn.
 */
export const CALC_GENERATION = Generations.get(CALC_GEN)

const champions = Generations.get(0)

type CalcCatalog<T> = {
  get(id: ID): T | undefined
  [Symbol.iterator](): IterableIterator<T>
}

function withCatalogFallback<T extends { id: ID }>(
  primary: CalcCatalog<T>,
  fallback: CalcCatalog<T>,
): CalcCatalog<T> {
  const entries = new Map([...fallback, ...primary].map((entry) => [entry.id, entry]))
  return {
    get: (id: ID) => entries.get(id),
    [Symbol.iterator]: () => entries.values(),
  }
}

/** Retain Champions overrides without treating its legal roster as our candidate pool. */
function championsMoveCatalog(): Generation["moves"] {
  const entries = new Map([...CALC_GENERATION.moves].map((move) => [move.id, move]))
  for (const move of champions.moves) {
    const base = entries.get(move.id)
    // Upstream includes patch-only entries outside its roster (e.g. Gear Grind).
    // Complete those records from Gen 9 while retaining the Champions patch.
    const completeMove = !move.type && base
      ? { ...base, ...move, flags: { ...base.flags, ...move.flags } }
      : move
    entries.set(move.id, completeMove)
  }
  return {
    get: (id) => entries.get(id),
    [Symbol.iterator]: () => entries.values(),
  }
}

const CHAMPIONS_GENERATION: Generation = {
  ...champions,
  num: 0,
  species: withCatalogFallback(champions.species, CALC_GENERATION.species),
  moves: championsMoveCatalog(),
  abilities: withCatalogFallback(champions.abilities, CALC_GENERATION.abilities),
  items: withCatalogFallback(champions.items, CALC_GENERATION.items),
  types: champions.types,
  natures: champions.natures,
}

export function calcGeneration(rules: CalculationRules): Generation {
  return rules === "champions" ? CHAMPIONS_GENERATION : CALC_GENERATION
}

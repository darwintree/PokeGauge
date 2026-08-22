import { Generations } from "@smogon/calc"

/** Gen 9 engine until Champions-native data exists */
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

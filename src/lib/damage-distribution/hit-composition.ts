export type HitBranch = {
  rolls: readonly number[]
  effectivePower: number
  consumesBerry: boolean
}

export type HitBranches = {
  normal?: HitBranch
  critical?: HitBranch
}

export type Hit = HitBranches & {
  /** Explicit rows after 1, 2, ... prior effects; required for every reachable count. */
  afterStatChanges?: readonly HitBranches[]
}

export type HitComposition = {
  accuracyScope: "move" | "hit"
  statChangeProbability?: number
  choices: readonly { probability: number; hits: readonly Hit[] }[]
}

export type ResolutionState = {
  berryConsumed: boolean
  /** Number of the move's supported stat-change events within this use. */
  statChanges: number
}

export type ResolutionOutcome = ResolutionState & {
  damage: number
  probability: number
  critical: boolean
  landed: boolean
}

const CONSUMED = 1
const CRITICAL = 2
const LANDED = 4
const FLAG_COUNT = 8

function add(result: Map<number, number>, key: number, probability: number): void {
  if (probability > 0) result.set(key, (result.get(key) ?? 0) + probability)
}

/** Aggregate only at the same execution position; do not enumerate roll histories. */
export function resolveHitComposition(
  composition: HitComposition,
  hitProbability: number,
  criticalProbability: number,
  berryConsumed = false,
  value: "damage" | "power" = "damage",
): ResolutionOutcome[] {
  // Keep effect counts separate even when damage and Berry state are equal.
  const stateCount = FLAG_COUNT * (1 + Math.max(...composition.choices.map((choice) => choice.hits.length)))
  const ended = new Map<number, number>()
  const initial = berryConsumed ? CONSUMED : 0
  for (const choice of composition.choices) {
    let paths = new Map([[initial, choice.probability]])
    for (let index = 0; index < choice.hits.length; index += 1) {
      const step = choice.hits[index]
      const variants = [step, ...(step.afterStatChanges ?? [])].map((hit) => [
        [hit.normal, false, hit.critical ? 1 - criticalProbability : 1],
        [hit.critical, true, hit.normal ? criticalProbability : 1],
      ] as const)
      const next = new Map<number, number>()
      const accuracy = index === 0 || composition.accuracyScope === "hit" ? hitProbability : 1
      for (const [key, probability] of paths) {
        add(ended, key, probability * (1 - accuracy))
        const state = key % stateCount
        const damage = Math.floor(key / stateCount)
        const changes = Math.floor(state / FLAG_COUNT)
        const branches = variants[changes]
        if (!branches) throw new Error(`Missing Hit variant for ${changes} prior stat changes at hit ${index + 1}`)
        for (const [branch, critical, weight] of branches) {
          if (!branch || weight === 0) continue
          const nextState = (state | LANDED | (critical ? CRITICAL : 0) |
            (branch.consumesBerry ? CONSUMED : 0))
          const rolls = value === "power" ? [branch.effectivePower] : branch.rolls
          const chance = composition.statChangeProbability && branch.rolls.some((damage) => damage > 0)
            ? composition.statChangeProbability : 0
          for (const roll of rolls) {
            const mass = probability * accuracy * weight / rolls.length
            add(next, (damage + roll) * stateCount + nextState, mass * (1 - chance))
            add(next, (damage + roll) * stateCount + nextState + FLAG_COUNT, mass * chance)
          }
        }
      }
      paths = next
    }
    for (const [key, probability] of paths) add(ended, key, probability)
  }
  return [...ended].map(([key, probability]) => ({
    damage: Math.floor(key / stateCount),
    probability,
    berryConsumed: Boolean(key % stateCount & CONSUMED),
    critical: Boolean(key % stateCount & CRITICAL),
    landed: Boolean(key % stateCount & LANDED),
    statChanges: Math.floor(key % stateCount / FLAG_COUNT),
  }))
}

export type ValueRange = { min: number; max: number }

export function resolutionRange(
  outcomes: readonly ResolutionOutcome[],
  critical: boolean,
): ValueRange | undefined {
  let min = Infinity
  let max = -Infinity
  for (const outcome of outcomes) {
    if (!outcome.landed || outcome.critical !== critical) continue
    min = Math.min(min, outcome.damage)
    max = Math.max(max, outcome.damage)
  }
  return Number.isFinite(min) ? { min, max } : undefined
}

function koQuery(outcomes: readonly ResolutionOutcome[]): (hp: number) => number {
  const sorted = [...outcomes].sort((a, b) => a.damage - b.damage)
  const suffix = Array<number>(sorted.length + 1).fill(0)
  for (let index = sorted.length - 1; index >= 0; index -= 1) {
    suffix[index] = suffix[index + 1] + sorted[index].probability
  }
  return (hp) => {
    let low = 0
    let high = sorted.length
    while (low < high) {
      const middle = (low + high) >>> 1
      if (sorted[middle].damage < hp) low = middle + 1
      else high = middle
    }
    return Math.min(1, Math.max(0, suffix[low]))
  }
}

/** Query the second use conditioned on the first use's outcome. */
export function sequenceKOProbabilities(
  first: readonly ResolutionOutcome[],
  nextUse: (outcome: ResolutionOutcome) => readonly ResolutionOutcome[],
  hp: number,
): { ohko: number; twoHit: number } {
  const availableKO = koQuery(first)
  const queries = new Map<readonly ResolutionOutcome[], (hp: number) => number>()
  let twoHit = 0
  for (const outcome of first) {
    if (outcome.damage >= hp) {
      twoHit += outcome.probability
      continue
    }
    const next = nextUse(outcome)
    let nextKO = queries.get(next)
    if (!nextKO) {
      nextKO = koQuery(next)
      queries.set(next, nextKO)
    }
    twoHit += outcome.probability * nextKO(hp - outcome.damage)
  }
  return { ohko: availableKO(hp), twoHit: Math.min(1, Math.max(0, twoHit)) }
}

export type HitBranch = {
  rolls: readonly number[]
  effectivePower: number
  consumesBerry: boolean
}

export type Hit = {
  normal?: HitBranch
  critical?: HitBranch
}

export type HitComposition = {
  accuracyScope: "move" | "hit"
  choices: readonly { probability: number; hits: readonly Hit[] }[]
}

export type ResolutionOutcome = {
  damage: number
  probability: number
  berryConsumed: boolean
  critical: boolean
  landed: boolean
}

const CONSUMED = 1
const CRITICAL = 2
const LANDED = 4
const STATE_COUNT = 8

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
  const ended = new Map<number, number>()
  const initial = berryConsumed ? CONSUMED : 0
  for (const choice of composition.choices) {
    let paths = new Map([[initial, choice.probability]])
    for (let index = 0; index < choice.hits.length; index += 1) {
      const hit = choice.hits[index]
      const next = new Map<number, number>()
      const accuracy = index === 0 || composition.accuracyScope === "hit" ? hitProbability : 1
      const branches = [
        [hit.normal, false, hit.critical ? 1 - criticalProbability : 1],
        [hit.critical, true, hit.normal ? criticalProbability : 1],
      ] as const
      for (const [key, probability] of paths) {
        add(ended, key, probability * (1 - accuracy))
        const state = key % STATE_COUNT
        const damage = Math.floor(key / STATE_COUNT)
        for (const [branch, critical, weight] of branches) {
          if (!branch || weight === 0) continue
          const nextState = state | LANDED | (critical ? CRITICAL : 0) |
            (branch.consumesBerry ? CONSUMED : 0)
          const rolls = value === "power" ? [branch.effectivePower] : branch.rolls
          for (const roll of rolls) {
            add(next, (damage + roll) * STATE_COUNT + nextState,
              probability * accuracy * weight / rolls.length)
          }
        }
      }
      paths = next
    }
    for (const [key, probability] of paths) add(ended, key, probability)
  }
  return [...ended].map(([key, probability]) => ({
    damage: Math.floor(key / STATE_COUNT),
    probability,
    berryConsumed: Boolean(key % STATE_COUNT & CONSUMED),
    critical: Boolean(key % STATE_COUNT & CRITICAL),
    landed: Boolean(key % STATE_COUNT & LANDED),
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

/** The second use is conditional on the first use's final Berry state. */
export function sequenceKOProbabilities(
  first: readonly ResolutionOutcome[],
  afterConsumption: readonly ResolutionOutcome[],
  hp: number,
): { ohko: number; twoHit: number } {
  const availableKO = koQuery(first)
  const consumedKO = koQuery(afterConsumption)
  let twoHit = 0
  for (const outcome of first) {
    const nextKO = outcome.berryConsumed ? consumedKO : availableKO
    twoHit += outcome.probability * nextKO(hp - outcome.damage)
  }
  return { ohko: availableKO(hp), twoHit: Math.min(1, Math.max(0, twoHit)) }
}

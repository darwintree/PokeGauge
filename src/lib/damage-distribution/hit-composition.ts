export type HitBranch = {
  rolls: readonly number[]
  effectivePower: number
  consumesBerry: boolean
}

export type HitBranches = {
  normal?: HitBranch
  critical?: HitBranch
}

export type ResolutionState = {
  damageTaken: number
  berryConsumed: boolean
  /** Cumulative supported stat-change events, across execution boundaries. */
  statChanges: number
}

export const INITIAL_RESOLUTION_STATE: Readonly<ResolutionState> = {
  damageTaken: 0, berryConsumed: false, statChanges: 0,
}

/** The execution start is available for effects that last for the whole move. */
export type Hit = (state: Readonly<ResolutionState>, executionStart: Readonly<ResolutionState>) => HitBranches

export type HitComposition = {
  accuracyScope: "move" | "hit"
  statChangeProbability?: number
  /** Equal keys guarantee equal per-execution damage distributions; state itself stays intact. */
  damageStateKey?: (state: Readonly<ResolutionState>) => string
  choices: readonly { probability: number; hits: readonly Hit[] }[]
}

export type ValueRange = { min: number; max: number }

export type ResolutionOutcome = ResolutionState & {
  /** Damage and reference power produced by this execution only. */
  damage: number
  power: ValueRange
  probability: number
  critical: boolean
  landed: boolean
}

const CONSUMED = 1
const CRITICAL = 2
const LANDED = 4
const FLAG_COUNT = 8

type Path = { probability: number; power: ValueRange }

function add(result: Map<number, Path>, key: number, probability: number, power: ValueRange): void {
  if (probability <= 0) return
  const existing = result.get(key)
  if (existing) {
    existing.probability += probability
    existing.power.min = Math.min(existing.power.min, power.min)
    existing.power.max = Math.max(existing.power.max, power.max)
  } else result.set(key, { probability, power: { ...power } })
}

/** Every landed hit updates state here, regardless of execution boundaries. */
export function resolveHitComposition(
  composition: HitComposition,
  hitProbability: number,
  criticalProbability: number,
  initial: Readonly<ResolutionState> = INITIAL_RESOLUTION_STATE,
): ResolutionOutcome[] {
  const maxHits = Math.max(...composition.choices.map((choice) => choice.hits.length))
  const stateCount = FLAG_COUNT * (1 + initial.statChanges + maxHits)
  const ended = new Map<number, Path>()
  const initialKey = initial.statChanges * FLAG_COUNT + (initial.berryConsumed ? CONSUMED : 0)
  for (const choice of composition.choices) {
    let paths = new Map<number, Path>([[initialKey, {
      probability: choice.probability, power: { min: 0, max: 0 },
    }]])
    for (let index = 0; index < choice.hits.length; index += 1) {
      const next = new Map<number, Path>()
      const accuracy = index === 0 || composition.accuracyScope === "hit" ? hitProbability : 1
      for (const [key, { probability, power }] of paths) {
        add(ended, key, probability * (1 - accuracy), power)
        if (accuracy === 0) continue
        const flags = key % stateCount
        const damage = Math.floor(key / stateCount)
        const changes = Math.floor(flags / FLAG_COUNT)
        const branches = choice.hits[index]({
          damageTaken: initial.damageTaken + damage,
          berryConsumed: Boolean(flags & CONSUMED), statChanges: changes,
        }, initial)
        for (const [branch, critical, weight] of [
          [branches.normal, false, branches.critical ? 1 - criticalProbability : 1],
          [branches.critical, true, branches.normal ? criticalProbability : 1],
        ] as const) {
          if (!branch || weight === 0) continue
          const nextPower = { min: power.min + branch.effectivePower, max: power.max + branch.effectivePower }
          for (const roll of branch.rolls) {
            const nextFlags = flags | LANDED | (critical ? CRITICAL : 0) |
              (roll > 0 && branch.consumesBerry ? CONSUMED : 0)
            const chance = roll > 0 ? composition.statChangeProbability ?? 0 : 0
            const mass = probability * accuracy * weight / branch.rolls.length
            add(next, (damage + roll) * stateCount + nextFlags, mass * (1 - chance), nextPower)
            add(next, (damage + roll) * stateCount + nextFlags + FLAG_COUNT, mass * chance, nextPower)
          }
        }
      }
      paths = next
    }
    for (const [key, path] of paths) add(ended, key, path.probability, path.power)
  }
  return [...ended].map(([key, path]) => ({
    damage: Math.floor(key / stateCount),
    damageTaken: initial.damageTaken + Math.floor(key / stateCount),
    ...path,
    berryConsumed: Boolean(key % stateCount & CONSUMED),
    critical: Boolean(key % stateCount & CRITICAL),
    landed: Boolean(key % stateCount & LANDED),
    statChanges: Math.floor(key % stateCount / FLAG_COUNT),
  }))
}

export function resolutionRange(
  outcomes: readonly ResolutionOutcome[],
  critical: boolean,
  value: "damage" | "power" = "damage",
): ValueRange | undefined {
  let min = Infinity
  let max = -Infinity
  for (const outcome of outcomes) {
    if (!outcome.landed || outcome.critical !== critical) continue
    min = Math.min(min, value === "power" ? outcome.power.min : outcome.damage)
    max = Math.max(max, value === "power" ? outcome.power.max : outcome.damage)
  }
  return Number.isFinite(min) ? { min, max } : undefined
}

type DamageOutcome = Pick<ResolutionOutcome, "damage" | "probability">

function koProbability(outcomes: readonly DamageOutcome[], hp: number): number {
  let probability = 0
  for (const outcome of outcomes) {
    if (outcome.damage >= hp) probability += outcome.probability
  }
  return Math.min(1, Math.max(0, probability))
}

/** Query the second use conditioned on the first use's outcome. */
export function sequenceKOProbabilities(
  composition: HitComposition,
  hitProbability: number,
  criticalProbability: number,
  hp: number,
): { ohko: number; twoHit: number } {
  const first = resolveHitComposition(composition, hitProbability, criticalProbability)
  let twoHit = 0
  const continuations = new Map<string, readonly DamageOutcome[]>()
  for (const outcome of first) {
    if (outcome.damage >= hp) {
      twoHit += outcome.probability
      continue
    }
    const key = composition.damageStateKey?.(outcome)
    let next = key === undefined ? undefined : continuations.get(key)
    if (!next) {
      next = resolveHitComposition(composition, hitProbability, criticalProbability, outcome)
      if (key !== undefined) continuations.set(key, next)
    }
    twoHit += outcome.probability * koProbability(next, hp - outcome.damage)
  }
  return { ohko: koProbability(first, hp), twoHit: Math.min(1, Math.max(0, twoHit)) }
}

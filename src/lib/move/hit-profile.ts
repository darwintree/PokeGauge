/** Reviewed Gen 9 execution rules; minHits/maxHits alone do not define accuracy. */
export type MoveHitProfile = {
  powers: readonly number[]
  randomCount: boolean
  accuracyScope: "move" | "hit"
}

function fixed(power: number, count: number, accuracyScope: "move" | "hit" = "move"): MoveHitProfile {
  return { powers: Array(count).fill(power), randomCount: false, accuracyScope }
}

function random(power: number): MoveHitProfile {
  return { ...fixed(power, 5), randomCount: true }
}

// Sources: Pokémon Showdown data/moves.ts and sim/battle-actions.ts, reviewed 2026-09-06.
const MOVE_HIT_PROFILES: Readonly<Record<number, MoveHitProfile>> = {
  3: random(15), 4: random(18), 24: fixed(30, 2), 31: random(15),
  41: fixed(25, 2), 42: random(25), 131: random(20), 140: random(15),
  154: random(18), 155: fixed(50, 2),
  167: { powers: [10, 20, 30], randomCount: false, accuracyScope: "hit" },
  198: random(25), 292: random(15), 331: random(25), 333: random(25),
  350: random(25), 458: fixed(35, 2), 530: fixed(40, 2), 541: random(25),
  544: fixed(50, 2), 594: random(15), 742: fixed(60, 2), 751: fixed(50, 2),
  799: random(25),
  813: { powers: [20, 40, 60], randomCount: false, accuracyScope: "hit" },
  814: fixed(40, 2), 818: fixed(25, 3), 860: fixed(20, 10, "hit"),
  865: fixed(30, 3), 888: fixed(40, 2), 911: fixed(50, 2),
}

export function moveHitProfile(moveId: number): MoveHitProfile | undefined {
  return MOVE_HIT_PROFILES[moveId]
}

// Charge, recharge, future-move and explicit noparentalbond rules are not all
// present in generated PokeAPI flags. Keep this reviewed identity list explicit.
const NO_PARENTAL_BOND = new Set([
  13, 19, 63, 76, 91, 120, 130, 143, 153, 205, 248, 283, 291, 301,
  307, 308, 338, 340, 353, 374, 416, 439, 459, 467, 507, 515, 553,
  554, 566, 601, 669, 711, 744, 751, 794, 795, 800, 905,
])

export function moveAllowsParentalBond(moveId: number, spread: boolean): boolean {
  return !spread && !moveHitProfile(moveId) && !NO_PARENTAL_BOND.has(moveId)
}

export type MoveExecution = {
  accuracyScope: "move" | "hit"
  counts: readonly { count: number; probability: number }[]
  powers: readonly number[]
  parentalBond: boolean
}

export function compileMoveExecution(
  moveId: number,
  power: number,
  attackerAbilityId: number,
  spread: boolean,
): MoveExecution {
  const profile = moveHitProfile(moveId)
  const parentalBond = attackerAbilityId === 185 && moveAllowsParentalBond(moveId, spread)
  const powers = profile?.powers ?? (parentalBond ? [power, power] : [power])
  const skillLink = attackerAbilityId === 92
  return {
    powers,
    parentalBond,
    accuracyScope: skillLink ? "move" : profile?.accuracyScope ?? "move",
    counts: profile?.randomCount && !skillLink
      ? [
          { count: 2, probability: 0.35 }, { count: 3, probability: 0.35 },
          { count: 4, probability: 0.15 }, { count: 5, probability: 0.15 },
        ]
      : [{ count: powers.length, probability: 1 }],
  }
}

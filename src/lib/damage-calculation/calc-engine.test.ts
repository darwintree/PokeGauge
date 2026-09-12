import { describe, expect, it } from "vitest"

import {
  chainModifiers,
  type CalcContext,
  NEUTRAL_MODIFIER,
} from "@/lib/damage-calculation"

import { calculateHitMatrix } from "./calc-engine"

const N = NEUTRAL_MODIFIER

function calcPoint(overrides: Partial<CalcContext> = {}): CalcContext {
  return {
    attacker: {
      calcSpeciesName: "Garchomp",
      exactStats: { hp: 183, atk: 186, def: 100, spa: 100, spd: 100, spe: 122 },
      boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    },
    defender: {
      calcSpeciesName: "Snorlax",
      exactStats: { hp: 170, atk: 100, def: 153, spa: 100, spd: 100, spe: 50 },
      boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    },
    move: { calcMoveName: "Earthquake", target: "allAdjacent", isCrit: false },
    field: { gameType: "Doubles" },
    ...overrides,
  }
}

function hitRolls(context: CalcContext) {
  return {
    normal: calculateHitMatrix(context, 1, false, false, false).rolls[0],
    critical: calculateHitMatrix(context, 1, true, false, false).rolls[0],
  }
}

describe("calc-engine adapter", () => {
  it("normalizes modifier chains before applying a phase", () => {
    expect(chainModifiers([])).toBe(N)
    expect(chainModifiers([4915, 2048])).toBe(2458)
    expect(chainModifiers([2732, 5324])).toBe(3551)
  })

  it("produces 16 normal and critical rolls for a spread STAB move", () => {
    const result = hitRolls(calcPoint())

    expect(result.normal).toHaveLength(16)
    expect(result.critical).toHaveLength(16)
    expect(result.normal![15]).toBeGreaterThan(result.normal![0])
    expect(result.critical![0]).toBeGreaterThan(result.normal![15])
    // Fixed known values for Garchomp Earthquake vs Snorlax, Doubles spread, L50 exact stats.
    expect(result.normal).toEqual([
      51, 52, 52, 54, 54, 54, 55, 55, 57, 57, 57, 58, 58, 60, 60, 61,
    ])
    expect(result.critical).toEqual([
      76, 78, 79, 79, 81, 81, 82, 84, 84, 85, 85, 87, 88, 88, 90, 91,
    ])
  })

  it("maps the spread-off toggle to a normal target", () => {
    const single = hitRolls(calcPoint({
      move: { calcMoveName: "Earthquake", target: "normal", isCrit: false },
    }))
    const spread = hitRolls(calcPoint())

    expect(single.normal![0]).toBeGreaterThan(spread.normal![0])
  })

  it("feeds exact stats and stages into calc", () => {
    const boosted = hitRolls(calcPoint({
      attacker: {
        calcSpeciesName: "Garchomp",
        exactStats: { hp: 183, atk: 186, def: 100, spa: 100, spd: 100, spe: 122 },
        boosts: { atk: 2, def: 0, spa: 0, spd: 0, spe: 0 },
      },
    }))
    const neutral = hitRolls(calcPoint())

    expect(boosted.normal![0]).toBeGreaterThan(neutral.normal![0])
  })

  it("derives dynamic move power from calc instead of a fixed snapshot", () => {
    const lowKick = hitRolls(calcPoint({
      move: { calcMoveName: "Low Kick", target: "normal", isCrit: false },
    }))

    expect(lowKick.normal).toHaveLength(16)
    // Garchomp (95 kg) vs Snorlax (460 kg): Low Kick = 120 BP, neutral, L50 exact stats.
    expect(lowKick.normal).toEqual([
      112, 112, 114, 116, 116, 118, 120, 120, 122, 124, 124, 126, 128, 128, 130, 132,
    ])

    const grassKnot = hitRolls(calcPoint({
      move: { calcMoveName: "Grass Knot", target: "normal", isCrit: false },
    }))
    // Grass Knot uses the same defender weight band but attacks the special side.
    expect(grassKnot.normal).toHaveLength(16)
    expect(grassKnot.normal![0]).toBeGreaterThan(0)
  })

  it("applies weather and terrain through the calc field", () => {
    const sunFire = hitRolls(calcPoint({
      attacker: {
        calcSpeciesName: "Charizard",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 160, spd: 120, spe: 150 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Flamethrower", target: "normal", isCrit: false },
      field: { gameType: "Doubles", weather: "Sun" },
    }))
    const noSun = hitRolls(calcPoint({
      attacker: {
        calcSpeciesName: "Charizard",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 160, spd: 120, spe: 150 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Flamethrower", target: "normal", isCrit: false },
      field: { gameType: "Doubles" },
    }))

    expect(sunFire.normal![0]).toBeGreaterThan(noSun.normal![0])
  })

  it("applies recognized ability and item names through calc", () => {
    const hugePower = hitRolls(calcPoint({
      attacker: {
        calcSpeciesName: "Azumarill",
        abilityCalcName: "Huge Power",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Tackle", target: "normal", isCrit: false },
    }))
    const noAbility = hitRolls(calcPoint({
      attacker: {
        calcSpeciesName: "Azumarill",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Tackle", target: "normal", isCrit: false },
    }))

    expect(hugePower.normal![0]).toBeGreaterThan(noAbility.normal![0])
  })

  it("returns zero rolls for a type immunity", () => {
    const immune = hitRolls(calcPoint({
      defender: {
        calcSpeciesName: "Charizard",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Earthquake", target: "normal", isCrit: false },
    }))

    expect(immune.normal).toEqual(Array(16).fill(0))
  })
})

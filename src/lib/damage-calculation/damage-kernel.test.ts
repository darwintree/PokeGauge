import { describe, expect, it } from "vitest"

import {
  calculateDamageRolls,
  chainModifiers,
  type CalcContext,
  type CompiledDamageInput,
  type DamageFormulaBranch,
  NEUTRAL_MODIFIER,
} from "@/lib/damage-calculation"

const N = NEUTRAL_MODIFIER

function branch(): DamageFormulaBranch {
  return {
    damageNegated: false,
    power: 0,
    basePowerModifier: N,
    attack: 0,
    attackStage: 0,
    attackModifier: N,
    defense: 0,
    defenseStage: 0,
    defenseModifier: N,
    spreadModifier: N,
    weatherModifier: N,
    criticalModifier: N,
    stabModifier: N,
    typeEffectivenessModifier: N,
    finalModifier: N,
  }
}

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

function input(
  point: CalcContext,
  branches: { normal?: boolean; critical?: boolean } = { normal: true, critical: true },
): CompiledDamageInput {
  return {
    low: {
      defenderHp: 170,
      calc: point,
      ...(branches.normal ? { normal: branch() } : {}),
      ...(branches.critical ? { critical: branch() } : {}),
    },
  }
}

describe("calc-engine adapter", () => {
  it("normalizes modifier chains before applying a phase", () => {
    expect(chainModifiers([])).toBe(N)
    expect(chainModifiers([4915, 2048])).toBe(2458)
    expect(chainModifiers([2732, 5324])).toBe(3551)
  })

  it("produces 16 normal and critical rolls for a spread STAB move", () => {
    const result = calculateDamageRolls(input(calcPoint())).low

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
    const single = calculateDamageRolls(input(calcPoint({
      move: { calcMoveName: "Earthquake", target: "normal", isCrit: false },
    }))).low
    const spread = calculateDamageRolls(input(calcPoint())).low

    expect(single.normal![0]).toBeGreaterThan(spread.normal![0])
  })

  it("feeds exact stats and stages into calc", () => {
    const boosted = calculateDamageRolls(input(calcPoint({
      attacker: {
        calcSpeciesName: "Garchomp",
        exactStats: { hp: 183, atk: 186, def: 100, spa: 100, spd: 100, spe: 122 },
        boosts: { atk: 2, def: 0, spa: 0, spd: 0, spe: 0 },
      },
    }))).low
    const neutral = calculateDamageRolls(input(calcPoint())).low

    expect(boosted.normal![0]).toBeGreaterThan(neutral.normal![0])
  })

  it("derives dynamic move power from calc instead of a fixed snapshot", () => {
    const lowKick = calculateDamageRolls(input(calcPoint({
      move: { calcMoveName: "Low Kick", target: "normal", isCrit: false },
    }))).low

    expect(lowKick.normal![0]).toBeGreaterThan(0)
    expect(lowKick.normal).toHaveLength(16)
  })

  it("applies weather and terrain through the calc field", () => {
    const sunFire = calculateDamageRolls(input(calcPoint({
      attacker: {
        calcSpeciesName: "Charizard",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 160, spd: 120, spe: 150 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Flamethrower", target: "normal", isCrit: false },
      field: { gameType: "Doubles", weather: "Sun" },
    }))).low
    const noSun = calculateDamageRolls(input(calcPoint({
      attacker: {
        calcSpeciesName: "Charizard",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 160, spd: 120, spe: 150 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Flamethrower", target: "normal", isCrit: false },
      field: { gameType: "Doubles" },
    }))).low

    expect(sunFire.normal![0]).toBeGreaterThan(noSun.normal![0])
  })

  it("applies recognized ability and item names through calc", () => {
    const hugePower = calculateDamageRolls(input(calcPoint({
      attacker: {
        calcSpeciesName: "Azumarill",
        abilityCalcName: "Huge Power",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Tackle", target: "normal", isCrit: false },
    }))).low
    const noAbility = calculateDamageRolls(input(calcPoint({
      attacker: {
        calcSpeciesName: "Azumarill",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Tackle", target: "normal", isCrit: false },
    }))).low

    expect(hugePower.normal![0]).toBeGreaterThan(noAbility.normal![0])
  })

  it("returns zero rolls for a type immunity", () => {
    const immune = calculateDamageRolls(input(calcPoint({
      defender: {
        calcSpeciesName: "Charizard",
        exactStats: { hp: 170, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      },
      move: { calcMoveName: "Earthquake", target: "normal", isCrit: false },
    }))).low

    expect(immune.normal).toEqual(Array(16).fill(0))
  })
})

import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { describe, expect, it } from "vitest"

import { CALC_GEN, VGC_LEVEL } from "./calc-constants"
import {
  calculateDamageRolls,
  chainModifiers,
  type DamageFormulaBranch,
  NEUTRAL_MODIFIER,
} from "./damage-kernel"

const N = NEUTRAL_MODIFIER

function branch(overrides: Partial<DamageFormulaBranch> = {}): DamageFormulaBranch {
  return {
    power: 80,
    basePowerModifier: N,
    attack: 100,
    attackStage: 0,
    attackModifier: N,
    defense: 100,
    defenseStage: 0,
    defenseModifier: N,
    spreadModifier: N,
    weatherModifier: N,
    criticalModifier: N,
    stabModifier: N,
    typeEffectivenessModifier: N,
    finalModifier: N,
    ...overrides,
  }
}

describe("fixed-point damage kernel", () => {
  it("normalizes modifier chains before applying a phase", () => {
    expect(chainModifiers([])).toBe(N)
    expect(chainModifiers([4915, 2048])).toBe(2458)
    expect(chainModifiers([2732, 5324])).toBe(3551)
  })

  it("rounds exact .5 phase results down", () => {
    const halfDown = calculateDamageRolls({
      low: {
        defenderHp: 100,
        normal: branch({ power: 1, basePowerModifier: 6144, attack: 1000, defense: 100 }),
      },
    }).low.normal
    const roundedToOne = calculateDamageRolls({
      low: { defenderHp: 100, normal: branch({ power: 1, attack: 1000, defense: 100 }) },
    }).low.normal
    const roundedToTwo = calculateDamageRolls({
      low: { defenderHp: 100, normal: branch({ power: 2, attack: 1000, defense: 100 }) },
    }).low.normal

    expect(halfDown).toEqual(roundedToOne)
    expect(halfDown).not.toEqual(roundedToTwo)
  })

  it("matches all physical normal and critical rolls after stage, Choice Band, spread, and Reflect", () => {
    const attacker = new Pokemon(CALC_GEN, "Garchomp", {
      level: VGC_LEVEL,
      nature: "Adamant",
      evs: { atk: 252 },
      boosts: { atk: 1 },
      item: "Choice Band",
    })
    const defender = new Pokemon(CALC_GEN, "Incineroar", {
      level: VGC_LEVEL,
      nature: "Impish",
      evs: { hp: 252, def: 252 },
      boosts: { def: 1 },
    })
    const field = new Field({ gameType: "Doubles", defenderSide: { isReflect: true } })
    const common = {
      power: 100,
      attack: attacker.rawStats.atk,
      attackStage: 1,
      attackModifier: 6144,
      defense: defender.rawStats.def,
      spreadModifier: 3072,
      stabModifier: 6144,
      typeEffectivenessModifier: 8192,
    }
    const result = calculateDamageRolls({
      low: {
        defenderHp: defender.maxHP(),
        normal: branch({ ...common, defenseStage: 1, finalModifier: 2732 }),
        critical: branch({
          ...common,
          defenseStage: 0,
          criticalModifier: 6144,
          finalModifier: N,
        }),
      },
    }).low

    expect(result.normal).toEqual(
      calculate(CALC_GEN, attacker, defender, new Move(CALC_GEN, "Earthquake"), field).damage,
    )
    expect(result.critical).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, "Earthquake", { isCrit: true }),
        field,
      ).damage,
    )
  })

  it("matches all special weather rolls with spread, Light Screen, and Life Orb", () => {
    const attacker = new Pokemon(CALC_GEN, "Charizard", {
      level: VGC_LEVEL,
      nature: "Modest",
      evs: { spa: 252 },
      item: "Life Orb",
    })
    const defender = new Pokemon(CALC_GEN, "Abomasnow", {
      level: VGC_LEVEL,
      nature: "Calm",
      evs: { hp: 252, spd: 252 },
    })
    const field = new Field({
      gameType: "Doubles",
      weather: "Sun",
      defenderSide: { isLightScreen: true },
    })
    const common = {
      power: 95,
      attack: attacker.rawStats.spa,
      defense: defender.rawStats.spd,
      spreadModifier: 3072,
      weatherModifier: 6144,
      stabModifier: 6144,
      typeEffectivenessModifier: 16384,
    }
    const result = calculateDamageRolls({
      low: {
        defenderHp: defender.maxHP(),
        normal: branch({ ...common, finalModifier: chainModifiers([2732, 5324]) }),
        critical: branch({
          ...common,
          criticalModifier: 6144,
          finalModifier: 5324,
        }),
      },
    }).low

    expect(result.normal).toEqual(
      calculate(CALC_GEN, attacker, defender, new Move(CALC_GEN, "Heat Wave"), field).damage,
    )
    expect(result.critical).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, "Heat Wave", { isCrit: true }),
        field,
      ).damage,
    )
  })

  it("matches Adaptability STAB and a chained Solar Beam base-power phase", () => {
    const porygon = new Pokemon(CALC_GEN, "Porygon-Z", {
      level: VGC_LEVEL,
      ability: "Adaptability",
      nature: "Modest",
      evs: { spa: 252 },
    })
    const snorlax = new Pokemon(CALC_GEN, "Snorlax", {
      level: VGC_LEVEL,
      nature: "Careful",
      evs: { hp: 252, spd: 252 },
    })
    const adaptability = calculateDamageRolls({
      low: {
        defenderHp: snorlax.maxHP(),
        normal: branch({
          power: 80,
          attack: porygon.rawStats.spa,
          defense: snorlax.rawStats.spd,
          stabModifier: 8192,
        }),
      },
    }).low.normal

    expect(adaptability).toEqual(
      calculate(
        CALC_GEN,
        porygon,
        snorlax,
        new Move(CALC_GEN, "Tri Attack"),
        new Field(),
      ).damage,
    )

    const venusaur = new Pokemon(CALC_GEN, "Venusaur", {
      level: VGC_LEVEL,
      nature: "Modest",
      evs: { spa: 252 },
      item: "Miracle Seed",
    })
    const blastoise = new Pokemon(CALC_GEN, "Blastoise", {
      level: VGC_LEVEL,
      nature: "Calm",
      evs: { hp: 252, spd: 252 },
    })
    const rain = new Field({ weather: "Rain" })
    const solarBeam = calculateDamageRolls({
      low: {
        defenderHp: blastoise.maxHP(),
        normal: branch({
          power: 120,
          basePowerModifier: chainModifiers([2048, 4915]),
          attack: venusaur.rawStats.spa,
          defense: blastoise.rawStats.spd,
          stabModifier: 6144,
          typeEffectivenessModifier: 8192,
        }),
      },
    }).low.normal

    expect(solarBeam).toEqual(
      calculate(
        CALC_GEN,
        venusaur,
        blastoise,
        new Move(CALC_GEN, "Solar Beam"),
        rain,
      ).damage,
    )
  })

  it("preserves endpoint branches and returns zero rolls for immunity", () => {
    const inputBranch = branch()
    const result = calculateDamageRolls({
      low: { defenderHp: 201, normal: inputBranch },
      high: {
        defenderHp: 151,
        critical: branch({ typeEffectivenessModifier: 0, criticalModifier: 6144 }),
      },
    })

    expect(result.low.defenderHp).toBe(201)
    expect(result.low.normal).toHaveLength(16)
    expect(result.low.critical).toBeUndefined()
    expect(result.high).toEqual({ defenderHp: 151, critical: Array(16).fill(0) })
  })
})

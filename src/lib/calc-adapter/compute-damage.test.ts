import { calculate, Move, Pokemon } from "@smogon/calc"
import { describe, expect, it } from "vitest"

import {
  ATTACKER_STAT_SETUPS,
  CALC_GEN,
  computeDamage,
  computeDamageForStatRange,
  DEFENDER_SETUPS,
  getAttackStatBounds,
  VGC_LEVEL,
} from "@/lib/calc-adapter"

function directCalc(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  attackerStat: (typeof ATTACKER_STAT_SETUPS)[string],
  item: string | undefined,
  defender: (typeof DEFENDER_SETUPS)[string],
) {
  const attacker = new Pokemon(CALC_GEN, attackerSpecies, {
    level: VGC_LEVEL,
    nature: attackerStat.nature,
    evs: attackerStat.evs,
    item,
  })
  const defenderMon = new Pokemon(CALC_GEN, defenderSpecies, {
    level: VGC_LEVEL,
    nature: defender.nature,
    evs: defender.evs,
  })
  const move = new Move(CALC_GEN, moveName)
  const critMove = new Move(CALC_GEN, moveName, { isCrit: true })
  const hp = defenderMon.maxHP()
  const normalRolls = calculate(CALC_GEN, attacker, defenderMon, move).damage as number[]
  const critRolls = calculate(CALC_GEN, attacker, defenderMon, critMove).damage as number[]
  const ohkoRolls = normalRolls.filter((d) => d >= hp).length

  return {
    defenderHp: hp,
    minDamage: Math.min(...normalRolls),
    maxDamage: Math.max(...normalRolls),
    avgDamage: normalRolls.reduce((a, b) => a + b, 0) / 16,
    critMinDamage: Math.min(...critRolls),
    critMaxDamage: Math.max(...critRolls),
    ohkoChance: ohkoRolls > 0 ? (ohkoRolls / 16) * 100 : undefined,
  }
}

describe("calc adapter", () => {
  it("uses Level 50 VGC semantics", () => {
    const result = computeDamage(
      "Garchomp",
      "Incineroar",
      "Earthquake",
      ATTACKER_STAT_SETUPS.standard,
      undefined,
      DEFENDER_SETUPS["standard-bulk"],
    )
    expect(result.defenderHp).toBeGreaterThan(150)
    expect(result.defenderHp).toBeLessThan(220)
  })

  it("matches @smogon/calc for Garchomp Earthquake → Incineroar standard spread", () => {
    const adapter = computeDamage(
      "Garchomp",
      "Incineroar",
      "Earthquake",
      ATTACKER_STAT_SETUPS.standard,
      undefined,
      DEFENDER_SETUPS["standard-bulk"],
    )
    const direct = directCalc(
      "Garchomp",
      "Incineroar",
      "Earthquake",
      ATTACKER_STAT_SETUPS.standard,
      undefined,
      DEFENDER_SETUPS["standard-bulk"],
    )

    expect(adapter.minDamage).toBe(direct.minDamage)
    expect(adapter.maxDamage).toBe(direct.maxDamage)
    expect(adapter.avgDamage).toBeCloseTo(direct.avgDamage, 5)
    expect(adapter.critMinDamage).toBe(direct.critMinDamage)
    expect(adapter.critMaxDamage).toBe(direct.critMaxDamage)
    expect(adapter.ohkoChance).toBe(direct.ohkoChance)
  })

  it("computes OHKO probability from 16 normal rolls", () => {
    const result = computeDamage(
      "Garchomp",
      "Incineroar",
      "Earthquake",
      ATTACKER_STAT_SETUPS.extreme,
      "Life Orb",
      DEFENDER_SETUPS["min-bulk"],
    )
    expect(result.ohkoChance).toBeGreaterThan(0)
    expect(result.maxDamage).toBeGreaterThanOrEqual(result.defenderHp)
  })

  it("getAttackStatBounds includes three snap anchor values for Garchomp", () => {
    const bounds = getAttackStatBounds("Garchomp")
    expect(bounds.snapPoints).toHaveLength(3)
    expect(bounds.snapPoints.map((s) => s.label)).toEqual([
      "无修正无努力",
      "无修正满努力",
      "+修正满努力",
    ])
    expect(bounds.min).toBeLessThanOrEqual(bounds.snapPoints[0].value)
    expect(bounds.max).toBeGreaterThanOrEqual(bounds.snapPoints[2].value)
  })

  it("computeDamageForStatRange merges low-end min and high-end max rolls", () => {
    const bounds = getAttackStatBounds("Garchomp")
    const low = bounds.snapPoints[0].value
    const high = bounds.max

    const presetLow = computeDamage(
      "Garchomp",
      "Incineroar",
      "Earthquake",
      ATTACKER_STAT_SETUPS["neutral-zero"],
      undefined,
      DEFENDER_SETUPS["standard-bulk"],
    )
    const presetHigh = computeDamage(
      "Garchomp",
      "Incineroar",
      "Earthquake",
      ATTACKER_STAT_SETUPS.extreme,
      undefined,
      DEFENDER_SETUPS["standard-bulk"],
    )
    const range = computeDamageForStatRange(
      "Garchomp",
      "Incineroar",
      "Earthquake",
      { min: low, max: high },
      "physical",
      undefined,
      DEFENDER_SETUPS["standard-bulk"],
    )

    expect(range.minDamage).toBe(presetLow.minDamage)
    expect(range.maxDamage).toBe(presetHigh.maxDamage)
    expect(range.critMinDamage).toBeLessThanOrEqual(range.critMaxDamage)
    expect(range.maxPercent).toBeGreaterThan(range.minPercent)
  })
})

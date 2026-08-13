import { beforeAll, describe, expect, it } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import {
  getDefenderDefStat,
  getDefenderHp,
  getDefenderSetups,
  getOffenseStat,
} from "@/lib/stat-calculation"

import { buildSystemDefensePresets, buildSystemOffensePresets } from "./system-presets"
import {
  investBand,
  resolveDefenseChip,
  resolveOffenseChip,
  resolvePresetChip,
  uniqueEndpointChips,
} from "./stat-value-chip"

describe("Stat Value Label chip", () => {
  let attackerCalcName: string
  let defenderCalcName: string
  let category: "physical" | "special"
  const strategy = "habcds" as const

  beforeAll(async () => {
    const catalog = await getCatalogShell(445, 727, "zh-hans")
    attackerCalcName = catalog.matchup.attackerCalcName
    defenderCalcName = catalog.matchup.defenderCalcName
    category = catalog.moveCategory
  })

  it("bands by actual bonus, with EX first", () => {
    expect(investBand(-14, false)).toBe("none")
    expect(investBand(4, false)).toBe("none")
    expect(investBand(5, false)).toBe("some")
    expect(investBand(31, false)).toBe("some")
    expect(investBand(32, false)).toBe("heavy")
    expect(investBand(5, true)).toBe("ex")
  })

  it("maps system presets to Label chips with bonus bands", () => {
    const offense = buildSystemOffensePresets(attackerCalcName, category)
    const defense = buildSystemDefensePresets(defenderCalcName, category)
    const zero = resolvePresetChip(offense.find((p) => p.id === "neutral-zero")!, attackerCalcName, category, 0, strategy)
    const max = resolvePresetChip(offense.find((p) => p.id === "neutral-max")!, attackerCalcName, category, 0, strategy)
    const ex = resolvePresetChip(offense.find((p) => p.id === "extreme")!, attackerCalcName, category, 0, strategy)
    const bulky = resolvePresetChip(defense.find((p) => p.id === "hp-32")!, defenderCalcName, category, 0, strategy)

    expect(zero).toMatchObject({ label: "0A", band: "none", nature: "none" })
    expect(max.label).toBe("32A")
    expect(max.nature).toBe("none")
    expect(max.band).toBe(investBand(Number(max.actual) - Number(zero.actual), false))
    expect(ex).toMatchObject({ label: "EX", band: "ex", nature: "plus" })
    expect(bulky.label).toBe("32H0B")
    expect(bulky.band).toBe("heavy")
  })

  it("colors 32A- from actual bonus, not from the minus nature", () => {
    const minus32 = getOffenseStat(attackerCalcName, category, {
      nature: "Modest",
      evs: { atk: 252 },
    })
    const chip = resolveOffenseChip({
      calcName: attackerCalcName,
      category,
      stat: minus32,
      strategy,
    })
    expect(chip.band).toBe("some")
    expect(chip.band).not.toBe("none")
  })

  it("collapses identical Range endpoints to one chip", () => {
    const chip = resolveOffenseChip({
      calcName: attackerCalcName,
      category,
      stat: 172,
      strategy,
    })
    expect(uniqueEndpointChips(chip, { ...chip })).toHaveLength(1)
    const other = resolveOffenseChip({
      calcName: attackerCalcName,
      category,
      stat: 204,
      strategy,
    })
    expect(uniqueEndpointChips(chip, other)).toHaveLength(2)
  })

  it("reads defense Range endpoints as complete Defense Stat Values", () => {
    const minSetup = getDefenderSetups(category)["min-bulk"]
    const maxSetup = getDefenderSetups(category)["standard-bulk"]
    const min = resolveDefenseChip({
      calcName: defenderCalcName,
      category,
      hp: getDefenderHp(defenderCalcName, minSetup),
      def: getDefenderDefStat(defenderCalcName, category, minSetup),
      strategy,
    })
    const max = resolveDefenseChip({
      calcName: defenderCalcName,
      category,
      hp: getDefenderHp(defenderCalcName, maxSetup),
      def: getDefenderDefStat(defenderCalcName, category, maxSetup),
      strategy,
    })
    expect(min.label).toBe("0H0B")
    expect(max.label).toBe("EX")
    expect(uniqueEndpointChips(min, max)).toHaveLength(2)
  })
})

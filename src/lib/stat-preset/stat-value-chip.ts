import type { MoveCategory } from "@/lib/catalog"
import {
  defenseStatKey,
  getDefenderDefStat,
  getDefenderHp,
  getOffenseStat,
  offenseStatKey,
} from "@/lib/stat-calculation"

import { defenseStatMod, offenseStatMod, type NatureMod } from "./nature-mod"
import { statDisplayName, type StatNameStrategy } from "./stat-name-strategy"
import {
  enumerateDefenseAllocations,
  enumerateOffenseAllocations,
  evToStatPoints,
  EX_LABEL,
  formatDefenseStatValue,
  formatOffenseStatValue,
} from "./stat-value-labels"
import type { StatPreset } from "./types"

export type NatureAdj = "none" | "plus" | "minus"
export type InvestBand = "none" | "some" | "heavy" | "ex"

export type StatValueChipModel = {
  label: string
  actual: string
  sp: string | null
  nature: NatureAdj
  band: InvestBand
  temporary: boolean
}

const ZERO_SETUP = { nature: "Serious", evs: {} } as const

export function investBand(bonus: number, isEx: boolean): InvestBand {
  if (isEx) return "ex"
  if (bonus <= 4) return "none"
  if (bonus >= 32) return "heavy"
  return "some"
}

export function uniqueEndpointChips(
  min: StatValueChipModel,
  max: StatValueChipModel,
): StatValueChipModel[] {
  if (min.label === max.label && min.actual === max.actual) return [min]
  return [min, max]
}

export function fallbackStatValueChip(label: string): StatValueChipModel {
  return {
    label,
    actual: label,
    sp: null,
    nature: "none",
    band: "none",
    temporary: false,
  }
}

function natureAdjFromMod(mod: NatureMod): NatureAdj {
  if (mod === "+") return "plus"
  if (mod === "-") return "minus"
  return "none"
}

export function resolveOffenseChip(args: {
  calcName: string
  category: MoveCategory
  stat: number
  strategy: StatNameStrategy
  allocationIndex?: number
  temporary?: boolean
}): StatValueChipModel {
  const allocations = enumerateOffenseAllocations(
    args.calcName,
    args.category,
    args.stat,
    args.strategy,
  )
  const allocation =
    allocations.length > 0
      ? allocations[(args.allocationIndex ?? 0) % allocations.length]
      : undefined
  const label = allocation?.label ?? formatOffenseStatValue(args.stat)
  const zero = getOffenseStat(args.calcName, args.category, ZERO_SETUP)
  const statKey = offenseStatKey(args.category)
  const points = allocation
    ? evToStatPoints(allocation.setup.evs[statKey] ?? 0)
    : null
  const mod = allocation
    ? offenseStatMod(allocation.setup.nature, args.category)
    : ""
  const isEx = label === EX_LABEL || (points === 32 && mod === "+")
  return {
    label,
    actual: formatOffenseStatValue(args.stat),
    sp: points === null ? null : String(points),
    nature: natureAdjFromMod(mod),
    band: investBand(args.stat - zero, isEx),
    temporary: args.temporary === true,
  }
}

export function resolveDefenseChip(args: {
  calcName: string
  category: MoveCategory
  hp: number
  def: number
  strategy: StatNameStrategy
  allocationIndex?: number
  temporary?: boolean
}): StatValueChipModel {
  const allocations = enumerateDefenseAllocations(
    args.calcName,
    args.category,
    { kind: "defense", hp: args.hp, def: args.def },
    args.strategy,
  )
  const allocation =
    allocations.length > 0
      ? allocations[(args.allocationIndex ?? 0) % allocations.length]
      : undefined
  const label = allocation?.label ?? formatDefenseStatValue(args.hp, args.def)
  const zeroHp = getDefenderHp(args.calcName, ZERO_SETUP)
  const zeroDef = getDefenderDefStat(args.calcName, args.category, ZERO_SETUP)
  const defKey = defenseStatKey(args.category)
  const hpPoints = allocation
    ? evToStatPoints(allocation.setup.evs.hp ?? 0)
    : null
  const defPoints = allocation
    ? evToStatPoints(allocation.setup.evs[defKey] ?? 0)
    : null
  const mod = allocation
    ? defenseStatMod(allocation.setup.nature, args.category)
    : ""
  const isEx =
    label === EX_LABEL || (hpPoints === 32 && defPoints === 32 && mod === "+")
  const sp =
    hpPoints === null || defPoints === null
      ? null
      : `${hpPoints}${statDisplayName(args.strategy, "hp")} / ${defPoints}${statDisplayName(args.strategy, defKey)}`
  return {
    label,
    actual: formatDefenseStatValue(args.hp, args.def),
    sp,
    nature: natureAdjFromMod(mod),
    band: investBand(args.hp - zeroHp + (args.def - zeroDef), isEx),
    temporary: args.temporary === true,
  }
}

export function resolvePresetChip(
  preset: StatPreset,
  calcName: string,
  category: MoveCategory,
  allocationIndex: number,
  strategy: StatNameStrategy,
): StatValueChipModel {
  if (preset.values.kind === "offense") {
    return resolveOffenseChip({
      calcName,
      category,
      stat: preset.values.stat,
      strategy,
      allocationIndex,
      temporary: preset.kind === "temporary",
    })
  }
  return resolveDefenseChip({
    calcName,
    category,
    hp: preset.values.hp,
    def: preset.values.def,
    strategy,
    allocationIndex,
    temporary: preset.kind === "temporary",
  })
}

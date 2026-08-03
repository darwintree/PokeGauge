import { getOffenseStat } from "@/lib/calc-adapter"
import { getDefenderSpreadGrid } from "@/lib/calc-adapter/stat-bounds"
import type { DefenderSetup, StatSetup } from "@/lib/calc-adapter/types"
import {
  defenseStatKey,
  offenseStatKey,
} from "@/lib/calc-adapter/presets"
import type { MoveCategory } from "@/lib/catalog/types"

import { defenseStatMod, offenseStatMod, type NatureMod } from "./nature-mod"
import { statDisplayName, type StatNameStrategy } from "./stat-name-strategy"
import type { DefenseStatValue, StatPreset } from "./types"

export const EX_LABEL = "EX"

export type StatAllocationMatch = {
  label: string
  setup: StatSetup | DefenderSetup
}

export type StatPresetDisplay = {
  primary: string
  allocations: StatAllocationMatch[]
  tooltip: string | null
}

const offenseAllocationCache = new Map<string, StatAllocationMatch[]>()
const defenseAllocationCache = new Map<string, StatAllocationMatch[]>()

export function evToStatPoints(ev: number): number {
  return Math.floor((ev + 4) / 8)
}

function isOffenseEx(points: number, mod: NatureMod): boolean {
  return points === 32 && mod === "+"
}

function isDefenseEx(hpPoints: number, defPoints: number, defMod: NatureMod): boolean {
  return hpPoints === 32 && defPoints === 32 && defMod === "+"
}

export function offenseStatValueLabel(
  points: number,
  mod: NatureMod,
  category: MoveCategory,
  strategy: StatNameStrategy,
): string {
  if (isOffenseEx(points, mod)) return EX_LABEL
  const statName = statDisplayName(strategy, offenseStatKey(category))
  return `${points}${statName}${mod}`
}

export function defenseStatValueLabel(
  hpPoints: number,
  defPoints: number,
  defMod: NatureMod,
  category: MoveCategory,
  strategy: StatNameStrategy,
): string {
  if (isDefenseEx(hpPoints, defPoints, defMod)) return EX_LABEL
  const hpName = statDisplayName(strategy, "hp")
  const defName = statDisplayName(strategy, defenseStatKey(category))
  return `${hpPoints}${hpName}${defPoints}${defName}${defMod}`
}

/** Spread → SP label (neutral mod for offense fallback) */
export function offenseStatAllocationLabel(
  setup: StatSetup,
  category: MoveCategory,
  strategy: StatNameStrategy,
): string {
  const statKey = offenseStatKey(category)
  const points = evToStatPoints(setup.evs[statKey] ?? 0)
  const mod = offenseStatMod(setup.nature, category)
  return offenseStatValueLabel(points, mod === "-" ? "" : mod, category, strategy)
}

/** Spread → SP label (defense fallback) */
export function defenseStatAllocationLabel(
  setup: DefenderSetup,
  category: MoveCategory,
  strategy: StatNameStrategy,
): string {
  const defKey = defenseStatKey(category)
  const hpPoints = evToStatPoints(setup.evs.hp ?? 0)
  const defPoints = evToStatPoints(setup.evs[defKey] ?? 0)
  const defMod = defenseStatMod(setup.nature, category)
  return defenseStatValueLabel(
    hpPoints,
    defPoints,
    defMod === "-" ? "" : defMod,
    category,
    strategy,
  )
}

function enumerateOffenseSpreads(statKey: "atk" | "spa"): StatSetup[] {
  const natures = [
    "Serious",
    "Adamant",
    "Jolly",
    "Modest",
    "Timid",
    "Bold",
    "Impish",
    "Calm",
    "Lonely",
  ] as const
  const out: StatSetup[] = []
  for (const nature of natures) {
    for (let ev = 0; ev <= 252; ev += 4) {
      out.push({ nature, evs: { [statKey]: ev } })
    }
  }
  return out
}

function sortByNeutralFirst<T extends StatAllocationMatch>(
  list: T[],
  isNeutral: (setup: StatSetup | DefenderSetup) => boolean,
): T[] {
  return list.sort((a, b) => {
    const aNeutral = isNeutral(a.setup) ? 0 : 1
    const bNeutral = isNeutral(b.setup) ? 0 : 1
    if (aNeutral !== bNeutral) return aNeutral - bNeutral
    return a.label.localeCompare(b.label)
  })
}

export function enumerateOffenseAllocations(
  calcName: string,
  category: MoveCategory,
  targetStat: number,
  strategy: StatNameStrategy,
): StatAllocationMatch[] {
  const cacheKey = `${calcName}\0${category}\0${targetStat}\0${strategy}`
  const cached = offenseAllocationCache.get(cacheKey)
  if (cached) return cached

  const statKey = offenseStatKey(category)
  const groups = new Map<string, StatAllocationMatch>()

  for (const setup of enumerateOffenseSpreads(statKey)) {
    if (getOffenseStat(calcName, category, setup) !== targetStat) continue
    const points = evToStatPoints(setup.evs[statKey] ?? 0)
    const mod = offenseStatMod(setup.nature, category)
    if (mod === "-") continue
    const label = offenseStatValueLabel(points, mod, category, strategy)
    if (!groups.has(label)) {
      groups.set(label, { label, setup })
    }
  }

  const allocations = sortByNeutralFirst(
    [...groups.values()],
    (setup) => offenseStatMod(setup.nature, category) === "",
  )
  offenseAllocationCache.set(cacheKey, allocations)
  return allocations
}

export function enumerateDefenseAllocations(
  calcName: string,
  category: MoveCategory,
  target: DefenseStatValue,
  strategy: StatNameStrategy,
): StatAllocationMatch[] {
  const cacheKey = `${calcName}\0${category}\0${target.hp}\0${target.def}\0${strategy}`
  const cached = defenseAllocationCache.get(cacheKey)
  if (cached) return cached

  const groups = new Map<string, StatAllocationMatch>()

  for (const entry of getDefenderSpreadGrid(calcName, category)) {
    if (entry.hp !== target.hp || entry.def !== target.def) continue
    const defMod = defenseStatMod(entry.setup.nature, category)
    if (defMod === "-") continue
    const defKey = defenseStatKey(category)
    const hpPoints = evToStatPoints(entry.setup.evs.hp ?? 0)
    const defPoints = evToStatPoints(entry.setup.evs[defKey] ?? 0)
    const label = defenseStatValueLabel(hpPoints, defPoints, defMod, category, strategy)
    if (!groups.has(label)) {
      groups.set(label, { label, setup: entry.setup })
    }
  }

  const allocations = sortByNeutralFirst(
    [...groups.values()],
    (setup) => defenseStatMod(setup.nature, category) === "",
  )
  defenseAllocationCache.set(cacheKey, allocations)
  return allocations
}

export function formatOffenseStatValue(stat: number): string {
  return String(stat)
}

export function formatDefenseStatValue(hp: number, def: number): string {
  return `${hp} / ${def}`
}

export function formatStatPresetValue(preset: StatPreset): string {
  if (preset.values.kind === "offense") {
    return formatOffenseStatValue(preset.values.stat)
  }
  return formatDefenseStatValue(preset.values.hp, preset.values.def)
}

function buildAllocationTooltip(
  preset: StatPreset,
  allocations: StatAllocationMatch[],
): string {
  const statValueText = formatStatPresetValue(preset)
  const labels = allocations.map((a) => a.label).join(" · ")
  return labels ? `${statValueText}\n${labels}` : statValueText
}

export function resolveStatPresetDisplay(
  preset: StatPreset,
  calcName: string,
  category: MoveCategory,
  allocationIndex: number,
  strategy: StatNameStrategy,
): StatPresetDisplay {
  const values = preset.values
  const allocations =
    values.kind === "offense"
      ? enumerateOffenseAllocations(calcName, category, values.stat, strategy)
      : enumerateDefenseAllocations(calcName, category, values, strategy)

  const primary =
    allocations.length > 0
      ? allocations[allocationIndex % allocations.length].label
      : formatStatPresetValue(preset)

  return {
    primary,
    allocations,
    tooltip: buildAllocationTooltip(preset, allocations),
  }
}

export function statPresetLabel(
  preset: StatPreset,
  calcName: string,
  category: MoveCategory,
  allocationIndex = 0,
  strategy: StatNameStrategy = "habcds",
): string {
  return resolveStatPresetDisplay(
    preset,
    calcName,
    category,
    allocationIndex,
    strategy,
  ).primary
}

export function offenseValueOf(preset: StatPreset): number {
  if (preset.values.kind !== "offense") {
    throw new Error("Not an offense preset")
  }
  return preset.values.stat
}

export function defenseValuesOf(preset: StatPreset): DefenseStatValue {
  if (preset.values.kind !== "defense") {
    throw new Error("Not a defense preset")
  }
  return preset.values
}

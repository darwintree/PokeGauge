import { getOffenseStat } from "@/lib/calc-adapter"
import {
  getDefenderSpreadGrid,
  nearestDefenderSetupForValues,
  nearestOffenseSetupForStat,
} from "@/lib/calc-adapter/stat-bounds"
import type { DefenderSetup, StatSetup } from "@/lib/calc-adapter/types"
import {
  defenseStatKey,
  getAttackerStatSetups,
  getDefenderSetups,
  offenseStatKey,
} from "@/lib/calc-adapter/presets"
import type { MoveCategory } from "@/lib/catalog/types"

import { defenseStatMod, offenseStatMod, type NatureMod } from "./nature-mod"
import { statDisplayName, type StatNameStrategy } from "./stat-name-strategy"
import type { DefenseTemplateValues, StatValueTemplate } from "./types"

export const EX_LABEL = "EX"

export type EffortAllocation = {
  cardLabel: string
  setup: StatSetup | DefenderSetup
}

export type TemplateDisplay = {
  primary: string
  allocations: EffortAllocation[]
  tooltip: string | null
}

const offenseAllocationCache = new Map<string, EffortAllocation[]>()
const defenseAllocationCache = new Map<string, EffortAllocation[]>()

export function evToAbilityPoints(ev: number): number {
  return Math.floor((ev + 4) / 8)
}

function isOffenseEx(points: number, mod: NatureMod): boolean {
  return points === 32 && mod === "+"
}

function isDefenseEx(hpPoints: number, defPoints: number, defMod: NatureMod): boolean {
  return hpPoints === 32 && defPoints === 32 && defMod === "+"
}

export function offenseSpLabel(
  points: number,
  mod: NatureMod,
  category: MoveCategory,
  strategy: StatNameStrategy,
): string {
  if (isOffenseEx(points, mod)) return EX_LABEL
  const statName = statDisplayName(strategy, offenseStatKey(category))
  return `${points}${statName}${mod}`
}

export function defenseSpLabel(
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
export function offenseSpreadLabel(
  setup: StatSetup,
  category: MoveCategory,
  strategy: StatNameStrategy,
): string {
  const statKey = offenseStatKey(category)
  const points = evToAbilityPoints(setup.evs[statKey] ?? 0)
  const mod = offenseStatMod(setup.nature, category)
  return offenseSpLabel(points, mod === "-" ? "" : mod, category, strategy)
}

/** Spread → SP label (defense fallback) */
export function defenseSpreadLabel(
  setup: DefenderSetup,
  category: MoveCategory,
  strategy: StatNameStrategy,
): string {
  const defKey = defenseStatKey(category)
  const hpPoints = evToAbilityPoints(setup.evs.hp ?? 0)
  const defPoints = evToAbilityPoints(setup.evs[defKey] ?? 0)
  const defMod = defenseStatMod(setup.nature, category)
  return defenseSpLabel(
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

function sortByNeutralFirst<T extends EffortAllocation>(
  list: T[],
  isNeutral: (setup: StatSetup | DefenderSetup) => boolean,
): T[] {
  return list.sort((a, b) => {
    const aNeutral = isNeutral(a.setup) ? 0 : 1
    const bNeutral = isNeutral(b.setup) ? 0 : 1
    if (aNeutral !== bNeutral) return aNeutral - bNeutral
    return a.cardLabel.localeCompare(b.cardLabel)
  })
}

export function enumerateOffenseAllocations(
  species: string,
  category: MoveCategory,
  targetStat: number,
  strategy: StatNameStrategy,
): EffortAllocation[] {
  const cacheKey = `${species}\0${category}\0${targetStat}\0${strategy}`
  const cached = offenseAllocationCache.get(cacheKey)
  if (cached) return cached

  const statKey = offenseStatKey(category)
  const groups = new Map<string, EffortAllocation>()

  for (const setup of enumerateOffenseSpreads(statKey)) {
    if (getOffenseStat(species, category, setup) !== targetStat) continue
    const points = evToAbilityPoints(setup.evs[statKey] ?? 0)
    const mod = offenseStatMod(setup.nature, category)
    if (mod === "-") continue
    const cardLabel = offenseSpLabel(points, mod, category, strategy)
    if (!groups.has(cardLabel)) {
      groups.set(cardLabel, { cardLabel, setup })
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
  species: string,
  category: MoveCategory,
  target: DefenseTemplateValues,
  strategy: StatNameStrategy,
): EffortAllocation[] {
  const cacheKey = `${species}\0${category}\0${target.hp}\0${target.def}\0${strategy}`
  const cached = defenseAllocationCache.get(cacheKey)
  if (cached) return cached

  const groups = new Map<string, EffortAllocation>()

  for (const entry of getDefenderSpreadGrid(species, category)) {
    if (entry.hp !== target.hp || entry.def !== target.def) continue
    const defMod = defenseStatMod(entry.setup.nature, category)
    if (defMod === "-") continue
    const defKey = defenseStatKey(category)
    const hpPoints = evToAbilityPoints(entry.setup.evs.hp ?? 0)
    const defPoints = evToAbilityPoints(entry.setup.evs[defKey] ?? 0)
    const cardLabel = defenseSpLabel(hpPoints, defPoints, defMod, category, strategy)
    if (!groups.has(cardLabel)) {
      groups.set(cardLabel, { cardLabel, setup: entry.setup })
    }
  }

  const allocations = sortByNeutralFirst(
    [...groups.values()],
    (setup) => defenseStatMod(setup.nature, category) === "",
  )
  defenseAllocationCache.set(cacheKey, allocations)
  return allocations
}

export function formatOffenseActual(stat: number): string {
  return String(stat)
}

export function formatDefenseActual(hp: number, def: number): string {
  return `${hp} / ${def}`
}

export function formatTemplateActual(template: StatValueTemplate): string {
  if (template.values.kind === "offense") {
    return formatOffenseActual(template.values.stat)
  }
  return formatDefenseActual(template.values.hp, template.values.def)
}

function buildAllocationTooltip(
  template: StatValueTemplate,
  allocations: EffortAllocation[],
): string {
  const actual = formatTemplateActual(template)
  const labels = allocations.map((a) => a.cardLabel).join(" · ")
  return labels ? `${actual}\n${labels}` : actual
}

export function resolveTemplateDisplay(
  template: StatValueTemplate,
  species: string,
  category: MoveCategory,
  allocationIndex: number,
  strategy: StatNameStrategy,
): TemplateDisplay {
  const values = template.values
  const allocations =
    values.kind === "offense"
      ? enumerateOffenseAllocations(species, category, values.stat, strategy)
      : enumerateDefenseAllocations(species, category, values, strategy)

  let spLabel: string
  if (allocations.length > 0) {
    spLabel = allocations[allocationIndex % allocations.length].cardLabel
  } else if (values.kind === "offense") {
    const setup = nearestOffenseSetupForStat(species, category, values.stat)
    spLabel = offenseSpreadLabel(setup, category, strategy)
  } else {
    const setup = nearestDefenderSetupForValues(species, category, values.hp, values.def)
    spLabel = defenseSpreadLabel(setup, category, strategy)
  }

  return {
    primary: spLabel,
    allocations,
    tooltip: buildAllocationTooltip(template, allocations),
  }
}

export function templateCardLabel(
  template: StatValueTemplate,
  species: string,
  category: MoveCategory,
  allocationIndex = 0,
  strategy: StatNameStrategy = "habcds",
): string {
  return resolveTemplateDisplay(
    template,
    species,
    category,
    allocationIndex,
    strategy,
  ).primary
}

export function offenseValueOf(template: StatValueTemplate): number {
  if (template.values.kind !== "offense") {
    throw new Error("Not an offense template")
  }
  return template.values.stat
}

export function defenseValuesOf(template: StatValueTemplate): DefenseTemplateValues {
  if (template.values.kind !== "defense") {
    throw new Error("Not a defense template")
  }
  return template.values
}

export function defaultOffenseSetup(
  species: string,
  category: MoveCategory,
  template: StatValueTemplate,
): StatSetup {
  const allocs = enumerateOffenseAllocations(
    species,
    category,
    offenseValueOf(template),
    "habcds",
  )
  if (allocs.length > 0) return allocs[0].setup
  return getAttackerStatSetups(category)["neutral-zero"]
}

export function defaultDefenseSetup(
  species: string,
  category: MoveCategory,
  template: StatValueTemplate,
): DefenderSetup {
  const allocs = enumerateDefenseAllocations(
    species,
    category,
    defenseValuesOf(template),
    "habcds",
  )
  if (allocs.length > 0) return allocs[0].setup as DefenderSetup
  return getDefenderSetups(category)["min-bulk"]
}

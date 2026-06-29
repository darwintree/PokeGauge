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
import type { DefenseTemplateValues, StatValueTemplate } from "./types"

export type EffortAllocation = {
  id: string
  /** Card label for this allocation group */
  cardLabel: string
  setup: StatSetup | DefenderSetup
}

export function evToAbilityPoints(ev: number): number {
  return Math.floor((ev + 4) / 8)
}

function offensePointsLabel(points: number, mod: NatureMod = ""): string {
  if (points === 0 && !mod) return "0"
  return `${points}${mod}`
}

function isOffenseEx(points: number, mod: NatureMod): boolean {
  return points === 32 && mod === "+"
}

function isDefenseEx(hpPoints: number, defPoints: number, defMod: NatureMod): boolean {
  return hpPoints === 32 && defPoints === 32 && defMod === "+"
}

function isDefenseHpOnly(hpPoints: number, defPoints: number, defMod: NatureMod): boolean {
  return hpPoints === 32 && defPoints === 0 && defMod === ""
}

/** Label engine §7 — offense spread → card label */
export function offenseSpreadLabel(
  setup: StatSetup,
  category: MoveCategory,
): string {
  const statKey = offenseStatKey(category)
  const ev = setup.evs[statKey] ?? 0
  const points = evToAbilityPoints(ev)
  const mod = offenseStatMod(setup.nature, category)
  if (isOffenseEx(points, mod)) return "ex"
  return offensePointsLabel(points, "")
}

/** Label engine §7 — defender spread → card label */
export function defenseSpreadLabel(
  setup: DefenderSetup,
  category: MoveCategory,
): string {
  const defKey = defenseStatKey(category)
  const hpPoints = evToAbilityPoints(setup.evs.hp ?? 0)
  const defPoints = evToAbilityPoints(setup.evs[defKey] ?? 0)
  const defMod = defenseStatMod(setup.nature, category)
  if (isDefenseEx(hpPoints, defPoints, defMod)) return "ex"
  if (isDefenseHpOnly(hpPoints, defPoints, defMod)) return "32HP"
  if (hpPoints === 0 && defPoints === 0) return "0"
  return offensePointsLabel(defPoints, "")
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

function defenseCardLabel(
  setup: DefenderSetup,
  category: MoveCategory,
): string {
  const defKey = defenseStatKey(category)
  const hpPoints = evToAbilityPoints(setup.evs.hp ?? 0)
  const defPoints = evToAbilityPoints(setup.evs[defKey] ?? 0)
  const defMod = defenseStatMod(setup.nature, category)
  if (isDefenseEx(hpPoints, defPoints, defMod)) return "ex"
  if (isDefenseHpOnly(hpPoints, defPoints, defMod)) return "32HP"
  if (hpPoints === 0 && defPoints === 0) return "0"
  return offensePointsLabel(defPoints, defMod)
}

export function enumerateOffenseAllocations(
  species: string,
  category: MoveCategory,
  targetStat: number,
): EffortAllocation[] {
  const statKey = offenseStatKey(category)
  const groups = new Map<string, EffortAllocation>()

  for (const setup of enumerateOffenseSpreads(statKey)) {
    if (getOffenseStat(species, category, setup) !== targetStat) continue
    const ev = setup.evs[statKey] ?? 0
    const points = evToAbilityPoints(ev)
    const mod = offenseStatMod(setup.nature, category)
    if (mod === "-") continue
    const cardLabel = isOffenseEx(points, mod)
      ? "ex"
      : offensePointsLabel(points, mod)
    if (!groups.has(cardLabel)) {
      groups.set(cardLabel, { id: cardLabel, cardLabel, setup })
    }
  }

  return sortByNeutralFirst(
    [...groups.values()],
    (setup) => offenseStatMod(setup.nature, category) === "",
  )
}

export function enumerateDefenseAllocations(
  species: string,
  category: MoveCategory,
  target: DefenseTemplateValues,
): EffortAllocation[] {
  const groups = new Map<string, EffortAllocation>()

  for (const entry of getDefenderSpreadGrid(species, category)) {
    if (entry.hp !== target.hp || entry.def !== target.def) continue
    if (defenseStatMod(entry.setup.nature, category) === "-") continue
    const cardLabel = defenseCardLabel(entry.setup, category)
    if (!groups.has(cardLabel)) {
      groups.set(cardLabel, { id: cardLabel, cardLabel, setup: entry.setup })
    }
  }

  return sortByNeutralFirst(
    [...groups.values()],
    (setup) => defenseStatMod(setup.nature, category) === "",
  )
}

/** Card label for template — allocationIndex selects merged spread group */
export function templateCardLabel(
  template: StatValueTemplate,
  species: string,
  category: MoveCategory,
  allocationIndex = 0,
): string {
  if (template.values.kind === "offense") {
    const allocs = enumerateOffenseAllocations(species, category, template.values.stat)
    if (allocs.length > 0) return allocs[allocationIndex % allocs.length].cardLabel
    const setup = nearestOffenseSetupForStat(species, category, template.values.stat)
    return offenseSpreadLabel(setup, category)
  }

  const values = template.values
  const allocs = enumerateDefenseAllocations(species, category, values)
  if (allocs.length > 0) return allocs[allocationIndex % allocs.length].cardLabel
  const setup = nearestDefenderSetupForValues(species, category, values.hp, values.def)
  return defenseSpreadLabel(setup, category)
}

export function formatOffenseActual(stat: number): string {
  return String(stat)
}

export function formatDefenseActual(hp: number, def: number): string {
  return `${hp} / ${def}`
}

/** ponytail: placeholder until default-naming issue lands */
export function placeholderTemplateName(template: StatValueTemplate): string {
  if (template.values.kind === "offense") {
    return formatOffenseActual(template.values.stat)
  }
  return `${template.values.hp}/${template.values.def}`
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

/** System preset spread for pipeline damage (any spread matching stored value). */
export function defaultOffenseSetup(
  species: string,
  category: MoveCategory,
  template: StatValueTemplate,
): StatSetup {
  const allocs = enumerateOffenseAllocations(species, category, offenseValueOf(template))
  if (allocs.length > 0) return allocs[0].setup
  return getAttackerStatSetups(category)["neutral-zero"]
}

export function defaultDefenseSetup(
  species: string,
  category: MoveCategory,
  template: StatValueTemplate,
): DefenderSetup {
  const allocs = enumerateDefenseAllocations(species, category, defenseValuesOf(template))
  if (allocs.length > 0) return allocs[0].setup as DefenderSetup
  return getDefenderSetups(category)["min-bulk"]
}

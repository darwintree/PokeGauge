import type { MoveCategory } from "@/lib/catalog/types"
import {
  DEFENSE_DEF_AXIS_LABELS,
  DEFENSE_DEF_SNAP_IDS,
  DEFENSE_HP_AXIS_LABELS,
  DEFENSE_HP_SNAP_IDS,
  OFFENSE_AXIS_SNAP_LABELS,
  OFFENSE_SNAP_PRESET_IDS,
} from "@/lib/catalog/preset-labels"
import {
  defenseDefSnapTier,
  defenseHpSnapTier,
  offenseSnapTier,
} from "@/lib/stat-tier-colors"

import { defenderStatValues, offenseStatValue } from "./local-stats"
import {
  defenseStatKey,
  getAttackerStatSetups,
  getDefenderSetups,
  offenseStatKey,
} from "./presets"
import type { DefenderSetup, StatAxisBounds, StatSetup } from "./types"

const CANDIDATE_NATURES = [
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

function enumerateStatSpreads(
  statKey: "atk" | "spa" | "def" | "spd",
): StatSetup[] {
  const out: StatSetup[] = []
  for (const nature of CANDIDATE_NATURES) {
    for (let ev = 0; ev <= 252; ev += 4) {
      out.push({ nature, evs: { [statKey]: ev } })
    }
  }
  return out
}

function enumerateDefenderSpreads(category: MoveCategory): DefenderSetup[] {
  const defKey = defenseStatKey(category)
  const out: DefenderSetup[] = []
  for (const nature of CANDIDATE_NATURES) {
    for (let hpEv = 0; hpEv <= 252; hpEv += 4) {
      for (let defEv = 0; defEv <= 252; defEv += 4) {
        out.push({ nature, evs: { hp: hpEv, [defKey]: defEv } })
      }
    }
  }
  return out
}

export function getOffenseStat(
  species: string,
  category: MoveCategory,
  setup: StatSetup,
): number {
  return offenseStatValue(species, category, setup)
}

function getDefenderStats(
  species: string,
  category: MoveCategory,
  setup: DefenderSetup,
): { hp: number; def: number } {
  return defenderStatValues(species, category, setup)
}

export function getDefenderHp(species: string, setup: DefenderSetup): number {
  return getDefenderStats(species, "physical", setup).hp
}

export function getDefenderDefStat(
  species: string,
  category: MoveCategory,
  setup: DefenderSetup,
): number {
  return getDefenderStats(species, category, setup).def
}

type DefenderSpreadEntry = {
  setup: DefenderSetup
  hp: number
  def: number
}

const defenderSpreadCache = new Map<string, DefenderSpreadEntry[]>()

export function getDefenderSpreadGrid(
  species: string,
  category: MoveCategory,
): DefenderSpreadEntry[] {
  const key = `${species}:${category}`
  const cached = defenderSpreadCache.get(key)
  if (cached) return cached

  const grid = enumerateDefenderSpreads(category).map((setup) => {
    const { hp, def } = getDefenderStats(species, category, setup)
    return { setup, hp, def }
  })
  defenderSpreadCache.set(key, grid)
  return grid
}

export function getOffenseStatBounds(
  species: string,
  category: MoveCategory,
): StatAxisBounds {
  const statKey = offenseStatKey(category)
  const setups = getAttackerStatSetups(category)
  const stats = enumerateStatSpreads(statKey).map((s) =>
    getOffenseStat(species, category, s),
  )

  return {
    min: Math.min(...stats),
    max: Math.max(...stats),
    snapPoints: OFFENSE_SNAP_PRESET_IDS.map((id) => ({
      id,
      value: getOffenseStat(species, category, setups[id]),
      label: OFFENSE_AXIS_SNAP_LABELS[id],
      tier: offenseSnapTier(id)!,
    })),
  }
}

export function getDefenderHpBounds(species: string): StatAxisBounds {
  const setups = getDefenderSetups("physical")
  const stats = Array.from({ length: 64 }, (_, i) => i * 4).map((hpEv) =>
    getDefenderHp(species, { nature: "Serious", evs: { hp: hpEv } }),
  )

  return {
    min: Math.min(...stats),
    max: Math.max(...stats),
    snapPoints: DEFENSE_HP_SNAP_IDS.map((id) => ({
      id,
      value: getDefenderHp(species, setups[id]),
      label: DEFENSE_HP_AXIS_LABELS[id],
      tier: defenseHpSnapTier(id)!,
    })),
  }
}

export function getDefenderDefBounds(
  species: string,
  category: MoveCategory,
): StatAxisBounds {
  const setups = getDefenderSetups(category)
  const defKey = defenseStatKey(category)
  const stats = enumerateStatSpreads(defKey).map((s) =>
    getDefenderDefStat(species, category, s),
  )

  return {
    min: Math.min(...stats),
    max: Math.max(...stats),
    snapPoints: DEFENSE_DEF_SNAP_IDS.map((id) => ({
      id,
      value: getDefenderDefStat(species, category, setups[id]),
      label: DEFENSE_DEF_AXIS_LABELS[id],
      tier: defenseDefSnapTier(id)!,
    })),
  }
}

/** ponytail: ~37k spreads/species; warm once so range-mode clicks stay responsive */
export function warmDefenderSpreadCache(
  species: string,
  category: MoveCategory,
): void {
  getDefenderSpreadGrid(species, category)
}

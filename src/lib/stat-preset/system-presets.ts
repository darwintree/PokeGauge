import {
  getDefenderDefStat,
  getDefenderHp,
  getOffenseStat,
} from "@/lib/stat-calculation"
import { getAttackerStatSetups, getDefenderSetups } from "@/lib/stat-calculation"
import type { MoveCategory } from "@/lib/catalog"

import type { DefensePresetId, OffensePresetId } from "@/lib/catalog"

import type { StatPreset } from "./types"

const OFFENSE_SYSTEM_IDS = ["neutral-zero", "neutral-max", "extreme"] as const
const DEFENSE_SYSTEM_IDS = ["min-bulk", "hp-32", "standard-bulk"] as const

export const OFFENSE_DEFAULT_SELECTED: OffensePresetId[] = ["neutral-zero", "extreme"]
export const DEFENSE_DEFAULT_SELECTED: DefensePresetId[] = ["min-bulk", "hp-32"]

function offenseSystemPreset(
  id: OffensePresetId,
  calcName: string,
  category: MoveCategory,
): StatPreset {
  const setup = getAttackerStatSetups(category)[id]
  const stat = getOffenseStat(calcName, category, setup)
  return {
    id,
    kind: "system",
    values: { kind: "offense", stat },
  }
}

function defenseSystemPreset(
  id: DefensePresetId,
  calcName: string,
  category: MoveCategory,
): StatPreset {
  const setup = getDefenderSetups(category)[id]
  const hp = getDefenderHp(calcName, setup)
  const def = getDefenderDefStat(calcName, category, setup)
  return {
    id,
    kind: "system",
    values: { kind: "defense", hp, def },
  }
}

export function buildSystemOffensePresets(
  calcName: string,
  category: MoveCategory,
): StatPreset[] {
  return OFFENSE_SYSTEM_IDS.map((id) => offenseSystemPreset(id, calcName, category))
}

export function buildSystemDefensePresets(
  calcName: string,
  category: MoveCategory,
): StatPreset[] {
  return DEFENSE_SYSTEM_IDS.map((id) => defenseSystemPreset(id, calcName, category))
}

export function isSystemPresetId(id: string): boolean {
  return (
    (OFFENSE_SYSTEM_IDS as readonly string[]).includes(id) ||
    (DEFENSE_SYSTEM_IDS as readonly string[]).includes(id)
  )
}

export function defaultOffensePresetSelection(
  systemPresets: StatPreset[],
  userPresets: StatPreset[],
): string[] {
  const systemIds = new Set(
    systemPresets
      .filter((t) => (OFFENSE_DEFAULT_SELECTED as readonly string[]).includes(t.id))
      .map((t) => t.id),
  )
  const userIds = userPresets.map((t) => t.id)
  return [...systemIds, ...userIds]
}

export function defaultDefensePresetSelection(
  systemPresets: StatPreset[],
  userPresets: StatPreset[],
): string[] {
  const systemIds = new Set(
    systemPresets
      .filter((t) => (DEFENSE_DEFAULT_SELECTED as readonly string[]).includes(t.id))
      .map((t) => t.id),
  )
  const userIds = userPresets.map((t) => t.id)
  return [...systemIds, ...userIds]
}

export function mergeStatPresets(
  system: StatPreset[],
  user: StatPreset[],
  temporary: StatPreset[],
): StatPreset[] {
  return [...system, ...user, ...temporary]
}

export function findPresetByOffenseValue(
  presets: StatPreset[],
  value: number,
): StatPreset | undefined {
  return presets.find(
    (t) => t.values.kind === "offense" && t.values.stat === value,
  )
}

export function findPresetByDefenseValues(
  presets: StatPreset[],
  hp: number,
  def: number,
): StatPreset | undefined {
  return presets.find(
    (t) =>
      t.values.kind === "defense" && t.values.hp === hp && t.values.def === def,
  )
}

export function newUserOffensePreset(stat: number): StatPreset {
  return {
    id: `user-${crypto.randomUUID()}`,
    kind: "user",
    values: { kind: "offense", stat },
  }
}

export function newUserDefensePreset(hp: number, def: number): StatPreset {
  return {
    id: `user-${crypto.randomUUID()}`,
    kind: "user",
    values: { kind: "defense", hp, def },
  }
}

export function newTemporaryOffensePreset(stat: number): StatPreset {
  return {
    id: `temp-${crypto.randomUUID()}`,
    kind: "temporary",
    values: { kind: "offense", stat },
  }
}

export function newTemporaryDefensePreset(hp: number, def: number): StatPreset {
  return {
    id: `temp-${crypto.randomUUID()}`,
    kind: "temporary",
    values: { kind: "defense", hp, def },
  }
}

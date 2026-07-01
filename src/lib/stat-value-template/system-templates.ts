import {
  getDefenderDefStat,
  getDefenderHp,
  getOffenseStat,
} from "@/lib/calc-adapter"
import { getAttackerStatSetups, getDefenderSetups } from "@/lib/calc-adapter/presets"
import type { MoveCategory } from "@/lib/catalog/types"
import {
  defenderBulkTier,
  offenseStatTier,
} from "@/lib/stat-tier-colors"

import type { DefensePresetId, OffensePresetId } from "@/lib/catalog/preset-labels"

import type { StatValueTemplate } from "./types"

const OFFENSE_SYSTEM_IDS = ["neutral-zero", "neutral-max", "extreme"] as const
const DEFENSE_SYSTEM_IDS = ["min-bulk", "hp-32", "standard-bulk"] as const

export const OFFENSE_DEFAULT_SELECTED: OffensePresetId[] = ["neutral-max", "extreme"]
export const DEFENSE_DEFAULT_SELECTED: DefensePresetId[] = ["hp-32"]

function offenseSystemTemplate(
  id: OffensePresetId,
  species: string,
  category: MoveCategory,
): StatValueTemplate {
  const setup = getAttackerStatSetups(category)[id]
  const stat = getOffenseStat(species, category, setup)
  return {
    id,
    kind: "system",
    values: { kind: "offense", stat },
    systemTier: offenseStatTier(id),
  }
}

function defenseSystemTemplate(
  id: DefensePresetId,
  species: string,
  category: MoveCategory,
): StatValueTemplate {
  const setup = getDefenderSetups(category)[id]
  const hp = getDefenderHp(species, setup)
  const def = getDefenderDefStat(species, category, setup)
  return {
    id,
    kind: "system",
    values: { kind: "defense", hp, def },
    systemTier: defenderBulkTier(id),
  }
}

export function buildSystemOffenseTemplates(
  species: string,
  category: MoveCategory,
): StatValueTemplate[] {
  return OFFENSE_SYSTEM_IDS.map((id) => offenseSystemTemplate(id, species, category))
}

export function buildSystemDefenseTemplates(
  species: string,
  category: MoveCategory,
): StatValueTemplate[] {
  return DEFENSE_SYSTEM_IDS.map((id) => defenseSystemTemplate(id, species, category))
}

export function isSystemTemplateId(id: string): boolean {
  return (
    (OFFENSE_SYSTEM_IDS as readonly string[]).includes(id) ||
    (DEFENSE_SYSTEM_IDS as readonly string[]).includes(id)
  )
}

export function defaultOffenseSelection(
  systemTemplates: StatValueTemplate[],
  userTemplates: StatValueTemplate[],
): string[] {
  const systemIds = new Set(
    systemTemplates
      .filter((t) => (OFFENSE_DEFAULT_SELECTED as readonly string[]).includes(t.id))
      .map((t) => t.id),
  )
  const userIds = userTemplates.map((t) => t.id)
  return [...systemIds, ...userIds]
}

export function defaultDefenseSelection(
  systemTemplates: StatValueTemplate[],
  userTemplates: StatValueTemplate[],
): string[] {
  const systemIds = new Set(
    systemTemplates
      .filter((t) => (DEFENSE_DEFAULT_SELECTED as readonly string[]).includes(t.id))
      .map((t) => t.id),
  )
  const userIds = userTemplates.map((t) => t.id)
  return [...systemIds, ...userIds]
}

export function mergeTemplates(
  system: StatValueTemplate[],
  user: StatValueTemplate[],
  temporary: StatValueTemplate[],
): StatValueTemplate[] {
  return [...system, ...user, ...temporary]
}

export function findTemplateByOffenseValue(
  templates: StatValueTemplate[],
  value: number,
): StatValueTemplate | undefined {
  return templates.find(
    (t) => t.values.kind === "offense" && t.values.stat === value,
  )
}

export function findTemplateByDefenseValues(
  templates: StatValueTemplate[],
  hp: number,
  def: number,
): StatValueTemplate | undefined {
  return templates.find(
    (t) =>
      t.values.kind === "defense" && t.values.hp === hp && t.values.def === def,
  )
}

export function newUserOffenseTemplate(stat: number): StatValueTemplate {
  return {
    id: `user-${crypto.randomUUID()}`,
    kind: "user",
    values: { kind: "offense", stat },
  }
}

export function newUserDefenseTemplate(hp: number, def: number): StatValueTemplate {
  return {
    id: `user-${crypto.randomUUID()}`,
    kind: "user",
    values: { kind: "defense", hp, def },
  }
}

export function newTemporaryOffenseTemplate(stat: number): StatValueTemplate {
  return {
    id: `temp-${crypto.randomUUID()}`,
    kind: "temporary",
    values: { kind: "offense", stat },
  }
}

export function newTemporaryDefenseTemplate(hp: number, def: number): StatValueTemplate {
  return {
    id: `temp-${crypto.randomUUID()}`,
    kind: "temporary",
    values: { kind: "defense", hp, def },
  }
}

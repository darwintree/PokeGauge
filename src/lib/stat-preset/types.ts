import type { StatTierTokenSet } from "@/lib/stat-tier-colors"

export type StatPresetKind = "system" | "user" | "temporary"

export type OffenseStatValue = {
  kind: "offense"
  stat: number
}

export type DefenseStatValue = {
  kind: "defense"
  hp: number
  def: number
}

export type StatPreset = {
  id: string
  kind: StatPresetKind
  values: OffenseStatValue | DefenseStatValue
  /** System presets — tier chip color */
  systemTier?: StatTierTokenSet | null
}

export type StoredUserStatPresets = {
  offense: Record<string, StatPreset[]>
  defense: Record<string, StatPreset[]>
}

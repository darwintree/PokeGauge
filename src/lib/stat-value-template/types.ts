import type { StatTierTokenSet } from "@/lib/stat-tier-colors"

export type TemplateKind = "system" | "user" | "temporary"

export type OffenseTemplateValues = {
  kind: "offense"
  stat: number
}

export type DefenseTemplateValues = {
  kind: "defense"
  hp: number
  def: number
}

export type StatValueTemplate = {
  id: string
  kind: TemplateKind
  values: OffenseTemplateValues | DefenseTemplateValues
  /** System templates — tier chip color */
  systemTier?: StatTierTokenSet | null
}

export type StoredUserTemplates = {
  offense: Record<string, StatValueTemplate[]>
  defense: Record<string, StatValueTemplate[]>
}

export type CatalogOption = {
  id: string
  label: string
  summary: string
}

export type MatchupIdentity = {
  attackerLabel: string
  defenderLabel: string
  attackerSpecies: string
  defenderSpecies: string
}

export type MatchupCatalog = {
  matchup: MatchupIdentity
  moves: CatalogOption[]
  attackerStats: CatalogOption[]
  attackerItems: CatalogOption[]
  defenderBulks: CatalogOption[]
  defaultMoveIds: string[]
  defaultAttackerStatIds: string[]
  defaultAttackerItemIds: string[]
  defaultDefenderIds: string[]
}

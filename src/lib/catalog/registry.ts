import { buildCoreCatalogOptions, buildTypeBoostCatalogOptions } from "@/lib/held-item"
import { localeMessages, type SupportedLocale } from "@/lib/i18n"
import {
  getResource,
  listChampionsMoveUsageRecords,
  listResources,
  type BattlePokemonId,
  type LocalizedMoveResource,
  type LocalizedPokemonResource,
  type UpstreamResourceId,
} from "@/lib/resources"
import {
  DEFENSE_PRESET_LABELS,
  OFFENSE_PRESET_LABELS,
  type DefensePresetId,
  type OffensePresetId,
} from "./preset-labels"
import type {
  CatalogMoveOption,
  MatchupCatalog,
  MoveCategory,
  SpeciesOption,
} from "./types"

type FixedPowerMoveResource = LocalizedMoveResource & {
  category: MoveCategory
  power: number
}

const DEFAULT_MOVE_CATEGORY_BY_ATTACKER: Partial<Record<BattlePokemonId, MoveCategory>> = {
  445: "physical",
  591: "special",
  727: "physical",
  812: "physical",
  987: "special",
  10021: "physical",
}

const DEFAULT_MATCHUP = {
  attackerId: 445,
  defenderId: 727,
} as const

function statLabels(category: MoveCategory, locale: SupportedLocale) {
  const messages = localeMessages[locale]
  return category === "physical"
    ? {
        offenseStatLabel: messages["stat.attack"],
        defenseStatLabel: messages["stat.defense"],
      }
    : {
        offenseStatLabel: messages["stat.specialAttack"],
        defenseStatLabel: messages["stat.specialDefense"],
      }
}

function buildAttackerStats(category: MoveCategory) {
  const stat = category === "physical" ? "物攻" : "特攻"
  const entries: Array<{ id: OffensePresetId; summary: string }> = [
    { id: "neutral-zero", summary: `无修正 · 0 ${stat}` },
    { id: "neutral-max", summary: `无修正 · 252 ${stat}` },
    {
      id: "extreme",
      summary: category === "physical" ? "固执 · 252 物攻" : "内敛 · 252 特攻",
    },
  ]

  return entries.map(({ id, summary }) => ({
    id,
    label: OFFENSE_PRESET_LABELS[id],
    summary,
  }))
}

function buildDefenderBulks(category: MoveCategory) {
  const stat = category === "physical" ? "物防" : "特防"
  const entries: Array<{ id: DefensePresetId; summary: string }> = [
    { id: "min-bulk", summary: `无修正 · 0 HP / 0 ${stat}` },
    { id: "hp-32", summary: `无修正 · 252 HP / 0 ${stat}` },
    {
      id: "standard-bulk",
      summary:
        category === "physical" ? "慎重 · 252 HP / 252 物防" : "慎重 · 252 HP / 252 特防",
    },
  ]

  return entries.map(({ id, summary }) => ({
    id,
    label: DEFENSE_PRESET_LABELS[id],
    summary,
  }))
}

function buildAttackerItems(category: MoveCategory) {
  return [...buildCoreCatalogOptions(category), ...buildTypeBoostCatalogOptions()]
}

function localizedSpeciesOption(resource: LocalizedPokemonResource): SpeciesOption {
  return {
    id: resource.battlePokemonId,
    label: resource.name,
    species: resource.calcSpeciesName,
    types: resource.types,
  }
}

export async function listAttackers(locale: SupportedLocale): Promise<SpeciesOption[]> {
  const pokemon = await listResources("pokemon", locale)
  return pokemon.map(localizedSpeciesOption).sort((a, b) => a.label.localeCompare(b.label))
}

export async function listDefenders(locale: SupportedLocale): Promise<SpeciesOption[]> {
  const pokemon = await listResources("pokemon", locale)
  return pokemon.map(localizedSpeciesOption).sort((a, b) => a.label.localeCompare(b.label))
}

export function getDefaultMatchupIds() {
  return { ...DEFAULT_MATCHUP }
}

export function getDefaultMoveCategory(attackerId: BattlePokemonId): MoveCategory {
  return DEFAULT_MOVE_CATEGORY_BY_ATTACKER[attackerId] ?? "physical"
}

function isFixedPowerMoveResource(
  moveResource: LocalizedMoveResource,
  category: MoveCategory,
): moveResource is FixedPowerMoveResource {
  return moveResource.category === category && moveResource.power !== null && moveResource.power > 0
}

function fixedPowerMoveOption(moveResource: FixedPowerMoveResource): CatalogMoveOption {
  return {
    id: moveResource.id,
    label: moveResource.name,
    summary: [moveResource.power, moveResource.accuracy ?? "-"].join(" / "),
    moveName: moveResource.calcMoveName,
    type: moveResource.type,
    category: moveResource.category,
    power: moveResource.power,
    accuracy: moveResource.accuracy,
  }
}

function compareMoveSearchOrder(a: CatalogMoveOption, b: CatalogMoveOption): number {
  const byPower = b.power - a.power
  if (byPower !== 0) return byPower
  const byAccuracy = (b.accuracy ?? Number.POSITIVE_INFINITY) - (a.accuracy ?? Number.POSITIVE_INFINITY)
  if (byAccuracy !== 0) return byAccuracy
  const byMoveName = a.moveName.localeCompare(b.moveName)
  if (byMoveName !== 0) return byMoveName
  return a.id - b.id
}

function resolveDefaultMoveIds(
  attackerId: BattlePokemonId,
  activeMoveCategory: MoveCategory,
  moves: CatalogMoveOption[],
): UpstreamResourceId[] {
  const moveById = new Map(moves.map((move) => [move.id, move]))
  const selected = listChampionsMoveUsageRecords(attackerId, "Doubles")
    .toSorted((a, b) => {
      const byRank = a.rank - b.rank
      if (byRank !== 0) return byRank
      const byUsage = (b.percentage ?? Number.NEGATIVE_INFINITY) - (a.percentage ?? Number.NEGATIVE_INFINITY)
      if (byUsage !== 0) return byUsage
      const byMoveName = a.championsMoveName.localeCompare(b.championsMoveName)
      if (byMoveName !== 0) return byMoveName
      return a.moveId - b.moveId
    })
    .filter((record) => moveById.get(record.moveId)?.category === activeMoveCategory)
    .map((record) => record.moveId)

  const fallback = moves
    .map((move) => move.id)
    .filter((moveId) => !selected.includes(moveId))

  return [...selected, ...fallback].slice(0, 6)
}

export async function getCatalog(
  attackerId: BattlePokemonId,
  defenderId: BattlePokemonId,
  locale: SupportedLocale,
  moveCategory?: MoveCategory,
): Promise<MatchupCatalog> {
  const activeMoveCategory = moveCategory ?? getDefaultMoveCategory(attackerId)
  const [attackerResource, defenderResource] = await Promise.all([
    getResource("pokemon", attackerId, locale),
    getResource("pokemon", defenderId, locale),
  ])

  const moveResources = await listResources("move", locale)
  const moves = moveResources
    .filter((moveResource) => isFixedPowerMoveResource(moveResource, activeMoveCategory))
    .map(fixedPowerMoveOption)
    .sort(compareMoveSearchOrder)

  const labels = statLabels(activeMoveCategory, locale)
  const defaultMoveIds = resolveDefaultMoveIds(attackerId, activeMoveCategory, moves)

  return {
    matchup: {
      attackerId,
      defenderId,
      attackerLabel: attackerResource.name,
      defenderLabel: defenderResource.name,
      attackerSpecies: attackerResource.calcSpeciesName,
      defenderSpecies: defenderResource.calcSpeciesName,
    },
    attackerTypes: attackerResource.types,
    moveCategory: activeMoveCategory,
    ...labels,
    moves,
    attackerStats: buildAttackerStats(activeMoveCategory),
    attackerItems: buildAttackerItems(activeMoveCategory),
    defenderBulks: buildDefenderBulks(activeMoveCategory),
    /** Default selected set — Move pick only; remaining fixed-power moves addable via search. */
    defaultMoveIds,
    defaultAttackerStatIds: ["neutral-max", "extreme"],
    defaultAttackerItemIds: ["none"],
    defaultDefenderIds: ["hp-32"],
  }
}

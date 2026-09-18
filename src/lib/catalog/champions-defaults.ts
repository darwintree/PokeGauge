import {
  listChampionsAbilityUsageRecords,
  listChampionsMoveUsageRecords,
  listChampionsNatureUsageRecords,
  listChampionsPokemonUsageIds,
} from "@/lib/champions"
import type {
  CatalogAbilityOption,
  CatalogMoveOption,
  MatchupCatalog,
  MoveCategory,
  BattlePokemonOption,
} from "./types"
import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"
import { NO_ABILITY_ID } from "@/lib/ability"
import {
  compareMoveUsageRecords, recommendMoves, recommendAbilities,
  recommendOffensePreset, recommendMoveCategory,
} from "@/lib/scenario/selection/recommendations"
import type { OffensePresetId } from "./preset-labels"

/**
 * Usage caches store ranked battle ids from the source. Mega identities are
 * dex-only, so attach them after the matching species whenever that species
 * (or one of its Megas) appears in the ranking.
 */
export function orderPokemonOptionsByUsageIds(
  options: BattlePokemonOption[],
  usageIds: readonly number[],
): BattlePokemonOption[] {
  if (usageIds.length === 0) return options

  const byId = new Map(options.map((option) => [option.id, option]))
  const megasBySpecies = new Map<UpstreamResourceId, BattlePokemonOption[]>()
  for (const option of options) {
    if (!option.isMega) continue
    const megas = megasBySpecies.get(option.speciesId)
    if (megas) megas.push(option)
    else megasBySpecies.set(option.speciesId, [option])
  }

  const ranked: BattlePokemonOption[] = []
  const seen = new Set<number>()
  const push = (option: BattlePokemonOption) => {
    if (seen.has(option.id)) return
    seen.add(option.id)
    ranked.push(option)
  }
  for (const id of usageIds) {
    const option = byId.get(id)
    if (!option) continue
    push(option)
    for (const mega of megasBySpecies.get(option.speciesId) ?? []) push(mega)
  }
  for (const option of options) {
    if (!seen.has(option.id)) ranked.push(option)
  }
  return ranked
}

export async function rankPokemonOptionsByChampionsUsage(
  options: BattlePokemonOption[],
): Promise<BattlePokemonOption[]> {
  return orderPokemonOptionsByUsageIds(options, await listChampionsPokemonUsageIds())
}

export async function rankMoveOptionsByChampionsUsage(
  attackerId: BattlePokemonId,
  options: CatalogMoveOption[],
): Promise<CatalogMoveOption[]> {
  const records = await listChampionsMoveUsageRecords(attackerId)
  if (records.length === 0) return options

  const byId = new Map(options.map((option) => [option.id, option]))
  const ranked: CatalogMoveOption[] = []
  const rankedIds = new Set<number>()
  for (const record of records.toSorted(compareMoveUsageRecords)) {
    const option = byId.get(record.moveId)
    if (!option || rankedIds.has(option.id)) continue
    rankedIds.add(option.id)
    ranked.push(option)
  }
  return [...ranked, ...options.filter((option) => !rankedIds.has(option.id))]
}

export async function resolveDefaultMovePick(
  attackerId: BattlePokemonId,
  activeMoveCategory: MoveCategory,
  moves: CatalogMoveOption[],
  defenderTypes: MatchupCatalog["defenderTypes"],
): Promise<
  Pick<
    MatchupCatalog,
    "moves" | "defaultMovePoolIds" | "defaultMoveIds" | "defaultMovePickStatus"
  >
> {
  try {
    const records = await listChampionsMoveUsageRecords(attackerId)
    const recommendation = recommendMoves(records, activeMoveCategory, moves, defenderTypes)
    const usageMoveIds = recommendation.poolIds
    const moveById = new Map(moves.map((move) => [move.id, move]))
    const usageMoveIdSet = new Set(usageMoveIds)

    return {
      moves: [
        ...usageMoveIds.map((moveId) => moveById.get(moveId)!),
        ...moves.filter((move) => !usageMoveIdSet.has(move.id)),
      ],
      defaultMovePoolIds: usageMoveIds,
      defaultMoveIds: recommendation.selectedIds,
      defaultMovePickStatus: "ready",
    }
  } catch {
    return {
      moves,
      defaultMovePoolIds: [],
      defaultMoveIds: [],
      defaultMovePickStatus: "unavailable",
    }
  }
}

export async function resolveDefaultAbilityPick(
  battlePokemonId: BattlePokemonId,
  abilities: CatalogAbilityOption[],
): Promise<{ ids: UpstreamResourceId[]; status: "ready" | "unavailable" }> {
  const fallback = recommendAbilities(abilities)
  if (fallback[0] === NO_ABILITY_ID) return { ids: fallback, status: "ready" }
  try {
    const records = await listChampionsAbilityUsageRecords(battlePokemonId)
    return { ids: recommendAbilities(abilities, records), status: "ready" }
  } catch {
    return { ids: fallback, status: "unavailable" }
  }
}

export async function resolveDefaultOffensePreset(
  battlePokemonId: BattlePokemonId,
  category: MoveCategory,
): Promise<{ presetId: OffensePresetId; status: "ready" | "unavailable" }> {
  try {
    const records = await listChampionsNatureUsageRecords(battlePokemonId)
    return { presetId: recommendOffensePreset(records, category), status: "ready" }
  } catch {
    return { presetId: recommendOffensePreset([], category), status: "unavailable" }
  }
}

export async function resolveCatalogDefaultMoveCategory(
  battlePokemonId: BattlePokemonId,
): Promise<MoveCategory> {
  try {
    const records = await listChampionsNatureUsageRecords(battlePokemonId)
    return recommendMoveCategory(records)
  } catch {
    return recommendMoveCategory([])
  }
}

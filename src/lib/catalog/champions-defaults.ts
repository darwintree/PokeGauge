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

export const DEFAULT_USAGE_TIMEOUT_MS = 5_000

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label = "Default pick",
): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timeout = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs)
    }),
  ]).finally(() => {
    if (timeout) clearTimeout(timeout)
  })
}

export async function rankPokemonOptionsByChampionsUsage(
  options: BattlePokemonOption[],
): Promise<BattlePokemonOption[]> {
  // ponytail: picker ranking has an explicit skip; do not share default-pick's 5s timeout
  const usageIds = await listChampionsPokemonUsageIds()
  if (usageIds.length === 0) return options

  const byId = new Map(options.map((option) => [option.id, option]))
  const megasBySpecies = new Map<UpstreamResourceId, BattlePokemonOption[]>()
  for (const option of options) {
    if (!option.isMega) continue
    const megas = megasBySpecies.get(option.speciesId)
    if (megas) megas.push(option)
    else megasBySpecies.set(option.speciesId, [option])
  }
  const ranked = usageIds.flatMap((id) => {
    const base = byId.get(id)
    return base ? [base, ...(megasBySpecies.get(base.speciesId) ?? [])] : []
  })
  const rankedIds = new Set(ranked.map((option) => option.id))
  return [
    ...ranked,
    ...options.filter((option) => !rankedIds.has(option.id)),
  ]
}

export async function rankMoveOptionsByChampionsUsage(
  attackerId: BattlePokemonId,
  options: CatalogMoveOption[],
): Promise<CatalogMoveOption[]> {
  // ponytail: picker ranking has an explicit skip; do not share default-pick's 5s timeout
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
    const records = await withTimeout(
      listChampionsMoveUsageRecords(attackerId),
      DEFAULT_USAGE_TIMEOUT_MS,
    )
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

export async function resolveDefaultAbilityIds(
  battlePokemonId: BattlePokemonId,
  abilities: CatalogAbilityOption[],
): Promise<UpstreamResourceId[]> {
  const fallback = recommendAbilities(abilities)
  if (fallback[0] === NO_ABILITY_ID) return fallback
  try {
    const records = await withTimeout(listChampionsAbilityUsageRecords(battlePokemonId), DEFAULT_USAGE_TIMEOUT_MS)
    return recommendAbilities(abilities, records)
  } catch {
    return fallback
  }
}

export async function resolveDefaultOffensePresetId(
  battlePokemonId: BattlePokemonId,
  category: MoveCategory,
): Promise<OffensePresetId> {
  try {
    const records = await withTimeout(listChampionsNatureUsageRecords(battlePokemonId), DEFAULT_USAGE_TIMEOUT_MS)
    return recommendOffensePreset(records, category)
  } catch {
    return recommendOffensePreset([], category)
  }
}

export async function resolveCatalogDefaultMoveCategory(
  battlePokemonId: BattlePokemonId,
): Promise<MoveCategory> {
  try {
    const records = await withTimeout(listChampionsNatureUsageRecords(battlePokemonId), DEFAULT_USAGE_TIMEOUT_MS)
    return recommendMoveCategory(records)
  } catch {
    return recommendMoveCategory([])
  }
}

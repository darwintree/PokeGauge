import { typeEffectiveness } from "@/lib/pokemon"
import {
  listChampionsAbilityUsageRecords,
  listChampionsMoveUsageRecords,
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

const DEFAULT_USAGE_TIMEOUT_MS = 5_000

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timeout = setTimeout(() => reject(new Error("Default Move pick timed out")), timeoutMs)
    }),
  ]).finally(() => {
    if (timeout) clearTimeout(timeout)
  })
}

export async function rankPokemonOptionsByChampionsUsage(
  options: BattlePokemonOption[],
): Promise<BattlePokemonOption[]> {
  const usageIds = await withTimeout(
    listChampionsPokemonUsageIds(),
    DEFAULT_USAGE_TIMEOUT_MS,
  ).catch(() => [])
  if (usageIds.length === 0) return options

  const byId = new Map(options.map((option) => [option.id, option]))
  const usageIdSet = new Set(usageIds)
  return [
    ...usageIds.flatMap((id) => byId.get(id) ?? []),
    ...options.filter((option) => !usageIdSet.has(option.id)),
  ]
}

async function resolveUsageMoves(
  attackerId: BattlePokemonId,
  activeMoveCategory: MoveCategory,
  moves: CatalogMoveOption[],
): Promise<Array<{ moveId: UpstreamResourceId; percentage: number | null }>> {
  const moveById = new Map(moves.map((move) => [move.id, move]))
  const ranked = (await listChampionsMoveUsageRecords(attackerId))
    .toSorted((a, b) => {
      const byRank = a.rank - b.rank
      if (byRank !== 0) return byRank
      const byUsage = (b.percentage ?? Number.NEGATIVE_INFINITY) - (a.percentage ?? Number.NEGATIVE_INFINITY)
      if (byUsage !== 0) return byUsage
      const byMoveName = a.championsMoveName.localeCompare(b.championsMoveName)
      if (byMoveName !== 0) return byMoveName
      return a.moveId - b.moveId
    })
    .slice(0, 10)
    .filter((record) => moveById.get(record.moveId)?.category === activeMoveCategory)

  return [
    ...new Map(
      ranked.map(({ moveId, percentage }) => [moveId, { moveId, percentage }]),
    ).values(),
  ]
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
    const usageMoves = await withTimeout(
      resolveUsageMoves(attackerId, activeMoveCategory, moves),
      DEFAULT_USAGE_TIMEOUT_MS,
    )
    const usageMoveIds = usageMoves.map(({ moveId }) => moveId)
    const moveById = new Map(moves.map((move) => [move.id, move]))
    const usageMoveIdSet = new Set(usageMoveIds)

    return {
      moves: [
        ...usageMoveIds.map((moveId) => moveById.get(moveId)!),
        ...moves.filter((move) => !usageMoveIdSet.has(move.id)),
      ],
      defaultMovePoolIds: usageMoveIds,
      defaultMoveIds: usageMoves
        .filter(({ moveId, percentage }) =>
          (percentage ?? Number.NEGATIVE_INFINITY) > 50 ||
          typeEffectiveness(moveById.get(moveId)!.type, defenderTypes) > 1,
        )
        .map(({ moveId }) => moveId),
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
  try {
    const legalIds = new Set(abilities.map((ability) => ability.id))
    const defaultId = (await withTimeout(
      listChampionsAbilityUsageRecords(battlePokemonId),
      DEFAULT_USAGE_TIMEOUT_MS,
    ))
      .toSorted((a, b) =>
        a.rank - b.rank ||
        (b.percentage ?? Number.NEGATIVE_INFINITY) -
          (a.percentage ?? Number.NEGATIVE_INFINITY) ||
        a.championsAbilityName.localeCompare(b.championsAbilityName) ||
        a.abilityId - b.abilityId,
      )
      .find((record) => legalIds.has(record.abilityId))?.abilityId
    return defaultId === undefined ? [...legalIds] : [defaultId]
  } catch {
    return abilities.map((ability) => ability.id)
  }
}

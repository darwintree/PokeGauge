import { typeEffectiveness } from "@/lib/pokemon"
import {
  listChampionsAbilityUsageRecords,
  listChampionsMoveUsageRecords,
  listChampionsNatureUsageRecords,
  listChampionsPokemonUsageIds,
  type ChampionsNatureUsageRecord,
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
import { offenseStatMod } from "@/lib/stat-preset"
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

function compareMoveUsageRecords(
  a: { rank: number; percentage: number | null; championsMoveName: string; moveId: number },
  b: { rank: number; percentage: number | null; championsMoveName: string; moveId: number },
) {
  const byRank = a.rank - b.rank
  if (byRank !== 0) return byRank
  const byUsage = (b.percentage ?? Number.NEGATIVE_INFINITY) - (a.percentage ?? Number.NEGATIVE_INFINITY)
  if (byUsage !== 0) return byUsage
  const byMoveName = a.championsMoveName.localeCompare(b.championsMoveName)
  if (byMoveName !== 0) return byMoveName
  return a.moveId - b.moveId
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

async function resolveUsageMoves(
  attackerId: BattlePokemonId,
  activeMoveCategory: MoveCategory,
  moves: CatalogMoveOption[],
): Promise<Array<{ moveId: UpstreamResourceId; percentage: number | null }>> {
  const moveById = new Map(moves.map((move) => [move.id, move]))
  const ranked = (await listChampionsMoveUsageRecords(attackerId))
    .toSorted(compareMoveUsageRecords)
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
  const legalAbilities = abilities.filter((ability) => ability.id !== NO_ABILITY_ID)
  if (legalAbilities.length === 0) return [NO_ABILITY_ID]
  try {
    const legalIds = new Set(legalAbilities.map((ability) => ability.id))
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
    return legalAbilities.map((ability) => ability.id)
  }
}

export async function resolveDefaultOffensePresetId(
  battlePokemonId: BattlePokemonId,
  category: MoveCategory,
): Promise<OffensePresetId> {
  try {
    const topNature = (await rankedNatureUsage(battlePokemonId))[0]?.nature
    return topNature && offenseStatMod(topNature, category) === "+"
      ? "extreme"
      : "neutral-max"
  } catch {
    return "neutral-max"
  }
}

async function rankedNatureUsage(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsNatureUsageRecord[]> {
  const records = await withTimeout(
    listChampionsNatureUsageRecords(battlePokemonId),
    DEFAULT_USAGE_TIMEOUT_MS,
  )
  return records.toSorted((a, b) =>
    (b.percentage ?? Number.NEGATIVE_INFINITY) -
      (a.percentage ?? Number.NEGATIVE_INFINITY) ||
    a.rank - b.rank ||
    a.nature.localeCompare(b.nature),
  )
}

export async function resolveCatalogDefaultMoveCategory(
  battlePokemonId: BattlePokemonId,
): Promise<MoveCategory> {
  try {
    for (const { nature } of await rankedNatureUsage(battlePokemonId)) {
      const physical = offenseStatMod(nature, "physical")
      const special = offenseStatMod(nature, "special")
      if (physical === "-") return "special"
      if (special === "-") return "physical"
      if (physical === "+") return "physical"
      if (special === "+") return "special"
    }
  } catch {
    // Fall through to the product default.
  }
  return "physical"
}

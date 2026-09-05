import { NO_ABILITY_ID, abilityIsSelectable } from "@/lib/ability"
import type { CatalogAbilityOption, CatalogMoveOption, MoveCategory } from "@/lib/catalog/types"
import type { OffensePresetId } from "@/lib/catalog/preset-labels"
import type {
  ChampionsAbilityUsageRecord, ChampionsItemUsageRecord,
  ChampionsMoveUsageRecord, ChampionsNatureUsageRecord,
} from "@/lib/champions"
import { EXPLICIT_NO_ITEM_ID, isFormTriggerItem, isLegalFormTriggerTransition, type HeldItemId } from "@/lib/held-item"
import { typeEffectiveness, type PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId } from "@/lib/resources"
import { offenseStatMod } from "@/lib/stat-preset"

export function compareMoveUsageRecords(
  a: ChampionsMoveUsageRecord,
  b: ChampionsMoveUsageRecord,
): number {
  const byRank = a.rank - b.rank
  if (byRank !== 0) return byRank
  const byUsage = (b.percentage ?? Number.NEGATIVE_INFINITY) - (a.percentage ?? Number.NEGATIVE_INFINITY)
  if (byUsage !== 0) return byUsage
  const byMoveName = a.championsMoveName.localeCompare(b.championsMoveName)
  if (byMoveName !== 0) return byMoveName
  return a.moveId - b.moveId
}

export function recommendMoves(
  records: ChampionsMoveUsageRecord[],
  category: MoveCategory,
  moves: CatalogMoveOption[],
  defenderTypes: PokemonType[],
): { poolIds: number[]; selectedIds: number[] } {
  const byId = new Map(moves.map((move) => [move.id, move]))
  const ranked = records.toSorted(compareMoveUsageRecords).slice(0, 10)
    .filter((record) => byId.get(record.moveId)?.category === category)
  const unique = [...new Map(ranked.map((record) => [record.moveId, record])).values()]
  return {
    poolIds: unique.map((record) => record.moveId),
    selectedIds: unique.filter((record) =>
      (record.percentage ?? Number.NEGATIVE_INFINITY) > 50 ||
      typeEffectiveness(byId.get(record.moveId)!.type, defenderTypes) > 1,
    ).map((record) => record.moveId),
  }
}

export function recommendAbilities(
  abilities: CatalogAbilityOption[],
  records: ChampionsAbilityUsageRecord[] = [],
): number[] {
  const identityAbilities = abilities.filter((ability) => ability.id !== NO_ABILITY_ID)
  const fallback = identityAbilities.find((ability) => abilityIsSelectable(ability.id))?.id ?? NO_ABILITY_ID
  if (fallback === NO_ABILITY_ID) return [NO_ABILITY_ID]
  const identityIds = new Set(identityAbilities.map((ability) => ability.id))
  const top = records.toSorted((a, b) =>
    a.rank - b.rank ||
    (b.percentage ?? Number.NEGATIVE_INFINITY) - (a.percentage ?? Number.NEGATIVE_INFINITY) ||
    a.championsAbilityName.localeCompare(b.championsAbilityName) || a.abilityId - b.abilityId,
  ).find((record) => identityIds.has(record.abilityId))?.abilityId
  if (top === undefined) return [fallback]
  return [abilityIsSelectable(top) ? top : NO_ABILITY_ID]
}

function rankNatures(records: ChampionsNatureUsageRecord[]): ChampionsNatureUsageRecord[] {
  return records.toSorted((a, b) =>
    (b.percentage ?? Number.NEGATIVE_INFINITY) - (a.percentage ?? Number.NEGATIVE_INFINITY) ||
    a.rank - b.rank || a.nature.localeCompare(b.nature),
  )
}

export function recommendOffensePreset(
  records: ChampionsNatureUsageRecord[], category: MoveCategory,
): OffensePresetId {
  const nature = rankNatures(records)[0]?.nature
  return nature && offenseStatMod(nature, category) === "+" ? "extreme" : "neutral-max"
}

export function recommendMoveCategory(records: ChampionsNatureUsageRecord[]): MoveCategory {
  for (const { nature } of rankNatures(records)) {
    const physical = offenseStatMod(nature, "physical")
    const special = offenseStatMod(nature, "special")
    if (physical === "-") return "special"
    if (special === "-") return "physical"
    if (physical === "+") return "physical"
    if (special === "+") return "special"
  }
  return "physical"
}

export type HeldItemRecommendationInput = {
  battlePokemonId: BattlePokemonId
  lockedItemId: HeldItemId | null
  sideEligibleIds: ReadonlySet<number>
  selectableIds: ReadonlySet<BattlePokemonId>
}

export function recommendHeldItems(
  input: HeldItemRecommendationInput,
  records: ChampionsItemUsageRecord[],
): { poolIds: HeldItemId[]; selectedIds: HeldItemId[] } {
  if (input.lockedItemId !== null) {
    return { poolIds: [input.lockedItemId], selectedIds: [input.lockedItemId] }
  }
  const boundary = orderItemUsageRecords(records).slice(0, 10)
  const poolIds: HeldItemId[] = [EXPLICIT_NO_ITEM_ID]
  for (const { itemId } of boundary) {
    if (itemId == null) continue
    if (isFormTriggerItem(itemId)) {
      if (isLegalFormTriggerTransition(input.battlePokemonId, itemId, input.selectableIds)) poolIds.push(itemId)
    } else if (input.sideEligibleIds.has(itemId)) {
      poolIds.push(itemId)
    }
  }
  const top = boundary[0]?.itemId
  const selected = top != null && input.sideEligibleIds.has(top) && !isFormTriggerItem(top)
    ? top : EXPLICIT_NO_ITEM_ID
  return { poolIds, selectedIds: [selected] }
}

function orderItemUsageRecords(
  records: ChampionsItemUsageRecord[],
): ChampionsItemUsageRecord[] {
  const sorted = records.toSorted(
    (a, b) =>
      a.rank - b.rank ||
      (b.percentage ?? Number.NEGATIVE_INFINITY) -
        (a.percentage ?? Number.NEGATIVE_INFINITY) ||
      a.championsItemName.localeCompare(b.championsItemName) ||
      (a.itemId ?? Number.POSITIVE_INFINITY) - (b.itemId ?? Number.POSITIVE_INFINITY),
  )

  // Keep null itemId rows (nothing / unmapped) in the top-10 window; dedupe mapped ids only.
  const seen = new Set<number>()
  const ordered: ChampionsItemUsageRecord[] = []
  for (const record of sorted) {
    if (record.itemId != null) {
      if (seen.has(record.itemId)) continue
      seen.add(record.itemId)
    }
    ordered.push(record)
  }
  return ordered
}

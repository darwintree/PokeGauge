import {
  ATTACKER_HELD_ITEM_IDS,
  DEFENDER_HELD_ITEM_IDS,
  buildHeldItemCatalogOptions,
  heldItemCatalogOption,
  lockedHeldItemFor,
  megaStoneFor,
} from "@/lib/held-item"
import { UNKNOWN_ABILITY_ID } from "@/lib/ability"
import type { SupportedLocale } from "@/lib/i18n"
import { resolveReviewedMoveType } from "@/lib/move"
import { getResource, type BattlePokemonId } from "@/lib/resources"
import type {
  MatchupCatalog,
  MoveCategory,
} from "./types"
import {
  abilityOptions,
  listAttackers,
  listDefenders,
  noAbilityOption,
  snapshotCapableMoveOptions,
  statLabels,
} from "./resource-options"
import {
  resolveDefaultAbilityIds,
  resolveDefaultMovePick,
} from "./champions-defaults"
import { resolveDefaultHeldItemPick } from "./held-item-defaults"

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

export { listAttackers, listDefenders } from "./resource-options"
export { rankPokemonOptionsByChampionsUsage } from "./champions-defaults"

export function getDefaultMatchupIds() {
  return { ...DEFAULT_MATCHUP }
}

export function getDefaultMoveCategory(attackerId: BattlePokemonId): MoveCategory {
  return DEFAULT_MOVE_CATEGORY_BY_ATTACKER[attackerId] ?? "physical"
}

export async function getCatalogShell(
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
  const [allAttackerAbilities, allDefenderAbilities] = await Promise.all([
    abilityOptions(attackerResource.abilityIds, locale),
    abilityOptions(defenderResource.abilityIds, locale),
  ])
  const attackerIdentityAbilities = attackerResource.isMega
    ? allAttackerAbilities.slice(0, 1)
    : allAttackerAbilities
  const defenderIdentityAbilities = defenderResource.isMega
    ? allDefenderAbilities.slice(0, 1)
    : allDefenderAbilities
  const attackerAbilities = [noAbilityOption(locale), ...attackerIdentityAbilities]
  const defenderAbilities = [noAbilityOption(locale), ...defenderIdentityAbilities]

  const moves = (await snapshotCapableMoveOptions(locale, activeMoveCategory)).map(
    (move) => ({
      ...move,
      type: resolveReviewedMoveType(
        move.id,
        attackerId,
        move.type,
        attackerResource.types,
      ),
    }),
  )

  const labels = statLabels(activeMoveCategory, locale)
  const attackerLockedItemId = lockedHeldItemFor(attackerResource.battlePokemonId) ??
    (attackerResource.isMega ? megaStoneFor(attackerResource.battlePokemonId) : null)
  const defenderLockedItemId = lockedHeldItemFor(defenderResource.battlePokemonId) ??
    (defenderResource.isMega ? megaStoneFor(defenderResource.battlePokemonId) : null)
  const attackerItems = attackerLockedItemId === null
    ? buildHeldItemCatalogOptions("attacker", locale)
    : [heldItemCatalogOption(attackerLockedItemId, locale)]
  const defenderItems = defenderLockedItemId === null
    ? buildHeldItemCatalogOptions("defender", locale)
    : [heldItemCatalogOption(defenderLockedItemId, locale)]

  return {
    matchup: {
      attackerId,
      defenderId,
      attackerLabel: attackerResource.name,
      defenderLabel: defenderResource.name,
      attackerCalcName: attackerResource.calcSpeciesName,
      defenderCalcName: defenderResource.calcSpeciesName,
    },
    attackerTypes: attackerResource.types,
    defenderTypes: defenderResource.types,
    moveCategory: activeMoveCategory,
    ...labels,
    moves,
    attackerItems,
    defenderItems,
    attackerAbilities,
    defenderAbilities,
    /** Champions defaults load asynchronously; global snapshot-capable moves remain searchable. */
    defaultMovePickStatus: "loading",
    defaultAbilityPickStatus: "loading",
    defaultItemPickStatus:
      attackerLockedItemId === null || defenderLockedItemId === null
        ? "loading"
        : "ready",
    defaultMovePoolIds: [],
    defaultMoveIds: [],
    defaultAttackerItemPoolIds:
      attackerLockedItemId === null ? ["none"] : [attackerLockedItemId],
    defaultDefenderItemPoolIds:
      defenderLockedItemId === null ? ["none"] : [defenderLockedItemId],
    defaultAttackerItemIds: [attackerLockedItemId ?? "none"],
    defaultDefenderItemIds: [defenderLockedItemId ?? "none"],
    defaultAttackerAbilityIds: attackerIdentityAbilities.map((ability) => ability.id),
    defaultDefenderAbilityIds: defenderIdentityAbilities.map((ability) => ability.id),
    attackerLockedItemId,
    defenderLockedItemId,
    attackerLockedAbilityId: attackerResource.isMega ? attackerIdentityAbilities[0]?.id ?? UNKNOWN_ABILITY_ID : null,
    defenderLockedAbilityId: defenderResource.isMega ? defenderIdentityAbilities[0]?.id ?? UNKNOWN_ABILITY_ID : null,
    attackerPreservesItem: attackerResource.battlePokemonId === 10079,
    defenderPreservesItem: defenderResource.battlePokemonId === 10079,
  }
}

export async function resolveCatalogDefaultMovePick(
  catalog: MatchupCatalog,
): Promise<MatchupCatalog> {
  // Selectable identity sets are locale-invariant; en is enough for id membership.
  const [attackerOptions, defenderOptions] = await Promise.all([
    listAttackers("en"),
    listDefenders("en"),
  ])
  const selectableAttackerIds = new Set(attackerOptions.map((option) => option.id))
  const selectableDefenderIds = new Set(defenderOptions.map((option) => option.id))

  const [
    defaultMovePick,
    defaultAttackerAbilityIds,
    defaultDefenderAbilityIds,
    attackerItemPick,
    defenderItemPick,
  ] = await Promise.all([
    resolveDefaultMovePick(
      catalog.matchup.attackerId,
      catalog.moveCategory,
      catalog.moves,
      catalog.defenderTypes,
    ),
    resolveDefaultAbilityIds(catalog.matchup.attackerId, catalog.attackerAbilities),
    resolveDefaultAbilityIds(catalog.matchup.defenderId, catalog.defenderAbilities),
    resolveDefaultHeldItemPick({
      battlePokemonId: catalog.matchup.attackerId,
      lockedItemId: catalog.attackerLockedItemId,
      sideEligibleIds: new Set(ATTACKER_HELD_ITEM_IDS),
      selectableIds: selectableAttackerIds,
    }),
    resolveDefaultHeldItemPick({
      battlePokemonId: catalog.matchup.defenderId,
      lockedItemId: catalog.defenderLockedItemId,
      sideEligibleIds: new Set(DEFENDER_HELD_ITEM_IDS),
      selectableIds: selectableDefenderIds,
    }),
  ])

  // Each side already embeds none-fallback on failure; gate sync on non-loading only.
  const itemStatus =
    attackerItemPick.status === "unavailable" && defenderItemPick.status === "unavailable"
      ? "unavailable"
      : "ready"

  return {
    ...catalog,
    ...defaultMovePick,
    defaultAbilityPickStatus: "ready",
    defaultItemPickStatus: itemStatus,
    defaultAttackerAbilityIds,
    defaultDefenderAbilityIds,
    defaultAttackerItemPoolIds: attackerItemPick.poolIds,
    defaultDefenderItemPoolIds: defenderItemPick.poolIds,
    defaultAttackerItemIds: attackerItemPick.selectedIds,
    defaultDefenderItemIds: defenderItemPick.selectedIds,
  }
}

export async function getCatalog(
  attackerId: BattlePokemonId,
  defenderId: BattlePokemonId,
  locale: SupportedLocale,
  moveCategory?: MoveCategory,
): Promise<MatchupCatalog> {
  return resolveCatalogDefaultMovePick(
    await getCatalogShell(attackerId, defenderId, locale, moveCategory),
  )
}

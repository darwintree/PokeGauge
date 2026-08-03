import {
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
  snapshotCapableMoveOptions,
  statLabels,
} from "./resource-options"
import {
  resolveDefaultAbilityIds,
  resolveDefaultMovePick,
} from "./champions-defaults"

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
  const attackerAbilities = attackerResource.isMega
    ? allAttackerAbilities.slice(0, 1)
    : allAttackerAbilities
  const defenderAbilities = defenderResource.isMega
    ? allDefenderAbilities.slice(0, 1)
    : allDefenderAbilities

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
    defaultMovePoolIds: [],
    defaultMoveIds: [],
    defaultAttackerItemIds: [attackerLockedItemId ?? "none"],
    defaultDefenderItemIds: [defenderLockedItemId ?? "none"],
    defaultAttackerAbilityIds: attackerAbilities.map((ability) => ability.id),
    defaultDefenderAbilityIds: defenderAbilities.map((ability) => ability.id),
    attackerLockedItemId,
    defenderLockedItemId,
    attackerLockedAbilityId: attackerResource.isMega ? attackerAbilities[0]?.id ?? UNKNOWN_ABILITY_ID : null,
    defenderLockedAbilityId: defenderResource.isMega ? defenderAbilities[0]?.id ?? UNKNOWN_ABILITY_ID : null,
    attackerPreservesItem: attackerResource.battlePokemonId === 10079,
    defenderPreservesItem: defenderResource.battlePokemonId === 10079,
  }
}

export async function resolveCatalogDefaultMovePick(
  catalog: MatchupCatalog,
): Promise<MatchupCatalog> {
  const [defaultMovePick, defaultAttackerAbilityIds, defaultDefenderAbilityIds] =
    await Promise.all([
      resolveDefaultMovePick(
        catalog.matchup.attackerId,
        catalog.moveCategory,
        catalog.moves,
        catalog.defenderTypes,
      ),
      resolveDefaultAbilityIds(catalog.matchup.attackerId, catalog.attackerAbilities),
      resolveDefaultAbilityIds(catalog.matchup.defenderId, catalog.defenderAbilities),
    ])
  return {
    ...catalog,
    ...defaultMovePick,
    defaultAbilityPickStatus: "ready",
    defaultAttackerAbilityIds,
    defaultDefenderAbilityIds,
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

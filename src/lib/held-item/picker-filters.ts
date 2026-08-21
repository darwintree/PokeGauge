import type { CatalogOption } from "@/lib/catalog"
import type { SupportedLocale } from "@/lib/i18n"
import { typeEffectiveness, type PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId } from "@/lib/resources"

import {
  formTriggerIdentityFor,
  formTriggerItemIds,
  isFormTriggerItem,
  isLegalFormTriggerTransition,
} from "./form-triggers"
import {
  ATTACKER_HELD_ITEM_IDS,
  DEFENDER_HELD_ITEM_IDS,
  FROZEN_HELD_ITEM_BY_ID,
  type HeldItemGate,
  type HeldItemPool,
} from "./inventory"
import { heldItemCatalogOption } from "./items"
import type { HeldItemId } from "./types"

export type HeldItemPickerTag = "exclusive" | "power" | "stat" | "berry"

export type HeldItemPickerHolder = {
  battlePokemonId: BattlePokemonId
  speciesId: number
  evioliteEligible: boolean
  types: readonly PokemonType[]
}

function hasHolderGate(gates: readonly HeldItemGate[]): boolean {
  return gates.some(
    (gate) =>
      gate.kind === "holder-species" ||
      gate.kind === "holder-identity" ||
      gate.kind === "eviolite-eligible",
  )
}

function holderGatesAllow(
  gates: readonly HeldItemGate[],
  holder: HeldItemPickerHolder,
): boolean {
  for (const gate of gates) {
    switch (gate.kind) {
      case "holder-species":
        if (!gate.speciesIds.includes(holder.speciesId)) return false
        break
      case "holder-identity":
        if (!gate.battlePokemonIds.includes(holder.battlePokemonId)) return false
        break
      case "eviolite-eligible":
        if (!holder.evioliteEligible) return false
        break
    }
  }
  return true
}

export function heldItemPickerTags(itemId: number): HeldItemPickerTag[] {
  const tags = new Set<HeldItemPickerTag>()
  if (isFormTriggerItem(itemId)) tags.add("exclusive")

  const item = FROZEN_HELD_ITEM_BY_ID.get(itemId)
  if (!item) return [...tags]

  if (hasHolderGate(item.effect.gates)) tags.add("exclusive")
  if (item.effect.kind === "base-power") tags.add("power")
  if (item.effect.kind === "final-damage" && item.warning !== "persistent-berry") {
    tags.add("power")
  }
  if (item.effect.kind === "battle-stat") tags.add("stat")
  if (item.warning === "persistent-berry") tags.add("berry")

  return (["exclusive", "power", "stat", "berry"] as const).filter((tag) =>
    tags.has(tag),
  )
}

function resistanceBerryMatchesHolder(
  itemId: number,
  holderTypes: readonly PokemonType[],
): boolean {
  const item = FROZEN_HELD_ITEM_BY_ID.get(itemId)
  const moveTypes = item?.effect.gates.find((gate) => gate.kind === "move-type")?.types
  return moveTypes?.some(
    (type) => type === "normal" || typeEffectiveness(type, holderTypes) > 1,
  ) ?? false
}

export function isHolderEligibleHeldItem(
  itemId: number,
  holder: HeldItemPickerHolder,
  selectableIds?: ReadonlySet<BattlePokemonId>,
): boolean {
  if (isFormTriggerItem(itemId)) {
    if (!selectableIds) return formTriggerIdentityFor(itemId) != null
    return isLegalFormTriggerTransition(holder.battlePokemonId, itemId, selectableIds)
  }
  const item = FROZEN_HELD_ITEM_BY_ID.get(itemId)
  if (!item) return false
  return holderGatesAllow(item.effect.gates, holder)
}

export function heldItemMatchesPickerFilters(
  option: Pick<CatalogOption<HeldItemId>, "id" | "label">,
  filters: {
    query: string
    tag: HeldItemPickerTag | null
    holder: HeldItemPickerHolder
    selectableIds?: ReadonlySet<BattlePokemonId>
  },
): boolean {
  if (typeof option.id !== "number") return false
  const query = filters.query.trim().toLowerCase()
  if (query && !option.label.toLowerCase().includes(query)) {
    return false
  }
  const tags = heldItemPickerTags(option.id)
  if (filters.tag && !tags.includes(filters.tag)) {
    return false
  }
  if (
    tags.includes("berry") &&
    !resistanceBerryMatchesHolder(option.id, filters.holder.types)
  ) {
    return false
  }
  return isHolderEligibleHeldItem(option.id, filters.holder, filters.selectableIds)
}

export function listHeldItemPickerOptions(input: {
  side: Exclude<HeldItemPool, "lock">
  locale: SupportedLocale
  battlePokemonId: BattlePokemonId
  selectableIds: ReadonlySet<BattlePokemonId>
}): CatalogOption<HeldItemId>[] {
  const frozenIds =
    input.side === "attacker" ? ATTACKER_HELD_ITEM_IDS : DEFENDER_HELD_ITEM_IDS
  const frozenIdSet = new Set<HeldItemId>(frozenIds)
  const options = frozenIds.map((id) => heldItemCatalogOption(id, input.locale))

  for (const itemId of formTriggerItemIds()) {
    if (frozenIdSet.has(itemId)) continue
    if (
      !isLegalFormTriggerTransition(
        input.battlePokemonId,
        itemId,
        input.selectableIds,
      )
    ) {
      continue
    }
    options.push(heldItemCatalogOption(itemId, input.locale))
  }

  return options
}

import type { CatalogOption } from "@/lib/catalog"
import type { SupportedLocale } from "@/lib/i18n"
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
    if (gate.kind === "holder-species" && !gate.speciesIds.includes(holder.speciesId)) {
      return false
    }
    if (
      gate.kind === "holder-identity" &&
      !gate.battlePokemonIds.includes(holder.battlePokemonId)
    ) {
      return false
    }
    if (gate.kind === "eviolite-eligible" && !holder.evioliteEligible) {
      return false
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
    tags: readonly HeldItemPickerTag[]
    holderEligible: boolean
    holder: HeldItemPickerHolder
    selectableIds?: ReadonlySet<BattlePokemonId>
  },
): boolean {
  if (typeof option.id !== "number") return false
  const query = filters.query.trim().toLowerCase()
  if (query && !option.label.toLowerCase().includes(query)) {
    return false
  }
  if (filters.tags.length > 0) {
    const tags = new Set(heldItemPickerTags(option.id))
    if (!filters.tags.every((tag) => tags.has(tag))) return false
  }
  if (
    filters.holderEligible &&
    !isHolderEligibleHeldItem(option.id, filters.holder, filters.selectableIds)
  ) {
    return false
  }
  return true
}

export function listHeldItemPickerOptions(input: {
  side: Exclude<HeldItemPool, "lock">
  locale: SupportedLocale
  battlePokemonId: BattlePokemonId
  selectableIds: ReadonlySet<BattlePokemonId>
}): CatalogOption<HeldItemId>[] {
  const frozenIds = input.side === "attacker"
    ? ATTACKER_HELD_ITEM_IDS
    : DEFENDER_HELD_ITEM_IDS
  const frozen = frozenIds.map((id) => heldItemCatalogOption(id, input.locale))
  const frozenIdSet = new Set<HeldItemId>(frozenIds)

  const extras: CatalogOption<HeldItemId>[] = []
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
    extras.push(heldItemCatalogOption(itemId, input.locale))
  }

  return [...frozen, ...extras]
}

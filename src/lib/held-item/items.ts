import type { CatalogOption } from "@/lib/catalog"
import { localeMessages, type SupportedLocale } from "@/lib/i18n"
import { isMegaStone, megaStoneLabel } from "./mega-stones"
import { GENERATED_HELD_ITEMS } from "@/lib/resources/generated/held-items"
import type { NormalizedHeldItem } from "@/lib/resources"

import {
  ATTACKER_HELD_ITEM_IDS,
  DEFENDER_HELD_ITEM_IDS,
  FROZEN_HELD_ITEM_BY_ID,
  type FrozenHeldItem,
  type HeldItemPool,
  type HeldItemWarning,
} from "./inventory"
import {
  EXPLICIT_NO_ITEM_ID,
  type HeldItemId,
} from "./types"

export const HELD_ITEM_STORAGE_KEY = "pokemon-damage-calc:held-item-added-boosts"

export const MASK_BY_BATTLE_POKEMON_ID: Readonly<Record<number, number>> = {
  10273: 2106,
  10274: 2107,
  10275: 2108,
}

const heldItems = GENERATED_HELD_ITEMS as Record<number, NormalizedHeldItem>

function numericId(id: string | number): number | undefined {
  if (typeof id === "number") return Number.isInteger(id) ? id : undefined
  if (!/^\d+$/.test(id)) return undefined
  const parsed = Number(id)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

export function heldItemDescriptor(
  id: string | number,
): FrozenHeldItem | undefined {
  const parsed = numericId(id)
  return parsed === undefined ? undefined : FROZEN_HELD_ITEM_BY_ID.get(parsed)
}

export function heldItemWarning(
  id: string | number,
): HeldItemWarning | undefined {
  return heldItemDescriptor(id)?.warning
}

export function heldItemContributesBasePower(id: string | number): boolean {
  return heldItemDescriptor(id)?.effect.kind === "base-power"
}

export function lockedHeldItemFor(
  battlePokemonId: number,
): number | null {
  return MASK_BY_BATTLE_POKEMON_ID[battlePokemonId] ?? null
}

export function itemAriaLabel(
  id: string | number,
  locale: SupportedLocale,
): string {
  if (id === EXPLICIT_NO_ITEM_ID) {
    return localeMessages[locale]["track.item.none"]
  }
  if (isMegaStone(id)) return megaStoneLabel(id, locale)
  const parsed = numericId(id)
  return parsed === undefined
    ? String(id)
    : heldItems[parsed]?.names[locale] ?? String(id)
}

export function itemSprite(id: string | number): string | null {
  const parsed = numericId(id)
  return parsed === undefined
    ? null
    : heldItems[parsed]?.spriteFilename ?? null
}

export function itemIsHiddenNeutral(id: string | number): boolean {
  return id === EXPLICIT_NO_ITEM_ID || isMegaStone(id)
}

export function heldItemCatalogOption(
  id: HeldItemId,
  locale: SupportedLocale,
): CatalogOption<HeldItemId> {
  return {
    id,
    label: itemAriaLabel(id, locale),
    summary: "",
  }
}

export function buildHeldItemCatalogOptions(
  pool: Exclude<HeldItemPool, "lock">,
  locale: SupportedLocale,
): CatalogOption<HeldItemId>[] {
  const ids = pool === "attacker"
    ? ATTACKER_HELD_ITEM_IDS
    : DEFENDER_HELD_ITEM_IDS
  return [
    heldItemCatalogOption(EXPLICIT_NO_ITEM_ID, locale),
    ...ids.map((id) => heldItemCatalogOption(id, locale)),
  ]
}

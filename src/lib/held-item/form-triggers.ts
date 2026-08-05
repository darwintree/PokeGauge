import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"
import { GENERATED_POKEMON } from "@/lib/resources/generated/pokemon"

import { MASK_BY_BATTLE_POKEMON_ID } from "./items"
import { MEGA_STONE_BY_ID } from "./mega-stones"

type FormTrigger = {
  targetId: BattlePokemonId
  speciesId: UpstreamResourceId
}

function formTriggerFor(
  battlePokemonId: BattlePokemonId,
): FormTrigger | null {
  const pokemon = (GENERATED_POKEMON as Record<
    BattlePokemonId,
    { speciesId: UpstreamResourceId } | undefined
  >)[battlePokemonId]
  if (!pokemon) return null
  return { targetId: battlePokemonId, speciesId: pokemon.speciesId }
}

const FORM_TRIGGER_BY_ITEM_ID: ReadonlyMap<number, FormTrigger> = (() => {
  const entries = new Map<number, FormTrigger>()
  for (const [battlePokemonId, stoneId] of Object.entries(MEGA_STONE_BY_ID)) {
    if (stoneId === undefined) continue
    const trigger = formTriggerFor(Number(battlePokemonId) as BattlePokemonId)
    if (trigger) entries.set(stoneId, trigger)
  }
  for (const [battlePokemonId, itemId] of Object.entries(MASK_BY_BATTLE_POKEMON_ID)) {
    const trigger = formTriggerFor(Number(battlePokemonId) as BattlePokemonId)
    if (trigger) entries.set(itemId, trigger)
  }
  return entries
})()

export function formTriggerIdentityFor(itemId: number): BattlePokemonId | null {
  return FORM_TRIGGER_BY_ITEM_ID.get(itemId)?.targetId ?? null
}

export function isFormTriggerItem(itemId: number): boolean {
  return FORM_TRIGGER_BY_ITEM_ID.has(itemId)
}

/** Mega Stones by target Mega id, then Ogerpon Masks — stable picker append order. */
export function formTriggerItemIds(): readonly number[] {
  return FORM_TRIGGER_ITEM_IDS
}

const FORM_TRIGGER_ITEM_IDS: readonly number[] = (() => {
  const megaIds = Object.entries(MEGA_STONE_BY_ID)
    .toSorted(([a], [b]) => Number(a) - Number(b))
    .map(([, stoneId]) => stoneId)
    .filter((id): id is number => typeof id === "number")
  return [...megaIds, ...Object.values(MASK_BY_BATTLE_POKEMON_ID)]
})()

export function isLegalFormTriggerTransition(
  currentBattlePokemonId: BattlePokemonId,
  itemId: number,
  selectableIds: ReadonlySet<BattlePokemonId>,
): boolean {
  const trigger = FORM_TRIGGER_BY_ITEM_ID.get(itemId)
  if (!trigger) return false
  if (!selectableIds.has(trigger.targetId)) return false
  if (trigger.targetId === currentBattlePokemonId) return false
  const current = (GENERATED_POKEMON as Record<
    BattlePokemonId,
    { speciesId: UpstreamResourceId } | undefined
  >)[currentBattlePokemonId]
  return current?.speciesId === trigger.speciesId
}

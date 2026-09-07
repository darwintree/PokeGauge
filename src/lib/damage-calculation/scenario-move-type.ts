import {
  AERILATE_ABILITY_ID,
  GALVANIZE_ABILITY_ID,
  LIBERO_ABILITY_ID,
  LIQUID_VOICE_ABILITY_ID,
  NORMALIZE_ABILITY_ID,
  PIXILATE_ABILITY_ID,
  PROTEAN_ABILITY_ID,
  REFRIGERATE_ABILITY_ID,
} from "@/lib/ability"
import type { MoveCategory } from "@/lib/catalog"
import type { PokemonType } from "@/lib/pokemon"

import { NEUTRAL_MODIFIER } from "./damage-input"

/** Judgment, Multi-Attack, Natural Gift, Revelation Dance, Techno Blast, Terrain Pulse, Weather Ball. */
const ATE_EXCLUDED_MOVE_IDS = new Set([449, 718, 363, 686, 546, 805, 311])

/** Normalize also excludes Hidden Power and Struggle. */
const NORMALIZE_EXCLUDED_MOVE_IDS = new Set([...ATE_EXCLUDED_MOVE_IDS, 237, 165])

const ATE_TARGETS: Partial<Record<number, PokemonType>> = {
  [AERILATE_ABILITY_ID]: "flying",
  [PIXILATE_ABILITY_ID]: "fairy",
  [REFRIGERATE_ABILITY_ID]: "ice",
  [GALVANIZE_ABILITY_ID]: "electric",
}

export type AbilityScenarioMoveTypeResult = {
  scenarioMoveType: PokemonType
  basePowerModifier: number
  grantsScenarioStab: boolean
  active: boolean
}

type ResolveInput = {
  abilityId: number
  moveId: number
  moveType: PokemonType
  moveFlags: readonly string[]
  category: MoveCategory | undefined
  hasOriginalTypeStab: boolean
}

function damaging(category: MoveCategory | undefined): boolean {
  return category === "physical" || category === "special"
}

function idle(moveType: PokemonType): AbilityScenarioMoveTypeResult {
  return {
    scenarioMoveType: moveType,
    basePowerModifier: NEUTRAL_MODIFIER,
    grantsScenarioStab: false,
    active: false,
  }
}

/**
 * Ability step of Scenario Move Type: after PokeAPI type + identity resolution.
 * Protean/Libero do not rewrite type; they only grant ordinary STAB when off-type.
 */
export function resolveAbilityScenarioMoveType(
  input: ResolveInput,
): AbilityScenarioMoveTypeResult {
  const { abilityId, moveId, moveType, moveFlags, category, hasOriginalTypeStab } = input

  if (abilityId === NORMALIZE_ABILITY_ID) {
    if (!damaging(category) || NORMALIZE_EXCLUDED_MOVE_IDS.has(moveId)) return idle(moveType)
    return {
      scenarioMoveType: "normal",
      basePowerModifier: 4915,
      grantsScenarioStab: false,
      active: true,
    }
  }

  const ateTarget = ATE_TARGETS[abilityId]
  if (ateTarget !== undefined) {
    if (
      !damaging(category) ||
      moveType !== "normal" ||
      ATE_EXCLUDED_MOVE_IDS.has(moveId)
    ) {
      return idle(moveType)
    }
    return {
      scenarioMoveType: ateTarget,
      basePowerModifier: 4915,
      grantsScenarioStab: false,
      active: true,
    }
  }

  if (abilityId === LIQUID_VOICE_ABILITY_ID) {
    if (!moveFlags.includes("sound")) return idle(moveType)
    if (moveType === "water") return idle(moveType)
    return {
      scenarioMoveType: "water",
      basePowerModifier: NEUTRAL_MODIFIER,
      grantsScenarioStab: false,
      active: true,
    }
  }

  if (abilityId === PROTEAN_ABILITY_ID || abilityId === LIBERO_ABILITY_ID) {
    if (hasOriginalTypeStab) return idle(moveType)
    return {
      scenarioMoveType: moveType,
      basePowerModifier: NEUTRAL_MODIFIER,
      grantsScenarioStab: true,
      active: true,
    }
  }

  return idle(moveType)
}

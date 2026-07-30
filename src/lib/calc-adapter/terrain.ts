import type { PokemonType } from "@/lib/pokemon/types"

import { chainModifiers, NEUTRAL_MODIFIER } from "./damage-kernel"

export const TERRAINS = [
  "none",
  "electric",
  "grassy",
  "psychic",
  "misty",
] as const

export type Terrain = (typeof TERRAINS)[number]

export const LEVITATE_ABILITY_ID = 26

export function isGrounded(
  types: readonly PokemonType[],
  abilityId: number,
): boolean {
  return !types.includes("flying") && abilityId !== LEVITATE_ABILITY_ID
}

type CompiledTerrainEffect = {
  basePowerModifier: number
  makesSpread: boolean
  state: "effective" | "inactive" | "unsupported" | "neutral"
  unavailable?: "terrain-required" | "terrain-type-change"
}

export function compileTerrainEffect(
  moveId: number,
  moveType: PokemonType | undefined,
  terrain: Terrain,
  attackerGrounded: boolean,
  defenderGrounded: boolean,
): CompiledTerrainEffect {
  if (terrain === "none") {
    return {
      basePowerModifier: NEUTRAL_MODIFIER,
      makesSpread: false,
      state: moveId === 798 ? "unsupported" : "neutral",
      ...(moveId === 798 ? { unavailable: "terrain-required" as const } : {}),
    }
  }
  if (moveId === 805 && attackerGrounded) {
    return {
      basePowerModifier: NEUTRAL_MODIFIER,
      makesSpread: false,
      state: "unsupported",
      unavailable: "terrain-type-change",
    }
  }

  const modifiers = [
    moveId === 804 && terrain === "electric" && defenderGrounded ? 8192 : NEUTRAL_MODIFIER,
    moveId === 875 && terrain === "electric" ? 6144 : NEUTRAL_MODIFIER,
    moveId === 797 && terrain === "psychic" && attackerGrounded ? 6144 : NEUTRAL_MODIFIER,
    moveId === 802 && terrain === "misty" && attackerGrounded ? 6144 : NEUTRAL_MODIFIER,
    attackerGrounded && (
      (terrain === "electric" && moveType === "electric") ||
      (terrain === "grassy" && moveType === "grass") ||
      (terrain === "psychic" && moveType === "psychic")
    ) ? 5325 : NEUTRAL_MODIFIER,
    defenderGrounded && (
      (terrain === "misty" && moveType === "dragon") ||
      (terrain === "grassy" && (moveId === 89 || moveId === 523))
    ) ? 2048 : NEUTRAL_MODIFIER,
  ]
  const basePowerModifier = chainModifiers(modifiers)
  const makesSpread =
    moveId === 797 && terrain === "psychic" && attackerGrounded

  return {
    basePowerModifier,
    makesSpread,
    state:
      basePowerModifier !== NEUTRAL_MODIFIER || makesSpread || moveId === 798
        ? "effective"
        : "inactive",
  }
}

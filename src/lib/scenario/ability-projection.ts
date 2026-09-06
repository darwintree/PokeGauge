import {
  CLEAR_BODY_ABILITY_ID,
  COMPETITIVE_ABILITY_ID,
  CONTRARY_ABILITY_ID,
  DEFIANT_ABILITY_ID,
  DRIZZLE_ABILITY_ID,
  DROUGHT_ABILITY_ID,
  ELECTRIC_SURGE_ABILITY_ID,
  FULL_METAL_BODY_ABILITY_ID,
  GRASSY_SURGE_ABILITY_ID,
  GUARD_DOG_ABILITY_ID,
  HYPER_CUTTER_ABILITY_ID,
  INNER_FOCUS_ABILITY_ID,
  INTIMIDATE_ABILITY_ID,
  MISTY_SURGE_ABILITY_ID,
  OBLIVIOUS_ABILITY_ID,
  OWN_TEMPO_ABILITY_ID,
  PSYCHIC_SURGE_ABILITY_ID,
  SAND_SPIT_ABILITY_ID,
  SAND_STREAM_ABILITY_ID,
  SCRAPPY_ABILITY_ID,
  SIMPLE_ABILITY_ID,
  SNOW_WARNING_ABILITY_ID,
  WHITE_SMOKE_ABILITY_ID,
} from "@/lib/ability"
import type { MoveCategory } from "@/lib/catalog"
import { TERRAINS, WEATHERS, type StatStage } from "@/lib/damage-calculation"

import { mergeStagePool, mergeStageSelection } from "./state"
import type { TrackState } from "./types"

// Recommendations for the Gen 9 engine's Intimidate interactions. These select
// explicit Stage Track inputs; they do not apply a second damage modifier.
const INTIMIDATE_IMMUNITIES = new Set([
  CLEAR_BODY_ABILITY_ID,
  WHITE_SMOKE_ABILITY_ID,
  HYPER_CUTTER_ABILITY_ID,
  FULL_METAL_BODY_ABILITY_ID,
  INNER_FOCUS_ABILITY_ID,
  OWN_TEMPO_ABILITY_ID,
  OBLIVIOUS_ABILITY_ID,
  SCRAPPY_ABILITY_ID,
])

function stageForAbilityPair(
  attackerAbilityId: number,
  defenderAbilityId: number,
  category: MoveCategory,
): StatStage {
  if (defenderAbilityId !== INTIMIDATE_ABILITY_ID ||
    INTIMIDATE_IMMUNITIES.has(attackerAbilityId)) return 0
  if (category === "special") return attackerAbilityId === COMPETITIVE_ABILITY_ID ? 2 : 0
  switch (attackerAbilityId) {
    case DEFIANT_ABILITY_ID:
    case CONTRARY_ABILITY_ID:
    case GUARD_DOG_ABILITY_ID:
      return 1
    case SIMPLE_ABILITY_ID:
      return -2
    default:
      return -1
  }
}

export function projectAbilitySelections(
  state: TrackState,
  category: MoveCategory,
  preserve: { weather?: boolean; terrain?: boolean; attackerStages?: boolean } = {},
): TrackState {
  const allAbilityIds = [...state.attackerAbilityIds, ...state.defenderAbilityIds]
  const weatherRecommendations = new Set<TrackState["weathers"][number]>()
  const terrainRecommendations = new Set<TrackState["terrains"][number]>()
  for (const id of allAbilityIds) {
    if (id === DRIZZLE_ABILITY_ID) weatherRecommendations.add("rain")
    if (id === SAND_STREAM_ABILITY_ID || id === SAND_SPIT_ABILITY_ID) {
      weatherRecommendations.add("sand")
    }
    if (id === DROUGHT_ABILITY_ID) weatherRecommendations.add("sun")
    if (id === SNOW_WARNING_ABILITY_ID) weatherRecommendations.add("snow")
    if (id === ELECTRIC_SURGE_ABILITY_ID) terrainRecommendations.add("electric")
    if (id === GRASSY_SURGE_ABILITY_ID) terrainRecommendations.add("grassy")
    if (id === PSYCHIC_SURGE_ABILITY_ID) terrainRecommendations.add("psychic")
    if (id === MISTY_SURGE_ABILITY_ID) terrainRecommendations.add("misty")
  }
  if (weatherRecommendations.size === 0) weatherRecommendations.add("none")
  if (terrainRecommendations.size === 0) terrainRecommendations.add("none")

  const stageRecommendations = mergeStageSelection(state.attackerAbilityIds.flatMap(
    (attackerId) => state.defenderAbilityIds.map(
      (defenderId) => stageForAbilityPair(attackerId, defenderId, category),
    ),
  ))
  const stageCandidates = [...stageRecommendations]
  if (category === "physical" && state.attackerAbilityIds.includes(DEFIANT_ABILITY_ID)) {
    stageCandidates.push(1, 2)
  }
  if (category === "special" && state.attackerAbilityIds.includes(COMPETITIVE_ABILITY_ID)) {
    stageCandidates.push(2)
  }

  return {
    ...state,
    weathers: preserve.weather
      ? state.weathers : WEATHERS.filter((value) => weatherRecommendations.has(value)),
    terrains: preserve.terrain
      ? state.terrains : TERRAINS.filter((value) => terrainRecommendations.has(value)),
    weatherPool: WEATHERS.filter((value) =>
      value === "none" || state.weatherPool.includes(value) ||
      state.weathers.includes(value) || weatherRecommendations.has(value),
    ),
    terrainPool: TERRAINS.filter((value) =>
      value === "none" || state.terrainPool.includes(value) ||
      state.terrains.includes(value) || terrainRecommendations.has(value),
    ),
    attackerStages: preserve.attackerStages ? state.attackerStages : stageRecommendations,
    attackerStagePool: mergeStagePool(
      state.attackerStagePool,
      [...state.attackerStages, ...stageCandidates],
    ),
  }
}

import {
  COMPETITIVE_ABILITY_ID,
  DEFIANT_ABILITY_ID,
  DRIZZLE_ABILITY_ID,
  DROUGHT_ABILITY_ID,
  ELECTRIC_SURGE_ABILITY_ID,
  INTIMIDATE_ABILITY_ID,
  SAND_SPIT_ABILITY_ID,
  SAND_STREAM_ABILITY_ID,
  SNOW_WARNING_ABILITY_ID,
} from "@/lib/ability"
import type { MoveCategory } from "@/lib/catalog"
import { TERRAINS, WEATHERS } from "@/lib/damage-calculation"

import { mergeStagePool, mergeStageSelection } from "./state"
import type { TrackState } from "./types"

export function projectAbilitySelections(
  state: TrackState,
  category: MoveCategory,
  attackerAbilityIds = state.attackerAbilityIds,
  defenderAbilityIds = state.defenderAbilityIds,
  stageOnly = false,
): TrackState {
  const allAbilityIds = [...attackerAbilityIds, ...defenderAbilityIds]
  const weatherAdditions = new Set<TrackState["weathers"][number]>()
  let addElectricTerrain = false

  if (!stageOnly) {
    for (const id of allAbilityIds) {
      if (id === DRIZZLE_ABILITY_ID) weatherAdditions.add("rain")
      if (id === SAND_STREAM_ABILITY_ID || id === SAND_SPIT_ABILITY_ID) {
        weatherAdditions.add("sand")
      }
      if (id === DROUGHT_ABILITY_ID) weatherAdditions.add("sun")
      if (id === SNOW_WARNING_ABILITY_ID) weatherAdditions.add("snow")
      if (id === ELECTRIC_SURGE_ABILITY_ID) addElectricTerrain = true
    }
  }

  const stageAdditions: TrackState["attackerStages"] = []
  if (category === "physical") {
    if (defenderAbilityIds.includes(INTIMIDATE_ABILITY_ID)) stageAdditions.push(-1)
    if (attackerAbilityIds.includes(DEFIANT_ABILITY_ID)) stageAdditions.push(1)
  } else if (attackerAbilityIds.includes(COMPETITIVE_ABILITY_ID)) {
    stageAdditions.push(2)
  }

  return {
    ...state,
    weatherPool: WEATHERS.filter((value) => value === "none" || state.weatherPool.includes(value) || state.weathers.includes(value) || weatherAdditions.has(value)),
    terrainPool: TERRAINS.filter((value) => value === "none" || state.terrainPool.includes(value) || state.terrains.includes(value) || (value === "electric" && addElectricTerrain)),
    weathers: stageOnly
      ? state.weathers
      : WEATHERS.filter((value) => state.weathers.includes(value) || weatherAdditions.has(value)),
    terrains: stageOnly
      ? state.terrains
      : TERRAINS.filter((value) =>
          state.terrains.includes(value) || (value === "electric" && addElectricTerrain),
        ),
    attackerStagePool: mergeStagePool(
      state.attackerStagePool,
      [...state.attackerStages, ...stageAdditions],
    ),
    attackerStages: mergeStageSelection(state.attackerStages, stageAdditions),
  }
}

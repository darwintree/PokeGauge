import type { PokemonType } from "@/lib/pokemon"

import { NEUTRAL_MODIFIER } from "./damage-input"
import type { ProbabilityMode } from "./types"

export const WEATHERS = ["none", "sun", "rain", "sand", "snow"] as const

export type Weather = (typeof WEATHERS)[number]

const WEATHER_BALL_MOVE_ID = 311

const WEATHER_BALL_TYPES: Record<Exclude<Weather, "none">, PokemonType> = {
  sun: "fire",
  rain: "water",
  sand: "rock",
  snow: "ice",
}

type WeatherAccuracy = number | "always-hits"

const WEATHER_ACCURACY: Partial<
  Record<number, Partial<Record<Weather, WeatherAccuracy>>>
> = {
  59: { snow: "always-hits" },
  87: { sun: 50, rain: "always-hits" },
  542: { sun: 50, rain: "always-hits" },
  846: { rain: "always-hits" },
  847: { rain: "always-hits" },
  848: { rain: "always-hits" },
}

type CompiledWeatherEffect = {
  basePowerModifier: number
  damageModifier: number
  accuracy?: WeatherAccuracy
  ordinaryDamageSuppressed: boolean
  state: "active" | "inactive" | "unsupported" | "neutral"
}

function basePowerModifier(moveId: number, weather: Weather): number {
  if (moveId === WEATHER_BALL_MOVE_ID && weather !== "none") return NEUTRAL_MODIFIER * 2
  return (moveId === 76 || moveId === 669) &&
    (weather === "rain" || weather === "sand" || weather === "snow")
    ? 2048
    : NEUTRAL_MODIFIER
}

function damageModifier(
  moveId: number,
  moveType: PokemonType | undefined,
  weather: Weather,
  suppressOrdinaryDamage: boolean,
): number {
  if (moveId === 876 && weather === "sun") return 6144
  if (suppressOrdinaryDamage) return NEUTRAL_MODIFIER
  if (weather === "sun") {
    if (moveType === "fire") return 6144
    if (moveType === "water") return 2048
  }
  if (weather === "rain") {
    if (moveType === "water") return 6144
    if (moveType === "fire") return 2048
  }
  return NEUTRAL_MODIFIER
}

export function resolveWeatherMoveType(
  moveId: number,
  weather: Weather,
  fallback: PokemonType,
): PokemonType {
  if (moveId !== WEATHER_BALL_MOVE_ID || weather === "none") return fallback
  return WEATHER_BALL_TYPES[weather]
}

export function compileWeatherEffect(
  moveId: number,
  moveType: PokemonType | undefined,
  weather: Weather,
  probabilityMode: ProbabilityMode,
  suppressOrdinaryDamage = false,
): CompiledWeatherEffect {
  if (weather === "none") {
    return {
      basePowerModifier: NEUTRAL_MODIFIER,
      damageModifier: NEUTRAL_MODIFIER,
      ordinaryDamageSuppressed: false,
      state: "neutral",
    }
  }

  const basePower = basePowerModifier(moveId, weather)
  const ordinaryDamage = damageModifier(moveId, moveType, weather, false)
  const damage = damageModifier(moveId, moveType, weather, suppressOrdinaryDamage)
  const accuracy = WEATHER_ACCURACY[moveId]?.[weather]
  const active =
    basePower !== NEUTRAL_MODIFIER ||
    damage !== NEUTRAL_MODIFIER ||
    (probabilityMode === "battle-odds" && accuracy !== undefined)

  return {
    basePowerModifier: basePower,
    damageModifier: damage,
    ordinaryDamageSuppressed: suppressOrdinaryDamage && damage !== ordinaryDamage,
    ...(accuracy === undefined ? {} : { accuracy }),
    state: active ? "active" : "inactive",
  }
}

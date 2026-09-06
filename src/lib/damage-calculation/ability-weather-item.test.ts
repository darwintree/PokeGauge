import { beforeAll, describe, expect, it } from "vitest"

import {
  AIR_LOCK_ABILITY_ID,
  CLOUD_NINE_ABILITY_ID,
  KLUTZ_ABILITY_ID,
  MEGA_SOL_ABILITY_ID,
  NO_ABILITY_ID,
  SAND_FORCE_ABILITY_ID,
  SAND_VEIL_ABILITY_ID,
  SOLAR_POWER_ABILITY_ID,
  UNNERVE_ABILITY_ID,
} from "@/lib/ability"
import { FROZEN_HELD_ITEMS } from "@/lib/held-item"
import type { MoveSnapshot } from "@/lib/move"
import { type PokemonType, typeEffectiveness } from "@/lib/pokemon"
import {
  listResources,
  type LocalizedMoveResource,
  type LocalizedPokemonResource,
} from "@/lib/resources"

import {
  compileScenario,
  NEUTRAL_MODIFIER,
  type CalculableScenario,
  type CompilerOutcome,
  type RawScenario,
  type ScenarioTrack,
} from "./index"

const N = NEUTRAL_MODIFIER

const TACKLE: MoveSnapshot = {
  id: "weather-item-tackle",
  moveId: 33,
  power: 40,
  accuracy: 100,
  alwaysHits: false,
  criticalStage: 0,
  spreadEligible: false,
  spread: false,
}

let pokemonResources: LocalizedPokemonResource[] = []
let moveResources: LocalizedMoveResource[] = []

function scenario(overrides: Partial<RawScenario> = {}): RawScenario {
  return {
    snapshot: TACKLE,
    attackerId: 133,
    defenderId: 831,
    attackerItemId: "none",
    defenderItemId: "none",
    attackerAbilityId: NO_ABILITY_ID,
    defenderAbilityId: NO_ABILITY_ID,
    attackerStage: 0,
    defenderStage: 0,
    weather: "none",
    terrain: "none",
    screen: "none",
    probabilityMode: "classic",
    lowOutcome: { offense: 100, defense: { hp: 200, def: 100 } },
    ...overrides,
  }
}

function snapshot(moveId: number, power: number, accuracy = 100): MoveSnapshot {
  return {
    ...TACKLE,
    id: `weather-item-${moveId}`,
    moveId,
    power,
    accuracy,
  }
}

function outcome(overrides: Partial<RawScenario> = {}): CompilerOutcome {
  return compileScenario(scenario(overrides))
}

function calculable(overrides: Partial<RawScenario> = {}): CalculableScenario {
  const compiled = outcome(overrides)
  if (compiled.kind !== "calculable") {
    throw new Error(`Expected calculable, got ${compiled.reason}`)
  }
  return compiled
}

function normal(compiled: CalculableScenario) {
  const branch = compiled.calculation.low.normal
  if (!branch) throw new Error("Expected normal branch")
  return branch
}

function state(compiled: CompilerOutcome, track: ScenarioTrack) {
  return compiled.sources.find((source) => source.track === track)?.state
}

beforeAll(async () => {
  const [pokemon, moves] = await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
    listResources("ability", "en"),
  ])
  pokemonResources = pokemon
  moveResources = moves
})

describe("Cloud Nine and Air Lock", () => {
  it("keeps every independent nullifier active while suppressing ordinary weather damage", () => {
    const compiled = calculable({
      snapshot: snapshot(52, 40),
      weather: "sun",
      defenderItemId: 1181,
      attackerAbilityId: CLOUD_NINE_ABILITY_ID,
      defenderAbilityId: AIR_LOCK_ABILITY_ID,
    })

    expect(normal(compiled).weatherModifier).toBe(N)
    expect(state(compiled, "attacker-ability")).toBe("active")
    expect(state(compiled, "defender-ability")).toBe("active")
    expect(state(compiled, "defender-held-item")).toBe("active")
    expect(state(compiled, "weather")).toBe("inactive")
  })

  it("suppresses Base Power, Battle Odds accuracy, and weather-gated abilities", () => {
    const solarBeam = calculable({
      snapshot: snapshot(76, 120),
      weather: "rain",
      defenderAbilityId: CLOUD_NINE_ABILITY_ID,
    })
    expect(normal(solarBeam).basePowerModifier).toBe(N)
    expect(state(solarBeam, "defender-ability")).toBe("active")

    const thunder = calculable({
      snapshot: snapshot(87, 110, 70),
      weather: "rain",
      probabilityMode: "battle-odds",
      defenderAbilityId: AIR_LOCK_ABILITY_ID,
    })
    expect(thunder.hitFact).toBe(70)
    expect(state(thunder, "defender-ability")).toBe("active")

    const sandVeil = calculable({
      snapshot: snapshot(33, 40, 80),
      weather: "sand",
      probabilityMode: "battle-odds",
      attackerAbilityId: CLOUD_NINE_ABILITY_ID,
      defenderAbilityId: SAND_VEIL_ABILITY_ID,
    })
    expect(sandVeil.hitFact).toBe(80)
    expect(state(sandVeil, "attacker-ability")).toBe("active")
    expect(state(sandVeil, "defender-ability")).toBe("inactive")

    const solarPower = calculable({
      snapshot: snapshot(52, 40),
      weather: "sun",
      attackerAbilityId: SOLAR_POWER_ABILITY_ID,
      defenderAbilityId: CLOUD_NINE_ABILITY_ID,
    })
    expect(normal(solarPower).attackModifier).toBe(N)
    expect(state(solarPower, "attacker-ability")).toBe("inactive")
    expect(state(solarPower, "defender-ability")).toBe("active")

    const sandForce = calculable({
      snapshot: snapshot(89, 100),
      weather: "sand",
      attackerAbilityId: SAND_FORCE_ABILITY_ID,
      defenderAbilityId: AIR_LOCK_ABILITY_ID,
    })
    expect(normal(sandForce).basePowerModifier).toBe(N)
    expect(state(sandForce, "attacker-ability")).toBe("inactive")
    expect(state(sandForce, "defender-ability")).toBe("active")
  })

  it("restores Weather Ball's no-weather calculable behavior", () => {
    const compiled = outcome({
      snapshot: snapshot(311, 50),
      weather: "rain",
      attackerAbilityId: CLOUD_NINE_ABILITY_ID,
    })

    expect(compiled.kind).toBe("calculable")
    expect(state(compiled, "attacker-ability")).toBe("active")
    expect(state(compiled, "weather")).toBe("inactive")
  })

  it("stays inactive when raw weather has no supported consumer", () => {
    const compiled = calculable({
      weather: "sand",
      attackerAbilityId: CLOUD_NINE_ABILITY_ID,
    })

    expect(state(compiled, "attacker-ability")).toBe("inactive")
    expect(state(compiled, "weather")).toBe("inactive")
  })
})

describe("Mega Sol", () => {
  it("keeps calc-missing Mega Sol unsupported without replacing weather", () => {
    const attacker = calculable({
      snapshot: snapshot(52, 40),
      weather: "rain",
      attackerAbilityId: MEGA_SOL_ABILITY_ID,
    })
    expect(normal(attacker).weatherModifier).toBe(2048)
    expect(state(attacker, "attacker-ability")).toBe("unsupported")
    expect(state(attacker, "weather")).toBe("active")
  })
})

describe("Unnerve", () => {
  const moveByType: Record<PokemonType, number> = {
    normal: 33,
    fire: 52,
    water: 55,
    electric: 84,
    grass: 75,
    ice: 58,
    fighting: 2,
    poison: 40,
    ground: 89,
    flying: 16,
    psychic: 93,
    bug: 450,
    rock: 88,
    ghost: 247,
    dragon: 225,
    dark: 44,
    steel: 232,
    fairy: 584,
  }

  it("suppresses all 18 frozen resistance Berries, including Chilan", () => {
    const berries = FROZEN_HELD_ITEMS.filter((item) => item.effect.kind === "resistance-berry")
    expect(berries).toHaveLength(18)

    for (const berry of berries) {
      const moveTypeGate = berry.effect.gates.find((gate) => gate.kind === "move-type")
      if (!moveTypeGate || moveTypeGate.kind !== "move-type") {
        throw new Error(`Berry ${berry.id} is missing its move-type gate`)
      }
      const moveType = moveTypeGate.types[0]
      const move = moveResources.find((candidate) => candidate.id === moveByType[moveType])
      const defender = pokemonResources.find((candidate) =>
        berry.id === 177 || typeEffectiveness(moveType, candidate.types) > 1
      )
      if (!move?.power || !defender) {
        throw new Error(`Missing fixture for ${moveType} Berry ${berry.id}`)
      }
      const overrides = {
        snapshot: snapshot(move.id, move.power, move.accuracy ?? 100),
        defenderId: defender.id,
        defenderItemId: berry.id,
      }
      const baseline = calculable(overrides)
      const suppressed = calculable({
        ...overrides,
        attackerAbilityId: UNNERVE_ABILITY_ID,
      })

      expect(state(baseline, "defender-held-item"), `Berry ${berry.id}`).toBe("active")
      expect(normal(baseline).finalModifier, `Berry ${berry.id}`).toBe(2048)
      expect(state(suppressed, "attacker-ability"), `Berry ${berry.id}`).toBe("active")
      expect(state(suppressed, "defender-held-item"), `Berry ${berry.id}`).toBe("inactive")
      expect(normal(suppressed).finalModifier, `Berry ${berry.id}`).toBe(N)
    }
  })

  it("is directional and stays inactive when the Berry gate misses", () => {
    const defenderUnnerve = calculable({
      defenderItemId: 177,
      defenderAbilityId: UNNERVE_ABILITY_ID,
    })
    expect(state(defenderUnnerve, "defender-ability")).toBe("inactive")
    expect(state(defenderUnnerve, "defender-held-item")).toBe("active")

    const miss = calculable({
      defenderItemId: 168,
      attackerAbilityId: UNNERVE_ABILITY_ID,
    })
    expect(state(miss, "attacker-ability")).toBe("inactive")
    expect(state(miss, "defender-held-item")).toBe("inactive")
  })

  it("marks both independent Unnerve and Klutz suppression sources active", () => {
    const compiled = calculable({
      defenderItemId: 177,
      attackerAbilityId: UNNERVE_ABILITY_ID,
      defenderAbilityId: KLUTZ_ABILITY_ID,
    })

    expect(normal(compiled).finalModifier).toBe(N)
    expect(state(compiled, "attacker-ability")).toBe("active")
    expect(state(compiled, "defender-ability")).toBe("active")
    expect(state(compiled, "defender-held-item")).toBe("inactive")
  })
})

import { beforeAll, describe, expect, it } from "vitest"

import {
  BULLETPROOF_ABILITY_ID,
  DRY_SKIN_ABILITY_ID,
  EARTH_EATER_ABILITY_ID,
  EELEVATE_ABILITY_ID,
  FLASH_FIRE_ABILITY_ID,
  LIGHTNING_ROD_ABILITY_ID,
  LEVITATE_ABILITY_ID,
  MOTOR_DRIVE_ABILITY_ID,
  SAP_SIPPER_ABILITY_ID,
  SCRAPPY_ABILITY_ID,
  SOUNDPROOF_ABILITY_ID,
  VOLT_ABSORB_ABILITY_ID,
  WATER_ABSORB_ABILITY_ID,
} from "@/lib/ability"
import {
  calculateDamageRolls,
  compileScenario,
  projectMoveMechanics,
  type CalculableScenario,
  type RawScenario,
  type ScenarioTrack,
} from "@/lib/damage-calculation"
import { listResources } from "@/lib/resources"
import {
  calculateKOProbability,
  convolveAtomicDamageDistributions,
  createAtomicDamageDistribution,
} from "@/lib/damage-distribution"

const MOVE = {
  id: "ability-immunity",
  moveId: 33,
  power: 40,
  accuracy: 100,
  alwaysHits: false,
  criticalStage: 0 as const,
  spreadEligible: false,
  spread: false,
}

function raw(overrides: Partial<RawScenario> = {}): RawScenario {
  return {
    snapshot: MOVE,
    attackerId: 133,
    defenderId: 143,
    attackerItemId: "none",
    attackerAbilityId: -1,
    defenderAbilityId: -1,
    attackerStage: 0,
    defenderStage: 0,
    weather: "none",
    terrain: "none",
    screen: "none",
    probabilityMode: "battle-odds",
    lowOutcome: { offense: 100, defense: { hp: 200, def: 100 } },
    ...overrides,
  }
}

function calculable(overrides: Partial<RawScenario> = {}): CalculableScenario {
  const outcome = compileScenario(raw(overrides))
  if (outcome.kind !== "calculable") throw new Error(`Expected calculable: ${outcome.reason}`)
  return outcome
}

function selectionActivation(outcome: CalculableScenario, track: ScenarioTrack) {
  return outcome.sources.find((source) => source.track === track)?.state
}

beforeAll(async () => {
  await Promise.all([listResources("pokemon", "en"), listResources("move", "en")])
})

describe("ability immunity gates", () => {
  const cases = [
    [FLASH_FIRE_ABILITY_ID, 52, 95],
    [VOLT_ABSORB_ABILITY_ID, 85, 90],
    [LIGHTNING_ROD_ABILITY_ID, 85, 90],
    [MOTOR_DRIVE_ABILITY_ID, 85, 90],
    [WATER_ABSORB_ABILITY_ID, 55, 40],
    [SAP_SIPPER_ABILITY_ID, 75, 55],
    [EARTH_EATER_ABILITY_ID, 89, 100],
    [LEVITATE_ABILITY_ID, 89, 100],
    [EELEVATE_ABILITY_ID, 89, 100],
    [DRY_SKIN_ABILITY_ID, 55, 40],
    [SOUNDPROOF_ABILITY_ID, 304, 90],
    [BULLETPROOF_ABILITY_ID, 396, 80],
  ] as const

  it.each(cases)("negates matching damage for Ability %s", (abilityId, moveId, power) => {
    const outcome = calculable({
      defenderAbilityId: abilityId,
      snapshot: { ...MOVE, moveId, power },
    })
    const branch = outcome.calculation.low.normal!
    const rolls = calculateDamageRolls(outcome.calculation).low

    expect(outcome.kind).toBe("calculable")
    expect(branch.damageNegated).toBe(true)
    expect(branch.typeEffectivenessModifier).toBeGreaterThan(0)
    expect(rolls.normal).toEqual(Array(16).fill(0))
    expect(rolls.critical).toEqual(Array(16).fill(0))
    expect(projectMoveMechanics(outcome).normal?.effectivePower).toBe(0)
    expect(outcome.hitFact).toBe(100)
    expect(outcome.probability.hitProbability).toBe(1)
    expect(selectionActivation(outcome, "defender-ability")).toBe("active")
  })

  it("keeps a matching immunity inactive when the type chart already negates damage", () => {
    const outcome = calculable({
      defenderId: 6,
      defenderAbilityId: EARTH_EATER_ABILITY_ID,
      snapshot: { ...MOVE, moveId: 89, power: 100 },
    })

    expect(outcome.calculation.low.normal).toMatchObject({
      damageNegated: false,
      typeEffectivenessModifier: 0,
    })
    expect(selectionActivation(outcome, "defender-ability")).toBe("inactive")
  })

  it("keeps zero damage calculable through distribution and KO probability", () => {
    const outcome = calculable({
      defenderAbilityId: FLASH_FIRE_ABILITY_ID,
      snapshot: { ...MOVE, moveId: 52, power: 95 },
    })
    const rolls = calculateDamageRolls(outcome.calculation).low
    const atomic = createAtomicDamageDistribution({
      ...outcome.probability,
      normalDamageRolls: rolls.normal,
      criticalDamageRolls: rolls.critical,
    })

    expect(calculateKOProbability(convolveAtomicDamageDistributions([atomic]), 200)).toBe(0)
    expect(calculateKOProbability(convolveAtomicDamageDistributions([atomic, atomic]), 200)).toBe(0)
    expect(outcome.hitFact).toBe(100)
    expect(projectMoveMechanics(outcome).normal?.effectivePower).toBe(0)
  })

  it("leaves non-matching types and flags calculable with an inactive Ability", () => {
    const soundproofTackle = calculable({ defenderAbilityId: SOUNDPROOF_ABILITY_ID })
    const bulletproofTackle = calculable({ defenderAbilityId: BULLETPROOF_ABILITY_ID })

    expect(soundproofTackle.calculation.low.normal?.damageNegated).toBe(false)
    expect(bulletproofTackle.calculation.low.normal?.damageNegated).toBe(false)
    expect(selectionActivation(soundproofTackle, "defender-ability")).toBe("inactive")
    expect(selectionActivation(bulletproofTackle, "defender-ability")).toBe("inactive")
  })

  it("applies Dry Skin's Fire modifier in the Base Power phase", () => {
    const outcome = calculable({
      defenderAbilityId: DRY_SKIN_ABILITY_ID,
      snapshot: { ...MOVE, moveId: 52, power: 95 },
    })

    expect(outcome.calculation.low.normal).toMatchObject({
      damageNegated: false,
      basePowerModifier: 5120,
      finalModifier: 4096,
    })
    expect(selectionActivation(outcome, "defender-ability")).toBe("active")
  })

  it("resolves Scrappy before the Held item effectiveness gate", () => {
    const outcome = calculable({
      attackerAbilityId: SCRAPPY_ABILITY_ID,
      defenderId: 10239,
      defenderItemId: 166,
      snapshot: { ...MOVE, moveId: 370, power: 120 },
    })

    expect(outcome.calculation.low.normal).toMatchObject({
      damageNegated: false,
      typeEffectivenessModifier: 8192,
      finalModifier: 2048,
    })
    expect(selectionActivation(outcome, "attacker-ability")).toBe("active")
    expect(selectionActivation(outcome, "defender-held-item")).toBe("active")
  })

  it("keeps Scrappy inactive off Ghost targets and does not bypass Ability immunity", () => {
    const ordinary = calculable({ attackerAbilityId: SCRAPPY_ABILITY_ID })
    const soundproof = calculable({
      attackerAbilityId: SCRAPPY_ABILITY_ID,
      defenderId: 94,
      defenderAbilityId: SOUNDPROOF_ABILITY_ID,
      snapshot: { ...MOVE, moveId: 304, power: 90 },
    })

    expect(selectionActivation(ordinary, "attacker-ability")).toBe("inactive")
    expect(soundproof.calculation.low.normal?.damageNegated).toBe(true)
    expect(selectionActivation(soundproof, "attacker-ability")).toBe("inactive")
    expect(selectionActivation(soundproof, "defender-ability")).toBe("active")
  })

  it.each([LEVITATE_ABILITY_ID, EELEVATE_ABILITY_ID])(
    "uses Ability %s as attacker grounding provenance for Terrain gates",
    (abilityId) => {
      const outcome = calculable({
        attackerId: 25,
        attackerAbilityId: abilityId,
        terrain: "electric",
        snapshot: { ...MOVE, moveId: 85, power: 90 },
      })

      expect(outcome.calculation.low.normal?.basePowerModifier).toBe(4096)
      expect(selectionActivation(outcome, "attacker-ability")).toBe("active")
      expect(selectionActivation(outcome, "terrain")).toBe("inactive")
    },
  )

  it.each([LEVITATE_ABILITY_ID, EELEVATE_ABILITY_ID])(
    "uses Ability %s as defender grounding provenance for Terrain gates",
    (abilityId) => {
      const outcome = calculable({
        defenderAbilityId: abilityId,
        terrain: "misty",
        snapshot: { ...MOVE, moveId: 406, power: 90 },
      })

      expect(outcome.calculation.low.normal).toMatchObject({
        damageNegated: false,
        basePowerModifier: 4096,
      })
      expect(selectionActivation(outcome, "defender-ability")).toBe("active")
      expect(selectionActivation(outcome, "terrain")).toBe("inactive")
    },
  )

  it.each([LEVITATE_ABILITY_ID, EELEVATE_ABILITY_ID])(
    "keeps Ability %s inactive when grounding changes only an already immune result",
    (abilityId) => {
      const outcome = calculable({
        defenderId: 700,
        defenderAbilityId: abilityId,
        terrain: "misty",
        snapshot: { ...MOVE, moveId: 406, power: 90 },
      })

      expect(outcome.calculation.low.normal).toMatchObject({
        damageNegated: false,
        typeEffectivenessModifier: 0,
      })
      expect(selectionActivation(outcome, "defender-ability")).toBe("inactive")
      expect(selectionActivation(outcome, "terrain")).toBe("inactive")
    },
  )
})

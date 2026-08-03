import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it } from "vitest"

import type { MoveCategory } from "@/lib/catalog"
import { listResources } from "@/lib/resources"
import {
  type MoveSnapshot,
  normalizeSnapshotAccuracy,
  normalizeSnapshotPower,
} from "@/lib/move"

import { calculateDamageRolls, type DamageFormulaBranch } from "@/lib/damage-calculation"
import { CALC_GEN, VGC_LEVEL } from "@/lib/damage-calculation"
import { defenderStatValues, offenseStatValue } from "@/lib/stat-calculation"
import {
  ATTACKER_STAT_SETUPS,
  DEFENDER_SETUPS,
  getAttackerStatSetups,
  getDefenderSetups,
} from "@/lib/stat-calculation"
import {
  calculationIdentity,
  type CalculableScenario,
  type RawScenario,
  type RawScenarioPoint,
  compileScenario,
} from "@/lib/damage-calculation"
import {
  type DefenderSetup,
  type StatSetup,
} from "@/lib/stat-calculation"
import { STAT_STAGES, type StatStage } from "@/lib/damage-calculation"

const snapshot: MoveSnapshot = {
  id: "earthquake-1",
  moveId: 89,
  power: 100,
  accuracy: 100,
  alwaysHits: false,
  criticalStage: 0,
  spreadEligible: true,
  spread: true,
}

function exactPoint(
  attackerCalcName: string,
  defenderCalcName: string,
  category: MoveCategory,
  offense: StatSetup = getAttackerStatSetups(category)["neutral-max"],
  defense: DefenderSetup = getDefenderSetups(category)["standard-bulk"],
): RawScenarioPoint {
  return {
    offense: offenseStatValue(attackerCalcName, category, offense),
    defense: defenderStatValues(defenderCalcName, category, defense),
  }
}

function scenario(overrides: Partial<RawScenario> = {}): RawScenario {
  return {
    snapshot,
    attackerId: 445,
    defenderId: 727,
    attackerItemId: "none",
    attackerAbilityId: 8,
    defenderAbilityId: 22,
    attackerStage: 0,
    defenderStage: 0,
    weather: "none",
    terrain: "none",
    screen: "none",
    probabilityMode: "classic",
    lowOutcome: exactPoint("Garchomp", "Incineroar", "physical"),
    ...overrides,
  }
}

function calculableScenario(overrides: Partial<RawScenario> = {}): CalculableScenario {
  const outcome = compileScenario(scenario(overrides))
  if (outcome.kind !== "calculable") throw new Error(`Expected calculable, got ${outcome.reason}`)
  return outcome
}

function heldItemSource(
  outcome: CalculableScenario,
  track: "held-item" | "defender-held-item" = "held-item",
) {
  return outcome.sources.find((source) => source.track === track)
}

describe("scenario compiler", () => {
  beforeAll(async () => {
    await Promise.all([listResources("pokemon", "en"), listResources("move", "en")])
  })

  it("normalizes snapshot scalar edits at their product limits", () => {
    expect([-1, 0, 1.9, 1001, Number.NaN].map(normalizeSnapshotPower)).toEqual([
      0,
      0,
      1,
      1000,
      0,
    ])
    expect([-1, 0, 95.9, 101, Number.POSITIVE_INFINITY].map(normalizeSnapshotAccuracy)).toEqual([
      0,
      0,
      95,
      100,
      0,
    ])
  })

  it("returns an unavailable outcome for unconfigured snapshot fields", () => {
    expect(
      compileScenario(scenario({ snapshot: { ...snapshot, power: 0, accuracy: 0 } })),
    ).toMatchObject({
      kind: "unavailable",
      snapshotId: snapshot.id,
      reason: "unconfigured-move",
      missingFields: ["power", "accuracy"],
    })
  })

  it("compiles exact item and branch inputs without names or float modifiers", () => {
    const outcome = compileScenario(scenario({ attackerItemId: 197 }))
    expect(outcome.kind).toBe("calculable")
    if (outcome.kind !== "calculable") return

    expect(outcome.calculation.low.normal).toMatchObject({
      power: 100,
      attackModifier: 6144,
      spreadModifier: 3072,
      stabModifier: 6144,
      typeEffectivenessModifier: 8192,
      finalModifier: 4096,
    })
    expect(outcome.moveMechanics).toMatchObject({
      basePower: 100,
      effectivePower: 225,
      accuracy: 100,
      modifiers: { item: 4096, spread: 3072, stab: 6144 },
    })
    expect(outcome.sources).toEqual([
      { track: "attacker-stage", optionId: "0", state: "neutral" },
      { track: "held-item", optionId: "197", state: "effective" },
      { track: "attacker-ability", optionId: "8", state: "unsupported" },
      { track: "weather", optionId: "none", state: "neutral" },
      { track: "terrain", optionId: "none", state: "neutral" },
      { track: "defender-stage", optionId: "0", state: "neutral" },
      { track: "defender-ability", optionId: "22", state: "unsupported" },
      { track: "screen", optionId: "none", state: "neutral" },
    ])
  })

  describe("frozen held-item effects", () => {
    it("places Base Power, battle-stat, and final-damage effects in distinct phases", () => {
      const muscleBand = calculableScenario({ attackerItemId: 243 })
      const choiceBand = calculableScenario({ attackerItemId: 197 })
      const lifeOrbAndShuca = calculableScenario({
        attackerItemId: 247,
        defenderItemId: 168,
      })

      expect(muscleBand.calculation.low.normal).toMatchObject({
        basePowerModifier: 4505,
        attackModifier: 4096,
        finalModifier: 4096,
      })
      expect(muscleBand.moveMechanics.modifiers.item).toBe(4505)
      expect(choiceBand.calculation.low.normal).toMatchObject({
        basePowerModifier: 4096,
        attackModifier: 6144,
        finalModifier: 4096,
      })
      expect(choiceBand.moveMechanics.modifiers.item).toBe(4096)
      expect(lifeOrbAndShuca.calculation.low.normal?.finalModifier).toBe(2662)
      expect(heldItemSource(lifeOrbAndShuca)).toMatchObject({ optionId: "247", state: "effective" })
      expect(heldItemSource(lifeOrbAndShuca, "defender-held-item")).toMatchObject({
        optionId: "168",
        state: "effective",
      })
    })

    it("evaluates category, type, effectiveness, and holder gates from the current Scenario", () => {
      const wrongCategory = calculableScenario({ attackerItemId: 274 })
      const wrongType = calculableScenario({ attackerItemId: 226 })
      const lightBall = calculableScenario({ attackerId: 25, attackerItemId: 213 })
      const ineligibleLightBall = calculableScenario({ attackerItemId: 213 })
      const lustrousOrb = calculableScenario({
        attackerId: 484,
        attackerItemId: 113,
        snapshot: {
          ...snapshot,
          id: "palkia-crabhammer",
          moveId: 152,
          spreadEligible: false,
          spread: false,
        },
      })

      expect(wrongCategory.calculation.low.normal?.attackModifier).toBe(4096)
      expect(heldItemSource(wrongCategory)?.state).toBe("inactive")
      expect(wrongType.calculation.low.normal?.basePowerModifier).toBe(4096)
      expect(heldItemSource(wrongType)?.state).toBe("inactive")
      expect(lightBall.calculation.low.normal?.attackModifier).toBe(8192)
      expect(ineligibleLightBall.calculation.low.normal?.attackModifier).toBe(4096)
      expect(heldItemSource(ineligibleLightBall)?.state).toBe("inactive")
      expect(lustrousOrb.calculation.low.normal?.basePowerModifier).toBe(4915)
    })

    it("compiles defender battle-stat gates, including per-identity Eviolite eligibility", () => {
      const specialSnapshot = {
        ...snapshot,
        id: "thunder-defense-items",
        moveId: 87,
        power: 110,
        accuracy: 70,
        spreadEligible: false,
        spread: false,
      }
      const deepSeaScale = calculableScenario({
        defenderId: 366,
        defenderItemId: 204,
        snapshot: specialSnapshot,
      })
      const assaultVest = calculableScenario({
        defenderItemId: 683,
        snapshot: specialSnapshot,
      })
      const eviolite = calculableScenario({ defenderId: 112, defenderItemId: 581 })
      const ineligibleEviolite = calculableScenario({ defenderId: 464, defenderItemId: 581 })

      expect(deepSeaScale.calculation.low.normal?.defenseModifier).toBe(8192)
      expect(assaultVest.calculation.low.normal?.defenseModifier).toBe(6144)
      expect(eviolite.calculation.low.normal?.defenseModifier).toBe(6144)
      expect(ineligibleEviolite.calculation.low.normal?.defenseModifier).toBe(4096)
      expect(heldItemSource(ineligibleEviolite, "defender-held-item")?.state).toBe("inactive")
    })

    it("applies Chilan without a super-effective gate and requires it for other Berries", () => {
      const tackleSnapshot = {
        ...snapshot,
        id: "neutral-tackle",
        moveId: 33,
        power: 40,
        spreadEligible: false,
        spread: false,
      }
      const chilan = calculableScenario({
        defenderItemId: 177,
        snapshot: tackleSnapshot,
      })
      const nonMatchingBerry = calculableScenario({
        defenderItemId: 168,
        snapshot: tackleSnapshot,
      })

      expect(chilan.calculation.low.normal?.finalModifier).toBe(2048)
      expect(heldItemSource(chilan, "defender-held-item")?.state).toBe("effective")
      expect(nonMatchingBerry.calculation.low.normal?.finalModifier).toBe(4096)
      expect(heldItemSource(nonMatchingBerry, "defender-held-item")?.state).toBe("inactive")
    })

    it("activates a Mask only for its locked attacking identity", () => {
      const eligible = calculableScenario({ attackerId: 10273, attackerItemId: 2106 })
      const wrongIdentity = calculableScenario({ attackerItemId: 2106 })
      const defenderMask = calculableScenario({ defenderId: 10273, defenderItemId: 2106 })

      expect(eligible.calculation.low.normal?.basePowerModifier).toBe(4915)
      expect(heldItemSource(eligible)?.state).toBe("effective")
      expect(wrongIdentity.calculation.low.normal?.basePowerModifier).toBe(4096)
      expect(heldItemSource(wrongIdentity)?.state).toBe("inactive")
      expect(heldItemSource(defenderMask, "defender-held-item")?.state).toBe("inactive")
    })

    it("chains both sides' numeric accuracy before normalization", () => {
      const outcome = calculableScenario({
        attackerItemId: 242,
        defenderItemId: 190,
        probabilityMode: "battle-odds",
        snapshot: { ...snapshot, accuracy: 90 },
      })

      expect(outcome.moveMechanics.accuracy).toBe(89)
      expect(outcome.probability.hitProbability).toBe(0.89)
      expect(heldItemSource(outcome)).toMatchObject({ optionId: "242", state: "effective" })
      expect(heldItemSource(outcome, "defender-held-item")).toMatchObject({
        optionId: "190",
        state: "effective",
      })
    })

    it("marks accuracy contributions hidden by normalization, mode, or a later override inactive", () => {
      const normalized = calculableScenario({
        attackerItemId: 242,
        probabilityMode: "battle-odds",
      })
      const rolls = calculableScenario({
        attackerItemId: 242,
        probabilityMode: "classic",
        snapshot: { ...snapshot, accuracy: 90 },
      })
      const rainOverride = calculableScenario({
        attackerItemId: 242,
        defenderItemId: 190,
        probabilityMode: "battle-odds",
        weather: "rain",
        snapshot: {
          ...snapshot,
          id: "rain-thunder-items",
          moveId: 87,
          power: 110,
          accuracy: 70,
          spreadEligible: false,
          spread: false,
        },
      })

      expect(normalized.moveMechanics.accuracy).toBe(100)
      expect(normalized.probability.hitProbability).toBe(1)
      expect(heldItemSource(normalized)?.state).toBe("inactive")
      expect(heldItemSource(rolls)?.state).toBe("inactive")
      expect(rainOverride.moveMechanics.accuracy).toBe("always-hits")
      expect(heldItemSource(rainOverride)?.state).toBe("inactive")
      expect(heldItemSource(rainOverride, "defender-held-item")?.state).toBe("inactive")
    })

    it("uses the derived capped Critical stage for probability, branches, stages, and Screens", () => {
      const guaranteed = calculableScenario({
        attackerId: 865,
        attackerItemId: 236,
        attackerStage: -1,
        defenderStage: 1,
        screen: "reflect",
        snapshot: {
          ...snapshot,
          id: "sirfetchd-leek",
          moveId: 370,
          power: 120,
          criticalStage: 1,
          spreadEligible: false,
          spread: false,
        },
      })
      const randomOnly = calculableScenario({
        attackerItemId: 209,
        probabilityMode: "classic",
      })
      const battleOdds = calculableScenario({
        attackerItemId: 209,
        probabilityMode: "battle-odds",
      })
      const capped = calculableScenario({
        attackerItemId: 209,
        probabilityMode: "battle-odds",
        snapshot: { ...snapshot, criticalStage: 3 },
      })

      expect(guaranteed.calculation.low.normal).toBeUndefined()
      expect(guaranteed.calculation.low.critical).toMatchObject({
        attackStage: 0,
        defenseStage: 0,
        finalModifier: 4096,
      })
      expect(guaranteed.probability.criticalHitProbability).toBe(1)
      expect(heldItemSource(guaranteed)?.state).toBe("effective")
      expect(guaranteed.sources.find((source) => source.track === "screen")?.state).toBe("inactive")
      expect(randomOnly.probability.criticalHitProbability).toBe(0)
      expect(heldItemSource(randomOnly)?.state).toBe("inactive")
      expect(battleOdds.probability.criticalHitProbability).toBe(1 / 8)
      expect(heldItemSource(battleOdds)?.state).toBe("effective")
      expect(heldItemSource(capped)?.state).toBe("inactive")
    })

    it("suppresses only ordinary defender-relative Weather damage for Utility Umbrella", () => {
      const waterSnapshot = {
        ...snapshot,
        id: "rain-crabhammer-umbrella",
        moveId: 152,
        spreadEligible: false,
        spread: false,
      }
      const ordinary = calculableScenario({
        defenderItemId: 1181,
        weather: "rain",
        snapshot: waterSnapshot,
      })
      const unaffected = calculableScenario({
        defenderItemId: 1181,
        weather: "rain",
      })
      const hydroSteam = calculableScenario({
        defenderItemId: 1181,
        weather: "sun",
        snapshot: {
          ...snapshot,
          id: "sun-hydro-steam-umbrella",
          moveId: 876,
          power: 80,
          accuracy: 100,
          spreadEligible: false,
          spread: false,
        },
      })

      expect(ordinary.calculation.low.normal?.weatherModifier).toBe(4096)
      expect(heldItemSource(ordinary, "defender-held-item")?.state).toBe("effective")
      expect(unaffected.calculation.low.normal?.weatherModifier).toBe(4096)
      expect(heldItemSource(unaffected, "defender-held-item")?.state).toBe("inactive")
      expect(hydroSteam.calculation.low.normal?.weatherModifier).toBe(6144)
      expect(heldItemSource(hydroSteam, "defender-held-item")?.state).toBe("inactive")
    })
  })

  it("compiles exact Stat Values without deriving a setup", () => {
    const outcome = calculableScenario({
      lowOutcome: {
        offense: 186,
        defense: { hp: 170, def: 153 },
      },
    })

    expect(outcome.calculation.low).toMatchObject({
      defenderHp: 170,
      normal: { attack: 186, defense: 153 },
      critical: { attack: 186, defense: 153 },
    })
  })

  it("reports zero final power against a type immunity", () => {
    expect(calculableScenario({ defenderId: 6 }).moveMechanics.effectivePower).toBe(0)
  })

  it("shares weather accuracy between mechanics and Battle Odds Mode", () => {
    const rain = calculableScenario({
      probabilityMode: "battle-odds",
      weather: "rain",
      snapshot: {
        ...snapshot,
        id: "thunder-rain",
        moveId: 87,
        power: 110,
        accuracy: 70,
        spreadEligible: false,
        spread: false,
      },
    })

    expect(rain.moveMechanics.accuracy).toBe("always-hits")
    expect(rain.probability.hitProbability).toBe(1)
  })

  it("compiles +3 as a critical-only branch in both probability modes", () => {
    for (const probabilityMode of ["classic", "battle-odds"] as const) {
      const outcome = compileScenario(scenario({
        probabilityMode,
        snapshot: { ...snapshot, criticalStage: 3, accuracy: 80 },
      }))
      expect(outcome.kind).toBe("calculable")
      if (outcome.kind !== "calculable") continue
      expect(outcome.calculation.low.normal).toBeUndefined()
      expect(outcome.calculation.low.critical?.criticalModifier).toBe(6144)
      expect(outcome.probability).toEqual({
        hitProbability: probabilityMode === "classic" ? 1 : 0.8,
        criticalHitProbability: 1,
      })
    }
  })

  it.each([
    [0, 1 / 24],
    [1, 1 / 8],
    [2, 1 / 2],
  ] as const)("compiles critical stage +%i to ordinary and critical branches", (criticalStage, probability) => {
    const outcome = compileScenario(scenario({
      probabilityMode: "battle-odds",
      snapshot: { ...snapshot, criticalStage },
    }))
    expect(outcome.kind).toBe("calculable")
    if (outcome.kind !== "calculable") return

    expect(outcome.calculation.low.normal?.criticalModifier).toBe(4096)
    expect(outcome.calculation.low.critical?.criticalModifier).toBe(6144)
    expect(outcome.probability.criticalHitProbability).toBe(probability)
  })

  it("offers every stage from -6 through +6", () => {
    expect(STAT_STAGES).toEqual([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6])
  })

  it.each([
    [-2, 2, 0, 0],
    [-2, -2, 0, -2],
    [2, 2, 2, 0],
    [2, -2, 2, -2],
  ] as const)(
    "suppresses critical stages for attacker %i and defender %i",
    (attackerStage, defenderStage, criticalAttackStage, criticalDefenseStage) => {
      const outcome = calculableScenario({ attackerStage, defenderStage })

      expect(outcome.calculation.low.normal).toMatchObject({
        attackStage: attackerStage,
        defenseStage: defenderStage,
      })
      expect(outcome.calculation.low.critical).toMatchObject({
        attackStage: criticalAttackStage,
        defenseStage: criticalDefenseStage,
      })
    },
  )

  it.each([
    [0, 0],
    [-6, 6],
    [6, -6],
  ] as const)("compiles stage endpoints %i/%i", (attackerStage, defenderStage) => {
    const outcome = calculableScenario({ attackerStage, defenderStage })

    expect(outcome.calculation.low.normal).toMatchObject({
      attackStage: attackerStage,
      defenseStage: defenderStage,
    })
  })

  it.each([
    ["classic", 0, 0],
    ["classic", 1, 0],
    ["classic", 2, 0],
    ["classic", 3, 1],
    ["battle-odds", 0, 1 / 24],
    ["battle-odds", 1, 1 / 8],
    ["battle-odds", 2, 1 / 2],
    ["battle-odds", 3, 1],
  ] as const)(
    "compiles %s probability at critical stage +%i",
    (probabilityMode, criticalStage, criticalHitProbability) => {
      const outcome = calculableScenario({
        probabilityMode,
        snapshot: { ...snapshot, criticalStage },
      })

      expect(outcome.probability.criticalHitProbability).toBe(criticalHitProbability)
      expect(outcome.calculation.low.normal === undefined).toBe(criticalStage === 3)
      expect(outcome.calculation.low.critical).toBeDefined()
    },
  )

  it.each([
    {
      label: "physical",
      attackerId: 445,
      attackerName: "Garchomp",
      defenderName: "Incineroar",
      moveId: 89,
      moveName: "Earthquake",
      power: 100,
      spread: true,
      attackerStage: -6,
      defenderStage: 6,
    },
    {
      label: "special",
      attackerId: 987,
      attackerName: "Flutter Mane",
      defenderName: "Incineroar",
      moveId: 585,
      moveName: "Moonblast",
      power: 95,
      spread: false,
      attackerStage: 6,
      defenderStage: -6,
    },
  ] as const)("matches @smogon/calc $label staged rolls", (testCase) => {
    const category = testCase.label
    const offense = getAttackerStatSetups(category)["neutral-max"]
    const defense = getDefenderSetups(category)["standard-bulk"]
    const compiled = compileScenario(scenario({
      attackerId: testCase.attackerId,
      attackerStage: testCase.attackerStage as StatStage,
      defenderStage: testCase.defenderStage as StatStage,
      snapshot: {
        ...snapshot,
        id: `${testCase.label}-stage-oracle`,
        moveId: testCase.moveId,
        power: testCase.power,
        spreadEligible: testCase.spread,
        spread: testCase.spread,
      },
      lowOutcome: exactPoint(
        testCase.attackerName,
        "Incineroar",
        category,
        offense,
        defense,
      ),
    }))
    if (compiled.kind !== "calculable") {
      throw new Error(`Expected calculable, got ${compiled.reason}`)
    }

    const attacker = new Pokemon(CALC_GEN, testCase.attackerName, {
      level: VGC_LEVEL,
      nature: offense.nature,
      evs: offense.evs,
      boosts: {
        [category === "physical" ? "atk" : "spa"]: testCase.attackerStage,
      },
    })
    const defender = new Pokemon(CALC_GEN, testCase.defenderName, {
      level: VGC_LEVEL,
      nature: defense.nature,
      evs: defense.evs,
      boosts: {
        [category === "physical" ? "def" : "spd"]: testCase.defenderStage,
      },
    })
    const field = new Field({ gameType: "Doubles" })
    const result = calculateDamageRolls(compiled.calculation).low

    expect(result.normal).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, testCase.moveName),
        field,
      ).damage,
    )
    expect(result.critical).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, testCase.moveName, { isCrit: true }),
        field,
      ).damage,
    )
  })

  it("keeps ineffective type-boost provenance while compiling a neutral phase", () => {
    const outcome = compileScenario(scenario({ attackerItemId: 226 }))
    expect(outcome.kind).toBe("calculable")
    if (outcome.kind !== "calculable") return

    expect(outcome.calculation.low.normal?.basePowerModifier).toBe(4096)
    expect(outcome.sources).toEqual([
      { track: "attacker-stage", optionId: "0", state: "neutral" },
      { track: "held-item", optionId: "226", state: "inactive" },
      { track: "attacker-ability", optionId: "8", state: "unsupported" },
      { track: "weather", optionId: "none", state: "neutral" },
      { track: "terrain", optionId: "none", state: "neutral" },
      { track: "defender-stage", optionId: "0", state: "neutral" },
      { track: "defender-ability", optionId: "22", state: "unsupported" },
      { track: "screen", optionId: "none", state: "neutral" },
    ])
  })

  it("uses reviewed attacker identity for type, STAB, effectiveness, items, and screen behavior", () => {
    const outcome = compileScenario(scenario({
      attackerId: 10251,
      defenderId: 812,
      attackerItemId: 226,
      snapshot: {
        ...snapshot,
        id: "raging-bull-blaze",
        moveId: 873,
        power: 90,
        spreadEligible: false,
        spread: false,
      },
    }))
    expect(outcome.kind).toBe("calculable")
    if (outcome.kind !== "calculable") return

    expect(outcome.move).toEqual({ type: "fire", breaksScreensBeforeDamage: true })
    expect(outcome.calculation.low.normal).toMatchObject({
      basePowerModifier: 4915,
      stabModifier: 6144,
      typeEffectivenessModifier: 8192,
    })
  })

  it("refuses a manually constructed snapshot for an excluded move", () => {
    expect(compileScenario(scenario({
      snapshot: { ...snapshot, id: "psyshock", moveId: 473, power: 80 },
    }))).toMatchObject({
      kind: "unavailable",
      snapshotId: "psyshock",
      reason: "unsupported-move",
    })
  })

  it("refuses edited power on an unreviewed null-power move", () => {
    expect(compileScenario(scenario({
      snapshot: { ...snapshot, id: "counter", moveId: 68, power: 100 },
    }))).toMatchObject({
      kind: "unavailable",
      snapshotId: "counter",
      reason: "unsupported-move",
    })
  })

  it("compiles a reviewed null-power move after its snapshot is configured", () => {
    const outcome = compileScenario(scenario({
      snapshot: { ...snapshot, id: "gyro-ball", moveId: 360, power: 120 },
    }))
    expect(outcome.kind).toBe("calculable")
    if (outcome.kind !== "calculable") return

    expect(outcome.calculation.low.normal?.power).toBe(120)
    expect(outcome.move.type).toBe("steel")
  })

  describe("calculation identity", () => {
    it("ignores source option ids and provenance", () => {
      const outcome = calculableScenario()

      expect(calculationIdentity({
        ...outcome,
        sources: [
          { track: "held-item", optionId: "another-raw-choice", state: "unsupported" },
        ],
      })).toBe(calculationIdentity(outcome))
    })

    it("includes snapshot, probability, KO, HP, branches, and every compiled branch field", () => {
      const outcome = calculableScenario()
      const identity = calculationIdentity(outcome)

      expect(calculationIdentity({ ...outcome, snapshotId: "another-snapshot" })).not.toBe(identity)

      for (const field of Object.keys(outcome.calculation.low.normal!) as Array<keyof DamageFormulaBranch>) {
        const variant = structuredClone(outcome)
        variant.calculation.low.normal![field] += 1
        expect(calculationIdentity(variant), field).not.toBe(identity)
      }

      for (const field of ["hitProbability", "criticalHitProbability"] as const) {
        const variant = structuredClone(outcome)
        variant.probability[field] += 0.01
        expect(calculationIdentity(variant), field).not.toBe(identity)
      }

      const koVariant = structuredClone(outcome)
      ;(koVariant.ko.hitCounts as unknown as number[])[1] = 3
      expect(calculationIdentity(koVariant)).not.toBe(identity)

      const hpVariant = structuredClone(outcome)
      hpVariant.calculation.low.defenderHp += 1
      expect(calculationIdentity(hpVariant)).not.toBe(identity)

      const noNormal = structuredClone(outcome)
      delete noNormal.calculation.low.normal
      expect(calculationIdentity(noNormal)).not.toBe(identity)

      const noCritical = structuredClone(outcome)
      delete noCritical.calculation.low.critical
      expect(calculationIdentity(noCritical)).not.toBe(identity)
    })

    it("includes the concrete low and high Range endpoint inputs", () => {
      const outcome = calculableScenario({
        highOutcome: {
          offense: offenseStatValue(
            "Garchomp",
            "physical",
            ATTACKER_STAT_SETUPS.extreme,
          ),
          defense: defenderStatValues(
            "Incineroar",
            "physical",
            DEFENDER_SETUPS["min-bulk"],
          ),
        },
      })
      const identity = calculationIdentity(outcome)

      const changedHighHp = structuredClone(outcome)
      changedHighHp.calculation.high!.defenderHp += 1
      expect(calculationIdentity(changedHighHp)).not.toBe(identity)

      const changedHighBranch = structuredClone(outcome)
      changedHighBranch.calculation.high!.normal!.attack += 1
      expect(calculationIdentity(changedHighBranch)).not.toBe(identity)

      const swappedEndpoints = structuredClone(outcome)
      ;[swappedEndpoints.calculation.low, swappedEndpoints.calculation.high] = [
        swappedEndpoints.calculation.high!,
        swappedEndpoints.calculation.low,
      ]
      expect(calculationIdentity(swappedEndpoints)).not.toBe(identity)
    })

    it("does not merge distinct compiled inputs whose rounded rolls coincide", () => {
      const outcome = calculableScenario()
      const variant = structuredClone(outcome)
      variant.calculation.low.normal!.finalModifier += 1

      expect(calculateDamageRolls(variant.calculation)).toEqual(
        calculateDamageRolls(outcome.calculation),
      )
      expect(calculationIdentity(variant)).not.toBe(calculationIdentity(outcome))
    })
  })
})

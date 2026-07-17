import { beforeAll, describe, expect, it } from "vitest"

import { listResources } from "@/lib/resources"
import {
  type MoveSnapshot,
  normalizeSnapshotAccuracy,
  normalizeSnapshotPower,
} from "@/lib/move-snapshot"

import { calculateDamageRolls, type DamageFormulaBranch } from "./damage-kernel"
import { ATTACKER_STAT_SETUPS, DEFENDER_SETUPS } from "./presets"
import {
  calculationIdentity,
  type CalculableScenario,
  type RawScenario,
  compileScenario,
} from "./scenario-compiler"

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

function scenario(overrides: Partial<RawScenario> = {}): RawScenario {
  return {
    snapshot,
    attackerId: 445,
    defenderId: 727,
    attackerItemId: "none",
    probabilityMode: "rolls",
    lowOutcome: {
      offense: ATTACKER_STAT_SETUPS["neutral-max"],
      defense: DEFENDER_SETUPS["standard-bulk"],
    },
    ...overrides,
  }
}

function calculableScenario(overrides: Partial<RawScenario> = {}): CalculableScenario {
  const outcome = compileScenario(scenario(overrides))
  if (outcome.kind !== "calculable") throw new Error(`Expected calculable, got ${outcome.reason}`)
  return outcome
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
    const outcome = compileScenario(scenario({ attackerItemId: "choice-band" }))
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
    expect(outcome.sources).toEqual([
      { track: "held-item", optionId: "choice-band", state: "effective" },
    ])
  })

  it("compiles +3 as a critical-only branch in both probability modes", () => {
    for (const probabilityMode of ["rolls", "actual"] as const) {
      const outcome = compileScenario(scenario({
        probabilityMode,
        snapshot: { ...snapshot, criticalStage: 3, accuracy: 80 },
      }))
      expect(outcome.kind).toBe("calculable")
      if (outcome.kind !== "calculable") continue
      expect(outcome.calculation.low.normal).toBeUndefined()
      expect(outcome.calculation.low.critical?.criticalModifier).toBe(6144)
      expect(outcome.probability).toEqual({
        hitProbability: probabilityMode === "rolls" ? 1 : 0.8,
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
      probabilityMode: "actual",
      snapshot: { ...snapshot, criticalStage },
    }))
    expect(outcome.kind).toBe("calculable")
    if (outcome.kind !== "calculable") return

    expect(outcome.calculation.low.normal?.criticalModifier).toBe(4096)
    expect(outcome.calculation.low.critical?.criticalModifier).toBe(6144)
    expect(outcome.probability.criticalHitProbability).toBe(probability)
  })

  it("keeps ineffective type-boost provenance while compiling a neutral phase", () => {
    const outcome = compileScenario(scenario({ attackerItemId: "type-boost-fire" }))
    expect(outcome.kind).toBe("calculable")
    if (outcome.kind !== "calculable") return

    expect(outcome.calculation.low.normal?.basePowerModifier).toBe(4096)
    expect(outcome.sources).toEqual([
      { track: "held-item", optionId: "type-boost-fire", state: "inactive" },
    ])
  })

  it("uses reviewed attacker identity for type, STAB, effectiveness, items, and screen behavior", () => {
    const outcome = compileScenario(scenario({
      attackerId: 10251,
      defenderId: 812,
      attackerItemId: "type-boost-fire",
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

    it("includes the actual low and high Range endpoint inputs", () => {
      const outcome = calculableScenario({
        highOutcome: {
          offense: ATTACKER_STAT_SETUPS.extreme,
          defense: DEFENDER_SETUPS["min-bulk"],
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

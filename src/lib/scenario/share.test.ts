import { describe, expect, it } from "vitest"

import { NO_ABILITY_ID } from "@/lib/ability"
import { getCatalogShell } from "@/lib/catalog"
import { SUPPORTED_LOCALES } from "@/lib/i18n"
import { createMoveSnapshot } from "@/lib/move"

import {
  createScenarioSetupUrl,
  decodeScenarioSetupToken,
  defaultTrackState,
  encodeScenarioSetupToken,
  offensePresetsForState,
  defensePresetsForState,
  scenarioSetupFromTrackState,
  scenarioSetupTokenFromTrackState,
  trackStateFromScenarioSetup,
  type SharedScenarioSetup,
} from "."

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function base64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url")
}

function payloadWithCrc(bytes: Uint8Array): string {
  const payload = new Uint8Array(bytes.length + 4)
  payload.set(bytes)
  new DataView(payload.buffer).setUint32(bytes.length, crc32(bytes))
  return `2.${base64Url(payload)}`
}

function tokenBytes(token: string): Uint8Array {
  return Uint8Array.from(Buffer.from(token.slice(token.indexOf(".") + 1), "base64url"))
}

class TestWriter {
  private bits: number[] = []

  write(value: number, width: number) {
    for (let bit = width - 1; bit >= 0; bit -= 1) {
      this.bits.push((value >> bit) & 1)
    }
  }

  finish(): Uint8Array {
    const bytes = new Uint8Array(Math.ceil(this.bits.length / 8))
    this.bits.forEach((bit, index) => {
      bytes[index >> 3] |= bit << (7 - (index & 7))
    })
    return bytes
  }
}

function duplicateSetToken(): string {
  const writer = new TestWriter()
  writer.write(445, 14)
  writer.write(727, 14)
  writer.write(0, 1)
  writer.write(0, 6)
  writer.write(0, 1)
  writer.write(2, 7)
  writer.write(130, 9)
  writer.write(130, 9)
  writer.write(1 << 6, 13)
  writer.write(1, 6)
  writer.write(0, 12)
  writer.write(1, 3)
  writer.write(0, 14)
  writer.write(1, 5)
  writer.write(1, 5)
  writer.write(0, 1)
  writer.write(1, 7)
  writer.write(170, 9)
  writer.write(110, 9)
  writer.write(1 << 6, 13)
  writer.write(1, 6)
  writer.write(0, 12)
  writer.write(1, 3)
  writer.write(0, 14)
  writer.write(1, 2)
  writer.write(1, 1)
  return payloadWithCrc(writer.finish())
}

function escapedSetup(): SharedScenarioSetup {
  return {
    attackerId: 20_000,
    defenderId: 30_000,
    moveCategory: "physical",
    moveSnapshots: [{
      moveId: 40_000,
      power: 1_500,
      hitFact: { kind: "always-hit" },
      criticalStage: 3,
      spread: false,
    }],
    offenseStat: { mode: "range", values: [700] },
    attackerStages: [0],
    attackerItems: [5_000],
    attackerAbilities: [20_000],
    weathers: ["none"],
    terrains: ["none"],
    defenseStat: { mode: "range", values: [{ hp: 700, def: 800 }] },
    defenderStages: [0],
    defenderItems: [6_000],
    defenderAbilities: [30_000],
    screens: ["none"],
  }
}

describe("Scenario Setup sharing", () => {
  it("round trips selected semantics, interior Range points, and duplicate Moves", async () => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const state = defaultTrackState(catalog)
    const earthquake = catalog.moves.find((move) => move.id === 89)
    if (!earthquake) throw new Error("Earthquake is required by this fixture")
    state.moveSnapshots = [
      createMoveSnapshot(earthquake, "first"),
      createMoveSnapshot(earthquake, "second"),
    ]
    state.selectedMoveSnapshotIds = ["second", "first"]
    state.statMode = "range"
    state.offensePresetIds = offensePresetsForState(catalog, state).map((preset) => preset.id)
    state.defenderMode = "range"
    state.defensePresetIds = defensePresetsForState(catalog, state).map((preset) => preset.id)

    const encoded = scenarioSetupTokenFromTrackState(catalog, state)
    expect(encoded.ok).toBe(true)
    if (!encoded.ok) return
    const decoded = decodeScenarioSetupToken(encoded.value)
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(decoded.value).not.toHaveProperty("probabilityMode")
    expect(decoded.value.moveSnapshots).toHaveLength(2)
    expect(decoded.value.moveSnapshots[0]).toEqual(decoded.value.moveSnapshots[1])
    expect(decoded.value.offenseStat.values).toHaveLength(3)
    expect(decoded.value.defenseStat.values).toHaveLength(3)

    const restored = trackStateFromScenarioSetup(decoded.value, catalog)
    expect(restored.ok).toBe(true)
    if (!restored.ok) return
    expect(restored.value.selectedMoveSnapshotIds).toHaveLength(2)
    expect(new Set(restored.value.selectedMoveSnapshotIds).size).toBe(2)
    expect(scenarioSetupTokenFromTrackState(catalog, restored.value)).toEqual(encoded)
  })

  it("round trips a valid zero-Move setup", async () => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const state = defaultTrackState(catalog)
    state.moveSnapshots = []
    state.selectedMoveSnapshotIds = []

    const setup = scenarioSetupFromTrackState(catalog, state)
    expect(setup.ok && setup.value.moveSnapshots).toEqual([])
    if (!setup.ok) return
    const restored = trackStateFromScenarioSetup(setup.value, catalog)
    expect(restored.ok && restored.value.selectedMoveSnapshotIds).toEqual([])
  })

  it("uses escape varuints without truncating growing identities and values", () => {
    const encoded = encodeScenarioSetupToken(escapedSetup())
    expect(encoded.ok).toBe(true)
    if (!encoded.ok) return
    expect(decodeScenarioSetupToken(encoded.value)).toEqual({ ok: true, value: escapedSetup() })
  })

  it("is deterministic for set order and locale", async () => {
    const catalogs = await Promise.all(
      SUPPORTED_LOCALES.map((locale) =>
        getCatalogShell(445, 727, locale, "physical")),
    )
    const tokens = catalogs.map((catalog, index) => {
      const state = defaultTrackState(catalog)
      state.attackerStages = index % 2 === 0 ? [1, 0] : [0, 1]
      return scenarioSetupTokenFromTrackState(catalog, state)
    })
    expect(new Set(tokens.map((token) => JSON.stringify(token))).size).toBe(1)
  })

  it("rejects checksum damage, truncation, trailing bytes, duplicates, and old versions", () => {
    const encoded = encodeScenarioSetupToken(escapedSetup())
    if (!encoded.ok) throw new Error("fixture must encode")
    const damaged = `${encoded.value.slice(0, -1)}${encoded.value.endsWith("A") ? "B" : "A"}`
    expect(decodeScenarioSetupToken(damaged)).toMatchObject({
      ok: false,
      failures: [{ stage: "checksum", code: "checksum-mismatch" }],
    })

    const all = tokenBytes(encoded.value)
    const semantic = all.slice(0, -4)
    expect(decodeScenarioSetupToken(payloadWithCrc(semantic.slice(0, -1)))).toMatchObject({
      ok: false,
      failures: [{ stage: "decode", code: "truncated" }],
    })
    expect(decodeScenarioSetupToken(payloadWithCrc(Uint8Array.from([...semantic, 0])))).toMatchObject({
      ok: false,
      failures: [{ stage: "canonical", code: "trailing-bits" }],
    })
    expect(decodeScenarioSetupToken(duplicateSetToken())).toMatchObject({
      ok: false,
      failures: [{ stage: "canonical", code: "noncanonical-set" }],
    })
    expect(decodeScenarioSetupToken(encoded.value.replace(/^2\./u, "0."))).toMatchObject({
      ok: false,
      failures: [{ stage: "version", code: "unsupported-version" }],
    })
  })

  it("returns every known domain failure without applying partial state", async () => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const state = defaultTrackState(catalog)
    const setup = scenarioSetupFromTrackState(catalog, state)
    if (!setup.ok) throw new Error("fixture must export")
    setup.value.attackerAbilities = [99_999]
    setup.value.defenderItems = [99_998]
    const restored = trackStateFromScenarioSetup(setup.value, catalog)
    expect(restored.ok).toBe(false)
    if (restored.ok) return
    expect(restored.failures.map((entry) => entry.code)).toEqual([
      "unknown-item",
      "unknown-ability",
    ])
  })

  it.each([20, 99])("validates legacy native multi-hit power %i without migrating it", async (power) => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const state = defaultTrackState(catalog)
    const snapshot = createMoveSnapshot({ id: 813, power: 20, accuracy: 90, isSpread: false }, "axel")
    state.moveSnapshots = [{ ...snapshot, power }]
    state.selectedMoveSnapshotIds = [snapshot.id]
    const setup = scenarioSetupFromTrackState(catalog, state)
    if (!setup.ok) throw new Error("fixture must export")
    const token = encodeScenarioSetupToken(setup.value)
    if (!token.ok) throw new Error("fixture must encode")
    const decoded = decodeScenarioSetupToken(token.value)
    if (!decoded.ok) throw new Error("fixture must decode")
    const restored = trackStateFromScenarioSetup(decoded.value, catalog)
    if (power === 20) expect(restored.ok).toBe(true)
    else expect(restored).toMatchObject({
      ok: false,
      failures: [{ code: "fixed-multi-hit-power" }],
    })
  })

  it("creates a canonical URL without unrelated query or fragment state", async () => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const state = defaultTrackState(catalog)
    state.attackerAbilityIds = [NO_ABILITY_ID]
    const result = createScenarioSetupUrl(
      "https://example.test/app?prototype=results&perf=1#damage-results",
      catalog,
      state,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const url = new URL(result.value)
    expect([...url.searchParams.keys()]).toEqual(["s"])
    expect(url.hash).toBe("")
    expect(result.value.length).toBeLessThanOrEqual(1_800)
  })
})

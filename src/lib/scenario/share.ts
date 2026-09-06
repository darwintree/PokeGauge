import { NO_ABILITY_ID } from "@/lib/ability"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  SCREENS,
  STAT_STAGES,
  TERRAINS,
  WEATHERS,
  type Screen,
  type StatStage,
  type Terrain,
  type Weather,
} from "@/lib/damage-calculation"
import type { HeldItemId } from "@/lib/held-item"
import { createMoveSnapshot, moveCanBecomeSpread, movePowerIsCompatible, type CriticalStage } from "@/lib/move"
import {
  findPresetByDefenseValues,
  findPresetByOffenseValue,
  newTemporaryDefensePreset,
  newTemporaryOffensePreset,
  type StatPreset,
} from "@/lib/stat-preset"
import {
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
} from "@/lib/stat-calculation"

import { defaultTrackState, defensePresetsForState, mergeStagePool, offensePresetsForState } from "./state"
import type { TrackState } from "./types"

export const SCENARIO_SHARE_PARAM = "s"
export const SCENARIO_SHARE_VERSION = 2
export const PORTABLE_SHARE_URL_LIMIT = 1_800
export const SHARE_INPUT_LIMIT = 8_192

type HitFact =
  | { kind: "numeric"; accuracy: number }
  | { kind: "always-hit" }

export type SharedMoveSnapshot = {
  moveId: number
  power: number
  hitFact: HitFact
  criticalStage: CriticalStage
  spread: boolean
}

export type SharedScenarioSetup = {
  attackerId: number
  defenderId: number
  moveCategory: "physical" | "special"
  moveSnapshots: SharedMoveSnapshot[]
  offenseStat: { mode: "choice" | "range"; values: number[] }
  attackerStages: StatStage[]
  attackerItems: HeldItemId[]
  attackerAbilities: number[]
  weathers: Weather[]
  terrains: Terrain[]
  defenseStat: {
    mode: "choice" | "range"
    values: Array<{ hp: number; def: number }>
  }
  defenderStages: StatStage[]
  defenderItems: HeldItemId[]
  defenderAbilities: number[]
  screens: Screen[]
}

export type ScenarioShareFailure = {
  stage: "input" | "version" | "base64" | "checksum" | "decode" | "canonical" | "domain" | "length"
  code: string
  field?: string
}

export type ScenarioShareResult<T> =
  | { ok: true; value: T }
  | { ok: false; failures: ScenarioShareFailure[] }

export type ScenarioShareUrlState =
  | { kind: "none" }
  | { kind: "valid"; token: string; setup: SharedScenarioSetup }
  | { kind: "invalid"; failures: ScenarioShareFailure[] }

const ID_BITS = 14
const ITEM_BITS = 12
const MOVE_COUNT_BITS = 6
const STAT_COUNT_BITS = 7
const ITEM_COUNT_BITS = 6
const ABILITY_COUNT_BITS = 3
const STAT_BITS = 9

class BitWriter {
  private bytes: number[] = []
  private current = 0
  private used = 0

  write(value: number, width: number): void {
    if (!Number.isSafeInteger(value) || value < 0 || value >= 2 ** width) {
      throw new RangeError("value-out-of-range")
    }
    for (let bit = width - 1; bit >= 0; bit -= 1) {
      this.current = this.current * 2 + (Math.floor(value / 2 ** bit) & 1)
      this.used += 1
      if (this.used === 8) {
        this.bytes.push(this.current)
        this.current = 0
        this.used = 0
      }
    }
  }

  writeVarUint(value: number): void {
    if (!Number.isSafeInteger(value) || value < 0) throw new RangeError("invalid-varuint")
    let remaining = value
    do {
      const chunk = remaining % 128
      remaining = Math.floor(remaining / 128)
      this.write(remaining > 0 ? 1 : 0, 1)
      this.write(chunk, 7)
    } while (remaining > 0)
  }

  writeEscaped(value: number, width: number): void {
    const sentinel = 2 ** width - 1
    if (value < sentinel) this.write(value, width)
    else {
      this.write(sentinel, width)
      this.writeVarUint(value - sentinel)
    }
  }

  finish(): Uint8Array {
    if (this.used > 0) this.bytes.push(this.current * 2 ** (8 - this.used))
    return Uint8Array.from(this.bytes)
  }
}

class BitReader {
  offset = 0
  private readonly bytes: Uint8Array

  constructor(bytes: Uint8Array) {
    this.bytes = bytes
  }

  read(width: number): number {
    if (this.offset + width > this.bytes.length * 8) throw new RangeError("truncated")
    let value = 0
    for (let index = 0; index < width; index += 1) {
      const absolute = this.offset + index
      value = value * 2 + ((this.bytes[absolute >> 3] >> (7 - (absolute & 7))) & 1)
    }
    this.offset += width
    return value
  }

  readVarUint(): number {
    let value = 0
    let multiplier = 1
    for (let group = 0; group < 8; group += 1) {
      const more = this.read(1)
      const chunk = this.read(7)
      value += chunk * multiplier
      if (!Number.isSafeInteger(value)) throw new RangeError("varuint-overflow")
      if (more === 0) {
        if (group > 0 && chunk === 0) throw new RangeError("noncanonical-varuint")
        return value
      }
      multiplier *= 128
    }
    throw new RangeError("varuint-overflow")
  }

  readEscaped(width: number): number {
    const sentinel = 2 ** width - 1
    const value = this.read(width)
    return value === sentinel ? sentinel + this.readVarUint() : value
  }

  hasCanonicalPadding(): boolean {
    const remaining = this.bytes.length * 8 - this.offset
    if (remaining >= 8) return false
    while (this.offset < this.bytes.length * 8) {
      if (this.read(1) !== 0) return false
    }
    return true
  }
}

function itemCode(value: HeldItemId): number {
  if (value === "none") return 0
  if (value === "unknown-mega-stone") return 1
  return value + 2
}

function itemFromCode(value: number): HeldItemId {
  if (value === 0) return "none"
  if (value === 1) return "unknown-mega-stone"
  return value - 2
}

function abilityCode(value: number): number {
  return value === NO_ABILITY_ID ? 0 : value + 1
}

function abilityFromCode(value: number): number {
  return value === 0 ? NO_ABILITY_ID : value - 1
}

function compareMoves(a: SharedMoveSnapshot, b: SharedMoveSnapshot): number {
  const aHit = a.hitFact.kind === "always-hit" ? 101 : a.hitFact.accuracy
  const bHit = b.hitFact.kind === "always-hit" ? 101 : b.hitFact.accuracy
  return a.moveId - b.moveId || a.power - b.power || aHit - bHit ||
    a.criticalStage - b.criticalStage || Number(a.spread) - Number(b.spread)
}

function uniqueSorted<T>(values: readonly T[], code: (value: T) => number): T[] {
  return [...values]
    .sort((a, b) => code(a) - code(b))
    .filter((value, index, all) => index === 0 || code(value) !== code(all[index - 1]))
}

function canonicalize(setup: SharedScenarioSetup): SharedScenarioSetup {
  return {
    ...setup,
    moveSnapshots: [...setup.moveSnapshots].sort(compareMoves),
    offenseStat: {
      mode: setup.offenseStat.mode,
      values: uniqueSorted(setup.offenseStat.values, (value) => value),
    },
    attackerStages: uniqueSorted(setup.attackerStages, (value) => value),
    attackerItems: uniqueSorted(setup.attackerItems, itemCode),
    attackerAbilities: uniqueSorted(setup.attackerAbilities, abilityCode),
    weathers: WEATHERS.filter((value) => setup.weathers.includes(value)),
    terrains: TERRAINS.filter((value) => setup.terrains.includes(value)),
    defenseStat: {
      mode: setup.defenseStat.mode,
      values: [...setup.defenseStat.values]
        .sort((a, b) => a.hp - b.hp || a.def - b.def)
        .filter((value, index, all) =>
          index === 0 || value.hp !== all[index - 1].hp || value.def !== all[index - 1].def),
    },
    defenderStages: uniqueSorted(setup.defenderStages, (value) => value),
    defenderItems: uniqueSorted(setup.defenderItems, itemCode),
    defenderAbilities: uniqueSorted(setup.defenderAbilities, abilityCode),
    screens: SCREENS.filter((value) => setup.screens.includes(value)),
  }
}

function writeEscapedList<T>(
  writer: BitWriter,
  values: readonly T[],
  countBits: number,
  valueBits: number,
  code: (value: T) => number,
): void {
  writer.writeEscaped(values.length, countBits)
  for (const value of values) writer.writeEscaped(code(value), valueBits)
}

function readEscapedList<T>(
  reader: BitReader,
  countBits: number,
  valueBits: number,
  decode: (value: number) => T,
): T[] {
  const count = reader.readEscaped(countBits)
  if (count > 1_024) throw new RangeError("count-too-large")
  return Array.from({ length: count }, () => decode(reader.readEscaped(valueBits)))
}

function writeMask<T>(writer: BitWriter, values: readonly T[], options: readonly T[]): void {
  let mask = 0
  for (const value of values) {
    const index = options.indexOf(value)
    if (index < 0) throw new RangeError("unknown-enum")
    mask += 2 ** index
  }
  writer.write(mask, options.length)
}

function readMask<T>(reader: BitReader, options: readonly T[]): T[] {
  const mask = reader.read(options.length)
  return options.filter((_, index) => (mask & 2 ** index) !== 0)
}

function assertStrict<T>(values: readonly T[], code: (value: T) => number): void {
  for (let index = 1; index < values.length; index += 1) {
    if (code(values[index - 1]) >= code(values[index])) {
      throw new RangeError("noncanonical-set")
    }
  }
}

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

function withCrc(bytes: Uint8Array): Uint8Array {
  const result = new Uint8Array(bytes.length + 4)
  result.set(bytes)
  new DataView(result.buffer).setUint32(bytes.length, crc32(bytes))
  return result
}

function encodeBytes(input: SharedScenarioSetup): Uint8Array {
  const setup = canonicalize(input)
  const writer = new BitWriter()
  writer.writeEscaped(setup.attackerId, ID_BITS)
  writer.writeEscaped(setup.defenderId, ID_BITS)
  writer.write(setup.moveCategory === "special" ? 1 : 0, 1)
  writer.writeEscaped(setup.moveSnapshots.length, MOVE_COUNT_BITS)
  for (const move of setup.moveSnapshots) {
    writer.writeEscaped(move.moveId, ID_BITS)
    writer.writeEscaped(move.power, 10)
    writer.write(move.hitFact.kind === "always-hit" ? 101 : move.hitFact.accuracy, 7)
    writer.write(move.criticalStage, 2)
    writer.write(move.spread ? 1 : 0, 1)
  }
  writer.write(setup.offenseStat.mode === "range" ? 1 : 0, 1)
  writeEscapedList(writer, setup.offenseStat.values, STAT_COUNT_BITS, STAT_BITS, (v) => v)
  writeMask(writer, setup.attackerStages, STAT_STAGES)
  writeEscapedList(writer, setup.attackerItems, ITEM_COUNT_BITS, ITEM_BITS, itemCode)
  writeEscapedList(writer, setup.attackerAbilities, ABILITY_COUNT_BITS, ID_BITS, abilityCode)
  writeMask(writer, setup.weathers, WEATHERS)
  writeMask(writer, setup.terrains, TERRAINS)
  writer.write(setup.defenseStat.mode === "range" ? 1 : 0, 1)
  writer.writeEscaped(setup.defenseStat.values.length, STAT_COUNT_BITS)
  for (const value of setup.defenseStat.values) {
    writer.writeEscaped(value.hp, STAT_BITS)
    writer.writeEscaped(value.def, STAT_BITS)
  }
  writeMask(writer, setup.defenderStages, STAT_STAGES)
  writeEscapedList(writer, setup.defenderItems, ITEM_COUNT_BITS, ITEM_BITS, itemCode)
  writeEscapedList(writer, setup.defenderAbilities, ABILITY_COUNT_BITS, ID_BITS, abilityCode)
  writeMask(writer, setup.screens, SCREENS)
  // v2 keeps its legacy probability bit so existing decoders remain compatible.
  writer.write(1, 1)
  return withCrc(writer.finish())
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "")
}

function fromBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/u.test(value) || value.length % 4 === 1) {
    throw new RangeError("invalid-base64url")
  }
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") +
    "=".repeat((4 - value.length % 4) % 4)
  const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
  if (toBase64Url(bytes) !== value) throw new RangeError("noncanonical-base64url")
  return bytes
}

export function encodeScenarioSetupToken(setup: SharedScenarioSetup): ScenarioShareResult<string> {
  try {
    return { ok: true, value: `${SCENARIO_SHARE_VERSION}.${toBase64Url(encodeBytes(setup))}` }
  } catch {
    return { ok: false, failures: [{ stage: "domain", code: "unencodable-setup" }] }
  }
}

export function decodeScenarioSetupToken(token: string): ScenarioShareResult<SharedScenarioSetup> {
  if (token.length > SHARE_INPUT_LIMIT) {
    return { ok: false, failures: [{ stage: "input", code: "input-too-long" }] }
  }
  const separator = token.indexOf(".")
  if (separator < 1) {
    return { ok: false, failures: [{ stage: "version", code: "missing-version" }] }
  }
  if (token.slice(0, separator) !== String(SCENARIO_SHARE_VERSION)) {
    return { ok: false, failures: [{ stage: "version", code: "unsupported-version" }] }
  }

  let allBytes: Uint8Array
  try {
    allBytes = fromBase64Url(token.slice(separator + 1))
  } catch {
    return { ok: false, failures: [{ stage: "base64", code: "invalid-base64url" }] }
  }
  if (allBytes.length < 5) {
    return { ok: false, failures: [{ stage: "checksum", code: "missing-checksum" }] }
  }
  const bytes = allBytes.slice(0, -4)
  const expected = new DataView(allBytes.buffer, allBytes.byteOffset + bytes.length, 4).getUint32(0)
  if (crc32(bytes) !== expected) {
    return { ok: false, failures: [{ stage: "checksum", code: "checksum-mismatch" }] }
  }

  try {
    const reader = new BitReader(bytes)
    const setup: SharedScenarioSetup = {
      attackerId: reader.readEscaped(ID_BITS),
      defenderId: reader.readEscaped(ID_BITS),
      moveCategory: reader.read(1) === 1 ? "special" : "physical",
      moveSnapshots: [],
      offenseStat: { mode: "choice", values: [] },
      attackerStages: [],
      attackerItems: [],
      attackerAbilities: [],
      weathers: [],
      terrains: [],
      defenseStat: { mode: "choice", values: [] },
      defenderStages: [],
      defenderItems: [],
      defenderAbilities: [],
      screens: [],
    }
    const moveCount = reader.readEscaped(MOVE_COUNT_BITS)
    if (moveCount > 1_024) throw new RangeError("count-too-large")
    for (let index = 0; index < moveCount; index += 1) {
      const moveId = reader.readEscaped(ID_BITS)
      const power = reader.readEscaped(10)
      const hit = (() => {
        const value = reader.read(7)
        if (value > 101) throw new RangeError("invalid-hit-fact")
        return value === 101
          ? { kind: "always-hit" as const }
          : { kind: "numeric" as const, accuracy: value }
      })()
      setup.moveSnapshots.push({
        moveId,
        power,
        hitFact: hit,
        criticalStage: reader.read(2) as CriticalStage,
        spread: reader.read(1) === 1,
      })
    }
    for (let index = 1; index < setup.moveSnapshots.length; index += 1) {
      if (compareMoves(setup.moveSnapshots[index - 1], setup.moveSnapshots[index]) > 0) {
        throw new RangeError("noncanonical-moves")
      }
    }
    setup.offenseStat = {
      mode: reader.read(1) === 1 ? "range" : "choice",
      values: readEscapedList(reader, STAT_COUNT_BITS, STAT_BITS, (value) => value),
    }
    assertStrict(setup.offenseStat.values, (value) => value)
    setup.attackerStages = readMask(reader, STAT_STAGES)
    setup.attackerItems = readEscapedList(reader, ITEM_COUNT_BITS, ITEM_BITS, itemFromCode)
    assertStrict(setup.attackerItems, itemCode)
    setup.attackerAbilities = readEscapedList(reader, ABILITY_COUNT_BITS, ID_BITS, abilityFromCode)
    assertStrict(setup.attackerAbilities, abilityCode)
    setup.weathers = readMask(reader, WEATHERS)
    setup.terrains = readMask(reader, TERRAINS)
    setup.defenseStat.mode = reader.read(1) === 1 ? "range" : "choice"
    const defenseCount = reader.readEscaped(STAT_COUNT_BITS)
    if (defenseCount > 1_024) throw new RangeError("count-too-large")
    setup.defenseStat.values = Array.from({ length: defenseCount }, () => ({
      hp: reader.readEscaped(STAT_BITS),
      def: reader.readEscaped(STAT_BITS),
    }))
    for (let index = 1; index < setup.defenseStat.values.length; index += 1) {
      const previous = setup.defenseStat.values[index - 1]
      const current = setup.defenseStat.values[index]
      if (previous.hp > current.hp || previous.hp === current.hp && previous.def >= current.def) {
        throw new RangeError("noncanonical-set")
      }
    }
    setup.defenderStages = readMask(reader, STAT_STAGES)
    setup.defenderItems = readEscapedList(reader, ITEM_COUNT_BITS, ITEM_BITS, itemFromCode)
    assertStrict(setup.defenderItems, itemCode)
    setup.defenderAbilities = readEscapedList(reader, ABILITY_COUNT_BITS, ID_BITS, abilityFromCode)
    assertStrict(setup.defenderAbilities, abilityCode)
    setup.screens = readMask(reader, SCREENS)
    reader.read(1)
    if (!reader.hasCanonicalPadding()) throw new RangeError("trailing-bits")
    return { ok: true, value: setup }
  } catch (error) {
    const code = error instanceof RangeError ? error.message : "invalid-payload"
    return {
      ok: false,
      failures: [{
        stage: code.startsWith("noncanonical") || code === "trailing-bits" ? "canonical" : "decode",
        code,
      }],
    }
  }
}

export function readScenarioSetupUrl(url: string): ScenarioShareUrlState {
  if (url.length > SHARE_INPUT_LIMIT) {
    return { kind: "invalid", failures: [{ stage: "input", code: "input-too-long" }] }
  }
  let token: string | null
  try {
    token = new URL(url).searchParams.get(SCENARIO_SHARE_PARAM)
  } catch {
    return { kind: "invalid", failures: [{ stage: "input", code: "invalid-url" }] }
  }
  if (token === null) return { kind: "none" }
  const decoded = decodeScenarioSetupToken(token)
  return decoded.ok
    ? { kind: "valid", token, setup: decoded.value }
    : { kind: "invalid", failures: decoded.failures }
}

function selectedPresets(
  presets: readonly StatPreset[],
  ids: readonly string[],
): StatPreset[] {
  const byId = new Map(presets.map((preset) => [preset.id, preset]))
  return ids.flatMap((id) => {
    const preset = byId.get(id)
    return preset ? [preset] : []
  })
}

export function scenarioSetupFromTrackState(
  catalog: MatchupCatalog,
  state: TrackState,
): ScenarioShareResult<SharedScenarioSetup> {
  const snapshots = new Map(state.moveSnapshots.map((snapshot) => [snapshot.id, snapshot]))
  const offense = selectedPresets(offensePresetsForState(catalog, state), state.offensePresetIds)
  const defense = selectedPresets(defensePresetsForState(catalog, state), state.defensePresetIds)
  const offenseValues = offense.flatMap((preset) =>
    preset.values.kind === "offense" ? [preset.values.stat] : [])
  const defenseValues = defense.flatMap((preset) =>
    preset.values.kind === "defense"
      ? [{ hp: preset.values.hp, def: preset.values.def }]
      : [])
  if (
    offenseValues.length !== state.offensePresetIds.length ||
    defenseValues.length !== state.defensePresetIds.length
  ) {
    return { ok: false, failures: [{ stage: "domain", code: "missing-stat-value" }] }
  }
  const moves = state.selectedMoveSnapshotIds.flatMap((id) => {
    const move = snapshots.get(id)
    return move ? [move] : []
  })
  if (moves.length !== state.selectedMoveSnapshotIds.length) {
    return { ok: false, failures: [{ stage: "domain", code: "missing-move-snapshot" }] }
  }
  return {
    ok: true,
    value: canonicalize({
      attackerId: catalog.matchup.attackerId,
      defenderId: catalog.matchup.defenderId,
      moveCategory: catalog.moveCategory,
      moveSnapshots: moves.map((move) => ({
        moveId: move.moveId,
        power: move.power,
        hitFact: move.alwaysHits
          ? { kind: "always-hit" }
          : { kind: "numeric", accuracy: move.accuracy },
        criticalStage: move.criticalStage,
        spread: move.spread,
      })),
      offenseStat: {
        mode: state.statMode === "range" ? "range" : "choice",
        values: offenseValues,
      },
      attackerStages: state.attackerStages,
      attackerItems: state.attackerItemIds,
      attackerAbilities: state.attackerAbilityIds,
      weathers: state.weathers,
      terrains: state.terrains,
      defenseStat: {
        mode: state.defenderMode === "range" ? "range" : "choice",
        values: defenseValues,
      },
      defenderStages: state.defenderStages,
      defenderItems: state.defenderItemIds,
      defenderAbilities: state.defenderAbilityIds,
      screens: state.screens,
    }),
  }
}

function failure(code: string, field: string): ScenarioShareFailure {
  return { stage: "domain", code, field }
}

function inBounds(value: number, bounds: { min: number; max: number }): boolean {
  return Number.isInteger(value) && value >= bounds.min && value <= bounds.max
}

export function trackStateFromScenarioSetup(
  setup: SharedScenarioSetup,
  catalog: MatchupCatalog,
): ScenarioShareResult<TrackState> {
  const failures: ScenarioShareFailure[] = []
  if (setup.attackerId !== catalog.matchup.attackerId) failures.push(failure("unknown-attacker", "attackerId"))
  if (setup.defenderId !== catalog.matchup.defenderId) failures.push(failure("unknown-defender", "defenderId"))
  if (setup.moveCategory !== catalog.moveCategory) failures.push(failure("wrong-move-side", "moveCategory"))

  const moves = new Map(catalog.moves.map((move) => [move.id, move]))
  setup.moveSnapshots.forEach((snapshot, index) => {
    const move = moves.get(snapshot.moveId)
    const field = `moveSnapshots.${index}`
    if (!move) failures.push(failure("unknown-move", `${field}.moveId`))
    if (!Number.isInteger(snapshot.power) || snapshot.power < 0 || snapshot.power > 1_000) {
      failures.push(failure("invalid-power", `${field}.power`))
    }
    if (!movePowerIsCompatible(snapshot.moveId, snapshot.power)) {
      failures.push(failure("fixed-multi-hit-power", `${field}.power`))
    }
    if (snapshot.hitFact.kind === "numeric" &&
      (!Number.isInteger(snapshot.hitFact.accuracy) || snapshot.hitFact.accuracy < 0 || snapshot.hitFact.accuracy > 100)) {
      failures.push(failure("invalid-accuracy", `${field}.hitFact`))
    }
    if (move && snapshot.spread && !(move.isSpread || moveCanBecomeSpread(move.id))) {
      failures.push(failure("invalid-spread", `${field}.spread`))
    }
  })

  const offenseBounds = getOffenseStatBounds(catalog.matchup.attackerCalcName, catalog.moveCategory)
  const hpBounds = getDefenderHpBounds(catalog.matchup.defenderCalcName)
  const defBounds = getDefenderDefBounds(catalog.matchup.defenderCalcName, catalog.moveCategory)
  if (setup.offenseStat.values.length === 0) failures.push(failure("empty-selection", "offenseStat.values"))
  setup.offenseStat.values.forEach((value, index) => {
    if (!inBounds(value, offenseBounds)) failures.push(failure("stat-out-of-range", `offenseStat.values.${index}`))
  })
  if (setup.defenseStat.values.length === 0) failures.push(failure("empty-selection", "defenseStat.values"))
  setup.defenseStat.values.forEach((value, index) => {
    if (!inBounds(value.hp, hpBounds)) failures.push(failure("stat-out-of-range", `defenseStat.values.${index}.hp`))
    if (!inBounds(value.def, defBounds)) failures.push(failure("stat-out-of-range", `defenseStat.values.${index}.def`))
  })

  const requiredSets: Array<[readonly unknown[], string]> = [
    [setup.attackerStages, "attackerStages"],
    [setup.attackerItems, "attackerItems"],
    [setup.attackerAbilities, "attackerAbilities"],
    [setup.weathers, "weathers"],
    [setup.terrains, "terrains"],
    [setup.defenderStages, "defenderStages"],
    [setup.defenderItems, "defenderItems"],
    [setup.defenderAbilities, "defenderAbilities"],
    [setup.screens, "screens"],
  ]
  for (const [values, field] of requiredSets) {
    if (values.length === 0) failures.push(failure("empty-selection", field))
  }
  const attackerItems = new Set(catalog.attackerItems.map((item) => item.id))
  const defenderItems = new Set(catalog.defenderItems.map((item) => item.id))
  const attackerAbilities = new Set(catalog.attackerAbilities.map((ability) => ability.id))
  const defenderAbilities = new Set(catalog.defenderAbilities.map((ability) => ability.id))
  setup.attackerItems.forEach((id, index) => {
    if (!attackerItems.has(id)) failures.push(failure("unknown-item", `attackerItems.${index}`))
  })
  setup.defenderItems.forEach((id, index) => {
    if (!defenderItems.has(id)) failures.push(failure("unknown-item", `defenderItems.${index}`))
  })
  setup.attackerAbilities.forEach((id, index) => {
    if (!attackerAbilities.has(id)) failures.push(failure("unknown-ability", `attackerAbilities.${index}`))
  })
  setup.defenderAbilities.forEach((id, index) => {
    if (!defenderAbilities.has(id)) failures.push(failure("unknown-ability", `defenderAbilities.${index}`))
  })
  if (catalog.attackerLockedItemId !== null &&
    (setup.attackerItems.length !== 1 || setup.attackerItems[0] !== catalog.attackerLockedItemId)) {
    failures.push(failure("item-lock-mismatch", "attackerItems"))
  }
  if (catalog.defenderLockedItemId !== null &&
    (setup.defenderItems.length !== 1 || setup.defenderItems[0] !== catalog.defenderLockedItemId)) {
    failures.push(failure("item-lock-mismatch", "defenderItems"))
  }
  if (failures.length > 0) return { ok: false, failures }

  const state = defaultTrackState(catalog)
  const offensePresets = offensePresetsForState(catalog, state)
  const offenseTemporary: StatPreset[] = []
  const offensePresetIds = setup.offenseStat.values.map((value) => {
    const existing = findPresetByOffenseValue(offensePresets, value)
    if (existing) return existing.id
    const created = newTemporaryOffensePreset(value)
    offenseTemporary.push(created)
    return created.id
  })
  const defensePresets = defensePresetsForState(catalog, state)
  const defenseTemporary: StatPreset[] = []
  const defensePresetIds = setup.defenseStat.values.map(({ hp, def }) => {
    const existing = findPresetByDefenseValues(defensePresets, hp, def)
    if (existing) return existing.id
    const created = newTemporaryDefensePreset(hp, def)
    defenseTemporary.push(created)
    return created.id
  })
  const moveSnapshots = setup.moveSnapshots.map((shared) => {
    const move = moves.get(shared.moveId)!
    const snapshot = createMoveSnapshot({
      ...move,
      power: shared.power,
      accuracy: shared.hitFact.kind === "always-hit" ? 100 : shared.hitFact.accuracy,
      alwaysHits: shared.hitFact.kind === "always-hit",
      criticalStage: shared.criticalStage,
    })
    return { ...snapshot, spread: snapshot.spreadEligible && shared.spread }
  })
  const offenseValues = setup.offenseStat.values
  const defenseValues = setup.defenseStat.values
  return {
    ok: true,
    value: {
      ...state,
      moveSnapshots,
      selectedMoveSnapshotIds: moveSnapshots.map((snapshot) => snapshot.id),
      statMode: setup.offenseStat.mode === "choice" ? "preset" : "range",
      offensePresetIds,
      offenseTemporaryPresets: offenseTemporary,
      statRange: { min: offenseValues[0], max: offenseValues.at(-1)! },
      attackerStages: setup.attackerStages,
      attackerStagePool: mergeStagePool([], setup.attackerStages),
      attackerItemPoolIds: setup.attackerItems,
      attackerItemIds: setup.attackerItems,
      attackerAbilityIds: setup.attackerAbilities,
      weatherPool: [...new Set(["none" as const, ...setup.weathers])],
      weathers: setup.weathers,
      terrainPool: [...new Set(["none" as const, ...setup.terrains])],
      terrains: setup.terrains,
      defenderMode: setup.defenseStat.mode === "choice" ? "preset" : "range",
      defensePresetIds,
      defenseTemporaryPresets: defenseTemporary,
      defenderRanges: {
        hp: { min: Math.min(...defenseValues.map((value) => value.hp)), max: Math.max(...defenseValues.map((value) => value.hp)) },
        def: { min: Math.min(...defenseValues.map((value) => value.def)), max: Math.max(...defenseValues.map((value) => value.def)) },
      },
      defenderStages: setup.defenderStages,
      defenderStagePool: mergeStagePool([], setup.defenderStages),
      defenderItemPoolIds: setup.defenderItems,
      defenderItemIds: setup.defenderItems,
      defenderAbilityIds: setup.defenderAbilities,
      screens: setup.screens,
    },
  }
}

export function scenarioSetupTokenFromTrackState(
  catalog: MatchupCatalog,
  state: TrackState,
): ScenarioShareResult<string> {
  const setup = scenarioSetupFromTrackState(catalog, state)
  return setup.ok ? encodeScenarioSetupToken(setup.value) : setup
}

export function createScenarioSetupUrl(
  baseUrl: string,
  catalog: MatchupCatalog,
  state: TrackState,
): ScenarioShareResult<string> {
  const token = scenarioSetupTokenFromTrackState(catalog, state)
  if (!token.ok) return token
  const url = new URL(baseUrl)
  url.search = ""
  url.hash = ""
  url.searchParams.set(SCENARIO_SHARE_PARAM, token.value)
  const value = url.toString()
  return value.length <= PORTABLE_SHARE_URL_LIMIT
    ? { ok: true, value }
    : { ok: false, failures: [{ stage: "length", code: "portable-url-too-long" }] }
}

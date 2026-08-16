import { envelopeRange, type StatRange } from "@/lib/stat-calculation"
import {
  defenseValuesOf,
  findPresetByDefenseValues,
  findPresetByOffenseValue,
  newTemporaryDefensePreset,
  newTemporaryOffensePreset,
  offenseValueOf,
  type StatPreset,
} from "@/lib/stat-preset"

import type { DefenderStatRanges, StatSelectMode, TrackState } from "./types"

export function orderedStatRange(range: StatRange): StatRange {
  return range.min <= range.max ? range : { min: range.max, max: range.min }
}

export function orderedDefenderRanges(ranges: DefenderStatRanges): DefenderStatRanges {
  return {
    hp: orderedStatRange(ranges.hp),
    def: orderedStatRange(ranges.def),
  }
}

function selectedPresets(presets: StatPreset[], ids: readonly string[]): StatPreset[] {
  const byId = new Map(presets.map((preset) => [preset.id, preset]))
  return ids.flatMap((id) => {
    const preset = byId.get(id)
    return preset ? [preset] : []
  })
}

export function offenseEnvelopeOf(
  presets: StatPreset[],
  ids: readonly string[],
): StatRange | null {
  const values = selectedPresets(presets, ids)
    .filter((preset) => preset.values.kind === "offense")
    .map((preset) => offenseValueOf(preset))
  return values.length === 0 ? null : envelopeRange(values)
}

export function defenseEnvelopeOf(
  presets: StatPreset[],
  ids: readonly string[],
): DefenderStatRanges | null {
  const values = selectedPresets(presets, ids)
    .filter((preset) => preset.values.kind === "defense")
    .map((preset) => defenseValuesOf(preset))
  if (values.length === 0) return null
  return {
    hp: envelopeRange(values.map((value) => value.hp)),
    def: envelopeRange(values.map((value) => value.def)),
  }
}

function inOffenseEnvelope(preset: StatPreset, range: StatRange): boolean {
  if (preset.values.kind !== "offense") return false
  const value = offenseValueOf(preset)
  return value >= range.min && value <= range.max
}

function isOffenseRangeEndpoint(preset: StatPreset, range: StatRange): boolean {
  if (preset.values.kind !== "offense") return false
  const value = offenseValueOf(preset)
  return value === range.min || value === range.max
}

function inDefenseEnvelope(preset: StatPreset, ranges: DefenderStatRanges): boolean {
  if (preset.values.kind !== "defense") return false
  const value = defenseValuesOf(preset)
  return (
    value.hp >= ranges.hp.min &&
    value.hp <= ranges.hp.max &&
    value.def >= ranges.def.min &&
    value.def <= ranges.def.max
  )
}

function isDefenseRangeEndpoint(preset: StatPreset, ranges: DefenderStatRanges): boolean {
  if (preset.values.kind !== "defense") return false
  const value = defenseValuesOf(preset)
  return (
    (value.hp === ranges.hp.min && value.def === ranges.def.min) ||
    (value.hp === ranges.hp.max && value.def === ranges.def.max)
  )
}

function dropUnselectedTemps(
  selectedIds: readonly string[],
  temporary: readonly StatPreset[],
): StatPreset[] {
  const selected = new Set(selectedIds)
  return temporary.filter((preset) => selected.has(preset.id))
}

function ensureOffenseValue(
  presets: StatPreset[],
  selectedIds: string[],
  temporary: StatPreset[],
  value: number,
): { selectedIds: string[]; temporary: StatPreset[] } {
  const match =
    findPresetByOffenseValue(presets, value) ??
    findPresetByOffenseValue(temporary, value)
  if (match) {
    return {
      selectedIds: selectedIds.includes(match.id) ? selectedIds : [...selectedIds, match.id],
      temporary,
    }
  }
  const created = newTemporaryOffensePreset(value)
  return {
    selectedIds: [...selectedIds, created.id],
    temporary: [...temporary, created],
  }
}

function ensureDefenseValue(
  presets: StatPreset[],
  selectedIds: string[],
  temporary: StatPreset[],
  hp: number,
  def: number,
): { selectedIds: string[]; temporary: StatPreset[] } {
  const match =
    findPresetByDefenseValues(presets, hp, def) ??
    findPresetByDefenseValues(temporary, hp, def)
  if (match) {
    return {
      selectedIds: selectedIds.includes(match.id) ? selectedIds : [...selectedIds, match.id],
      temporary,
    }
  }
  const created = newTemporaryDefensePreset(hp, def)
  return {
    selectedIds: [...selectedIds, created.id],
    temporary: [...temporary, created],
  }
}

function uniqueNumbers(values: readonly number[]): number[] {
  return [...new Set(values)]
}

export function withOffenseEnvelope(
  state: TrackState,
  presets: StatPreset[],
): TrackState {
  const statRange = offenseEnvelopeOf(presets, state.offensePresetIds)
  return statRange ? { ...state, statRange } : state
}

export function withDefenseEnvelope(
  state: TrackState,
  presets: StatPreset[],
): TrackState {
  const defenderRanges = defenseEnvelopeOf(presets, state.defensePresetIds)
  return defenderRanges ? { ...state, defenderRanges } : state
}

export function withOffenseRangeEndpoints(
  state: TrackState,
  presets: StatPreset[],
): TrackState {
  const range = offenseEnvelopeOf(presets, state.offensePresetIds) ?? state.statRange
  let selectedIds = [...state.offensePresetIds]
  let temporary = [...state.offenseTemporaryPresets]
  for (const value of uniqueNumbers([range.min, range.max])) {
    const next = ensureOffenseValue(presets, selectedIds, temporary, value)
    selectedIds = next.selectedIds
    temporary = next.temporary
  }
  return withOffenseEnvelope(
    {
      ...state,
      offensePresetIds: selectedIds,
      offenseTemporaryPresets: temporary,
      statRange: range,
    },
    [...presets, ...temporary],
  )
}

export function withDefenseRangeEndpoints(
  state: TrackState,
  presets: StatPreset[],
): TrackState {
  const ranges = defenseEnvelopeOf(presets, state.defensePresetIds) ?? state.defenderRanges
  const endpoints = [
    { hp: ranges.hp.min, def: ranges.def.min },
    { hp: ranges.hp.max, def: ranges.def.max },
  ]
  const seen = new Set<string>()
  let selectedIds = [...state.defensePresetIds]
  let temporary = [...state.defenseTemporaryPresets]
  for (const endpoint of endpoints) {
    const key = `${endpoint.hp}:${endpoint.def}`
    if (seen.has(key)) continue
    seen.add(key)
    const next = ensureDefenseValue(presets, selectedIds, temporary, endpoint.hp, endpoint.def)
    selectedIds = next.selectedIds
    temporary = next.temporary
  }
  return withDefenseEnvelope(
    {
      ...state,
      defensePresetIds: selectedIds,
      defenseTemporaryPresets: temporary,
      defenderRanges: ranges,
    },
    [...presets, ...temporary],
  )
}

export function trackStateAfterOffenseMode(
  state: TrackState,
  mode: StatSelectMode,
  presets: StatPreset[],
): TrackState {
  if (mode === state.statMode) return state
  const next = { ...state, statMode: mode }
  return mode === "range" ? withOffenseRangeEndpoints(next, presets) : next
}

export function trackStateAfterDefenseMode(
  state: TrackState,
  mode: StatSelectMode,
  presets: StatPreset[],
): TrackState {
  if (mode === state.defenderMode) return state
  const next = { ...state, defenderMode: mode }
  return mode === "range" ? withDefenseRangeEndpoints(next, presets) : next
}

export function trackStateAfterToggleOffense(
  state: TrackState,
  id: string,
  presets: StatPreset[],
): TrackState {
  const selected = new Set(state.offensePresetIds)
  if (selected.has(id)) {
    if (selected.size === 1) return state
    selected.delete(id)
  } else {
    const incoming = presets.find((preset) => preset.id === id)
    if (
      incoming &&
      selectedPresets(presets, state.offensePresetIds).some(
        (preset) =>
          preset.values.kind === "offense" &&
          incoming.values.kind === "offense" &&
          offenseValueOf(preset) === offenseValueOf(incoming),
      )
    ) {
      return state
    }
    selected.add(id)
  }
  const offensePresetIds = presets
    .filter((preset) => selected.has(preset.id))
    .map((preset) => preset.id)
  const offenseTemporaryPresets = dropUnselectedTemps(
    offensePresetIds,
    state.offenseTemporaryPresets,
  )
  return withOffenseEnvelope(
    { ...state, offensePresetIds, offenseTemporaryPresets },
    presets.filter((preset) => preset.kind !== "temporary").concat(offenseTemporaryPresets),
  )
}

export function trackStateAfterToggleDefense(
  state: TrackState,
  id: string,
  presets: StatPreset[],
): TrackState {
  const selected = new Set(state.defensePresetIds)
  if (selected.has(id)) {
    if (selected.size === 1) return state
    selected.delete(id)
  } else {
    const incoming = presets.find((preset) => preset.id === id)
    if (
      incoming &&
      selectedPresets(presets, state.defensePresetIds).some(
        (preset) =>
          preset.values.kind === "defense" &&
          incoming.values.kind === "defense" &&
          defenseValuesOf(preset).hp === defenseValuesOf(incoming).hp &&
          defenseValuesOf(preset).def === defenseValuesOf(incoming).def,
      )
    ) {
      return state
    }
    selected.add(id)
  }
  const defensePresetIds = presets
    .filter((preset) => selected.has(preset.id))
    .map((preset) => preset.id)
  const defenseTemporaryPresets = dropUnselectedTemps(
    defensePresetIds,
    state.defenseTemporaryPresets,
  )
  return withDefenseEnvelope(
    { ...state, defensePresetIds, defenseTemporaryPresets },
    presets.filter((preset) => preset.kind !== "temporary").concat(defenseTemporaryPresets),
  )
}

export function trackStateAfterOffenseRange(
  state: TrackState,
  requested: StatRange,
  presets: StatPreset[],
): TrackState {
  const range = orderedStatRange(requested)
  const kept = selectedPresets(presets, state.offensePresetIds)
    .filter((preset) => inOffenseEnvelope(preset, range))
    .filter((preset) => preset.kind !== "temporary" || isOffenseRangeEndpoint(preset, range))
    .map((preset) => preset.id)
  let selectedIds = kept
  let temporary = dropUnselectedTemps(kept, state.offenseTemporaryPresets)
  for (const value of uniqueNumbers([range.min, range.max])) {
    const next = ensureOffenseValue(presets, selectedIds, temporary, value)
    selectedIds = next.selectedIds
    temporary = next.temporary
  }
  return {
    ...state,
    offensePresetIds: selectedIds,
    offenseTemporaryPresets: temporary,
    statRange: range,
  }
}

export function trackStateAfterDefenseRanges(
  state: TrackState,
  requested: DefenderStatRanges,
  presets: StatPreset[],
): TrackState {
  const ranges = orderedDefenderRanges(requested)
  const kept = selectedPresets(presets, state.defensePresetIds)
    .filter((preset) => inDefenseEnvelope(preset, ranges))
    .filter((preset) => preset.kind !== "temporary" || isDefenseRangeEndpoint(preset, ranges))
    .map((preset) => preset.id)
  let selectedIds = kept
  let temporary = dropUnselectedTemps(kept, state.defenseTemporaryPresets)
  const endpoints = [
    { hp: ranges.hp.min, def: ranges.def.min },
    { hp: ranges.hp.max, def: ranges.def.max },
  ]
  const seen = new Set<string>()
  for (const endpoint of endpoints) {
    const key = `${endpoint.hp}:${endpoint.def}`
    if (seen.has(key)) continue
    seen.add(key)
    const next = ensureDefenseValue(presets, selectedIds, temporary, endpoint.hp, endpoint.def)
    selectedIds = next.selectedIds
    temporary = next.temporary
  }
  return {
    ...state,
    defensePresetIds: selectedIds,
    defenseTemporaryPresets: temporary,
    defenderRanges: ranges,
  }
}

export function trackStateAfterRemoveOffense(
  state: TrackState,
  id: string,
  presets: StatPreset[],
): TrackState | null {
  if (state.offensePresetIds.includes(id) && state.offensePresetIds.length === 1) {
    return null
  }
  const offensePresetIds = state.offensePresetIds.filter((presetId) => presetId !== id)
  return withOffenseEnvelope(
    { ...state, offensePresetIds },
    presets,
  )
}

export function trackStateAfterRemoveDefense(
  state: TrackState,
  id: string,
  presets: StatPreset[],
): TrackState | null {
  if (state.defensePresetIds.includes(id) && state.defensePresetIds.length === 1) {
    return null
  }
  const defensePresetIds = state.defensePresetIds.filter((presetId) => presetId !== id)
  return withDefenseEnvelope(
    { ...state, defensePresetIds },
    presets,
  )
}

export function trackStateAfterPersistOffense(
  state: TrackState,
  temporaryId: string,
  user: StatPreset,
): TrackState {
  return {
    ...state,
    offenseTemporaryPresets: state.offenseTemporaryPresets.filter((preset) => preset.id !== temporaryId),
    offensePresetIds: state.offensePresetIds.map((id) => (id === temporaryId ? user.id : id)),
  }
}

export function trackStateAfterPersistDefense(
  state: TrackState,
  temporaryId: string,
  user: StatPreset,
): TrackState {
  return {
    ...state,
    defenseTemporaryPresets: state.defenseTemporaryPresets.filter((preset) => preset.id !== temporaryId),
    defensePresetIds: state.defensePresetIds.map((id) => (id === temporaryId ? user.id : id)),
  }
}

function withSelectedOffense(
  state: TrackState,
  id: string,
  presets: StatPreset[],
): TrackState {
  if (state.offensePresetIds.includes(id)) return withOffenseEnvelope(state, presets)
  return withOffenseEnvelope(
    { ...state, offensePresetIds: [...state.offensePresetIds, id] },
    presets,
  )
}

function withSelectedDefense(
  state: TrackState,
  id: string,
  presets: StatPreset[],
): TrackState {
  if (state.defensePresetIds.includes(id)) return withDefenseEnvelope(state, presets)
  return withDefenseEnvelope(
    { ...state, defensePresetIds: [...state.defensePresetIds, id] },
    presets,
  )
}

export function trackStateAfterAddOffense(
  state: TrackState,
  user: StatPreset,
  presets: StatPreset[],
): TrackState {
  const existing = findPresetByOffenseValue(presets, offenseValueOf(user))
  if (existing) return withSelectedOffense(state, existing.id, presets)
  return withOffenseEnvelope(
    { ...state, offensePresetIds: [...state.offensePresetIds, user.id] },
    [...presets, user],
  )
}

export function trackStateAfterAddDefense(
  state: TrackState,
  user: StatPreset,
  presets: StatPreset[],
): TrackState {
  const value = defenseValuesOf(user)
  const existing = findPresetByDefenseValues(presets, value.hp, value.def)
  if (existing) return withSelectedDefense(state, existing.id, presets)
  return withDefenseEnvelope(
    { ...state, defensePresetIds: [...state.defensePresetIds, user.id] },
    [...presets, user],
  )
}

export function trackStatePreviewingOffense(
  state: TrackState,
  presets: StatPreset[],
  stat: number,
  draftId: string,
): TrackState {
  const existing = findPresetByOffenseValue(presets, stat)
  if (existing) {
    return { ...state, statMode: "preset", offensePresetIds: [existing.id] }
  }
  return {
    ...state,
    statMode: "preset",
    offensePresetIds: [draftId],
    offenseTemporaryPresets: [
      ...state.offenseTemporaryPresets.filter((preset) => preset.id !== draftId),
      {
        id: draftId,
        kind: "temporary",
        values: { kind: "offense", stat },
      },
    ],
  }
}

export function trackStatePreviewingDefense(
  state: TrackState,
  presets: StatPreset[],
  hp: number,
  def: number,
  draftId: string,
): TrackState {
  const existing = findPresetByDefenseValues(presets, hp, def)
  if (existing) {
    return { ...state, defenderMode: "preset", defensePresetIds: [existing.id] }
  }
  return {
    ...state,
    defenderMode: "preset",
    defensePresetIds: [draftId],
    defenseTemporaryPresets: [
      ...state.defenseTemporaryPresets.filter((preset) => preset.id !== draftId),
      {
        id: draftId,
        kind: "temporary",
        values: { kind: "defense", hp, def },
      },
    ],
  }
}

export type PersistedTrackState = TrackState & {
  statRangeTouched?: boolean
  defenderRangeTouched?: boolean
}

export function isDualStoreTrackState(state: PersistedTrackState): boolean {
  return (
    typeof state.statRangeTouched === "boolean" ||
    typeof state.defenderRangeTouched === "boolean"
  )
}

export function stripTouched(state: PersistedTrackState): TrackState {
  const { statRangeTouched: _statTouched, defenderRangeTouched: _defTouched, ...rest } = state
  return rest
}

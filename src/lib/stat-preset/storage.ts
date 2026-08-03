import type { StoredUserStatPresets, StatPreset } from "./types"

// Keep the original namespace so existing user presets survive the terminology change.
const STORAGE_KEY = "pokemon-damage-calc:stat-value-templates"

function emptyStore(): StoredUserStatPresets {
  return { offense: {}, defense: {} }
}

function stripLegacyPresetName(preset: StatPreset): StatPreset {
  const { name: _name, ...rest } = preset as StatPreset & { name?: string }
  return rest
}

function stripPresetList(presets: StatPreset[]): StatPreset[] {
  return presets.map(stripLegacyPresetName)
}

function readStore(): StoredUserStatPresets {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as StoredUserStatPresets
    const offense = parsed.offense ?? {}
    const defense = parsed.defense ?? {}
    return {
      offense: Object.fromEntries(
        Object.entries(offense).map(([id, list]) => [id, stripPresetList(list)]),
      ),
      defense: Object.fromEntries(
        Object.entries(defense).map(([id, list]) => [id, stripPresetList(list)]),
      ),
    }
  } catch {
    return emptyStore()
  }
}

function writeStore(store: StoredUserStatPresets): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function loadUserOffensePresets(pokemonId: string): StatPreset[] {
  return readStore().offense[pokemonId] ?? []
}

export function loadUserDefensePresets(pokemonId: string): StatPreset[] {
  return readStore().defense[pokemonId] ?? []
}

export function saveUserOffensePreset(
  pokemonId: string,
  preset: StatPreset,
): void {
  const store = readStore()
  const list = store.offense[pokemonId] ?? []
  store.offense[pokemonId] = [...list.filter((t) => t.id !== preset.id), preset]
  writeStore(store)
}

export function saveUserDefensePreset(
  pokemonId: string,
  preset: StatPreset,
): void {
  const store = readStore()
  const list = store.defense[pokemonId] ?? []
  store.defense[pokemonId] = [...list.filter((t) => t.id !== preset.id), preset]
  writeStore(store)
}

export function deleteUserOffensePreset(pokemonId: string, presetId: string): void {
  const store = readStore()
  const list = store.offense[pokemonId] ?? []
  store.offense[pokemonId] = list.filter((t) => t.id !== presetId)
  writeStore(store)
}

export function deleteUserDefensePreset(pokemonId: string, presetId: string): void {
  const store = readStore()
  const list = store.defense[pokemonId] ?? []
  store.defense[pokemonId] = list.filter((t) => t.id !== presetId)
  writeStore(store)
}

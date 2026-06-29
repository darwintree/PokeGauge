import type { StoredUserTemplates, StatValueTemplate } from "./types"

const STORAGE_KEY = "pokemon-damage-calc:stat-value-templates"

function emptyStore(): StoredUserTemplates {
  return { offense: {}, defense: {} }
}

function readStore(): StoredUserTemplates {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as StoredUserTemplates
    return {
      offense: parsed.offense ?? {},
      defense: parsed.defense ?? {},
    }
  } catch {
    return emptyStore()
  }
}

function writeStore(store: StoredUserTemplates): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function loadUserOffenseTemplates(pokemonId: string): StatValueTemplate[] {
  return readStore().offense[pokemonId] ?? []
}

export function loadUserDefenseTemplates(pokemonId: string): StatValueTemplate[] {
  return readStore().defense[pokemonId] ?? []
}

export function saveUserOffenseTemplate(
  pokemonId: string,
  template: StatValueTemplate,
): void {
  const store = readStore()
  const list = store.offense[pokemonId] ?? []
  store.offense[pokemonId] = [...list.filter((t) => t.id !== template.id), template]
  writeStore(store)
}

export function saveUserDefenseTemplate(
  pokemonId: string,
  template: StatValueTemplate,
): void {
  const store = readStore()
  const list = store.defense[pokemonId] ?? []
  store.defense[pokemonId] = [...list.filter((t) => t.id !== template.id), template]
  writeStore(store)
}

export function deleteUserOffenseTemplate(pokemonId: string, templateId: string): void {
  const store = readStore()
  const list = store.offense[pokemonId] ?? []
  store.offense[pokemonId] = list.filter((t) => t.id !== templateId)
  writeStore(store)
}

export function deleteUserDefenseTemplate(pokemonId: string, templateId: string): void {
  const store = readStore()
  const list = store.defense[pokemonId] ?? []
  store.defense[pokemonId] = list.filter((t) => t.id !== templateId)
  writeStore(store)
}

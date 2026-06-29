import { HELD_ITEM_STORAGE_KEY } from "./items"

type AddedBoostStore = Record<string, string[]>

function readStore(): AddedBoostStore {
  try {
    const raw = localStorage.getItem(HELD_ITEM_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as AddedBoostStore
  } catch {
    return {}
  }
}

function writeStore(store: AddedBoostStore): void {
  localStorage.setItem(HELD_ITEM_STORAGE_KEY, JSON.stringify(store))
}

export function normalizeAddedBoostIds(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : []
}

export function loadAddedBoostIds(attackerId: string): string[] {
  return normalizeAddedBoostIds(readStore()[attackerId])
}

export function saveAddedBoostId(attackerId: string, catalogId: string): void {
  const store = readStore()
  const list = store[attackerId] ?? []
  if (list.includes(catalogId)) return
  store[attackerId] = [...list, catalogId]
  writeStore(store)
}

export function removeAddedBoostId(attackerId: string, catalogId: string): void {
  const store = readStore()
  const list = (store[attackerId] ?? []).filter((id) => id !== catalogId)
  if (list.length === 0) delete store[attackerId]
  else store[attackerId] = list
  writeStore(store)
}

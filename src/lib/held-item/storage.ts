import { HELD_ITEM_STORAGE_KEY } from "./items"
import { ATTACKER_HELD_ITEM_IDS } from "./inventory"

type AddedBoostStore = Record<string, unknown>
const KNOWN_ATTACKER_ITEMS = new Set(ATTACKER_HELD_ITEM_IDS)

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

export function normalizeAddedBoostIds(raw: unknown): number[] {
  return Array.isArray(raw)
    ? raw.filter(
        (id): id is number =>
          Number.isInteger(id) && KNOWN_ATTACKER_ITEMS.has(id as number),
      )
    : []
}

export function loadAddedBoostIds(attackerId: string): number[] {
  return normalizeAddedBoostIds(readStore()[attackerId])
}

export function saveAddedBoostId(attackerId: string, catalogId: number): void {
  if (!KNOWN_ATTACKER_ITEMS.has(catalogId)) return
  const store = readStore()
  const list = normalizeAddedBoostIds(store[attackerId])
  if (list.includes(catalogId)) return
  store[attackerId] = [...list, catalogId]
  writeStore(store)
}

export function removeAddedBoostId(attackerId: string, catalogId: number): void {
  const store = readStore()
  const list = normalizeAddedBoostIds(store[attackerId]).filter(
    (id) => id !== catalogId,
  )
  if (list.length === 0) delete store[attackerId]
  else store[attackerId] = list
  writeStore(store)
}

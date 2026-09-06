import { getCatalogShell, type MatchupCatalog } from "@/lib/catalog"
import { movePowerIsCompatible } from "@/lib/move"
import type { SupportedLocale } from "@/lib/i18n"
import {
  createScenarioSetupUrl,
  decodeScenarioSetupToken,
  SCENARIO_SHARE_PARAM,
  trackStateFromScenarioSetup,
  type SharedScenarioSetup,
} from "../share"
import type { TrackState } from "../types"

export const SETUP_BOOKMARK_STORAGE_KEY = "pokegauge:setup-bookmarks"
export const SETUP_BOOKMARK_LIMIT = 50
const SETUP_BOOKMARK_STORE_VERSION = 1

export type SetupBookmark = {
  id: string
  title: string | null
  savedAt: number
  token: string
}

type SetupBookmarkStore = {
  version: typeof SETUP_BOOKMARK_STORE_VERSION
  bookmarks: SetupBookmark[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isBookmark(value: unknown): value is SetupBookmark {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    (value.title === null || typeof value.title === "string") &&
    typeof value.savedAt === "number" &&
    Number.isFinite(value.savedAt) &&
    typeof value.token === "string" &&
    value.token.length > 0
  )
}

function parseStore(value: unknown): SetupBookmark[] {
  if (
    !isRecord(value) ||
    value.version !== SETUP_BOOKMARK_STORE_VERSION ||
    !Array.isArray(value.bookmarks)
  ) {
    return []
  }
  return value.bookmarks.filter(isBookmark)
}

function readBookmarks(): SetupBookmark[] {
  try {
    const raw = localStorage.getItem(SETUP_BOOKMARK_STORAGE_KEY)
    if (!raw) return []
    return parseStore(JSON.parse(raw))
  } catch {
    return []
  }
}

function writeBookmarks(bookmarks: SetupBookmark[]): boolean {
  const store: SetupBookmarkStore = {
    version: SETUP_BOOKMARK_STORE_VERSION,
    bookmarks,
  }
  try {
    localStorage.setItem(SETUP_BOOKMARK_STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

export function loadSetupBookmarks(): SetupBookmark[] {
  return [...readBookmarks()].sort((left, right) => right.savedAt - left.savedAt)
}

export type SaveSetupBookmarkResult =
  | { ok: true; bookmark: SetupBookmark }
  | { ok: false; reason: "unencodable" | "full" | "quota" }

export function saveSetupBookmark(
  baseUrl: string,
  catalog: MatchupCatalog,
  trackState: TrackState,
): SaveSetupBookmarkResult {
  const shareUrl = createScenarioSetupUrl(baseUrl, catalog, trackState)
  if (!shareUrl.ok) return { ok: false, reason: "unencodable" }
  const token = new URL(shareUrl.value).searchParams.get(SCENARIO_SHARE_PARAM)
  if (!token) return { ok: false, reason: "unencodable" }

  const bookmarks = readBookmarks()
  if (bookmarks.length >= SETUP_BOOKMARK_LIMIT) return { ok: false, reason: "full" }

  const bookmark: SetupBookmark = {
    id: crypto.randomUUID(),
    title: null,
    savedAt: Date.now(),
    token,
  }
  if (!writeBookmarks([...bookmarks, bookmark])) return { ok: false, reason: "quota" }
  return { ok: true, bookmark }
}

export function renameSetupBookmark(id: string, title: string | null): boolean {
  const bookmarks = readBookmarks()
  const index = bookmarks.findIndex((bookmark) => bookmark.id === id)
  if (index < 0) return false
  const nextTitle = title === null ? null : title.trim() || null
  bookmarks[index] = { ...bookmarks[index], title: nextTitle }
  return writeBookmarks(bookmarks)
}

export function deleteSetupBookmark(id: string): boolean {
  const bookmarks = readBookmarks()
  const next = bookmarks.filter((bookmark) => bookmark.id !== id)
  if (next.length === bookmarks.length) return false
  return writeBookmarks(next)
}

export function decodeSetupBookmarkToken(token: string): SharedScenarioSetup | null {
  const decoded = decodeScenarioSetupToken(token)
  return decoded.ok ? decoded.value : null
}

export function setupBookmarkIsLoadable(
  setup: SharedScenarioSetup | null,
  attackerIds: ReadonlySet<number>,
  defenderIds: ReadonlySet<number>,
): boolean {
  return (
    setup !== null &&
    attackerIds.has(setup.attackerId) &&
    defenderIds.has(setup.defenderId) &&
    setup.moveSnapshots.every((snapshot) => movePowerIsCompatible(snapshot.moveId, snapshot.power))
  )
}

export async function restoreSetupBookmark(
  token: string,
  locale: SupportedLocale,
  attackerIds: ReadonlySet<number>,
  defenderIds: ReadonlySet<number>,
): Promise<
  | { ok: true; catalog: MatchupCatalog; trackState: TrackState }
  | { ok: false }
> {
  const setup = decodeSetupBookmarkToken(token)
  if (!setupBookmarkIsLoadable(setup, attackerIds, defenderIds) || !setup) {
    return { ok: false }
  }
  try {
    const catalog = await getCatalogShell(
      setup.attackerId,
      setup.defenderId,
      locale,
      setup.moveCategory,
    )
    const restored = trackStateFromScenarioSetup(setup, catalog)
    if (!restored.ok) return { ok: false }
    return { ok: true, catalog, trackState: restored.value }
  } catch {
    return { ok: false }
  }
}

export function setupBookmarkPageSize(listHeightPx: number, rowHeightPx: number): number {
  if (!Number.isFinite(listHeightPx) || !Number.isFinite(rowHeightPx) || listHeightPx < 1 || rowHeightPx < 1) {
    return 1
  }
  return Math.max(1, Math.floor(listHeightPx / rowHeightPx))
}

export function paginateSetupBookmarks<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): { page: number; pageCount: number; items: T[] } {
  const size = Number.isFinite(pageSize) && pageSize >= 1 ? Math.floor(pageSize) : 1
  if (items.length === 0) return { page: 1, pageCount: 1, items: [] }
  const pageCount = Math.ceil(items.length / size)
  const safePage = Math.min(Math.max(1, page), pageCount)
  const start = (safePage - 1) * size
  return {
    page: safePage,
    pageCount,
    items: items.slice(start, start + size),
  }
}

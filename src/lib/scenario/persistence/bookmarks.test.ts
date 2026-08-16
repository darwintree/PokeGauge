import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { defaultTrackState } from "@/lib/scenario"

import {
  decodeSetupBookmarkToken,
  deleteSetupBookmark,
  loadSetupBookmarks,
  renameSetupBookmark,
  restoreSetupBookmark,
  saveSetupBookmark,
  SETUP_BOOKMARK_LIMIT,
  SETUP_BOOKMARK_STORAGE_KEY,
  setupBookmarkIsLoadable,
} from "./bookmarks"

describe("setup bookmarks", () => {
  let data: Record<string, string>
  let now = 1_000

  beforeEach(() => {
    data = {}
    now = 1_000
    vi.spyOn(Date, "now").mockImplementation(() => now)
    vi.spyOn(crypto, "randomUUID").mockImplementation(
      () => `00000000-0000-4000-8000-${String(now).padStart(12, "0")}`,
    )
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => data[key] ?? null,
      setItem: (key: string, value: string) => {
        data[key] = value
      },
      removeItem: (key: string) => {
        delete data[key]
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("saves a share token, newest first, and allows rename and delete", async () => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const first = saveSetupBookmark("https://example.test/", catalog, defaultTrackState(catalog))
    expect(first.ok).toBe(true)
    now = 2_000
    const second = saveSetupBookmark("https://example.test/", catalog, defaultTrackState(catalog))
    expect(second.ok).toBe(true)
    if (!first.ok || !second.ok) return

    expect(loadSetupBookmarks().map((bookmark) => bookmark.id)).toEqual([
      second.bookmark.id,
      first.bookmark.id,
    ])
    expect(decodeSetupBookmarkToken(first.bookmark.token)).toMatchObject({
      attackerId: 445,
      defenderId: 727,
    })

    expect(renameSetupBookmark(first.bookmark.id, "  Garchomp  ")).toBe(true)
    expect(loadSetupBookmarks().find((bookmark) => bookmark.id === first.bookmark.id)).toMatchObject({
      title: "Garchomp",
      savedAt: first.bookmark.savedAt,
    })
    expect(renameSetupBookmark(first.bookmark.id, "   ")).toBe(true)
    expect(loadSetupBookmarks().find((bookmark) => bookmark.id === first.bookmark.id)?.title)
      .toBeNull()

    expect(deleteSetupBookmark(second.bookmark.id)).toBe(true)
    expect(loadSetupBookmarks().map((bookmark) => bookmark.id)).toEqual([first.bookmark.id])
  })

  it("refuses a 51st bookmark", async () => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    data[SETUP_BOOKMARK_STORAGE_KEY] = JSON.stringify({
      version: 1,
      bookmarks: Array.from({ length: SETUP_BOOKMARK_LIMIT }, (_, index) => ({
        id: `filled-${index}`,
        title: null,
        savedAt: index,
        token: "1.placeholder",
      })),
    })

    expect(saveSetupBookmark("https://example.test/", catalog, defaultTrackState(catalog)))
      .toEqual({ ok: false, reason: "full" })
  })

  it("treats a broken token or unknown matchup as unloadable", async () => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const saved = saveSetupBookmark("https://example.test/", catalog, defaultTrackState(catalog))
    expect(saved.ok).toBe(true)
    if (!saved.ok) return
    const setup = decodeSetupBookmarkToken(saved.bookmark.token)

    expect(decodeSetupBookmarkToken("not-a-token")).toBeNull()
    expect(setupBookmarkIsLoadable(null, new Set([445]), new Set([727]))).toBe(false)
    expect(setupBookmarkIsLoadable(setup, new Set([445]), new Set([727]))).toBe(true)
    expect(setupBookmarkIsLoadable(setup, new Set([1]), new Set([727]))).toBe(false)
  })

  it("restores track state from a saved token and rejects unknown matchups", async () => {
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const saved = saveSetupBookmark("https://example.test/", catalog, defaultTrackState(catalog))
    expect(saved.ok).toBe(true)
    if (!saved.ok) return

    const restored = await restoreSetupBookmark(
      saved.bookmark.token,
      "en",
      new Set([445]),
      new Set([727]),
    )
    expect(restored.ok).toBe(true)
    if (!restored.ok) return
    expect(restored.catalog.matchup.attackerId).toBe(445)
    expect(restored.catalog.matchup.defenderId).toBe(727)

    expect(await restoreSetupBookmark(saved.bookmark.token, "en", new Set([1]), new Set([727])))
      .toEqual({ ok: false })
    expect(await restoreSetupBookmark("not-a-token", "en", new Set([445]), new Set([727])))
      .toEqual({ ok: false })
  })
})

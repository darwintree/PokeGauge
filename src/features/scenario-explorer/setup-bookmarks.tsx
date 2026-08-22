import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import {
  BookmarkIcon,
  BookmarkPlusIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import type { BattlePokemonOption, MatchupCatalog } from "@/lib/catalog"
import {
  decodeSetupBookmarkToken,
  deleteSetupBookmark,
  loadSetupBookmarks,
  paginateSetupBookmarks,
  renameSetupBookmark,
  saveSetupBookmark,
  setupBookmarkIsLoadable,
  setupBookmarkPageSize,
  SETUP_BOOKMARK_LIMIT,
  type SetupBookmark,
  type TrackState,
} from "@/lib/scenario"
import { cn } from "@/lib/utils"

type SaveStatus = "idle" | "saved" | "unencodable" | "full" | "quota"

function pageSizeFromDialog(
  dialog: HTMLElement,
  header: HTMLElement,
  row: Element,
  footer: HTMLElement | null,
): number {
  const maxH = parseFloat(getComputedStyle(dialog).maxHeight)
  if (!Number.isFinite(maxH) || maxH <= 0) return 1
  const footerH = footer?.offsetHeight || 64
  const borderY = dialog.offsetHeight - dialog.clientHeight
  return setupBookmarkPageSize(
    maxH - borderY - header.offsetHeight - footerH,
    row.getBoundingClientRect().height,
  )
}

function estimateBookmarkPageSize(): number {
  if (typeof window === "undefined") return 6
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const viewportH = window.visualViewport?.height ?? window.innerHeight
  const maxH = Math.min(36 * rem, viewportH - 2 * rem)
  return setupBookmarkPageSize(maxH - 4 - 5 * rem - 4.5 * rem, 3.5 * rem)
}

function optionById(
  id: number,
  options: readonly BattlePokemonOption[],
): BattlePokemonOption | undefined {
  return options.find((option) => option.id === id)
}

function bookmarkTitle(
  bookmark: SetupBookmark,
  attackers: readonly BattlePokemonOption[],
  defenders: readonly BattlePokemonOption[],
  unloadableLabel: string,
): string {
  if (bookmark.title) return bookmark.title
  const setup = decodeSetupBookmarkToken(bookmark.token)
  if (!setup) return unloadableLabel
  const attacker = optionById(setup.attackerId, attackers)?.label
  const defender = optionById(setup.defenderId, defenders)?.label
  if (!attacker || !defender) return unloadableLabel
  return `${attacker} → ${defender}`
}

function spriteUrl(id: number, side: "front" | "back"): string {
  const file = side === "back" ? `back/${id}.png` : `${id}.png`
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${file}`
}

function PokemonSprite({
  id,
  side,
  dimmed,
}: {
  id: number | undefined
  side: "front" | "back"
  dimmed?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const src = id && id > 0 ? spriteUrl(id, side) : null
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-md bg-token-bg",
        dimmed && "opacity-40 grayscale",
      )}
    >
      {src && !failed ? (
        <img
          loading="lazy"
          decoding="async"
          src={src}
          alt=""
          className="size-11 object-contain [image-rendering:pixelated]"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-muted-foreground text-xs">?</span>
      )}
    </span>
  )
}

export function SetupBookmarkControls({
  catalog,
  trackState,
  attackers,
  defenders,
  onApplyToken,
}: {
  catalog: MatchupCatalog
  trackState: TrackState
  attackers: readonly BattlePokemonOption[]
  defenders: readonly BattlePokemonOption[]
  onApplyToken: (token: string) => Promise<"ok" | "unloadable">
}) {
  const intl = useIntl()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [listOpen, setListOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState<SetupBookmark[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(estimateBookmarkPageSize)
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set())
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const skipRenameBlurRef = useRef(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const attackerIds = useMemo(
    () => new Set(attackers.map((option) => option.id)),
    [attackers],
  )
  const defenderIds = useMemo(
    () => new Set(defenders.map((option) => option.id)),
    [defenders],
  )
  const unloadableLabel = intl.formatMessage({ id: "bookmark.unloadable" })
  const paged = paginateSetupBookmarks(bookmarks, page, pageSize)

  function measurePageSize() {
    const dialog = dialogRef.current
    const header = headerRef.current
    const row = listRef.current?.querySelector("li")
    if (!dialog || !header || !row) return
    const next = pageSizeFromDialog(dialog, header, row, footerRef.current)
    setPageSize((current) => (current === next ? current : next))
  }

  useEffect(() => {
    setSaveStatus("idle")
  }, [trackState])

  useEffect(() => {
    setPage(paged.page)
  }, [paged.page])

  useLayoutEffect(() => {
    if (!listOpen) return
    measurePageSize()
    const dialog = dialogRef.current
    const observer = dialog ? new ResizeObserver(measurePageSize) : null
    if (dialog) observer?.observe(dialog)
    window.addEventListener("resize", measurePageSize)
    window.visualViewport?.addEventListener("resize", measurePageSize)
    const raf = window.requestAnimationFrame(measurePageSize)
    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(raf)
      window.removeEventListener("resize", measurePageSize)
      window.visualViewport?.removeEventListener("resize", measurePageSize)
    }
  }, [listOpen, bookmarks.length])

  function refreshList() {
    setBookmarks(loadSetupBookmarks())
  }

  function saveCurrent() {
    const result = saveSetupBookmark(window.location.href, catalog, trackState)
    if (result.ok) {
      setSaveStatus("saved")
      if (listOpen) {
        refreshList()
        setPage(1)
      }
      return
    }
    setSaveStatus(result.reason)
  }

  function commitRename(id: string) {
    if (skipRenameBlurRef.current) {
      skipRenameBlurRef.current = false
      return
    }
    renameSetupBookmark(id, draftTitle)
    setRenamingId(null)
    refreshList()
  }

  async function applyBookmark(bookmark: SetupBookmark) {
    setApplyingId(bookmark.id)
    const result = await onApplyToken(bookmark.token)
    setApplyingId(null)
    if (result === "ok") {
      setListOpen(false)
      return
    }
    setBlockedIds((current) => new Set(current).add(bookmark.id))
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={saveCurrent}>
        {saveStatus === "saved" ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <BookmarkPlusIcon data-icon="inline-start" />
        )}
        <span aria-live="polite">
          <FormattedMessage id={saveStatus === "saved" ? "bookmark.saved" : "bookmark.save"} />
        </span>
      </Button>
      <Dialog
        open={listOpen}
        onOpenChange={(open) => {
          setListOpen(open)
          if (open) {
            setRenamingId(null)
            setPage(1)
            refreshList()
          }
        }}
      >
        <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
          <BookmarkIcon data-icon="inline-start" />
          <FormattedMessage id="bookmark.list" />
        </DialogTrigger>
        <DialogContent
          ref={dialogRef}
          showCloseButton={false}
          className="flex max-h-[min(36rem,calc(100svh-2rem))] flex-col gap-0 overflow-hidden border-2 border-ink bg-paper p-0 shadow-hud-panel sm:max-w-lg"
        >
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1.5 right-1.5 z-10 size-11 sm:top-2 sm:right-2 sm:size-8"
                aria-label={intl.formatMessage({ id: "app.close" })}
              />
            }
          >
            <XIcon aria-hidden />
          </DialogClose>
          <DialogHeader ref={headerRef} className="shrink-0 border-b border-hairline px-4 py-3 pr-12">
            <DialogTitle className="text-[17px] font-extrabold tracking-tight">
              <FormattedMessage id="bookmark.listTitle" />
              <span className="text-muted-foreground ml-2 text-sm font-semibold tabular-nums">
                {bookmarks.length}/{SETUP_BOOKMARK_LIMIT}
              </span>
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="bookmark.listDescription" />
            </DialogDescription>
          </DialogHeader>
          {bookmarks.length === 0 ? (
            <Empty className="border-0 py-8">
              <EmptyHeader>
                <EmptyTitle>
                  <FormattedMessage id="bookmark.empty" />
                </EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul ref={listRef} className="min-h-0 flex-1 overflow-hidden">
              {paged.items.map((bookmark) => {
                const setup = decodeSetupBookmarkToken(bookmark.token)
                const loadable =
                  setupBookmarkIsLoadable(setup, attackerIds, defenderIds) &&
                  !blockedIds.has(bookmark.id)
                const title = bookmarkTitle(
                  bookmark,
                  attackers,
                  defenders,
                  unloadableLabel,
                )
                const savedAt = intl.formatDate(bookmark.savedAt, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
                const dimmed = !loadable
                return (
                  <li
                    key={bookmark.id}
                    className="flex shrink-0 items-center gap-1 border-b border-hairline px-2 py-1 last:border-b-0"
                  >
                    {renamingId === bookmark.id ? (
                      <div className="flex min-w-0 flex-1 items-center gap-2 px-1 py-1">
                        <PokemonSprite id={setup?.attackerId} side="back" dimmed={dimmed} />
                        <PokemonSprite id={setup?.defenderId} side="front" dimmed={dimmed} />
                        <span className="min-w-0 flex-1">
                          <Input
                            value={draftTitle}
                            placeholder={title}
                            aria-label={intl.formatMessage({ id: "bookmark.title" })}
                            className="border-2 border-ink"
                            autoFocus
                            onChange={(event) => setDraftTitle(event.target.value)}
                            onBlur={() => commitRename(bookmark.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault()
                                commitRename(bookmark.id)
                              }
                              if (event.key === "Escape") {
                                event.preventDefault()
                                skipRenameBlurRef.current = true
                                setRenamingId(null)
                              }
                            }}
                          />
                          <span className="text-muted-foreground mt-0.5 block text-xs">{savedAt}</span>
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={dimmed || applyingId !== null}
                        onClick={() => applyBookmark(bookmark)}
                        className={cn(
                          "flex min-w-0 flex-1 items-center gap-2 rounded-[10px] px-1 text-left outline-none",
                          !dimmed &&
                            "hover:bg-token-bg/70 focus-visible:ring-2 focus-visible:ring-ring",
                          dimmed && "cursor-not-allowed",
                        )}
                      >
                        <PokemonSprite id={setup?.attackerId} side="back" dimmed={dimmed} />
                        <PokemonSprite id={setup?.defenderId} side="front" dimmed={dimmed} />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "flex items-center gap-1.5 text-sm font-extrabold tracking-tight",
                              dimmed && "text-muted-foreground",
                            )}
                          >
                            <span className="truncate">{title}</span>
                            {dimmed && title !== unloadableLabel ? (
                              <Badge variant="destructive">
                                <FormattedMessage id="bookmark.unloadable" />
                              </Badge>
                            ) : null}
                          </span>
                          <span className="text-muted-foreground mt-0.5 block text-xs">{savedAt}</span>
                        </span>
                      </button>
                    )}
                    <span className="flex shrink-0 items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-11 sm:size-7"
                        aria-label={intl.formatMessage({ id: "bookmark.rename" })}
                        disabled={applyingId !== null}
                        onClick={() => {
                          setRenamingId(bookmark.id)
                          setDraftTitle(bookmark.title ?? "")
                        }}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-11 sm:size-7"
                        aria-label={intl.formatMessage({ id: "bookmark.delete" })}
                        disabled={applyingId !== null}
                        onClick={() => {
                          deleteSetupBookmark(bookmark.id)
                          if (renamingId === bookmark.id) setRenamingId(null)
                          refreshList()
                        }}
                      >
                        <Trash2Icon />
                      </Button>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
          {bookmarks.length > 0 && paged.pageCount > 1 ? (
            <DialogFooter
              ref={footerRef}
              className="mx-0 mb-0 shrink-0 flex-row items-center justify-between border-hairline bg-token-bg/60 sm:justify-between"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={paged.page <= 1 || applyingId !== null}
                aria-label={intl.formatMessage({ id: "bookmark.previous" })}
                onClick={() => setPage(paged.page - 1)}
              >
                <ChevronLeftIcon data-icon="inline-start" />
                <FormattedMessage id="bookmark.previous" />
              </Button>
              <p className="text-sm font-extrabold tabular-nums" aria-live="polite">
                <FormattedMessage
                  id="bookmark.page"
                  values={{ current: paged.page, total: paged.pageCount }}
                />
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={paged.page >= paged.pageCount || applyingId !== null}
                aria-label={intl.formatMessage({ id: "bookmark.next" })}
                onClick={() => setPage(paged.page + 1)}
              >
                <FormattedMessage id="bookmark.next" />
                <ChevronRightIcon data-icon="inline-end" />
              </Button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
      {saveStatus === "unencodable" || saveStatus === "full" || saveStatus === "quota" ? (
        <p role="status" className="text-destructive w-full text-xs font-medium">
          <FormattedMessage
            id={
              saveStatus === "full"
                ? "bookmark.full"
                : saveStatus === "quota"
                  ? "bookmark.quota"
                  : "bookmark.saveError"
            }
          />
        </p>
      ) : null}
    </div>
  )
}

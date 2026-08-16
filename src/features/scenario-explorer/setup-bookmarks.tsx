import { useEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import {
  BookmarkIcon,
  BookmarkPlusIcon,
  CheckIcon,
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
  renameSetupBookmark,
  saveSetupBookmark,
  setupBookmarkIsLoadable,
  type SetupBookmark,
  type TrackState,
} from "@/lib/scenario"

type SaveStatus = "idle" | "saved" | "unencodable" | "full" | "quota"

function optionLabel(
  id: number,
  options: readonly BattlePokemonOption[],
): string | undefined {
  return options.find((option) => option.id === id)?.label
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
  const attacker = optionLabel(setup.attackerId, attackers)
  const defender = optionLabel(setup.defenderId, defenders)
  if (!attacker || !defender) return unloadableLabel
  return `${attacker} → ${defender}`
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
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set())
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const skipRenameBlurRef = useRef(false)

  const attackerIds = useMemo(
    () => new Set(attackers.map((option) => option.id)),
    [attackers],
  )
  const defenderIds = useMemo(
    () => new Set(defenders.map((option) => option.id)),
    [defenders],
  )
  const unloadableLabel = intl.formatMessage({ id: "bookmark.unloadable" })

  useEffect(() => {
    setSaveStatus("idle")
  }, [trackState])

  function refreshList() {
    setBookmarks(loadSetupBookmarks())
  }

  function saveCurrent() {
    const result = saveSetupBookmark(window.location.href, catalog, trackState)
    if (result.ok) {
      setSaveStatus("saved")
      if (listOpen) refreshList()
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
        {saveStatus === "saved" ? <CheckIcon data-icon="inline-start" /> : <BookmarkPlusIcon data-icon="inline-start" />}
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
            refreshList()
          }
        }}
      >
        <DialogTrigger
          render={
            <Button type="button" variant="outline" size="sm" />
          }
        >
          <BookmarkIcon data-icon="inline-start" />
          <FormattedMessage id="bookmark.list" />
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="max-h-[min(36rem,calc(100svh-2rem))] grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden border-2 border-ink bg-paper shadow-hud-panel sm:max-w-md"
        >
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1.5 right-1.5 size-11 sm:top-2 sm:right-2 sm:size-8"
                aria-label={intl.formatMessage({ id: "app.close" })}
              />
            }
          >
            <XIcon aria-hidden />
          </DialogClose>
          <DialogHeader className="pr-12">
            <DialogTitle>
              <FormattedMessage id="bookmark.listTitle" />
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
            <ul className="min-h-0 overflow-y-auto [scrollbar-gutter:stable]">
              {bookmarks.map((bookmark) => {
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
                return (
                  <li
                    key={bookmark.id}
                    className="flex items-start gap-2 border-b border-hairline py-2 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      {renamingId === bookmark.id ? (
                        <Input
                          value={draftTitle}
                          placeholder={title}
                          aria-label={intl.formatMessage({ id: "bookmark.title" })}
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
                          autoFocus
                        />
                      ) : loadable ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-auto min-w-0 w-full flex-col items-start px-1 py-0.5"
                          disabled={applyingId !== null}
                          onClick={() => applyBookmark(bookmark)}
                        >
                          <span className="block w-full truncate font-semibold">{title}</span>
                          <span className="text-muted-foreground text-xs font-normal">{savedAt}</span>
                        </Button>
                      ) : (
                        <div className="px-1 py-0.5">
                          <span className="flex items-center gap-1.5">
                            <span className="truncate font-semibold text-muted-foreground">
                              {title}
                            </span>
                            {title !== unloadableLabel ? (
                              <Badge variant="destructive">
                                <FormattedMessage id="bookmark.unloadable" />
                              </Badge>
                            ) : null}
                          </span>
                          <span className="text-muted-foreground text-xs">{savedAt}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
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
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
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

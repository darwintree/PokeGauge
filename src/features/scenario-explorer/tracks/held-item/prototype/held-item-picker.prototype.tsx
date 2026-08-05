/**
 * PROTOTYPE — Held item picker UI (throwaway reference for the folded pick).
 *
 * Question settled: B chrome + C tag pills; holder filter always on (no toggle).
 * Run: pnpm dev → http://localhost:5173/?prototype=held-item-picker
 */

import { Search } from "lucide-react"
import { useId, useMemo, useState, type ReactNode } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const TAGS = ["exclusive", "power", "stat", "berry"] as const
type Tag = (typeof TAGS)[number]

type MockItem = {
  id: number
  label: string
  sprite: string
  tag: Tag
  formTrigger?: boolean
  holderEligible: boolean
}

const MOCK_ITEMS: MockItem[] = [
  { id: 1, label: "Choice Specs", sprite: "choice-specs.png", tag: "power", holderEligible: true },
  { id: 2, label: "Life Orb", sprite: "life-orb.png", tag: "power", holderEligible: true },
  { id: 3, label: "Assault Vest", sprite: "assault-vest.png", tag: "stat", holderEligible: true },
  { id: 4, label: "Eviolite", sprite: "eviolite.png", tag: "stat", holderEligible: true },
  { id: 5, label: "Occa Berry", sprite: "occa-berry.png", tag: "berry", holderEligible: true },
  { id: 6, label: "Babiri Berry", sprite: "babiri-berry.png", tag: "berry", holderEligible: false },
  { id: 7, label: "Hearthflame Mask", sprite: "hearthflame-mask.png", tag: "exclusive", formTrigger: true, holderEligible: true },
  { id: 8, label: "Cornerstone Mask", sprite: "cornerstone-mask.png", tag: "exclusive", formTrigger: true, holderEligible: true },
  { id: 9, label: "Black Glasses", sprite: "black-glasses.png", tag: "power", holderEligible: false },
  { id: 10, label: "Adamant Orb", sprite: "adamant-orb.png", tag: "exclusive", holderEligible: false },
]

function filterItems(items: MockItem[], query: string, tag: Tag | null) {
  const q = query.trim().toLowerCase()
  return items.filter((item) => {
    if (!item.holderEligible) return false
    if (tag && item.tag !== tag) return false
    if (q && !item.label.toLowerCase().includes(q)) return false
    return true
  })
}

function DialogShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto flex h-[min(40rem,calc(100svh-12rem))] max-w-xl flex-col overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-hud-panel">
      <header className="shrink-0 border-b px-4 py-3">
        <h2 className="text-base font-extrabold">{title}</h2>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  )
}

export function HeldItemPickerPrototype() {
  const intl = useIntl()
  const searchId = useId()
  const [query, setQuery] = useState("")
  const [tag, setTag] = useState<Tag | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [lastAction, setLastAction] = useState("open")

  const filtered = useMemo(() => filterItems(MOCK_ITEMS, query, tag), [query, tag])

  return (
    <main className="mx-auto max-w-2xl space-y-5 px-4 py-8 pb-16">
      <header className="space-y-2">
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
          Prototype · Held item picker
        </p>
        <h1 className="text-lg font-extrabold">B chrome + C tags (folded)</h1>
        <p className="text-sm text-muted-foreground">
          Holder filter is always on — ineligible mock rows stay hidden. No toggle.
        </p>
      </header>

      <DialogShell title="Add held item">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 space-y-2.5 border-b bg-token-bg/40 px-4 py-3">
            <div className="relative shrink-0">
              <Label htmlFor={searchId} className="sr-only">
                <FormattedMessage id="track.item.search" />
              </Label>
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id={searchId}
                value={query}
                placeholder={intl.formatMessage({ id: "track.item.search" })}
                className="pl-8"
                onChange={(event) => {
                  setQuery(event.target.value)
                  setLastAction(`query:${event.target.value || "(clear)"}`)
                }}
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5">
              <button
                type="button"
                aria-pressed={tag === null}
                className={cn(
                  "flex min-h-8 shrink-0 items-center rounded-full border-2 px-3 text-[11px] font-extrabold",
                  tag === null
                    ? "border-ink bg-ink text-paper"
                    : "border-card-border bg-paper text-muted-foreground hover:bg-token-bg/60",
                )}
                onClick={() => {
                  setTag(null)
                  setLastAction("tag:all")
                }}
              >
                <FormattedMessage id="track.item.tag.all" />
              </button>
              {TAGS.map((value) => {
                const pressed = tag === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={pressed}
                    className={cn(
                      "flex min-h-8 shrink-0 items-center rounded-full border-2 px-3 text-[11px] font-extrabold",
                      pressed
                        ? "border-ink bg-signal-yellow shadow-hud-chip"
                        : "border-card-border bg-paper hover:bg-token-bg/60",
                    )}
                    onClick={() => {
                      const next = pressed ? null : value
                      setTag(next)
                      setLastAction(`tag:${next ?? "all"}`)
                    }}
                  >
                    <FormattedMessage id={`track.item.tag.${value}`} />
                  </button>
                )
              })}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-1">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <FormattedMessage id="matchup.noMatches" />
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-2 py-2.5 text-left last:border-b-0 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring"
                  onClick={() => {
                    setSelectedId(item.id)
                    setLastAction(
                      item.formTrigger
                        ? `form-trigger:${item.label}`
                        : `select:${item.label}`,
                    )
                  }}
                >
                  <span className="grid size-7 place-items-center rounded-md bg-token-bg">
                    <img
                      src={`/items/${item.sprite}`}
                      alt=""
                      className="size-5 object-contain [image-rendering:pixelated]"
                    />
                  </span>
                  <span className="min-w-0 truncate text-sm font-medium">{item.label}</span>
                  {item.formTrigger ? (
                    <span className="rounded-[5px] bg-ink px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-paper">
                      FORM
                    </span>
                  ) : (
                    <span className="w-10" aria-hidden />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </DialogShell>

      <pre className="overflow-x-auto rounded-[10px] border border-dashed border-card-border bg-token-bg/50 p-3 text-[11px] leading-relaxed text-ink">
        {JSON.stringify({ query, tag, selectedId, lastAction, visible: filtered.length }, null, 2)}
      </pre>
    </main>
  )
}

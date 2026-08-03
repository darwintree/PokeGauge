import { ChevronDown, Plus, Swords } from "lucide-react"
import { useMemo, useState } from "react"
import { useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import type { CatalogMoveOption, MoveCategory } from "@/lib/catalog"
import type { MoveSnapshot } from "@/lib/move"
import { MovePickerDialog } from "./move-picker-dialog"
import type { MoveSnapshotPatch } from "./move-snapshot-row"
import { MoveSnapshotRow } from "./move-snapshot-row"
import { cn } from "@/lib/utils"

export type MoveTrackProps = {
  label: string
  options: CatalogMoveOption[]
  snapshots: MoveSnapshot[]
  selectedSnapshotIds: string[]
  onAdd: (moveId: number) => string | undefined
  onChange: (snapshotId: string, patch: MoveSnapshotPatch) => void
  onRemove: (snapshotId: string) => void
  onSelectionChange: (snapshotIds: string[]) => void
  expanded?: boolean
  onToggle?: () => void
  category?: MoveCategory
  onCategoryChange?: (category: MoveCategory) => void
}

function MoveCategoryControl({
  category,
  onChange,
}: {
  category: MoveCategory
  onChange: (category: MoveCategory) => void
}) {
  const intl = useIntl()

  return (
    <div
      role="group"
      aria-label={intl.formatMessage({ id: "track.moveSide" })}
      className="grid w-[5.5rem] grid-cols-2 gap-px rounded-md bg-muted p-0.5"
    >
      {(["physical", "special"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={category === value}
          className={cn(
            "h-8 rounded-[4px] px-1.5 text-[10px] font-medium transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-ring sm:h-6",
            category === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onChange(value)}
        >
          {intl.formatMessage({ id: `track.moveSide.${value}` })}
        </button>
      ))}
    </div>
  )
}

function MoveCategoryToggle({
  category,
  onChange,
}: {
  category: MoveCategory
  onChange: (category: MoveCategory) => void
}) {
  const intl = useIntl()

  return (
    <div
      role="group"
      aria-label={intl.formatMessage({ id: "track.moveSide" })}
      className="flex gap-1"
    >
      {(["physical", "special"] as const).map((value) => {
        const pressed = category === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={pressed}
            className={cn(
              "rounded-[9px] border-2 px-2 py-0.5 text-[10px] font-extrabold transition-colors",
              pressed
                ? "border-ink bg-signal-yellow shadow-hud-chip"
                : "border-card-border bg-paper hover:bg-token-bg/60",
            )}
            onClick={() => onChange(value)}
          >
            {intl.formatMessage({ id: `track.moveSide.${value}` })}
          </button>
        )
      })}
    </div>
  )
}

export function MoveTrack({
  label,
  options,
  snapshots,
  selectedSnapshotIds,
  onAdd,
  onChange,
  onRemove,
  onSelectionChange,
  expanded = true,
  onToggle = () => {},
  category = options[0]?.category ?? "physical",
  onCategoryChange = () => {},
}: MoveTrackProps) {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const optionById = useMemo(
    () => new Map(options.map((option) => [option.id, option])),
    [options],
  )
  const selectedIds = useMemo(() => new Set(selectedSnapshotIds), [selectedSnapshotIds])
  const selectedSnapshots = snapshots.filter((snapshot) => selectedIds.has(snapshot.id))
  function add(moveId: number) {
    const snapshotId = onAdd(moveId)
    if (snapshotId) setEditingId(snapshotId)
    if (!expanded) onToggle()
    setOpen(false)
  }

  function toggleSelection(snapshot: MoveSnapshot) {
    onSelectionChange(
      selectedIds.has(snapshot.id)
        ? selectedSnapshotIds.filter((id) => id !== snapshot.id)
        : [...selectedSnapshotIds, snapshot.id],
    )
  }

  function selectSnapshot(snapshotId: string) {
    setEditingId(snapshotId)
    if (!expanded) onToggle()
  }

  function removeSnapshot(snapshotId: string) {
    const index = snapshots.findIndex((snapshot) => snapshot.id === snapshotId)
    const next = snapshots[index + 1] ?? snapshots[index - 1]
    onRemove(snapshotId)
    setEditingId(next?.id ?? null)
  }

  return (
    <section className="overflow-hidden rounded-[14px] border-2 border-ink bg-paper shadow-hud-panel transition-colors">
      {!expanded ? (
        <>
          <div className="group relative flex h-11 items-center gap-2 px-2.5 sm:h-10">
            <button
              type="button"
              aria-expanded={false}
              aria-label={intl.formatMessage({ id: "track.move.expand" })}
              className="absolute inset-0 hover:bg-token-bg/60 active:bg-token-bg/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={onToggle}
            />
            <Swords
              className="pointer-events-none relative size-3.5 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
            />
            <span className="pointer-events-none relative text-xs font-extrabold">{label}</span>
            <div className="relative z-10 ml-auto">
              <MoveCategoryToggle
                category={category}
                onChange={(nextCategory) => {
                  onCategoryChange(nextCategory)
                  onToggle()
                }}
              />
            </div>
            <ChevronDown className="pointer-events-none relative size-3.5 shrink-0 text-muted-foreground" />
          </div>
          <div className="relative border-t px-2.5 py-2">
            <button
              type="button"
              aria-label={intl.formatMessage({ id: "track.move.expand" })}
              className="absolute inset-0 hover:bg-token-bg/60 active:bg-token-bg/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={onToggle}
            />
            {selectedSnapshots.length === 0 ? (
              <div className="relative flex h-7 items-center text-[11px] text-muted-foreground">
                {intl.formatMessage({ id: "track.move.noneSelected" })}
              </div>
            ) : (
              <div className="pointer-events-none relative flex flex-wrap gap-1.5">
                {selectedSnapshots.map((snapshot) => {
                  const option = optionById.get(snapshot.moveId)
                  if (!option) return null
                  return (
                    <button
                      key={snapshot.id}
                      type="button"
                      className="pointer-events-auto relative inline-flex max-w-full items-center gap-1 rounded-[9px] border-2 border-ink bg-signal-yellow px-1.5 py-0.5 shadow-hud-chip active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-ink"
                      onClick={() => selectSnapshot(snapshot.id)}
                    >
                      <TypeBadge type={option.type} />
                      <span className="truncate text-[11px] font-extrabold">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="group relative flex h-11 items-center gap-2 px-2.5 sm:h-10">
            <button
              type="button"
              aria-expanded={true}
              aria-label={intl.formatMessage({ id: "track.move.collapse" })}
              className="absolute inset-0 hover:bg-token-bg/60 active:bg-token-bg/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={onToggle}
            />
            <span className="pointer-events-none relative text-xs font-extrabold">{label}</span>
            <div className="relative z-10 ml-auto">
              <MoveCategoryControl
                category={category}
                onChange={onCategoryChange}
              />
            </div>
            <span className="pointer-events-none relative grid size-7 place-items-center text-muted-foreground transition-colors group-hover:text-foreground">
              <ChevronDown className="size-3.5 rotate-180 transition-transform" />
            </span>
          </div>
          <div className="border-t">
            {snapshots.map((snapshot) => {
              const option = optionById.get(snapshot.moveId)
              if (!option) return null
              return (
                <MoveSnapshotRow
                  key={snapshot.id}
                  snapshot={snapshot}
                  option={option}
                  selected={selectedIds.has(snapshot.id)}
                  editing={editingId === snapshot.id}
                  onToggle={() => toggleSelection(snapshot)}
                  onEdit={() =>
                    setEditingId((current) =>
                      current === snapshot.id ? null : snapshot.id,
                    )
                  }
                  onChange={(patch) => onChange(snapshot.id, patch)}
                  onRemove={() => removeSnapshot(snapshot.id)}
                />
              )
            })}
            <div className="border-t p-2">
              <button
                type="button"
                aria-label={intl.formatMessage({ id: "track.addMove" })}
                className="grid h-10 w-full place-items-center rounded-md border border-dashed border-muted-foreground/35 text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/60 hover:text-foreground active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-ring sm:h-8"
                onClick={() => setOpen(true)}
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      <MovePickerDialog
        open={open}
        onOpenChange={setOpen}
        label={label}
        options={options}
        query={query}
        onQueryChange={setQuery}
        onSelect={add}
      />
    </section>
  )
}

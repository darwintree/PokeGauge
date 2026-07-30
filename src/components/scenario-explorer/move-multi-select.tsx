import { Check, ChevronDown, Plus, Search, Swords, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { CatalogMoveOption, MoveCategory } from "@/lib/catalog/types"
import type { MoveSnapshot } from "@/lib/move-snapshot"
import { cn } from "@/lib/utils"

type MoveSnapshotPatch = Partial<
  Pick<MoveSnapshot, "power" | "accuracy" | "criticalStage" | "spread">
>

export type MoveMultiSelectProps = {
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

function moveMatches(option: CatalogMoveOption, query: string) {
  const q = query.trim().toLowerCase()
  return (
    !q ||
    option.label.toLowerCase().includes(q) ||
    option.moveName.toLowerCase().includes(q) ||
    String(option.id).includes(q)
  )
}

function CategoryControl({
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

function CategorySignalPills({
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

function SelectionToggle({
  option,
  selected,
  onToggle,
}: {
  option: CatalogMoveOption
  selected: boolean
  onToggle: () => void
}) {
  const intl = useIntl()

  return (
    <button
      type="button"
      aria-label={intl.formatMessage(
        { id: selected ? "track.move.moveToCandidates" : "track.move.select" },
        { move: option.label },
      )}
      aria-pressed={selected}
      className="group grid size-10 place-items-center rounded-md active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-ring sm:size-7"
      onClick={onToggle}
    >
      <span
        className={cn(
          "grid size-[18px] place-items-center rounded-[4px] border transition-colors",
          selected
            ? "border-foreground bg-foreground text-background"
            : "bg-background text-muted-foreground group-hover:border-foreground/50",
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={2.5} /> : null}
      </span>
    </button>
  )
}

function SnapshotEditor({
  snapshot,
  onChange,
  onRemove,
}: {
  snapshot: MoveSnapshot
  onChange: (patch: MoveSnapshotPatch) => void
  onRemove: () => void
}) {
  const intl = useIntl()
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const powerErrorId = `${snapshot.id}-power-error`
  const accuracyErrorId = `${snapshot.id}-accuracy-error`

  return (
    <div className="grid grid-cols-2 gap-2 bg-muted/40 p-2.5">
      <label className="space-y-1">
        <span className="text-[10px] text-muted-foreground">
          {intl.formatMessage({ id: "track.move.power" })}
        </span>
        <Input
          type="number"
          min={0}
          max={1000}
          step={1}
          value={snapshot.power}
          aria-invalid={snapshot.power === 0}
          aria-describedby={snapshot.power === 0 ? powerErrorId : undefined}
          className="h-7 text-xs tabular-nums"
          onChange={(event) => onChange({ power: Number(event.target.value) })}
        />
        {snapshot.power === 0 ? (
          <span id={powerErrorId} className="block text-xs text-destructive">
            {intl.formatMessage({ id: "track.move.powerRequired" })}
          </span>
        ) : null}
      </label>
      <label className="space-y-1">
        <span className="text-[10px] text-muted-foreground">
          {intl.formatMessage({ id: "track.move.accuracy" })}
        </span>
        <Input
          type="number"
          min={0}
          max={100}
          step={1}
          value={snapshot.accuracy}
          aria-invalid={snapshot.accuracy === 0}
          aria-describedby={snapshot.accuracy === 0 ? accuracyErrorId : undefined}
          className="h-7 text-xs tabular-nums"
          onChange={(event) => onChange({ accuracy: Number(event.target.value) })}
        />
        {snapshot.accuracy === 0 ? (
          <span id={accuracyErrorId} className="block text-xs text-destructive">
            {intl.formatMessage({ id: "track.move.accuracyRequired" })}
          </span>
        ) : null}
      </label>
      <label className="space-y-1">
        <span className="text-[10px] text-muted-foreground">
          {intl.formatMessage({ id: "track.move.criticalStage" })}
        </span>
        <select
          value={snapshot.criticalStage}
          className="h-7 w-full rounded-md border border-input bg-background px-2 text-xs"
          onChange={(event) =>
            onChange({
              criticalStage: Number(event.target.value) as MoveSnapshot["criticalStage"],
            })
          }
        >
          {[0, 1, 2, 3].map((stage) => (
            <option key={stage} value={stage}>
              +{stage}
            </option>
          ))}
        </select>
      </label>
      {snapshot.spreadEligible ? (
        <div className="space-y-1">
          <Label htmlFor={`${snapshot.id}-spread`} className="text-[10px] text-muted-foreground">
            {intl.formatMessage({ id: "track.move.spread" })}
          </Label>
          <div className="flex h-7 items-center gap-2">
            <Switch
              id={`${snapshot.id}-spread`}
              checked={snapshot.spread}
              onCheckedChange={(spread) => onChange({ spread })}
            />
            <span className="text-xs">
              {intl.formatMessage({
                id: snapshot.spread ? "track.move.spread.on" : "track.move.spread.off",
              })}
            </span>
          </div>
        </div>
      ) : null}
      <div
        className={cn(
          "flex items-end gap-1",
          snapshot.spreadEligible ? "col-span-2" : "",
        )}
      >
        <Button
          type="button"
          size="xs"
          variant={confirmingRemove ? "destructive" : "ghost"}
          className={cn(
            confirmingRemove ? "flex-1" : "w-full",
            !confirmingRemove ? "text-destructive hover:text-destructive" : "",
          )}
          onClick={() => (confirmingRemove ? onRemove() : setConfirmingRemove(true))}
        >
          <Trash2 />
          {intl.formatMessage({
            id: confirmingRemove ? "track.move.confirmRemove" : "track.move.remove",
          })}
        </Button>
        {confirmingRemove ? (
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={() => setConfirmingRemove(false)}
          >
            {intl.formatMessage({ id: "template.cancel" })}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function MoveRow({
  snapshot,
  option,
  selected,
  editing,
  onToggle,
  onEdit,
  onChange,
  onRemove,
}: {
  snapshot: MoveSnapshot
  option: CatalogMoveOption
  selected: boolean
  editing: boolean
  onToggle: () => void
  onEdit: () => void
  onChange: (patch: MoveSnapshotPatch) => void
  onRemove: () => void
}) {
  const intl = useIntl()

  return (
    <div className="border-t first:border-t-0">
      <div className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center sm:min-h-8">
        <button
          type="button"
          aria-expanded={editing}
          aria-label={intl.formatMessage({ id: "track.move.edit" }, { move: option.label })}
          className="grid h-full min-h-11 min-w-0 grid-cols-[auto_minmax(0,1fr)_2rem_2rem_auto] items-center gap-2 px-2.5 text-left hover:bg-muted/60 active:bg-muted/80 focus-visible:outline-2 focus-visible:outline-ring sm:min-h-8"
          onClick={onEdit}
        >
          <TypeBadge type={option.type} />
          <span className="truncate text-xs font-medium">{option.label}</span>
          <span
            className={cn(
              "text-right text-[10px] tabular-nums",
              snapshot.power === 0 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {snapshot.power || "-"}
            {snapshot.power === 0 ? (
              <span className="sr-only">
                {intl.formatMessage({ id: "track.move.powerRequired" })}
              </span>
            ) : null}
          </span>
          <span
            className={cn(
              "text-right text-[10px] tabular-nums",
              snapshot.accuracy === 0 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {snapshot.accuracy || "-"}
            {snapshot.accuracy === 0 ? (
              <span className="sr-only">
                {intl.formatMessage({ id: "track.move.accuracyRequired" })}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={cn(
              "size-3 text-muted-foreground transition-transform",
              editing ? "rotate-180" : "",
            )}
          />
        </button>
        <SelectionToggle
          option={option}
          selected={selected}
          onToggle={onToggle}
        />
      </div>
      {editing ? (
        <SnapshotEditor snapshot={snapshot} onChange={onChange} onRemove={onRemove} />
      ) : null}
    </div>
  )
}

export function MoveMultiSelect({
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
}: MoveMultiSelectProps) {
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
  const filteredOptions = useMemo(
    () => options.filter((option) => moveMatches(option, query)),
    [options, query],
  )

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
              <CategorySignalPills
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
              <CategoryControl
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
                <MoveRow
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bottom-0 top-auto left-0 h-[min(44rem,calc(100svh-1rem))] max-w-none grid-rows-[auto_auto_minmax(0,1fr)] gap-0 overflow-hidden translate-x-0 translate-y-0 rounded-b-none p-0 sm:top-1/2 sm:left-1/2 sm:h-[min(44rem,calc(100svh-2rem))] sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
          <DialogHeader className="border-b px-4 py-3 pr-12">
            <DialogTitle>{intl.formatMessage({ id: "track.addMove" })}</DialogTitle>
          </DialogHeader>
          <div className="relative m-3 mb-2">
            <Label htmlFor="move-search" className="sr-only">
              {intl.formatMessage({ id: "track.move.search" })}
            </Label>
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="move-search"
              value={query}
              placeholder={intl.formatMessage({ id: "track.move.search" })}
              className="pl-8"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="min-h-0 overflow-y-auto p-3 pt-1">
            <div className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b bg-background/95 px-1 py-1.5 text-[10px] text-muted-foreground backdrop-blur-sm">
              <span />
              <span>{label}</span>
              <span className="tabular-nums">
                {intl.formatMessage({ id: "track.move.power" })} /{" "}
                {intl.formatMessage({ id: "track.move.accuracy" })}
              </span>
            </div>
            {filteredOptions.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <FormattedMessage id="matchup.noMatches" />
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-1 py-2.5 text-left last:border-b-0 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring"
                  onClick={() => add(option.id)}
                >
                  <TypeBadge type={option.type} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{option.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {option.moveName}
                    </span>
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {option.power || "-"} / {option.accuracy ?? "-"}
                  </span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

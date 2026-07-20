import { Crosshair, Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
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
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import { cn } from "@/lib/utils"

import { TrackCard } from "./track-card"

type MoveSnapshotPatch = Partial<
  Pick<MoveSnapshot, "power" | "accuracy" | "criticalStage" | "spread">
>

type MoveMultiSelectProps = {
  label: string
  options: CatalogMoveOption[]
  snapshots: MoveSnapshot[]
  onAdd: (moveId: number) => void
  onChange: (snapshotId: string, patch: MoveSnapshotPatch) => void
  onRemove: (snapshotId: string) => void
  expanded?: boolean
  onToggle?: () => void
  category?: MoveCategory
  onCategoryChange?: (category: MoveCategory) => void
}

function moveMatches(option: CatalogMoveOption, query: string, typeFilter: PokemonType | null) {
  const q = query.trim().toLowerCase()
  return (
    (!q ||
      option.label.toLowerCase().includes(q) ||
      option.moveName.toLowerCase().includes(q) ||
      String(option.id).includes(q)) &&
    (!typeFilter || option.type === typeFilter)
  )
}

function MoveMeta({ option }: { option: CatalogMoveOption }) {
  return (
    <span className="text-muted-foreground grid w-28 shrink-0 grid-cols-[1fr_2.25rem_2.25rem] items-center text-right text-xs tabular-nums">
      {option.isSpread ? (
        <span className="rounded-sm border px-1 text-[10px]">AoE</span>
      ) : (
        <span />
      )}
      <span>{option.power}</span>
      <span>{option.accuracy ?? "-"}</span>
    </span>
  )
}

function SnapshotSummary({
  snapshot,
  option,
}: {
  snapshot: MoveSnapshot
  option: CatalogMoveOption
}) {
  const intl = useIntl()

  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-xs tabular-nums">
        {intl.formatMessage({ id: "track.move.power" })} {snapshot.power || "—"} ·{" "}
        {intl.formatMessage({ id: "track.move.accuracy" })} {snapshot.accuracy || "—"}%
        {snapshot.alwaysHits ? ` · ${intl.formatMessage({ id: "track.move.alwaysHits" })}` : ""}
      </p>
      <p className="text-muted-foreground text-[10px]">
        {intl.formatMessage({ id: `track.moveSide.${option.category}` })}
      </p>
    </div>
  )
}

function SnapshotEditor({
  snapshot,
  option,
  onChange,
  onRemove,
}: {
  snapshot: MoveSnapshot
  option: CatalogMoveOption
  onChange: (patch: MoveSnapshotPatch) => void
  onRemove: () => void
}) {
  const intl = useIntl()
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const powerErrorId = `${snapshot.id}-power-error`
  const accuracyErrorId = `${snapshot.id}-accuracy-error`

  return (
    <div className="space-y-3">
      <SnapshotSummary snapshot={snapshot} option={option} />
      <div className="grid grid-cols-2 gap-3 border-t pt-3">
        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">
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
            onChange={(event) => onChange({ power: Number(event.target.value) })}
          />
          {snapshot.power === 0 && (
            <span id={powerErrorId} className="text-destructive block text-xs">
              {intl.formatMessage({ id: "track.move.powerRequired" })}
            </span>
          )}
        </label>
        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">
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
            onChange={(event) => onChange({ accuracy: Number(event.target.value) })}
          />
          {snapshot.accuracy === 0 && (
            <span id={accuracyErrorId} className="text-destructive block text-xs">
              {intl.formatMessage({ id: "track.move.accuracyRequired" })}
            </span>
          )}
        </label>
        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">
            {intl.formatMessage({ id: "track.move.criticalStage" })}
          </span>
          <select
            value={snapshot.criticalStage}
            onChange={(event) =>
              onChange({
                criticalStage: Number(event.target.value) as MoveSnapshot["criticalStage"],
              })
            }
            className="border-input bg-background h-8 w-full rounded-lg border px-2 text-sm"
          >
            {[0, 1, 2, 3].map((stage) => (
              <option key={stage} value={stage}>
                +{stage}
              </option>
            ))}
          </select>
        </label>
        {snapshot.spreadEligible && (
          <div className="space-y-1">
            <Label htmlFor={`${snapshot.id}-spread`} className="text-muted-foreground text-xs">
              {intl.formatMessage({ id: "track.move.spread" })}
            </Label>
            <div className="flex h-8 items-center gap-2">
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
        )}
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Button
          type="button"
          size="xs"
          variant="destructive"
          className={confirmingRemove ? "" : "col-span-2"}
          onClick={() => (confirmingRemove ? onRemove() : setConfirmingRemove(true))}
        >
          <Trash2 />
          {intl.formatMessage({
            id: confirmingRemove ? "track.move.confirmRemove" : "track.move.remove",
          })}
        </Button>
        {confirmingRemove && (
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={() => setConfirmingRemove(false)}
          >
            {intl.formatMessage({ id: "template.cancel" })}
          </Button>
        )}
      </div>
    </div>
  )
}

export function MoveMultiSelect({
  label,
  options,
  snapshots,
  onAdd,
  onChange,
  onRemove,
  expanded = true,
  onToggle = () => {},
  category = options[0]?.category ?? "physical",
  onCategoryChange = () => {},
}: MoveMultiSelectProps) {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null)
  const previousSnapshotIds = useRef(new Set(snapshots.map((snapshot) => snapshot.id)))
  const optionById = useMemo(
    () => new Map(options.map((option) => [option.id, option])),
    [options],
  )
  const filteredOptions = useMemo(
    () => options.filter((option) => moveMatches(option, query, typeFilter)),
    [options, query, typeFilter],
  )
  const editingSnapshot =
    snapshots.find((snapshot) => snapshot.id === editingId) ?? snapshots[0]
  const editingOption = editingSnapshot && optionById.get(editingSnapshot.moveId)

  useEffect(() => {
    const added = snapshots.find((snapshot) => !previousSnapshotIds.current.has(snapshot.id))
    if (added) setEditingId(added.id)
    previousSnapshotIds.current = new Set(snapshots.map((snapshot) => snapshot.id))
  }, [snapshots])

  function add(moveId: number) {
    onAdd(moveId)
    setOpen(false)
  }

  function selectSnapshot(id: string) {
    setEditingId(id)
    if (!expanded) onToggle()
  }

  function removeEditingSnapshot() {
    if (!editingSnapshot) return
    const index = snapshots.findIndex((snapshot) => snapshot.id === editingSnapshot.id)
    const next = snapshots[index + 1] ?? snapshots[index - 1]
    onRemove(editingSnapshot.id)
    setEditingId(next?.id ?? null)
  }

  return (
    <TrackCard
      icon={Crosshair}
      label={label}
      summary={`${snapshots.length}`}
      expanded={expanded}
      onToggle={onToggle}
      preview={
        <div className="grid grid-cols-2 gap-1.5">
          {snapshots.map((snapshot) => {
            const option = optionById.get(snapshot.moveId)
            if (!option) return null
            return (
              <button
                key={snapshot.id}
                type="button"
                aria-pressed={expanded && editingSnapshot?.id === snapshot.id}
                className="hover:bg-muted aria-pressed:bg-muted flex min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left"
                onClick={() => selectSnapshot(snapshot.id)}
              >
                <TypeBadge type={option.type} />
                <span className="truncate text-xs font-medium">{option.label}</span>
              </button>
            )
          })}
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-2 rounded-lg border bg-background p-0.5">
            {(["physical", "special"] as const).map((nextCategory) => (
              <Button
                key={nextCategory}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={category === nextCategory}
                className={cn("h-7 rounded-md px-2 text-xs", category === nextCategory && "bg-muted")}
                onClick={() => onCategoryChange(nextCategory)}
              >
                {intl.formatMessage({ id: `track.moveSide.${nextCategory}` })}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setOpen(true)}
          >
            <Plus />
            {intl.formatMessage({ id: "track.addMove" })}
          </Button>
        </div>

        {editingSnapshot && editingOption && (
          <SnapshotEditor
            key={editingSnapshot.id}
            snapshot={editingSnapshot}
            option={editingOption}
            onChange={(patch) => onChange(editingSnapshot.id, patch)}
            onRemove={removeEditingSnapshot}
          />
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bottom-0 top-auto left-0 h-[min(44rem,calc(100svh-1rem))] max-w-none grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden translate-x-0 translate-y-0 rounded-b-none p-0 sm:top-1/2 sm:left-1/2 sm:h-[min(44rem,calc(100svh-2rem))] sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
            <DialogHeader className="border-b px-4 py-3 pr-12">
              <DialogTitle>{label}</DialogTitle>
            </DialogHeader>
            <div className="flex min-h-0 flex-col gap-3 p-4">
              <div className="relative shrink-0">
                <Label htmlFor="move-search" className="sr-only">
                  {intl.formatMessage({ id: "track.move.search" })}
                </Label>
                <Search
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                  aria-hidden
                />
                <Input
                  id="move-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={intl.formatMessage({ id: "track.move.search" })}
                  className="pl-8"
                />
              </div>
              <div className="flex shrink-0 flex-wrap gap-1">
                {POKEMON_TYPES.map((type) => {
                  const pressed = typeFilter === type
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={pressed}
                      aria-label={intl.formatMessage({ id: `type.${type}` })}
                      className={cn(
                        "rounded border border-input bg-background px-1.5 py-1 transition-colors hover:bg-muted",
                        pressed && "border-foreground bg-muted",
                      )}
                      onClick={() => setTypeFilter(pressed ? null : type)}
                    >
                      <TypeBadge type={type} />
                    </button>
                  )
                })}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-lg border">
                <div className="bg-muted/90 text-muted-foreground sticky top-0 z-10 flex items-center gap-3 border-b px-3 py-1.5 text-[10px] backdrop-blur-sm">
                  <span className="flex-1" />
                  <span className="grid w-28 shrink-0 grid-cols-[1fr_2.25rem_2.25rem] text-right">
                    <span />
                    <span>{intl.formatMessage({ id: "track.move.power" })}</span>
                    <span>{intl.formatMessage({ id: "track.move.accuracy" })}</span>
                  </span>
                </div>
                {filteredOptions.length === 0 ? (
                  <div className="text-muted-foreground p-6 text-center text-sm">
                    <FormattedMessage id="matchup.noMatches" />
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="hover:bg-muted flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0"
                      onClick={() => add(option.id)}
                    >
                      <TypeBadge type={option.type} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{option.label}</span>
                        <span className="text-muted-foreground block truncate text-xs">
                          {option.moveName}
                        </span>
                      </span>
                      <MoveMeta option={option} />
                    </button>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TrackCard>
  )
}

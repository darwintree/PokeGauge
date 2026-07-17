import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Badge } from "@/components/ui/badge"
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
import type { CatalogMoveOption } from "@/lib/catalog/types"
import type { MoveSnapshot } from "@/lib/move-snapshot"
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import { cn } from "@/lib/utils"

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
    <span className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs tabular-nums">
      {option.isSpread && <span className="rounded-sm border px-1 text-[10px]">AoE</span>}
      <span>{option.power}</span>
      <span>{option.accuracy ?? "-"}</span>
    </span>
  )
}

function criticalMessageId(stage: MoveSnapshot["criticalStage"]) {
  if (stage === 3) return "track.move.crit.guaranteed"
  if (stage > 0) return "track.move.crit.easy"
  return "track.move.crit.normal"
}

function spreadMessageId(snapshot: MoveSnapshot) {
  if (!snapshot.spreadEligible) return "track.move.spread.single"
  return snapshot.spread ? "track.move.spread.on" : "track.move.spread.off"
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
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline">
          {intl.formatMessage({ id: `track.moveSide.${option.category}` })}
        </Badge>
        <Badge variant="outline">
          {intl.formatMessage({ id: spreadMessageId(snapshot) })}
        </Badge>
        <Badge variant="outline">
          {intl.formatMessage({ id: criticalMessageId(snapshot.criticalStage) })}
        </Badge>
        {snapshot.power === 0 && (
          <Badge variant="destructive">
            {intl.formatMessage({ id: "track.move.powerRequired" })}
          </Badge>
        )}
        {snapshot.accuracy === 0 && !snapshot.alwaysHits && (
          <Badge variant="destructive">
            {intl.formatMessage({ id: "track.move.accuracyRequired" })}
          </Badge>
        )}
      </div>
    </div>
  )
}

function SnapshotEditor({
  snapshot,
  option,
  onBack,
  onChange,
  onRemove,
}: {
  snapshot: MoveSnapshot
  option: CatalogMoveOption
  onBack: () => void
  onChange: (patch: MoveSnapshotPatch) => void
  onRemove: () => void
}) {
  const intl = useIntl()
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const powerErrorId = `${snapshot.id}-power-error`
  const accuracyErrorId = `${snapshot.id}-accuracy-error`

  return (
    <div className="space-y-3">
      <Button type="button" size="xs" variant="ghost" autoFocus onClick={onBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: "track.move.back" })}
      </Button>
      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <TypeBadge type={option.type} />
          <span className="min-w-0 truncate text-sm font-medium">{option.label}</span>
        </div>
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
                onChange({ criticalStage: Number(event.target.value) as MoveSnapshot["criticalStage"] })
              }
              className="border-input bg-background h-8 w-full rounded-lg border px-2 text-sm"
            >
              {[0, 1, 2, 3].map((stage) => (
                <option key={stage} value={stage}>+{stage}</option>
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
            onClick={() => confirmingRemove ? onRemove() : setConfirmingRemove(true)}
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
}: MoveMultiSelectProps) {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null)
  const optionById = useMemo(
    () => new Map(options.map((option) => [option.id, option])),
    [options],
  )
  const filteredOptions = useMemo(
    () => options.filter((option) => moveMatches(option, query, typeFilter)),
    [options, query, typeFilter],
  )
  const editingSnapshot = snapshots.find((snapshot) => snapshot.id === editingId)
  const editingOption = editingSnapshot && optionById.get(editingSnapshot.moveId)

  function add(moveId: number) {
    onAdd(moveId)
    setOpen(false)
  }

  if (editingSnapshot && editingOption) {
    return (
      <SnapshotEditor
        key={editingSnapshot.id}
        snapshot={editingSnapshot}
        option={editingOption}
        onBack={() => setEditingId(null)}
        onChange={(patch) => onChange(editingSnapshot.id, patch)}
        onRemove={() => {
          onRemove(editingSnapshot.id)
          setEditingId(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-muted-foreground text-xs">{label}</Label>
        <Button type="button" variant="outline" size="sm" className="h-7" onClick={() => setOpen(true)}>
          <Plus />
          {intl.formatMessage({ id: "track.addMove" })}
        </Button>
      </div>

      <ul className="overflow-hidden rounded-lg border">
        {snapshots.map((snapshot) => {
          const option = optionById.get(snapshot.moveId)
          if (!option) return null
          return (
            <li key={snapshot.id} className="border-b last:border-b-0">
              <button
                type="button"
                className="hover:bg-muted flex w-full items-center gap-2 px-2 py-2 text-left"
                onClick={() => setEditingId(snapshot.id)}
              >
                <TypeBadge type={option.type} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{option.label}</span>
                  <SnapshotSummary snapshot={snapshot} option={option} />
                </span>
                <ChevronRight className="text-muted-foreground size-4 shrink-0" />
              </button>
            </li>
          )
        })}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bottom-0 top-auto left-0 max-w-none translate-x-0 translate-y-0 rounded-b-none sm:top-1/2 sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
          <DialogHeader><DialogTitle>{label}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="move-search">{intl.formatMessage({ id: "track.move.search" })}</Label>
            <Input
              id="move-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={intl.formatMessage({ id: "track.addMove" })}
            />
            <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
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
            <div className="max-h-[55svh] overflow-y-auto rounded-lg border">
              {filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="hover:bg-muted flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0"
                  onClick={() => add(option.id)}
                >
                  <TypeBadge type={option.type} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{option.label}</span>
                    <span className="text-muted-foreground block truncate text-xs">{option.moveName}</span>
                  </span>
                  <MoveMeta option={option} />
                  <Search className="text-muted-foreground size-3.5" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

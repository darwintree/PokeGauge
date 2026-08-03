import { Check, ChevronDown, Trash2 } from "lucide-react"
import { useState } from "react"
import { useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { CatalogMoveOption } from "@/lib/catalog"
import type { MoveSnapshot } from "@/lib/move"
import { cn } from "@/lib/utils"

export type MoveSnapshotPatch = Partial<
  Pick<MoveSnapshot, "power" | "accuracy" | "criticalStage" | "spread">
>

function MoveSnapshotEditor({
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
            {intl.formatMessage({ id: "action.cancel" })}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function MoveSelectionToggle({
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

export function MoveSnapshotRow({
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
        <MoveSelectionToggle
          option={option}
          selected={selected}
          onToggle={onToggle}
        />
      </div>
      {editing ? (
        <MoveSnapshotEditor snapshot={snapshot} onChange={onChange} onRemove={onRemove} />
      ) : null}
    </div>
  )
}

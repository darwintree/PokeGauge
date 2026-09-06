import { ChevronDown, Plus, Swords } from "lucide-react"
import { useMemo, useState } from "react"
import { useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { CatalogMoveOption, MoveCategory } from "@/lib/catalog"
import type { MoveSnapshot } from "@/lib/move"
import type { PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"
import { TrackOption, TrackOptionAdd, TrackOptionGroup } from "../common/track-option"
import { MovePickerDialog } from "./move-picker-dialog"
import type { MoveSnapshotPatch } from "./move-snapshot-row"
import { MoveSnapshotRow } from "./move-snapshot-row"

export type MoveTrackProps = {
  label: string
  attackerId: BattlePokemonId
  attackerTypes: readonly PokemonType[]
  defenderTypes: readonly PokemonType[]
  options: CatalogMoveOption[]
  learnableOptions?: CatalogMoveOption[]
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
    <ToggleGroup
      value={[category]}
      onValueChange={(value) => {
        if (value[0] === "physical" || value[0] === "special") onChange(value[0])
      }}
      aria-label={intl.formatMessage({ id: "track.moveSide" })}
      className="gap-1"
    >
      {(["physical", "special"] as const).map((value) => (
        <ToggleGroupItem
          key={value}
          value={value}
          variant="hud"
          className="h-6 min-h-0! min-w-0 rounded-[9px] px-2 py-0.5 text-[10px] font-extrabold"
        >
          {intl.formatMessage({ id: `track.moveSide.${value}` })}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export function MoveTrack({
  label,
  attackerId,
  attackerTypes,
  defenderTypes,
  options,
  learnableOptions = options,
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
  const optionById = useMemo(
    () => new Map(options.map((option) => [option.id, option])),
    [options],
  )
  const selectedIds = useMemo(() => new Set(selectedSnapshotIds), [selectedSnapshotIds])
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

  function removeSnapshot(snapshotId: string) {
    const index = snapshots.findIndex((snapshot) => snapshot.id === snapshotId)
    const next = snapshots[index + 1] ?? snapshots[index - 1]
    onRemove(snapshotId)
    setEditingId(next?.id ?? null)
  }

  return (
    <section className="track-panel">
      <div className="track-panel-heading group relative flex min-h-11 items-center gap-2 px-3">
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={intl.formatMessage({ id: expanded ? "track.move.collapse" : "track.move.expand" })}
          className="absolute inset-0 hover:bg-token-bg/60 active:bg-token-bg/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          onClick={onToggle}
        />
        <Swords
          className="pointer-events-none relative size-3.5 shrink-0 text-muted-foreground"
          strokeWidth={1.75}
        />
        <span className="pointer-events-none relative text-xs font-extrabold">{label}</span>
        <div className="relative z-10 ml-auto">
          <MoveCategoryControl
            category={category}
            onChange={onCategoryChange}
          />
        </div>
        <ChevronDown
          className={cn(
            "pointer-events-none relative size-3.5 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </div>
      {!expanded ? (
        <>
          <div className="track-panel-pool relative px-3 pb-3">
            <button
              type="button"
              aria-label={intl.formatMessage({ id: "track.move.expand" })}
              className="absolute inset-0 hover:bg-token-bg/60 active:bg-token-bg/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={onToggle}
            />
            <TrackOptionGroup
              aria-label={label}
              className="pointer-events-none relative"
            >
              {snapshots.length === 0 ? (
                <span className="flex h-7 items-center text-[11px] text-muted-foreground">
                  {intl.formatMessage({ id: "track.move.noneSelected" })}
                </span>
              ) : snapshots.map((snapshot) => {
                const option = optionById.get(snapshot.moveId)
                if (!option) return null
                return (
                  <TrackOption
                    key={snapshot.id}
                    layout="text"
                    pressed={selectedIds.has(snapshot.id)}
                    className="pointer-events-auto max-w-full px-1.5"
                    ariaLabel={option.label}
                    onToggle={() => toggleSelection(snapshot)}
                  >
                    <TypeBadge type={option.type} />
                    <span className="min-w-0 text-left">{option.label}</span>
                  </TrackOption>
                )
              })}
              <TrackOptionAdd
                layout="text"
                className="pointer-events-auto relative z-10"
                ariaLabel={intl.formatMessage({ id: "track.addMove" })}
                onClick={() => setOpen(true)}
              />
            </TrackOptionGroup>
          </div>
        </>
      ) : (
        <>
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
        attackerId={attackerId}
        moveCategory={category}
        attackerTypes={attackerTypes}
        defenderTypes={defenderTypes}
        options={options}
        learnableMoveIds={learnableOptions.map((option) => option.id)}
        onSelect={add}
      />
    </section>
  )
}

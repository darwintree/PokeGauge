import { CircleSlash, Plus, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import {
  ALL_TYPE_BOOST_IDS,
  buildVisibleItemIds,
  coreItemIds,
  defaultStabBoostIds,
  itemAriaLabel,
  itemSprite,
  loadAddedBoostIds,
  removeAddedBoostId,
  saveAddedBoostId,
  typeFromBoostId,
} from "@/lib/held-item"
import type { MatchupCatalog } from "@/lib/catalog"
import { cn } from "@/lib/utils"

import { orderedPoolSelection } from "../config-multi-select"

type HeldItemTrackProps = {
  catalog: MatchupCatalog
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

function ItemTile({
  id,
  selected,
  dashed,
  onRemove,
  onClick,
}: {
  id: string
  selected: boolean
  dashed?: boolean
  onRemove?: () => void
  onClick: () => void
}) {
  const sprite = itemSprite(id)

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={itemAriaLabel(id)}
        aria-pressed={selected}
        onClick={onClick}
        className={cn(
          "size-9 rounded-md border p-1 transition-colors",
          selected
            ? "border-primary bg-primary/15"
            : "border-border hover:bg-muted/40",
          dashed && !selected && "border-dashed",
        )}
      >
        {sprite ? (
          <img src={`/items/${sprite}`} alt="" className="size-6 object-contain" />
        ) : (
          <CircleSlash className="size-6 text-[#94a3b8]" aria-hidden />
        )}
      </button>
      {onRemove && (
        <button
          type="button"
          aria-label={`移除 ${itemAriaLabel(id)}`}
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
          className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:border-destructive hover:text-destructive"
        >
          <X className="size-2" />
        </button>
      )}
    </div>
  )
}

export function HeldItemTrack({ catalog, selectedIds, onChange }: HeldItemTrackProps) {
  const attackerId = catalog.matchup.attackerId
  const [addedBoostIds, setAddedBoostIds] = useState<string[]>(() =>
    loadAddedBoostIds(attackerId),
  )
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    setAddedBoostIds(loadAddedBoostIds(attackerId))
    setPickerOpen(false)
  }, [attackerId])

  const stabBoostIds = defaultStabBoostIds(catalog.attackerTypes)
  const visibleIds = useMemo(
    () =>
      buildVisibleItemIds(
        coreItemIds(catalog.moveCategory),
        catalog.attackerTypes,
        addedBoostIds,
      ),
    [catalog.moveCategory, catalog.attackerTypes, addedBoostIds],
  )
  const addableIds = useMemo(() => {
    const visible = new Set(visibleIds)
    return ALL_TYPE_BOOST_IDS.filter((id) => !visible.has(id))
  }, [visibleIds])

  function applySelection(pool: readonly string[], next: string[]) {
    onChange(orderedPoolSelection(pool, next.length === 0 ? ["none"] : next))
  }

  function toggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((itemId) => itemId !== id)
      : [...selectedIds, id]
    applySelection(visibleIds, next)
  }

  function addBoost(id: string) {
    saveAddedBoostId(attackerId, id)
    setAddedBoostIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setPickerOpen(false)
  }

  function removeBoost(id: string) {
    removeAddedBoostId(attackerId, id)
    const nextAdded = addedBoostIds.filter((itemId) => itemId !== id)
    setAddedBoostIds(nextAdded)
    applySelection(
      buildVisibleItemIds(
        coreItemIds(catalog.moveCategory),
        catalog.attackerTypes,
        nextAdded,
      ),
      selectedIds.filter((itemId) => itemId !== id),
    )
  }

  return (
    <div className="space-y-2" role="group" aria-label="道具">
      <div className="flex flex-wrap gap-1.5">
        {visibleIds.map((id) => {
          const removable = addedBoostIds.includes(id)
          return (
            <ItemTile
              key={id}
              id={id}
              selected={selectedIds.includes(id)}
              dashed={typeFromBoostId(id) != null && !stabBoostIds.includes(id)}
              onClick={() => toggle(id)}
              onRemove={removable ? () => removeBoost(id) : undefined}
            />
          )
        })}
        {addableIds.length > 0 && (
          <button
            type="button"
            aria-label="添加属性强化道具"
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((open) => !open)}
            className={cn(
              "flex size-9 items-center justify-center rounded-md border border-dashed border-border transition-colors hover:bg-muted/40",
              pickerOpen && "border-primary bg-primary/15",
            )}
          >
            <Plus className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>
      {pickerOpen && addableIds.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5 rounded-md border bg-muted/20 p-2">
          {addableIds.map((id) => (
            <ItemTile key={id} id={id} selected={false} dashed onClick={() => addBoost(id)} />
          ))}
        </div>
      )}
    </div>
  )
}

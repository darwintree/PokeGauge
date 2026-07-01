import { CircleSlash } from "lucide-react"
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
import { orderedPoolSelection } from "@/lib/ordered-pool-selection"

import {
  TrackOption,
  TrackOptionAdd,
  TrackOptionGroup,
  type TrackOptionModifier,
} from "../track-option"

type HeldItemTrackProps = {
  catalog: MatchupCatalog
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

function itemModifier(
  id: string,
  stabBoostIds: string[],
  addedBoostIds: string[],
): TrackOptionModifier {
  if (typeFromBoostId(id) == null) return { kind: "core" }
  if (addedBoostIds.includes(id)) return { kind: "added-boost" }
  if (stabBoostIds.includes(id)) return { kind: "stab-boost" }
  return { kind: "added-boost" }
}

function ItemIcon({ id }: { id: string }) {
  const sprite = itemSprite(id)
  if (sprite) {
    return <img src={`/items/${sprite}`} alt="" className="size-6 object-contain" />
  }
  return <CircleSlash className="size-6 text-[#94a3b8]" aria-hidden />
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
    <div className="space-y-2">
      <TrackOptionGroup aria-label="道具">
        {visibleIds.map((id) => {
          const removable = addedBoostIds.includes(id)
          return (
            <TrackOption
              key={id}
              layout="icon"
              pressed={selectedIds.includes(id)}
              ariaLabel={itemAriaLabel(id)}
              modifier={itemModifier(id, stabBoostIds, addedBoostIds)}
              onToggle={() => toggle(id)}
              actions={
                removable
                  ? [
                      {
                        kind: "remove",
                        label: `移除 ${itemAriaLabel(id)}`,
                        position: "top-right",
                        onClick: () => removeBoost(id),
                      },
                    ]
                  : undefined
              }
            >
              <ItemIcon id={id} />
            </TrackOption>
          )
        })}
        {addableIds.length > 0 && (
          <TrackOptionAdd
            ariaLabel="添加属性强化道具"
            pressed={pickerOpen}
            onClick={() => setPickerOpen((open) => !open)}
          />
        )}
      </TrackOptionGroup>
      {pickerOpen && addableIds.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5 rounded-md border bg-muted/20 p-2">
          {addableIds.map((id) => (
            <TrackOption
              key={id}
              layout="icon"
              pressed={false}
              ariaLabel={itemAriaLabel(id)}
              modifier={{ kind: "added-boost" }}
              onToggle={() => addBoost(id)}
            >
              <ItemIcon id={id} />
            </TrackOption>
          ))}
        </div>
      )}
    </div>
  )
}

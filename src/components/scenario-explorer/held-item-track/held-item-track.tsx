import { CircleSlash, Gem } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { FormattedMessage } from "react-intl"

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
import { cn } from "@/lib/utils"

import {
  TrackOption,
  TrackOptionAdd,
  TrackOptionGroup,
  type TrackOptionModifier,
} from "../track-option"
import { TrackCard } from "../track-card"

type HeldItemTrackProps = {
  catalog: MatchupCatalog
  selectedIds: string[]
  onChange: (ids: string[]) => void
  expanded?: boolean
  onToggle?: () => void
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

function ItemIcon({ id, className }: { id: string; className?: string }) {
  const sprite = itemSprite(id)
  if (sprite) {
    return <img src={`/items/${sprite}`} alt="" className={cn("size-6 object-contain", className)} />
  }
  return <CircleSlash className={cn("size-6 text-hud-muted/60", className)} aria-hidden />
}

export function HeldItemTrack({
  catalog,
  selectedIds,
  onChange,
  expanded = true,
  onToggle = () => {},
}: HeldItemTrackProps) {
  const attackerId = String(catalog.matchup.attackerId)
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
    <TrackCard
      icon={Gem}
      label={<FormattedMessage id="track.item" />}
      summary={
        <span className="flex items-center gap-1">
          {selectedIds.map((id) => (
            <span key={id} title={itemAriaLabel(id)}>
              <ItemIcon id={id} className="size-4" />
            </span>
          ))}
        </span>
      }
      expanded={expanded}
      onToggle={onToggle}
    >
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
    </TrackCard>
  )
}

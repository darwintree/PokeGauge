import { CircleSlash, Gem } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import {
  ALL_TYPE_BOOST_IDS,
  buildVisibleItemIds,
  coreItemIds,
  defaultStabBoostIds,
  itemAriaLabel,
  itemSprite,
  type HeldItemId,
  loadAddedBoostIds,
  removeAddedBoostId,
  saveAddedBoostId,
  typeFromBoostId,
} from "@/lib/held-item"
import type { MatchupCatalog } from "@/lib/catalog"
import type { SupportedLocale } from "@/lib/i18n"
import { isMegaStone } from "@/lib/mega"
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
  selectedIds: HeldItemId[]
  onChange: (ids: HeldItemId[]) => void
  side?: "attacker" | "defender"
  lockedId?: HeldItemId | null
  expanded?: boolean
  onToggle?: () => void
}

function itemModifier(
  id: HeldItemId,
  stabBoostIds: string[],
  addedBoostIds: string[],
): TrackOptionModifier {
  if (typeof id !== "string" || typeFromBoostId(id) == null) return { kind: "core" }
  if (addedBoostIds.includes(id)) return { kind: "added-boost" }
  if (stabBoostIds.includes(id)) return { kind: "stab-boost" }
  return { kind: "added-boost" }
}

function ItemIcon({ id, className }: { id: HeldItemId; className?: string }) {
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
  side = "attacker",
  lockedId = null,
  expanded = true,
  onToggle = () => {},
}: HeldItemTrackProps) {
  const intl = useIntl()
  const locale = intl.locale as SupportedLocale
  const ownerId = String(
    side === "attacker" ? catalog.matchup.attackerId : catalog.matchup.defenderId,
  )
  const storageId = side === "attacker" ? ownerId : `defender:${ownerId}`
  const [addedBoostIds, setAddedBoostIds] = useState<string[]>(() =>
    loadAddedBoostIds(storageId),
  )
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    setAddedBoostIds(loadAddedBoostIds(storageId))
    setPickerOpen(false)
  }, [storageId])

  const ownerTypes = side === "attacker" ? catalog.attackerTypes : catalog.defenderTypes
  const stabBoostIds = defaultStabBoostIds(ownerTypes)
  const visibleIds = useMemo(
    () =>
      lockedId ? [lockedId] : buildVisibleItemIds(
        coreItemIds(catalog.moveCategory),
        ownerTypes,
        addedBoostIds,
      ),
    [catalog.moveCategory, ownerTypes, addedBoostIds, lockedId],
  )
  const addableIds = useMemo(() => {
    const visible = new Set(visibleIds)
    return ALL_TYPE_BOOST_IDS.filter((id) => !visible.has(id))
  }, [visibleIds])

  function applySelection(pool: readonly HeldItemId[], next: HeldItemId[]) {
    onChange(orderedPoolSelection(pool, next.length === 0 ? ["none"] : next))
  }

  function toggle(id: HeldItemId) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((itemId) => itemId !== id)
      : [...selectedIds, id]
    applySelection(visibleIds, next)
  }

  function addBoost(id: string) {
    saveAddedBoostId(storageId, id)
    setAddedBoostIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setPickerOpen(false)
  }

  function removeBoost(id: string) {
    removeAddedBoostId(storageId, id)
    const nextAdded = addedBoostIds.filter((itemId) => itemId !== id)
    setAddedBoostIds(nextAdded)
    applySelection(
      buildVisibleItemIds(
        coreItemIds(catalog.moveCategory),
        ownerTypes,
        nextAdded,
      ),
      selectedIds.filter((itemId) => itemId !== id),
    )
  }

  return (
    <TrackCard
      icon={Gem}
      label={<FormattedMessage id={side === "attacker" ? "track.attackerItem" : "track.defenderItem"} />}
      summary={
        <span className="flex items-center gap-1">
          {selectedIds.map((id) => (
            <span key={id} title={itemAriaLabel(id, locale)}>
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
          const removable = typeof id === "string" && addedBoostIds.includes(id)
          return (
            <TrackOption
              key={id}
              layout="icon"
              pressed={selectedIds.includes(id)}
              disabled={lockedId !== null}
              ariaLabel={itemAriaLabel(id, locale)}
              modifier={itemModifier(id, stabBoostIds, addedBoostIds)}
              onToggle={() => toggle(id)}
              actions={
                removable && typeof id === "string"
                  ? [
                      {
                        kind: "remove",
                        label: `移除 ${itemAriaLabel(id, locale)}`,
                        position: "top-right",
                        onClick: () => removeBoost(id),
                      },
                    ]
                  : undefined
              }
            >
              {isMegaStone(id) && !itemSprite(id) ? <Gem className="size-6" /> : <ItemIcon id={id} />}
            </TrackOption>
          )
        })}
        {lockedId === null && addableIds.length > 0 && (
          <TrackOptionAdd
            ariaLabel="添加属性强化道具"
            pressed={pickerOpen}
            onClick={() => setPickerOpen((open) => !open)}
          />
        )}
        </TrackOptionGroup>
        {lockedId === null && pickerOpen && addableIds.length > 0 && (
          <div className="grid grid-cols-4 gap-1.5 rounded-md border bg-muted/20 p-2">
            {addableIds.map((id) => (
              <TrackOption
                key={id}
                layout="icon"
                pressed={false}
                ariaLabel={itemAriaLabel(id, locale)}
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

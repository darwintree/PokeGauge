import { CircleSlash, Gem } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import {
  heldItemWarning,
  itemAriaLabel,
  itemSprite,
  type HeldItemId,
} from "@/lib/held-item"
import type { MatchupCatalog } from "@/lib/catalog"
import type { SupportedLocale } from "@/lib/i18n"
import { isMegaStone } from "@/lib/mega"
import { orderedPoolSelection } from "@/lib/ordered-pool-selection"
import { cn } from "@/lib/utils"

import { TrackOption, TrackOptionGroup } from "../track-option"
import { TrackPanel } from "../track-panel"

type HeldItemTrackProps = {
  catalog: MatchupCatalog
  selectedIds: HeldItemId[]
  onChange: (ids: HeldItemId[]) => void
  side?: "attacker" | "defender"
  lockedId?: HeldItemId | null
  expanded?: boolean
  onToggle?: () => void
}

function ItemIcon({ id, className }: { id: HeldItemId; className?: string }) {
  const sprite = itemSprite(id)
  if (sprite) {
    return (
      <img
        src={`/items/${sprite}`}
        alt=""
        className={cn("size-6 object-contain", className)}
      />
    )
  }
  return (
    <CircleSlash
      className={cn("size-6 text-hud-muted/60", className)}
      aria-hidden
    />
  )
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
  const options = side === "attacker"
    ? catalog.attackerItems
    : catalog.defenderItems
  const poolIds = options.map((option) => option.id)

  function toggle(id: HeldItemId) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((itemId) => itemId !== id)
      : [...selectedIds, id]
    onChange(
      orderedPoolSelection(
        poolIds,
        next.length === 0 ? ["none"] : next,
      ),
    )
  }

  return (
    <TrackPanel
      icon={Gem}
      label={
        <FormattedMessage
          id={side === "attacker"
            ? "track.attackerItem"
            : "track.defenderItem"}
        />
      }
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
      <TrackOptionGroup
        aria-label={intl.formatMessage({
          id: side === "attacker"
            ? "track.attackerItem"
            : "track.defenderItem",
        })}
      >
        {options.map(({ id, label, summary }) => {
          const warning = heldItemWarning(id)
          const warningText = warning
            ? intl.formatMessage({ id: `track.item.warning.${warning}` })
            : null
          const accessibleLabel = warningText
            ? `${label}, ${warningText}`
            : label

          return (
            <TrackOption
              key={id}
              layout="icon"
              pressed={selectedIds.includes(id)}
              disabled={lockedId !== null}
              ariaLabel={accessibleLabel}
              tooltip={[label, summary, warningText].filter(Boolean).join("\n")}
              modifier={{ kind: "core" }}
              className="relative max-lg:size-11"
              onToggle={() => toggle(id)}
            >
              {isMegaStone(id) && !itemSprite(id)
                ? <Gem className="size-6" />
                : <ItemIcon id={id} />}
              {warning && (
                <span
                  aria-hidden
                  className="absolute top-0.5 right-0.5 size-2 rounded-full border border-ink bg-destructive"
                />
              )}
            </TrackOption>
          )
        })}
      </TrackOptionGroup>
    </TrackPanel>
  )
}

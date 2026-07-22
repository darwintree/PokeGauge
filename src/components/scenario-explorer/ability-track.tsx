import { Sparkles } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { ADAPTABILITY_ABILITY_ID } from "@/lib/calc-adapter"
import type { CatalogAbilityOption } from "@/lib/catalog"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackCard } from "./track-card"

type AbilityTrackProps = {
  labelId: "track.attackerAbility" | "track.defenderAbility"
  options: CatalogAbilityOption[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
  onReset: () => void
  expanded?: boolean
  onToggle?: () => void
}

export function AbilityTrack({
  labelId,
  options,
  selectedIds,
  onChange,
  onReset,
  expanded = true,
  onToggle = () => {},
}: AbilityTrackProps) {
  const intl = useIntl()
  const selected = new Set(selectedIds)

  function toggle(id: number) {
    if (selected.has(id) && selected.size === 1) return
    onChange(
      options
        .filter((option) => option.id === id ? !selected.has(id) : selected.has(option.id))
        .map((option) => option.id),
    )
  }

  const orderedOptions = [...options].sort(
    (a, b) => Number(selected.has(b.id)) - Number(selected.has(a.id)),
  )
  const summary = options
    .filter((option) => selected.has(option.id))
    .map((option) => option.label)
    .join(", ")

  return (
    <TrackCard
      icon={Sparkles}
      label={<FormattedMessage id={labelId} />}
      summary={summary || "-"}
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="space-y-2">
        <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={onReset}
        >
          <FormattedMessage id="track.stage.reset" />
        </Button>
      </div>
      <TrackOptionGroup aria-label={intl.formatMessage({ id: labelId })}>
        {orderedOptions.map((option) => (
          <TrackOption
            key={option.id}
            layout="text"
            pressed={selected.has(option.id)}
            onToggle={() => toggle(option.id)}
            ariaLabel={option.label}
            tooltip={option.summary || null}
            className="px-2"
          >
            <span>{option.label}</span>
            {option.id !== ADAPTABILITY_ABILITY_ID && (
              <span className="text-muted-foreground text-[10px] font-normal">
                <FormattedMessage id="track.ability.unsupported" />
              </span>
            )}
          </TrackOption>
        ))}
      </TrackOptionGroup>
      </div>
    </TrackCard>
  )
}

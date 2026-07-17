import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ADAPTABILITY_ABILITY_ID } from "@/lib/calc-adapter"
import type { CatalogAbilityOption } from "@/lib/catalog"

import { TrackOption, TrackOptionGroup } from "./track-option"

type AbilityTrackProps = {
  labelId: "track.attackerAbility" | "track.defenderAbility"
  options: CatalogAbilityOption[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
  onReset: () => void
}

export function AbilityTrack({
  labelId,
  options,
  selectedIds,
  onChange,
  onReset,
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-muted-foreground text-xs">
          <FormattedMessage id={labelId} />
        </Label>
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
        {options.map((option) => (
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
  )
}

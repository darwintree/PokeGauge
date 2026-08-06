import { Sparkles } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import {
  NO_ABILITY_ID,
  UNKNOWN_ABILITY_ID,
  abilityDamageModifierIsSupported,
  abilityIsProjectionNeutral,
} from "@/lib/ability"
import type { CatalogAbilityOption } from "@/lib/catalog"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackPanel } from "./track-panel"

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

  const orderedOptions = [...options].sort((a, b) =>
    Number(b.id === NO_ABILITY_ID) - Number(a.id === NO_ABILITY_ID) ||
    Number(selected.has(b.id)) - Number(selected.has(a.id)),
  )
  const summary = options
    .filter((option) => selected.has(option.id))
    .map((option) => option.label)
    .join(", ")

  return (
    <TrackPanel
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
        {orderedOptions.map((option) => {
          // Projection abilities are handled by their target Tracks, not as Ability effects.
          const unsupported =
            !abilityDamageModifierIsSupported(option.id) &&
            option.id !== UNKNOWN_ABILITY_ID &&
            option.id !== NO_ABILITY_ID &&
            !abilityIsProjectionNeutral(option.id)
          const unsupportedLabel = intl.formatMessage({ id: "track.ability.unsupported" })
          return (
            <TrackOption
              key={option.id}
              layout="text"
              pressed={selected.has(option.id)}
              onToggle={() => toggle(option.id)}
              ariaLabel={unsupported
                ? `${option.label} · ${unsupportedLabel}`
                : option.accessibleLabel ?? option.label}
              tooltip={[option.summary, unsupported ? unsupportedLabel : null].filter(Boolean).join("\n") || null}
              className="px-2"
            >
              <span>{option.label}</span>
              {unsupported && (
                /* State also lives in the accessible name, never color alone. */
                <span aria-hidden className="size-2 rounded-full border border-ink bg-destructive" />
              )}
            </TrackOption>
          )
        })}
      </TrackOptionGroup>
      </div>
    </TrackPanel>
  )
}

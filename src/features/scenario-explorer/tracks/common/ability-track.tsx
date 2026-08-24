import { Sparkles } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import {
  NO_ABILITY_ID,
  abilityIsSelectable,
  abilitySupport,
  assumedSatisfiedAbilityFamily,
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

const ASSUMED_FAMILY_MESSAGE = {
  "full-hp": "track.ability.assumed.fullHp",
  "low-hp": "track.ability.assumed.lowHp",
  status: "track.ability.assumed.status",
  "target-poisoned": "track.ability.assumed.targetPoisoned",
  "self-poisoned": "track.ability.assumed.selfPoisoned",
  burned: "track.ability.assumed.burned",
  partner: "track.ability.assumed.partner",
  "last-move": "track.ability.assumed.lastMove",
} as const

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
        .filter((option) =>
          abilityIsSelectable(option.id) &&
          (option.id === id ? !selected.has(id) : selected.has(option.id)))
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
  const describedOptions = orderedOptions.map((option) => {
    const support = abilitySupport(option.id)
    const disabled = support === "none"
    const unsupported = support === "unsupported"
    const assumedFamily = !unsupported
      ? assumedSatisfiedAbilityFamily(option.id)
      : undefined
    let disclosureLabel: string | null = null
    if (unsupported) {
      disclosureLabel = intl.formatMessage({ id: "track.ability.unsupported" })
    } else if (assumedFamily) {
      disclosureLabel = intl.formatMessage({ id: ASSUMED_FAMILY_MESSAGE[assumedFamily] })
    }
    return { option, disabled, unsupported, assumedFamily, disclosureLabel }
  })

  return (
    <TrackPanel
      icon={Sparkles}
      label={<FormattedMessage id="track.ability" />}
      side={labelId === "track.attackerAbility" ? "attacker" : "defender"}
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
        {describedOptions.map(({ option, disabled, unsupported, assumedFamily, disclosureLabel }) => {
          return (
            <TrackOption
              key={option.id}
              layout="text"
              pressed={selected.has(option.id)}
              disabled={disabled}
              onToggle={() => toggle(option.id)}
              ariaLabel={disclosureLabel
                ? `${option.label} · ${disclosureLabel}`
                : option.accessibleLabel ?? option.label}
              tooltip={(
                <span className="whitespace-pre-line">
                  {[option.summary, disclosureLabel].filter(Boolean).join("\n")}
                </span>
              )}
              className={disabled ? "track-option--neutral-disabled px-2" : "px-2"}
            >
              <span>{option.label}</span>
              {unsupported && (
                /* State also lives in the accessible name, never color alone. */
                <span aria-hidden className="size-2 rounded-full border border-ink bg-destructive" />
              )}
              {assumedFamily && (
                <span aria-hidden className="size-2 rounded-full border border-ink bg-signal-green" />
              )}
            </TrackOption>
          )
        })}
      </TrackOptionGroup>
      <details className="mt-2 rounded-md border border-card-border bg-token-bg/30 px-3 py-2 text-xs">
        <summary className="cursor-pointer font-extrabold focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
          <FormattedMessage id="track.ability.descriptions" />
        </summary>
        <div className="mt-2 space-y-2">
          {describedOptions.map(({ option }) => (
            <div key={option.id}>
              <p className="font-bold text-foreground">{option.label}</p>
              <p className="text-muted-foreground">{option.summary}</p>
            </div>
          ))}
        </div>
      </details>
      </div>
    </TrackPanel>
  )
}

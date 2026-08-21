import { Info } from "lucide-react"
import { useId, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { TrackState } from "@/lib/scenario"
import { cn } from "@/lib/utils"

type ProbabilityMode = TrackState["probabilityMode"]

const MODES = ["battle-odds", "classic"] as const

const HINT_ID: Record<ProbabilityMode, string> = {
  "battle-odds": "probability.mode.battleOdds.hint",
  classic: "probability.mode.classic.hint",
}

const LABEL_ID: Record<ProbabilityMode, string> = {
  "battle-odds": "probability.mode.battleOdds",
  classic: "probability.mode.classic",
}

export function ProbabilityModeSwitch({
  mode,
  onChange,
}: {
  mode: ProbabilityMode
  onChange: (mode: ProbabilityMode) => void
}) {
  const intl = useIntl()
  const panelId = useId()
  const [compareOpen, setCompareOpen] = useState(false)

  return (
    <div className="mb-3 flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <ToggleGroup
          value={[mode]}
          onValueChange={(value) => {
            if (value[0] === "classic" || value[0] === "battle-odds") onChange(value[0])
          }}
          variant="default"
          size="sm"
          spacing={0}
          aria-label="KO probability mode"
          className="gap-0 rounded-[10px] border-2 border-ink bg-paper p-0.5 shadow-hud-chip"
        >
          {MODES.map((value) => (
            <ToggleGroupItem
              key={value}
              value={value}
              className="rounded-[7px] px-2.5 text-[11px] font-extrabold text-ink hover:bg-token-bg aria-pressed:bg-signal-yellow aria-pressed:text-ink aria-pressed:shadow-none"
            >
              <FormattedMessage id={LABEL_ID[value]} />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <button
          type="button"
          aria-expanded={compareOpen}
          aria-controls={compareOpen ? panelId : undefined}
          aria-label={intl.formatMessage({ id: "probability.mode.compare" })}
          className={cn(
            "grid size-7 place-items-center rounded-[9px] border-2 border-ink bg-paper text-ink shadow-hud-chip hover:bg-token-bg",
            compareOpen && "bg-signal-yellow shadow-none",
          )}
          onClick={() => setCompareOpen((open) => !open)}
        >
          <Info className="size-3.5" aria-hidden />
        </button>
      </div>
      {compareOpen ? (
        <div
          id={panelId}
          className="grid gap-px overflow-hidden rounded-[12px] border-2 border-ink bg-ink shadow-hud-panel sm:grid-cols-2"
        >
          {MODES.map((value) => {
            const current = value === mode
            return (
              <button
                key={value}
                type="button"
                aria-pressed={current}
                onClick={() => onChange(value)}
                className={cn(
                  "flex flex-col gap-1 bg-paper px-3 py-2 text-left hover:bg-token-bg/70",
                  current && "bg-notice-bg",
                )}
              >
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold">
                  <FormattedMessage id={LABEL_ID[value]} />
                  {current ? (
                    <span className="rounded-[5px] border border-ink bg-signal-yellow px-1 text-[9px] font-extrabold">
                      <FormattedMessage id="probability.mode.current" />
                    </span>
                  ) : null}
                </span>
                <span className="text-[11px] leading-snug font-medium text-hud-muted">
                  <FormattedMessage id={HINT_ID[value]} />
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

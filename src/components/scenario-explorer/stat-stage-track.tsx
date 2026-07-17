import { FormattedMessage } from "react-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { STAT_STAGES, type StatStage } from "@/lib/calc-adapter"

import { TrackOption, TrackOptionGroup } from "./track-option"

function stageLabel(stage: StatStage): string {
  return stage > 0 ? `+${stage}` : String(stage)
}

type StatStageTrackProps = {
  label: React.ReactNode
  ariaLabel: string
  values: StatStage[]
  onChange: (values: StatStage[]) => void
}

export function StatStageTrack({
  label,
  ariaLabel,
  values,
  onChange,
}: StatStageTrackProps) {
  const selected = new Set(values)

  function toggle(stage: StatStage) {
    onChange(
      STAT_STAGES.filter((candidate) =>
        candidate === stage ? !selected.has(candidate) : selected.has(candidate),
      ),
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-muted-foreground text-xs">{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => onChange([])}
        >
          <FormattedMessage id="track.stage.reset" />
        </Button>
      </div>
      <TrackOptionGroup aria-label={ariaLabel}>
        {STAT_STAGES.map((stage) => {
          const value = stageLabel(stage)
          return (
            <TrackOption
              key={stage}
              layout="text"
              pressed={selected.has(stage)}
              onToggle={() => toggle(stage)}
              ariaLabel={value}
              className="min-w-8 px-2"
            >
              {value}
            </TrackOption>
          )
        })}
      </TrackOptionGroup>
    </div>
  )
}

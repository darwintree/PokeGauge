import { ChevronsUpDown } from "lucide-react"
import { FormattedMessage } from "react-intl"

import { Button } from "@/components/ui/button"
import { STAT_STAGES, type StatStage } from "@/lib/calc-adapter"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackCard } from "./track-card"

function stageLabel(stage: StatStage): string {
  return stage > 0 ? `+${stage}` : String(stage)
}

type StatStageTrackProps = {
  label: React.ReactNode
  ariaLabel: string
  values: StatStage[]
  onChange: (values: StatStage[]) => void
  expanded?: boolean
  onToggle?: () => void
}

export function StatStageTrack({
  label,
  ariaLabel,
  values,
  onChange,
  expanded = true,
  onToggle = () => {},
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
    <TrackCard
      icon={ChevronsUpDown}
      label={label}
      summary={values.length > 0 ? values.map(stageLabel).join(", ") : "0"}
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
    </TrackCard>
  )
}

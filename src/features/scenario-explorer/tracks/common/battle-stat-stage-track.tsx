import { useState, type ReactNode } from "react"
import { ChevronsUpDown } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { STAT_STAGES, type StatStage } from "@/lib/damage-calculation"

import { TrackOption, TrackOptionAdd, TrackOptionGroup } from "./track-option"
import { TrackPanel } from "./track-panel"

function stageLabel(stage: StatStage): string {
  return stage > 0 ? `+${stage}` : String(stage)
}

type BattleStatStageTrackProps = {
  label: ReactNode
  ariaLabel: string
  pool: StatStage[]
  values: StatStage[]
  onChange: (values: StatStage[]) => void
  onAdd: (stage: StatStage) => void
  side: "attacker" | "defender"
}

export function BattleStatStageTrack({
  label,
  ariaLabel,
  pool,
  values,
  onChange,
  onAdd,
  side,
}: BattleStatStageTrackProps) {
  const intl = useIntl()
  const selected = new Set(values)
  const pooled = new Set(pool)
  const remaining = STAT_STAGES.filter((stage) => !pooled.has(stage))
  const [adding, setAdding] = useState(false)

  function toggle(stage: StatStage) {
    onChange(
      STAT_STAGES.filter((candidate) =>
        candidate === stage ? !selected.has(candidate) : selected.has(candidate),
      ),
    )
  }

  return (
    <>
      <TrackPanel
        expandable={false}
        icon={ChevronsUpDown}
        label={label}
        side={side}
        summary={
          <TrackOptionGroup aria-label={ariaLabel}>
            {STAT_STAGES.filter((stage) => pooled.has(stage)).map((stage) => {
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
            {remaining.length > 0 && (
              <TrackOptionAdd
                layout="text"
                ariaLabel={intl.formatMessage({ id: "track.addStage" })}
                onClick={() => setAdding(true)}
              />
            )}
          </TrackOptionGroup>
        }
      />

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="track.addStage" />
            </DialogTitle>
          </DialogHeader>
          <TrackOptionGroup aria-label={intl.formatMessage({ id: "track.addStage" })}>
            {remaining.map((stage) => {
              const value = stageLabel(stage)
              return (
                <TrackOption
                  key={stage}
                  layout="text"
                  pressed={false}
                  onToggle={() => {
                    onAdd(stage)
                    setAdding(false)
                  }}
                  ariaLabel={value}
                  className="min-w-8 px-2"
                >
                  {value}
                </TrackOption>
              )
            })}
          </TrackOptionGroup>
        </DialogContent>
      </Dialog>
    </>
  )
}

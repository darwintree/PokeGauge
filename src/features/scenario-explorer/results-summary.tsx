import { useIntl } from "react-intl"

import { Badge } from "@/components/ui/badge"

import type { ScenarioState } from "./state/use-scenario-state"

export function ResultSetSummary({ state }: { state: ScenarioState }) {
  const intl = useIntl()
  const s = state.selectionSummary
  const stats =
    state.trackState.statMode === "preset"
      ? intl.formatMessage(
          { id: "summary.statsPreset" },
          { count: state.trackState.offensePresetIds.length },
        )
      : intl.formatMessage(
          { id: "summary.statsRange" },
          { min: state.trackState.statRange.min, max: state.trackState.statRange.max },
        )
  const defenders =
    state.trackState.defenderMode === "preset"
      ? intl.formatMessage(
          { id: "summary.defendersPreset" },
          { count: state.trackState.defensePresetIds.length },
        )
      : intl.formatMessage(
          { id: "summary.defendersRange" },
          {
            min: state.trackState.defenderRanges.hp.min,
            max: state.trackState.defenderRanges.hp.max,
          },
        )
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-[10.5px] font-bold">
          {intl.formatMessage({ id: "summary.moves" }, { count: s.moves })}
        </Badge>
        <Badge variant="secondary" className="text-[10.5px] font-bold">{stats}</Badge>
        <Badge variant="secondary" className="text-[10.5px] font-bold">
          {intl.formatMessage({ id: "summary.items" }, { count: s.items })}
        </Badge>
        <Badge variant="secondary" className="text-[10.5px] font-bold">
          {intl.formatMessage({ id: "summary.defenders" }, { value: defenders })}
        </Badge>
      </div>
      <Badge variant="outline" className="border-card-border text-[10.5px] font-bold tabular-nums">
        {intl.formatMessage({ id: "summary.rows" }, { count: s.rows })}
      </Badge>
    </div>
  )
}

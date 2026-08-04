import { useIntl } from "react-intl"

import { Badge } from "@/components/ui/badge"
import type { TrackState } from "@/lib/scenario"

export function ResultSetSummary({
  trackState,
  rowCount,
}: {
  trackState: TrackState
  rowCount: number
}) {
  const intl = useIntl()
  const stats =
    trackState.statMode === "preset"
      ? intl.formatMessage(
          { id: "summary.statsPreset" },
          { count: trackState.offensePresetIds.length },
        )
      : intl.formatMessage(
          { id: "summary.statsRange" },
          { min: trackState.statRange.min, max: trackState.statRange.max },
        )
  const defenders =
    trackState.defenderMode === "preset"
      ? intl.formatMessage(
          { id: "summary.defendersPreset" },
          { count: trackState.defensePresetIds.length },
        )
      : intl.formatMessage(
          { id: "summary.defendersRange" },
          {
            min: trackState.defenderRanges.hp.min,
            max: trackState.defenderRanges.hp.max,
          },
        )
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-[10.5px] font-bold">
          {intl.formatMessage(
            { id: "summary.moves" },
            { count: trackState.selectedMoveSnapshotIds.length },
          )}
        </Badge>
        <Badge variant="secondary" className="text-[10.5px] font-bold">{stats}</Badge>
        <Badge variant="secondary" className="text-[10.5px] font-bold">
          {intl.formatMessage({ id: "summary.items" }, { count: trackState.attackerItemIds.length })}
        </Badge>
        <Badge variant="secondary" className="text-[10.5px] font-bold">
          {intl.formatMessage({ id: "summary.defenders" }, { value: defenders })}
        </Badge>
      </div>
      <Badge variant="outline" className="border-card-border text-[10.5px] font-bold tabular-nums">
        {intl.formatMessage({ id: "summary.rows" }, { count: rowCount })}
      </Badge>
    </div>
  )
}

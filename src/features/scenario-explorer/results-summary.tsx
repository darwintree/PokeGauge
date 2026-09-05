import { useIntl } from "react-intl"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { resultGroupingOptions, type ResultGrouping } from "./results/result-groups"
import type { TrackState } from "@/lib/scenario"

export function ResultSetSummary({
  trackState,
  rowCount,
  grouping,
  onGroupingChange,
}: {
  trackState: TrackState
  rowCount: number
  grouping: ResultGrouping | null
  onGroupingChange: (grouping: ResultGrouping | null) => void
}) {
  const intl = useIntl()
  const dimensions = resultGroupingOptions(trackState).map(({ id, count }) => ({
    id,
    label: intl.formatMessage({ id: "results.grouping.summary" }, {
      count,
      dimension: intl.formatMessage({ id: `results.grouping.${["move", "offense", "item", "defense"].includes(id) ? "short." : ""}${id}` }),
    }),
  }))
  return (
    <div className="grid min-w-0 gap-x-3 gap-y-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      {dimensions.length > 0 && <div className="min-w-0 overflow-x-auto px-0.5 pt-1 pb-1.5">
        <ToggleGroup
          aria-label={intl.formatMessage({ id: "results.grouping.label" })}
          value={grouping ? [grouping] : []}
          onValueChange={(values) => onGroupingChange((values[0] as ResultGrouping | undefined) ?? null)}
          className="flex-nowrap gap-1.5"
        >
          {dimensions.map(({ id, label }) => (
            <ToggleGroupItem
              key={id}
              value={id}
              aria-label={intl.formatMessage({ id: grouping === id ? "results.grouping.cancel" : "results.grouping.by" }, {
                dimension: intl.formatMessage({ id: `results.grouping.${id}` }),
              })}
              className="h-10 shrink-0 rounded-full border border-card-border bg-paper px-2.5 text-xs font-bold text-ink hover:border-ink/50 focus-visible:ring-2 focus-visible:ring-inset sm:h-9 data-pressed:border-ink data-pressed:bg-signal-yellow data-pressed:shadow-hud-chip"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>}
      <span className="col-start-1 justify-self-end text-xs sm:col-start-2 font-medium text-hud-muted tabular-nums">
        {intl.formatMessage({ id: "summary.rows" }, { count: rowCount })}
      </span>
    </div>
  )
}

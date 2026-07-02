import { useMemo } from "react"
import { FormattedMessage } from "react-intl"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  defenseTemplatesForState,
  offenseTemplatesForState,
  rowLabels,
  type ScenarioRow,
  type TrackState,
} from "@/lib/scenario-pipeline"
import type { StatNameStrategy } from "@/lib/stat-value-template"

import { BoxPlotLegend, DamageAxis, DamageBoxPlot } from "./damage-box-plot"
import { ShowActualValuesSwitch } from "./stat-value-template-preset"

type ScenarioResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
  trackState: TrackState
  statNameStrategy: StatNameStrategy
  showMoveOnRow: boolean
  onShowResultActualChange: (checked: boolean) => void
  compact?: boolean
}

function catalogOption<T extends { id: string | number }>(options: T[], id: string | number): T {
  const found = options.find((o) => o.id === id)
  if (!found) throw new Error(`Unknown catalog option: ${id}`)
  return found
}

function rowKey(row: ScenarioRow) {
  const offenseKey = row.statRange
    ? `${row.statRange.min}-${row.statRange.max}`
    : row.attackerStatId
  const defenseKey = row.defenderRanges
    ? `hp${row.defenderRanges.hp.min}-${row.defenderRanges.hp.max}-def${row.defenderRanges.def.min}-${row.defenderRanges.def.max}`
    : row.defenderId
  return `${row.moveId}:${offenseKey}:${row.attackerItemId}:${defenseKey}`
}

export function ScenarioResults({
  catalog,
  rows,
  trackState,
  statNameStrategy,
  showMoveOnRow,
  onShowResultActualChange,
  compact = false,
}: ScenarioResultsProps) {
  const rowLabelTemplates = useMemo(
    () => ({
      offense: offenseTemplatesForState(catalog, trackState),
      defense: defenseTemplatesForState(catalog, trackState),
    }),
    [catalog, trackState],
  )

  if (rows.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyDescription>
            <FormattedMessage id="app.empty" />
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div className="mb-2 flex justify-end">
        <ShowActualValuesSwitch
          checked={trackState.showResultActual}
          onCheckedChange={onShowResultActualChange}
        />
      </div>
      <DamageAxis />
      <ul className={compact ? "space-y-8 pb-2" : "space-y-12 pb-2"}>
        {rows.map((row) => {
          const labels = rowLabels(catalog, row, trackState, statNameStrategy, rowLabelTemplates)
          const isRangeEnvelope =
            row.attackerStatId === RANGE_STAT_ID || row.defenderId === RANGE_DEFENDER_ID

          return (
            <li key={rowKey(row)}>
              <DamageBoxPlot
                move={catalogOption(catalog.moves, row.moveId)}
                attackerStat={{
                  id: row.attackerStatId,
                  label: labels.stat,
                  actual: labels.statActual,
                }}
                attackerItem={{ id: row.attackerItemId }}
                defender={{
                  id: row.defenderId,
                  label: labels.defender,
                  actual: labels.defenderActual,
                }}
                row={row}
                showMove={showMoveOnRow}
                isRangeEnvelope={isRangeEnvelope}
              />
            </li>
          )
        })}
      </ul>
      <BoxPlotLegend />
    </>
  )
}

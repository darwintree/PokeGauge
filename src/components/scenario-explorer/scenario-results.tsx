import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  rowLabels,
  type ScenarioRow,
  type TrackState,
} from "@/lib/scenario-pipeline"

import { BoxPlotLegend, DamageAxis, DamageBoxPlot } from "./damage-box-plot"

type ScenarioResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
  trackState: TrackState
  showMoveOnRow: boolean
  compact?: boolean
}

function catalogOption<T extends { id: string }>(options: T[], id: string): T {
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
  showMoveOnRow,
  compact = false,
}: ScenarioResultsProps) {
  if (rows.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyDescription>请至少各选一维配置以展示伤害对比</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <DamageAxis />
      <ul className={compact ? "space-y-8 pb-2" : "space-y-12 pb-2"}>
        {rows.map((row) => {
          const labels = rowLabels(catalog, row, trackState)
          const isRangeEnvelope =
            row.attackerStatId === RANGE_STAT_ID || row.defenderId === RANGE_DEFENDER_ID

          return (
            <li key={rowKey(row)}>
              <DamageBoxPlot
                move={catalogOption(catalog.moves, row.moveId)}
                attackerStat={{ id: row.attackerStatId, label: labels.stat }}
                attackerItem={{ id: row.attackerItemId }}
                defender={{ id: row.defenderId, label: labels.defender }}
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

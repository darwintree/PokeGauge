import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty"
import type { MatchupCatalog } from "@/lib/catalog"
import { RANGE_STAT_ID, type ScenarioRow } from "@/lib/scenario-pipeline"

import { BoxPlotLegend, DamageAxis, DamageBoxPlot } from "./damage-box-plot"

type ScenarioResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
  showMoveOnRow: boolean
  compact?: boolean
}

function catalogOption<T extends { id: string }>(options: T[], id: string): T {
  const found = options.find((o) => o.id === id)
  if (!found) throw new Error(`Unknown catalog option: ${id}`)
  return found
}

function rowKey(row: ScenarioRow) {
  const rangeKey = row.statRange
    ? `${row.statRange.min}-${row.statRange.max}`
    : row.attackerStatId
  return `${row.moveId}:${rangeKey}:${row.attackerItemId}:${row.defenderId}`
}

function attackerStatForRow(catalog: MatchupCatalog, row: ScenarioRow) {
  if (row.attackerStatId === RANGE_STAT_ID && row.statRange) {
    return {
      id: RANGE_STAT_ID,
      label: `${catalog.offenseStatLabel} ${row.statRange.min}–${row.statRange.max}`,
      summary: "区间 × roll 合并",
    }
  }
  return catalogOption(catalog.attackerStats, row.attackerStatId)
}

export function ScenarioResults({
  catalog,
  rows,
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
        {rows.map((row) => (
          <li key={rowKey(row)}>
            <DamageBoxPlot
              move={catalogOption(catalog.moves, row.moveId)}
              attackerStat={attackerStatForRow(catalog, row)}
              attackerItem={catalogOption(catalog.attackerItems, row.attackerItemId)}
              defender={catalogOption(catalog.defenderBulks, row.defenderId)}
              row={row}
              showMove={showMoveOnRow}
              isRangeEnvelope={row.attackerStatId === RANGE_STAT_ID}
            />
          </li>
        ))}
      </ul>
      <BoxPlotLegend />
    </>
  )
}

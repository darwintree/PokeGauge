/** PROTOTYPE — move badge on result row when showMoveOnRow */

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty"
import type { MatchupCatalog } from "@/lib/catalog"
import { RANGE_STAT_ID, type ScenarioRow } from "@/lib/scenario-pipeline"

import {
  BoxPlotLegend,
  DamageAxis,
  DamageBoxPlot,
} from "@/components/scenario-explorer/damage-box-plot"

import { TypeBadge } from "../type-colors/type-badge"
import { moveType } from "../type-colors/type-data"

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

type ResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
  showMoveOnRow: boolean
}

export function ResultsWithMoveBadge({ catalog, rows, showMoveOnRow }: ResultsProps) {
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
      <ul className="space-y-8 pb-2">
        {rows.map((row) => (
          <li key={rowKey(row)}>
            <MoveLabelWithBadge
              catalog={catalog}
              row={row}
              showMoveOnRow={showMoveOnRow}
            />
          </li>
        ))}
      </ul>
      <BoxPlotLegend />
    </>
  )
}

function MoveLabelWithBadge({
  catalog,
  row,
  showMoveOnRow,
}: {
  catalog: MatchupCatalog
  row: ScenarioRow
  showMoveOnRow: boolean
}) {
  const move = catalogOption(catalog.moves, row.moveId)
  const type = moveType(row.moveId)
  const plotProps = {
    move,
    attackerStat: attackerStatForRow(catalog, row),
    attackerItem: catalogOption(catalog.attackerItems, row.attackerItemId),
    defender: catalogOption(catalog.defenderBulks, row.defenderId),
    row,
    isRangeEnvelope: row.attackerStatId === RANGE_STAT_ID,
  }

  if (!showMoveOnRow || !type) {
    return <DamageBoxPlot {...plotProps} showMove={showMoveOnRow} />
  }

  return (
    <div className="flex min-h-[4.5rem] items-center gap-3">
      <div className="w-52 shrink-0 text-right">
        <div className="flex items-center justify-end gap-1">
          <TypeBadge type={type} size="xs" />
          <span className="text-muted-foreground text-xs">{move.label}</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <DamageBoxPlot {...plotProps} showMove={false} />
      </div>
    </div>
  )
}

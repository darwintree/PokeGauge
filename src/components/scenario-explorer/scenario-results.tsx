import type { MatchupCatalog } from "@/lib/catalog"
import type { ScenarioRow } from "@/lib/scenario-pipeline"

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
  return `${row.moveId}:${row.attackerStatId}:${row.attackerItemId}:${row.defenderId}`
}

export function ScenarioResults({
  catalog,
  rows,
  showMoveOnRow,
  compact = false,
}: ScenarioResultsProps) {
  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
        请至少各选一维配置以展示伤害对比
      </p>
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
              attackerStat={catalogOption(catalog.attackerStats, row.attackerStatId)}
              attackerItem={catalogOption(catalog.attackerItems, row.attackerItemId)}
              defender={catalogOption(catalog.defenderBulks, row.defenderId)}
              row={row}
              showMove={showMoveOnRow}
            />
          </li>
        ))}
      </ul>
      <BoxPlotLegend />
    </>
  )
}

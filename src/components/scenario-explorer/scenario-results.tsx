import type { MatchupCatalog } from "@/lib/catalog"
import type { ScenarioRow } from "@/lib/scenario-pipeline"

import { BoxPlotLegend, DamageAxis, DamageBoxPlot } from "./damage-box-plot"

type ScenarioResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
}

function catalogOption<T extends { id: string }>(options: T[], id: string): T {
  const found = options.find((o) => o.id === id)
  if (!found) throw new Error(`Unknown catalog option: ${id}`)
  return found
}

function rowKey(row: ScenarioRow) {
  return `${row.moveId}:${row.attackerStatId}:${row.attackerItemId}:${row.defenderId}`
}

export function ScenarioResults({ catalog, rows }: ScenarioResultsProps) {
  const { attackerLabel, defenderLabel } = catalog.matchup
  const showMoveOnRow = new Set(rows.map((r) => r.moveId)).size > 1

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">伤害对比</h1>
        <p className="text-muted-foreground text-sm">
          {attackerLabel} → {defenderLabel} · Champions · VGC 双打 · Level 50
        </p>
        <p className="text-muted-foreground text-sm">{rows.length} 个 scenario</p>
      </header>

      {rows.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          请至少各选一维配置以展示伤害对比
        </p>
      ) : (
        <>
          <DamageAxis />
          <ul className="space-y-12 pb-2">
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
      )}
    </section>
  )
}

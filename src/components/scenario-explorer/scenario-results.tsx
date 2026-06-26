import type { ScenarioRow } from "@/lib/scenario-pipeline"
import { rowLabels } from "@/lib/scenario-pipeline"
import type { MatchupCatalog } from "@/lib/catalog"

type ScenarioResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function ScenarioRowCard({
  catalog,
  row,
}: {
  catalog: MatchupCatalog
  row: ScenarioRow
}) {
  const labels = rowLabels(catalog, row)
  const ohkoText =
    row.ohkoChance !== undefined
      ? ` · ${row.ohkoChance % 1 === 0 ? row.ohkoChance : row.ohkoChance.toFixed(1)}% OHKO`
      : ""

  return (
    <article className="rounded-lg border bg-card p-4 text-card-foreground">
      <header className="mb-2 text-sm font-medium">
        {labels.move} · {labels.stat} · {labels.item} · {labels.defender}
      </header>
      <dl className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          <dt className="inline">伤害区间 </dt>
          <dd className="inline font-mono text-foreground">
            {row.minDamage}–{row.maxDamage} ({formatPercent(row.minPercent)}–
            {formatPercent(row.maxPercent)})
          </dd>
        </div>
        <div>
          <dt className="inline">平均 </dt>
          <dd className="inline font-mono text-foreground">
            {row.avgDamage.toFixed(1)} ({formatPercent(row.avgPercent)})
          </dd>
        </div>
        <div>
          <dt className="inline">会心 </dt>
          <dd className="inline font-mono text-foreground">
            {row.critMinDamage}–{row.critMaxDamage} (
            {formatPercent(row.critMinPercent)}–{formatPercent(row.critMaxPercent)})
          </dd>
        </div>
        {row.ohkoChance !== undefined && (
          <div>
            <dt className="inline">OHKO 概率 </dt>
            <dd className="inline font-mono text-foreground">{ohkoText.replace(/^ · /, "")}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}

export function ScenarioResults({ catalog, rows }: ScenarioResultsProps) {
  const { attackerLabel, defenderLabel } = catalog.matchup

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">伤害对比</h1>
        <p className="text-muted-foreground text-sm">
          {attackerLabel} → {defenderLabel} · Champions · VGC 双打 · Level 50
        </p>
        <p className="text-muted-foreground text-sm">{rows.length} 个 scenario</p>
      </header>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={`${row.moveId}:${row.attackerStatId}:${row.attackerItemId}:${row.defenderId}`}>
            <ScenarioRowCard catalog={catalog} row={row} />
          </li>
        ))}
      </ul>
    </section>
  )
}

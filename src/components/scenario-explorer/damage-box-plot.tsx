/** Box = normal 16 rolls; whiskers = crit range (PRD visualization contract) */

import type { CatalogOption } from "@/lib/catalog/types"
import type { ScenarioRow } from "@/lib/scenario-pipeline"

const AXIS_MAX = 150
const TICKS = [0, 25, 50, 75, 100, 125, 150]

function clampPct(pct: number) {
  return Math.min(Math.max(pct, 0), AXIS_MAX)
}

function pctToLeft(pct: number) {
  return `${(clampPct(pct) / AXIS_MAX) * 100}%`
}

function pctSpan(minPct: number, maxPct: number) {
  const left = clampPct(minPct)
  const right = clampPct(maxPct)
  return {
    left: `${(left / AXIS_MAX) * 100}%`,
    width: `${((right - left) / AXIS_MAX) * 100}%`,
  }
}

function lethalTone(row: ScenarioRow) {
  const peak = Math.max(row.maxPercent, row.critMaxPercent)
  if (peak >= 100) return "lethal"
  if (peak >= 75) return "warm"
  return "cool"
}

const TONE_CLASS = {
  cool: "bg-amber-300/80 border-amber-400/60",
  warm: "bg-orange-400/80 border-orange-500/60",
  lethal: "bg-red-500/75 border-red-600/70",
} as const

type DamageBoxPlotProps = {
  move: CatalogOption
  attackerStat: CatalogOption
  attackerItem: CatalogOption
  defender: CatalogOption
  row: ScenarioRow
  showMove?: boolean
  isRangeEnvelope?: boolean
}

export function DamageBoxPlot({
  move,
  attackerStat,
  attackerItem,
  defender,
  row,
  showMove = true,
  isRangeEnvelope = false,
}: DamageBoxPlotProps) {
  const tone = lethalTone(row)
  const peak = Math.max(row.maxPercent, row.critMaxPercent)
  const box = pctSpan(row.minPercent, row.maxPercent)
  const crit = pctSpan(row.critMinPercent, row.critMaxPercent)
  const bridge =
    row.critMinPercent > row.maxPercent
      ? pctSpan(row.maxPercent, row.critMinPercent)
      : null

  return (
    <div className="flex min-h-[4.5rem] items-center gap-3">
      <div className="w-52 shrink-0 text-right">
        {showMove && (
          <div className="text-muted-foreground text-xs">{move.label}</div>
        )}
        <div className="text-sm font-medium">{attackerStat.label}</div>
        {isRangeEnvelope && (
          <div className="text-muted-foreground text-[10px]">实数值区间 × 16 roll</div>
        )}
        {attackerItem.id !== "none" && (
          <div className="text-muted-foreground text-xs">{attackerItem.label}</div>
        )}
        <div className="text-muted-foreground text-xs leading-snug">
          vs {defender.label}
        </div>
        <div className="text-muted-foreground/80 mt-0.5 text-[10px] leading-snug">
          {attackerStat.summary}
          {attackerItem.id !== "none" ? ` · ${attackerItem.label}` : ""} · {defender.summary}
        </div>
      </div>

      <div className="relative h-10 min-w-0 flex-1">
        <div
          className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-border"
          aria-hidden
        />

        <div
          className={`absolute top-1/2 h-7 -translate-y-1/2 rounded-sm border ${TONE_CLASS[tone]}`}
          style={{ left: box.left, width: box.width }}
        />

        <div
          className="absolute top-1/2 z-10 w-0.5 -translate-y-1/2 rounded-full bg-foreground"
          style={{ left: pctToLeft(row.avgPercent), height: "1.75rem" }}
        />

        {bridge && (
          <div
            className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-foreground/25"
            style={{ left: bridge.left, width: bridge.width }}
            aria-hidden
          />
        )}

        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-violet-600/70"
          style={{ left: crit.left, width: crit.width }}
        />

        <div
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-violet-600 bg-background"
          style={{ left: crit.left }}
          title="暴击最低"
        />
        <div
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-violet-600 bg-background"
          style={{ left: pctToLeft(row.critMaxPercent) }}
          title="暴击最高"
        />

        <div
          className="absolute -bottom-6 flex flex-wrap items-baseline gap-x-3 text-xs"
          style={{ left: box.left, minWidth: "12rem" }}
        >
          <span className="font-medium tabular-nums">
            {row.minPercent.toFixed(1)}% ~ {row.maxPercent.toFixed(1)}%
          </span>
          <span className="text-muted-foreground tabular-nums">
            {row.minDamage} ~ {row.maxDamage}
          </span>
          <span className="text-violet-700 tabular-nums dark:text-violet-400">
            暴击 {row.critMinPercent.toFixed(1)}% ~ {row.critMaxPercent.toFixed(1)}%
          </span>
          {peak >= 100 && (
            <span className="font-semibold text-red-600 tabular-nums">OHKO</span>
          )}
          {row.ohkoChance != null && (
            <span className="font-medium text-red-600 tabular-nums">
              {row.ohkoChance % 1 === 0
                ? row.ohkoChance
                : row.ohkoChance.toFixed(1)}
              % OHKO
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function DamageAxis() {
  return (
    <div className="mb-2 flex pl-[13.75rem]">
      <div className="relative h-6 min-w-0 flex-1">
        {TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: pctToLeft(tick), transform: "translateX(-50%)" }}
          >
            <div className="bg-border h-3 w-px" />
            <span className="text-muted-foreground mt-0.5 text-[10px] tabular-nums">
              {tick}%
            </span>
          </div>
        ))}
        <div
          className="border-destructive/40 absolute top-0 h-full border-l border-dashed"
          style={{ left: pctToLeft(100) }}
          aria-hidden
        />
      </div>
    </div>
  )
}

export function BoxPlotLegend() {
  return (
    <div className="text-muted-foreground mt-10 flex flex-wrap gap-4 text-xs">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-3 w-6 rounded-sm border border-orange-400/60 bg-orange-400/50" />
        通常伤害（16 roll 最低 ~ 最高）
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex items-center gap-0.5">
          <span className="inline-block h-px w-4 bg-violet-600/70" />
          <span className="inline-block size-2 rounded-full border-2 border-violet-600 bg-background" />
        </span>
        暴击伤害（须须端点）
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-3 w-0.5 bg-foreground" />
        平均伤害
      </span>
    </div>
  )
}

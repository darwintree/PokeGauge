/** Box = normal 16 rolls; whiskers = crit range (PRD visualization contract) */

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { CatalogMoveOption, CatalogOption } from "@/lib/catalog/types"
import { itemAriaLabel, itemHasNoBoostForMove, itemSprite } from "@/lib/held-item"
import type { ScenarioRow } from "@/lib/scenario-pipeline"
import {
  defenderBulkTier,
  offenseStatTier,
  statTierChipClasses,
  type StatTierTokenSet,
} from "@/lib/stat-tier-colors"
import { cn } from "@/lib/utils"

// Non-linear axis: 0–100% linear over 72% of width, 100–200% sqrt-compressed
// into the remaining 28%. Hard cap 200%.
const LINEAR_MAX = 100
const AXIS_MAX = 200
const LINEAR_FRACTION = 0.72
const TICKS = [0, 25, 50, 75, 100, 150, 200]

function clampPct(pct: number): number {
  return Math.min(Math.max(pct, 0), AXIS_MAX)
}

export function pctToFraction(pct: number): number {
  const c = clampPct(pct)
  if (c <= LINEAR_MAX) return (c / LINEAR_MAX) * LINEAR_FRACTION
  return LINEAR_FRACTION + Math.sqrt((c - LINEAR_MAX) / LINEAR_MAX) * (1 - LINEAR_FRACTION)
}

function pctToLeft(pct: number): string {
  return `${pctToFraction(pct) * 100}%`
}

function pctSpan(minPct: number, maxPct: number): { left: string; width: string } {
  const left = pctToFraction(minPct)
  const right = pctToFraction(maxPct)
  return {
    left: `${left * 100}%`,
    width: `${(right - left) * 100}%`,
  }
}

type Tone = "lethal" | "warm" | "cool"

function lethalTone(row: ScenarioRow): Tone {
  const peak = Math.max(row.maxPercent, row.critMaxPercent)
  if (peak >= 100) return "lethal"
  if (peak >= 75) return "warm"
  return "cool"
}

/** OHKO label: percent form when normal-roll chance is known, else a crit-only fallback. */
function ohkoLabel(row: ScenarioRow, peak: number): string | null {
  if (row.ohkoChance != null) {
    const pct = row.ohkoChance % 1 === 0 ? row.ohkoChance : row.ohkoChance.toFixed(1)
    return `${pct}% OHKO`
  }
  return peak >= 100 ? "仅暴击 OHKO" : null
}

const TONE_CLASS = {
  cool: "bg-amber-300/80 border-amber-400/60",
  warm: "bg-orange-400/80 border-orange-500/60",
  lethal: "bg-red-500/75 border-red-600/70",
} as const

const TONE_DOT_CLASS = {
  cool: "bg-amber-400",
  warm: "bg-orange-500",
  lethal: "bg-red-600",
} as const

type ResultTierChipProps = {
  tier: StatTierTokenSet
  className: string
  children: React.ReactNode
}

function ResultTierChip({ tier, className, children }: ResultTierChipProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-md border px-1.5 py-0.5",
        className,
        statTierChipClasses(tier),
      )}
    >
      {children}
    </span>
  )
}

type ResultStatLabelProps = {
  label: string
  actual?: string | null
}

function ResultStatLabel({ label, actual }: ResultStatLabelProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{label}</span>
      {actual && (
        <span className="text-muted-foreground text-[10px] font-normal opacity-75 tabular-nums">
          {actual}
        </span>
      )}
    </span>
  )
}

type RowLabelProps = {
  children: React.ReactNode
}

function RowLabel({ children }: RowLabelProps) {
  return (
    <span className="w-8 shrink-0 text-muted-foreground text-[10px]">{children}</span>
  )
}

type DamageBoxPlotProps = {
  move: CatalogMoveOption
  attackerStat: Pick<CatalogOption<string>, "id" | "label"> & { actual?: string | null }
  attackerItem: Pick<CatalogOption<string>, "id">
  defender: Pick<CatalogOption<string>, "id" | "label"> & { actual?: string | null }
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
  const offenseTier = isRangeEnvelope ? null : offenseStatTier(attackerStat.id)
  const defenseTier = defenderBulkTier(defender.id)
  const peak = Math.max(row.maxPercent, row.critMaxPercent)
  const ohko = ohkoLabel(row, peak)
  const box = pctSpan(row.minPercent, row.maxPercent)
  const crit = pctSpan(row.critMinPercent, row.critMaxPercent)
  const bridge =
    row.critMinPercent > row.maxPercent
      ? pctSpan(row.maxPercent, row.critMinPercent)
      : null

  return (
    <div className="flex min-h-[4.5rem] items-center gap-3">
      <div className="w-60 shrink-0 overflow-hidden rounded-md border">
        {showMove && (
          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <RowLabel>招式</RowLabel>
            <TypeBadge type={move.type} />
            <span className="text-xs">{move.label}</span>
          </div>
        )}
        {showMove && <Separator />}
        <div className="px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <RowLabel>攻击</RowLabel>
            {offenseTier ? (
              <ResultTierChip tier={offenseTier} className="text-xs font-medium leading-snug">
                <ResultStatLabel label={attackerStat.label} actual={attackerStat.actual} />
              </ResultTierChip>
            ) : (
              <span className="text-sm font-medium">
                <ResultStatLabel label={attackerStat.label} actual={attackerStat.actual} />
              </span>
            )}
            {attackerItem.id !== "none" && (
              <>
                <img
                  src={`/items/${itemSprite(attackerItem.id) ?? ""}`}
                  alt={itemAriaLabel(attackerItem.id)}
                  className="size-4 object-contain"
                />
                {itemHasNoBoostForMove(attackerItem.id, move.type) && (
                  <span className="text-muted-foreground text-[10px]">无加成</span>
                )}
              </>
            )}
          </div>
          {isRangeEnvelope && (
            <div className="text-muted-foreground mt-1 pl-10 text-[10px]">
              实数值区间 × 16 roll
            </div>
          )}
        </div>
        <Separator />
        <div className="flex items-center gap-1.5 px-3 py-1.5">
          <RowLabel>防御</RowLabel>
          {defenseTier ? (
            <ResultTierChip tier={defenseTier} className="text-xs leading-snug">
              <ResultStatLabel label={defender.label} actual={defender.actual} />
            </ResultTierChip>
          ) : (
            <span className="text-muted-foreground text-xs leading-snug">
              <ResultStatLabel label={defender.label} actual={defender.actual} />
            </span>
          )}
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger
          render={<div tabIndex={0} className="relative h-10 min-w-0 flex-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />}
        >
          <div
            className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-border"
            aria-hidden
          />

          <div
            className={cn(
              "absolute top-1/2 h-7 -translate-y-1/2 rounded-sm border",
              TONE_CLASS[tone],
            )}
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

          {[row.critMinPercent, row.critMaxPercent].map((p, i) => (
            <div
              key={i}
              className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-violet-600 bg-background"
              style={{ left: pctToLeft(p) }}
            />
          ))}

          <div
            className="pointer-events-none absolute -bottom-6 flex flex-wrap items-baseline gap-x-3 text-xs"
            style={{ left: box.left, minWidth: "12rem" }}
          >
            <span className="font-medium tabular-nums">
              {row.minPercent.toFixed(1)}% ~ {row.maxPercent.toFixed(1)}%
            </span>
            {ohko && (
              <span className="font-semibold text-red-600 tabular-nums">{ohko}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          align="center"
          className="flex-col items-stretch gap-1.5 max-w-[18rem] px-3 py-2"
        >
          <HoverRow marker={<span className={cn("inline-block size-2 rounded-sm", TONE_DOT_CLASS[tone])} />}>
            <HoverLabel>通常</HoverLabel>
            <span className="tabular-nums">
              {row.minPercent.toFixed(1)}% ~ {row.maxPercent.toFixed(1)}%
            </span>
          </HoverRow>
          <HoverRow marker={<span className="inline-block h-3 w-0.5 bg-foreground" />}>
            <HoverLabel>平均</HoverLabel>
            <span className="tabular-nums">{row.avgPercent.toFixed(1)}%</span>
          </HoverRow>
          <HoverRow marker={<span className="inline-block size-2 rounded-full border-2 border-violet-600 bg-transparent" />}>
            <HoverLabel>暴击</HoverLabel>
            <span className="tabular-nums">
              {row.critMinPercent.toFixed(1)}% ~ {row.critMaxPercent.toFixed(1)}%
            </span>
          </HoverRow>
          {ohko && (
            <HoverRow marker={<span className="inline-block size-2 rounded-full bg-red-500" />}>
              <HoverLabel>OHKO</HoverLabel>
              <span className="font-semibold tabular-nums">{ohko}</span>
            </HoverRow>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

type HoverRowProps = {
  marker: React.ReactNode
  children: React.ReactNode
}

function HoverRow({ marker, children }: HoverRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex size-4 shrink-0 items-center justify-center">
        {marker}
      </span>
      {children}
    </div>
  )
}

function HoverLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground text-[10px]">{children}</span>
}

export function DamageAxis() {
  return (
    <div className="bg-background sticky top-0 z-10 mb-2 flex pl-[15.75rem]">
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
          className="absolute top-0 h-full border-l border-dashed border-foreground/30"
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

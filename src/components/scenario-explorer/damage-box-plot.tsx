/** Box = main 16 rolls; whiskers = critical range when a normal branch exists. */

import { useIntl } from "react-intl"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type {
  CatalogAbilityOption,
  CatalogMoveOption,
  CatalogOption,
} from "@/lib/catalog/types"
import type { ScenarioRow } from "@/lib/scenario-pipeline"
import { cn } from "@/lib/utils"

import { formatKoProbability } from "./format-ko-probability"
import { DamageConditionsCard } from "./damage-conditions-card"

// Non-linear axis: 0–100% linear over 72% of width, 100–200% sqrt-compressed
// into the remaining 28%. Hard cap 200%.
const LINEAR_MAX = 100
const AXIS_MAX = 200
const LINEAR_FRACTION = 0.72
const TICKS = [0, 25, 50, 75, 100, 200]

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

function KoProbabilityColumns({ row }: { row: ScenarioRow }) {
  const intl = useIntl()
  const unavailable = intl.formatMessage({ id: "damage.ko.unavailable" })

  return (
    <dl className="grid w-full grid-cols-2 gap-3 rounded-lg bg-muted/50 px-3 py-2 text-xs tabular-nums md:w-36 md:shrink-0 md:gap-0 md:rounded-none md:bg-transparent md:p-0 md:text-center">
      <div className="grid grid-cols-[1fr_auto] items-center gap-2 md:block">
        <dt className="text-muted-foreground text-[11px] md:sr-only">OHKO</dt>
        <dd className="font-medium md:font-normal">
          {row.koProbabilities
            ? formatKoProbability(row.koProbabilities.ohko, intl.locale)
            : unavailable}
        </dd>
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-2 md:block">
        <dt className="text-muted-foreground text-[11px] md:sr-only">≤2HKO</dt>
        <dd className="font-medium md:font-normal">
          {row.koProbabilities
            ? formatKoProbability(row.koProbabilities.twoHit, intl.locale)
            : unavailable}
        </dd>
      </div>
    </dl>
  )
}

type DamageBoxPlotProps = {
  move: CatalogMoveOption
  attackerAbilities?: CatalogAbilityOption[]
  defenderAbilities?: CatalogAbilityOption[]
  attackerStat: Pick<CatalogOption<string>, "id" | "label"> & { actual?: string | null }
  defender: Pick<CatalogOption<string>, "id" | "label"> & { actual?: string | null }
  row: ScenarioRow
  isRangeEnvelope?: boolean
  showAccuracy?: boolean
}

export function DamageBoxPlot({
  move,
  attackerAbilities = [],
  defenderAbilities = [],
  attackerStat,
  defender,
  row,
  isRangeEnvelope = false,
  showAccuracy = false,
}: DamageBoxPlotProps) {
  const intl = useIntl()
  const tone = lethalTone(row)
  const box = pctSpan(row.minPercent, row.maxPercent)
  const crit = pctSpan(row.critMinPercent, row.critMaxPercent)
  const bridge =
    !row.criticalOnly && row.critMinPercent > row.maxPercent
      ? pctSpan(row.maxPercent, row.critMinPercent)
      : null

  return (
    <div className="grid min-h-[4.5rem] gap-3 md:grid-cols-[15rem_minmax(0,1fr)_9rem] md:items-center">
      <DamageConditionsCard
        move={move}
        row={row}
        attackerStat={attackerStat}
        defender={defender}
        attackerAbilities={attackerAbilities}
        defenderAbilities={defenderAbilities}
        isRangeEnvelope={isRangeEnvelope}
        showAccuracy={showAccuracy}
      />

      <Tooltip>
        <TooltipTrigger
          render={<div tabIndex={0} className="relative h-12 min-w-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40 md:h-10" />}
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

          {!isRangeEnvelope && (
            <div
              data-damage-average-marker
              className="absolute top-1/2 z-10 w-0.5 -translate-y-1/2 rounded-full bg-foreground"
              style={{ left: pctToLeft(row.avgPercent), height: "1.75rem" }}
            />
          )}

          {bridge && (
            <div
              className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-foreground/25"
              style={{ left: bridge.left, width: bridge.width }}
              aria-hidden
            />
          )}

          {!row.criticalOnly && (
            <>
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
            </>
          )}

          <div
            className="pointer-events-none absolute -bottom-5 flex w-full flex-wrap items-baseline justify-center text-xs max-md:!left-0 md:w-auto md:min-w-48 md:justify-start"
            style={{ left: box.left }}
          >
            <span className="font-medium tabular-nums">
              {row.minPercent.toFixed(1)}% ~ {row.maxPercent.toFixed(1)}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          align="center"
          className="flex-col items-stretch gap-1.5 max-w-[18rem] px-3 py-2"
        >
          <HoverRow marker={<span className={cn("inline-block size-2 rounded-sm", TONE_DOT_CLASS[tone])} />}>
            <HoverLabel>
              {intl.formatMessage({
                id: row.criticalOnly ? "damage.critical" : "damage.normal",
              })}
            </HoverLabel>
            <span className="tabular-nums">
              {row.minPercent.toFixed(1)}% ~ {row.maxPercent.toFixed(1)}%
            </span>
          </HoverRow>
          {!isRangeEnvelope && (
            <HoverRow marker={<span className="inline-block h-3 w-0.5 bg-foreground" />}>
              <HoverLabel>{intl.formatMessage({ id: "damage.average" })}</HoverLabel>
              <span className="tabular-nums">{row.avgPercent.toFixed(1)}%</span>
            </HoverRow>
          )}
          {!row.criticalOnly && (
            <HoverRow marker={<span className="inline-block size-2 rounded-full border-2 border-violet-600 bg-transparent" />}>
              <HoverLabel>{intl.formatMessage({ id: "damage.critical" })}</HoverLabel>
              <span className="tabular-nums">
                {row.critMinPercent.toFixed(1)}% ~ {row.critMaxPercent.toFixed(1)}%
              </span>
            </HoverRow>
          )}
        </TooltipContent>
      </Tooltip>
      <KoProbabilityColumns row={row} />
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
  const intl = useIntl()
  return (
    <div className="bg-background sticky top-14 z-10 mb-3 flex py-1 md:pl-[15.75rem] lg:top-0">
      <div className="relative h-6 min-w-0 flex-1">
        {TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute top-0 flex flex-col items-center"
            style={{
              left: pctToLeft(tick),
              transform:
                tick === 0 ? "none" : tick === AXIS_MAX ? "translateX(-100%)" : "translateX(-50%)",
            }}
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
      <div className="ml-3 hidden w-36 shrink-0 grid-cols-2 text-center text-[11px] font-medium md:grid">
        <span>{intl.formatMessage({ id: "damage.ko.ohko" })}</span>
        <span>{intl.formatMessage({ id: "damage.ko.twoHit" })}</span>
      </div>
    </div>
  )
}

export function BoxPlotLegend({ showAverage = true }: { showAverage?: boolean }) {
  const intl = useIntl()
  return (
    <div className="text-muted-foreground mt-10 flex flex-wrap gap-4 text-xs">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-3 w-6 rounded-sm border border-orange-400/60 bg-orange-400/50" />
        {intl.formatMessage({ id: "damage.legend.normal" })}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex items-center gap-0.5">
          <span className="inline-block h-px w-4 bg-violet-600/70" />
          <span className="inline-block size-2 rounded-full border-2 border-violet-600 bg-background" />
        </span>
        {intl.formatMessage({ id: "damage.legend.critical" })}
      </span>
      {showAverage && (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-0.5 bg-foreground" />
          {intl.formatMessage({ id: "damage.legend.average" })}
        </span>
      )}
    </div>
  )
}

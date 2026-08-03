/** Box = main 16 rolls; whiskers = critical range when a normal branch exists. */

import { useIntl } from "react-intl"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { KOProbabilityValue } from "@/lib/calc-adapter"
import type {
  CatalogAbilityOption,
  CatalogMoveOption,
  CatalogOption,
} from "@/lib/catalog/types"
import type { ScenarioResult } from "@/lib/scenario-pipeline"
import { cn } from "@/lib/utils"

import { formatKOProbability } from "./format-ko-probability"
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

function lethalTone(row: ScenarioResult): Tone {
  const peak = Math.max(row.maxPercent, row.critMaxPercent)
  if (peak >= 100) return "lethal"
  if (peak >= 75) return "warm"
  return "cool"
}

const TONE_CLASS = {
  cool: "damage-tone--cool",
  warm: "damage-tone--warm",
  lethal: "damage-tone--lethal",
} as const

const TONE_DOT_CLASS = {
  cool: "damage-tone-marker--cool",
  warm: "damage-tone-marker--warm",
  lethal: "damage-tone-marker--lethal",
} as const

/** Peak of a KO probability value (number or range), for zero/hot states. */
function koPeak(value: KOProbabilityValue): number {
  return typeof value === "number" ? value : value.max
}

function KOProbabilityColumns({ row }: { row: ScenarioResult }) {
  const intl = useIntl()
  const unavailable = intl.formatMessage({ id: "damage.ko.unavailable" })
  const ohkoHot = row.koProbabilities != null && koPeak(row.koProbabilities.ohko) > 0

  return (
    <dl className="grid w-full grid-cols-2 gap-3 rounded-[10px] bg-token-bg px-3 py-2 text-xs tabular-nums md:w-36 md:shrink-0 md:gap-0 md:rounded-none md:bg-transparent md:p-0 md:text-center">
      <div className="grid grid-cols-[1fr_auto] items-center gap-2 md:block">
        <dt className="text-muted-foreground text-[11px] md:sr-only">OHKO</dt>
        <dd className="text-[12px] font-extrabold">
          {row.koProbabilities ? (
            ohkoHot ? (
              /* Yellow is reserved for a non-zero OHKO Probability. */
              <span className="inline-block rounded-[8px] border-2 border-ink bg-signal-yellow px-1.5 py-px shadow-hud-chip">
                {formatKOProbability(row.koProbabilities.ohko, intl.locale)}
              </span>
            ) : (
              <span className={koPeak(row.koProbabilities.ohko) === 0 ? "text-hud-muted" : undefined}>
                {formatKOProbability(row.koProbabilities.ohko, intl.locale)}
              </span>
            )
          ) : (
            <span className="text-hud-muted">{unavailable}</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-2 md:block">
        <dt className="text-muted-foreground text-[11px] md:sr-only">≤2HKO</dt>
        <dd className="text-[12px] font-extrabold">
          {row.koProbabilities ? (
            <span className={koPeak(row.koProbabilities.twoHit) === 0 ? "text-hud-muted" : undefined}>
              {formatKOProbability(row.koProbabilities.twoHit, intl.locale)}
            </span>
          ) : (
            <span className="text-hud-muted">{unavailable}</span>
          )}
        </dd>
      </div>
    </dl>
  )
}

type DamageBoxPlotProps = {
  move: CatalogMoveOption
  attackerAbilities?: CatalogAbilityOption[]
  defenderAbilities?: CatalogAbilityOption[]
  attackerStat: Pick<CatalogOption<string>, "id" | "label"> & { statValue?: string | null }
  defender: Pick<CatalogOption<string>, "id" | "label"> & { statValue?: string | null }
  row: ScenarioResult
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
    <div className="grid min-h-[4.5rem] gap-3 md:grid-cols-[14.75rem_minmax(0,1fr)_9rem] md:items-center">
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
            className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-hairline"
            aria-hidden
          />

          {/* Data ink: pill box, ink frame, and damage-domain gradient. */}
          <div
            className={cn(
              "absolute top-1/2 h-7 -translate-y-1/2 rounded-full border border-ink",
              TONE_CLASS[tone],
            )}
            style={{ left: box.left, width: box.width }}
          />

          {!isRangeEnvelope && (
            <div
              data-damage-average-marker
              className="absolute top-1/2 z-10 w-[3px] -translate-y-1/2 rounded-full bg-ink"
              style={{ left: pctToLeft(row.avgPercent), height: "2.25rem" }}
            />
          )}

          {bridge && (
            <div
              className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-ink/25"
              style={{ left: bridge.left, width: bridge.width }}
              aria-hidden
            />
          )}

          {!row.criticalOnly && (
            <>
              <div
                className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-damage-critical"
                style={{ left: crit.left, width: crit.width }}
              />
              {[row.critMinPercent, row.critMaxPercent].map((p, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-damage-critical bg-paper"
                  style={{ left: pctToLeft(p) }}
                />
              ))}
            </>
          )}

          <div
            className="pointer-events-none absolute -bottom-5 flex w-full flex-wrap items-baseline justify-center max-md:!left-0 md:w-auto md:min-w-48 md:justify-start"
            style={{ left: box.left }}
          >
            <span className="text-[9.5px] font-extrabold tabular-nums">
              {row.minPercent.toFixed(1)}% ~ {row.maxPercent.toFixed(1)}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          align="center"
          className="flex-col items-stretch gap-1.5 max-w-[18rem] rounded-xl border-2 border-ink bg-paper px-3 py-2 shadow-hud-panel"
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
            <HoverRow marker={<span className="inline-block h-3.5 w-[3px] rounded-full bg-ink" />}>
              <HoverLabel>{intl.formatMessage({ id: "damage.average" })}</HoverLabel>
              <span className="tabular-nums">{row.avgPercent.toFixed(1)}%</span>
            </HoverRow>
          )}
          {!row.criticalOnly && (
            <HoverRow marker={<span className="inline-block size-2 rounded-full border-2 border-damage-critical bg-paper" />}>
              <HoverLabel>{intl.formatMessage({ id: "damage.critical" })}</HoverLabel>
              <span className="tabular-nums">
                {row.critMinPercent.toFixed(1)}% ~ {row.critMaxPercent.toFixed(1)}%
              </span>
            </HoverRow>
          )}
        </TooltipContent>
      </Tooltip>
      <KOProbabilityColumns row={row} />
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
    <div className="sticky top-[6.25rem] z-10 mb-2 flex rounded-t-[14px] border-b border-hairline bg-paper px-3 py-1.5 sm:px-4 md:pl-[16.5rem] lg:top-14">
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
            <div className="bg-hud-muted h-2.5 w-px" />
            <span className="text-hud-muted mt-0.5 text-[9px] tabular-nums">
              {tick}%
            </span>
          </div>
        ))}
        <div
          className="absolute top-0 h-full border-l border-dashed border-ink/35"
          style={{ left: pctToLeft(100) }}
          aria-hidden
        />
      </div>
      <div className="ml-3 hidden w-36 shrink-0 grid-cols-2 text-center text-[11px] font-bold md:grid">
        <span>{intl.formatMessage({ id: "damage.ko.ohko" })}</span>
        <span>{intl.formatMessage({ id: "damage.ko.twoHit" })}</span>
      </div>
    </div>
  )
}

export function BoxPlotLegend({ showAverage = true }: { showAverage?: boolean }) {
  const intl = useIntl()
  return (
    <div className="mt-2 flex flex-wrap gap-4 border-t border-hairline px-3 py-3 text-[10.5px] font-extrabold text-hud-muted sm:px-4">
      <span className="inline-flex items-center gap-1.5">
        <span className="damage-tone--warm inline-block h-3 w-6 rounded-full border border-ink" />
        {intl.formatMessage({ id: "damage.legend.normal" })}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex items-center gap-0.5">
          <span className="inline-block h-[2px] w-4 bg-damage-critical" />
          <span className="inline-block size-2 rounded-full border-2 border-damage-critical bg-paper" />
        </span>
        {intl.formatMessage({ id: "damage.legend.critical" })}
      </span>
      {showAverage && (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3.5 w-[3px] rounded-full bg-ink" />
          {intl.formatMessage({ id: "damage.legend.average" })}
        </span>
      )}
    </div>
  )
}

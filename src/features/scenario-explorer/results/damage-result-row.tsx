/** Box = main 16 rolls; whiskers = critical range when a normal branch exists. */

import { useIntl } from "react-intl"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { KOProbabilityValue } from "@/lib/damage-calculation"
import type {
  CatalogAbilityOption,
  CatalogMoveOption,
  CatalogOption,
} from "@/lib/catalog"
import type { ScenarioResult } from "@/lib/scenario"
import type { StatValueChipModel } from "@/lib/stat-preset"
import { cn } from "@/lib/utils"

import { ChildScenarioDiff, DamageRowCaption, DamageScenarioSummary } from "./damage-scenario-summary"
import {
  DAMAGE_TONE_CLASS,
  DAMAGE_TONE_END,
  DAMAGE_TONE_MARKER_CLASS,
  DAMAGE_TONE_START,
  DAMAGE_TONES,
  damageToneOf,
} from "./damage-tone"
import { formatKOProbability } from "./format-ko-probability"

// Non-linear axis: 0–100% linear over 72% of width, 100–200% sqrt-compressed
// into the remaining 28%. Hard cap 200%.
const LINEAR_MAX = 100
const AXIS_MAX = 200
const LINEAR_FRACTION = 0.72
const TICKS = [0, 25, 50, 75, 100, 200]
const DESKTOP_RESULT_GRID = "md:grid-cols-[14.75rem_minmax(0,1fr)_9rem] md:gap-3"

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

function formatDamagePercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

function endpointTones(endpoints: NonNullable<ScenarioResult["rangeEndpoints"]>) {
  return {
    low: damageToneOf(endpoints.low.minPercent, endpoints.low.maxPercent),
    high: damageToneOf(endpoints.high.minPercent, endpoints.high.maxPercent),
  }
}

function envelopeVars(endpoints: NonNullable<ScenarioResult["rangeEndpoints"]>): React.CSSProperties {
  const tones = endpointTones(endpoints)
  return {
    "--damage-tone-left": DAMAGE_TONE_START[tones.low],
    "--damage-tone-right": DAMAGE_TONE_END[tones.high],
  } as React.CSSProperties
}

function boxStyle(row: ScenarioResult): { className: string; style: React.CSSProperties } {
  const span = pctSpan(row.minPercent, row.maxPercent)
  const endpoints = row.rangeEndpoints
  if (!endpoints) {
    return {
      className: DAMAGE_TONE_CLASS[damageToneOf(row.minPercent, row.maxPercent)],
      style: span,
    }
  }
  return {
    className: "damage-tone-envelope",
    style: { ...span, ...envelopeVars(endpoints) },
  }
}

function toneMarker(row: ScenarioResult) {
  const endpoints = row.rangeEndpoints
  if (!endpoints) {
    const tone = damageToneOf(row.minPercent, row.maxPercent)
    return <span className={cn("inline-block size-2 rounded-sm", DAMAGE_TONE_MARKER_CLASS[tone])} />
  }
  return (
    <span
      className="damage-tone-envelope inline-block size-2 rounded-sm"
      style={envelopeVars(endpoints)}
    />
  )
}

/** Peak of a KO probability value (number or range), for the zero/muted state. */
function koPeak(value: KOProbabilityValue): number {
  return typeof value === "number" ? value : value.max
}

function KOProbabilitySummary({ row }: { row: ScenarioResult }) {
  const intl = useIntl()
  const unavailable = intl.formatMessage({ id: "damage.ko.unavailable" })

  return (
    <dl className="flex w-12 shrink-0 flex-col items-end justify-center gap-0.5 overflow-hidden whitespace-nowrap text-[9px] leading-none font-extrabold tabular-nums md:grid md:w-36 md:grid-cols-2 md:gap-0 md:overflow-visible md:text-center md:text-[12px] md:leading-normal">
      <div>
        <dt className="sr-only">OHKO</dt>
        <dd>
          {row.koProbabilities ? (
            <span className={koPeak(row.koProbabilities.ohko) === 0 ? "text-hud-muted" : undefined}>
              {formatKOProbability(row.koProbabilities.ohko, intl.locale)}
            </span>
          ) : (
            <span className="text-hud-muted">{unavailable}</span>
          )}
        </dd>
      </div>
      <div>
        <dt className="sr-only">≤2HKO</dt>
        <dd>
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

type DamageResultRowProps = {
  move: CatalogMoveOption
  attackerAbilities?: CatalogAbilityOption[]
  defenderAbilities?: CatalogAbilityOption[]
  attackerStat: Pick<CatalogOption<string>, "id"> & {
    chips: StatValueChipModel[]
    expandable?: boolean
    expanded?: boolean
    onToggle?: () => void
  }
  defender: Pick<CatalogOption<string>, "id"> & {
    chips: StatValueChipModel[]
    expandable?: boolean
    expanded?: boolean
    onToggle?: () => void
  }
  row: ScenarioResult
  showAccuracy?: boolean
  /** Child of an expanded Range parent: only these axes differ from the parent. */
  diff?: { offense: boolean; defense: boolean }
}

export function DamageResultRow({
  move,
  attackerAbilities = [],
  defenderAbilities = [],
  attackerStat,
  defender,
  row,
  showAccuracy = false,
  diff,
}: DamageResultRowProps) {
  const intl = useIntl()
  const fill = boxStyle(row)
  const box = pctSpan(row.minPercent, row.maxPercent)
  const crit = pctSpan(row.critMinPercent, row.critMaxPercent)
  const hasReferenceCritical = !row.criticalOnly && row.moveMechanics.critical !== null
  const bridge =
    hasReferenceCritical && row.critMinPercent > row.maxPercent
      ? pctSpan(row.maxPercent, row.critMinPercent)
      : null

  const summaryProps = {
    move,
    row,
    attackerStat,
    defender,
    attackerAbilities,
    defenderAbilities,
    showAccuracy,
  }

  return (
    <div className={cn(
      "grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-x-1 gap-y-1 md:min-h-[4.5rem]",
      DESKTOP_RESULT_GRID,
    )}>
      {diff ? (
        <div className="col-span-2 md:col-span-1">
          <ChildScenarioDiff attackerStat={attackerStat} defender={defender} diff={diff} />
        </div>
      ) : (
        <>
          <div className="col-span-2 md:hidden">
            <DamageRowCaption {...summaryProps} />
          </div>
          <div className="hidden md:block">
            <DamageScenarioSummary {...summaryProps} />
          </div>
        </>
      )}

      <Tooltip>
        <TooltipTrigger
          render={<div tabIndex={0} className="relative h-8 min-w-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40 md:h-10" />}
        >
          <div
            className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-hairline"
            aria-hidden
          />

          {/* Data ink: pill box, ink frame, and damage-domain gradient. */}
          <div
            className={cn(
              "absolute top-1/2 h-3.5 -translate-y-1/2 rounded-sm border border-ink md:h-7",
              fill.className,
            )}
            style={fill.style}
          />

          {bridge && (
            <div
              className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-ink/25"
              style={{ left: bridge.left, width: bridge.width }}
              aria-hidden
            />
          )}

          {hasReferenceCritical && (
            <>
              <div
                className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-damage-critical"
                style={{ left: crit.left, width: crit.width }}
              />
              {[row.critMinPercent, row.critMaxPercent].map((p, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-damage-critical bg-paper md:size-2"
                  style={{ left: pctToLeft(p) }}
                />
              ))}
            </>
          )}

          <div
            data-damage-range-label
            className="pointer-events-none absolute bottom-0 flex justify-center overflow-visible whitespace-nowrap text-[8px] font-extrabold leading-none tabular-nums md:-bottom-5 md:justify-start md:text-[9.5px] md:leading-normal"
            style={{ left: box.left, width: box.width }}
          >
            <span>
              {formatDamagePercent(row.minPercent, intl.locale)} ~ {formatDamagePercent(row.maxPercent, intl.locale)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          align="center"
          className="flex-col items-stretch gap-1.5 max-w-[18rem] rounded-xl border-2 border-ink bg-paper px-3 py-2 shadow-hud-panel"
        >
          <HoverRow marker={toneMarker(row)}>
            <HoverLabel>
              {intl.formatMessage({
                id: row.criticalOnly ? "damage.critical" : "damage.normal",
              })}
            </HoverLabel>
            <span className="tabular-nums">
              {formatDamagePercent(row.minPercent, intl.locale)} ~ {formatDamagePercent(row.maxPercent, intl.locale)}
            </span>
          </HoverRow>
          {hasReferenceCritical && (
            <HoverRow marker={<span className="inline-block size-2 rounded-full border-2 border-damage-critical bg-paper" />}>
              <HoverLabel>{intl.formatMessage({ id: "damage.critical" })}</HoverLabel>
              <span className="tabular-nums">
                {formatDamagePercent(row.critMinPercent, intl.locale)} ~ {formatDamagePercent(row.critMaxPercent, intl.locale)}
              </span>
            </HoverRow>
          )}
        </TooltipContent>
      </Tooltip>
      <KOProbabilitySummary row={row} />
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

export function DamagePercentAxis() {
  const intl = useIntl()
  return (
    <div className={cn(
      "sticky top-12 z-10 grid grid-cols-[minmax(0,1fr)_3rem] items-end gap-1 border-b border-hairline bg-paper px-2 py-0.5 md:mb-2 md:grid md:rounded-t-[14px] md:px-3 md:py-1.5 lg:top-14 lg:px-4",
      DESKTOP_RESULT_GRID,
    )}>
      <div className="hidden md:block" aria-hidden />
      <div className="relative h-5 min-w-0 md:h-6">
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
            <div className="bg-hud-muted h-2 w-px md:h-2.5" />
            <span className="text-hud-muted mt-px text-[8px] tabular-nums md:mt-0.5 md:text-[9px]">
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
      <div className="text-right text-[8px] font-extrabold leading-none text-hud-muted md:grid md:w-36 md:shrink-0 md:grid-cols-2 md:text-center md:text-[11px] md:leading-normal">
        <span className="md:contents">
          {intl.formatMessage({ id: "damage.ko.ohko" })}
          <br className="md:hidden" />
        </span>
        <span>{intl.formatMessage({ id: "damage.ko.twoHit" })}</span>
      </div>
    </div>
  )
}

export function DamageRangeLegend() {
  const intl = useIntl()
  return (
    <div className="mt-2 flex flex-wrap gap-4 border-t border-hairline px-3 py-3 text-[10.5px] font-extrabold text-hud-muted sm:px-4">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex overflow-hidden rounded-full border border-ink">
          {DAMAGE_TONES.map((tone) => (
            <span key={tone} className={cn("inline-block h-3 w-3.5", DAMAGE_TONE_CLASS[tone])} />
          ))}
        </span>
        {intl.formatMessage({ id: "damage.legend.normal" })}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex items-center gap-0.5">
          <span className="inline-block h-[2px] w-4 bg-damage-critical" />
          <span className="inline-block size-2 rounded-full border-2 border-damage-critical bg-paper" />
        </span>
        {intl.formatMessage({ id: "damage.legend.critical" })}
      </span>
    </div>
  )
}

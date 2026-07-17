/** Box = main 16 rolls; whiskers = critical range when a normal branch exists. */

import { useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Separator } from "@/components/ui/separator"
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
import { itemAriaLabel, itemSprite } from "@/lib/held-item"
import type { ProvenanceOptionSets, ScenarioRow } from "@/lib/scenario-pipeline"
import {
  defenderBulkTier,
  offenseStatTier,
  statTierChipClasses,
  type StatTierTokenSet,
} from "@/lib/stat-tier-colors"
import { cn } from "@/lib/utils"

import { formatKoProbability } from "./format-ko-probability"

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

function ItemIcons({ ids }: { ids: string[] }) {
  return ids.filter((id) => id !== "none").map((id) => {
    const label = itemAriaLabel(id)
    const sprite = itemSprite(id)

    return sprite ? (
      <img
        key={id}
        src={`/items/${sprite}`}
        alt={label}
        title={label}
        className="size-4 object-contain"
      />
    ) : (
      <span key={id} title={label} className="rounded border px-1 text-[10px]">
        {label}
      </span>
    )
  })
}

function FoldedItemChoices({ items }: { items?: ProvenanceOptionSets }) {
  const intl = useIntl()
  const inactive = items?.inactive.filter((id) => id !== "none") ?? []
  const unsupported = items?.unsupported.filter((id) => id !== "none") ?? []
  const count = inactive.length + unsupported.length

  if (count === 0) return null

  return (
    <details className="text-muted-foreground mt-1 pl-10 text-[10px]">
      <summary className="w-fit cursor-pointer select-none">
        {intl.formatMessage({ id: "damage.items.other" }, { count })}
      </summary>
      <div className="mt-1 space-y-1">
        {inactive.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{intl.formatMessage({ id: "damage.noBoost" })}</span>
            <ItemIcons ids={inactive} />
          </div>
        )}
        {unsupported.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{intl.formatMessage({ id: "damage.items.unsupported" })}</span>
            <ItemIcons ids={unsupported} />
          </div>
        )}
      </div>
    </details>
  )
}

function formatStage(value: string): string {
  const stage = Number(value)
  return stage > 0 ? `+${stage}` : value
}

function StageValues({ ids }: { ids: string[] }) {
  return ids.map((id) => (
    <span key={id} className="rounded border px-1 text-[10px] tabular-nums">
      {formatStage(id)}
    </span>
  ))
}

function FoldedStageChoices({ stages }: { stages?: ProvenanceOptionSets }) {
  const intl = useIntl()
  const neutral = stages?.neutral ?? []
  const inactive = stages?.inactive ?? []
  const unsupported = stages?.unsupported ?? []
  const count = neutral.length + inactive.length + unsupported.length

  if (count === 0) return null

  return (
    <details className="text-muted-foreground mt-1 pl-10 text-[10px]">
      <summary className="w-fit cursor-pointer select-none">
        {intl.formatMessage({ id: "damage.stages.other" }, { count })}
      </summary>
      <div className="mt-1 space-y-1">
        {neutral.length > 0 && (
          <div className="flex items-center gap-1">
            <StageValues ids={neutral} />
          </div>
        )}
        {inactive.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{intl.formatMessage({ id: "damage.sources.inactive" })}</span>
            <StageValues ids={inactive} />
          </div>
        )}
        {unsupported.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{intl.formatMessage({ id: "damage.sources.unsupported" })}</span>
            <StageValues ids={unsupported} />
          </div>
        )}
      </div>
    </details>
  )
}

function WeatherValues({ ids }: { ids: string[] }) {
  const intl = useIntl()
  return ids.filter((id) => id !== "none").map((id) => (
    <span key={id} className="rounded border px-1 text-[10px]">
      {intl.formatMessage({ id: `track.weather.${id}` })}
    </span>
  ))
}

function FoldedWeatherChoices({ weather }: { weather?: ProvenanceOptionSets }) {
  const intl = useIntl()
  const inactive = weather?.inactive.filter((id) => id !== "none") ?? []
  const unsupported = weather?.unsupported.filter((id) => id !== "none") ?? []
  const count = inactive.length + unsupported.length

  if (count === 0) return null

  return (
    <details className="text-muted-foreground mt-1 pl-10 text-[10px]">
      <summary className="w-fit cursor-pointer select-none">
        {intl.formatMessage({ id: "damage.weather.other" }, { count })}
      </summary>
      <div className="mt-1 space-y-1">
        {inactive.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{intl.formatMessage({ id: "damage.sources.inactive" })}</span>
            <WeatherValues ids={inactive} />
          </div>
        )}
        {unsupported.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{intl.formatMessage({ id: "damage.sources.unsupported" })}</span>
            <WeatherValues ids={unsupported} />
          </div>
        )}
      </div>
    </details>
  )
}

function ScreenValues({ ids }: { ids: string[] }) {
  const intl = useIntl()
  return ids.filter((id) => id !== "none").map((id) => (
    <span key={id} className="rounded border px-1 text-[10px]">
      {intl.formatMessage({ id: `track.screen.${id}` })}
    </span>
  ))
}

function FoldedScreenChoices({ screens }: { screens?: ProvenanceOptionSets }) {
  const intl = useIntl()
  const inactive = screens?.inactive.filter((id) => id !== "none") ?? []

  if (inactive.length === 0) return null

  return (
    <details className="text-muted-foreground mt-1 pl-10 text-[10px]">
      <summary className="w-fit cursor-pointer select-none">
        {intl.formatMessage({ id: "damage.screens.other" }, { count: inactive.length })}
      </summary>
      <div className="mt-1 flex items-center gap-1">
        <span>{intl.formatMessage({ id: "damage.sources.inactive" })}</span>
        <ScreenValues ids={inactive} />
      </div>
    </details>
  )
}

function AbilityValues({
  ids,
  options,
}: {
  ids: string[]
  options: CatalogAbilityOption[]
}) {
  return ids.map((id) => {
    const ability = options.find((option) => String(option.id) === id)
    return (
      <span key={id} className="rounded border px-1 text-[10px]">
        {ability?.label ?? id}
      </span>
    )
  })
}

function FoldedAbilityChoices({
  abilities,
  options,
}: {
  abilities?: ProvenanceOptionSets
  options: CatalogAbilityOption[]
}) {
  const intl = useIntl()
  const inactive = abilities?.inactive ?? []
  const unsupported = abilities?.unsupported ?? []
  const count = inactive.length + unsupported.length

  if (count === 0) return null

  return (
    <details className="text-muted-foreground mt-1 pl-10 text-[10px]">
      <summary className="w-fit cursor-pointer select-none">
        {intl.formatMessage({ id: "damage.abilities.other" }, { count })}
      </summary>
      <div className="mt-1 space-y-1">
        {inactive.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{intl.formatMessage({ id: "damage.sources.inactive" })}</span>
            <AbilityValues ids={inactive} options={options} />
          </div>
        )}
        {unsupported.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{intl.formatMessage({ id: "damage.sources.unsupported" })}</span>
            <AbilityValues ids={unsupported} options={options} />
          </div>
        )}
      </div>
    </details>
  )
}

function KoProbabilityColumns({ row }: { row: ScenarioRow }) {
  const intl = useIntl()
  const unavailable = intl.formatMessage({ id: "damage.ko.unavailable" })

  return (
    <dl className="grid w-36 shrink-0 grid-cols-2 text-center text-xs tabular-nums">
      <div>
        <dt className="sr-only">OHKO</dt>
        <dd>
          {row.koProbabilities
            ? formatKoProbability(row.koProbabilities.ohko, intl.locale)
            : unavailable}
        </dd>
      </div>
      <div>
        <dt className="sr-only">≤2HKO</dt>
        <dd>
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
  showMove?: boolean
  isRangeEnvelope?: boolean
}

export function DamageBoxPlot({
  move,
  attackerAbilities = [],
  defenderAbilities = [],
  attackerStat,
  defender,
  row,
  showMove = true,
  isRangeEnvelope = false,
}: DamageBoxPlotProps) {
  const intl = useIntl()
  const tone = lethalTone(row)
  const offenseTier = isRangeEnvelope ? null : offenseStatTier(attackerStat.id)
  const defenseTier = defenderBulkTier(defender.id)
  const itemProvenance = row.provenance["held-item"]
  const attackerStageProvenance = row.provenance["attacker-stage"]
  const defenderStageProvenance = row.provenance["defender-stage"]
  const weatherProvenance = row.provenance.weather
  const attackerAbilityProvenance = row.provenance["attacker-ability"]
  const defenderAbilityProvenance = row.provenance["defender-ability"]
  const screenProvenance = row.provenance.screen
  const box = pctSpan(row.minPercent, row.maxPercent)
  const crit = pctSpan(row.critMinPercent, row.critMaxPercent)
  const bridge =
    !row.criticalOnly && row.critMinPercent > row.maxPercent
      ? pctSpan(row.maxPercent, row.critMinPercent)
      : null

  return (
    <div className="flex min-h-[4.5rem] items-center gap-3">
      <div className="w-60 shrink-0 overflow-hidden rounded-md border">
        {showMove && (
          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <RowLabel>{intl.formatMessage({ id: "damage.row.move" })}</RowLabel>
            <TypeBadge type={move.type} />
            <span className="text-xs">
              {move.label}
              {move.isSpread && <span className="text-muted-foreground ml-1">AoE</span>}
            </span>
          </div>
        )}
        {showMove && <Separator />}
        <div className="px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <RowLabel>{intl.formatMessage({ id: "damage.row.attack" })}</RowLabel>
            {offenseTier ? (
              <ResultTierChip tier={offenseTier} className="text-xs font-medium leading-snug">
                <ResultStatLabel label={attackerStat.label} actual={attackerStat.actual} />
              </ResultTierChip>
            ) : (
              <span className="text-sm font-medium">
                <ResultStatLabel label={attackerStat.label} actual={attackerStat.actual} />
              </span>
            )}
            <StageValues ids={attackerStageProvenance?.effective ?? []} />
            <ItemIcons ids={itemProvenance?.effective ?? []} />
            <AbilityValues
              ids={attackerAbilityProvenance?.effective ?? []}
              options={attackerAbilities}
            />
            <WeatherValues ids={weatherProvenance?.effective ?? []} />
          </div>
          <FoldedStageChoices stages={attackerStageProvenance} />
          <FoldedItemChoices items={itemProvenance} />
          <FoldedAbilityChoices
            abilities={attackerAbilityProvenance}
            options={attackerAbilities}
          />
          <FoldedWeatherChoices weather={weatherProvenance} />
          {isRangeEnvelope && (
            <div className="text-muted-foreground mt-1 pl-10 text-[10px]">
              {intl.formatMessage({ id: "damage.rangeEnvelope" })}
            </div>
          )}
        </div>
        <Separator />
        <div className="px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <RowLabel>{intl.formatMessage({ id: "damage.row.defense" })}</RowLabel>
            {defenseTier ? (
              <ResultTierChip tier={defenseTier} className="text-xs leading-snug">
                <ResultStatLabel label={defender.label} actual={defender.actual} />
              </ResultTierChip>
            ) : (
              <span className="text-muted-foreground text-xs leading-snug">
                <ResultStatLabel label={defender.label} actual={defender.actual} />
              </span>
            )}
            <StageValues ids={defenderStageProvenance?.effective ?? []} />
            <AbilityValues
              ids={defenderAbilityProvenance?.effective ?? []}
              options={defenderAbilities}
            />
            <ScreenValues ids={screenProvenance?.effective ?? []} />
          </div>
          <FoldedStageChoices stages={defenderStageProvenance} />
          <FoldedAbilityChoices
            abilities={defenderAbilityProvenance}
            options={defenderAbilities}
          />
          <FoldedScreenChoices screens={screenProvenance} />
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
            className="pointer-events-none absolute -bottom-6 flex flex-wrap items-baseline text-xs"
            style={{ left: box.left, minWidth: "12rem" }}
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
          <HoverRow marker={<span className="inline-block h-3 w-0.5 bg-foreground" />}>
            <HoverLabel>{intl.formatMessage({ id: "damage.average" })}</HoverLabel>
            <span className="tabular-nums">{row.avgPercent.toFixed(1)}%</span>
          </HoverRow>
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
      <div className="ml-3 grid w-36 shrink-0 grid-cols-2 text-center text-[10px] font-medium">
        <span>{intl.formatMessage({ id: "damage.ko.ohko" })}</span>
        <span>{intl.formatMessage({ id: "damage.ko.twoHit" })}</span>
      </div>
    </div>
  )
}

export function BoxPlotLegend() {
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
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-3 w-0.5 bg-foreground" />
        {intl.formatMessage({ id: "damage.legend.average" })}
      </span>
    </div>
  )
}

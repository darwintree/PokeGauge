import { ChevronDown, Info, MoreHorizontal } from "lucide-react"
import { useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  NEUTRAL_MODIFIER,
  type MechanicsPhase,
  type ScenarioTrack,
} from "@/lib/damage-calculation"
import type { CatalogAbilityOption, CatalogMoveOption } from "@/lib/catalog"
import { abilityIsHiddenNeutral } from "@/lib/ability"
import {
  itemAriaLabel,
  itemIsHiddenNeutral,
} from "@/lib/held-item"
import type { SupportedLocale } from "@/lib/i18n"
import type { ScenarioResult } from "@/lib/scenario"
import type { StatValueChipModel } from "@/lib/stat-preset"
import { cn } from "@/lib/utils"

import { HeldItemSpriteIcon } from "../tracks/held-item/held-item-sprite-icon"
import { StatValueChipPair } from "../tracks/stats/stat-value-chip"
import { visibleFormulaPhases } from "./formula-details"

type DamageScenarioSummaryProps = {
  move: CatalogMoveOption
  row: ScenarioResult
  attackerStat: {
    chips: StatValueChipModel[]
    expandable?: boolean
    expanded?: boolean
    onToggle?: () => void
  }
  defender: {
    chips: StatValueChipModel[]
    expandable?: boolean
    expanded?: boolean
    onToggle?: () => void
  }
  attackerAbilities: CatalogAbilityOption[]
  defenderAbilities: CatalogAbilityOption[]
  showAccuracy: boolean
  /** Mobile group headers carry the move identity; hide it from the per-row caption. */
  showMoveInCaption?: boolean
}

function abilitySourceIsHidden(track: ScenarioTrack, id: string): boolean {
  return (track === "attacker-ability" || track === "defender-ability") &&
    abilityIsHiddenNeutral(id)
}

function modifierLabel(value: number): string {
  return `${Number((value / NEUTRAL_MODIFIER).toFixed(2))}×`
}

function sourceLabel(
  track: ScenarioTrack,
  id: string,
  props: DamageScenarioSummaryProps,
  intl: ReturnType<typeof useIntl>,
): string {
  if (track === "held-item" || track === "defender-held-item") {
    return itemAriaLabel(id, intl.locale as SupportedLocale)
  }
  if (track === "attacker-ability" || track === "defender-ability") {
    const options = track === "attacker-ability"
      ? props.attackerAbilities
      : props.defenderAbilities
    return options.find((option) => String(option.id) === id)?.label ?? id
  }
  if (track === "weather") return intl.formatMessage({ id: `track.weather.${id}` })
  if (track === "terrain") return intl.formatMessage({ id: `track.terrain.${id}` })
  if (track === "screen") return intl.formatMessage({ id: `track.screen.${id}` })
  if (track === "attacker-stage" || track === "defender-stage") {
    return Number(id) > 0 ? `+${id}` : id
  }
  return id
}

function activeTokens(props: DamageScenarioSummaryProps, tracks: ScenarioTrack[]) {
  return tracks.flatMap((track) =>
    (props.row.provenance[track]?.active ?? [])
      .filter((id) => id !== "none" && id !== "0" && !abilitySourceIsHidden(track, id))
      .map((id) => ({ track, id })),
  )
}

/** 单位(攻/防)生效条件:道具 + 特性。战场条件归 ConditionsStrip。 */
function sideTokens(props: DamageScenarioSummaryProps, side: "attack" | "defense") {
  return activeTokens(props, side === "attack"
    ? ["held-item", "attacker-ability"]
    : ["defender-held-item", "defender-ability"])
}

function TextTokenChip({ label }: { label: string }) {
  return (
    <span className="max-w-[5rem] truncate rounded-[5px] bg-token-bg px-1 text-[9px] font-extrabold leading-4 text-ink" title={label}>
      {label}
    </span>
  )
}

/** 攻/防一栏:行首 = 标签 + 道具 icon + 特性 + 阶级(右锚),次行 = 数值 chip 组。 */
function UnitPanel({
  side,
  label,
  stage,
  stat,
  ...props
}: DamageScenarioSummaryProps & {
  side: "attack" | "defense"
  label: string
  stage: number
  stat: DamageScenarioSummaryProps["attackerStat"]
}) {
  const intl = useIntl()
  const tokens = sideTokens(props, side)
  const item = tokens.find(({ track }) => track === "held-item" || track === "defender-held-item")
  const abilities = tokens.filter(({ track }) => track === "attacker-ability" || track === "defender-ability")
  return (
    <div className="min-w-0 space-y-0.5 px-1.5 py-1">
      <div className="flex h-4 items-center gap-1">
        <span className="shrink-0 text-[8.5px] text-muted-foreground">{label}</span>
        {item && (
          <span
            className="grid size-4 shrink-0 place-items-center"
            title={itemAriaLabel(item.id, intl.locale as SupportedLocale)}
          >
            <HeldItemSpriteIcon id={item.id} className="size-4" />
          </span>
        )}
        {abilities.map(({ track, id }) => (
          <TextTokenChip key={`${track}:${id}`} label={sourceLabel(track, id, props, intl)} />
        ))}
        {stage !== 0 && (
          <b className="ml-auto text-[10px] font-extrabold tabular-nums text-ink">{stageLabel(stage)}</b>
        )}
      </div>
      <StatValueChipPair
        chips={stat.chips}
        compact
        expandable={stat.expandable}
        expanded={stat.expanded}
        onToggle={stat.onToggle}
        toggleLabel={intl.formatMessage({
          id: side === "attack"
            ? stat.expanded ? "damage.row.collapseOffense" : "damage.row.expandOffense"
            : stat.expanded ? "damage.row.collapseDefense" : "damage.row.expandDefense",
        })}
      />
    </div>
  )
}

function additionalEntries(props: DamageScenarioSummaryProps) {
  return (Object.entries(props.row.provenance) as Array<[
    ScenarioTrack,
    ScenarioResult["provenance"][ScenarioTrack],
  ]>).flatMap(([track, sets]) =>
    (["inactive", "unsupported", "neutral"] as const).flatMap((state) =>
      (sets?.[state] ?? [])
        .filter((id) =>
          id !== "none" &&
          id !== "0" &&
          !abilitySourceIsHidden(track, id) &&
          !((track === "held-item" || track === "defender-held-item") &&
            itemIsHiddenNeutral(id)),
        )
        .map((id) => ({ track, state, id })),
    ),
  )
}

/** 卡底条:战场条件(天气/场地/墙)与「其他条件」折叠同一行。
 * 生效战场 chip 必须在 summary 内(或 details 外),否则 closed `<details>` 会把非 summary 子节点藏掉。 */
function ConditionsStrip(props: DamageScenarioSummaryProps) {
  const intl = useIntl()
  const field = activeTokens(props, ["weather", "terrain", "screen"])
  const entries = additionalEntries(props)
  const count = entries.length

  if (field.length === 0 && count === 0) return null

  const chips = field.map(({ track, id }) => (
    <TextTokenChip key={`${track}:${id}`} label={sourceLabel(track, id, props, intl)} />
  ))

  if (count === 0) {
    return (
      <div className="flex flex-wrap items-center gap-1 border-t border-dashed border-card-border px-2 py-0.5">
        {chips}
      </div>
    )
  }

  return (
    <details className="group border-t border-dashed border-card-border px-2 py-0.5 text-[10px] text-muted-foreground">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-1 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden [&::marker]:hidden">
        {chips.length > 0 && (
          <span
            className="flex min-w-0 flex-wrap items-center gap-1"
            onClick={(event) => event.preventDefault()}
          >
            {chips}
          </span>
        )}
        <span className="ml-auto flex shrink-0 items-center gap-1 text-[9px] leading-none font-bold text-hud-muted hover:text-ink">
          <MoreHorizontal className="size-2.5 shrink-0" aria-hidden />
          {intl.formatMessage({ id: "damage.conditions.other" }, { count })}
          <ChevronDown className="size-2.5 transition-transform group-open:rotate-180" aria-hidden />
        </span>
      </summary>
      <div className="space-y-1 pt-1 text-ink">
        {entries.map(({ track, state, id }) => (
          <p key={`${track}:${state}:${id}`}>
            {intl.formatMessage({ id: `damage.sources.${state}` })}
            {" · "}
            {sourceLabel(track, id, props, intl)}
          </p>
        ))}
      </div>
    </details>
  )
}

function CritCtMark({ label }: { label: string }) {
  return (
    <span
      title={label}
      aria-label={label}
      className="inline-flex h-[1.1em] items-center rounded-[3px] bg-damage-critical px-0.5 text-[0.65em] font-extrabold leading-none text-paper"
    >
      CT
    </span>
  )
}

function DamageFormulaTooltip(props: DamageScenarioSummaryProps) {
  const intl = useIntl()
  const mechanics = props.row.moveMechanics
  const branch = mechanics.normal ?? mechanics.critical
  if (!branch) return null
  const accuracy = mechanics.hitFact === "always-hits"
    ? intl.formatMessage({ id: "damage.conditions.alwaysHits" })
    : new Intl.NumberFormat(intl.locale, { style: "percent", maximumFractionDigits: 0 }).format(Number(mechanics.hitFact) / 100)
  const phaseLabels: Record<MechanicsPhase["kind"], string> = {
    "base-power": intl.formatMessage({ id: "damage.conditions.basePowerModifier" }),
    spread: intl.formatMessage({ id: "damage.conditions.spread" }),
    "weather-damage": intl.formatMessage({ id: "damage.conditions.weatherDamage" }),
    critical: intl.formatMessage({ id: "damage.critical" }),
    stab: "STAB",
    "type-effectiveness": intl.formatMessage({ id: "damage.conditions.effectiveness" }),
    final: intl.formatMessage({ id: "damage.conditions.final" }),
  }
  const phases = visibleFormulaPhases(branch.phases, props.row.criticalOnly)
  const criticalLabel = intl.formatMessage({ id: "damage.critical" })
  const effectivePower = mechanics.normal && mechanics.critical
    ? (
      <span className="inline-flex items-baseline gap-0.5">
        {mechanics.normal.effectivePower}
        <span className="inline-flex items-baseline gap-0.5 text-muted-foreground">
          <span aria-hidden>(</span>
          <CritCtMark label={criticalLabel} />
          {mechanics.critical.effectivePower}
          <span aria-hidden>)</span>
        </span>
      </span>
    )
    : branch.effectivePower

  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" aria-label={intl.formatMessage({ id: "damage.conditions.details" })} className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />}
      >
        <Info className="size-3 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent side="right" align="start" className="w-64 flex-col items-stretch gap-1.5 rounded-xl border-2 border-ink bg-paper p-3 shadow-hud-panel">
        <FormulaDetailRow label={intl.formatMessage({ id: "damage.conditions.basePower" })} value={mechanics.basePower} />
        {phases.map((phase) => (
          <FormulaDetailRow key={phase.kind} label={phaseLabels[phase.kind]} value={modifierLabel(phase.modifier)} />
        ))}
        <div className="mt-1 flex justify-between border-t pt-1.5 font-medium">
          <span>{intl.formatMessage({ id: "damage.conditions.effectivePower" })}{props.showAccuracy && ` / ${intl.formatMessage({ id: "damage.conditions.accuracy" })}`}</span>
          <span className="tabular-nums">{effectivePower}{props.showAccuracy && ` / ${accuracy}`}</span>
        </div>
        <p className="border-t pt-1.5 text-[10px] leading-4 text-muted-foreground">
          {intl.formatMessage({ id: "damage.conditions.effectivePowerHint" })}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

function FormulaDetailRow({ label, value }: { label: string; value: string | number }) {
  return <div className="flex items-start justify-between gap-4 text-xs"><span className="text-muted-foreground">{label}</span><span className="text-right tabular-nums">{value}</span></div>
}

function ScenarioIdentityLine({
  label,
  chips,
  expandable,
  expanded,
  onToggle,
  toggleLabel,
  children,
}: {
  label: string
  chips: StatValueChipModel[]
  expandable?: boolean
  expanded?: boolean
  onToggle?: () => void
  toggleLabel?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[10.5px]">
      <span className="w-[26px] shrink-0 text-[8.5px] text-muted-foreground">{label}</span>
      <StatValueChipPair
        chips={chips}
        compact
        expandable={expandable}
        expanded={expanded}
        onToggle={onToggle}
        toggleLabel={toggleLabel}
      />
      <span className="ml-auto flex shrink-0 items-center gap-1">{children}</span>
    </div>
  )
}

function activeStage(
  row: ScenarioResult,
  track: "attacker-stage" | "defender-stage",
): number {
  const id = (row.provenance[track]?.active ?? []).find((value) => value !== "none")
  return Number(id ?? 0)
}

function stageLabel(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}

function CaptionTypeMark({ type }: { type: DamageScenarioSummaryProps["row"]["moveType"] }) {
  const intl = useIntl()
  return (
    <span
      className="inline-flex h-3.5 shrink-0 items-center rounded-[4px] border border-ink px-0.5 text-[8px] font-extrabold leading-none"
      style={{
        backgroundColor: `var(--pokemon-type-${type})`,
        color: `var(--pokemon-type-${type}-foreground)`,
      }}
    >
      {intl.formatMessage({ id: `type.${type}` })}
    </span>
  )
}

function CaptionChip({ chip }: { chip: StatValueChipModel }) {
  return (
    <span
      className={cn(
        "inline-flex h-3.5 items-center px-0.5 text-[8px] font-extrabold leading-none tabular-nums",
        `stat-value-chip--${chip.band}`,
        chip.temporary && "border-dashed",
      )}
      style={{
        color: "var(--chip-fg)",
        background: "var(--chip-bg)",
        border: "1px solid var(--chip-fg)",
        borderRadius: 4,
      }}
    >
      {chip.label}
    </span>
  )
}

function CaptionChips({
  chips,
  expandable,
  expanded,
  onToggle,
  toggleLabel,
}: {
  chips: StatValueChipModel[]
  expandable?: boolean
  expanded?: boolean
  onToggle?: () => void
  toggleLabel?: string
}) {
  return (
    <span className="inline-flex min-w-0 flex-nowrap items-center gap-px">
      <span className="inline-flex min-w-0 flex-nowrap items-center gap-px overflow-hidden">
        {chips.map((chip, index) => (
          <span key={`${chip.label}:${chip.actual}:${index}`} className="inline-flex items-center gap-px">
            {index > 0 ? <span className="text-[8px] font-bold leading-none text-muted-foreground">~</span> : null}
            <CaptionChip chip={chip} />
          </span>
        ))}
      </span>
      {expandable && onToggle ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={toggleLabel}
          onClick={onToggle}
          className="hover:bg-token-bg focus-visible:ring-ring grid size-3.5 shrink-0 place-items-center rounded-[4px] focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronDown
            className={cn(
              "size-2.5 text-muted-foreground transition-transform",
              expanded && "rotate-180 text-ink",
            )}
            strokeWidth={2.5}
          />
        </button>
      ) : null}
    </span>
  )
}

function CaptionTokens({
  side,
  ...props
}: DamageScenarioSummaryProps & { side: "attack" | "defense" }) {
  const intl = useIntl()
  const tracks: ScenarioTrack[] = side === "attack"
    ? ["held-item", "attacker-ability", "weather", "terrain"]
    : ["defender-held-item", "defender-ability", "screen"]
  const values = tracks.flatMap((track) =>
    (props.row.provenance[track]?.active ?? [])
      .filter((id) =>
        id !== "none" &&
        id !== "0" &&
        !abilitySourceIsHidden(track, id) &&
        !((track === "held-item" || track === "defender-held-item") &&
          itemIsHiddenNeutral(id)),
      )
      .map((id) => ({ track, id })),
  )
  const shown = values.slice(0, 2)
  const extra = values.length - shown.length

  return (
    <>
      {shown.map(({ track, id }) => {
        if (track === "held-item" || track === "defender-held-item") {
          return (
            <span
              key={`${track}:${id}`}
              className="grid size-3.5 shrink-0 place-items-center"
              title={itemAriaLabel(id, intl.locale as SupportedLocale)}
            >
              <HeldItemSpriteIcon id={id} className="size-3.5" />
            </span>
          )
        }
        return (
          <span
            key={`${track}:${id}`}
            className="max-w-[2.4rem] truncate rounded-[4px] bg-token-bg px-0.5 text-[8px] font-extrabold leading-none text-ink"
            title={sourceLabel(track, id, props, intl)}
          >
            {sourceLabel(track, id, props, intl)}
          </span>
        )
      })}
      {extra > 0 ? (
        <span className="text-[8px] font-extrabold text-hud-muted">+{extra}</span>
      ) : null}
    </>
  )
}

/** Mobile identity line: type, move, attack/defense chips. Desktop keeps the full card. */
export function DamageRowCaption(props: DamageScenarioSummaryProps) {
  const intl = useIntl()
  const attackStage = activeStage(props.row, "attacker-stage")
  const defenseStage = activeStage(props.row, "defender-stage")
  return (
    <span className="flex min-h-3.5 min-w-0 flex-wrap items-center gap-x-0.5 gap-y-1 py-1 whitespace-nowrap sm:h-3.5 sm:min-h-0 sm:flex-nowrap sm:overflow-hidden sm:py-0">
      {props.showMoveInCaption !== false && (
        <span className="flex shrink-0 items-center gap-0.5">
          <CaptionTypeMark type={props.row.moveType} />
          <span className="max-w-[6.5rem] truncate text-[12px] font-extrabold leading-none">
            {props.move.label}
          </span>
          {attackStage !== 0 && (
            <span className="text-[9px] font-extrabold leading-none tabular-nums">
              {stageLabel(attackStage)}
            </span>
          )}
        </span>
      )}
      <span className="flex min-w-0 items-center gap-px overflow-hidden">
        <CaptionChips
          chips={props.attackerStat.chips}
          expandable={props.attackerStat.expandable}
          expanded={props.attackerStat.expanded}
          onToggle={props.attackerStat.onToggle}
          toggleLabel={intl.formatMessage({
            id: props.attackerStat.expanded ? "damage.row.collapseOffense" : "damage.row.expandOffense",
          })}
        />
        <CaptionTokens {...props} side="attack" />
      </span>
      <span className="shrink-0 text-[9px] leading-none text-hud-muted">/</span>
      <span className="flex min-w-0 items-center gap-px overflow-hidden">
        {defenseStage !== 0 && (
          <span className="text-[9px] font-extrabold leading-none tabular-nums">
            {stageLabel(defenseStage)}
          </span>
        )}
        <CaptionChips
          chips={props.defender.chips}
          expandable={props.defender.expandable}
          expanded={props.defender.expanded}
          onToggle={props.defender.onToggle}
          toggleLabel={intl.formatMessage({
            id: props.defender.expanded ? "damage.row.collapseDefense" : "damage.row.expandDefense",
          })}
        />
        <CaptionTokens {...props} side="defense" />
      </span>
    </span>
  )
}

export function ChildScenarioDiff({
  attackerStat,
  defender,
  diff,
}: {
  attackerStat: DamageScenarioSummaryProps["attackerStat"]
  defender: DamageScenarioSummaryProps["defender"]
  diff: { offense: boolean; defense: boolean }
}) {
  const intl = useIntl()
  return (
    <div className="flex min-w-0 items-stretch gap-2 md:w-[14.75rem]">
      <span className="w-1 shrink-0 rounded-full bg-ink/25" aria-hidden />
      <div className="min-w-0 space-y-0.5">
        {diff.offense && (
          <ScenarioIdentityLine
            label={intl.formatMessage({ id: "damage.row.attack" })}
            chips={attackerStat.chips}
          />
        )}
        {diff.defense && (
          <ScenarioIdentityLine
            label={intl.formatMessage({ id: "damage.row.defense" })}
            chips={defender.chips}
          />
        )}
      </div>
    </div>
  )
}

export function DamageScenarioSummary(props: DamageScenarioSummaryProps) {
  const intl = useIntl()
  const mechanics = props.row.moveMechanics
  const branch = mechanics.normal ?? mechanics.critical
  const accuracy = mechanics.hitFact === "always-hits"
    ? intl.formatMessage({ id: "damage.conditions.alwaysHits" })
    : new Intl.NumberFormat(intl.locale, { style: "percent", maximumFractionDigits: 0 }).format(mechanics.hitProbability)

  return (
    <article className="w-full rounded-[10px] border border-card-border bg-muted/60 md:w-[14.75rem]">
      <div className="flex items-center gap-1 border-b border-card-border px-2 py-1">
        <span className="flex min-w-0 items-center gap-1"><TypeBadge type={props.row.moveType} /><span className="truncate text-[12px] font-extrabold">{props.move.label}</span></span>
        <strong title={intl.formatMessage({ id: "damage.conditions.effectivePower" })} className="ml-auto text-[13px] font-extrabold leading-4 tabular-nums">{branch?.effectivePower}</strong>
        {props.showAccuracy && <><span aria-hidden className="text-[10.5px] text-muted-foreground">·</span><span title={intl.formatMessage({ id: "damage.conditions.accuracy" })} className="text-[10.5px] tabular-nums">{accuracy}</span></>}
        <DamageFormulaTooltip {...props} />
      </div>
      <div className="grid grid-cols-2 divide-x divide-hairline">
        <UnitPanel
          {...props}
          side="attack"
          label={intl.formatMessage({ id: "damage.row.attack" })}
          stage={activeStage(props.row, "attacker-stage")}
          stat={props.attackerStat}
        />
        <UnitPanel
          {...props}
          side="defense"
          label={intl.formatMessage({ id: "damage.row.defense" })}
          stage={activeStage(props.row, "defender-stage")}
          stat={props.defender}
        />
      </div>
      <ConditionsStrip {...props} />
    </article>
  )
}

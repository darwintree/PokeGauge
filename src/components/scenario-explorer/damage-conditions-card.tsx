import { Info } from "lucide-react"
import { useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { NEUTRAL_MODIFIER, type ScenarioTrack } from "@/lib/calc-adapter"
import type { CatalogAbilityOption, CatalogMoveOption } from "@/lib/catalog"
import {
  heldItemContributesBasePower,
  itemAriaLabel,
  itemIsHiddenNeutral,
  itemSprite,
} from "@/lib/held-item"
import type { SupportedLocale } from "@/lib/i18n"
import type { ScenarioResult } from "@/lib/scenario-pipeline"

type DamageConditionsCardProps = {
  move: CatalogMoveOption
  row: ScenarioResult
  attackerStat: { label: string; statValue?: string | null }
  defender: { label: string; statValue?: string | null }
  attackerAbilities: CatalogAbilityOption[]
  defenderAbilities: CatalogAbilityOption[]
  isRangeEnvelope: boolean
  showAccuracy: boolean
}

function modifierLabel(value: number): string {
  return `${Number((value / NEUTRAL_MODIFIER).toFixed(2))}×`
}

function sourceLabel(
  track: ScenarioTrack,
  id: string,
  props: DamageConditionsCardProps,
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

function ActiveTokens({
  side,
  ...props
}: DamageConditionsCardProps & { side: "attack" | "defense" }) {
  const intl = useIntl()
  const tracks: ScenarioTrack[] = side === "attack"
    ? ["attacker-stage", "held-item", "attacker-ability", "weather", "terrain"]
    : ["defender-stage", "defender-held-item", "defender-ability", "screen"]
  const values = tracks.flatMap((track) =>
    (props.row.provenance[track]?.effective ?? [])
      .filter((id) => id !== "none" && id !== "0")
      .map((id) => ({ track, id })),
  )

  return values.map(({ track, id }) => {
    const sprite = track === "held-item" || track === "defender-held-item"
      ? itemSprite(id)
      : undefined
    return sprite ? (
      <span
        key={`${track}:${id}`}
        className="grid size-[14px] place-items-center rounded-[4px] border border-ink bg-paper"
      >
        <img
          src={`/items/${sprite}`}
          alt={itemAriaLabel(id, intl.locale as SupportedLocale)}
          className="size-3 object-contain"
        />
      </span>
    ) : (
      <span key={`${track}:${id}`} className="rounded-[5px] bg-token-bg px-1 text-[9px] font-extrabold leading-4 text-ink">
        {sourceLabel(track, id, props, intl)}
      </span>
    )
  })
}

function OtherConditions(props: DamageConditionsCardProps) {
  const intl = useIntl()
  const entries = (Object.entries(props.row.provenance) as Array<[
    ScenarioTrack,
    ScenarioResult["provenance"][ScenarioTrack],
  ]>).flatMap(([track, sets]) =>
    (["inactive", "unsupported", "neutral"] as const).flatMap((state) =>
      (sets?.[state] ?? [])
        .filter((id) =>
          id !== "none" &&
          id !== "0" &&
          !((track === "held-item" || track === "defender-held-item") &&
            itemIsHiddenNeutral(id)),
        )
        .map((id) => ({ track, state, id })),
    ),
  )
  const count = entries.length + Number(props.isRangeEnvelope)

  if (count === 0) return null

  return (
    <details className="relative text-[10px] text-muted-foreground">
      <summary
        aria-label={intl.formatMessage({ id: "damage.conditions.other" }, { count })}
        className="cursor-pointer list-none rounded-[5px] border border-dashed border-hud-muted px-1 text-[9px] font-bold leading-4 text-hud-muted hover:border-ink hover:text-ink"
      >
        +{count}
      </summary>
      <div className="absolute top-full right-0 z-30 mt-1 w-40 space-y-1 rounded-xl border-2 border-ink bg-paper p-2 text-popover-foreground shadow-hud-panel">
        {props.isRangeEnvelope && <p>{intl.formatMessage({ id: "damage.rangeEnvelope" })}</p>}
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

function FormulaTip(props: DamageConditionsCardProps) {
  const intl = useIntl()
  const mechanics = props.row.moveMechanics
  const items = props.row.provenance["held-item"]?.effective.filter(
    heldItemContributesBasePower,
  ) ?? []
  const weather = props.row.provenance.weather?.effective.filter((id) => id !== "none") ?? []
  const terrain = props.row.provenance.terrain?.effective.filter((id) => id !== "none") ?? []
  const accuracy = mechanics.accuracy === "always-hits"
    ? intl.formatMessage({ id: "damage.conditions.alwaysHits" })
    : `${mechanics.accuracy}%`

  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" aria-label={intl.formatMessage({ id: "damage.conditions.details" })} className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />}
      >
        <Info className="size-3 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent side="right" align="start" className="w-64 flex-col items-stretch gap-1.5 rounded-xl border-2 border-ink bg-paper p-3 shadow-hud-panel">
        <TipRow label={intl.formatMessage({ id: "damage.conditions.basePower" })} value={mechanics.basePower} />
        <TipRow label="STAB" value={modifierLabel(mechanics.modifiers.stab)} />
        <TipRow label={intl.formatMessage({ id: "damage.conditions.effectiveness" })} value={modifierLabel(mechanics.modifiers.typeEffectiveness)} />
        {items.length > 0 && (
          <TipRow label={intl.formatMessage({ id: "track.item" })} value={`${items.map((id) => itemAriaLabel(id, intl.locale as SupportedLocale)).join(" / ")} · ${modifierLabel(mechanics.modifiers.item)}`} />
        )}
        <TipRow label={intl.formatMessage({ id: "track.weather" })} value={`${weather.length ? weather.map((id) => intl.formatMessage({ id: `track.weather.${id}` })).join(" / ") : intl.formatMessage({ id: "track.weather.none" })} · ${modifierLabel(mechanics.modifiers.weather)}`} />
        <TipRow label={intl.formatMessage({ id: "track.terrain" })} value={`${terrain.length ? terrain.map((id) => intl.formatMessage({ id: `track.terrain.${id}` })).join(" / ") : intl.formatMessage({ id: "track.terrain.none" })} · ${modifierLabel(mechanics.modifiers.terrain)}`} />
        <TipRow label={intl.formatMessage({ id: "damage.conditions.spread" })} value={modifierLabel(mechanics.modifiers.spread)} />
        <div className="mt-1 flex justify-between border-t pt-1.5 font-medium">
          <span>{intl.formatMessage({ id: "damage.conditions.effectivePower" })}{props.showAccuracy && ` / ${intl.formatMessage({ id: "damage.conditions.accuracy" })}`}</span>
          <span className="tabular-nums">{mechanics.effectivePower}{props.showAccuracy && ` / ${accuracy}`}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function TipRow({ label, value }: { label: string; value: string | number }) {
  return <div className="flex items-start justify-between gap-4 text-xs"><span className="text-muted-foreground">{label}</span><span className="text-right tabular-nums">{value}</span></div>
}

function IdentityLine({ label, value, statValue, children }: { label: string; value: string; statValue?: string | null; children?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[10.5px]">
      <span className="w-[26px] shrink-0 text-[8.5px] text-muted-foreground">{label}</span>
      <span className="truncate font-bold">{value}</span>
      {statValue && <span className="text-[9px] text-muted-foreground tabular-nums">{statValue}</span>}
      <span className="ml-auto flex shrink-0 items-center gap-1">{children}</span>
    </div>
  )
}

export function DamageConditionsCard(props: DamageConditionsCardProps) {
  const intl = useIntl()
  const accuracy = props.row.moveMechanics.accuracy === "always-hits"
    ? intl.formatMessage({ id: "damage.conditions.alwaysHits" })
    : `${props.row.moveMechanics.accuracy}%`

  return (
    <article className="relative w-full rounded-[10px] border border-card-border bg-muted/60 md:w-[14.75rem]">
      <div className="flex items-center gap-1 border-b border-card-border px-2 py-1">
        <span className="flex min-w-0 items-center gap-1"><TypeBadge type={props.move.type} /><span className="truncate text-[12px] font-extrabold">{props.move.label}</span></span>
        <strong title={intl.formatMessage({ id: "damage.conditions.effectivePower" })} className="ml-auto text-[13px] font-extrabold leading-4 tabular-nums">{props.row.moveMechanics.effectivePower}</strong>
        {props.showAccuracy && <><span aria-hidden className="text-[10.5px] text-muted-foreground">·</span><span title={intl.formatMessage({ id: "damage.conditions.accuracy" })} className="text-[10.5px] tabular-nums">{accuracy}</span></>}
        <FormulaTip {...props} />
      </div>
      <div className="space-y-0.5 px-2 py-1">
        <IdentityLine label={intl.formatMessage({ id: "damage.row.attack" })} value={props.attackerStat.label} statValue={props.attackerStat.statValue}><ActiveTokens {...props} side="attack" /></IdentityLine>
        <IdentityLine label={intl.formatMessage({ id: "damage.row.defense" })} value={props.defender.label} statValue={props.defender.statValue}><ActiveTokens {...props} side="defense" /><OtherConditions {...props} /></IdentityLine>
      </div>
    </article>
  )
}

import { useId, useState } from "react"
import { useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { StatRangeAxis } from "@/components/scenario-explorer/stat-range-axis"
import { Switch } from "@/components/ui/switch"
import type { StatAxisBounds, StatRange } from "@/lib/calc-adapter"
import type { MoveCategory } from "@/lib/catalog/types"
import {
  formatTemplateActual,
  resolveTemplateDisplay,
  STAT_NAME_STRATEGY_OPTIONS,
  type StatNameStrategy,
  type StatValueTemplate,
} from "@/lib/stat-value-template"
import type { StatTierTokenSet } from "@/lib/stat-tier-colors"

import {
  TrackOption,
  TrackOptionAdd,
  TrackOptionGroup,
  TrackOptionSummary,
  type TrackOptionAction,
  type TrackOptionModifier,
} from "./track-option"

type TemplatePresetProps = {
  templates: StatValueTemplate[]
  selectedIds: string[]
  species: string
  category: MoveCategory
  statNameStrategy: StatNameStrategy
  showActual: boolean
  allocationIndices: Record<string, number>
  onToggle: (id: string) => void
  onCycleAllocation: (id: string) => void
  onDelete?: (id: string) => void
  onPersist?: (id: string) => void
  adding?: boolean
  onAddClick?: () => void
  addAriaLabel?: string
}

type TemplateCardProps = {
  template: StatValueTemplate
  selected: boolean
  label: string
  actualText: string
  tooltip: string | null
  showActual: boolean
  allocationCount: number
  onToggle: () => void
  onCycleAllocation: () => void
  onDelete?: () => void
  onPersist?: () => void
  tier: StatTierTokenSet | null
}

function templateModifier(
  template: StatValueTemplate,
  tier: StatTierTokenSet | null,
): TrackOptionModifier | undefined {
  if (tier) return { kind: "tier", tier }
  if (template.kind === "temporary") return { kind: "temporary" }
  return undefined
}

function templateActions({
  template,
  allocationCount,
  onDelete,
  onPersist,
  onCycleAllocation,
  labels,
}: Pick<
  TemplateCardProps,
  "template" | "allocationCount" | "onDelete" | "onPersist" | "onCycleAllocation"
> & {
  labels: { delete: string; persist: string; cycleAllocation: string }
}): TrackOptionAction[] {
  const actions: TrackOptionAction[] = []

  if (template.kind === "user" && onDelete) {
    actions.push({
      kind: "remove",
      label: labels.delete,
      position: "top-right",
      onClick: onDelete,
    })
  }

  if (template.kind === "temporary" && onPersist) {
    actions.push({
      kind: "persist",
      label: labels.persist,
      position: "top-right",
      alwaysVisible: true,
      onClick: onPersist,
    })
  }

  if (allocationCount > 1) {
    actions.push({
      kind: "cycleAllocation",
      label: labels.cycleAllocation,
      position: "bottom-right",
      alwaysVisible: true,
      onClick: onCycleAllocation,
    })
  }

  return actions
}

function TemplateCard({
  template,
  selected,
  label,
  actualText,
  tooltip,
  showActual,
  allocationCount,
  onToggle,
  onCycleAllocation,
  onDelete,
  onPersist,
  tier,
}: TemplateCardProps) {
  const intl = useIntl()
  return (
    <TrackOption
      layout="text"
      pressed={selected}
      ariaLabel={showActual ? `${label} ${actualText} 模版` : `${label} 模版`}
      modifier={templateModifier(template, tier)}
      tooltip={tooltip}
      actions={templateActions({
        template,
        allocationCount,
        onDelete,
        onPersist,
        onCycleAllocation,
        labels: {
          delete: intl.formatMessage({ id: "template.delete" }),
          persist: intl.formatMessage({ id: "template.persist" }),
          cycleAllocation: intl.formatMessage({ id: "template.cycleAllocation" }),
        },
      })}
      onToggle={onToggle}
    >
      {label}
      {showActual && <TrackOptionSummary>{actualText}</TrackOptionSummary>}
    </TrackOption>
  )
}

export function StatValueTemplatePreset({
  templates,
  selectedIds,
  species,
  category,
  statNameStrategy,
  showActual,
  allocationIndices,
  onToggle,
  onCycleAllocation,
  onDelete,
  onPersist,
  adding = false,
  onAddClick,
  addAriaLabel,
}: TemplatePresetProps) {
  const intl = useIntl()
  return (
    <TrackOptionGroup className="w-full overflow-visible">
      {templates.map((template) => {
        const selected = selectedIds.includes(template.id)
        const allocIndex = allocationIndices[template.id] ?? 0
        const display = resolveTemplateDisplay(
          template,
          species,
          category,
          allocIndex,
          statNameStrategy,
        )
        const actualText = formatTemplateActual(template)

        return (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selected}
            label={display.primary}
            actualText={actualText}
            tooltip={display.tooltip}
            showActual={showActual}
            allocationCount={display.allocations.length}
            onToggle={() => onToggle(template.id)}
            onCycleAllocation={() => onCycleAllocation(template.id)}
            onDelete={onDelete ? () => onDelete(template.id) : undefined}
            onPersist={onPersist ? () => onPersist(template.id) : undefined}
            tier={template.systemTier ?? null}
          />
        )
      })}
      {onAddClick && (
        <TrackOptionAdd
          layout="text"
          ariaLabel={addAriaLabel ?? intl.formatMessage({ id: "template.add" })}
          pressed={adding}
          onClick={onAddClick}
        />
      )}
    </TrackOptionGroup>
  )
}

export function ShowActualValuesSwitch({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}) {
  const id = useId()
  const intl = useIntl()
  return (
    <div className="flex items-center gap-2">
      <Switch
        id={id}
        size="sm"
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="border-2 border-ink data-checked:bg-signal-yellow data-unchecked:bg-paper [&_[data-slot=switch-thumb]]:size-2.5 [&_[data-slot=switch-thumb]]:bg-ink"
      />
      <Label htmlFor={id} className="cursor-pointer text-[10.5px] font-bold">
        {label ?? intl.formatMessage({ id: "stat.showActual" })}
      </Label>
    </div>
  )
}

export function StatNameStrategySelect({
  value,
  onChange,
}: {
  value: StatNameStrategy
  onChange: (value: StatNameStrategy) => void
}) {
  const id = useId()
  const intl = useIntl()
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={id} className="text-muted-foreground text-[11px] font-normal">
        {intl.formatMessage({ id: "stat.display" })}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as StatNameStrategy)}
        className="border-input bg-background h-7 max-w-[9.5rem] flex-1 rounded-md border px-2 text-[11px]"
      >
        {STAT_NAME_STRATEGY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {intl.formatMessage({ id: `stat.strategy.${option}` })}
          </option>
        ))}
      </select>
    </div>
  )
}

type AddOffenseTemplateProps = {
  statLabel: string
  bounds: StatAxisBounds
  onConfirm: (stat: number) => void
  onCancel: () => void
}

function ConfirmCancelActions({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  const intl = useIntl()
  return (
    <div className="flex justify-end gap-1.5">
      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={onCancel}>
        {intl.formatMessage({ id: "template.cancel" })}
      </Button>
      <Button type="button" size="sm" className="h-7 text-xs" onClick={onConfirm}>
        {intl.formatMessage({ id: "template.confirm" })}
      </Button>
    </div>
  )
}

function defaultAxisPoint(bounds: StatAxisBounds): number {
  return bounds.snapPoints[1]?.value ?? Math.round((bounds.min + bounds.max) / 2)
}

export function AddOffenseTemplatePanel({
  statLabel,
  bounds,
  onConfirm,
  onCancel,
}: AddOffenseTemplateProps) {
  const [range, setRange] = useStateRange(defaultAxisPoint(bounds))
  const intl = useIntl()

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-2">
      <Label className="text-muted-foreground text-[11px]">
        {intl.formatMessage({ id: "template.add" })} {statLabel}
      </Label>
      <StatRangeAxis
        statLabel={statLabel}
        bounds={bounds}
        value={range}
        onChange={setRange}
        mode="single"
      />
      <ConfirmCancelActions onCancel={onCancel} onConfirm={() => onConfirm(range.min)} />
    </div>
  )
}

type AddDefenseTemplateProps = {
  hpBounds: StatAxisBounds
  defBounds: StatAxisBounds
  defStatLabel: string
  onConfirm: (hp: number, def: number) => void
  onCancel: () => void
}

export function AddDefenseTemplatePanel({
  hpBounds,
  defBounds,
  defStatLabel,
  onConfirm,
  onCancel,
}: AddDefenseTemplateProps) {
  const [hpRange, setHpRange] = useStateRange(defaultAxisPoint(hpBounds))
  const [defRange, setDefRange] = useStateRange(defaultAxisPoint(defBounds))
  const intl = useIntl()

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-2">
      <Label className="text-muted-foreground text-[11px]">
        {intl.formatMessage({ id: "template.addDefender" })}
      </Label>
      <StatRangeAxis
        statLabel="HP"
        bounds={hpBounds}
        value={hpRange}
        onChange={setHpRange}
        mode="single"
      />
      <StatRangeAxis
        statLabel={defStatLabel}
        bounds={defBounds}
        value={defRange}
        onChange={setDefRange}
        mode="single"
      />
      <ConfirmCancelActions
        onCancel={onCancel}
        onConfirm={() => onConfirm(hpRange.min, defRange.min)}
      />
    </div>
  )
}

function useStateRange(initial: number): [StatRange, (r: StatRange) => void] {
  const [range, setRange] = useState<StatRange>({ min: initial, max: initial })
  return [range, setRange]
}

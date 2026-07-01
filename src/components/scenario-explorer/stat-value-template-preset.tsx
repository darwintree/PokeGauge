import { useId, useState } from "react"

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
}: Pick<
  TemplateCardProps,
  "template" | "allocationCount" | "onDelete" | "onPersist" | "onCycleAllocation"
>): TrackOptionAction[] {
  const actions: TrackOptionAction[] = []

  if (template.kind === "user" && onDelete) {
    actions.push({
      kind: "remove",
      label: "删除模版",
      position: "top-right",
      onClick: onDelete,
    })
  }

  if (template.kind === "temporary" && onPersist) {
    actions.push({
      kind: "persist",
      label: "持久化模版",
      position: "top-right",
      alwaysVisible: true,
      onClick: onPersist,
    })
  }

  if (allocationCount > 1) {
    actions.push({
      kind: "cycleAllocation",
      label: "切换能力点数分配",
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
  addAriaLabel = "添加模版",
}: TemplatePresetProps) {
  return (
    <TrackOptionGroup className="w-72 overflow-visible">
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
          ariaLabel={addAriaLabel}
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
  label = "显示实数值",
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} size="sm" checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="cursor-pointer text-[11px] font-normal">
        {label}
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
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={id} className="text-muted-foreground text-[11px] font-normal">
        Stat 名展示
      </Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as StatNameStrategy)}
        className="border-input bg-background h-7 max-w-[9.5rem] flex-1 rounded-md border px-2 text-[11px]"
      >
        {STAT_NAME_STRATEGY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
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
  return (
    <div className="flex justify-end gap-1.5">
      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={onCancel}>
        取消
      </Button>
      <Button type="button" size="sm" className="h-7 text-xs" onClick={onConfirm}>
        确认
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

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-2">
      <Label className="text-muted-foreground text-[11px]">添加 {statLabel} 模版</Label>
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

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-2">
      <Label className="text-muted-foreground text-[11px]">添加防守模版</Label>
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

import { useId, useState, type ReactNode } from "react"
import { RefreshCw, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { StatRangeAxis } from "@/components/scenario-explorer/stat-range-axis"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import type { StatAxisBounds, StatRange } from "@/lib/calc-adapter"
import type { MoveCategory } from "@/lib/catalog/types"
import {
  enumerateDefenseAllocations,
  enumerateOffenseAllocations,
  formatDefenseActual,
  formatOffenseActual,
  templateCardLabel,
  type StatValueTemplate,
} from "@/lib/stat-value-template"
import {
  statTierChipClasses,
  STAT_TIER_CHIP_MUTED_CLASS,
  type StatTierTokenSet,
} from "@/lib/stat-tier-colors"
import { cn } from "@/lib/utils"

type TemplatePresetProps = {
  templates: StatValueTemplate[]
  selectedIds: string[]
  species: string
  category: MoveCategory
  showActual: boolean
  allocationIndices: Record<string, number>
  onToggle: (id: string) => void
  onCycleAllocation: (id: string) => void
  onDelete?: (id: string) => void
  onPersist?: (id: string) => void
}

type TemplateCardProps = {
  template: StatValueTemplate
  selected: boolean
  label: string
  showActual: boolean
  actualText: string
  allocationCount: number
  onToggle: () => void
  onCycleAllocation: () => void
  onDelete?: () => void
  onPersist?: () => void
  tier: StatTierTokenSet | null
}

type Corner = "top-right" | "bottom-right"

const TOGGLE_CHIP =
  "h-auto min-h-7 cursor-pointer px-2.5 py-1 text-xs font-medium tabular-nums"

const TEMPLATE_CHIP_GROUP =
  "group/template relative z-0 inline-flex overflow-visible pt-1 pr-1 hover:z-20 focus-within:z-20"

const CORNER_BADGE =
  "pointer-events-none absolute z-10 flex size-4 items-center justify-center rounded-full border bg-background opacity-0 shadow-sm transition-opacity group-hover/template:pointer-events-auto group-hover/template:opacity-100 group-focus-within/template:pointer-events-auto group-focus-within/template:opacity-100"

const CORNER_POSITION: Record<Corner, string> = {
  "top-right": "-top-1.5 -right-1.5",
  "bottom-right": "-bottom-1.5 -right-1.5",
}

function templateToggleClass(
  template: StatValueTemplate,
  selected: boolean,
  tier: StatTierTokenSet | null,
): string {
  if (selected && tier) {
    return cn(TOGGLE_CHIP, "shadow-none", statTierChipClasses(tier))
  }

  if (template.kind === "temporary") {
    return cn(
      TOGGLE_CHIP,
      "border-dashed",
      selected
        ? "border-primary bg-primary/10 text-foreground"
        : "border-muted-foreground/50 bg-background text-foreground hover:bg-muted/50",
    )
  }

  if (template.kind === "user") {
    return cn(
      TOGGLE_CHIP,
      selected
        ? "border-foreground/40 bg-muted text-foreground shadow-sm"
        : "border-input bg-background text-foreground hover:bg-muted/50",
    )
  }

  return cn(
    TOGGLE_CHIP,
    selected
      ? "bg-background text-foreground shadow-sm"
      : "border-input bg-background text-foreground hover:bg-muted/50",
    tier && !selected && "text-muted-foreground",
  )
}

function CornerBadge({
  corner,
  ariaLabel,
  className,
  onClick,
  children,
}: {
  corner: Corner
  ariaLabel: string
  className?: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-xs"
      aria-label={ariaLabel}
      className={cn(CORNER_BADGE, CORNER_POSITION[corner], className)}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function TemplateCard({
  template,
  selected,
  label,
  showActual,
  actualText,
  allocationCount,
  onToggle,
  onCycleAllocation,
  onDelete,
  onPersist,
  tier,
}: TemplateCardProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className={TEMPLATE_CHIP_GROUP}>
        <Toggle
          pressed={selected}
          onPressedChange={onToggle}
          variant="outline"
          size="sm"
          aria-label={`${label} 模版`}
          className={templateToggleClass(template, selected, tier)}
        >
          {label}
        </Toggle>

        {template.kind === "user" && onDelete && (
          <CornerBadge
            corner="top-right"
            ariaLabel="删除模版"
            className="hover:border-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-2.5" />
          </CornerBadge>
        )}

        {template.kind === "temporary" && onPersist && (
          <CornerBadge corner="top-right" ariaLabel="持久化模版" onClick={onPersist}>
            <Save className="size-2.5" />
          </CornerBadge>
        )}

        {allocationCount > 1 && (
          <CornerBadge corner="bottom-right" ariaLabel="切换能力点数分配" onClick={onCycleAllocation}>
            <RefreshCw className="size-2.5" />
          </CornerBadge>
        )}
      </div>

      {showActual && (
        <span className={cn("pl-0.5 text-[10px] tabular-nums", STAT_TIER_CHIP_MUTED_CLASS)}>
          {actualText}
        </span>
      )}
    </div>
  )
}

export function StatValueTemplatePreset({
  templates,
  selectedIds,
  species,
  category,
  showActual,
  allocationIndices,
  onToggle,
  onCycleAllocation,
  onDelete,
  onPersist,
}: TemplatePresetProps) {
  return (
    <div className="flex w-72 flex-wrap gap-2 overflow-visible">
      {templates.map((template) => {
        const selected = selectedIds.includes(template.id)
        const allocIndex = allocationIndices[template.id] ?? 0
        const values = template.values
        const allocations =
          values.kind === "offense"
            ? enumerateOffenseAllocations(species, category, values.stat)
            : enumerateDefenseAllocations(species, category, values)
        const label = templateCardLabel(template, species, category, allocIndex)
        const actualText =
          values.kind === "offense"
            ? formatOffenseActual(values.stat)
            : formatDefenseActual(values.hp, values.def)

        return (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selected}
            label={label}
            showActual={showActual}
            actualText={actualText}
            allocationCount={allocations.length}
            onToggle={() => onToggle(template.id)}
            onCycleAllocation={() => onCycleAllocation(template.id)}
            onDelete={onDelete ? () => onDelete(template.id) : undefined}
            onPersist={onPersist ? () => onPersist(template.id) : undefined}
            tier={template.systemTier ?? null}
          />
        )
      })}
    </div>
  )
}

export function ShowActualValuesSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} size="sm" checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="cursor-pointer text-[11px] font-normal">
        显示实数值
      </Label>
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

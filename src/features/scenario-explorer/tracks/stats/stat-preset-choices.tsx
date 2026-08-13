import { useState } from "react"
import { CircleAlert } from "lucide-react"
import { useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { StatRangeInput } from "./stat-range-input"
import type { StatAxisBounds, StatRange } from "@/lib/stat-calculation"
import type { MoveCategory } from "@/lib/catalog"
import {
  resolvePresetChip,
  resolveStatPresetDisplay,
  type StatNameStrategy,
  type StatPreset,
  type StatValueChipModel,
} from "@/lib/stat-preset"

import {
  TrackOption,
  TrackOptionAdd,
  TrackOptionGroup,
  TrackOptionSummary,
  type TrackOptionAction,
  type TrackOptionModifier,
} from "../common/track-option"
import { StatValueChipTooltipBody } from "./stat-value-chip"

type StatPresetChoicesProps = {
  presets: StatPreset[]
  selectedIds: string[]
  calcName: string
  category: MoveCategory
  statNameStrategy: StatNameStrategy
  showStatValue: boolean
  allocationIndices: Record<string, number>
  onToggle: (id: string) => void
  onCycleAllocation: (id: string) => void
  onDelete?: (id: string) => void
  onPersist?: (id: string) => void
  adding?: boolean
  onAddClick?: () => void
  addAriaLabel?: string
}

type StatPresetChoiceProps = {
  preset: StatPreset
  selected: boolean
  chip: StatValueChipModel
  showStatValue: boolean
  allocationCount: number
  onToggle: () => void
  onCycleAllocation: () => void
  onDelete?: () => void
  onPersist?: () => void
}

function statPresetModifier(chip: StatValueChipModel): TrackOptionModifier {
  return { kind: "invest", band: chip.band }
}

function temporaryClass(preset: StatPreset): string | undefined {
  return preset.kind === "temporary" ? "track-option-mod-temporary" : undefined
}

function statPresetActions({
  preset,
  allocationCount,
  onDelete,
  onPersist,
  onCycleAllocation,
  labels,
}: Pick<
  StatPresetChoiceProps,
  "preset" | "allocationCount" | "onDelete" | "onPersist" | "onCycleAllocation"
> & {
  labels: { delete: string; persist: string; cycleAllocation: string }
}): TrackOptionAction[] {
  const actions: TrackOptionAction[] = []

  if (preset.kind === "user" && onDelete) {
    actions.push({
      kind: "remove",
      label: labels.delete,
      position: "top-right",
      onClick: onDelete,
    })
  }

  if (preset.kind === "temporary" && onPersist) {
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

function StatPresetChoice({
  preset,
  selected,
  chip,
  showStatValue,
  allocationCount,
  onToggle,
  onCycleAllocation,
  onDelete,
  onPersist,
}: StatPresetChoiceProps) {
  const intl = useIntl()
  const hasNoSpAllocation = allocationCount === 0
  const noSpAllocationMessage = intl.formatMessage({ id: "statPreset.noSpAllocation" })
  let ariaLabel = `${chip.label} ${intl.formatMessage({ id: "statPreset.label" })}`
  if (hasNoSpAllocation) {
    ariaLabel = `${chip.label} ${noSpAllocationMessage}`
  } else if (showStatValue) {
    ariaLabel = `${chip.label} ${chip.actual} ${intl.formatMessage({ id: "statPreset.label" })}`
  }

  return (
    <TrackOption
      layout="text"
      pressed={selected}
      ariaLabel={ariaLabel}
      modifier={statPresetModifier(chip)}
      className={temporaryClass(preset)}
      tooltip={<StatValueChipTooltipBody chip={chip} />}
      actions={statPresetActions({
        preset,
        allocationCount,
        onDelete,
        onPersist,
        onCycleAllocation,
        labels: {
          delete: intl.formatMessage({ id: "statPreset.delete" }),
          persist: intl.formatMessage({ id: "statPreset.persist" }),
          cycleAllocation: intl.formatMessage({ id: "statPreset.cycleAllocation" }),
        },
      })}
      onToggle={onToggle}
    >
      <span className="inline-flex items-center gap-1">
        {chip.label}
        {hasNoSpAllocation ? (
          <CircleAlert aria-hidden="true" className="text-hud-muted size-3" />
        ) : null}
      </span>
      {showStatValue && !hasNoSpAllocation ? (
        <TrackOptionSummary>{chip.actual}</TrackOptionSummary>
      ) : null}
    </TrackOption>
  )
}

export function StatPresetChoices({
  presets,
  selectedIds,
  calcName,
  category,
  statNameStrategy,
  showStatValue,
  allocationIndices,
  onToggle,
  onCycleAllocation,
  onDelete,
  onPersist,
  adding = false,
  onAddClick,
  addAriaLabel,
}: StatPresetChoicesProps) {
  const intl = useIntl()
  return (
    <TrackOptionGroup className="w-full overflow-visible">
      {presets.map((preset) => {
        const selected = selectedIds.includes(preset.id)
        const allocIndex = allocationIndices[preset.id] ?? 0
        const chip = resolvePresetChip(
          preset,
          calcName,
          category,
          allocIndex,
          statNameStrategy,
        )
        const display = resolveStatPresetDisplay(
          preset,
          calcName,
          category,
          allocIndex,
          statNameStrategy,
        )

        return (
          <StatPresetChoice
            key={preset.id}
            preset={preset}
            selected={selected}
            chip={chip}
            showStatValue={showStatValue}
            allocationCount={display.allocations.length}
            onToggle={() => onToggle(preset.id)}
            onCycleAllocation={() => onCycleAllocation(preset.id)}
            onDelete={onDelete ? () => onDelete(preset.id) : undefined}
            onPersist={onPersist ? () => onPersist(preset.id) : undefined}
          />
        )
      })}
      {onAddClick && (
        <TrackOptionAdd
          layout="text"
          ariaLabel={addAriaLabel ?? intl.formatMessage({ id: "statPreset.add" })}
          pressed={adding}
          onClick={onAddClick}
        />
      )}
    </TrackOptionGroup>
  )
}

type AddOffensePresetProps = {
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
        {intl.formatMessage({ id: "action.cancel" })}
      </Button>
      <Button type="button" size="sm" className="h-7 text-xs" onClick={onConfirm}>
        {intl.formatMessage({ id: "action.confirm" })}
      </Button>
    </div>
  )
}

function defaultAxisPoint(bounds: StatAxisBounds): number {
  return bounds.snapPoints[1]?.value ?? Math.round((bounds.min + bounds.max) / 2)
}

export function AddOffensePresetPanel({
  statLabel,
  bounds,
  onConfirm,
  onCancel,
}: AddOffensePresetProps) {
  const [range, setRange] = useStateRange(defaultAxisPoint(bounds))
  const intl = useIntl()

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-2">
      <Label className="text-muted-foreground text-[11px]">
        {intl.formatMessage({ id: "statPreset.add" })} {statLabel}
      </Label>
      <StatRangeInput
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

type AddDefensePresetProps = {
  hpBounds: StatAxisBounds
  defBounds: StatAxisBounds
  defStatLabel: string
  onConfirm: (hp: number, def: number) => void
  onCancel: () => void
}

export function AddDefensePresetPanel({
  hpBounds,
  defBounds,
  defStatLabel,
  onConfirm,
  onCancel,
}: AddDefensePresetProps) {
  const [hpRange, setHpRange] = useStateRange(defaultAxisPoint(hpBounds))
  const [defRange, setDefRange] = useStateRange(defaultAxisPoint(defBounds))
  const intl = useIntl()

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-2">
      <Label className="text-muted-foreground text-[11px]">
        {intl.formatMessage({ id: "statPreset.addDefender" })}
      </Label>
      <StatRangeInput
        statLabel="HP"
        bounds={hpBounds}
        value={hpRange}
        onChange={setHpRange}
        mode="single"
      />
      <StatRangeInput
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

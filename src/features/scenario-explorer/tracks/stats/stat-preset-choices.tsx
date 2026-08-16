import { CircleAlert } from "lucide-react"
import { useIntl } from "react-intl"

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

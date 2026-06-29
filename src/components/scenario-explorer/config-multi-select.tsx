import { TypeBadge } from "@/components/pokemon/type-badge"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { CatalogMoveOption, CatalogOption } from "@/lib/catalog/types"
import {
  statTierChipClasses,
  STAT_TIER_CHIP_MUTED_CLASS,
  type StatTierTokenSet,
} from "@/lib/stat-tier-colors"
import { cn } from "@/lib/utils"

const TRACK_TOGGLE_CLASS =
  "flex w-full flex-wrap rounded-lg border bg-muted/30 p-1"

function orderedSelection<T extends { id: string }>(
  options: T[],
  ids: string[],
): string[] {
  return orderedPoolSelection(
    options.map((option) => option.id),
    ids,
  )
}

export function orderedPoolSelection(
  pool: readonly string[],
  selected: readonly string[],
): string[] {
  const selectedSet = new Set(selected)
  return pool.filter((id) => selectedSet.has(id))
}

type ConfigMultiSelectProps = {
  label: string
  options: CatalogOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  tierForOption?: (option: CatalogOption) => StatTierTokenSet | null
}

export function ConfigMultiSelect({
  label,
  options,
  selectedIds,
  onChange,
  tierForOption,
}: ConfigMultiSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <ToggleGroup
        multiple
        variant="outline"
        size="sm"
        spacing={0}
        value={selectedIds}
        onValueChange={(ids) => onChange(orderedSelection(options, ids))}
        className={TRACK_TOGGLE_CLASS}
      >
        {options.map((option) => {
          const tier = tierForOption?.(option) ?? null
          const selected = selectedIds.includes(option.id)
          const tierChip = selected && tier ? statTierChipClasses(tier) : null

          return (
            <ToggleGroupItem
              key={option.id}
              value={option.id}
              className={cn(
                "h-auto min-h-7 flex-1 basis-auto px-3 py-1.5 text-left",
                tierChip ?? "data-[state=on]:bg-background data-[state=on]:shadow-sm",
              )}
            >
              {option.label}
              <span
                className={cn(
                  "ml-1.5 text-xs",
                  tierChip ? STAT_TIER_CHIP_MUTED_CLASS : "text-muted-foreground",
                )}
              >
                {option.summary}
              </span>
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </div>
  )
}

type MoveMultiSelectProps = {
  label: string
  options: CatalogMoveOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function MoveMultiSelect({
  label,
  options,
  selectedIds,
  onChange,
}: MoveMultiSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <ToggleGroup
        multiple
        variant="outline"
        size="sm"
        spacing={0}
        value={selectedIds}
        onValueChange={(ids) => onChange(orderedSelection(options, ids))}
        className={TRACK_TOGGLE_CLASS}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.id}
            value={option.id}
            className="h-auto min-h-7 flex-1 basis-auto gap-1.5 px-2 py-1.5 text-left data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            <TypeBadge type={option.type} />
            <span>{option.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

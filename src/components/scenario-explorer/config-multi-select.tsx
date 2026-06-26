import { TypeBadge } from "@/components/pokemon/type-badge"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { CatalogMoveOption, CatalogOption } from "@/lib/catalog/types"

const TRACK_TOGGLE_CLASS =
  "flex w-full flex-wrap rounded-lg border bg-muted/30 p-1"

function orderedSelection<T extends { id: string }>(
  options: T[],
  ids: string[],
): string[] {
  const selected = new Set(ids)
  return options.filter((option) => selected.has(option.id)).map((option) => option.id)
}

type ConfigMultiSelectProps = {
  label: string
  options: CatalogOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function ConfigMultiSelect({
  label,
  options,
  selectedIds,
  onChange,
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
        {options.map((option) => (
          <ToggleGroupItem
            key={option.id}
            value={option.id}
            className="h-auto min-h-7 flex-1 basis-auto px-3 py-1.5 text-left data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            {option.label}
            <span className="text-muted-foreground ml-1.5 text-xs">{option.summary}</span>
          </ToggleGroupItem>
        ))}
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

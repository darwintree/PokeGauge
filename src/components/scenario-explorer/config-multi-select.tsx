import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { CatalogOption } from "@/lib/catalog/types"

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
        onValueChange={(ids) => {
          const selected = new Set(ids)
          onChange(options.filter((option) => selected.has(option.id)).map((option) => option.id))
        }}
        className="flex w-full flex-wrap rounded-lg border bg-muted/30 p-1"
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

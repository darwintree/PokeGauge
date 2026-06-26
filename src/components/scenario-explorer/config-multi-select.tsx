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
  const toggle = (id: string) => {
    const selected = new Set(selectedIds)
    if (selected.has(id)) {
      selected.delete(id)
    } else {
      selected.add(id)
    }
    onChange(options.filter((o) => selected.has(o.id)).map((o) => o.id))
  }

  return (
    <div className="space-y-1.5">
      <div className="text-muted-foreground text-xs font-medium">{label}</div>
      <div className="flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
        {options.map((option) => {
          const selected = selectedIds.includes(option.id)
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option.id)}
              className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                selected
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
              <span className="text-muted-foreground ml-1.5 text-xs">
                {option.summary}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

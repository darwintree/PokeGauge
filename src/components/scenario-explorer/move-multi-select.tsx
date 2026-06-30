import { TypeBadge } from "@/components/pokemon/type-badge"
import { Label } from "@/components/ui/label"
import type { CatalogMoveOption } from "@/lib/catalog/types"
import { orderedPoolSelection } from "@/lib/ordered-pool-selection"

import {
  TrackOption,
  TrackOptionGroup,
} from "./track-option"

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
      <TrackOptionGroup aria-label={label}>
        {options.map((option) => (
          <TrackOption
            key={option.id}
            layout="text"
            pressed={selectedIds.includes(option.id)}
            ariaLabel={option.label}
            onToggle={() => {
              const next = selectedIds.includes(option.id)
                ? selectedIds.filter((id) => id !== option.id)
                : [...selectedIds, option.id]
              onChange(orderedPoolSelection(options.map((o) => o.id), next))
            }}
          >
            <TypeBadge type={option.type} />
            <span>{option.label}</span>
          </TrackOption>
        ))}
      </TrackOptionGroup>
    </div>
  )
}
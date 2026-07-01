import { useState } from "react"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Label } from "@/components/ui/label"
import type { CatalogMoveOption } from "@/lib/catalog/types"
import { orderedPoolSelection } from "@/lib/ordered-pool-selection"

import {
  TrackOption,
  TrackOptionAdd,
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
  const [pickerOpen, setPickerOpen] = useState(false)
  const selectedOptions = options.filter((o) => selectedIds.includes(o.id))
  const addableOptions = options.filter((o) => !selectedIds.includes(o.id))

  function remove(id: string) {
    onChange(orderedPoolSelection(options.map((o) => o.id), selectedIds.filter((x) => x !== id)))
    setPickerOpen(false)
  }

  function add(id: string) {
    onChange(orderedPoolSelection(options.map((o) => o.id), [...selectedIds, id]))
    setPickerOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <TrackOptionGroup aria-label={label}>
        {selectedOptions.map((option) => (
          <TrackOption
            key={option.id}
            layout="text"
            pressed
            ariaLabel={option.label}
            onToggle={() => remove(option.id)}
          >
            <TypeBadge type={option.type} />
            <span>{option.label}</span>
          </TrackOption>
        ))}
        <TrackOptionAdd
          layout="text"
          ariaLabel="添加招式"
          pressed={pickerOpen}
          onClick={() => {
            if (addableOptions.length === 0) return
            setPickerOpen((open) => !open)
          }}
        />
      </TrackOptionGroup>
      {pickerOpen && addableOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 rounded-md border bg-muted/20 p-2">
          {addableOptions.map((option) => (
            <TrackOption
              key={option.id}
              layout="text"
              pressed={false}
              ariaLabel={option.label}
              onToggle={() => add(option.id)}
            >
              <TypeBadge type={option.type} />
              <span>{option.label}</span>
            </TrackOption>
          ))}
        </div>
      )}
    </div>
  )
}

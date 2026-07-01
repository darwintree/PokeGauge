import { useState } from "react"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Label } from "@/components/ui/label"
import type { CatalogMoveOption } from "@/lib/catalog/types"

import {
  TrackOption,
  TrackOptionAdd,
  TrackOptionGroup,
} from "./track-option"

type MoveMultiSelectProps = {
  label: string
  options: CatalogMoveOption[]
  visibleIds: string[]
  selectedIds: string[]
  onAdd: (id: string) => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function MoveMultiSelect({
  label,
  options,
  visibleIds,
  selectedIds,
  onAdd,
  onToggle,
  onRemove,
}: MoveMultiSelectProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const visibleOptions = options.filter((o) => visibleIds.includes(o.id))
  const addableOptions = options.filter((o) => !visibleIds.includes(o.id))

  function add(id: string) {
    onAdd(id)
    setPickerOpen(false)
  }

  function remove(id: string) {
    onRemove(id)
    setPickerOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <TrackOptionGroup aria-label={label}>
        {visibleOptions.map((option) => (
          <TrackOption
            key={option.id}
            layout="text"
            pressed={selectedIds.includes(option.id)}
            ariaLabel={option.label}
            onToggle={() => onToggle(option.id)}
            actions={[
              {
                kind: "remove",
                label: `移除${option.label}`,
                position: "top-right",
                onClick: () => remove(option.id),
              },
            ]}
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

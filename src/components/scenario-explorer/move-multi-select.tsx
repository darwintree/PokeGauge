import { useState } from "react"
import { useIntl } from "react-intl"

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
  visibleIds: number[]
  selectedIds: number[]
  onAdd: (id: number) => void
  onToggle: (id: number) => void
  onRemove: (id: number) => void
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
  const intl = useIntl()
  const [pickerOpen, setPickerOpen] = useState(false)
  const visibleOptions = options.filter((o) => visibleIds.includes(o.id))
  const addableOptions = options.filter((o) => !visibleIds.includes(o.id))

  function add(id: number) {
    onAdd(id)
    setPickerOpen(false)
  }

  function remove(id: number) {
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
          ariaLabel={intl.formatMessage({ id: "track.addMove" })}
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

import { useMemo } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import type { SpeciesOption } from "@/lib/catalog/types"

type SpeciesSelectProps = {
  label: string
  options: SpeciesOption[]
  value: string
  onChange: (id: string) => void
}

function speciesFilter(option: SpeciesOption, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    option.label.toLowerCase().includes(q) ||
    option.species.toLowerCase().includes(q) ||
    option.id.toLowerCase().includes(q)
  )
}

export function SpeciesSelect({ label, options, value, onChange }: SpeciesSelectProps) {
  const selected = useMemo(
    () => options.find((option) => option.id === value) ?? null,
    [options, value],
  )

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <Combobox
        items={options}
        value={selected}
        onValueChange={(next) => {
          if (next) onChange(next.id)
        }}
        isItemEqualToValue={(a, b) => a.id === b.id}
        itemToStringLabel={(option) => option.label}
        filter={speciesFilter}
      >
        <ComboboxInput
          placeholder="选择宝可梦"
          showClear={false}
          className="w-full"
        />
        <ComboboxContent>
          <ComboboxEmpty>无匹配</ComboboxEmpty>
          <ComboboxList>
            {(option: SpeciesOption) => (
              <ComboboxItem key={option.id} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

type MatchupSelectorProps = {
  attackerId: string
  defenderId: string
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
  onAttackerChange: (id: string) => void
  onDefenderChange: (id: string) => void
}

export function MatchupSelector({
  attackerId,
  defenderId,
  attackers,
  defenders,
  onAttackerChange,
  onDefenderChange,
}: MatchupSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-muted-foreground text-xs">对战</Label>
      <div className="grid gap-2">
        <SpeciesSelect
          label="进攻方"
          options={attackers}
          value={attackerId}
          onChange={onAttackerChange}
        />
        <div className="text-muted-foreground flex justify-center text-xs">↓</div>
        <SpeciesSelect
          label="防守方"
          options={defenders}
          value={defenderId}
          onChange={onDefenderChange}
        />
      </div>
      <p className="text-muted-foreground text-[10px]">
        Champions · VGC 双打 · Level 50
      </p>
    </div>
  )
}

/** PROTOTYPE — species typing: trailing badge only (grill verdict) */

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

import { TypeBadgeRow } from "../type-colors/type-badge"
import { speciesTypes } from "../type-colors/type-data"

function speciesFilter(option: SpeciesOption, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    option.label.toLowerCase().includes(q) ||
    option.species.toLowerCase().includes(q) ||
    option.id.toLowerCase().includes(q)
  )
}

function SpeciesSelectTrailingBadge({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: SpeciesOption[]
  value: string
  onChange: (id: string) => void
}) {
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
        <div className="relative">
          <ComboboxInput
            placeholder="选择宝可梦"
            showClear={false}
            className="w-full pr-24"
          />
          {selected && (
            <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center">
              <TypeBadgeRow types={speciesTypes(selected.id)} />
            </div>
          )}
        </div>
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

type MatchupTrailingBadgeProps = {
  attackerId: string
  defenderId: string
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
  onAttackerChange: (id: string) => void
  onDefenderChange: (id: string) => void
}

export function MatchupTrailingBadge({
  attackerId,
  defenderId,
  attackers,
  defenders,
  onAttackerChange,
  onDefenderChange,
}: MatchupTrailingBadgeProps) {
  return (
    <div className="space-y-3">
      <Label className="text-muted-foreground text-xs">对战</Label>
      <div className="grid gap-2">
        <SpeciesSelectTrailingBadge
          label="进攻方"
          options={attackers}
          value={attackerId}
          onChange={onAttackerChange}
        />
        <div className="text-muted-foreground flex justify-center text-xs">↓</div>
        <SpeciesSelectTrailingBadge
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

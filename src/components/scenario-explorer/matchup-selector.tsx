import { useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { TypeBadgeRow } from "@/components/pokemon/type-badge"
import type { SpeciesOption } from "@/lib/catalog/types"
import type { BattlePokemonId } from "@/lib/resources"

type SpeciesSelectProps = {
  label: string
  options: SpeciesOption[]
  value: BattlePokemonId
  onChange: (id: BattlePokemonId) => void
}

function speciesFilter(option: SpeciesOption, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    option.label.toLowerCase().includes(q) ||
    option.species.toLowerCase().includes(q) ||
    String(option.id).includes(q)
  )
}

export function SpeciesSelect({ label, options, value, onChange }: SpeciesSelectProps) {
  const intl = useIntl()
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
            placeholder={intl.formatMessage({ id: "matchup.placeholder" })}
            showClear={false}
            className="w-full pr-[4.5rem]"
          />
          {selected && selected.types.length > 0 && (
            <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center">
              <TypeBadgeRow types={selected.types} />
            </div>
          )}
        </div>
        <ComboboxContent>
          <ComboboxEmpty>
            <FormattedMessage id="matchup.noMatches" />
          </ComboboxEmpty>
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
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
}

export function MatchupSelector({
  attackerId,
  defenderId,
  attackers,
  defenders,
  onAttackerChange,
  onDefenderChange,
}: MatchupSelectorProps) {
  const intl = useIntl()
  return (
    <div className="space-y-3">
      <Label className="text-muted-foreground text-xs">
        <FormattedMessage id="matchup.section" />
      </Label>
      <div className="grid gap-2">
        <SpeciesSelect
          label={intl.formatMessage({ id: "matchup.attacker" })}
          options={attackers}
          value={attackerId}
          onChange={onAttackerChange}
        />
        <div className="text-muted-foreground flex justify-center text-xs">↓</div>
        <SpeciesSelect
          label={intl.formatMessage({ id: "matchup.defender" })}
          options={defenders}
          value={defenderId}
          onChange={onDefenderChange}
        />
      </div>
      <p className="text-muted-foreground text-[10px]">
        <FormattedMessage id="matchup.context" />
      </p>
    </div>
  )
}

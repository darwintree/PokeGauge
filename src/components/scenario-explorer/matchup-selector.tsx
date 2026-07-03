import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge, TypeBadgeRow } from "@/components/pokemon/type-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SpeciesOption } from "@/lib/catalog/types"
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

type SpeciesSelectProps = {
  label: string
  options: SpeciesOption[]
  value: BattlePokemonId
  onChange: (id: BattlePokemonId) => void
}

function speciesMatches(option: SpeciesOption, query: string, typeFilters: PokemonType[]) {
  const q = query.trim().toLowerCase()
  const matchesQuery =
    !q ||
    option.label.toLowerCase().includes(q) ||
    option.species.toLowerCase().includes(q) ||
    String(option.id).includes(q)
  const matchesTypes = typeFilters.every((type) => option.types.includes(type))
  return matchesQuery && matchesTypes
}

function toggleType(filters: PokemonType[], type: PokemonType): PokemonType[] {
  return filters.includes(type) ? filters.filter((t) => t !== type) : [...filters, type]
}

export function SpeciesSelect({ label, options, value, onChange }: SpeciesSelectProps) {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<PokemonType[]>([])
  const selected = useMemo(
    () => options.find((option) => option.id === value) ?? null,
    [options, value],
  )
  const filteredOptions = useMemo(
    () => options.filter((option) => speciesMatches(option, query, typeFilters)),
    [options, query, typeFilters],
  )

  function select(id: BattlePokemonId) {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <Button
        type="button"
        variant="outline"
        className="h-auto min-h-11 w-full justify-between gap-3 px-3 py-2 text-left"
        onClick={() => setOpen(true)}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">
            {selected?.label ?? intl.formatMessage({ id: "matchup.placeholder" })}
          </span>
          {selected && (
            <span className="text-muted-foreground block truncate text-xs">
              {selected.species}
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {selected && <TypeBadgeRow types={selected.types} />}
          <Search className="text-muted-foreground size-3.5" />
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bottom-0 top-auto left-0 max-w-none translate-x-0 translate-y-0 rounded-b-none sm:top-1/2 sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={intl.formatMessage({ id: "matchup.placeholder" })}
            />
            <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
              {POKEMON_TYPES.map((type) => {
                const pressed = typeFilters.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={pressed}
                    className={cn(
                      "rounded border border-input bg-background px-1.5 py-1 transition-colors hover:bg-muted",
                      pressed && "border-foreground bg-muted",
                    )}
                    onClick={() => setTypeFilters((filters) => toggleType(filters, type))}
                  >
                    <TypeBadge type={type} />
                  </button>
                )
              })}
            </div>
            <div className="max-h-[55svh] overflow-y-auto rounded-lg border">
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center text-sm">
                  <FormattedMessage id="matchup.noMatches" />
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="hover:bg-muted flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left last:border-b-0"
                    onClick={() => select(option.id)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{option.label}</span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {option.species}
                      </span>
                    </span>
                    <TypeBadgeRow types={option.types} />
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
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

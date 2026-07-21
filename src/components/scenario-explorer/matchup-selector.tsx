import { Search } from "lucide-react"
import { useId, useMemo, useRef, useState } from "react"
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
  spriteSide?: "front" | "back"
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

export function SpeciesSelect({
  label,
  options,
  value,
  onChange,
  spriteSide = "front",
}: SpeciesSelectProps) {
  const intl = useIntl()
  const searchId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<PokemonType[]>([])
  const optionsAtOpen = useRef(options)
  const visibleOptions = open ? optionsAtOpen.current : options
  const selected = useMemo(
    () => options.find((option) => option.id === value) ?? null,
    [options, value],
  )
  const filteredOptions = useMemo(
    () => visibleOptions.filter((option) => speciesMatches(option, query, typeFilters)),
    [visibleOptions, query, typeFilters],
  )

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) optionsAtOpen.current = options
    setOpen(nextOpen)
  }

  function select(id: BattlePokemonId) {
    onChange(id)
    setOpen(false)
  }

  const spriteFile = spriteSide === "back" ? `back/${value}.png` : `${value}.png`

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="h-auto min-h-32 w-full flex-col items-stretch justify-start gap-1 bg-gradient-to-b from-muted/50 to-background p-2 text-left"
        onClick={() => changeOpen(true)}
      >
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteFile}`}
          alt=""
          className="mx-auto size-20 object-contain [image-rendering:pixelated]"
        />
        <span className="text-muted-foreground text-[10px] font-normal">{label}</span>
        <span className="flex min-w-0 items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold tracking-tight">
            {selected?.label ?? intl.formatMessage({ id: "matchup.placeholder" })}
          </span>
          {selected && <TypeBadgeRow types={selected.types} />}
        </span>
      </Button>

      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent className="bottom-0 top-auto left-0 h-[min(44rem,calc(100svh-1rem))] max-w-none grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden translate-x-0 translate-y-0 rounded-b-none p-0 sm:top-1/2 sm:left-1/2 sm:h-[min(44rem,calc(100svh-2rem))] sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
          <DialogHeader className="border-b px-4 py-3 pr-12">
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-0 flex-col gap-3 p-4">
            <div className="relative shrink-0">
              <Label htmlFor={searchId} className="sr-only">
                <FormattedMessage id="matchup.search" />
              </Label>
              <Search
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                aria-hidden
              />
              <Input
                id={searchId}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={intl.formatMessage({ id: "matchup.search" })}
                className="pl-8"
              />
            </div>
            <div className="flex shrink-0 flex-wrap gap-1">
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
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-lg border">
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center text-sm">
                  <FormattedMessage id="matchup.noMatches" />
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-current={option.id === value ? "true" : undefined}
                    className="hover:bg-muted aria-current:bg-muted/70 flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left last:border-b-0"
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

import { Plus, Search } from "lucide-react"
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
  value: BattlePokemonId | null
  onChange: (id: BattlePokemonId) => void
  spriteSide?: "front" | "back"
  /** default = sidebar; rail = home-screen instrument control */
  presentation?: "default" | "rail"
  disabled?: boolean
  className?: string
  awaiting?: boolean
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
  presentation = "default",
  disabled = false,
  className,
  awaiting = false,
}: SpeciesSelectProps) {
  const intl = useIntl()
  const searchId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<PokemonType[]>([])
  const optionsAtOpen = useRef(options)
  const visibleOptions = open ? optionsAtOpen.current : options
  const selected = useMemo(
    () => (value == null ? null : (options.find((option) => option.id === value) ?? null)),
    [options, value],
  )
  const filteredOptions = useMemo(
    () => visibleOptions.filter((option) => speciesMatches(option, query, typeFilters)),
    [visibleOptions, query, typeFilters],
  )

  function changeOpen(nextOpen: boolean) {
    if (disabled) return
    if (nextOpen) optionsAtOpen.current = options
    setOpen(nextOpen)
  }

  function select(id: BattlePokemonId) {
    onChange(id)
    setOpen(false)
  }

  const spriteFile =
    value == null ? null : spriteSide === "back" ? `back/${value}.png` : `${value}.png`
  const isRail = presentation === "rail"
  const placeholder =
    selected?.label ?? intl.formatMessage({ id: "matchup.placeholder" })

  return (
    <div className={cn(disabled && "pointer-events-none opacity-40", className)}>
      <Button
        type="button"
        variant={isRail ? "ghost" : "outline"}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        data-awaiting={awaiting || undefined}
        className={cn(
          "whitespace-normal transition-[transform,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99]",
          presentation === "default" &&
            "h-auto min-h-32 w-full flex-col items-stretch justify-start gap-1 rounded-[10px] border-2 border-ink bg-paper p-2 text-left shadow-hud-chip hover:bg-token-bg/50",
          isRail &&
            "h-14 w-full flex-row items-center justify-start gap-3 rounded-[10px] border border-card-border bg-paper px-3 shadow-none hover:bg-token-bg/50",
          awaiting && isRail && "border-ink border-dashed",
        )}
        onClick={() => changeOpen(true)}
      >
        {isRail ? (
          <>
            {spriteFile ? (
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteFile}`}
                alt=""
                className="size-10 shrink-0 object-contain [image-rendering:pixelated]"
              />
            ) : (
              <span
                aria-hidden
                className="bg-muted text-muted-foreground grid size-10 shrink-0 place-items-center rounded-full"
              >
                <Plus className="size-4 stroke-[1.5]" />
              </span>
            )}
            <span className="min-w-0 flex-1 text-left">
              <span className="text-muted-foreground block text-[10px] leading-none">{label}</span>
              <span
                className={cn(
                  "mt-1 block truncate text-sm font-extrabold tracking-tight",
                  !selected && "text-muted-foreground font-medium",
                )}
              >
                {placeholder}
              </span>
            </span>
            {selected && <TypeBadgeRow types={selected.types} />}
          </>
        ) : (
          <>
            {spriteFile ? (
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteFile}`}
                alt=""
                className="mx-auto size-20 object-contain [image-rendering:pixelated]"
              />
            ) : (
              <span
                aria-hidden
                className="mx-auto grid size-20 place-items-center rounded-full border border-dashed border-border/80 bg-muted/30"
              >
                <span className="bg-foreground/12 size-2 rounded-full" />
              </span>
            )}
            <span className="text-muted-foreground text-[10px] font-normal tracking-wide">
              {label}
            </span>
            <span className="flex min-w-0 items-center justify-between gap-2">
              <span
                className={cn(
                  "truncate text-sm font-extrabold tracking-tight",
                  !selected && "text-muted-foreground font-medium",
                )}
              >
                {placeholder}
              </span>
              {selected && <TypeBadgeRow types={selected.types} />}
            </span>
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent className="bottom-0 top-auto left-0 h-[min(44rem,calc(100svh-1rem))] max-w-none grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden translate-x-0 translate-y-0 rounded-b-none border-2 border-ink bg-paper p-0 shadow-hud-panel sm:top-1/2 sm:left-1/2 sm:h-[min(44rem,calc(100svh-2rem))] sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
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
                      "rounded-[9px] border-2 border-card-border bg-paper px-1.5 py-1 transition-colors hover:bg-token-bg/60",
                      pressed && "border-ink bg-signal-yellow shadow-hud-chip",
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
    </div>
  )
}

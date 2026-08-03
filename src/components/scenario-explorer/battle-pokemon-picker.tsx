import { Layers3, Plus, Search } from "lucide-react"
import { useId, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge, TypeBadgeList } from "@/components/pokemon/type-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { BattlePokemonOption } from "@/lib/catalog/types"
import {
  prioritizeBattlePokemonOptions,
  speciesHasMultipleBattlePokemonIdentities,
} from "@/lib/catalog/pokemon-selector"
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

type BattlePokemonPickerProps = {
  label: string
  options: BattlePokemonOption[]
  value: BattlePokemonId | null
  onChange: (id: BattlePokemonId) => void
  spriteSide?: "front" | "back"
  /** default = setup panel; rail = matchup landing instrument control */
  presentation?: "default" | "rail"
  disabled?: boolean
  className?: string
  awaiting?: boolean
}

function battlePokemonMatches(option: BattlePokemonOption, query: string, typeFilters: PokemonType[]) {
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

function MegaBadge() {
  return (
    <span
      aria-hidden
      className="absolute right-0 bottom-0 grid size-5 place-items-center rounded-full border border-ink bg-ink text-paper"
    >
      <svg viewBox="0 0 16 16" className="size-3" fill="none">
        <path
          d="M8 1.5 13 6 9.5 14 8 9.5 6.5 14 3 6 8 1.5Z"
          fill="currentColor"
        />
        <path d="m5.4 6.2 2.6 2 2.6-2L8 3.8 5.4 6.2Z" fill="var(--ink)" />
      </svg>
    </span>
  )
}

function BattlePokemonPickerItem({
  option,
  current,
  shortLabel,
  onSelect,
  compact = false,
}: {
  option: BattlePokemonOption
  current: boolean
  shortLabel?: string
  onSelect: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      aria-current={current ? "true" : undefined}
      className={cn(
        "hover:bg-token-bg/60 aria-current:bg-signal-yellow/55 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact
          ? "w-24 shrink-0 rounded-[9px] border border-card-border p-2"
          : "flex w-full items-center gap-3 border-b px-3 py-2 last:border-b-0",
      )}
      onClick={onSelect}
    >
      <span className={cn("relative shrink-0", compact ? "mx-auto block size-14" : "size-12")}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${option.id}.png`}
          alt=""
          className="size-full object-contain [image-rendering:pixelated]"
        />
        {option.isMega && <MegaBadge />}
      </span>
      <span className={cn("min-w-0", compact && "mt-1 block text-center")}>
        <span className={cn("block truncate font-bold", compact ? "text-xs" : "text-sm")}>
          {shortLabel ?? option.label}
        </span>
        {!compact && (
          <span className="text-muted-foreground block truncate text-xs">
            {option.species}
          </span>
        )}
      </span>
      {!compact && <span className="ml-auto"><TypeBadgeList types={option.types} /></span>}
    </button>
  )
}

export function BattlePokemonPicker({
  label,
  options,
  value,
  onChange,
  spriteSide = "front",
  presentation = "default",
  disabled = false,
  className,
  awaiting = false,
}: BattlePokemonPickerProps) {
  const intl = useIntl()
  const searchId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<PokemonType[]>([])
  const [sameSpeciesFirst, setSameSpeciesFirst] = useState(false)
  const [megaFirst, setMegaFirst] = useState(false)
  const optionsAtOpen = useRef(options)
  const visibleOptions = open ? optionsAtOpen.current : options
  const selected = useMemo(
    () => (value == null ? null : (options.find((option) => option.id === value) ?? null)),
    [options, value],
  )
  const filteredOptions = useMemo(
    () => prioritizeBattlePokemonOptions(
      visibleOptions.filter((option) => battlePokemonMatches(option, query, typeFilters)),
      selected?.speciesId ?? null,
      sameSpeciesFirst,
      megaFirst,
    ),
    [visibleOptions, query, typeFilters, selected?.speciesId, sameSpeciesFirst, megaFirst],
  )
  const sameSpeciesOptions = sameSpeciesFirst && selected
    ? filteredOptions.filter((option) => option.speciesId === selected.speciesId)
    : []
  const listOptions = sameSpeciesOptions.length > 0
    ? filteredOptions.filter((option) => option.speciesId !== selected?.speciesId)
    : filteredOptions

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

  const showFormBadge = speciesHasMultipleBattlePokemonIdentities(options, selected)

  return (
    <div className={cn("relative", disabled && "pointer-events-none opacity-40", className)}>
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
            {selected && <TypeBadgeList types={selected.types} />}
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
            <span className="flex min-w-0 flex-col items-stretch gap-1">
              <span
                className={cn(
                  "line-clamp-2 w-full text-center text-sm font-extrabold tracking-tight whitespace-normal",
                  !selected && "text-muted-foreground font-medium",
                )}
              >
                {placeholder}
              </span>
              {selected && (
                <span className="flex justify-center">
                  <TypeBadgeList types={selected.types} />
                </span>
              )}
            </span>
          </>
        )}
      </Button>

      {!disabled && showFormBadge && (
        <button
          type="button"
          aria-label={intl.formatMessage({ id: "matchup.forms.open" })}
          className={cn(
            "absolute grid size-8 place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-hud-chip outline-none transition-colors hover:bg-signal-yellow focus-visible:ring-2 focus-visible:ring-ring active:translate-y-px active:shadow-none",
            isRail ? "-top-2 -right-2" : "-top-2 -right-2",
          )}
          onClick={() => {
            setSameSpeciesFirst(true)
            changeOpen(true)
          }}
        >
          <Layers3 className="size-4" aria-hidden />
        </button>
      )}

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
            <div className="grid shrink-0 grid-cols-2 gap-3 border-y border-hairline py-3">
              <Label className="flex min-w-0 items-center justify-between gap-2 text-xs font-bold">
                <FormattedMessage id="matchup.priority.forms" />
                <Switch
                  size="sm"
                  checked={sameSpeciesFirst}
                  onCheckedChange={setSameSpeciesFirst}
                />
              </Label>
              <Label className="flex min-w-0 items-center justify-between gap-2 text-xs font-bold">
                <FormattedMessage id="matchup.priority.mega" />
                <Switch
                  size="sm"
                  checked={megaFirst}
                  onCheckedChange={setMegaFirst}
                />
              </Label>
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
            {sameSpeciesOptions.length > 0 && (
              <div className="shrink-0 overflow-x-auto overscroll-x-contain">
                <div className="flex gap-2 pb-1">
                  {sameSpeciesOptions.map((option) => (
                    <BattlePokemonPickerItem
                      key={option.id}
                      option={option}
                      current={option.id === value}
                      shortLabel={option.form ?? intl.formatMessage({ id: "matchup.form.base" })}
                      onSelect={() => select(option.id)}
                      compact
                    />
                  ))}
                </div>
              </div>
            )}
            {(sameSpeciesOptions.length === 0 || listOptions.length > 0) && (
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-lg border border-card-border">
                {listOptions.length === 0 ? (
                  <div className="text-muted-foreground p-6 text-center text-sm">
                    <FormattedMessage id="matchup.noMatches" />
                  </div>
                ) : (
                  listOptions.map((option) => (
                    <BattlePokemonPickerItem
                      key={option.id}
                      option={option}
                      current={option.id === value}
                      onSelect={() => select(option.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

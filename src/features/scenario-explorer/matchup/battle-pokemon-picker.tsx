import { Layers3, Plus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useIntl } from "react-intl"

import { TypeBadgeList } from "@/components/pokemon/type-badge"
import { Button } from "@/components/ui/button"
import {
  rankPokemonOptionsByChampionsUsage,
  speciesHasMultipleBattlePokemonIdentities,
  type BattlePokemonOption,
} from "@/lib/catalog"
import type { PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

import { FormButtonPrototype } from "./form-button.prototype"
import { BattlePokemonPickerDialog } from "./battle-pokemon-picker-dialog"
import {
  initialRankingLoadState,
  orderOptionsByIds,
  reduceRankingLoad,
} from "./ranking-load"

type BattlePokemonPickerProps = {
  label: string
  options: BattlePokemonOption[]
  value: BattlePokemonId | null
  onChange: (id: BattlePokemonId) => void
  spriteSide?: "front" | "back"
  /** Compact setup identity; otherwise render the landing row. */
  compactSide?: "attacker" | "defender"
  disabled?: boolean
  className?: string
  awaiting?: boolean
}

function toggleType(filters: PokemonType[], type: PokemonType): PokemonType[] {
  return filters.includes(type) ? filters.filter((t) => t !== type) : [...filters, type]
}

export function BattlePokemonPicker({
  label,
  options,
  value,
  onChange,
  spriteSide = "front",
  compactSide,
  disabled = false,
  className,
  awaiting = false,
}: BattlePokemonPickerProps) {
  const intl = useIntl()
  const formPrototype = import.meta.env.DEV && ["forms", "home"].includes(new URLSearchParams(window.location.search).get("prototype") ?? "")
  const [query, setQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<PokemonType[]>([])
  const [sameSpeciesFirst, setSameSpeciesFirst] = useState(false)
  const [megaFirst, setMegaFirst] = useState(false)
  const [load, setLoad] = useState(initialRankingLoadState)
  const [rankedIds, setRankedIds] = useState<BattlePokemonId[] | null>(null)
  const rankingGeneration = useRef(0)
  const selected = useMemo(
    () => (value == null ? null : (options.find((option) => option.id === value) ?? null)),
    [options, value],
  )
  const visibleOptions = useMemo(() => {
    if (load.list === "usageOrder" && rankedIds) {
      return orderOptionsByIds(options, rankedIds)
    }
    return options
  }, [load.list, options, rankedIds])

  useEffect(() => {
    if (load.query !== "inFlight") return
    const generation = rankingGeneration.current
    let ignore = false
    rankPokemonOptionsByChampionsUsage(options)
      .then((ranked) => {
        if (ignore || generation !== rankingGeneration.current) return
        setRankedIds(ranked.map((option) => option.id))
        setLoad((current) => reduceRankingLoad(current, "queryOk"))
      })
      .catch(() => {
        if (ignore || generation !== rankingGeneration.current) return
        setLoad((current) => reduceRankingLoad(current, "queryFail"))
      })
    return () => {
      ignore = true
    }
  }, [load.query, options])

  function resetPickerFilter(sameSpeciesFirst = false) {
    setQuery("")
    setTypeFilters([])
    setSameSpeciesFirst(sameSpeciesFirst)
    setMegaFirst(false)
  }

  function changeOpen(nextOpen: boolean) {
    if (disabled) return
    if (!nextOpen) resetPickerFilter()
    setLoad((current) => reduceRankingLoad(current, nextOpen ? "open" : "close"))
  }

  function skipRanking() {
    rankingGeneration.current += 1
    setLoad((current) => reduceRankingLoad(current, "skip"))
  }

  function select(id: BattlePokemonId) {
    onChange(id)
    changeOpen(false)
  }

  const spriteFile = value == null ? null : `${spriteSide === "back" ? "back/" : ""}${value}.png`
  const placeholder =
    selected?.label ?? intl.formatMessage({ id: "matchup.placeholder" })

  const showFormBadge = speciesHasMultipleBattlePokemonIdentities(options, selected)

  return (
    <div className={cn(
      "relative",
      compactSide && "battle-pokemon-identity-cell",
      formPrototype && !compactSide && "form-prototype-home",
      disabled && "pointer-events-none opacity-40",
      className,
    )}>
      <Button
        type="button"
        variant={compactSide ? "outline" : "ghost"}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        data-side={compactSide}
        aria-label={compactSide ? `${label}: ${placeholder}` : undefined}
        data-awaiting={awaiting || undefined}
        className={cn(
          "whitespace-normal transition-[transform,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99]",
          compactSide && "battle-pokemon-identity",
          !compactSide &&
            "h-14 w-full flex-row items-center justify-start gap-3 rounded-[10px] border border-card-border bg-paper px-3 shadow-none hover:bg-token-bg/50",
          awaiting && !compactSide && "border-ink border-dashed",
        )}
        onClick={() => changeOpen(true)}
      >
        {compactSide ? (
          <>
            {spriteFile ? (
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteFile}`}
                alt=""
                className="battle-pokemon-identity-sprite"
              />
            ) : (
              <span className="battle-pokemon-identity-sprite grid place-items-center" aria-hidden>
                <Plus />
              </span>
            )}
            <span className="battle-pokemon-identity-role" aria-hidden>
              {compactSide === "attacker" ? "ATK" : "DEF"}
            </span>
            <span className="battle-pokemon-identity-details">
              <span className="battle-pokemon-identity-name">{placeholder}</span>
              {selected && <TypeBadgeList types={selected.types} />}
            </span>
          </>
        ) : (
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
        )}
      </Button>

      {!disabled && showFormBadge && (formPrototype ? (
        <FormButtonPrototype onClick={() => { resetPickerFilter(true); changeOpen(true) }} />
      ) : (
        <button
          type="button"
          aria-label={intl.formatMessage({ id: "matchup.forms.open" })}
          className={cn(
            "battle-pokemon-form-trigger absolute grid size-8 place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-hud-chip outline-none transition-colors hover:bg-signal-yellow focus-visible:ring-2 focus-visible:ring-ring active:translate-y-px active:shadow-none",
            "-top-2 -right-2",
          )}
          onClick={() => {
            resetPickerFilter(true)
            changeOpen(true)
          }}
        >
          <Layers3 className="size-4" aria-hidden />
        </button>
      ))}

      <BattlePokemonPickerDialog
        open={load.picker === "open"}
        onOpenChange={changeOpen}
        label={label}
        options={visibleOptions}
        rankingPending={load.picker === "open" && load.list === "hidden"}
        onSkipRanking={skipRanking}
        value={value}
        query={query}
        onQueryChange={setQuery}
        typeFilters={typeFilters}
        onTypeFilterToggle={(type) => setTypeFilters((filters) => toggleType(filters, type))}
        sameSpeciesFirst={sameSpeciesFirst}
        onSameSpeciesFirstChange={setSameSpeciesFirst}
        megaFirst={megaFirst}
        onMegaFirstChange={setMegaFirst}
        onSelect={select}
      />
    </div>
  )
}

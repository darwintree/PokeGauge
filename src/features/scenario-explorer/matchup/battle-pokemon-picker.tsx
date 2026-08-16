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
  /** default = setup panel; rail = matchup landing instrument control */
  presentation?: "default" | "rail"
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
  presentation = "default",
  disabled = false,
  className,
  awaiting = false,
}: BattlePokemonPickerProps) {
  const intl = useIntl()
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

  function changeOpen(nextOpen: boolean) {
    if (disabled) return
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

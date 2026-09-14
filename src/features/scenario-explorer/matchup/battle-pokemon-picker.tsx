import { ChevronDown, Plus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useIntl } from "react-intl"

import { TypeBadgeList } from "@/components/pokemon/type-badge"
import { Button } from "@/components/ui/button"
import { pokemonSpriteUrl } from "@/lib/assets"
import {
  rankPokemonOptionsByChampionsUsage,
  speciesHasMultipleBattlePokemonIdentities,
  type BattlePokemonOption,
} from "@/lib/catalog"
import type { PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId } from "@/lib/resources"
import type { UsageSource } from "@/lib/usage-source-preference"
import { cn } from "@/lib/utils"
import { getUsageSource, setUsageSource } from "@/lib/champions"

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
  function changeUsageSource(source: UsageSource) {
    setUsageSource(source)
    rankingGeneration.current += 1
    setRankedIds(null)
    setLoad(initialRankingLoadState())
    setLoad((current) => reduceRankingLoad(current, "open"))
  }

  function select(id: BattlePokemonId) {
    onChange(id)
    changeOpen(false)
  }

  const spriteUrl = value == null ? null : pokemonSpriteUrl(value, spriteSide)
  const placeholder =
    selected?.label ?? intl.formatMessage({ id: "matchup.placeholder" })

  const showFormBadge = speciesHasMultipleBattlePokemonIdentities(options, selected)

  return (
    <div className={cn(
      "relative",
      compactSide && "battle-pokemon-identity-cell",
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
          "whitespace-normal",
          compactSide && "battle-pokemon-identity",
          !compactSide &&
            "h-14 w-full flex-row items-center justify-start gap-3 rounded-[10px] border border-card-border bg-paper px-3 shadow-none hover:bg-token-bg/50",
          awaiting && !compactSide && "border-ink border-dashed",
        )}
        onClick={() => changeOpen(true)}
      >
        {compactSide ? (
          <>
            {spriteUrl ? (
              <img
                src={spriteUrl}
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
            {spriteUrl ? (
              <img
                src={spriteUrl}
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

      {!disabled && showFormBadge && (
        <Button
          type="button"
          size="sm"
          aria-label={intl.formatMessage({ id: "matchup.forms.open" })}
          aria-haspopup="dialog"
          className="battle-pokemon-form-trigger"
          onClick={() => {
            resetPickerFilter(true)
            changeOpen(true)
          }}
        >
          FORM <ChevronDown aria-hidden data-icon="inline-end" />
        </Button>
      )}

      <BattlePokemonPickerDialog
        open={load.picker === "open"}
        onOpenChange={changeOpen}
        label={label}
        options={visibleOptions}
        rankingPending={load.picker === "open" && load.list === "hidden"}
        usageSource={getUsageSource()}
        onUsageSourceChange={changeUsageSource}
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

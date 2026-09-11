import { useEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { getUsageSource, setUsageSource } from "@/lib/champions"
import { Button } from "@/components/ui/button"
import {
  rankMoveOptionsByChampionsUsage,
  type CatalogMoveOption,
  type MoveCategory,
} from "@/lib/catalog"
import { POKEMON_TYPES, typeEffectiveness, type PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

import {
  initialRankingLoadState,
  orderOptionsByIds,
  reduceRankingLoad,
} from "../../matchup/ranking-load"
import { PickerDialog } from "../../pickers/picker-dialog"

function sameTypeSet(left: readonly PokemonType[], right: readonly PokemonType[]) {
  if (left.length !== right.length) return false
  const rightSet = new Set(right)
  return left.every((type) => rightSet.has(type))
}

function superEffectiveTypes(defenderTypes: readonly PokemonType[]): PokemonType[] {
  return POKEMON_TYPES.filter((type) => typeEffectiveness(type, defenderTypes) > 1)
}

function sortMovesByPower(options: CatalogMoveOption[]) {
  return options.toSorted((a, b) => b.power - a.power || a.id - b.id)
}

function moveMatches(
  option: CatalogMoveOption,
  query: string,
  typeFilters: PokemonType[],
) {
  const q = query.trim().toLowerCase()
  const matchesQuery =
    !q ||
    option.label.toLowerCase().includes(q) ||
    option.moveName.toLowerCase().includes(q) ||
    String(option.id).includes(q)
  const matchesTypes = typeFilters.length === 0 || typeFilters.includes(option.type)
  return matchesQuery && matchesTypes
}

function toggleType(filters: PokemonType[], type: PokemonType): PokemonType[] {
  return filters.includes(type) ? filters.filter((item) => item !== type) : [...filters, type]
}

function applyShortcut(current: PokemonType[], target: readonly PokemonType[]): PokemonType[] {
  if (target.length === 0) return current
  if (sameTypeSet(current, target)) return []
  return [...target]
}

export function MovePickerDialog({
  open,
  onOpenChange,
  attackerId,
  moveCategory,
  attackerTypes,
  defenderTypes,
  options,
  learnableMoveIds = options.map((option) => option.id),
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  attackerId: BattlePokemonId
  moveCategory: MoveCategory
  attackerTypes: readonly PokemonType[]
  defenderTypes: readonly PokemonType[]
  options: CatalogMoveOption[]
  learnableMoveIds?: readonly number[]
  onSelect: (moveId: number) => void
}) {
  const intl = useIntl()
  const [query, setQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<PokemonType[]>([])
  const [learnableOnly, setLearnableOnly] = useState(true)
  const [load, setLoad] = useState(initialRankingLoadState)
  const [rankedIds, setRankedIds] = useState<number[] | null>(null)
  const rankingGeneration = useRef(0)
  const openRef = useRef(open)
  openRef.current = open

  const powerOrdered = useMemo(() => sortMovesByPower(options), [options])
  const learnableMoveIdSet = useMemo(() => new Set(learnableMoveIds), [learnableMoveIds])
  const seTypes = useMemo(() => superEffectiveTypes(defenderTypes), [defenderTypes])
  const stabOn = sameTypeSet(typeFilters, attackerTypes) && attackerTypes.length > 0
  const seOn = sameTypeSet(typeFilters, seTypes) && seTypes.length > 0
  const rankingPending = open && load.list === "hidden"
  function changeUsageSource(source: "champions" | "smogon") {
    setUsageSource(source)
    rankingGeneration.current += 1
    setRankedIds(null)
    setLoad(initialRankingLoadState())
    if (openRef.current) setLoad((current) => reduceRankingLoad(current, "open"))
  }
  const visibleOptions = useMemo(() => {
    const ordered =
      load.list === "usageOrder" && rankedIds
        ? orderOptionsByIds(powerOrdered, rankedIds)
        : powerOrdered
    return ordered.filter(
      (option) =>
        (!learnableOnly || learnableMoveIdSet.has(option.id)) &&
        moveMatches(option, query, typeFilters),
    )
  }, [learnableMoveIdSet, learnableOnly, load.list, powerOrdered, rankedIds, query, typeFilters])

  useEffect(() => {
    rankingGeneration.current += 1
    setLearnableOnly(true)
    setRankedIds(null)
    setLoad(() => {
      const reset = initialRankingLoadState()
      return openRef.current ? reduceRankingLoad(reset, "open") : reset
    })
  }, [attackerId, moveCategory])

  useEffect(() => {
    setLoad((current) => reduceRankingLoad(current, open ? "open" : "close"))
    if (!open) {
      setQuery("")
      setTypeFilters([])
      setLearnableOnly(true)
    }
  }, [open])

  useEffect(() => {
    if (load.query !== "inFlight") return
    const generation = rankingGeneration.current
    let ignore = false
    rankMoveOptionsByChampionsUsage(attackerId, powerOrdered)
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
  }, [load.query, attackerId, powerOrdered])

  function skipRanking() {
    rankingGeneration.current += 1
    setLoad((current) => reduceRankingLoad(current, "skip"))
  }

  return (
    <PickerDialog
      open={open}
      onOpenChange={onOpenChange}
      title={intl.formatMessage({ id: "track.addMove" })}
      searchLabel={intl.formatMessage({ id: "track.move.search" })}
      searchPlaceholder={intl.formatMessage({ id: "track.move.search" })}
      query={query}
      onQueryChange={setQuery}
      beforeList={
        <>
          <div className="grid shrink-0 grid-cols-3 gap-2 border-y border-hairline py-3">
            <button
              type="button"
              aria-pressed={learnableOnly}
              className={cn(
                "flex min-h-8 items-center justify-center rounded-[9px] border px-2 text-xs font-extrabold outline-none focus-visible:ring-2 focus-visible:ring-ring",
                learnableOnly
                  ? "border-ink bg-signal-yellow shadow-hud-chip"
                  : "border-card-border bg-paper hover:bg-token-bg/60",
              )}
              onClick={() => setLearnableOnly((current) => !current)}
            >
              <FormattedMessage id="track.move.filter.learnable" />
            </button>
            <button
              type="button"
              aria-pressed={stabOn}
              className={cn(
                "flex min-h-8 items-center justify-center rounded-[9px] border px-2 text-xs font-extrabold outline-none focus-visible:ring-2 focus-visible:ring-ring",
                stabOn
                  ? "border-ink bg-signal-yellow shadow-hud-chip"
                  : "border-card-border bg-paper hover:bg-token-bg/60",
              )}
              onClick={() => setTypeFilters((current) => applyShortcut(current, attackerTypes))}
            >
              <FormattedMessage id="track.move.filter.stab" />
            </button>
            <button
              type="button"
              aria-pressed={seOn}
              className={cn(
                "flex min-h-8 items-center justify-center rounded-[9px] border px-2 text-xs font-extrabold outline-none focus-visible:ring-2 focus-visible:ring-ring",
                seOn
                  ? "border-ink bg-signal-yellow shadow-hud-chip"
                  : "border-card-border bg-paper hover:bg-token-bg/60",
              )}
              onClick={() => setTypeFilters((current) => applyShortcut(current, seTypes))}
            >
              <FormattedMessage id="track.move.filter.superEffective" />
            </button>
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
                    "rounded-[9px] border border-card-border bg-paper px-1.5 py-1 transition-colors hover:bg-token-bg/60",
                    pressed && "border-ink bg-signal-yellow shadow-hud-chip",
                  )}
                  onClick={() => setTypeFilters((filters) => toggleType(filters, type))}
                >
                  <TypeBadge type={type} />
                </button>
              )
            })}
          </div>
        </>
      }
      bodyClassName="rounded-lg border border-card-border"
      empty={
        rankingPending || visibleOptions.length > 0 ? undefined : (
          <FormattedMessage id="matchup.noMatches" />
        )
      }
    >
      {rankingPending ? (
        <div className="m-3 flex flex-col items-center gap-3 rounded-[10px] border border-hud-frame bg-notice-bg p-4 text-center">
          <p aria-live="polite" className="text-sm font-bold">
            <FormattedMessage id="matchup.ranking.loading" /> ({getUsageSource() === "smogon" ? "Smogon" : "Pokémon Champions"})
          </p>
          <select aria-label="Usage source" value={getUsageSource()} onChange={(event) => changeUsageSource(event.target.value as "champions" | "smogon")} className="h-9 rounded-md border border-hud-frame bg-paper px-2 text-xs font-bold"><option value="champions">Pokémon Champions</option><option value="smogon">Smogon</option></select>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border border-hud-frame bg-paper font-bold shadow-hud-chip hover:bg-token-bg/60"
            onClick={skipRanking}
          >
            <FormattedMessage id="matchup.ranking.skip" />
          </Button>
        </div>
      ) : (
        visibleOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className="hover:bg-token-bg/60 flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onSelect(option.id)}
          >
            <TypeBadge type={option.type} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{option.label}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {option.moveName}
              </span>
            </span>
            <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
              {option.power || "-"} / {option.accuracy ?? "-"}
            </span>
          </button>
        ))
      )}
    </PickerDialog>
  )
}

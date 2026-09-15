import { useMemo, useRef } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { BattlePokemonOption } from "@/lib/catalog"
import { prioritizeBattlePokemonOptions } from "@/lib/catalog"
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

import { PickerDialog } from "../pickers/picker-dialog"
import { RankingPendingNotice } from "../pickers/ranking-pending-notice"
import { UsagePickerChrome } from "../pickers/usage-chrome"
import { BattlePokemonPickerItem } from "./battle-pokemon-picker-item"
import { BattlePokemonVirtualList } from "./battle-pokemon-virtual-list"

function battlePokemonMatches(
  option: BattlePokemonOption,
  query: string,
  typeFilters: PokemonType[],
) {
  const q = query.trim().toLowerCase()
  const matchesQuery =
    !q ||
    option.label.toLowerCase().includes(q) ||
    option.species.toLowerCase().includes(q) ||
    String(option.id).includes(q)
  const matchesTypes = typeFilters.every((type) => option.types.includes(type))
  return matchesQuery && matchesTypes
}

export function BattlePokemonPickerDialog({
  open,
  onOpenChange,
  label,
  options,
  value,
  query,
  onQueryChange,
  typeFilters,
  onTypeFilterToggle,
  sameSpeciesFirst,
  onSameSpeciesFirstChange,
  megaFirst,
  onMegaFirstChange,
  rankingPending,
  onSkipRanking,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: string
  options: BattlePokemonOption[]
  value: BattlePokemonId | null
  query: string
  onQueryChange: (query: string) => void
  typeFilters: PokemonType[]
  onTypeFilterToggle: (type: PokemonType) => void
  sameSpeciesFirst: boolean
  onSameSpeciesFirstChange: (checked: boolean) => void
  megaFirst: boolean
  onMegaFirstChange: (checked: boolean) => void
  rankingPending?: boolean
  onSkipRanking?: () => void
  onSelect: (id: BattlePokemonId) => void
}) {
  const intl = useIntl()
  const scrollRef = useRef<HTMLDivElement>(null)
  const selected = useMemo(
    () => (value == null ? null : (options.find((option) => option.id === value) ?? null)),
    [options, value],
  )
  const filteredOptions = useMemo(
    () =>
      prioritizeBattlePokemonOptions(
        options.filter((option) => battlePokemonMatches(option, query, typeFilters)),
        selected?.speciesId ?? null,
        sameSpeciesFirst,
        megaFirst,
      ),
    [options, query, typeFilters, selected?.speciesId, sameSpeciesFirst, megaFirst],
  )
  const sameSpeciesOptions = sameSpeciesFirst && selected
    ? filteredOptions.filter((option) => option.speciesId === selected.speciesId)
    : []
  const listOptions = sameSpeciesOptions.length > 0
    ? filteredOptions.filter((option) => option.speciesId !== selected?.speciesId)
    : filteredOptions
  const showList =
    rankingPending || sameSpeciesOptions.length === 0 || listOptions.length > 0

  return (
    <PickerDialog
      open={open}
      onOpenChange={onOpenChange}
      title={label}
      searchLabel={intl.formatMessage({ id: "matchup.search" })}
      searchPlaceholder={intl.formatMessage({ id: "matchup.search" })}
      query={query}
      onQueryChange={onQueryChange}
      beforeList={
        <>
          <UsagePickerChrome />
          <div
            className={cn(
              "grid shrink-0 gap-3 border-y border-hairline py-3",
              selected ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {selected ? (
              <Label className="flex min-w-0 items-center justify-between gap-2 text-xs font-bold">
                <FormattedMessage id="matchup.priority.forms" />
                <Switch
                  size="sm"
                  checked={sameSpeciesFirst}
                  onCheckedChange={onSameSpeciesFirstChange}
                />
              </Label>
            ) : null}
            <Label className="flex min-w-0 items-center justify-between gap-2 text-xs font-bold">
              <FormattedMessage id="matchup.priority.mega" />
              <Switch
                size="sm"
                checked={megaFirst}
                onCheckedChange={onMegaFirstChange}
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
                    "rounded-[9px] border border-card-border bg-paper px-1.5 py-1 transition-colors hover:bg-token-bg/60",
                    pressed && "border-ink bg-signal-yellow shadow-hud-chip",
                  )}
                  onClick={() => onTypeFilterToggle(type)}
                >
                  <TypeBadge type={type} variant="text" />
                </button>
              )
            })}
          </div>
          {!rankingPending && sameSpeciesOptions.length > 0 && (
            <div className="shrink-0 overflow-x-auto overscroll-x-contain">
              <div className="flex gap-2 pb-1">
                {sameSpeciesOptions.map((option) => (
                  <BattlePokemonPickerItem
                    key={option.id}
                    option={option}
                    current={option.id === value}
                    shortLabel={option.form ?? intl.formatMessage({ id: "matchup.form.base" })}
                    onSelect={() => onSelect(option.id)}
                    compact
                  />
                ))}
              </div>
            </div>
          )}
        </>
      }
      bodyRef={scrollRef}
      bodyClassName={cn("rounded-lg border border-card-border", !showList && "hidden")}
      empty={
        rankingPending || listOptions.length > 0
          ? undefined
          : <FormattedMessage id="matchup.noMatches" />
      }
    >
      {rankingPending ? (
        <RankingPendingNotice onSkip={() => onSkipRanking?.()} />
      ) : (
        <BattlePokemonVirtualList
          key={`${query}:${typeFilters.join(",")}:${sameSpeciesFirst}:${megaFirst}`}
          options={listOptions}
          value={value}
          onSelect={onSelect}
          scrollRef={scrollRef}
        />
      )}
    </PickerDialog>
  )
}

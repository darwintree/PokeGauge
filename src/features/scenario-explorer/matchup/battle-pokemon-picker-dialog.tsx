import { useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge, TypeBadgeList } from "@/components/pokemon/type-badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { pokemonSpriteUrl } from "@/lib/assets"
import type { BattlePokemonOption } from "@/lib/catalog"
import { prioritizeBattlePokemonOptions } from "@/lib/catalog"
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId } from "@/lib/resources"
import { usageSourceMessageId, type UsageSource } from "@/lib/usage-source-preference"
import { cn } from "@/lib/utils"

import { PickerDialog } from "../pickers/picker-dialog"
import { UsageSourceSelect } from "../pickers/usage-source-select"

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
          : "flex w-full items-center gap-3 border-b px-3 py-2 last:border-b-0 [content-visibility:auto] [contain-intrinsic-size:auto_64px]",
      )}
      onClick={onSelect}
    >
      <span className={cn("shrink-0", compact ? "mx-auto block size-14" : "size-12")}>
        <img
          loading="lazy"
          decoding="async"
          src={pokemonSpriteUrl(option.id)}
          alt=""
          className="size-full object-contain [image-rendering:pixelated]"
        />
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
  usageSource = "champions",
  onUsageSourceChange,
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
  usageSource?: UsageSource
  onUsageSourceChange?: (source: UsageSource) => void
  onSkipRanking?: () => void
  onSelect: (id: BattlePokemonId) => void
}) {
  const intl = useIntl()
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
                  <TypeBadge type={type} />
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
      bodyClassName={cn("rounded-lg border border-card-border", !showList && "hidden")}
      empty={
        rankingPending || listOptions.length > 0
          ? undefined
          : <FormattedMessage id="matchup.noMatches" />
      }
    >
      {rankingPending ? (
        <div className="m-3 flex flex-col items-center gap-3 rounded-[10px] border border-hud-frame bg-notice-bg p-4 text-center">
          <p aria-live="polite" className="text-sm font-bold">
            <FormattedMessage id="matchup.ranking.loading" /> ({intl.formatMessage({ id: usageSourceMessageId(usageSource) })})
          </p>
          <UsageSourceSelect
            value={usageSource}
            onChange={(source) => onUsageSourceChange?.(source)}
            className="h-9 px-2 text-xs"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border border-hud-frame bg-paper font-bold shadow-hud-chip hover:bg-token-bg/60"
            onClick={onSkipRanking}
          >
            <FormattedMessage id="matchup.ranking.skip" />
          </Button>
        </div>
      ) : (
        listOptions.map((option) => (
          <BattlePokemonPickerItem
            key={option.id}
            option={option}
            current={option.id === value}
            onSelect={() => onSelect(option.id)}
          />
        ))
      )}
    </PickerDialog>
  )
}

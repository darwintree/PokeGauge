import { useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { getCatalogShell, type CatalogMoveOption } from "@/lib/catalog"
import type { SupportedLocale } from "@/lib/i18n"
import { POKEMON_TYPES, typeEffectiveness, type PokemonType } from "@/lib/pokemon"
import { cn } from "@/lib/utils"

import { PickerDialog } from "../../pickers/picker-dialog"
import {
  PrototypeSwitcher,
  readPrototypeVariant,
  writePrototypeVariant,
} from "../../prototype-switcher"

// Three variants of move picker list rows, switchable via ?variant=, on
// ?prototype=move-picker-rows (existing app shell). Question: what should a
// move row look like when scanning the global candidate pool?

const VARIANTS = [
  { key: "A", name: "Trailing stats" },
  { key: "B", name: "Type swatch identity" },
  { key: "C", name: "Power-first rail" },
] as const

function sameTypeSet(left: PokemonType[], right: PokemonType[]) {
  if (left.length !== right.length) return false
  const rightSet = new Set(right)
  return left.every((type) => rightSet.has(type))
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
  const matchesTypes =
    typeFilters.length === 0 || typeFilters.includes(option.type)
  return matchesQuery && matchesTypes
}

function formatAccuracy(accuracy: number | null) {
  return accuracy ?? "-"
}

function VariantA({
  options,
  onSelect,
}: {
  options: CatalogMoveOption[]
  onSelect: (move: CatalogMoveOption) => void
}) {
  return (
    <div className="rounded-lg border border-card-border">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="hover:bg-token-bg/60 flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onSelect(option)}
        >
          <TypeBadge type={option.type} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{option.label}</span>
            <span className="text-muted-foreground block truncate text-xs">
              {option.moveName}
            </span>
          </span>
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {option.power} / {formatAccuracy(option.accuracy)}
          </span>
        </button>
      ))}
    </div>
  )
}

function VariantB({
  options,
  onSelect,
}: {
  options: CatalogMoveOption[]
  onSelect: (move: CatalogMoveOption) => void
}) {
  return (
    <div>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="hover:bg-token-bg/60 flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onSelect(option)}
        >
          <span
            className="grid size-12 shrink-0 place-items-center rounded-[9px] border-2 border-ink"
            style={{ backgroundColor: `var(--pokemon-type-${option.type})` }}
          >
            <TypeBadge type={option.type} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{option.label}</span>
            <span className="text-muted-foreground block truncate text-xs">
              {option.moveName} {option.power} / {formatAccuracy(option.accuracy)}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

function VariantC({
  options,
  onSelect,
}: {
  options: CatalogMoveOption[]
  onSelect: (move: CatalogMoveOption) => void
}) {
  return (
    <div className="rounded-lg border border-card-border">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="hover:bg-token-bg/60 grid w-full grid-cols-[auto_4.5rem_minmax(0,1fr)_auto] items-center gap-2 border-b py-1.5 pr-3 text-left last:border-b-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onSelect(option)}
        >
          <span
            className="h-8 w-1 self-stretch"
            style={{ backgroundColor: `var(--pokemon-type-${option.type})` }}
          />
          <span className="text-right text-lg font-extrabold leading-none tabular-nums">
            {option.power || "-"}
          </span>
          <span className="min-w-0 truncate text-sm font-bold">{option.label}</span>
          <span className="text-muted-foreground text-[11px] tabular-nums">
            {formatAccuracy(option.accuracy)}
          </span>
        </button>
      ))}
    </div>
  )
}

export function MovePickerRowsPrototype({ locale }: { locale: SupportedLocale }) {
  const intl = useIntl()
  const [variant, setVariant] = useState(() =>
    readPrototypeVariant(
      VARIANTS.map((item) => item.key),
      "A",
    ),
  )
  const [query, setQuery] = useState("")
  const [typeFilters, setTypeFilters] = useState<PokemonType[]>([])
  const [moves, setMoves] = useState<CatalogMoveOption[]>([])
  const [attackerTypes, setAttackerTypes] = useState<PokemonType[]>([])
  const [defenderTypes, setDefenderTypes] = useState<PokemonType[]>([])
  const [matchupLabel, setMatchupLabel] = useState("")
  const [lastClicked, setLastClicked] = useState<string>("(none)")

  useEffect(() => {
    let ignore = false
    getCatalogShell(445, 727, locale, "physical").then((catalog) => {
      if (ignore) return
      setMoves(catalog.moves)
      setAttackerTypes([...catalog.attackerTypes])
      setDefenderTypes([...catalog.defenderTypes])
      setMatchupLabel(`${catalog.matchup.attackerLabel} → ${catalog.matchup.defenderLabel}`)
    })
    return () => {
      ignore = true
    }
  }, [locale])

  const seTypes = useMemo(
    () => POKEMON_TYPES.filter((type) => typeEffectiveness(type, defenderTypes) > 1),
    [defenderTypes],
  )
  const stabOn = sameTypeSet(typeFilters, attackerTypes) && attackerTypes.length > 0
  const seOn = sameTypeSet(typeFilters, seTypes) && seTypes.length > 0
  const filtered = useMemo(
    () => moves.filter((option) => moveMatches(option, query, typeFilters)),
    [moves, query, typeFilters],
  )

  function changeVariant(key: string) {
    writePrototypeVariant(key)
    setVariant(key)
  }

  function toggleType(type: PokemonType) {
    setTypeFilters((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    )
  }

  const stateLine = [
    matchupLabel || "loading",
    `chips:${typeFilters.join(",") || "all"}`,
    stabOn ? "STAB" : seOn ? "SE" : "no-shortcut",
    `${filtered.length}/${moves.length}`,
    `click:${lastClicked}`,
  ].join(" | ")

  return (
    <div className="min-h-[calc(100dvh-3.5rem)]">
      <PickerDialog
        open
        onOpenChange={() => {}}
        title={intl.formatMessage({ id: "track.addMove" })}
        searchLabel={intl.formatMessage({ id: "track.move.search" })}
        searchPlaceholder={intl.formatMessage({ id: "track.move.search" })}
        query={query}
        onQueryChange={setQuery}
        beforeList={
          <>
            <div className="grid shrink-0 grid-cols-2 gap-3 border-y border-hairline py-3">
              <button
                type="button"
                aria-pressed={stabOn}
                className={cn(
                  "flex min-h-8 items-center justify-center rounded-[9px] border-2 px-2 text-xs font-extrabold",
                  stabOn
                    ? "border-ink bg-signal-yellow shadow-hud-chip"
                    : "border-card-border bg-paper hover:bg-token-bg/60",
                )}
                onClick={() => setTypeFilters([...attackerTypes])}
              >
                STAB
              </button>
              <button
                type="button"
                aria-pressed={seOn}
                className={cn(
                  "flex min-h-8 items-center justify-center rounded-[9px] border-2 px-2 text-xs font-extrabold",
                  seOn
                    ? "border-ink bg-signal-yellow shadow-hud-chip"
                    : "border-card-border bg-paper hover:bg-token-bg/60",
                )}
                onClick={() => setTypeFilters([...seTypes])}
              >
                {locale.startsWith("zh") ? "克制" : locale === "ja" ? "効果抜群" : "SE"}
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
                      "rounded-[9px] border-2 border-card-border bg-paper px-1.5 py-1 transition-colors hover:bg-token-bg/60",
                      pressed && "border-ink bg-signal-yellow shadow-hud-chip",
                    )}
                    onClick={() => toggleType(type)}
                  >
                    <TypeBadge type={type} />
                  </button>
                )
              })}
            </div>
          </>
        }
        empty={
          filtered.length === 0 ? <FormattedMessage id="matchup.noMatches" /> : undefined
        }
      >
        {variant === "A" ? (
          <VariantA options={filtered} onSelect={(move) => setLastClicked(move.label)} />
        ) : null}
        {variant === "B" ? (
          <VariantB options={filtered} onSelect={(move) => setLastClicked(move.label)} />
        ) : null}
        {variant === "C" ? (
          <VariantC options={filtered} onSelect={(move) => setLastClicked(move.label)} />
        ) : null}
      </PickerDialog>
      <PrototypeSwitcher
        variants={[...VARIANTS]}
        current={variant}
        onChange={changeVariant}
        stateLine={stateLine}
      />
    </div>
  )
}

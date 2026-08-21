import { useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import type { CatalogOption } from "@/lib/catalog"
import {
  heldItemMatchesPickerFilters,
  isFormTriggerItem,
  listHeldItemPickerOptions,
  type HeldItemId,
  type HeldItemPickerHolder,
  type HeldItemPickerTag,
} from "@/lib/held-item"
import type { SupportedLocale } from "@/lib/i18n"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

import { PickerDialog } from "../../pickers/picker-dialog"
import { HeldItemSpriteIcon } from "./held-item-sprite-icon"

const TAGS: HeldItemPickerTag[] = ["exclusive", "power", "stat", "berry"]

type HeldItemPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  side: "attacker" | "defender"
  locale: SupportedLocale
  holder: HeldItemPickerHolder
  selectableIds: ReadonlySet<BattlePokemonId>
  onSelect: (id: number) => void
  onFormTrigger: (id: number) => void
}

export function HeldItemPickerDialog({
  open,
  onOpenChange,
  side,
  locale,
  holder,
  selectableIds,
  onSelect,
  onFormTrigger,
}: HeldItemPickerDialogProps) {
  const intl = useIntl()
  const [query, setQuery] = useState("")
  const [tag, setTag] = useState<HeldItemPickerTag | null>(null)

  const options = useMemo(
    () =>
      listHeldItemPickerOptions({
        side,
        locale,
        battlePokemonId: holder.battlePokemonId,
        selectableIds,
      }),
    [side, locale, holder.battlePokemonId, selectableIds],
  )

  const filtered = options.filter((option) =>
    heldItemMatchesPickerFilters(option, {
      query,
      tag,
      holder,
      selectableIds,
    }),
  )

  function choose(option: CatalogOption<HeldItemId>) {
    if (typeof option.id !== "number") return
    if (isFormTriggerItem(option.id)) {
      onFormTrigger(option.id)
      return
    }
    onSelect(option.id)
    onOpenChange(false)
  }

  function resetFilters() {
    setQuery("")
    setTag(null)
  }

  return (
    <PickerDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) resetFilters()
      }}
      title={intl.formatMessage({ id: "track.addItem" })}
      searchLabel={intl.formatMessage({ id: "track.item.search" })}
      searchPlaceholder={intl.formatMessage({ id: "track.item.search" })}
      query={query}
      onQueryChange={setQuery}
      filtersClassName="-mx-4 -mt-4 space-y-2.5 border-b bg-token-bg/40 px-4 py-3"
      beforeList={
        <div className="flex gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5">
          <button
            type="button"
            aria-pressed={tag === null}
            className={cn(
              "flex min-h-8 shrink-0 items-center rounded-full border-2 px-3 text-[11px] font-extrabold",
              tag === null
                ? "border-ink bg-ink text-paper"
                : "border-card-border bg-paper text-muted-foreground hover:bg-token-bg/60",
            )}
            onClick={() => setTag(null)}
          >
            <FormattedMessage id="track.item.tag.all" />
          </button>
          {TAGS.map((value) => {
            const pressed = tag === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={pressed}
                className={cn(
                  "flex min-h-8 shrink-0 items-center rounded-full border-2 px-3 text-[11px] font-extrabold",
                  pressed
                    ? "border-ink bg-signal-yellow shadow-hud-chip"
                    : "border-card-border bg-paper hover:bg-token-bg/60",
                )}
                onClick={() => setTag(pressed ? null : value)}
              >
                <FormattedMessage id={`track.item.tag.${value}`} />
              </button>
            )
          })}
        </div>
      }
      bodyClassName="px-1"
      empty={
        filtered.length === 0 ? <FormattedMessage id="matchup.noMatches" /> : undefined
      }
    >
      {filtered.map((option) => {
        const formTrigger =
          typeof option.id === "number" && isFormTriggerItem(option.id)
        const formHint = intl.formatMessage({ id: "track.item.formTrigger.hint" })
        return (
          <button
            key={String(option.id)}
            type="button"
            className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-2 py-2.5 text-left last:border-b-0 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring"
            onClick={() => choose(option)}
          >
            <span className="grid size-9 place-items-center rounded-md bg-token-bg">
              <HeldItemSpriteIcon id={option.id} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">{option.label}</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                {option.summary}
              </span>
            </span>
            {formTrigger ? (
              <span
                className="rounded-[5px] bg-ink px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-paper"
                aria-label={formHint}
                title={formHint}
              >
                FORM
              </span>
            ) : (
              <span className="w-10" aria-hidden />
            )}
          </button>
        )
      })}
    </PickerDialog>
  )
}

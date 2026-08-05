import { FormattedMessage, useIntl } from "react-intl"
import { useMemo, useState } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import type { CatalogOption } from "@/lib/catalog"
import {
  heldItemMatchesPickerFilters,
  isFormTriggerItem,
  itemSprite,
  listHeldItemPickerOptions,
  type HeldItemId,
  type HeldItemPickerHolder,
  type HeldItemPickerTag,
} from "@/lib/held-item"
import type { SupportedLocale } from "@/lib/i18n"
import type { BattlePokemonId } from "@/lib/resources"

import { PickerDialog } from "../../pickers/picker-dialog"
import { cn } from "@/lib/utils"

const TAGS: HeldItemPickerTag[] = ["exclusive", "power", "stat", "berry"]

export function HeldItemPickerDialog({
  open,
  onOpenChange,
  side,
  locale,
  holder,
  selectableIds,
  onSelect,
  onFormTrigger,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  side: "attacker" | "defender"
  locale: SupportedLocale
  holder: HeldItemPickerHolder
  selectableIds: ReadonlySet<BattlePokemonId>
  onSelect: (id: number) => void
  onFormTrigger: (id: number) => void
}) {
  const intl = useIntl()
  const [query, setQuery] = useState("")
  const [tags, setTags] = useState<HeldItemPickerTag[]>([])
  const [holderEligible, setHolderEligible] = useState(true)

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
      tags,
      holderEligible,
      holder,
      selectableIds,
    }),
  )

  function toggleTag(tag: HeldItemPickerTag) {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((value) => value !== tag)
        : [...current, tag],
    )
  }

  function choose(option: CatalogOption<HeldItemId>) {
    if (typeof option.id !== "number") return
    if (isFormTriggerItem(option.id)) {
      onFormTrigger(option.id)
      return
    }
    onSelect(option.id)
    onOpenChange(false)
  }

  return (
    <PickerDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setQuery("")
          setTags([])
          setHolderEligible(true)
        }
      }}
      title={intl.formatMessage({ id: "track.addItem" })}
      searchLabel={intl.formatMessage({ id: "track.item.search" })}
      searchPlaceholder={intl.formatMessage({ id: "track.item.search" })}
      query={query}
      onQueryChange={setQuery}
      beforeList={
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((tag) => (
              <Toggle
                key={tag}
                pressed={tags.includes(tag)}
                size="sm"
                className="h-7 px-2 text-[11px] font-bold"
                onPressedChange={() => toggleTag(tag)}
              >
                <FormattedMessage id={`track.item.tag.${tag}`} />
              </Toggle>
            ))}
          </div>
          <Label className="flex min-w-0 items-center justify-between gap-2 text-xs font-bold">
            <FormattedMessage id="track.item.holderEligible" />
            <Switch
              size="sm"
              checked={holderEligible}
              onCheckedChange={setHolderEligible}
            />
          </Label>
        </div>
      }
      bodyClassName="p-1"
      empty={
        filtered.length === 0 ? <FormattedMessage id="matchup.noMatches" /> : undefined
      }
    >
      {filtered.map((option) => {
        const sprite = typeof option.id === "number" ? itemSprite(option.id) : null
        const formTrigger = typeof option.id === "number" && isFormTriggerItem(option.id)
        return (
          <button
            key={String(option.id)}
            type="button"
            className={cn(
              "flex w-full items-center gap-3 border-b px-2 py-2.5 text-left last:border-b-0 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring",
              formTrigger && "bg-token-bg/40",
            )}
            onClick={() => choose(option)}
          >
            {sprite ? (
              <img src={`/items/${sprite}`} alt="" className="size-6 object-contain" />
            ) : (
              <span className="size-6" />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{option.label}</span>
              {formTrigger && (
                <span className="block truncate text-[11px] text-muted-foreground">
                  <FormattedMessage id="track.item.formTrigger.hint" />
                </span>
              )}
            </span>
          </button>
        )
      })}
    </PickerDialog>
  )
}

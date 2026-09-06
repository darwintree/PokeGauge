import { PackageOpen } from "lucide-react"
import { useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  formTriggerIdentityFor,
  heldItemWarning,
  isFormTriggerItem,
  itemAriaLabel,
  itemDescription,
  type HeldItemId,
} from "@/lib/held-item"
import type { SupportedLocale } from "@/lib/i18n"
import { GENERATED_POKEMON_LITE } from "@/lib/resources/generated/pokemon-lite"
import type { BattlePokemonId } from "@/lib/resources"
import { cn } from "@/lib/utils"

import { TrackOption, TrackOptionAdd, TrackOptionGroup } from "../common/track-option"
import { TrackPanel } from "../common/track-panel"
import { HeldItemPickerDialog } from "./held-item-picker-dialog"
import { HeldItemSpriteIcon } from "./held-item-sprite-icon"

type HeldItemTrackProps = {
  catalog: MatchupCatalog
  poolIds: HeldItemId[]
  selectedIds: HeldItemId[]
  onChange: (ids: HeldItemId[]) => void
  onAdd: (id: number) => void
  onFormTriggerConfirm: (battlePokemonId: BattlePokemonId) => void
  selectableIds: ReadonlySet<BattlePokemonId>
  side?: "attacker" | "defender"
  lockedId?: HeldItemId | null
}

export function HeldItemTrack({
  catalog,
  poolIds,
  selectedIds,
  onChange,
  onAdd,
  onFormTriggerConfirm,
  selectableIds,
  side = "attacker",
  lockedId = null,
}: HeldItemTrackProps) {
  const intl = useIntl()
  const locale = intl.locale as SupportedLocale
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pendingFormItemId, setPendingFormItemId] = useState<number | null>(null)

  const battlePokemonId = side === "attacker"
    ? catalog.matchup.attackerId
    : catalog.matchup.defenderId
  const holder = useMemo(() => {
    const pokemon = (GENERATED_POKEMON_LITE as Record<
      BattlePokemonId,
      { speciesId: number; evioliteEligible: boolean }
    >)[battlePokemonId]
    return {
      battlePokemonId,
      speciesId: pokemon?.speciesId ?? battlePokemonId,
      evioliteEligible: pokemon?.evioliteEligible ?? false,
      types: side === "attacker" ? catalog.attackerTypes : catalog.defenderTypes,
    }
  }, [battlePokemonId, catalog.attackerTypes, catalog.defenderTypes, side])

  const optionById = useMemo(() => {
    const options = side === "attacker" ? catalog.attackerItems : catalog.defenderItems
    return new Map(options.map((option) => [option.id, option]))
  }, [catalog.attackerItems, catalog.defenderItems, side])

  const displayPoolIds = useMemo(() => {
    const ids = [...poolIds]
    for (const id of selectedIds) {
      if (!ids.includes(id)) ids.unshift(id)
    }
    return ids
  }, [poolIds, selectedIds])

  const pendingTargetId =
    pendingFormItemId === null ? null : formTriggerIdentityFor(pendingFormItemId)

  function toggle(id: HeldItemId) {
    if (lockedId !== null) return
    if (typeof id === "number" && isFormTriggerItem(id)) {
      setPendingFormItemId(id)
      return
    }
    const next = selectedIds.includes(id)
      ? selectedIds.filter((itemId) => itemId !== id)
      : [...selectedIds, id]
    onChange(next)
  }

  function confirmFormTrigger() {
    if (pendingTargetId == null) return
    onFormTriggerConfirm(pendingTargetId)
    setPendingFormItemId(null)
    setPickerOpen(false)
  }

  return (
    <>
      <TrackPanel
        expandable={false}
        icon={PackageOpen}
        label={<FormattedMessage id="track.item" />}
        side={side}
        summary={
          <TrackOptionGroup
            aria-label={intl.formatMessage({
              id: side === "attacker"
                ? "track.attackerItem"
                : "track.defenderItem",
            })}
          >
            {displayPoolIds.map((id) => {
              const option = optionById.get(id)
              const label = option?.label ?? itemAriaLabel(id, locale)
              const description = option?.summary ?? itemDescription(id, locale)
              const warning = heldItemWarning(id)
              const warningText = warning
                ? intl.formatMessage({ id: `track.item.warning.${warning}` })
                : null
              // Form-trigger affordances only on unlocked Identities; locks are ordinary selected chips.
              const formTrigger =
                lockedId === null && typeof id === "number" && isFormTriggerItem(id)
              const formHint = formTrigger
                ? intl.formatMessage({ id: "track.item.formTrigger.hint" })
                : null
              const ariaParts = [label, formHint, warningText].filter(Boolean)
              const detailParts = [label, description, formHint, warningText].filter(Boolean)

              return (
                <TrackOption
                  key={String(id)}
                  layout="icon"
                  pressed={!formTrigger && selectedIds.includes(id)}
                  disabled={lockedId !== null}
                  ariaLabel={ariaParts.join(", ")}
                  tooltip={(
                    <span className="whitespace-pre-line">{detailParts.join("\n")}</span>
                  )}
                  modifier={{ kind: "core" }}
                  className={cn(
                    "relative",
                    formTrigger && "border-dashed opacity-90",
                  )}
                  onToggle={() => toggle(id)}
                >
                  <HeldItemSpriteIcon id={id} className="size-full" />
                  {warning && (
                    <span
                      aria-hidden
                      className="absolute top-0.5 right-0.5 size-2 rounded-full border border-ink bg-destructive"
                    />
                  )}
                </TrackOption>
              )
            })}
            {lockedId === null && (
              <TrackOptionAdd
                layout="icon"
                ariaLabel={intl.formatMessage({ id: "track.addItem" })}
                onClick={() => setPickerOpen(true)}
              />
            )}
          </TrackOptionGroup>
        }
      />

      {lockedId === null && (
        <HeldItemPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          side={side}
          locale={locale}
          holder={holder}
          selectableIds={selectableIds}
          onSelect={onAdd}
          onFormTrigger={setPendingFormItemId}
        />
      )}

      <Dialog
        open={pendingFormItemId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingFormItemId(null)
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="track.item.formTrigger.title" />
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            <FormattedMessage
              id="track.item.formTrigger.body"
              values={{
                item: pendingFormItemId == null
                  ? ""
                  : itemAriaLabel(pendingFormItemId, locale),
              }}
            />
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingFormItemId(null)}
            >
              <FormattedMessage id="track.item.formTrigger.cancel" />
            </Button>
            <Button type="button" onClick={confirmFormTrigger}>
              <FormattedMessage id="track.item.formTrigger.confirm" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

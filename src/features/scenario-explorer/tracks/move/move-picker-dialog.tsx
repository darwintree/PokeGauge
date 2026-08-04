import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import type { CatalogMoveOption } from "@/lib/catalog"

import { PickerDialog } from "../../pickers/picker-dialog"

function moveMatches(option: CatalogMoveOption, query: string) {
  const q = query.trim().toLowerCase()
  return (
    !q ||
    option.label.toLowerCase().includes(q) ||
    option.moveName.toLowerCase().includes(q) ||
    String(option.id).includes(q)
  )
}

export function MovePickerDialog({
  open,
  onOpenChange,
  label,
  options,
  query,
  onQueryChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: string
  options: CatalogMoveOption[]
  query: string
  onQueryChange: (query: string) => void
  onSelect: (moveId: number) => void
}) {
  const intl = useIntl()
  const filteredOptions = options.filter((option) => moveMatches(option, query))

  return (
    <PickerDialog
      open={open}
      onOpenChange={onOpenChange}
      title={intl.formatMessage({ id: "track.addMove" })}
      searchLabel={intl.formatMessage({ id: "track.move.search" })}
      searchPlaceholder={intl.formatMessage({ id: "track.move.search" })}
      query={query}
      onQueryChange={onQueryChange}
      bodyClassName="p-3 pt-1"
      empty={
        filteredOptions.length === 0 ? (
          <FormattedMessage id="matchup.noMatches" />
        ) : undefined
      }
    >
      <div className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b bg-background/95 px-1 py-1.5 text-[10px] text-muted-foreground backdrop-blur-sm">
        <span />
        <span>{label}</span>
        <span className="tabular-nums">
          {intl.formatMessage({ id: "track.move.power" })} /{" "}
          {intl.formatMessage({ id: "track.move.accuracy" })}
        </span>
      </div>
      {filteredOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-1 py-2.5 text-left last:border-b-0 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring"
          onClick={() => onSelect(option.id)}
        >
          <TypeBadge type={option.type} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{option.label}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {option.moveName}
            </span>
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {option.power || "-"} / {option.accuracy ?? "-"}
          </span>
        </button>
      ))}
    </PickerDialog>
  )
}

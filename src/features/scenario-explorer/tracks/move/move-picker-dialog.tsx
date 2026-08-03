import { Search } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CatalogMoveOption } from "@/lib/catalog"

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 top-auto left-0 h-[min(44rem,calc(100svh-1rem))] max-w-none grid-rows-[auto_auto_minmax(0,1fr)] gap-0 overflow-hidden translate-x-0 translate-y-0 rounded-b-none p-0 sm:top-1/2 sm:left-1/2 sm:h-[min(44rem,calc(100svh-2rem))] sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
        <DialogHeader className="border-b px-4 py-3 pr-12">
          <DialogTitle>{intl.formatMessage({ id: "track.addMove" })}</DialogTitle>
        </DialogHeader>
        <div className="relative m-3 mb-2">
          <Label htmlFor="move-search" className="sr-only">
            {intl.formatMessage({ id: "track.move.search" })}
          </Label>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="move-search"
            value={query}
            placeholder={intl.formatMessage({ id: "track.move.search" })}
            className="pl-8"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
        <div className="min-h-0 overflow-y-auto p-3 pt-1">
          <div className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b bg-background/95 px-1 py-1.5 text-[10px] text-muted-foreground backdrop-blur-sm">
            <span />
            <span>{label}</span>
            <span className="tabular-nums">
              {intl.formatMessage({ id: "track.move.power" })} /{" "}
              {intl.formatMessage({ id: "track.move.accuracy" })}
            </span>
          </div>
          {filteredOptions.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <FormattedMessage id="matchup.noMatches" />
            </div>
          ) : (
            filteredOptions.map((option) => (
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
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

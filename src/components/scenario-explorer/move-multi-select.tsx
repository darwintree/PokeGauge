import { Plus, Search, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CatalogMoveOption } from "@/lib/catalog/types"
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import { cn } from "@/lib/utils"

type MoveMultiSelectProps = {
  label: string
  options: CatalogMoveOption[]
  visibleIds: number[]
  selectedIds: number[]
  onAdd: (id: number) => void
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

function moveMatches(option: CatalogMoveOption, query: string, typeFilter: PokemonType | null) {
  const q = query.trim().toLowerCase()
  const matchesQuery =
    !q ||
    option.label.toLowerCase().includes(q) ||
    option.moveName.toLowerCase().includes(q) ||
    String(option.id).includes(q)
  const matchesType = !typeFilter || option.type === typeFilter
  return matchesQuery && matchesType
}

function MoveMeta({ option }: { option: CatalogMoveOption }) {
  return (
    <span className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs tabular-nums">
      <span>{option.power}</span>
      <span>{option.accuracy ?? "-"}</span>
    </span>
  )
}

export function MoveMultiSelect({
  label,
  options,
  visibleIds,
  selectedIds,
  onAdd,
  onToggle,
  onRemove,
}: MoveMultiSelectProps) {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null)
  const visibleOptions = useMemo(
    () => visibleIds.map((id) => options.find((o) => o.id === id)).filter((o) => o !== undefined),
    [options, visibleIds],
  )
  const filteredOptions = useMemo(
    () => options.filter((option) => moveMatches(option, query, typeFilter)),
    [options, query, typeFilter],
  )

  function add(id: number) {
    onAdd(id)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-muted-foreground text-xs">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7"
          onClick={() => setOpen(true)}
        >
          <Plus />
          {intl.formatMessage({ id: "track.addMove" })}
        </Button>
      </div>

      <div className="rounded-lg border">
        {visibleOptions.map((option) => {
          const selected = selectedIds.includes(option.id)
          return (
            <div
              key={option.id}
              className="flex min-h-10 items-center gap-2 border-b px-2 last:border-b-0"
            >
              <button
                type="button"
                aria-pressed={selected}
                className={cn(
                  "hover:bg-muted flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm",
                  selected && "bg-muted",
                )}
                onClick={() => onToggle(option.id)}
              >
                <TypeBadge type={option.type} />
                <span className="truncate">{option.label}</span>
              </button>
              <MoveMeta option={option} />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${option.label}`}
                onClick={() => onRemove(option.id)}
              >
                <Trash2 />
              </Button>
            </div>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bottom-0 top-auto left-0 max-w-none translate-x-0 translate-y-0 rounded-b-none sm:top-1/2 sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={intl.formatMessage({ id: "track.addMove" })}
            />
            <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto">
              {POKEMON_TYPES.map((type) => {
                const pressed = typeFilter === type
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={pressed}
                    className={cn(
                      "rounded border border-input bg-background px-1.5 py-1 transition-colors hover:bg-muted",
                      pressed && "border-foreground bg-muted",
                    )}
                    onClick={() => setTypeFilter(pressed ? null : type)}
                  >
                    <TypeBadge type={type} />
                  </button>
                )
              })}
            </div>
            <div className="max-h-[55svh] overflow-y-auto rounded-lg border">
              {filteredOptions.map((option) => {
                const visible = visibleIds.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    className="hover:bg-muted flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0 disabled:opacity-50"
                    disabled={visible}
                    onClick={() => add(option.id)}
                  >
                    <TypeBadge type={option.type} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{option.label}</span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {option.moveName}
                      </span>
                    </span>
                    <MoveMeta option={option} />
                    {visible ? null : <Search className="text-muted-foreground size-3.5" />}
                  </button>
                )
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

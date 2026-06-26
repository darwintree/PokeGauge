import { useEffect, useId, useMemo, useRef, useState } from "react"

import type { SpeciesOption } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

type SpeciesSelectProps = {
  label: string
  options: SpeciesOption[]
  value: string
  onChange: (id: string) => void
}

export function SpeciesSelect({ label, options, value, onChange }: SpeciesSelectProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const selected = options.find((o) => o.id === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.species.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q),
    )
  }, [options, query])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  const pick = (id: string) => {
    onChange(id)
    setOpen(false)
    setQuery("")
  }

  return (
    <div ref={rootRef} className="relative space-y-1">
      <div className="text-muted-foreground text-xs font-medium">{label}</div>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => {
          setOpen((v) => !v)
          requestAnimationFrame(() => inputRef.current?.focus())
        }}
        className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted/40"
      >
        <span>{selected?.label ?? "选择宝可梦"}</span>
        <span className="text-muted-foreground text-xs">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border bg-popover p-2 shadow-md">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索…"
            className="mb-2 w-full rounded-md border bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          <ul id={listId} role="listbox" className="max-h-48 space-y-0.5 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="text-muted-foreground px-2 py-1.5 text-xs">无匹配</li>
            ) : (
              filtered.map((option) => (
                <li key={option.id} role="option" aria-selected={option.id === value}>
                  <button
                    type="button"
                    onClick={() => pick(option.id)}
                    className={cn(
                      "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted/60",
                      option.id === value && "bg-muted font-medium",
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

type MatchupSelectorProps = {
  attackerId: string
  defenderId: string
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
  onAttackerChange: (id: string) => void
  onDefenderChange: (id: string) => void
}

export function MatchupSelector({
  attackerId,
  defenderId,
  attackers,
  defenders,
  onAttackerChange,
  onDefenderChange,
}: MatchupSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-muted-foreground text-xs font-medium">对战</div>
      <div className="grid gap-2">
        <SpeciesSelect
          label="进攻方"
          options={attackers}
          value={attackerId}
          onChange={onAttackerChange}
        />
        <div className="text-muted-foreground flex justify-center text-xs">↓</div>
        <SpeciesSelect
          label="防守方"
          options={defenders}
          value={defenderId}
          onChange={onDefenderChange}
        />
      </div>
      <p className="text-muted-foreground text-[10px]">
        Champions · VGC 双打 · Level 50
      </p>
    </div>
  )
}

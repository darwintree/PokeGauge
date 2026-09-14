import type { JSX } from "react"

import { TypeBadgeList } from "@/components/pokemon/type-badge"
import { pokemonSpriteUrl } from "@/lib/assets"
import type { BattlePokemonOption } from "@/lib/catalog"
import { cn } from "@/lib/utils"

type BattlePokemonPickerItemProps = {
  option: BattlePokemonOption
  current: boolean
  shortLabel?: string
  onSelect: () => void
  compact?: boolean
}

export function BattlePokemonPickerItem({
  option,
  current,
  shortLabel,
  onSelect,
  compact = false,
}: BattlePokemonPickerItemProps): JSX.Element {
  return (
    <button
      type="button"
      aria-current={current ? "true" : undefined}
      className={cn(
        "hover:bg-token-bg/60 aria-current:bg-signal-yellow/55 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact
          ? "w-24 shrink-0 rounded-[9px] border border-card-border p-2"
          : "flex w-full items-center gap-3 border-b px-3 py-2",
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
      {!compact && (
        <span className="ml-auto"><TypeBadgeList types={option.types} /></span>
      )}
    </button>
  )
}

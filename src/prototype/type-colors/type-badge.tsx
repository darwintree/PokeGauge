/** PROTOTYPE — read-only type badges (identification only) */

import type { PokemonType } from "./pokemon-types"
import { TYPE_COLORS, TYPE_LABEL_ZH, typeTextColor } from "./pokemon-types"

type TypeBadgeProps = {
  type: PokemonType
  size?: "xs" | "sm"
}

export function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const bg = TYPE_COLORS[type]
  const fg = typeTextColor(type)
  return (
    <span
      className={
        size === "xs"
          ? "inline-flex items-center rounded px-1 py-px text-[10px] font-medium leading-none"
          : "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-none"
      }
      style={{ backgroundColor: bg, color: fg }}
    >
      {TYPE_LABEL_ZH[type]}
    </span>
  )
}

export function TypeBadgeRow({ types }: { types: PokemonType[] }) {
  if (types.length === 0) return null
  return (
    <span className="inline-flex flex-wrap gap-1">
      {types.map((type) => (
        <TypeBadge key={type} type={type} size="xs" />
      ))}
    </span>
  )
}

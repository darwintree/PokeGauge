import {
  TYPE_LABEL_ZH,
  type PokemonType,
  typeCssVar,
  typeTextColor,
} from "@/lib/pokemon/types"

type TypeBadgeProps = {
  type: PokemonType
}

type TypeBadgeRowProps = {
  types: PokemonType[]
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded px-1 py-px text-[10px] font-medium leading-none"
      style={{
        backgroundColor: typeCssVar(type),
        color: typeTextColor(type),
      }}
    >
      {TYPE_LABEL_ZH[type]}
    </span>
  )
}

export function TypeBadgeRow({ types }: TypeBadgeRowProps) {
  if (types.length === 0) return null
  return (
    <span className="inline-flex flex-wrap justify-end gap-0.5">
      {types.map((type) => (
        <TypeBadge key={type} type={type} />
      ))}
    </span>
  )
}

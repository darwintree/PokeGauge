import { useIntl } from "react-intl"

import {
  type PokemonType,
  typeCssVar,
  typeForegroundCssVar,
} from "@/lib/pokemon/types"

type TypeBadgeProps = {
  type: PokemonType
}

type TypeBadgeRowProps = {
  types: PokemonType[]
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const intl = useIntl()
  return (
    <span
      className="inline-flex items-center rounded-[5px] border border-ink px-1 py-px text-[9px] font-extrabold leading-[14px]"
      style={{
        backgroundColor: typeCssVar(type),
        color: typeForegroundCssVar(type),
      }}
    >
      {intl.formatMessage({ id: `type.${type}` })}
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

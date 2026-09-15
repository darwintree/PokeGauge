import type { JSX } from "react"
import { useIntl } from "react-intl"

import bugIcon from "@/assets/type-icons/bug.png"
import darkIcon from "@/assets/type-icons/dark.png"
import dragonIcon from "@/assets/type-icons/dragon.png"
import electricIcon from "@/assets/type-icons/electric.png"
import fairyIcon from "@/assets/type-icons/fairy.png"
import fightingIcon from "@/assets/type-icons/fighting.png"
import fireIcon from "@/assets/type-icons/fire.png"
import flyingIcon from "@/assets/type-icons/flying.png"
import ghostIcon from "@/assets/type-icons/ghost.png"
import grassIcon from "@/assets/type-icons/grass.png"
import groundIcon from "@/assets/type-icons/ground.png"
import iceIcon from "@/assets/type-icons/ice.png"
import normalIcon from "@/assets/type-icons/normal.png"
import poisonIcon from "@/assets/type-icons/poison.png"
import psychicIcon from "@/assets/type-icons/psychic.png"
import rockIcon from "@/assets/type-icons/rock.png"
import steelIcon from "@/assets/type-icons/steel.png"
import waterIcon from "@/assets/type-icons/water.png"
import type { PokemonType } from "@/lib/pokemon"
import { cn } from "@/lib/utils"

const typeIcons: Record<PokemonType, string> = {
  normal: normalIcon,
  fighting: fightingIcon,
  flying: flyingIcon,
  poison: poisonIcon,
  ground: groundIcon,
  rock: rockIcon,
  bug: bugIcon,
  ghost: ghostIcon,
  steel: steelIcon,
  fire: fireIcon,
  water: waterIcon,
  grass: grassIcon,
  electric: electricIcon,
  psychic: psychicIcon,
  ice: iceIcon,
  dragon: dragonIcon,
  dark: darkIcon,
  fairy: fairyIcon,
}

type TypeBadgeProps = {
  type: PokemonType
  variant?: "text" | "icon"
  className?: string
}

type TypeBadgeListProps = {
  types: PokemonType[]
}

export function TypeBadge({ type, variant = "icon", className }: TypeBadgeProps): JSX.Element {
  const intl = useIntl()
  const name = intl.formatMessage({ id: `type.${type}` })

  if (variant === "text") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-[5px] border border-ink px-1 py-px text-[9px] font-extrabold leading-[14px]",
          className,
        )}
        style={{
          backgroundColor: `var(--pokemon-type-${type})`,
          color: `var(--pokemon-type-${type}-foreground)`,
        }}
      >
        {name}
      </span>
    )
  }

  return (
    <img
      src={typeIcons[type]}
      alt={name}
      title={name}
      width={20}
      height={20}
      className={cn("inline-block size-5 shrink-0 rounded-[3px]", className)}
    />
  )
}

export function TypeBadgeList({ types }: TypeBadgeListProps): JSX.Element | null {
  if (types.length === 0) return null
  return (
    <span className="inline-flex flex-wrap justify-end gap-0.5">
      {types.map((type) => (
        <TypeBadge key={type} type={type} />
      ))}
    </span>
  )
}

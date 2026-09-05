import { CircleSlash } from "lucide-react"

import electricIcon from "@/assets/terrain-icons/electric.svg"
import grassIcon from "@/assets/terrain-icons/grassy.svg"
import psychicIcon from "@/assets/terrain-icons/psychic.svg"
import fairyIcon from "@/assets/terrain-icons/misty.svg"
import sunIcon from "@/assets/weather-icons/sun.svg"
import rainIcon from "@/assets/weather-icons/rain.svg"
import sandIcon from "@/assets/weather-icons/sand.svg"
import snowIcon from "@/assets/weather-icons/snow.svg"

import harshSunshineIcon from "@/assets/weather-icons/harsh-sunshine.svg"
import heavyRainIcon from "@/assets/weather-icons/heavy-rain.svg"
import strongWindsIcon from "@/assets/weather-icons/strong-winds.svg"

const CONDITION_ICONS = {
  electric: electricIcon,
  grassy: grassIcon,
  psychic: psychicIcon,
  misty: fairyIcon,
  sun: sunIcon,
  rain: rainIcon,
  sand: sandIcon,
  snow: snowIcon,
  "harsh-sunshine": harshSunshineIcon,
  "heavy-rain": heavyRainIcon,
  "strong-winds": strongWindsIcon,
} as const

export function FieldConditionIcon({ condition }: { condition: keyof typeof CONDITION_ICONS | "none" }) {
  if (condition === "none") {
    return <CircleSlash aria-hidden className="size-6 text-muted-foreground" strokeWidth={1.75} />
  }

  return (
    <img
      src={CONDITION_ICONS[condition]}
      alt=""
      width={28}
      height={28}
      className="size-7 shrink-0 object-contain"
    />
  )
}

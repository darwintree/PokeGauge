import type { MoveCategory } from "@/lib/catalog"

import { NEUTRAL_MODIFIER } from "./damage-kernel"

export const SCREENS = ["none", "reflect", "light-screen"] as const

export type Screen = (typeof SCREENS)[number]

type CompiledScreenEffect = {
  modifier: number
  state: "effective" | "inactive" | "neutral"
}

export function compileScreenEffect(
  screen: Screen,
  category: MoveCategory | undefined,
  criticalOnly: boolean,
  breaksScreensBeforeDamage: boolean,
): CompiledScreenEffect {
  if (screen === "none") {
    return { modifier: NEUTRAL_MODIFIER, state: "neutral" }
  }

  const matchesCategory =
    (screen === "reflect" && category === "physical") ||
    (screen === "light-screen" && category === "special")
  const effective = matchesCategory && !criticalOnly && !breaksScreensBeforeDamage
  return {
    modifier: effective ? 2732 : NEUTRAL_MODIFIER,
    state: effective ? "effective" : "inactive",
  }
}

import type { MoveCategory } from "@/lib/catalog"

import { NEUTRAL_MODIFIER } from "./damage-input"

export const SCREENS = ["none", "walls"] as const

export type Screen = (typeof SCREENS)[number]

export type AppliedScreen = "reflect" | "light-screen"

type CompiledScreenEffect = {
  modifier: number
  state: "active" | "inactive" | "neutral"
  applied: AppliedScreen | null
}

export function resolveAppliedScreen(
  screen: Screen,
  category: MoveCategory | undefined,
): AppliedScreen | null {
  if (screen !== "walls") return null
  if (category === "physical") return "reflect"
  if (category === "special") return "light-screen"
  return null
}

export function compileScreenEffect(
  screen: Screen,
  category: MoveCategory | undefined,
  criticalOnly: boolean,
  breaksScreensBeforeDamage: boolean,
): CompiledScreenEffect {
  const applied = resolveAppliedScreen(screen, category)
  if (!applied) {
    return { modifier: NEUTRAL_MODIFIER, state: "neutral", applied: null }
  }

  const active = !criticalOnly && !breaksScreensBeforeDamage
  return {
    modifier: active ? 2732 : NEUTRAL_MODIFIER,
    state: active ? "active" : "inactive",
    applied,
  }
}

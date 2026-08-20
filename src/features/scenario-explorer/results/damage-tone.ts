export type DamageTone = "safe" | "cool" | "warm" | "lethal" | "guaranteed"

/**
 * Discrete 16-roll box. Crit whiskers are ignored.
 * Order by severity: safe (green) < cool (light yellow) < warm (orange) < lethal (red) < guaranteed (dark red).
 */
export function damageToneOf(minPercent: number, maxPercent: number): DamageTone {
  if (minPercent >= 100) return "guaranteed"
  if (maxPercent >= 100) return "lethal"
  if (minPercent >= 50) return "warm"
  if (maxPercent >= 43) return "cool"
  return "safe"
}

export const DAMAGE_TONE_CLASS: Record<DamageTone, string> = {
  safe: "damage-tone--safe",
  cool: "damage-tone--cool",
  warm: "damage-tone--warm",
  lethal: "damage-tone--lethal",
  guaranteed: "damage-tone--guaranteed",
}

export const DAMAGE_TONE_MARKER_CLASS: Record<DamageTone, string> = {
  safe: "damage-tone-marker--safe",
  cool: "damage-tone-marker--cool",
  warm: "damage-tone-marker--warm",
  lethal: "damage-tone-marker--lethal",
  guaranteed: "damage-tone-marker--guaranteed",
}

export const DAMAGE_TONE_END: Record<DamageTone, string> = {
  safe: "var(--damage-safe-end)",
  cool: "var(--damage-cool-end)",
  warm: "var(--damage-warm-end)",
  lethal: "var(--damage-lethal-end)",
  guaranteed: "var(--damage-guaranteed-end)",
}

export const DAMAGE_TONE_START: Record<DamageTone, string> = {
  safe: "var(--damage-safe-start)",
  cool: "var(--damage-cool-start)",
  warm: "var(--damage-warm-start)",
  lethal: "var(--damage-lethal-start)",
  guaranteed: "var(--damage-guaranteed-start)",
}

export const DAMAGE_TONES: DamageTone[] = ["safe", "cool", "warm", "lethal", "guaranteed"]

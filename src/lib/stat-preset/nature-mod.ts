import { defenseStatKey, offenseStatKey } from "@/lib/stat-calculation"
import type { MoveCategory } from "@/lib/catalog"

/** Nature boost/lower for stat modifier display (∅ / + / −). */
const NATURE_BOOST: Record<string, string> = {
  Adamant: "atk",
  Bold: "def",
  Brave: "atk",
  Calm: "spd",
  Careful: "spd",
  Gentle: "spd",
  Hasty: "spe",
  Impish: "def",
  Jolly: "spe",
  Lax: "def",
  Lonely: "atk",
  Mild: "spa",
  Modest: "spa",
  Naive: "spe",
  Naughty: "atk",
  Quiet: "spa",
  Rash: "spa",
  Relaxed: "def",
  Sassy: "spd",
  Timid: "spe",
}

const NATURE_LOWER: Record<string, string> = {
  Adamant: "spa",
  Bold: "atk",
  Brave: "spe",
  Calm: "atk",
  Careful: "spa",
  Gentle: "def",
  Hasty: "def",
  Impish: "spa",
  Jolly: "spa",
  Lax: "spd",
  Lonely: "def",
  Mild: "def",
  Modest: "atk",
  Naive: "spd",
  Naughty: "spd",
  Quiet: "spe",
  Rash: "spd",
  Relaxed: "spe",
  Sassy: "spe",
  Timid: "atk",
}

export type NatureMod = "+" | "-" | ""

export function natureModForStat(nature: string, statKey: string): NatureMod {
  if (NATURE_BOOST[nature] === statKey) return "+"
  if (NATURE_LOWER[nature] === statKey) return "-"
  return ""
}

export function offenseStatMod(nature: string, category: MoveCategory): NatureMod {
  return natureModForStat(nature, offenseStatKey(category))
}

export function defenseStatMod(nature: string, category: MoveCategory): NatureMod {
  return natureModForStat(nature, defenseStatKey(category))
}

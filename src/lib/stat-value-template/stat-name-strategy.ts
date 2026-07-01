export type StatNameStrategy = "habcds" | "english" | "chinese"

export type StatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe"

const STORAGE_KEY = "pokemon-damage-calc:stat-name-display-strategy"

const STAT_NAMES: Record<StatNameStrategy, Record<StatKey, string>> = {
  habcds: { hp: "H", atk: "A", def: "B", spa: "C", spd: "D", spe: "S" },
  english: {
    hp: "HP",
    atk: "Atk",
    def: "Def",
    spa: "Sp.A",
    spd: "Sp.D",
    spe: "Spd",
  },
  chinese: {
    hp: "HP",
    atk: "攻击",
    def: "防御",
    spa: "特攻",
    spd: "特防",
    spe: "速度",
  },
}

export const STAT_NAME_STRATEGY_OPTIONS: {
  value: StatNameStrategy
  label: string
}[] = [
  { value: "habcds", label: "HABCDS" },
  { value: "english", label: "HP, Atk, Def…" },
  { value: "chinese", label: "HP，攻击，防御…" },
]

export function statDisplayName(strategy: StatNameStrategy, statKey: StatKey): string {
  return STAT_NAMES[strategy][statKey]
}

export function loadStatNameStrategy(): StatNameStrategy {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === "english" || raw === "chinese" || raw === "habcds") return raw
  } catch {
    /* ignore */
  }
  return "habcds"
}

export function saveStatNameStrategy(strategy: StatNameStrategy): void {
  localStorage.setItem(STORAGE_KEY, strategy)
}

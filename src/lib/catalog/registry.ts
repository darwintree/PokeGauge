import type {
  CatalogMoveOption,
  MatchupCatalog,
  MoveCategory,
  SpeciesOption,
} from "./types"

type MovePickEntry = {
  id: string
  label: string
  summary: string
  moveName: string
}

type AttackerEntry = {
  id: string
  label: string
  species: string
  moveCategory: MoveCategory
  moves: MovePickEntry[]
}

type DefenderEntry = {
  id: string
  label: string
  species: string
}

/** Hardcoded VGC doubles usage-ranked move picks — Champions context, v1 */
const ATTACKERS: AttackerEntry[] = [
  {
    id: "garchomp",
    label: "烈咬陆鲨",
    species: "Garchomp",
    moveCategory: "physical",
    moves: [
      { id: "earthquake", label: "地震", summary: "#1 · 地面", moveName: "Earthquake" },
      { id: "dragon-claw", label: "龙爪", summary: "#2 · 龙", moveName: "Dragon Claw" },
      { id: "stone-edge", label: "尖石攻击", summary: "#3 · 岩石", moveName: "Stone Edge" },
    ],
  },
  {
    id: "landorus-therian",
    label: "土地云-灵兽",
    species: "Landorus-Therian",
    moveCategory: "physical",
    moves: [
      { id: "earthquake", label: "地震", summary: "#1 · 地面", moveName: "Earthquake" },
      { id: "rock-slide", label: "岩崩", summary: "#2 · 岩石", moveName: "Rock Slide" },
      { id: "stomping-tantrum", label: "跺脚", summary: "#3 · 地面", moveName: "Stomping Tantrum" },
    ],
  },
  {
    id: "flutter-mane",
    label: "振翼发",
    species: "Flutter Mane",
    moveCategory: "special",
    moves: [
      { id: "moonblast", label: "月亮之力", summary: "#1 · 妖精", moveName: "Moonblast" },
      { id: "shadow-ball", label: "暗影球", summary: "#2 · 幽灵", moveName: "Shadow Ball" },
      { id: "dazzling-gleam", label: "魔法闪耀", summary: "#3 · 妖精", moveName: "Dazzling Gleam" },
    ],
  },
]

const DEFENDERS: DefenderEntry[] = [
  { id: "incineroar", label: "咆哮虎", species: "Incineroar" },
  { id: "amoonguss", label: "败露球菇", species: "Amoonguss" },
  { id: "rillaboom", label: "轰擂金刚猩", species: "Rillaboom" },
]

const DEFAULT_MATCHUP = {
  attackerId: "garchomp",
  defenderId: "incineroar",
} as const

function statLabels(category: MoveCategory) {
  return category === "physical"
    ? { offenseStatLabel: "物攻" as const, defenseStatLabel: "物防" as const }
    : { offenseStatLabel: "特攻" as const, defenseStatLabel: "特防" as const }
}

function buildAttackerStats(category: MoveCategory) {
  const stat = category === "physical" ? "物攻" : "特攻"
  return [
    { id: "neutral-zero", label: "无修正无努力", summary: `无修正 · 0 ${stat}` },
    { id: "neutral-max", label: "无修正满努力", summary: `无修正 · 252 ${stat}` },
    { id: "standard", label: "标准输出", summary: category === "physical" ? "爽朗 · 252 物攻" : "胆小 · 252 特攻" },
    { id: "extreme", label: "极限进攻", summary: category === "physical" ? "固执 · 252 物攻" : "内敛 · 252 特攻" },
  ]
}

function buildDefenderBulks(category: MoveCategory) {
  const stat = category === "physical" ? "物防" : "特防"
  return [
    {
      id: "standard-bulk",
      label: "标准坦度",
      summary: category === "physical" ? "慎重 · 252 HP / 252 物防" : "慎重 · 252 HP / 252 特防",
    },
    {
      id: "min-bulk",
      label: "极限坦度",
      summary: `无修正 · 0 HP / 0 ${stat}`,
    },
  ]
}

function buildAttackerItems(category: MoveCategory) {
  const choice =
    category === "physical"
      ? { id: "choice-band", label: "讲究头带", summary: "1.5× 物攻" }
      : { id: "choice-specs", label: "讲究眼镜", summary: "1.5× 特攻" }

  return [
    { id: "none", label: "无道具", summary: "—" },
    { id: "life-orb", label: "生命宝珠", summary: "1.3× 伤害" },
    choice,
  ]
}

function findAttacker(id: string): AttackerEntry | undefined {
  return ATTACKERS.find((a) => a.id === id)
}

function findDefender(id: string): DefenderEntry | undefined {
  return DEFENDERS.find((d) => d.id === id)
}

export function listAttackers(): SpeciesOption[] {
  return ATTACKERS.map(({ id, label, species }) => ({ id, label, species }))
}

export function listDefenders(): SpeciesOption[] {
  return DEFENDERS.map(({ id, label, species }) => ({ id, label, species }))
}

export function getDefaultMatchupIds() {
  return { ...DEFAULT_MATCHUP }
}

export function getCatalog(attackerId: string, defenderId: string): MatchupCatalog {
  const attacker = findAttacker(attackerId) ?? findAttacker(DEFAULT_MATCHUP.attackerId)!
  const defender = findDefender(defenderId) ?? findDefender(DEFAULT_MATCHUP.defenderId)!

  const moves: CatalogMoveOption[] = attacker.moves.map((m) => ({
    id: m.id,
    label: m.label,
    summary: m.summary,
    moveName: m.moveName,
  }))

  const labels = statLabels(attacker.moveCategory)

  return {
    matchup: {
      attackerId: attacker.id,
      defenderId: defender.id,
      attackerLabel: attacker.label,
      defenderLabel: defender.label,
      attackerSpecies: attacker.species,
      defenderSpecies: defender.species,
    },
    moveCategory: attacker.moveCategory,
    ...labels,
    moves,
    attackerStats: buildAttackerStats(attacker.moveCategory),
    attackerItems: buildAttackerItems(attacker.moveCategory),
    defenderBulks: buildDefenderBulks(attacker.moveCategory),
    /** Default selected set — all top-N moves pre-selected */
    defaultMoveIds: moves.map((m) => m.id),
    defaultAttackerStatIds: ["standard"],
    defaultAttackerItemIds: ["none", "life-orb"],
    defaultDefenderIds: ["standard-bulk"],
  }
}

/** Backward-compatible fixture export for tests */
export const GARCHOMP_INCINEROAR_CATALOG = getCatalog("garchomp", "incineroar")

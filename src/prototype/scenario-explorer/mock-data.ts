/** PROTOTYPE — configuration axes + calc-driven damage results */

import {
  ATTACKER_ITEM_NAMES,
  ATTACKER_STAT_SETUPS,
  computeDamage,
  computeDamageForStatRange,
  getAttackStatBounds,
  DEFENDER_SETUPS,
  MOVE_NAMES,
  type StatRange,
} from "./damage-calc"
import { RANGE_STAT_ID } from "./stat-range-axis"

export type ConfigOption = {
  id: string
  label: string
  summary: string
}

export type StatSelectMode = "preset" | "range"

export type DamageStats = {
  minPercent: number
  maxPercent: number
  minDamage: number
  maxDamage: number
  avgPercent: number
  critMinPercent: number
  critMaxPercent: number
  critMinDamage: number
  critMaxDamage: number
  ohkoChance?: number
}

export type AggregatedResult = DamageStats & {
  moveId: string
  attackerStatId: string
  attackerItemId: string
  defenderId: string
  statRange?: StatRange
}

export const MOCK_MATCHUP = {
  attacker: "烈咬陆鲨",
  defender: "咆哮虎",
  attackerSpecies: "Garchomp",
  defenderSpecies: "Incineroar",
}

export const ATTACKER_STAT_BOUNDS = getAttackStatBounds(MOCK_MATCHUP.attackerSpecies)

export function defaultStatRange(): StatRange {
  const neutralMax =
    ATTACKER_STAT_BOUNDS.snapPoints.find((s) => s.label === "无修正满努力")?.value ??
    ATTACKER_STAT_BOUNDS.min
  return { min: neutralMax, max: ATTACKER_STAT_BOUNDS.max }
}

export const MOVES: ConfigOption[] = [
  { id: "earthquake", label: "地震", summary: "#1 · 地面" },
  { id: "dragon-claw", label: "龙爪", summary: "#2 · 龙" },
  { id: "stone-edge", label: "尖石攻击", summary: "#3 · 岩石" },
]

export const ATTACKER_STAT_CONFIGS: ConfigOption[] = [
  { id: "neutral-zero", label: "无修正无努力", summary: "无修正 · 0 物攻" },
  { id: "neutral-max", label: "无修正满努力", summary: "无修正 · 252 物攻" },
  { id: "standard", label: "标准输出", summary: "爽朗 · 252 物攻" },
  { id: "extreme", label: "极限进攻", summary: "固执 · 252 物攻" },
]

export const RANGE_STAT_CONFIG: ConfigOption = {
  id: RANGE_STAT_ID,
  label: "数轴选段",
  summary: "物攻区间",
}

export const ATTACKER_ITEM_CONFIGS: ConfigOption[] = [
  { id: "none", label: "无道具", summary: "—" },
  { id: "life-orb", label: "生命宝珠", summary: "1.3× 伤害" },
  { id: "choice-band", label: "讲究头带", summary: "1.5× 物攻" },
]

export const DEFENDER_CONFIGS: ConfigOption[] = [
  { id: "standard-bulk", label: "标准坦度", summary: "慎重 · 252 HP / 252 物防" },
  { id: "min-bulk", label: "极限坦度", summary: "无修正 · 0 HP / 0 物防" },
]

function buildPresetResults(): AggregatedResult[] {
  const out: AggregatedResult[] = []
  const { attackerSpecies, defenderSpecies } = MOCK_MATCHUP

  for (const move of MOVES) {
    const moveName = MOVE_NAMES[move.id]
    for (const stat of ATTACKER_STAT_CONFIGS) {
      for (const item of ATTACKER_ITEM_CONFIGS) {
        for (const defender of DEFENDER_CONFIGS) {
          const statSetup = ATTACKER_STAT_SETUPS[stat.id]
          const defSetup = DEFENDER_SETUPS[defender.id]
          const itemName = ATTACKER_ITEM_NAMES[item.id]
          if (!statSetup || !defSetup) continue
          if (itemName === undefined && item.id !== "none") continue

          const computed = computeDamage(
            attackerSpecies,
            defenderSpecies,
            moveName,
            statSetup,
            itemName,
            defSetup,
          )

          out.push({
            moveId: move.id,
            attackerStatId: stat.id,
            attackerItemId: item.id,
            defenderId: defender.id,
            ...pickStats(computed),
          })
        }
      }
    }
  }

  return out
}

function pickStats(computed: ReturnType<typeof computeDamage>): DamageStats {
  return {
    minPercent: computed.minPercent,
    maxPercent: computed.maxPercent,
    minDamage: computed.minDamage,
    maxDamage: computed.maxDamage,
    avgPercent: computed.avgPercent,
    critMinPercent: computed.critMinPercent,
    critMaxPercent: computed.critMaxPercent,
    critMinDamage: computed.critMinDamage,
    critMaxDamage: computed.critMaxDamage,
    ohkoChance: computed.ohkoChance,
  }
}

export function buildRangeResults(statRange: StatRange): AggregatedResult[] {
  const out: AggregatedResult[] = []
  const { attackerSpecies, defenderSpecies } = MOCK_MATCHUP

  for (const move of MOVES) {
    const moveName = MOVE_NAMES[move.id]
    for (const item of ATTACKER_ITEM_CONFIGS) {
      for (const defender of DEFENDER_CONFIGS) {
        const defSetup = DEFENDER_SETUPS[defender.id]
        const itemName = ATTACKER_ITEM_NAMES[item.id]
        if (!defSetup) continue
        if (itemName === undefined && item.id !== "none") continue

        const computed = computeDamageForStatRange(
          attackerSpecies,
          defenderSpecies,
          moveName,
          statRange,
          itemName,
          defSetup,
        )

        out.push({
          moveId: move.id,
          attackerStatId: RANGE_STAT_ID,
          attackerItemId: item.id,
          defenderId: defender.id,
          statRange: { ...statRange },
          ...pickStats(computed),
        })
      }
    }
  }

  return out
}

export const PRESET_RESULTS = buildPresetResults()

export const DEFAULT_MOVE_IDS = ["earthquake"]
export const DEFAULT_ATTACKER_STAT_IDS = ["standard"]
export const DEFAULT_ATTACKER_ITEM_IDS = ["none", "life-orb"]
export const DEFAULT_DEFENDER_IDS = ["standard-bulk"]
export const DEFAULT_STAT_SELECT_MODE: StatSelectMode = "preset"

const configOrder = (options: ConfigOption[]) =>
  Object.fromEntries(options.map((o, i) => [o.id, i]))

const MOVE_ORDER = configOrder(MOVES)
const ATTACKER_STAT_ORDER = configOrder(ATTACKER_STAT_CONFIGS)
const ATTACKER_ITEM_ORDER = configOrder(ATTACKER_ITEM_CONFIGS)
const DEFENDER_ORDER = configOrder(DEFENDER_CONFIGS)

export function filterResults(
  moveIds: string[],
  statMode: StatSelectMode,
  attackerStatIds: string[],
  attackerItemIds: string[],
  defenderIds: string[],
  statRange: StatRange,
): AggregatedResult[] {
  const moveSet = new Set(moveIds)
  const itemSet = new Set(attackerItemIds)
  const defSet = new Set(defenderIds)

  let pool: AggregatedResult[]

  if (statMode === "range") {
    pool = buildRangeResults(statRange).filter(
      (r) => moveSet.has(r.moveId) && itemSet.has(r.attackerItemId) && defSet.has(r.defenderId),
    )
  } else {
    const statSet = new Set(attackerStatIds)
    pool = PRESET_RESULTS.filter(
      (r) =>
        moveSet.has(r.moveId) &&
        statSet.has(r.attackerStatId) &&
        itemSet.has(r.attackerItemId) &&
        defSet.has(r.defenderId),
    )
  }

  return pool.sort((a, b) => {
    const byMove = MOVE_ORDER[a.moveId] - MOVE_ORDER[b.moveId]
    if (byMove !== 0) return byMove
    const statOrder = (id: string) =>
      id === RANGE_STAT_ID ? 1000 : (ATTACKER_STAT_ORDER[id] ?? 0)
    const byStat = statOrder(a.attackerStatId) - statOrder(b.attackerStatId)
    if (byStat !== 0) return byStat
    const byItem = ATTACKER_ITEM_ORDER[a.attackerItemId] - ATTACKER_ITEM_ORDER[b.attackerItemId]
    if (byItem !== 0) return byItem
    return DEFENDER_ORDER[a.defenderId] - DEFENDER_ORDER[b.defenderId]
  })
}

export function configById(options: ConfigOption[], id: string) {
  return options.find((o) => o.id === id)
}

export function resultKey(r: AggregatedResult) {
  const rangeKey = r.statRange ? `${r.statRange.min}-${r.statRange.max}` : r.attackerStatId
  return `${r.moveId}:${rangeKey}:${r.attackerItemId}:${r.defenderId}`
}

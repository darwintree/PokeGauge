import type { MatchupCatalog } from "./types"

/** Full catalog for Garchomp → Incineroar fixture (Champions · VGC doubles) */
export const GARCHOMP_INCINEROAR_CATALOG: MatchupCatalog = {
  matchup: {
    attackerLabel: "烈咬陆鲨",
    defenderLabel: "咆哮虎",
    attackerSpecies: "Garchomp",
    defenderSpecies: "Incineroar",
  },
  moves: [
    { id: "earthquake", label: "地震", summary: "#1 · 地面" },
    { id: "dragon-claw", label: "龙爪", summary: "#2 · 龙" },
    { id: "stone-edge", label: "尖石攻击", summary: "#3 · 岩石" },
  ],
  attackerStats: [
    { id: "neutral-zero", label: "无修正无努力", summary: "无修正 · 0 物攻" },
    { id: "neutral-max", label: "无修正满努力", summary: "无修正 · 252 物攻" },
    { id: "standard", label: "标准输出", summary: "爽朗 · 252 物攻" },
    { id: "extreme", label: "极限进攻", summary: "固执 · 252 物攻" },
  ],
  attackerItems: [
    { id: "none", label: "无道具", summary: "—" },
    { id: "life-orb", label: "生命宝珠", summary: "1.3× 伤害" },
    { id: "choice-band", label: "讲究头带", summary: "1.5× 物攻" },
  ],
  defenderBulks: [
    { id: "standard-bulk", label: "标准坦度", summary: "慎重 · 252 HP / 252 物防" },
    { id: "min-bulk", label: "极限坦度", summary: "无修正 · 0 HP / 0 物防" },
  ],
  /** Default selected set — multi-move default view */
  defaultMoveIds: ["earthquake", "dragon-claw", "stone-edge"],
  defaultAttackerStatIds: ["standard"],
  defaultAttackerItemIds: ["none", "life-orb"],
  defaultDefenderIds: ["standard-bulk"],
}

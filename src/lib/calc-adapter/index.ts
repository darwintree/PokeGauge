export {
  CALC_GEN,
  VGC_LEVEL,
  computeDamage,
  computeDamageForStatRange,
  defaultStatRange,
  getAttackStat,
  getAttackStatBounds,
  getOffenseStat,
  getOffenseStatBounds,
} from "./compute-damage"
export type {
  AttackStatBounds,
  ComputedDamage,
  DefenderSetup,
  StatRange,
  StatSetup,
} from "./types"

export {
  ATTACKER_ITEM_NAMES,
  ATTACKER_STAT_SETUPS,
  DEFENDER_SETUPS,
  getAttackerStatSetups,
  getDefenderSetups,
  offenseStatKey,
  defenseStatKey,
} from "./presets"

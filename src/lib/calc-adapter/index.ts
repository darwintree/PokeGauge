export {
  getDefenderDefBounds,
  getDefenderDefStat,
  getDefenderHp,
  getDefenderHpBounds,
  getOffenseStat,
  getOffenseStatBounds,
  nearestDefenderSetupForValues,
  nearestOffenseSetupForStat,
  snapToAchievableDefenseValues,
  snapToAchievableOffenseStat,
  warmDefenderSpreadCache,
} from "./stat-bounds"
export {
  defenderDefRangeFromPresets,
  defenderHpRangeFromPresets,
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
  defaultStatRange,
  offenseRangeFromPresets,
  clampStat,
  sameStatRange,
  snapToAnchors,
} from "./stat-range"
export { CALC_GEN, VGC_LEVEL } from "./calc-constants"
export {
  calculateDamageRolls,
  NEUTRAL_MODIFIER,
  typeEffectiveness,
} from "./damage-kernel"
export type {
  CompiledDamageInput,
  CompiledDamagePoint,
  DamageFormulaBranch,
  DamageKernelResult,
  DamageRollPoint,
} from "./damage-kernel"
export {
  calculationIdentity,
  compileScenario,
} from "./scenario-compiler"
export type {
  CalculableScenario,
  CompilerOutcome,
  KoInput,
  ProbabilityInput,
  RawScenario,
  RawScenarioPoint,
  ScenarioSource,
  ScenarioTrack,
  SourceState,
  UnavailableReason,
  UnavailableScenario,
} from "./scenario-compiler"
export {
  createMoveSnapshot,
  editMoveSnapshot,
  normalizeSnapshotAccuracy,
  normalizeSnapshotPower,
  reviewedMoveDefaults,
} from "@/lib/move-snapshot"
export type {
  CriticalStage,
  MoveSnapshot,
  MoveTemplateSnapshotDefaults,
} from "@/lib/move-snapshot"
export {
  defenseSetupForTemplate,
  defenderDefRangeFromTemplates,
  defenderHpRangeFromTemplates,
  defenderStatsForTemplate,
  envelopeRange,
  offenseRangeFromTemplates,
  offenseSetupForTemplate,
  offenseStatForTemplate,
} from "./template-range"
export type {
  AttackStatBounds,
  DefenderSetup,
  KoProbabilities,
  KoProbabilityRange,
  KoProbabilityValue,
  ProbabilityMode,
  StatAxisBounds,
  StatAxisSnapPoint,
  StatRange,
  StatSetup,
  StatStage,
} from "./types"
export { STAT_STAGES } from "./types"
export { WEATHERS } from "./weather"
export type { Weather } from "./weather"

export {
  ATTACKER_ITEM_NAMES,
  ATTACKER_STAT_SETUPS,
  DEFENDER_SETUPS,
  getAttackerStatSetups,
  getDefenderSetups,
  offenseStatKey,
  defenseStatKey,
} from "./presets"

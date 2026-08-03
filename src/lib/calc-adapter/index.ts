export {
  getDefenderDefBounds,
  getDefenderDefStat,
  getDefenderHp,
  getDefenderHpBounds,
  getOffenseStat,
  getOffenseStatBounds,
  warmDefenderSpreadCache,
} from "./stat-bounds"
export {
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
  defaultStatRange,
  clampStat,
  sameStatRange,
  snapToAnchors,
} from "./stat-range"
export { ADAPTABILITY_ABILITY_ID } from "./ability"
export { CALC_GEN, VGC_LEVEL } from "./calc-constants"
export {
  calculateDamageRolls,
  applyModifier,
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
  MoveMechanics,
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
  defenderDefRangeFromPresets,
  defenderHpRangeFromPresets,
  envelopeRange,
  offenseRangeFromPresets,
} from "./preset-range"
export type {
  AttackStatBounds,
  DefenderSetup,
  KOProbabilities,
  KOProbabilityRange,
  KOProbabilityValue,
  ProbabilityMode,
  StatAxisBounds,
  StatAxisSnapPoint,
  StatRange,
  StatSetup,
  StatStage,
} from "./types"
export { SCREENS } from "./screen"
export type { Screen } from "./screen"
export { STAT_STAGES } from "./types"
export { TERRAINS } from "./terrain"
export type { Terrain } from "./terrain"
export { WEATHERS } from "./weather"
export type { Weather } from "./weather"

export {
  ATTACKER_STAT_SETUPS,
  DEFENDER_SETUPS,
  getAttackerStatSetups,
  getDefenderSetups,
  offenseStatKey,
  defenseStatKey,
} from "./presets"

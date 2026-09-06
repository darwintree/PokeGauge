import { moveStatChange } from "./stat-change"
import type { PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"

export type CriticalStage = 0 | 1 | 2 | 3

type SnapshotDefaults = {
  alwaysHits: boolean
  criticalStage: CriticalStage
}

export type MoveAuditWarning = "attacker-stat-change"

const UNSUPPORTED_ATTACKER_STAT_MOVES = new Set([
  246, 276, 315, 318, 354, 434, 437, 466, 705, 800, 874, 905,
])

export function auditedMoveWarning(moveId: UpstreamResourceId): MoveAuditWarning | undefined {
  if (moveStatChange(moveId)) return undefined
  return UNSUPPORTED_ATTACKER_STAT_MOVES.has(moveId) ? "attacker-stat-change" : undefined
}

const REVIEWED_SNAPSHOT_DEFAULTS: Partial<
  Record<UpstreamResourceId, SnapshotDefaults>
> = {
  818: { alwaysHits: false, criticalStage: 3 },
  911: { alwaysHits: true, criticalStage: 0 },
  129: { alwaysHits: true, criticalStage: 0 },
  869: { alwaysHits: true, criticalStage: 0 },
  870: { alwaysHits: true, criticalStage: 3 },
}


/**
 * Moves whose base power @smogon/calc derives from battle state the product
 * already feeds (weight, speed, stat boosts, HP fraction). The value is the
 * display default power for the picker/snapshot; the calc engine computes the
 * actual power, so this value never reaches the damage formula.
 */
const CALC_DERIVED_POWER_MOVES: Partial<Record<UpstreamResourceId, number>> = {
  67: 50, // Low Kick
  284: 150, // Eruption
  323: 150, // Water Spout
  360: 0, // Gyro Ball
  378: 60, // Wring Out
  386: 60, // Punishment
  447: 60, // Grass Knot
  462: 60, // Crush Grip
  484: 0, // Heavy Slam
  486: 0, // Electro Ball
  500: 20, // Stored Power
  535: 60, // Heat Crash
}

const IDENTITY_MOVE_TYPES: Partial<
  Record<UpstreamResourceId, Partial<Record<BattlePokemonId, PokemonType>>>
> = {
  783: {
    877: "electric",
    10187: "dark",
  },
  873: {
    128: "normal",
    10250: "fighting",
    10251: "fire",
    10252: "water",
  },
  904: {
    1017: "grass",
    10273: "water",
    10274: "fire",
    10275: "rock",
  },
}

const UNSUPPORTED_MOVE_IDS = new Set<UpstreamResourceId>([
  237,
  473,
  492,
  540,
  548,
  722,
  723,
  743,
  776,
  801,
  877,
  894,
])

function isZMove(moveId: UpstreamResourceId): boolean {
  return (
    (moveId >= 622 && moveId <= 658) ||
    (moveId >= 695 && moveId <= 703) ||
    moveId === 719 ||
    (moveId >= 723 && moveId <= 728)
  )
}

function isMaxMove(moveId: UpstreamResourceId): boolean {
  return moveId >= 757 && moveId <= 774
}

export function isMoveExplicitlyUnsupported(moveId: UpstreamResourceId): boolean {
  return UNSUPPORTED_MOVE_IDS.has(moveId) || isZMove(moveId) || isMaxMove(moveId)
}

export function calcDerivedPowerDefault(
  moveId: UpstreamResourceId,
): number | undefined {
  return CALC_DERIVED_POWER_MOVES[moveId]
}

export function reviewedMoveSnapshotDefaults(
  moveId: UpstreamResourceId,
): SnapshotDefaults | undefined {
  return REVIEWED_SNAPSHOT_DEFAULTS[moveId]
}

export function resolveReviewedMoveType(
  moveId: UpstreamResourceId,
  attackerId: BattlePokemonId,
  fallback: PokemonType,
  attackerTypes: readonly PokemonType[] = [],
): PokemonType {
  if (moveId === 686) return attackerTypes[0] ?? fallback
  return IDENTITY_MOVE_TYPES[moveId]?.[attackerId] ?? fallback
}

export function moveBreaksScreensBeforeDamage(moveId: UpstreamResourceId): boolean {
  return moveId === 280 || moveId === 706 || moveId === 873
}

export function moveCanBecomeSpread(moveId: UpstreamResourceId): boolean {
  return moveId === 797
}

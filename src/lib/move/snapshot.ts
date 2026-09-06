import type { UpstreamResourceId } from "@/lib/resources"
import { moveHitProfile } from "./hit-profile"
import {
  isMoveExplicitlyUnsupported,
  moveCanBecomeSpread,
  reviewedMoveSnapshotDefaults,
  calcDerivedPowerDefault,
  type CriticalStage,
} from "./semantics"

export type { CriticalStage } from "./semantics"

export type MoveSnapshot = {
  id: string
  moveId: UpstreamResourceId
  power: number
  accuracy: number
  alwaysHits: boolean
  criticalStage: CriticalStage
  spreadEligible: boolean
  spread: boolean
}

export type MoveTemplateSnapshotDefaults = {
  id: UpstreamResourceId
  power: number
  accuracy: number | null
  isSpread: boolean
  alwaysHits?: boolean
  criticalStage?: CriticalStage
}

export function reviewedMoveDefaults(moveId: UpstreamResourceId) {
  return reviewedMoveSnapshotDefaults(moveId)
}

export function normalizeSnapshotPower(value: number): number {
  return Math.min(1000, Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0)))
}

export function normalizeSnapshotAccuracy(value: number): number {
  return Math.min(100, Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0)))
}

export function createMoveSnapshot(
  template: MoveTemplateSnapshotDefaults,
  id: string = crypto.randomUUID(),
): MoveSnapshot {
  if (isMoveExplicitlyUnsupported(template.id)) {
    throw new Error(`Unsupported Move snapshot template: ${template.id}`)
  }
  const power = moveHitProfile(template.id)?.powers[0] ?? normalizeSnapshotPower(template.power)
  if (power === 0 && calcDerivedPowerDefault(template.id) === undefined) {
    throw new Error(`Unreviewed zero-power Move snapshot template: ${template.id}`)
  }
  const reviewed = reviewedMoveDefaults(template.id)
  const alwaysHits = template.alwaysHits ?? reviewed?.alwaysHits ?? false
  const spreadEligible = template.isSpread || moveCanBecomeSpread(template.id)
  return {
    id,
    moveId: template.id,
    power,
    accuracy: alwaysHits ? 100 : normalizeSnapshotAccuracy(template.accuracy ?? 0),
    alwaysHits,
    criticalStage: template.criticalStage ?? reviewed?.criticalStage ?? 0,
    spreadEligible,
    spread: spreadEligible,
  }
}

export function editMoveSnapshot(
  snapshot: MoveSnapshot,
  patch: Partial<Pick<MoveSnapshot, "power" | "accuracy" | "criticalStage" | "spread">>,
): MoveSnapshot {
  return {
    ...snapshot,
    ...(patch.power === undefined || moveHitProfile(snapshot.moveId)
      ? {}
      : { power: normalizeSnapshotPower(patch.power) }),
    ...(patch.accuracy === undefined
      ? {}
      : {
          accuracy: normalizeSnapshotAccuracy(patch.accuracy),
          alwaysHits: false,
        }),
    ...(patch.criticalStage === undefined ? {} : { criticalStage: patch.criticalStage }),
    ...(patch.spread === undefined
      ? {}
      : { spread: snapshot.spreadEligible && patch.spread }),
  }
}

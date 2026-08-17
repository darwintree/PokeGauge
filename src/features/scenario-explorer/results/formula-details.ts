import { NEUTRAL_MODIFIER, type MechanicsPhase } from "@/lib/damage-calculation"

export function visibleFormulaPhases(
  phases: MechanicsPhase[],
  criticalOnly: boolean,
): MechanicsPhase[] {
  return phases.filter((phase) =>
    phase.modifier !== NEUTRAL_MODIFIER &&
    (phase.kind !== "critical" || criticalOnly)
  )
}

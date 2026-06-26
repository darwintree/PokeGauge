/** PROTOTYPE #5 — Sidebar refine layout (verdict) */

import { useScenarioState } from "./use-scenario-state"
import { VariantB } from "./variant-b-sidebar"

export function ScenarioExplorer() {
  const state = useScenarioState()
  return <VariantB state={state} />
}

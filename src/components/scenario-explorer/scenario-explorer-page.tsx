import { getFixtureCatalog } from "@/lib/catalog"
import { defaultTrackState, runScenarioPipeline } from "@/lib/scenario-pipeline"

import { ScenarioResults } from "./scenario-results"

export function ScenarioExplorerPage() {
  const catalog = getFixtureCatalog()
  const rows = runScenarioPipeline(catalog, defaultTrackState(catalog))

  return (
    <main className="mx-auto min-h-svh max-w-5xl p-4 pb-12 sm:p-6">
      <ScenarioResults catalog={catalog} rows={rows} />
    </main>
  )
}

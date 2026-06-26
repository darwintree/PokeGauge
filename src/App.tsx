import { ScenarioExplorerPage } from "@/components/scenario-explorer/scenario-explorer-page"
import { ScenarioExplorer } from "@/prototype/scenario-explorer/scenario-explorer"

function isScenarioPrototype() {
  return new URLSearchParams(window.location.search).get("prototype") === "scenarios"
}

function App() {
  if (isScenarioPrototype()) {
    return (
      <main className="mx-auto min-h-svh max-w-5xl p-4 pb-12 sm:p-6">
        <ScenarioExplorer />
      </main>
    )
  }

  return <ScenarioExplorerPage />
}

export default App

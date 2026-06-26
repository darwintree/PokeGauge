import { ScenarioExplorerPage } from "@/components/scenario-explorer/scenario-explorer-page"
import { ScenarioExplorer } from "@/prototype/scenario-explorer/scenario-explorer"

function prototypeMode() {
  return new URLSearchParams(window.location.search).get("prototype")
}

function App() {
  if (prototypeMode() === "scenarios") {
    return (
      <main className="mx-auto min-h-svh max-w-5xl p-4 pb-12 sm:p-6">
        <ScenarioExplorer />
      </main>
    )
  }

  return <ScenarioExplorerPage />
}

export default App

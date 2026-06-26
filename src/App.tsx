import { ScenarioExplorerPage } from "@/components/scenario-explorer/scenario-explorer-page"
import { ScenarioExplorer } from "@/prototype/scenario-explorer/scenario-explorer"
import { MoveTypesPrototype } from "@/prototype/move-types/move-types-prototype"

function prototypeMode() {
  return new URLSearchParams(window.location.search).get("prototype")
}

function App() {
  const mode = prototypeMode()

  if (mode === "scenarios") {
    return (
      <main className="mx-auto min-h-svh max-w-5xl p-4 pb-12 sm:p-6">
        <ScenarioExplorer />
      </main>
    )
  }

  if (mode === "type-colors") {
    return <MoveTypesPrototype />
  }

  return <ScenarioExplorerPage />
}

export default App

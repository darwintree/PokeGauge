import { ScenarioExplorer } from "@/prototype/scenario-explorer/scenario-explorer"
import { Button } from "@/components/ui/button"

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

  return (
    <main className="mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Pokémon Damage Calc
      </h1>
      <p className="text-muted-foreground text-sm">Scaffold ready.</p>
      <Button
        nativeButton={false}
        render={<a href="/?prototype=scenarios" />}
      >
        Open scenario prototype
      </Button>
    </main>
  )
}

export default App

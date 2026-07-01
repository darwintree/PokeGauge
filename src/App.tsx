import { ScenarioExplorerPage } from "@/components/scenario-explorer/scenario-explorer-page"
import { TooltipProvider } from "@/components/ui/tooltip"

function App() {
  return (
    <TooltipProvider delay={0}>
      <ScenarioExplorerPage />
    </TooltipProvider>
  )
}

export default App

import { createContext } from "react"

export type StatEditSession = {
  side: "offense" | "defense"
  kind: "add" | "range"
  placement: "popover" | "results"
}

export const StatEditorContext = createContext<{
  editing: StatEditSession | null
  setEditing: (editing: StatEditSession | null) => void
  previewTarget: HTMLDivElement | null
  showResults: () => void
  showSetup: () => void
} | null>(null)

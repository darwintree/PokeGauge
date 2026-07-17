import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n"
import { createMoveSnapshot } from "@/lib/move-snapshot"
import { defaultTrackState, type UnavailableScenarioGroup } from "@/lib/scenario-pipeline"

import { MoveMultiSelect } from "./move-multi-select"
import { ScenarioResults } from "./scenario-results"

function withEnglish(component: React.ReactNode): string {
  return renderToStaticMarkup(createElement(
    IntlProvider,
    { locale: "en", messages: localeMessages.en },
    component,
  ))
}

describe("unavailable Scenario display", () => {
  it("marks unconfigured fields only in the Move Track", async () => {
    const catalog = await getCatalogShell(342, 143, "en", "physical")
    const move = catalog.moves.find((candidate) => candidate.id === 152)
    if (!move) throw new Error("Expected Crabhammer in the physical move catalog")
    const snapshot = {
      ...createMoveSnapshot(move, "unconfigured-crabhammer"),
      power: 0,
    }
    const trackState = defaultTrackState(catalog)
    trackState.moveSnapshots = [snapshot]
    const unavailable: UnavailableScenarioGroup[] = [{
      snapshotId: snapshot.id,
      moveId: snapshot.moveId,
      reasons: ["unconfigured-move"],
      missingFields: ["power"],
      provenance: {},
    }]

    const resultsMarkup = withEnglish(createElement(ScenarioResults, {
      catalog,
      rows: [],
      unavailable,
      trackState,
      statNameStrategy: "english",
      showMoveOnRow: true,
      onShowResultActualChange: () => {},
      onProbabilityModeChange: () => {},
    }))
    const trackMarkup = withEnglish(createElement(MoveMultiSelect, {
      label: "Moves",
      options: catalog.moves,
      snapshots: [snapshot],
      onAdd: () => {},
      onChange: () => {},
      onRemove: () => {},
    }))

    expect(resultsMarkup).not.toContain("Move setup is incomplete")
    expect(resultsMarkup).not.toContain("Missing: power")
    expect(trackMarkup).toContain("Power required")
  })

  it("keeps local unsupported combinations visible in Results", async () => {
    const catalog = await getCatalogShell(342, 143, "en", "physical")
    const move = catalog.moves.find((candidate) => candidate.id === 152)
    if (!move) throw new Error("Expected Crabhammer in the physical move catalog")
    const trackState = defaultTrackState(catalog)
    const snapshot = createMoveSnapshot(move, "unsupported-crabhammer")
    trackState.moveSnapshots = [snapshot]

    const markup = withEnglish(createElement(ScenarioResults, {
      catalog,
      rows: [],
      unavailable: [{
        snapshotId: snapshot.id,
        moveId: snapshot.moveId,
        reasons: ["weather-type-change"],
        missingFields: [],
        provenance: {},
      }],
      trackState,
      statNameStrategy: "english",
      showMoveOnRow: true,
      onShowResultActualChange: () => {},
      onProbabilityModeChange: () => {},
    }))

    expect(markup).toContain("Weather-based move type changes are not calculated yet")
  })
})

import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n"
import { createMoveSnapshot } from "@/lib/move"
import {
  defaultTrackState,
  runScenarioPipeline,
  type UnavailableScenarioGroup,
} from "@/lib/scenario"

import { MoveTrack } from "../tracks/move/move-track"
import { DamageResults } from "./damage-results"

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

    const resultsMarkup = withEnglish(createElement(DamageResults, {
      catalog,
      rows: [],
      unavailable,
      trackState,
      statNameStrategy: "english",
      probabilityMode: "battle-odds",
    }))
    const trackMarkup = withEnglish(createElement(MoveTrack, {
      label: "Moves",
      attackerId: catalog.matchup.attackerId,
      attackerTypes: catalog.attackerTypes,
      defenderTypes: catalog.defenderTypes,
      options: catalog.moves,
      snapshots: [snapshot],
      selectedSnapshotIds: [snapshot.id],
      onAdd: () => undefined,
      onChange: () => {},
      onRemove: () => {},
      onSelectionChange: () => {},
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

    const markup = withEnglish(createElement(DamageResults, {
      catalog,
      rows: [],
      unavailable: [{
        snapshotId: snapshot.id,
        moveId: snapshot.moveId,
        reasons: ["terrain-type-change"],
        missingFields: [],
        provenance: {},
      }],
      trackState,
      statNameStrategy: "english",
      probabilityMode: "battle-odds",
    }))

    expect(markup).toContain("Terrain-based move type changes are not calculated yet")
  })
})

describe("mobile move grouping", () => {
  it("renders one group header per move and keeps move identity in every row", async () => {
    const catalog = await getCatalogShell(342, 143, "en", "physical")
    const state = defaultTrackState(catalog)
    const moveIds = [152, 89]
    state.moveSnapshots = moveIds.flatMap((moveId, index) => {
      const move = catalog.moves.find((candidate) => candidate.id === moveId)
      return move ? [createMoveSnapshot(move, `test-${index}-${moveId}`)] : []
    })
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    const rows = runScenarioPipeline(catalog, state).rows

    const markup = withEnglish(createElement(DamageResults, {
      catalog,
      rows,
      unavailable: [],
      trackState: state,
      statNameStrategy: "english",
      probabilityMode: "battle-odds",
    }))

    expect(markup.match(/data-move-group="89"/g)).toHaveLength(1)
    expect(markup.match(/data-move-group="152"/g)).toHaveLength(1)
    expect(markup.match(/data-result-row=/g)).toHaveLength(rows.length)
    for (const moveId of moveIds) {
      const move = catalog.moves.find((candidate) => candidate.id === moveId)
      if (!move) throw new Error(`Expected move ${moveId} in catalog`)
      const rowCount = rows.filter((row) => row.moveId === moveId).length
      expect(markup.split(move.label)).toHaveLength(rowCount * 2 + 2)
    }
    expect(markup).not.toContain("mt-2.5 border-t border-dashed border-ink/30 pt-2.5")
    expect(markup).toContain("md:border-t md:border-hairline")
  })
})

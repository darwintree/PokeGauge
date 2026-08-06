import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { getCatalogShell } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n"
import { createMoveSnapshot } from "@/lib/move"
import { defaultTrackState, runScenarioPipeline } from "@/lib/scenario"

import { DamageResultRow } from "./damage-result-row"

describe("weather damage result presentation", () => {
  it("shows active accuracy weather in Battle Odds Mode", async () => {
    const catalog = await getCatalogShell(6, 143, "en", "special")
    const state = defaultTrackState(catalog)
    state.attackerAbilityIds = [catalog.attackerAbilities[0].id]
    state.defenderAbilityIds = [catalog.defenderAbilities[0].id]
    const thunder = createMoveSnapshot(
      catalog.moves.find((move) => move.id === 87)!,
      "presentation-thunder",
    )
    state.moveSnapshots = [{ ...thunder, accuracy: 100 }]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["standard-bulk"]
    state.weathers = ["none", "rain"]
    state.probabilityMode = "battle-odds"

    const result = runScenarioPipeline(catalog, state)
    const move = catalog.moves.find((candidate) => candidate.id === 87)!
    const markup = renderToStaticMarkup(createElement(
      IntlProvider,
      { locale: "en", messages: localeMessages.en },
      createElement(
        TooltipProvider,
        null,
        createElement(DamageResultRow, {
          move,
          attackerStat: { id: "neutral-max", label: "Sp. Atk" },
          defender: { id: "standard-bulk", label: "Sp. Def" },
          row: result.rows[0],
        }),
      ),
    ))

    expect(result.rows[0].provenance.weather).toEqual({
      active: ["rain"],
      inactive: [],
      unsupported: [],
      neutral: ["none"],
    })
    expect(markup).toContain("Rain")
    expect(markup).not.toContain("No weather")
  })
})

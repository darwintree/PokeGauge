import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { localeMessages } from "@/lib/i18n"
import { createMoveSnapshot } from "@/lib/move"
import type { CatalogMoveOption } from "@/lib/catalog"

import { TerrainTrack } from "../common/terrain-track"
import { MoveSnapshotRow } from "./move-snapshot-row"

const DOUBLE_SLAP: CatalogMoveOption = {
  id: 3,
  label: "Double Slap",
  summary: "15 / 85",
  moveName: "double-slap",
  type: "normal",
  category: "physical",
  power: 15,
  accuracy: 85,
  isSpread: false,
}

function markup(locale: keyof typeof localeMessages, children: React.ReactNode) {
  return renderToStaticMarkup(createElement(
    IntlProvider,
    { locale, messages: localeMessages[locale] },
    createElement(TooltipProvider, null, children),
  ))
}

describe("audited Move and Terrain warnings", () => {
  it("shows the Move warning in folded and expanded Snapshot states", () => {
    const snapshot = createMoveSnapshot(DOUBLE_SLAP, "double-slap")
    const folded = markup("en", createElement(MoveSnapshotRow, {
      snapshot,
      option: DOUBLE_SLAP,
      selected: true,
      editing: false,
      onToggle: () => {},
      onEdit: () => {},
      onChange: () => {},
      onRemove: () => {},
    }))
    const expanded = markup("en", createElement(MoveSnapshotRow, {
      snapshot: { ...snapshot, power: 30 },
      option: DOUBLE_SLAP,
      selected: true,
      editing: true,
      onToggle: () => {},
      onEdit: () => {},
      onChange: () => {},
      onRemove: () => {},
    }))

    for (const output of [folded, expanded]) {
      expect(output).toContain("Show calculation warning for Double Slap")
      expect(output).toContain('data-base-ui-tooltip-trigger=""')
    }
  })

  it("discloses Grassy Terrain recovery without adding a result warning", () => {
    const output = markup("en", createElement(TerrainTrack, {
      values: ["grassy"],
      onChange: () => {},
    }))

    expect(output).toContain("Grassy Terrain, Grassy Terrain end-of-turn recovery is not calculated.")
    expect(output).toContain('data-base-ui-tooltip-trigger=""')
  })

  it("has concrete warning text in every supported locale", () => {
    for (const locale of ["en", "zh-hans", "zh-hant", "ja"] as const) {
      expect(localeMessages[locale]["track.move.warning.multi-hit"]).toBeTruthy()
      expect(localeMessages[locale]["track.move.warning.target-stat-change"]).toBeTruthy()
      expect(localeMessages[locale]["track.move.warning.attacker-stat-change"]).toBeTruthy()
      expect(localeMessages[locale]["track.terrain.warning.grassy-recovery"]).toBeTruthy()
    }
  })
})

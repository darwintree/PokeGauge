// @vitest-environment happy-dom
import { act, useState } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createRoot } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"
import { getCatalogShell } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n"
import { createMoveSnapshot } from "@/lib/move"
import { defaultTrackState, runScenarioPipeline } from "@/lib/scenario"
import { ResultSetSummary } from "../results-summary"
import { DamageResults } from "./damage-results"
import { groupResults, resultGroupingOptions, type ResultGrouping } from "./result-groups"

async function fixture() {
  const catalog = await getCatalogShell(342, 143, "en", "physical")
  const state = defaultTrackState(catalog)
  const move = catalog.moves.find(candidate => candidate.id === 152)!
  state.moveSnapshots = [createMoveSnapshot(move, "first"), createMoveSnapshot(move, "second")]
  state.selectedMoveSnapshotIds = ["first", "second"]
  return { catalog, state, rows: runScenarioPipeline(catalog, state).rows }
}

describe("result grouping", () => {
  it("preserves same-move snapshots as distinct groups and merged item provenance", async () => {
    const { rows } = await fixture()
    expect(groupResults(rows, "move").map(group => group.id)).toEqual(["first", "second"])
    const row = { ...rows[0], provenance: { "held-item": { active: ["life-orb"], inactive: ["leftovers"], unsupported: ["unknown"], neutral: ["none"] } } }
    const groups = groupResults([row], "item")
    expect(groups.map(group => group.id)).toEqual(["life-orb", "leftovers", "unknown", "none"])
    expect(groups.every(group => group.rows.length === 1 && group.rows[0] === row)).toBe(true)
  })

  it("offers every multi-selection Track and omits single-branch and Range Tracks", async () => {
    const { state } = await fixture()
    state.offensePresetIds = ["first", "second"]
    state.defensePresetIds = ["first", "second"]
    state.attackerStages = [0, 1]
    state.defenderStages = [0, 1]
    state.attackerAbilityIds = [0, 1]
    state.defenderAbilityIds = [0, 1]
    state.attackerItemIds = ["none", 247]
    state.defenderItemIds = ["none", 247]
    state.weathers = ["none", "sun"]
    state.terrains = ["none", "electric"]
    state.screens = ["none", "walls"]
    expect(resultGroupingOptions(state)).toHaveLength(12)
    state.statMode = "range"
    state.defenderMode = "range"
    state.attackerItemIds = ["none"]
    for (const id of ["offense", "defense", "item"]) {
      expect(resultGroupingOptions(state).map(option => option.id)).not.toContain(id)
    }
    expect(resultGroupingOptions(state)).toHaveLength(9)
  })

  it("groups all condition sources and maps applied screens back to their selected branch", async () => {
    const { rows } = await fixture()
    const row = { ...rows[0], provenance: {
      "attacker-stage": { active: ["1"], inactive: [], neutral: [], unsupported: [] },
      "defender-stage": { active: ["-1"], inactive: [], neutral: [], unsupported: [] },
      "attacker-ability": { active: ["1"], inactive: ["2"], neutral: [], unsupported: [] },
      "defender-ability": { active: ["3"], inactive: [], neutral: [], unsupported: [] },
      "defender-held-item": { active: ["247"], inactive: [], neutral: [], unsupported: [] },
      weather: { active: ["sun"], inactive: [], neutral: ["none"], unsupported: [] },
      terrain: { active: ["electric"], inactive: [], neutral: [], unsupported: [] },
      screen: { active: ["light-screen"], inactive: ["walls"], neutral: ["none"], unsupported: [] },
    } }
    for (const axis of ["attacker-stage", "defender-stage", "attacker-ability", "defender-ability", "defender-held-item", "weather", "terrain"] as const) {
      expect(groupResults([row], axis).length).toBeGreaterThan(0)
      expect(groupResults([row], axis).every(group => group.rows[0] === row)).toBe(true)
    }
    expect(groupResults([row], "screen").map(group => group.id)).toEqual(["walls", "none"])
    expect(groupResults([row], "screen").every(group => group.rows.length === 1)).toBe(true)
  })

  it("renders no grouping buttons when every selected Track has a single branch", async () => {
    const { state } = await fixture()
    state.selectedMoveSnapshotIds = ["first"]
    state.defensePresetIds = [state.defensePresetIds[0]]
    state.attackerAbilityIds = [state.attackerAbilityIds[0]]
    state.defenderAbilityIds = [state.defenderAbilityIds[0]]
    const html = renderToStaticMarkup(<IntlProvider locale="en" messages={localeMessages.en}>
      <ResultSetSummary trackState={state} rowCount={1} grouping={null} onGroupingChange={() => {}} />
    </IntlProvider>)
    expect(html).not.toContain("data-slot=\"toggle-group-item\"")
    expect(html).toContain("1 row")
  })

  it("resolves numeric item IDs to localized labels in group tabs", async () => {
    const { catalog, state } = await fixture()
    state.attackerItemIds = [247]
    catalog.attackerItems = [{ id: 247, label: "Life Orb", summary: "" }]
    const rows = runScenarioPipeline(catalog, state).rows
    const html = renderToStaticMarkup(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <DamageResults catalog={catalog} trackState={state} rows={rows} unavailable={[]} statNameStrategy="english" probabilityMode="battle-odds" grouping="item" />
      </IntlProvider>,
    )
    const container = document.createElement("div")
    container.innerHTML = html
    expect(container.querySelector('[role="tab"]')?.textContent).toContain("Life Orb")
    expect(container.querySelector('[role="tab"]')?.textContent).not.toContain("247")
  })

  it("keeps expanded Range children in the selected parent group", async () => {
    const { catalog, state } = await fixture()
    state.defenderMode = "range"
    const rows = runScenarioPipeline(catalog, state).rows
    const container = document.createElement("div")
    document.body.append(container)
    const root = createRoot(container)
    try {
      await act(async () => root.render(
        <IntlProvider locale="en" messages={localeMessages.en}>
          <DamageResults catalog={catalog} trackState={state} rows={rows} unavailable={[]} statNameStrategy="english" probabilityMode="battle-odds" grouping="defense" />
        </IntlProvider>,
      ))
      expect(container.querySelectorAll('[role="tab"]')).toHaveLength(1)
      const parents = container.querySelectorAll("[data-result-row]").length
      const expand = container.querySelector<HTMLButtonElement>('[aria-label="Show defense Choice"]')
      expect(expand).not.toBeNull()
      await act(async () => expand!.click())
      expect(container.querySelectorAll("[data-result-row]").length).toBeGreaterThan(parents)
      expect(container.querySelectorAll('[role="tab"]')).toHaveLength(1)
    } finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })

  it("toggles grouping off, switches groups, and recovers when the selected group is removed", async () => {
    const { catalog, state, rows } = await fixture()
    const container = document.createElement("div")
    document.body.append(container)
    const root = createRoot(container)
    function Harness({ secondOnly = false }: { secondOnly?: boolean }) {
      const [grouping, setGrouping] = useState<ResultGrouping | null>("move")
      const visible = secondOnly ? rows.filter(row => row.snapshotId === "second") : rows
      return <IntlProvider locale="en" messages={localeMessages.en}>
        <ResultSetSummary trackState={state} rowCount={visible.length} grouping={grouping} onGroupingChange={setGrouping} />
        <DamageResults catalog={catalog} trackState={state} rows={visible} unavailable={[]} statNameStrategy="english" probabilityMode="battle-odds" grouping={grouping} />
      </IntlProvider>
    }
    async function click(selector: string) {
      const button = container.querySelector<HTMLButtonElement>(selector)
      expect(button).not.toBeNull()
      await act(async () => button!.click())
    }
    try {
      await act(async () => root.render(<Harness />))
      expect(container.querySelectorAll("[data-result-row]")).toHaveLength(rows.length / 2)
      expect(container.querySelectorAll('[role="tab"]')).toHaveLength(2)
      await click('[aria-label="Ungroup results (move)"]')
      expect(container.querySelectorAll("[data-result-row]")).toHaveLength(rows.length)
      expect(container.querySelector('[role="tablist"]')).toBeNull()
      await click('[aria-label="Group by move"]')
      await click('[role="tab"]:last-child')
      expect(container.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toContain("· 2")
      await click('[role="tab"]:first-child')
      await act(async () => root.render(<Harness secondOnly />))
      expect(container.querySelectorAll("[data-result-row]")).toHaveLength(rows.length / 2)
      expect(container.querySelectorAll('[role="tab"]')).toHaveLength(1)
    } finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })
})

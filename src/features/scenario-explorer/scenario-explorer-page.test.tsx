// @vitest-environment happy-dom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import { ScenarioExplorerPage } from "./scenario-explorer-page"

const catalogMocks = vi.hoisted(() => ({
  resolveCategory: vi.fn(),
  getCatalogShell: vi.fn(),
}))
const scenarioMocks = vi.hoisted(() => ({
  loadSnapshot: vi.fn(),
}))

vi.mock("@/lib/catalog", () => ({
  getCatalogShell: catalogMocks.getCatalogShell,
  getDefaultMoveCategory: () => "physical",
  listAttackers: async () => [{ id: 445 }],
  listDefenders: async () => [{ id: 727 }],
  resolveCatalogDefaultMoveCategory: catalogMocks.resolveCategory,
  resolveCatalogDefaultMovePick: async (catalog: unknown) => catalog,
}))

vi.mock("@/lib/scenario", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/scenario")>(),
  loadScenarioSnapshot: scenarioMocks.loadSnapshot,
  scenarioSnapshotMatchesCatalog: () => true,
}))

vi.mock("./matchup/matchup-landing", () => ({
  MatchupLanding: ({
    onAttackerChange,
    onDefenderChange,
    resumeMatchup,
  }: {
    onAttackerChange: (id: number) => void
    onDefenderChange: (id: number) => void
    resumeMatchup?: { onResume: () => void }
  }) => (
    <div data-testid="landing">
      <button type="button" data-testid="attacker" onClick={() => onAttackerChange(445)} />
      <button type="button" data-testid="defender" onClick={() => onDefenderChange(727)} />
      {resumeMatchup && (
        <button type="button" data-testid="resume" onClick={resumeMatchup.onResume} />
      )}
    </div>
  ),
}))

vi.mock("./scenario-workspace", () => ({
  ScenarioWorkspace: ({
    catalog,
    onMoveCategoryChange,
  }: {
    catalog: { moveCategory: "physical" | "special" }
    onMoveCategoryChange: (category: "physical" | "special") => void
  }) => (
    <div data-testid="workspace" data-category={catalog.moveCategory}>
      <button
        type="button"
        data-testid="choose-physical"
        onClick={() => onMoveCategoryChange("physical")}
      />
    </div>
  ),
}))

let root: Root | null
let container: HTMLDivElement

async function flush(): Promise<void> {
  await act(async () => {
    await Promise.resolve()
    await Promise.resolve()
  })
}

async function renderPage(): Promise<void> {
  const mountedRoot = createRoot(container)
  root = mountedRoot
  await act(async () => {
    mountedRoot.render(
      <IntlProvider locale="en" messages={{}}>
        <ScenarioExplorerPage
          locale="en"
          onFeedbackScenarioUrlChange={() => {}}
        />
      </IntlProvider>,
    )
  })
  await flush()
}

beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const storedValues = new Map<string, string>()
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storedValues.get(key) ?? null,
      setItem: (key: string, value: string) => storedValues.set(key, value),
      removeItem: (key: string) => storedValues.delete(key),
      clear: () => storedValues.clear(),
    },
  })
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({ matches: true }),
  })
  catalogMocks.resolveCategory.mockReset()
  catalogMocks.getCatalogShell.mockReset()
  scenarioMocks.loadSnapshot.mockReset()
  scenarioMocks.loadSnapshot.mockReturnValue(null)
  window.history.replaceState(null, "", "/")
  catalogMocks.getCatalogShell.mockImplementation(
    async (attackerId: number, defenderId: number, _locale: string, moveCategory: string) => ({
      matchup: { attackerId, defenderId },
      moveCategory,
      defaultMovePickStatus: "ready",
    }),
  )
  container = document.createElement("div")
  document.body.append(container)
  await renderPage()
})

afterEach(async () => {
  if (root) await act(async () => root?.unmount())
  root = null
  container.remove()
})

it("applies the inferred move category for a newly selected attacker", async () => {
  catalogMocks.resolveCategory.mockResolvedValue("special")

  await act(async () => container.querySelector<HTMLElement>("[data-testid=attacker]")?.click())
  await act(async () => container.querySelector<HTMLElement>("[data-testid=defender]")?.click())
  await flush()

  expect(container.querySelector("[data-testid=workspace]")?.getAttribute("data-category"))
    .toBe("special")
})

it("does not replace a category chosen while inference is pending", async () => {
  let finishInference: (category: string) => void = () => {}
  catalogMocks.resolveCategory.mockImplementation(() => new Promise((resolve) => {
    finishInference = resolve
  }))

  await act(async () => container.querySelector<HTMLElement>("[data-testid=attacker]")?.click())
  await act(async () => container.querySelector<HTMLElement>("[data-testid=defender]")?.click())
  await flush()
  await act(async () =>
    container.querySelector<HTMLElement>("[data-testid=choose-physical]")?.click(),
  )
  await act(async () => finishInference("special"))
  await flush()

  expect(container.querySelector("[data-testid=workspace]")?.getAttribute("data-category"))
    .toBe("physical")
})

it("waits on the landing before restoring a stored scenario", async () => {
  await act(async () => root?.unmount())
  root = null
  scenarioMocks.loadSnapshot.mockReturnValue({
    version: 4,
    attackerId: 445,
    defenderId: 727,
    moveCategory: "physical",
    trackState: {},
  })
  await renderPage()

  expect(container.querySelector("[data-testid=landing]")).not.toBeNull()
  expect(container.querySelector("[data-testid=workspace]")).toBeNull()

  await act(async () => container.querySelector<HTMLElement>("[data-testid=resume]")?.click())
  await flush()

  expect(container.querySelector("[data-testid=workspace]")).not.toBeNull()
})

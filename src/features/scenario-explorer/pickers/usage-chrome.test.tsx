// @vitest-environment happy-dom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { localeMessages } from "@/lib/i18n"
import { setUsageStoreRule, setUsageStoreSource, type UsageStoreSnapshot } from "@/lib/usage-store"
import { UsagePickerChrome } from "./usage-chrome"

const snapshot: UsageStoreSnapshot = {
  source: "champions", ruleId: "Current",
  rules: [
    { id: "Current", label: "Current season full name", displayName: "Current", recommended: true },
    { id: "M6", label: "M6", recommended: true },
    { id: "M4", label: "M4", recommended: false },
    { id: "M3", label: "M3", recommended: false },
  ],
  loadingSource: null, catalogError: null,
  fetchedAt: Date.now(), pendingUpdate: true, refreshing: false, generation: 0,
}
vi.mock("@/lib/usage-store", () => ({
  useUsageStore: () => snapshot,
  setUsageStoreSource: vi.fn(), setUsageStoreRule: vi.fn(),
  refreshUsageStore: vi.fn(), applyUsageStorePending: vi.fn(),
}))
let root: Root
let container: HTMLDivElement
beforeEach(() => {
  snapshot.ruleId = "Current"
  snapshot.loadingSource = null
  snapshot.catalogError = null
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  vi.clearAllMocks()
})
afterEach(async () => { await act(async () => root.unmount()); document.body.innerHTML = "" })
async function render(variant: "popover" | "settings" = "popover") {
  await act(async () => root.render(<IntlProvider locale="en" messages={localeMessages.en}><UsagePickerChrome variant={variant} /></IntlProvider>))
}
function button(text: string) {
  return [...document.querySelectorAll<HTMLButtonElement>("button")].find(button => button.textContent?.trim() === text)!
}
async function click(element: HTMLElement) { await act(async () => element.click()) }

it("closes after choosing a rule and keeps the selected rule visible when reopened", async () => {
  await render()
  const trigger = container.querySelector("button")!
  expect(trigger.textContent).toContain("Current")
  await click(trigger)
  expect(button("M6")).toBeTruthy()
  await click(button("Show 2 more rules"))
  await click(button("M4"))
  expect(setUsageStoreRule).toHaveBeenCalledWith("M4")
  expect(trigger.getAttribute("aria-expanded")).toBe("false")
  snapshot.ruleId = "M4"
  await render()
  await click(trigger)
  expect(button("M4").getAttribute("aria-pressed")).toBe("true")
  expect(button("Show 1 more rule")).toBeTruthy()
  expect(button("Apply update")).toBeTruthy()
})

it("shows the full name immediately and offers retry for a failed source", async () => {
  await render()
  await click(container.querySelector("button")!)
  expect([...document.querySelectorAll("p")].some(paragraph => paragraph.textContent === "Current season full name")).toBe(true)
  snapshot.catalogError = "smogon"
  await render()
  await click(button("Retry"))
  expect(setUsageStoreSource).toHaveBeenCalledWith("smogon")
})


it("shows full rule choices directly in settings and expands additional rules", async () => {
  await render("settings")
  expect(button("Pokémon Champions")).toBeTruthy()
  expect(button("Current season full name").getAttribute("aria-pressed")).toBe("true")
  await click(button("M6"))
  expect(setUsageStoreRule).toHaveBeenCalledWith("M6")
  await click(button("Show 2 more rules"))
  expect(button("M4")).toBeTruthy()
  expect(button("Check for updates")).toBeTruthy()
})

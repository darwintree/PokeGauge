// @vitest-environment happy-dom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { localeMessages } from "@/lib/i18n"

import { WeatherTrack } from "./weather-track"

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
})

it("expands options into description rows without changing selection behavior", async () => {
  const onChange = vi.fn()
  await act(async () => {
    root.render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <TooltipProvider>
          <WeatherTrack values={["none"]} onChange={onChange} />
        </TooltipProvider>
      </IntlProvider>,
    )
  })

  expect(container.querySelectorAll(".track-option--described")).toHaveLength(0)
  await act(async () => {
    ;(container.querySelector('[data-slot="switch"]') as HTMLElement).click()
  })

  expect(container.querySelectorAll(".track-option--described")).toHaveLength(5)
  expect(container.textContent).toContain("Boosts Fire-type damage")

  const sun = [...container.querySelectorAll("button")].find((button) =>
    button.textContent?.includes("Sun"),
  )
  await act(async () => sun?.click())
  expect(onChange).toHaveBeenCalledWith(["none", "sun"])
})

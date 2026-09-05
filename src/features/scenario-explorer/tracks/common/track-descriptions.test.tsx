// @vitest-environment happy-dom

import { act, useState } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, expect, it } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { localeMessages } from "@/lib/i18n"

import type { Weather } from "@/lib/damage-calculation"

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

it("adds weather to the pool, retains deselected options, and blocks unavailable weather", async () => {
  function Harness() {
    const [pool, setPool] = useState<Weather[]>(["none"])
    const [values, setValues] = useState<Weather[]>(["none"])
    return <WeatherTrack pool={pool} values={values} onChange={setValues} onAdd={(value) => {
      setPool((current) => [...current, value])
      setValues((current) => [...current, value])
    }} />
  }
  await act(async () => {
    root.render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <TooltipProvider><Harness /></TooltipProvider>
      </IntlProvider>,
    )
  })

  expect(container.querySelectorAll(".track-option--icon")).toHaveLength(2)
  await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Add weather"]')?.click())
  const dialog = document.querySelector('[role="dialog"]')!
  const disabled = [...dialog.querySelectorAll<HTMLButtonElement>("button:disabled")]
  expect(disabled.map((button) => button.getAttribute("aria-label"))).toEqual([
    "Harsh sunlight, Currently unavailable",
    "Heavy rain, Currently unavailable",
    "Strong winds, Currently unavailable",
  ])
  await act(async () => disabled.forEach((button) => button.click()))
  expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  expect(container.querySelectorAll(".track-option--icon")).toHaveLength(2)

  await act(async () => dialog.querySelector<HTMLButtonElement>('[aria-label="Sun"]')?.click())
  const sun = container.querySelector<HTMLButtonElement>('[aria-label="Sun"]')!
  expect(sun.getAttribute("aria-pressed")).toBe("true")
  await act(async () => sun.click())
  expect(container.querySelector('[aria-label="Sun"]')?.getAttribute("aria-pressed")).toBe("false")
  await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Add weather"]')?.click())
  expect(document.querySelector('[role="dialog"] [aria-label="Sun"]')).toBeNull()
})

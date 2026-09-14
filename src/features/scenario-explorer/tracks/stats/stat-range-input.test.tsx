// @vitest-environment happy-dom

import { act, useState } from "react"
import { createRoot } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { expect, it } from "vitest"

import { localeMessages } from "@/lib/i18n"

import { StatRangeInput } from "./stat-range-input"

it("uses a larger hit target without enlarging the visible handle", () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const container = document.createElement("div")
  document.body.append(container)
  const root = createRoot(container)

  act(() =>
    root.render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <StatRangeInput
          statLabel="Atk"
          bounds={{
            min: 100,
            max: 200,
            snapPoints: [
              { id: "0", value: 100, tier: "neutral-zero" },
              { id: "ex", value: 200, tier: "extreme" },
            ],
          }}
          value={{ min: 200, max: 200 }}
          onChange={() => {}}
        />
      </IntlProvider>,
    ),
  )

  const handle = container.querySelector('[aria-label="Min Atk"]')
  const face = handle?.querySelector('[aria-hidden="true"]')
  expect(handle?.classList).toContain("size-8")
  expect(face?.classList).toContain("size-3.5")
  expect(face?.classList).toContain("pointer-events-none")

  act(() => root.unmount())
  container.remove()
})


it("nudges the selected endpoint and a draft point from the axis sides", () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const container = document.createElement("div")
  document.body.append(container)
  const root = createRoot(container)
  let actual = { min: 120, max: 180 }
  let draftActual = 150
  function Harness({ drafting = false }: { drafting?: boolean }) {
    const [value, setValue] = useState(actual)
    const [draft, setDraft] = useState(draftActual)
    actual = value
    draftActual = draft
    return <IntlProvider locale="en" messages={localeMessages.en}>
      <StatRangeInput statLabel="Atk" bounds={{ min: 100, max: 200, snapPoints: [] }}
        value={value} onChange={setValue} draftValue={drafting ? draft : undefined}
        onDraftChange={drafting ? setDraft : undefined} />
    </IntlProvider>
  }
  const button = (label: string) => container.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)!
  const increase = () => button(localeMessages.en["stat.range.increment"])
  const decrease = () => button(localeMessages.en["stat.range.decrement"])
  act(() => root.render(<Harness />))
  act(() => increase().click())
  expect(actual).toEqual({ min: 121, max: 180 })
  act(() => button("Max Atk").focus())
  act(() => decrease().click())
  expect(actual).toEqual({ min: 121, max: 179 })
  act(() => root.render(<Harness drafting />))
  act(() => increase().click())
  expect(draftActual).toBe(151)
  expect(actual).toEqual({ min: 121, max: 179 })
  act(() => root.unmount())
  container.remove()
})

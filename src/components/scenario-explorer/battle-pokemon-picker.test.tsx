// @vitest-environment happy-dom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"
import { afterEach, beforeEach, vi } from "vitest"

import type { BattlePokemonOption } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n/messages"

import { BattlePokemonPicker } from "./battle-pokemon-picker"
import {
  prioritizeBattlePokemonOptions,
  speciesHasMultipleBattlePokemonIdentities,
} from "@/lib/catalog/pokemon-selector"

function option(
  id: number,
  speciesId: number,
  isMega = false,
): BattlePokemonOption {
  return {
    id,
    speciesId,
    isMega,
    label: String(id),
    species: String(speciesId),
    form: null,
    types: ["normal"],
  }
}

describe("Pokemon selector priorities", () => {
  const options = [
    option(1, 1),
    option(2, 2),
    option(3, 1, true),
    option(4, 2, true),
  ]

  it("keeps same-species identities first and Mega first within each group", () => {
    expect(
      prioritizeBattlePokemonOptions(options, 1, true, true).map(({ id }) => id),
    ).toEqual([3, 1, 4, 2])
  })

  it("shows the form entry only for species with multiple eligible identities", () => {
    expect(speciesHasMultipleBattlePokemonIdentities(options, options[0])).toBe(true)
    expect(speciesHasMultipleBattlePokemonIdentities(options, option(5, 3))).toBe(false)
    expect(speciesHasMultipleBattlePokemonIdentities(options, null)).toBe(false)
  })
})

describe("Pokemon selector interactions", () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    document.body.innerHTML = ""
  })

  async function click(element: Element | null) {
    expect(element).not.toBeNull()
    await act(async () => {
      ;(element as HTMLElement).click()
      await Promise.resolve()
    })
  }

  it("keeps priorities across reopen and enables forms from the badge", async () => {
    const onChange = vi.fn()
    const options = [
      { ...option(1, 1), label: "Base" },
      { ...option(3, 1, true), label: "Mega X", form: "Mega X" },
      { ...option(4, 2, true), label: "Other Mega" },
    ]

    await act(async () => {
      root.render(
        <IntlProvider locale="zh-hans" messages={localeMessages["zh-hans"]}>
          <BattlePokemonPicker
            label="进攻方"
            options={options}
            value={1}
            onChange={onChange}
          />
        </IntlProvider>,
      )
    })

    await click(container.querySelector('[data-slot="button"]'))
    let switches = [...document.querySelectorAll('[data-slot="switch"]')]
    expect(switches).toHaveLength(2)
    expect(switches[0].hasAttribute("data-unchecked")).toBe(true)
    expect(switches[1].hasAttribute("data-unchecked")).toBe(true)

    await click(document.querySelectorAll('input[type="checkbox"]')[1])
    switches = [...document.querySelectorAll('[data-slot="switch"]')]
    expect(switches[1].hasAttribute("data-checked")).toBe(true)
    await click(document.querySelector('[data-slot="dialog-close"]'))

    await click(container.querySelector('[data-slot="button"]'))
    switches = [...document.querySelectorAll('[data-slot="switch"]')]
    expect(switches[0].hasAttribute("data-unchecked")).toBe(true)
    expect(switches[1].hasAttribute("data-checked")).toBe(true)
    await click(document.querySelector('[data-slot="dialog-close"]'))

    await click(container.querySelector('button[aria-label="选择其他形态"]'))
    switches = [...document.querySelectorAll('[data-slot="switch"]')]
    expect(switches[0].hasAttribute("data-checked")).toBe(true)
    expect(switches[1].hasAttribute("data-checked")).toBe(true)

    await click(document.querySelector('img[src$="/3.png"]')?.closest("button") ?? null)
    expect(onChange).toHaveBeenCalledWith(3)
  })
})

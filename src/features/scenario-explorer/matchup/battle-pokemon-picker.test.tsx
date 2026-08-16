// @vitest-environment happy-dom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"
import { afterEach, beforeEach, vi } from "vitest"

import {
  resetChampionsPokemonUsageFetcherForTest,
  setChampionsPokemonUsageFetcherForTest,
} from "@/lib/champions"
import type { BattlePokemonOption } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n"

import { BattlePokemonPicker } from "./battle-pokemon-picker"
import {
  prioritizeBattlePokemonOptions,
  speciesHasMultipleBattlePokemonIdentities,
} from "@/lib/catalog"

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
    setChampionsPokemonUsageFetcherForTest(async () => [])
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    document.body.innerHTML = ""
    resetChampionsPokemonUsageFetcherForTest()
  })

  async function click(element: Element | null) {
    expect(element).not.toBeNull()
    await act(async () => {
      ;(element as HTMLElement).click()
      await Promise.resolve()
    })
  }

  async function flush() {
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  function dialogImgSrcs() {
    return [...document.querySelectorAll('[data-slot="dialog-content"] img')].map((img) =>
      img.getAttribute("src"),
    )
  }

  async function settleRanking() {
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    await flush()
  }

  async function renderPicker(
    options: BattlePokemonOption[],
    onChange = vi.fn(),
    value: number | null = 1,
  ) {
    await act(async () => {
      root.render(
        <IntlProvider locale="zh-hans" messages={localeMessages["zh-hans"]}>
          <BattlePokemonPicker
            label="进攻方"
            options={options}
            value={value}
            onChange={onChange}
          />
        </IntlProvider>,
      )
    })
    return onChange
  }

  const formOptions = [
    { ...option(1, 1), label: "Base" },
    { ...option(3, 1, true), label: "Mega X", form: "Mega X" },
    { ...option(4, 2, true), label: "Other Mega" },
  ]

  it("keeps priorities across reopen and enables forms from the badge", async () => {
    const onChange = await renderPicker(formOptions)

    await click(container.querySelector('[data-slot="button"]'))
    await flush()
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

  it("hides the list until ranking arrives", async () => {
    let resolveUsage!: (ids: number[]) => void
    setChampionsPokemonUsageFetcherForTest(
      () => new Promise((resolve) => {
        resolveUsage = resolve
      }),
    )
    await renderPicker(formOptions, vi.fn(), 1)
    await click(container.querySelector('[data-slot="button"]'))

    expect(document.body.textContent).toContain("正在读取使用率顺序")
    expect(document.querySelector('[data-slot="dialog-content"] img')).toBeNull()

    await act(async () => {
      resolveUsage([3, 1])
      await Promise.resolve()
      await Promise.resolve()
    })
    await flush()

    expect(document.body.textContent).not.toContain("正在读取使用率顺序")
    const imgs = dialogImgSrcs()
    expect(imgs[0]?.endsWith("/3.png")).toBe(true)
    expect(imgs[1]?.endsWith("/1.png")).toBe(true)
  })

  it("skip shows default order and ignores a late ranking result", async () => {
    let resolveUsage!: (ids: number[]) => void
    setChampionsPokemonUsageFetcherForTest(
      () => new Promise((resolve) => {
        resolveUsage = resolve
      }),
    )
    await renderPicker(formOptions)
    await click(container.querySelector('[data-slot="button"]'))

    const skip = [...document.querySelectorAll("button")].find((button) =>
      button.textContent?.includes("显示默认顺序"),
    )
    await click(skip ?? null)

    expect(dialogImgSrcs()[0]?.endsWith("/1.png")).toBe(true)

    await act(async () => {
      resolveUsage([3, 1])
      await Promise.resolve()
      await Promise.resolve()
    })
    await flush()

    expect(dialogImgSrcs()[0]?.endsWith("/1.png")).toBe(true)
    expect(dialogImgSrcs()[0]?.endsWith("/3.png")).toBe(false)
  })

  it("shows usage order on reopen when ranking finished while closed", async () => {
    let resolveUsage!: (ids: number[]) => void
    setChampionsPokemonUsageFetcherForTest(
      () => new Promise((resolve) => {
        resolveUsage = resolve
      }),
    )
    await renderPicker(formOptions)
    await click(container.querySelector('[data-slot="button"]'))
    expect(document.body.textContent).toContain("正在读取使用率顺序")
    await click(document.querySelector('[data-slot="dialog-close"]'))

    await act(async () => {
      resolveUsage([3, 1])
      await Promise.resolve()
      await Promise.resolve()
    })
    await flush()

    await click(container.querySelector('[data-slot="button"]'))
    expect(document.body.textContent).not.toContain("正在读取使用率顺序")
    expect(dialogImgSrcs()[0]?.endsWith("/3.png")).toBe(true)
  })

  it("queries again after skip, close, and reopen", async () => {
    setChampionsPokemonUsageFetcherForTest(() => new Promise(() => {}))
    await renderPicker(formOptions)
    await click(container.querySelector('[data-slot="button"]'))
    const skip = [...document.querySelectorAll("button")].find((button) =>
      button.textContent?.includes("显示默认顺序"),
    )
    await click(skip ?? null)
    await click(document.querySelector('[data-slot="dialog-close"]'))
    await click(container.querySelector('[data-slot="button"]'))
    expect(document.body.textContent).toContain("正在读取使用率顺序")
    expect(document.querySelector('[data-slot="dialog-content"] img')).toBeNull()
  })

  it("shows default order when ranking fails", async () => {
    setChampionsPokemonUsageFetcherForTest(async () => {
      throw new Error("offline")
    })
    await renderPicker(formOptions)
    await click(container.querySelector('[data-slot="button"]'))
    await settleRanking()
    expect(document.body.textContent).not.toContain("正在读取使用率顺序")
    expect(dialogImgSrcs()[0]?.endsWith("/1.png")).toBe(true)
  })
})

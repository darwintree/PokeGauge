// @vitest-environment happy-dom

import { act, StrictMode, type ComponentProps } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  resetChampionsMoveUsageFetcherForTest,
  setChampionsMoveUsageFetcherForTest,
  type ChampionsMoveUsageRecord,
} from "@/lib/champions"
import type { CatalogMoveOption } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n"
import type { PokemonType } from "@/lib/pokemon"

import { MovePickerDialog } from "./move-picker-dialog"

function move(
  id: number,
  power: number,
  type: PokemonType = "normal",
  label = String(id),
): CatalogMoveOption {
  return {
    id,
    label,
    summary: "",
    moveName: label,
    type,
    category: "physical",
    power,
    accuracy: 100,
    isSpread: false,
  }
}

function usage(moveId: number, rank: number): ChampionsMoveUsageRecord {
  return {
    battlePokemonId: 445,
    moveId,
    format: "Doubles",
    season: "test",
    source: "test",
    dataVersion: "test",
    rank,
    percentage: 50,
    championsMoveName: String(moveId),
  }
}

const low = move(1, 40, "normal", "Low")
const high = move(2, 120, "dragon", "High")
const mid = move(3, 80, "ground", "Mid")

describe("Move picker interactions", () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
    setChampionsMoveUsageFetcherForTest(async () => [])
  })

  afterEach(async () => {
    vi.useRealTimers()
    await act(async () => root.unmount())
    container.remove()
    document.body.innerHTML = ""
    resetChampionsMoveUsageFetcherForTest()
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

  async function settleRanking() {
    await flush()
    await flush()
  }

  function rowLabels() {
    return [...document.querySelectorAll('[data-slot="dialog-content"] button.w-full')].map(
      (button) => button.querySelector(".font-bold")?.textContent,
    )
  }

  function shortcut(label: string) {
    return [...document.querySelectorAll('[data-slot="dialog-content"] button')].find(
      (button) => button.textContent === label,
    )
  }

  function typeChip(label: string) {
    return [...document.querySelectorAll('[data-slot="dialog-content"] button')].find(
      (button) => button.textContent === label,
    )
  }

  async function renderPicker({
    options = [low, high, mid],
    attackerTypes = ["dragon", "ground"] as PokemonType[],
    defenderTypes = ["fire", "dark"] as PokemonType[],
    learnableMoveIds,
    open = true,
    onOpenChange = vi.fn(),
    onSelect = vi.fn(),
  }: Partial<ComponentProps<typeof MovePickerDialog>> = {}) {
    await act(async () => {
      root.render(
        <IntlProvider locale="zh-hans" messages={localeMessages["zh-hans"]}>
          <MovePickerDialog
            open={open}
            onOpenChange={onOpenChange}
            attackerId={445}
            moveCategory="physical"
            attackerTypes={attackerTypes}
            defenderTypes={defenderTypes}
            options={options}
            learnableMoveIds={learnableMoveIds}
            onSelect={onSelect}
          />
        </IntlProvider>,
      )
    })
    return { onOpenChange, onSelect }
  }

  it("hides the list until ranking arrives, then uses usage order", async () => {
    let resolveUsage!: (records: ChampionsMoveUsageRecord[]) => void
    setChampionsMoveUsageFetcherForTest(
      () =>
        new Promise((resolve) => {
          resolveUsage = resolve
        }),
    )
    await renderPicker({ options: [low, high] })

    expect(document.body.textContent).toContain("正在读取使用率顺序")
    expect(rowLabels()).toEqual([])

    await act(async () => {
      resolveUsage([usage(1, 1), usage(2, 2)])
      await Promise.resolve()
      await Promise.resolve()
    })
    await flush()

    expect(document.body.textContent).not.toContain("正在读取使用率顺序")
    expect(rowLabels()).toEqual(["Low", "High"])
  })

  it("keeps waiting past the default-pick timeout and then uses usage order", async () => {
    vi.useFakeTimers()
    let resolveUsage!: (records: ChampionsMoveUsageRecord[]) => void
    setChampionsMoveUsageFetcherForTest(
      () =>
        new Promise((resolve) => {
          resolveUsage = resolve
        }),
    )
    await renderPicker({ options: [low, high] })
    expect(document.body.textContent).toContain("正在读取使用率顺序")

    await act(async () => {
      await vi.advanceTimersByTimeAsync(6_000)
    })
    expect(document.body.textContent).toContain("正在读取使用率顺序")
    expect(rowLabels()).toEqual([])

    await act(async () => {
      resolveUsage([usage(1, 1), usage(2, 2)])
      await Promise.resolve()
      await Promise.resolve()
    })
    await flush()

    expect(document.body.textContent).not.toContain("正在读取使用率顺序")
    expect(rowLabels()).toEqual(["Low", "High"])
    vi.useRealTimers()
  })

  it("keeps usage order when catalog.moves rewrites after ranking arrives", async () => {
    let resolveUsage!: (records: ChampionsMoveUsageRecord[]) => void
    setChampionsMoveUsageFetcherForTest(
      () =>
        new Promise((resolve) => {
          resolveUsage = resolve
        }),
    )
    function Harness({
      open,
      options,
    }: {
      open: boolean
      options: CatalogMoveOption[]
    }) {
      return (
        <StrictMode>
          <IntlProvider locale="zh-hans" messages={localeMessages["zh-hans"]}>
            <MovePickerDialog
              open={open}
              onOpenChange={() => {}}
              attackerId={445}
              moveCategory="physical"
              attackerTypes={["dragon", "ground"]}
              defenderTypes={["fire", "dark"]}
              options={options}
              onSelect={() => {}}
            />
          </IntlProvider>
        </StrictMode>
      )
    }

    await act(async () => {
      root.render(<Harness open={false} options={[low, mid, high]} />)
    })
    await act(async () => {
      root.render(<Harness open options={[low, mid, high]} />)
    })
    expect(document.body.textContent).toContain("正在读取使用率顺序")

    await act(async () => {
      resolveUsage([usage(3, 1), usage(1, 2), usage(2, 3)])
      root.render(<Harness open options={[mid, low, high]} />)
      await Promise.resolve()
      await Promise.resolve()
    })
    await flush()

    expect(document.body.textContent).not.toContain("正在读取使用率顺序")
    expect(rowLabels()).toEqual(["Mid", "Low", "High"])
  })

  it("skip shows power order and ignores a late ranking result and a catalog rewrite", async () => {
    let resolveUsage!: (records: ChampionsMoveUsageRecord[]) => void
    setChampionsMoveUsageFetcherForTest(
      () =>
        new Promise((resolve) => {
          resolveUsage = resolve
        }),
    )
    await renderPicker({ options: [low, mid, high] })
    await click(shortcut("显示默认顺序") ?? null)
    expect(rowLabels()).toEqual(["High", "Mid", "Low"])

    await act(async () => {
      resolveUsage([usage(1, 1), usage(2, 2), usage(3, 3)])
      await Promise.resolve()
      await Promise.resolve()
    })
    await flush()
    expect(rowLabels()).toEqual(["High", "Mid", "Low"])

    await act(async () => {
      root.render(
        <IntlProvider locale="zh-hans" messages={localeMessages["zh-hans"]}>
          <MovePickerDialog
            open
            onOpenChange={() => {}}
            attackerId={445}
            moveCategory="physical"
            attackerTypes={["dragon", "ground"]}
            defenderTypes={["fire", "dark"]}
            options={[low, high, mid]}
            onSelect={() => {}}
          />
        </IntlProvider>,
      )
    })
    expect(rowLabels()).toEqual(["High", "Mid", "Low"])
  })

  it("shows default power order when ranking fails", async () => {
    setChampionsMoveUsageFetcherForTest(async () => {
      throw new Error("offline")
    })
    await renderPicker({ options: [low, high] })
    await settleRanking()
    expect(document.body.textContent).not.toContain("正在读取使用率顺序")
    expect(rowLabels()).toEqual(["High", "Low"])
  })

  it("applies the learnset display filter by default and allows showing all moves", async () => {
    await renderPicker({ learnableMoveIds: [high.id] })
    await settleRanking()

    expect(shortcut("可习得")?.getAttribute("aria-pressed")).toBe("true")
    expect(rowLabels()).toEqual(["High"])

    await click(shortcut("可习得") ?? null)
    expect(shortcut("可习得")?.getAttribute("aria-pressed")).toBe("false")
    expect(rowLabels()).toEqual(["High", "Mid", "Low"])
  })

  it("STAB and super-effective shortcuts replace type chips; empty target is a no-op", async () => {
    await renderPicker()
    await settleRanking()

    await click(shortcut("STAB") ?? null)
    expect(shortcut("STAB")?.getAttribute("aria-pressed")).toBe("true")
    expect(typeChip("龙")?.getAttribute("aria-pressed")).toBe("true")
    expect(typeChip("地面")?.getAttribute("aria-pressed")).toBe("true")
    expect(typeChip("水")?.getAttribute("aria-pressed")).toBe("false")
    expect(rowLabels()).toEqual(["High", "Mid"])

    await click(shortcut("STAB") ?? null)
    expect(shortcut("STAB")?.getAttribute("aria-pressed")).toBe("false")
    expect(typeChip("龙")?.getAttribute("aria-pressed")).toBe("false")
    expect(typeChip("地面")?.getAttribute("aria-pressed")).toBe("false")
    expect(rowLabels()).toEqual(["High", "Mid", "Low"])

    await click(shortcut("STAB") ?? null)
    await click(shortcut("克制") ?? null)
    expect(shortcut("STAB")?.getAttribute("aria-pressed")).toBe("false")
    expect(shortcut("克制")?.getAttribute("aria-pressed")).toBe("true")
    expect(typeChip("水")?.getAttribute("aria-pressed")).toBe("true")
    expect(typeChip("地面")?.getAttribute("aria-pressed")).toBe("true")
    expect(typeChip("岩石")?.getAttribute("aria-pressed")).toBe("true")
    expect(typeChip("龙")?.getAttribute("aria-pressed")).toBe("false")

    await click(shortcut("克制") ?? null)
    expect(shortcut("克制")?.getAttribute("aria-pressed")).toBe("false")
    expect(typeChip("水")?.getAttribute("aria-pressed")).toBe("false")
    expect(typeChip("地面")?.getAttribute("aria-pressed")).toBe("false")
    expect(typeChip("岩石")?.getAttribute("aria-pressed")).toBe("false")

    await click(typeChip("龙") ?? null)
    expect(typeChip("龙")?.getAttribute("aria-pressed")).toBe("true")

    await act(async () => {
      root.render(
        <IntlProvider locale="zh-hans" messages={localeMessages["zh-hans"]}>
          <MovePickerDialog
            open
            onOpenChange={() => {}}
            attackerId={445}
            moveCategory="physical"
            attackerTypes={[]}
            defenderTypes={[]}
            options={[low, high, mid]}
            onSelect={() => {}}
          />
        </IntlProvider>,
      )
    })
    await click(shortcut("STAB") ?? null)
    await click(shortcut("克制") ?? null)
    expect(shortcut("STAB")?.getAttribute("aria-pressed")).toBe("false")
    expect(shortcut("克制")?.getAttribute("aria-pressed")).toBe("false")
    expect(typeChip("龙")?.getAttribute("aria-pressed")).toBe("true")
  })

  it("clears the picker filter on close and keeps ranking cache", async () => {
    function Harness({ open }: { open: boolean }) {
      return (
        <IntlProvider locale="zh-hans" messages={localeMessages["zh-hans"]}>
          <MovePickerDialog
            open={open}
            onOpenChange={() => {}}
            attackerId={445}
            moveCategory="physical"
            attackerTypes={["dragon", "ground"]}
            defenderTypes={["fire", "dark"]}
            options={[low, high]}
            onSelect={() => {}}
          />
        </IntlProvider>
      )
    }

    await act(async () => {
      root.render(<Harness open />)
    })
    await settleRanking()
    await click(shortcut("STAB") ?? null)
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set
      setter?.call(input, "High")
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
    expect(shortcut("STAB")?.getAttribute("aria-pressed")).toBe("true")
    expect(input.value).toBe("High")

    await act(async () => {
      root.render(<Harness open={false} />)
    })
    await act(async () => {
      root.render(<Harness open />)
    })

    expect(document.body.textContent).not.toContain("正在读取使用率顺序")
    const reopened = document.querySelector('[data-slot="input"]') as HTMLInputElement
    expect(reopened.value).toBe("")
    expect(shortcut("STAB")?.getAttribute("aria-pressed")).toBe("false")
    expect(typeChip("龙")?.getAttribute("aria-pressed")).toBe("false")
    expect(rowLabels()).toEqual(["High", "Low"])
  })

  it("queries again after skip, close, and reopen", async () => {
    setChampionsMoveUsageFetcherForTest(() => new Promise(() => {}))
    function Harness({ open }: { open: boolean }) {
      return (
        <IntlProvider locale="zh-hans" messages={localeMessages["zh-hans"]}>
          <MovePickerDialog
            open={open}
            onOpenChange={() => {}}
            attackerId={445}
            moveCategory="physical"
            attackerTypes={["dragon"]}
            defenderTypes={["fire"]}
            options={[low, high]}
            onSelect={() => {}}
          />
        </IntlProvider>
      )
    }
    await act(async () => {
      root.render(<Harness open />)
    })
    await click(shortcut("显示默认顺序") ?? null)
    expect(rowLabels()).toEqual(["High", "Low"])
    await act(async () => {
      root.render(<Harness open={false} />)
    })
    await act(async () => {
      root.render(<Harness open />)
    })
    expect(document.body.textContent).toContain("正在读取使用率顺序")
    expect(rowLabels()).toEqual([])
  })
})

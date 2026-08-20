// @vitest-environment happy-dom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  DEFIANT_ABILITY_ID,
  DRIZZLE_ABILITY_ID,
  DROUGHT_ABILITY_ID,
  INTIMIDATE_ABILITY_ID,
  NO_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell, type MatchupCatalog } from "@/lib/catalog"
import {
  defaultTrackState,
  scenarioSetupTokenFromTrackState,
  SCENARIO_STORAGE_KEY,
  type TrackState,
} from "@/lib/scenario"

import { useScenarioState, type ScenarioState } from "./use-scenario-state"

let current: ScenarioState

function Harness({
  catalog,
  restored,
  sharedToken,
  onSharedEdited,
}: {
  catalog: MatchupCatalog
  restored?: TrackState
  sharedToken?: string
  onSharedEdited?: () => void
}) {
  current = useScenarioState(
    catalog,
    restored,
    sharedToken && onSharedEdited
      ? { token: sharedToken, onEdited: onSharedEdited }
      : undefined,
  )
  return null
}

describe("ability projection lifecycle", () => {
  let root: Root
  let container: HTMLDivElement
  let storedValues: Map<string, string>

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    storedValues = new Map<string, string>()
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storedValues.get(key) ?? null,
        setItem: (key: string, value: string) => storedValues.set(key, value),
        removeItem: (key: string) => storedValues.delete(key),
        clear: () => storedValues.clear(),
      },
    })
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    localStorage.clear()
  })

  async function render(catalog: MatchupCatalog, restored?: TrackState) {
    await act(async () => {
      root.render(<Harness catalog={catalog} restored={restored} />)
      await Promise.resolve()
    })
  }

  it("waits for final async defaults before projecting", async () => {
    const shell = {
      ...await getCatalogShell(133, 143, "en"),
      defaultAttackerAbilityIds: [DROUGHT_ABILITY_ID],
      defaultDefenderAbilityIds: [INTIMIDATE_ABILITY_ID],
    }
    await render(shell)
    expect(current.trackState.weathers).toEqual(["none"])
    expect(current.trackState.attackerStages).toEqual([0])

    await render({
      ...shell,
      defaultAbilityPickStatus: "ready",
      defaultAttackerAbilityIds: [DRIZZLE_ABILITY_ID],
    })
    expect(current.trackState.attackerAbilityIds).toEqual([DRIZZLE_ABILITY_ID])
    expect(current.trackState.weathers).toEqual(["none", "rain"])
    expect(current.trackState.attackerStages).toEqual([-1, 0])
  })

  it("projects manual additions immediately and keeps touched selections on refresh", async () => {
    const shell = await getCatalogShell(133, 143, "en")
    await render(shell)

    await act(async () => current.setAttackerAbilityIds([DEFIANT_ABILITY_ID]))
    expect(current.trackState.attackerStages).toEqual([0, 1])

    await act(async () => current.setAttackerAbilityIds([NO_ABILITY_ID]))
    expect(current.trackState.attackerStages).toEqual([0, 1])

    await render({
      ...shell,
      defaultAbilityPickStatus: "ready",
      defaultAttackerAbilityIds: [DRIZZLE_ABILITY_ID],
    })
    expect(current.trackState.attackerAbilityIds).toEqual([NO_ABILITY_ID])
    expect(current.trackState.weathers).toEqual(["none"])
  })

  it("does not replay projection when restoring a snapshot", async () => {
    const shell = await getCatalogShell(133, 143, "en")
    const restored = defaultTrackState(shell)
    restored.attackerAbilityIds = [DROUGHT_ABILITY_ID]
    restored.weathers = ["none"]

    await render(shell, restored)
    await render({
      ...shell,
      defaultAbilityPickStatus: "ready",
      defaultAttackerAbilityIds: [DRIZZLE_ABILITY_ID],
    }, restored)

    expect(current.trackState.attackerAbilityIds).toEqual([DROUGHT_ABILITY_ID])
    expect(current.trackState.weathers).toEqual(["none"])
  })

  it("reapplies ready defaults on reset without replacing target candidates", async () => {
    const catalog = {
      ...await getCatalogShell(133, 143, "en"),
      defaultAbilityPickStatus: "ready" as const,
      defaultAttackerAbilityIds: [DROUGHT_ABILITY_ID],
    }
    const restored = defaultTrackState(catalog)
    restored.attackerAbilityIds = [NO_ABILITY_ID]
    restored.weathers = ["none", "rain"]
    await render(catalog, restored)

    await act(async () => current.resetAttackerAbilities())

    expect(current.trackState.attackerAbilityIds).toEqual([DROUGHT_ABILITY_ID])
    expect(current.trackState.weathers).toEqual(["none", "sun", "rain"])
  })

  it("resets identity targets and reapplies both sides after the new default resolves", async () => {
    const first = {
      ...await getCatalogShell(133, 143, "en"),
      defaultAbilityPickStatus: "ready" as const,
    }
    const restored = defaultTrackState(first)
    restored.attackerAbilityIds = [DROUGHT_ABILITY_ID]
    restored.defenderAbilityIds = [INTIMIDATE_ABILITY_ID]
    restored.weathers = ["none", "sun"]
    restored.attackerStages = [-1, 0]
    await render(first, restored)

    const nextShell = {
      ...await getCatalogShell(25, 143, "en"),
      defaultAttackerAbilityIds: [DRIZZLE_ABILITY_ID],
    }
    await render(nextShell, restored)
    expect(current.trackState.weathers).toEqual(["none"])
    expect(current.trackState.attackerStages).toEqual([0])

    await render({ ...nextShell, defaultAbilityPickStatus: "ready" }, restored)
    expect(current.trackState.weathers).toEqual(["none", "rain"])
    expect(current.trackState.attackerStages).toEqual([-1, 0])
  })

  it("keeps a shared import transient until its first semantic edit", async () => {
    vi.useFakeTimers()
    const catalog = await getCatalogShell(445, 727, "en", "physical")
    const restored = defaultTrackState(catalog)
    const token = scenarioSetupTokenFromTrackState(catalog, restored)
    if (!token.ok) throw new Error("Shared fixture must encode")
    const onSharedEdited = vi.fn()

    await act(async () => {
      root.render(
        <Harness
          catalog={catalog}
          restored={restored}
          sharedToken={token.value}
          onSharedEdited={onSharedEdited}
        />,
      )
      await Promise.resolve()
    })
    await act(async () => current.setShowResultStatValue(true))
    await act(async () => vi.advanceTimersByTime(200))
    expect(onSharedEdited).not.toHaveBeenCalled()
    expect(storedValues.has(SCENARIO_STORAGE_KEY)).toBe(false)

    await act(async () => current.setAttackerStages([0, 1]))
    await act(async () => vi.advanceTimersByTime(200))
    expect(onSharedEdited).toHaveBeenCalledOnce()
    expect(storedValues.has(SCENARIO_STORAGE_KEY)).toBe(true)
  })
})

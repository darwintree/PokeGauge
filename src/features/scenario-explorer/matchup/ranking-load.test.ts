import { describe, expect, it } from "vitest"

import {
  initialRankingLoadState,
  orderOptionsByIds,
  reduceRankingLoad,
  type RankingLoadAction,
  type RankingLoadState,
} from "./ranking-load"

function play(actions: RankingLoadAction[]): RankingLoadState {
  return actions.reduce(reduceRankingLoad, initialRankingLoadState())
}

describe("ranking load", () => {
  it("hides the list until ranking arrives, then shows usage order", () => {
    expect(play(["open"])).toMatchObject({
      picker: "open",
      list: "hidden",
      query: "inFlight",
    })
    expect(play(["open", "queryOk"])).toMatchObject({
      list: "usageOrder",
      query: "ready",
    })
  })

  it("skip cancels the query so a late result cannot reorder", () => {
    expect(play(["open", "skip"])).toMatchObject({
      list: "defaultOrder",
      query: "cancelled",
      skippedThisOpen: true,
    })
    expect(play(["open", "skip", "queryOk"])).toMatchObject({
      list: "defaultOrder",
      query: "cancelled",
    })
  })

  it("keeps an in-flight query after close and uses it on the next open", () => {
    expect(play(["open", "close"])).toMatchObject({
      picker: "closed",
      query: "inFlight",
    })
    expect(play(["open", "close", "open"])).toMatchObject({
      picker: "open",
      list: "hidden",
      query: "inFlight",
    })
    expect(play(["open", "close", "queryOk", "open"])).toMatchObject({
      picker: "open",
      list: "usageOrder",
      query: "ready",
    })
  })

  it("shows default order when ranking fails", () => {
    expect(play(["open", "queryFail"])).toMatchObject({
      list: "defaultOrder",
      query: "failed",
    })
    expect(play(["open", "close", "queryFail", "open"])).toMatchObject({
      picker: "open",
      list: "defaultOrder",
      query: "failed",
    })
  })

  it("queries again after a skipped open instead of remembering skip", () => {
    expect(play(["open", "skip", "close", "open"])).toMatchObject({
      picker: "open",
      list: "hidden",
      query: "inFlight",
      skippedThisOpen: false,
    })
  })

  it("orders current options by ranked ids without dropping the rest", () => {
    const options = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(orderOptionsByIds(options, [3, 1]).map((option) => option.id)).toEqual([
      3, 1, 2,
    ])
    expect(orderOptionsByIds(options, [3, 3, 1]).map((option) => option.id)).toEqual([
      3, 1, 2,
    ])
  })
})

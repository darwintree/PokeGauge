export type RankingLoadState = {
  picker: "closed" | "open"
  list: "hidden" | "defaultOrder" | "usageOrder"
  query: "idle" | "inFlight" | "ready" | "cancelled" | "failed"
  skippedThisOpen: boolean
}

export type RankingLoadAction =
  | "open"
  | "skip"
  | "queryOk"
  | "queryFail"
  | "close"

export function initialRankingLoadState(): RankingLoadState {
  return {
    picker: "closed",
    list: "hidden",
    query: "idle",
    skippedThisOpen: false,
  }
}

export function reduceRankingLoad(
  state: RankingLoadState,
  action: RankingLoadAction,
): RankingLoadState {
  switch (action) {
    case "open":
      if (state.picker === "open") return state
      if (state.query === "ready") {
        return {
          ...state,
          picker: "open",
          list: "usageOrder",
          skippedThisOpen: false,
        }
      }
      if (state.query === "failed") {
        return {
          ...state,
          picker: "open",
          list: "defaultOrder",
          skippedThisOpen: false,
        }
      }
      if (state.query === "inFlight") {
        return {
          ...state,
          picker: "open",
          list: "hidden",
          skippedThisOpen: false,
        }
      }
      return {
        ...state,
        picker: "open",
        list: "hidden",
        query: "inFlight",
        skippedThisOpen: false,
      }
    case "skip":
      if (
        state.picker !== "open" ||
        state.list !== "hidden" ||
        state.query !== "inFlight"
      ) {
        return state
      }
      return {
        ...state,
        list: "defaultOrder",
        query: "cancelled",
        skippedThisOpen: true,
      }
    case "queryOk":
      if (state.query !== "inFlight") return state
      return {
        ...state,
        query: "ready",
        list:
          state.picker === "open" && state.list === "hidden"
            ? "usageOrder"
            : state.list,
      }
    case "queryFail":
      if (state.query !== "inFlight") return state
      return {
        ...state,
        query: "failed",
        list:
          state.picker === "open" && state.list === "hidden"
            ? "defaultOrder"
            : state.list,
      }
    case "close":
      if (state.picker !== "open") return state
      return {
        ...state,
        picker: "closed",
        skippedThisOpen: false,
      }
  }
}

export function orderOptionsByIds<T extends { id: number }>(
  options: T[],
  ids: number[],
): T[] {
  const byId = new Map(options.map((option) => [option.id, option]))
  const seen = new Set<number>()
  const ranked: T[] = []
  for (const id of ids) {
    const option = byId.get(id)
    if (!option || seen.has(id)) continue
    seen.add(id)
    ranked.push(option)
  }
  for (const option of options) {
    if (seen.has(option.id)) continue
    ranked.push(option)
  }
  return ranked
}

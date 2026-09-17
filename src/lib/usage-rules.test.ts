import { expect, it } from "vitest"
import { nameUsageRules, selectCompileRules } from "./usage-rules"
const rules = (ids: string[]) => ids.map(id => ({ id, label: id }))

it("follows upstream default and numeric season recency", () => {
  expect(selectCompileRules("champions", { defaultId: "Live", rules: rules(["M9", "M11", "M10", "Live"]) })).toEqual(["Live", "M11", "M10"])
})
it("chooses latest month/regulation and both ladder extremes without a fixed rating", () => {
  const prefix = "2027-03/gen9championsvgc2027regmd"
  expect(selectCompileRules("smogon", { defaultId: "unused", rules: rules([
    "2027-02/gen9championsvgc2027regmc-1760", `${prefix}-0`, `${prefix}-1500`, `${prefix}-1825`, `${prefix}bo3-0`, `${prefix}bo3-1695`,
  ]) })).toEqual([`${prefix}-0`, `${prefix}-1825`, `${prefix}bo3-0`, `${prefix}bo3-1695`])
})
it("covers current ladder, tournaments, ranked season and historical tournaments", () => {
  const defaultId = "gen9championsvgc2027regmd-1825"
  expect(selectCompileRules("pikalytics", { defaultId, rules: rules([
    "gen9ou-1825", "championstournamentsregmd-1760", "championstournamentsregmb-1760", "battledataregmbs9-1760", "battledataregmcs10-1760", "championstournamentsregmc-1760", "championstournaments-1760", defaultId,
  ]) })).toEqual([defaultId, "championstournaments-1760", "battledataregmcs10-1760", "championstournamentsregmc-1760"])
})
it("keeps the original and disambiguates short names", () => {
  const named = nameUsageRules([
    { id: "one", label: "Pokemon Champions VGC 2027 Regulation Set M-D Showdown" },
    { id: "two", label: "Pokémon Champions VGC 2027 Reg M-D Showdown" },
    { id: "unknown", label: "A new upstream rule" },
  ])
  expect(named[0].label).toContain("Regulation Set")
  expect(named[0].displayName).not.toBe(named[1].displayName)
  expect(named[2].displayName).toBe(named[2].label)
})

import { expect, it } from "vitest"
import { isUsageArtifact, isUsageBuckets, toBucket, usageArtifactUrl } from "./usage-artifact"
import { smogonNatureRows } from "./upstream"

it("validates ranking-only snapshots and complete compact detail", () => {
  const snapshot = { source: "champions", rule: "Current", format: "Doubles", dataVersion: "v1", ranking: [6] }
  expect(isUsageArtifact(snapshot)).toBe(true)
  expect(isUsageArtifact({ ...snapshot, pokemon: { 6: { m: [["Protect", 100]] } } })).toBe(true)
  expect(isUsageArtifact({ ...snapshot, pokemon: { 6: { m: [[53, 100]] } } })).toBe(false)
  expect(isUsageBuckets({})).toBe(true)
  expect(isUsageBuckets({ error: "unavailable" })).toBe(false)
  expect(usageArtifactUrl("smogon", "2026-08/gen9championsvgc2026regmb-0")).toBe("/usage/smogon/2026-08/gen9championsvgc2026regmb-0.json")
  expect(toBucket([{ name: "Protect", percentage: null }, { name: "Earthquake", percentage: 30 }])).toEqual([["Protect", null], ["Earthquake", 30]])
})

it("keeps the strongest spread per nature without summing distinct spreads", () => {
  expect(smogonNatureRows({ Spreads: { "Jolly:1": 50, "Jolly:2": 30, "Adamant:1": 20 } })).toEqual([["Jolly", 50, 50], ["Adamant", 20, 20]])
})

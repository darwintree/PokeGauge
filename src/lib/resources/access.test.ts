import { describe, expect, it } from "vitest"

import {
  getBattlePokemonByCalcName,
  getMoveByCalcName,
  getResource,
  getResourceDiagnostics,
  ResourceLookupError,
} from "@/lib/resources"

describe("localized resource access", () => {
  it("looks up Pokemon and move resources by numeric upstream id", async () => {
    const pokemon = await getResource("pokemon", 445, "en")
    const move = await getResource("move", 89, "en")

    expect(pokemon).toMatchObject({
      resourceType: "pokemon",
      id: 445,
      battlePokemonId: 445,
      name: "Garchomp",
      calcSpeciesName: "Garchomp",
      types: ["dragon", "ground"],
      baseStats: {
        hp: 108,
        atk: 130,
      },
    })
    expect(move).toMatchObject({
      resourceType: "move",
      id: 89,
      name: "Earthquake",
      calcMoveName: "Earthquake",
      type: "ground",
      category: "physical",
      power: 100,
      accuracy: 100,
      damageKind: "damage",
      target: "all-other-pokemon",
      isSpread: true,
    })
  })

  it("routes by resource type and resolves only the current locale display name", async () => {
    await expect(getResource("pokemon", 445, "zh-hans")).resolves.toMatchObject({
      name: "烈咬陆鲨",
    })
    await expect(getResource("pokemon", 445, "zh-hant")).resolves.toMatchObject({
      name: "烈咬陸鯊",
    })
    await expect(getResource("move", 89, "ja")).resolves.toMatchObject({
      name: "じしん",
    })
  })

  it("preserves the first generated resource for duplicate calculator names", async () => {
    await Promise.all([getResource("pokemon", 20, "en"), getResource("move", 622, "en")])

    expect(getBattlePokemonByCalcName("Raticate")?.id).toBe(20)
    expect(getMoveByCalcName("Breakneck Blitz")?.id).toBe(622)
  })

  it("rejects unknown ids at the resource seam", async () => {
    await expect(getResource("move", 999_999, "en")).rejects.toBeInstanceOf(
      ResourceLookupError,
    )
  })

  it("exposes generation diagnostics for supported-locale and battle-identity checks", async () => {
    const diagnostics = await getResourceDiagnostics()

    expect(diagnostics.source).toBe("pokeapi")
    expect(diagnostics.pokemonIds).toContain(445)
    expect(diagnostics.moveIds).toContain(89)
    expect(diagnostics.missingLocaleNames.length).toBeGreaterThan(0)
    expect(diagnostics.unsupportedBattleIdentities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 10326 }),
      ]),
    )
  })
})

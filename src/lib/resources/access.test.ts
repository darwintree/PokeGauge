import { describe, expect, it } from "vitest"

import { Generations, toID } from "@smogon/calc"

import {
  getBattlePokemonById,
  getBattlePokemonByCalcName,
  getAbilityById,
  getMoveById,
  getMoveByCalcName,
  getResource,
  getResourceDiagnostics,
  listResources,
  listHistoricalLearnableMoveIds,
  ResourceLookupError,
} from "@/lib/resources"

describe("localized resource access", () => {
  it("exposes already-loaded normalized resources by numeric id", async () => {
    expect(getBattlePokemonById(445)).toBeUndefined()
    expect(getMoveById(89)).toBeUndefined()
    expect(getAbilityById(91)).toBeUndefined()

    await Promise.all([
      getResource("pokemon", 445, "en"),
      getResource("move", 89, "en"),
      getResource("ability", 91, "en"),
    ])

    expect(getBattlePokemonById(445)).toMatchObject({
      resourceType: "pokemon",
      id: 445,
      evioliteEligible: false,
      types: ["dragon", "ground"],
      baseStats: { hp: 108, atk: 130 },
    })
    expect(getMoveById(89)).toMatchObject({
      resourceType: "move",
      id: 89,
      type: "ground",
      category: "physical",
      power: 100,
    })
    expect(getAbilityById(91)).toMatchObject({
      resourceType: "ability",
      id: 91,
      slug: "adaptability",
    })
    expect(getBattlePokemonById(999_999)).toBeUndefined()
    expect(getMoveById(999_999)).toBeUndefined()
    expect(getAbilityById(999_999)).toBeUndefined()
  })

  it("exposes localized current abilities, including hidden but not historical relations", async () => {
    const [adaptability, garchomp, gengar] = await Promise.all([
      getResource("ability", 91, "zh-hant"),
      getResource("pokemon", 445, "en"),
      getResource("pokemon", 94, "en"),
    ])

    expect(adaptability).toEqual({
      resourceType: "ability",
      id: 91,
      locale: "zh-hant",
      name: "適應力",
      description: "與自身同屬性的招式 威力會提高。",
    })
    expect(garchomp.abilityIds).toEqual([8, 24])
    expect(gengar.abilityIds).not.toContain(26)
  })

  it("normalizes ability descriptions and falls back to English", async () => {
    const [localized, english] = await Promise.all([
      getResource("ability", 268, "zh-hans"),
      getResource("ability", 268, "en"),
    ])

    expect(localized.description).toBe(english.description)
    expect(localized.description).not.toMatch(/\s{2,}|[\r\n]/)
  })

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

  it("exposes per-identity Eviolite eligibility through localized resources", async () => {
    await expect(getResource("pokemon", 112, "en")).resolves.toMatchObject({
      id: 112,
      name: "Rhydon",
      evioliteEligible: true,
    })
    await expect(getResource("pokemon", 464, "en")).resolves.toMatchObject({
      id: 464,
      name: "Rhyperior",
      evioliteEligible: false,
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

  it("merges every PokeAPI form to a @smogon/calc Gen 9 species name", async () => {
    const pokemon = await listResources("pokemon", "en")
    const gen = Generations.get(9)
    const unresolvable = pokemon.filter(
      (resource) => !gen.species.get(toID(resource.calcSpeciesName)),
    )
    expect(unresolvable).toEqual([])
  })

  it("maps representative form identities to their calc species", async () => {
    const cases: Array<[number, string]> = [
      [10008, "Rotom-Heat"],
      [10033, "Venusaur-Mega"],
      [10034, "Charizard-Mega-X"],
      [10091, "Rattata-Alola"],
      [10117, "Greninja-Ash"],
      [10178, "Darmanitan-Galar-Zen"],
      [10184, "Toxtricity-Low-Key"],
      [10255, "Dudunsparce-Three-Segment"],
      [10257, "Maushold"],
      [10314, "Meowstic-M-Mega"],
    ]
    await Promise.all(cases.map(([id]) => getResource("pokemon", id, "en")))
    for (const [id, expected] of cases) {
      const resource = getBattlePokemonById(id)
      expect(resource?.calcSpeciesName, String(id)).toBe(expected)
    }
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
    expect(diagnostics.historicalLearnsetPokemonCount).toBeGreaterThan(1_200)
    expect(diagnostics.historicalLearnsetPairCount).toBeGreaterThan(60_000)
    expect(diagnostics.abilityIds).toContain(91)
    expect(diagnostics.heldItemIds).toHaveLength(85)
    expect(diagnostics.megaStoneIds).toHaveLength(47)
    expect(diagnostics.missingLocaleNames.length).toBeGreaterThan(0)
    expect(diagnostics.unsupportedBattleIdentities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 10326 }),
        expect.objectContaining({
          id: 10301,
          reason: "pokemon/10301 has no current ability relation",
        }),
      ]),
    )
  })

  it("unions damaging learnset relations across version groups", async () => {
    const moveIds = await listHistoricalLearnableMoveIds(1)

    expect(moveIds).toEqual([...new Set(moveIds)].toSorted((a, b) => a - b))
    expect(moveIds).toContain(29)
    expect(moveIds).toContain(885)
  })
})

import { describe, expect, it } from "vitest"

import { getResource, ResourceLookupError } from "@/lib/resources"

describe("localized resource access", () => {
  it("looks up Pokemon and move resources by numeric upstream id", async () => {
    const pokemon = await getResource("pokemon", 445, "en")
    const move = await getResource("move", 89, "en")

    expect(pokemon).toMatchObject({
      resourceType: "pokemon",
      id: 445,
      battlePokemonId: 445,
      name: "Garchomp",
    })
    expect(move).toMatchObject({
      resourceType: "move",
      id: 89,
      name: "Earthquake",
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

  it("rejects unknown ids at the resource seam", async () => {
    await expect(getResource("move", 999_999, "en")).rejects.toBeInstanceOf(
      ResourceLookupError,
    )
  })
})

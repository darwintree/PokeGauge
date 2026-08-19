import { Generations, toID } from "@smogon/calc"
import { describe, expect, it } from "vitest"

import { POKEMON_TYPES } from "@/lib/pokemon"

import {
  ATTACKER_HELD_ITEM_IDS,
  DEFENDER_HELD_ITEM_IDS,
  FROZEN_HELD_ITEM_BY_ID,
  FROZEN_HELD_ITEM_IDS,
  FROZEN_HELD_ITEMS,
  LOCK_HELD_ITEM_IDS,
  heldItemIdsForPool,
  isFrozenHeldItemId,
  type FrozenHeldItem,
  type HeldItemEffect,
  type HeldItemGate,
  type HeldItemModifier,
} from "@/lib/held-item"

const VALID_MODIFIERS = new Set<HeldItemModifier>([
  2048,
  3686,
  4505,
  4915,
  5324,
  6144,
  8192,
])
const VALID_STATS = new Set([
  "attack",
  "special-attack",
  "defense",
  "special-defense",
])

const FROZEN_85_CONTRACT = `247|lifeorb|attacker|M|-|{"kind":"final-damage","modifier":5324,"gates":[{"kind":"damaging-move"}]}
245|expertbelt|attacker|M|-|{"kind":"final-damage","modifier":4915,"gates":[{"kind":"damaging-move"},{"kind":"super-effective"}]}
213|lightball|attacker|M|-|{"kind":"battle-stat","stats":["attack","special-attack"],"modifier":8192,"gates":[{"kind":"holder-species","speciesIds":[25]}]}
243|muscleband|attacker|M|-|{"kind":"base-power","modifier":4505,"gates":[{"kind":"move-category","category":"physical"}]}
244|wiseglasses|attacker|M|-|{"kind":"base-power","modifier":4505,"gates":[{"kind":"move-category","category":"special"}]}
197|choiceband|attacker|B|-|{"kind":"battle-stat","stats":["attack"],"modifier":6144,"gates":[{"kind":"move-category","category":"physical"}]}
274|choicespecs|attacker|B|-|{"kind":"battle-stat","stats":["special-attack"],"modifier":6144,"gates":[{"kind":"move-category","category":"special"}]}
218|blackbelt|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["fighting"]}]}
217|blackglasses|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["dark"]}]}
226|charcoal|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["fire"]}]}
227|dragonfang|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["dragon"]}]}
2105|fairyfeather|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["fairy"]}]}
215|hardstone|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["rock"]}]}
219|magnet|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["electric"]}]}
210|metalcoat|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["steel"]}]}
216|miracleseed|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["grass"]}]}
220|mysticwater|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["water"]}]}
223|nevermeltice|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["ice"]}]}
222|poisonbarb|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["poison"]}]}
221|sharpbeak|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["flying"]}]}
228|silkscarf|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["normal"]}]}
199|silverpowder|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["bug"]}]}
214|softsand|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["ground"]}]}
224|spelltag|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["ghost"]}]}
225|twistedspoon|attacker|M|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["psychic"]}]}
176|babiriberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["steel"]},{"kind":"super-effective"}]}
172|chartiberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["rock"]},{"kind":"super-effective"}]}
177|chilanberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["normal"]}]}
166|chopleberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["fighting"]},{"kind":"super-effective"}]}
169|cobaberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["flying"]},{"kind":"super-effective"}]}
175|colburberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["dark"]},{"kind":"super-effective"}]}
174|habanberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["dragon"]},{"kind":"super-effective"}]}
173|kasibberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["ghost"]},{"kind":"super-effective"}]}
167|kebiaberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["poison"]},{"kind":"super-effective"}]}
161|occaberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["fire"]},{"kind":"super-effective"}]}
162|passhoberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["water"]},{"kind":"super-effective"}]}
170|payapaberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["psychic"]},{"kind":"super-effective"}]}
164|rindoberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["grass"]},{"kind":"super-effective"}]}
723|roseliberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["fairy"]},{"kind":"super-effective"}]}
168|shucaberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["ground"]},{"kind":"super-effective"}]}
171|tangaberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["bug"]},{"kind":"super-effective"}]}
163|wacanberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["electric"]},{"kind":"super-effective"}]}
165|yacheberry|defender|M|persistent-berry|{"kind":"final-damage","modifier":2048,"gates":[{"kind":"move-type","types":["ice"]},{"kind":"super-effective"}]}
190|brightpowder|defender|M|-|{"kind":"accuracy","direction":"incoming","modifier":3686,"gates":[{"kind":"numeric-accuracy"}]}
242|widelens|attacker|M|-|{"kind":"accuracy","direction":"outgoing","modifier":4505,"gates":[{"kind":"numeric-accuracy"}]}
209|scopelens|attacker|M|-|{"kind":"critical-stage","stage":1,"gates":[]}
232|laxincense|defender|B|-|{"kind":"accuracy","direction":"incoming","modifier":3686,"gates":[{"kind":"numeric-accuracy"}]}
303|razorclaw|attacker|B|-|{"kind":"critical-stage","stage":1,"gates":[]}
236|leek|attacker|B|-|{"kind":"critical-stage","stage":2,"gates":[{"kind":"holder-species","speciesIds":[83,865]}]}
233|luckypunch|attacker|B|-|{"kind":"critical-stage","stage":2,"gates":[{"kind":"holder-species","speciesIds":[113]}]}
288|dracoplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["dragon"]}]}
289|dreadplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["dark"]}]}
282|earthplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["ground"]}]}
280|fistplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["fighting"]}]}
275|flameplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["fire"]}]}
279|icicleplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["ice"]}]}
285|insectplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["bug"]}]}
290|ironplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["steel"]}]}
278|meadowplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["grass"]}]}
284|mindplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["psychic"]}]}
684|pixieplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["fairy"]}]}
283|skyplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["flying"]}]}
276|splashplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["water"]}]}
287|spookyplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["ghost"]}]}
286|stoneplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["rock"]}]}
281|toxicplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["poison"]}]}
277|zapplate|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["electric"]}]}
291|oddincense|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["psychic"]}]}
292|rockincense|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["rock"]}]}
295|roseincense|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["grass"]}]}
231|seaincense|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["water"]}]}
294|waveincense|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"move-type","types":["water"]}]}
235|thickclub|attacker|B|-|{"kind":"battle-stat","stats":["attack"],"modifier":8192,"gates":[{"kind":"holder-species","speciesIds":[104,105]}]}
203|deepseatooth|attacker|B|-|{"kind":"battle-stat","stats":["special-attack"],"modifier":8192,"gates":[{"kind":"holder-species","speciesIds":[366]}]}
204|deepseascale|defender|B|-|{"kind":"battle-stat","stats":["special-defense"],"modifier":8192,"gates":[{"kind":"holder-species","speciesIds":[366]}]}
683|assaultvest|defender|B|-|{"kind":"battle-stat","stats":["special-defense"],"modifier":6144,"gates":[{"kind":"move-category","category":"special"}]}
581|eviolite|defender|B|-|{"kind":"battle-stat","stats":["defense","special-defense"],"modifier":6144,"gates":[{"kind":"eviolite-eligible"}]}
112|adamantorb|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"holder-species","speciesIds":[483]},{"kind":"move-type","types":["steel","dragon"]}]}
113|lustrousorb|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"holder-species","speciesIds":[484]},{"kind":"move-type","types":["water","dragon"]}]}
442|griseousorb|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"holder-species","speciesIds":[487]},{"kind":"move-type","types":["ghost","dragon"]}]}
202|souldew|attacker|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"holder-species","speciesIds":[380,381]},{"kind":"move-type","types":["psychic","dragon"]}]}
2108|cornerstonemask|lock|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"holder-identity","battlePokemonIds":[10275]},{"kind":"damaging-move"}]}
2107|hearthflamemask|lock|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"holder-identity","battlePokemonIds":[10274]},{"kind":"damaging-move"}]}
2106|wellspringmask|lock|B|-|{"kind":"base-power","modifier":4915,"gates":[{"kind":"holder-identity","battlePokemonIds":[10273]},{"kind":"damaging-move"}]}
1181|utilityumbrella|defender|B|utility-umbrella|{"kind":"suppress-ordinary-weather-damage","gates":[{"kind":"weather","weathers":["sun","rain"]},{"kind":"move-type","types":["fire","water"]}]}`

function gateContract(gate: HeldItemGate): string {
  switch (gate.kind) {
    case "damaging-move": return "damaging"
    case "move-category": return `category=${gate.category}`
    case "move-type": return `type=${gate.types.toSorted().join(",")}`
    case "super-effective": return "super-effective"
    case "holder-species": return `species=${gate.speciesIds.toSorted((a, b) => a - b).join(",")}`
    case "holder-identity": return `identity=${gate.battlePokemonIds.toSorted((a, b) => a - b).join(",")}`
    case "eviolite-eligible": return "eviolite"
    case "numeric-accuracy": return "numeric-accuracy"
    case "weather": return `weather=${gate.weathers.toSorted().join(",")}`
  }
}

function effectContract(effect: HeldItemEffect): string {
  let signature: string
  switch (effect.kind) {
    case "base-power":
    case "final-damage":
      signature = `${effect.kind}@${effect.modifier}`
      break
    case "battle-stat":
      signature = `${effect.kind}@${effect.modifier}:${effect.stats.toSorted().join(",")}`
      break
    case "accuracy":
      signature = `${effect.kind}@${effect.modifier}:${effect.direction}`
      break
    case "critical-stage":
      signature = `${effect.kind}@${effect.stage}`
      break
    case "suppress-ordinary-weather-damage":
      signature = effect.kind
      break
  }
  return `${signature}/${effect.gates.map(gateContract).toSorted().join("+") || "-"}`
}

function semanticContractRow(row: string): string {
  const effectSeparator = row.lastIndexOf("|")
  return [
    row.slice(0, effectSeparator),
    effectContract(JSON.parse(row.slice(effectSeparator + 1)) as HeldItemEffect),
  ].join("|")
}

function expectValidGate(gate: HeldItemGate): void {
  switch (gate.kind) {
    case "move-category":
      expect(["physical", "special"]).toContain(gate.category)
      break
    case "move-type":
      expect(gate.types.length).toBeGreaterThan(0)
      expect(gate.types.every((type) => POKEMON_TYPES.includes(type))).toBe(true)
      break
    case "holder-species":
      expect(gate.speciesIds.length).toBeGreaterThan(0)
      expect(gate.speciesIds.every(Number.isInteger)).toBe(true)
      break
    case "holder-identity":
      expect(gate.battlePokemonIds.length).toBeGreaterThan(0)
      expect(gate.battlePokemonIds.every(Number.isInteger)).toBe(true)
      break
    case "weather":
      expect(gate.weathers.length).toBeGreaterThan(0)
      expect(gate.weathers.every((weather) => weather === "sun" || weather === "rain")).toBe(true)
      break
    case "damaging-move":
    case "super-effective":
    case "eviolite-eligible":
    case "numeric-accuracy":
      break
  }
}

function expectValidDescriptor(entry: FrozenHeldItem): void {
  expect(Array.isArray(entry.effect.gates)).toBe(true)
  entry.effect.gates.forEach(expectValidGate)

  switch (entry.effect.kind) {
    case "base-power":
    case "final-damage":
      expect(VALID_MODIFIERS.has(entry.effect.modifier)).toBe(true)
      break
    case "battle-stat":
      expect(VALID_MODIFIERS.has(entry.effect.modifier)).toBe(true)
      expect(entry.effect.stats.length).toBeGreaterThan(0)
      expect(new Set(entry.effect.stats).size).toBe(entry.effect.stats.length)
      expect(entry.effect.stats.every((stat) => VALID_STATS.has(stat))).toBe(true)
      break
    case "accuracy":
      expect(VALID_MODIFIERS.has(entry.effect.modifier)).toBe(true)
      expect(entry.effect.direction).toBe(entry.pool === "attacker" ? "outgoing" : "incoming")
      expect(entry.effect.gates).toEqual([{ kind: "numeric-accuracy" }])
      break
    case "critical-stage":
      expect([1, 2]).toContain(entry.effect.stage)
      expect(entry.pool).toBe("attacker")
      break
    case "suppress-ordinary-weather-damage":
      expect(entry.id).toBe(1181)
      expect(entry.pool).toBe("defender")
      break
  }
}

describe("frozen Held-item inventory", () => {
  it("contains exactly the unique 85 numeric identities and explicit Showdown joins", () => {
    expect(FROZEN_HELD_ITEMS).toHaveLength(85)
    expect(new Set(FROZEN_HELD_ITEM_IDS).size).toBe(85)
    expect(new Set(FROZEN_HELD_ITEMS.map((entry) => entry.calcItemName)).size).toBe(85)
    expect(FROZEN_HELD_ITEMS.every((entry) => Number.isInteger(entry.id))).toBe(true)
    expect(FROZEN_HELD_ITEMS.every((entry) => /^[a-z0-9]+$/.test(entry.calcItemName))).toBe(true)
    expect(FROZEN_HELD_ITEM_BY_ID.size).toBe(85)
    expect(FROZEN_HELD_ITEM_BY_ID.get(236)?.calcItemName).toBe("leek")
    expect(isFrozenHeldItemId(247)).toBe(true)
    expect(isFrozenHeldItemId("247")).toBe(false)
    expect(FROZEN_HELD_ITEMS.every((entry) =>
      Generations.get(9).items.get(toID(entry.calcItemName)) !== undefined
    )).toBe(true)
  })

  it("matches the reviewed identity, pool, warning, and effect contract row by row", () => {
    expect(FROZEN_HELD_ITEMS.map(({ id, calcItemName, pool, mb, warning, effect }) =>
      [id, calcItemName, pool, mb ? "M" : "B", warning ?? "-", effectContract(effect)].join("|"),
    ).join("\n")).toBe(FROZEN_85_CONTRACT.split("\n").map(semanticContractRow).join("\n"))
  })

  it("keeps the normative pool and M-B splits", () => {
    expect(ATTACKER_HELD_ITEM_IDS).toHaveLength(58)
    expect(DEFENDER_HELD_ITEM_IDS).toHaveLength(24)
    expect(LOCK_HELD_ITEM_IDS).toHaveLength(3)
    expect(heldItemIdsForPool("attacker")).toEqual(ATTACKER_HELD_ITEM_IDS)
    expect(heldItemIdsForPool("defender")).toEqual(DEFENDER_HELD_ITEM_IDS)
    expect(heldItemIdsForPool("lock")).toEqual(LOCK_HELD_ITEM_IDS)
    expect(FROZEN_HELD_ITEMS.filter((entry) => entry.mb)).toHaveLength(44)
    expect(FROZEN_HELD_ITEMS.filter((entry) => !entry.mb)).toHaveLength(41)
  })

  it("limits warnings to 18 persistent Berries and Utility Umbrella", () => {
    const berries = FROZEN_HELD_ITEMS.filter(
      (entry) => entry.warning === "persistent-berry",
    )
    const umbrellas = FROZEN_HELD_ITEMS.filter(
      (entry) => entry.warning === "utility-umbrella",
    )

    expect(berries).toHaveLength(18)
    expect(berries.every((entry) =>
      entry.pool === "defender" &&
      entry.effect.kind === "final-damage" &&
      entry.effect.modifier === 2048
    )).toBe(true)
    expect(umbrellas.map((entry) => entry.id)).toEqual([1181])
    expect(FROZEN_HELD_ITEMS.filter((entry) => entry.warning !== undefined)).toHaveLength(19)

    const chilanGates = FROZEN_HELD_ITEM_BY_ID.get(177)?.effect.gates ?? []
    expect(chilanGates.some((gate) => gate.kind === "super-effective")).toBe(false)
    expect(berries.filter((entry) => entry.id !== 177).every((entry) =>
      entry.effect.gates.some((gate) => gate.kind === "super-effective")
    )).toBe(true)
  })

  it("has a structurally valid effect descriptor for every entry", () => {
    FROZEN_HELD_ITEMS.forEach(expectValidDescriptor)
  })
})

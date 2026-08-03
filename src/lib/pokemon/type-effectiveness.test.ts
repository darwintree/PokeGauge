import { describe, expect, it } from "vitest"

import type { PokemonType } from "@/lib/pokemon"

import typeEfficacyCsv from "../../../PokeAPI/pokeapi/data/v2/csv/type_efficacy.csv?raw"
import { TYPE_CHART } from "@/lib/pokemon"

const TYPE_BY_ID: Record<string, PokemonType> = {
  "1": "normal",
  "2": "fighting",
  "3": "flying",
  "4": "poison",
  "5": "ground",
  "6": "rock",
  "7": "bug",
  "8": "ghost",
  "9": "steel",
  "10": "fire",
  "11": "water",
  "12": "grass",
  "13": "electric",
  "14": "psychic",
  "15": "ice",
  "16": "dragon",
  "17": "dark",
  "18": "fairy",
}

describe("local type chart", () => {
  it("matches PokeAPI type_efficacy.csv for standard battle types", () => {
    const [, ...lines] = typeEfficacyCsv.trim().split(/\r?\n/)

    for (const line of lines) {
      const [damageTypeId, targetTypeId, damageFactor] = line.split(",")
      const damageType = TYPE_BY_ID[damageTypeId]
      const targetType = TYPE_BY_ID[targetTypeId]
      if (!damageType || !targetType) continue

      const expected = Number(damageFactor) / 100
      expect(TYPE_CHART[damageType][targetType] ?? 1).toBe(expected)
    }
  })
})

import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import type { MoveCategory } from "@/lib/catalog/types"

export const HELD_ITEM_STORAGE_KEY = "pokemon-damage-calc:held-item-added-boosts"

export const TYPE_BOOST: Record<
  PokemonType,
  { calc: string; sprite: string; label: string }
> = {
  normal: { calc: "Silk Scarf", sprite: "silkscarf.png", label: "丝绸围巾" },
  fire: { calc: "Charcoal", sprite: "charcoal.png", label: "木炭" },
  water: { calc: "Mystic Water", sprite: "mysticwater.png", label: "神秘水滴" },
  electric: { calc: "Magnet", sprite: "magnet.png", label: "磁铁" },
  grass: { calc: "Miracle Seed", sprite: "miracleseed.png", label: "奇迹种子" },
  ice: { calc: "Never-Melt Ice", sprite: "never-meltice.png", label: "不融冰" },
  fighting: { calc: "Black Belt", sprite: "blackbelt.png", label: "黑带" },
  poison: { calc: "Poison Barb", sprite: "poisonbarb.png", label: "毒针" },
  ground: { calc: "Soft Sand", sprite: "softsand.png", label: "柔软沙子" },
  flying: { calc: "Sharp Beak", sprite: "sharpbeak.png", label: "锐利鸟嘴" },
  psychic: { calc: "Twisted Spoon", sprite: "twistedspoon.png", label: "弯曲的汤匙" },
  bug: { calc: "Silver Powder", sprite: "silverpowder.png", label: "银粉" },
  rock: { calc: "Hard Stone", sprite: "hardstone.png", label: "硬石头" },
  ghost: { calc: "Spell Tag", sprite: "spelltag.png", label: "咒术之符" },
  dragon: { calc: "Dragon Fang", sprite: "dragonfang.png", label: "龙之牙" },
  dark: { calc: "Black Glasses", sprite: "blackglasses.png", label: "黑色眼镜" },
  steel: { calc: "Metal Coat", sprite: "metalcoat.png", label: "金属膜" },
  fairy: { calc: "Fairy Feather", sprite: "fairyfeather.png", label: "妖精之羽" },
}

export const TYPE_BOOST_CALC_NAME = Object.fromEntries(
  POKEMON_TYPES.map((type) => [type, TYPE_BOOST[type].calc]),
) as Record<PokemonType, string>

const CORE_ITEM_SUMMARY: Record<string, string> = {
  none: "—",
  "life-orb": "1.3× 伤害",
  "choice-band": "1.5× 物攻",
  "choice-specs": "1.5× 特攻",
}

export const CORE_ITEM_SPRITE: Record<string, string | null> = {
  none: null,
  "life-orb": "lifeorb.png",
  "choice-band": "choiceband.png",
  "choice-specs": "choicespecs.png",
}

export const CORE_ITEM_LABEL_ZH: Record<string, string> = {
  none: "无道具",
  "life-orb": "生命宝珠",
  "choice-band": "讲究头带",
  "choice-specs": "讲究眼镜",
}

export function typeBoostCatalogId(type: PokemonType): string {
  return `type-boost-${type}`
}

export function typeFromBoostId(id: string): PokemonType | undefined {
  if (!id.startsWith("type-boost-")) return undefined
  const type = id.slice("type-boost-".length)
  return type in TYPE_BOOST ? (type as PokemonType) : undefined
}

export function defaultStabBoostIds(types: PokemonType[]): string[] {
  return types.slice(0, 2).map(typeBoostCatalogId)
}

export function buildVisibleItemIds(
  coreIds: string[],
  attackerTypes: PokemonType[],
  addedBoostIds: string[],
): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const id of [...coreIds, ...defaultStabBoostIds(attackerTypes), ...addedBoostIds]) {
    if (seen.has(id)) continue
    seen.add(id)
    result.push(id)
  }

  return result
}

export function buildTypeBoostCatalogOptions() {
  return POKEMON_TYPES.map((type) => ({
    id: typeBoostCatalogId(type),
    label: TYPE_BOOST[type].label,
    summary: `1.2× ${type} 招式`,
  }))
}

export function coreItemIds(category: MoveCategory): string[] {
  const choice = category === "physical" ? "choice-band" : "choice-specs"
  return ["none", "life-orb", choice]
}

export function buildCoreCatalogOptions(category: MoveCategory) {
  return coreItemIds(category).map((id) => ({
    id,
    label: CORE_ITEM_LABEL_ZH[id],
    summary: CORE_ITEM_SUMMARY[id],
  }))
}

export const ALL_TYPE_BOOST_IDS = POKEMON_TYPES.map(typeBoostCatalogId)

export function itemSprite(id: string): string | null {
  if (id === "none") return null
  const boostType = typeFromBoostId(id)
  if (boostType) return TYPE_BOOST[boostType].sprite
  return CORE_ITEM_SPRITE[id] ?? null
}

export function itemAriaLabel(id: string): string {
  const boostType = typeFromBoostId(id)
  if (boostType) return TYPE_BOOST[boostType].label
  return CORE_ITEM_LABEL_ZH[id] ?? id
}

/** Type boost items only affect same-type moves; core items (Life Orb, Choice*) always apply. */
export function itemHasNoBoostForMove(itemId: string, moveType: PokemonType): boolean {
  const boostType = typeFromBoostId(itemId)
  return boostType != null && boostType !== moveType
}

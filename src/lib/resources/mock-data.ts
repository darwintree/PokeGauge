import type { SupportedLocale } from "@/lib/i18n"
import type { BattlePokemonId, ResourceType, UpstreamResourceId } from "./types"

type LocalizedNames = Record<SupportedLocale, string>

export type MockPokemonResource = {
  resourceType: "pokemon"
  id: UpstreamResourceId
  battlePokemonId: BattlePokemonId
  names: LocalizedNames
}

export type MockMoveResource = {
  resourceType: "move"
  id: UpstreamResourceId
  names: LocalizedNames
}

export const MOCK_POKEMON_RESOURCES: Record<UpstreamResourceId, MockPokemonResource> = {
  445: {
    resourceType: "pokemon",
    id: 445,
    battlePokemonId: 445,
    names: { "zh-hans": "烈咬陆鲨", "zh-hant": "烈咬陸鯊", en: "Garchomp", ja: "ガブリアス" },
  },
  591: {
    resourceType: "pokemon",
    id: 591,
    battlePokemonId: 591,
    names: { "zh-hans": "败露球菇", "zh-hant": "敗露球菇", en: "Amoonguss", ja: "モロバレル" },
  },
  727: {
    resourceType: "pokemon",
    id: 727,
    battlePokemonId: 727,
    names: { "zh-hans": "咆哮虎", "zh-hant": "熾焰咆哮虎", en: "Incineroar", ja: "ガオガエン" },
  },
  812: {
    resourceType: "pokemon",
    id: 812,
    battlePokemonId: 812,
    names: { "zh-hans": "轰擂金刚猩", "zh-hant": "轟擂金剛猩", en: "Rillaboom", ja: "ゴリランダー" },
  },
  987: {
    resourceType: "pokemon",
    id: 987,
    battlePokemonId: 987,
    names: { "zh-hans": "振翼发", "zh-hant": "振翼髮", en: "Flutter Mane", ja: "ハバタクカミ" },
  },
  10021: {
    resourceType: "pokemon",
    id: 10021,
    battlePokemonId: 10021,
    names: { "zh-hans": "土地云-灵兽", "zh-hant": "土地雲-靈獸", en: "Landorus-Therian", ja: "ランドロス(れいじゅう)" },
  },
}

export const MOCK_MOVE_RESOURCES: Record<UpstreamResourceId, MockMoveResource> = {
  85: {
    resourceType: "move",
    id: 85,
    names: { "zh-hans": "十万伏特", "zh-hant": "十萬伏特", en: "Thunderbolt", ja: "１０まんボルト" },
  },
  89: {
    resourceType: "move",
    id: 89,
    names: { "zh-hans": "地震", "zh-hant": "地震", en: "Earthquake", ja: "じしん" },
  },
  157: {
    resourceType: "move",
    id: 157,
    names: { "zh-hans": "岩崩", "zh-hant": "岩崩", en: "Rock Slide", ja: "いわなだれ" },
  },
  182: {
    resourceType: "move",
    id: 182,
    names: { "zh-hans": "守住", "zh-hant": "守住", en: "Protect", ja: "まもる" },
  },
  247: {
    resourceType: "move",
    id: 247,
    names: { "zh-hans": "暗影球", "zh-hant": "暗影球", en: "Shadow Ball", ja: "シャドーボール" },
  },
  282: {
    resourceType: "move",
    id: 282,
    names: { "zh-hans": "拍落", "zh-hant": "拍落", en: "Knock Off", ja: "はたきおとす" },
  },
  337: {
    resourceType: "move",
    id: 337,
    names: { "zh-hans": "龙爪", "zh-hant": "龍爪", en: "Dragon Claw", ja: "ドラゴンクロー" },
  },
  424: {
    resourceType: "move",
    id: 424,
    names: { "zh-hans": "火焰牙", "zh-hant": "火焰牙", en: "Fire Fang", ja: "ほのおのキバ" },
  },
  444: {
    resourceType: "move",
    id: 444,
    names: { "zh-hans": "尖石攻击", "zh-hant": "尖石攻擊", en: "Stone Edge", ja: "ストーンエッジ" },
  },
  585: {
    resourceType: "move",
    id: 585,
    names: { "zh-hans": "月亮之力", "zh-hant": "月亮之力", en: "Moonblast", ja: "ムーンフォース" },
  },
  605: {
    resourceType: "move",
    id: 605,
    names: { "zh-hans": "魔法闪耀", "zh-hant": "魔法閃耀", en: "Dazzling Gleam", ja: "マジカルシャイン" },
  },
  707: {
    resourceType: "move",
    id: 707,
    names: { "zh-hans": "跺脚", "zh-hant": "跺腳", en: "Stomping Tantrum", ja: "じだんだ" },
  },
}

export function resourcesForType(resourceType: ResourceType) {
  return resourceType === "pokemon" ? MOCK_POKEMON_RESOURCES : MOCK_MOVE_RESOURCES
}

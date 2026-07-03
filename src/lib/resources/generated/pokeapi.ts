import type {
  GeneratedResourceDiagnostics,
  NormalizedBattlePokemon,
  NormalizedMove,
  UpstreamResourceId,
} from "../types"

export const GENERATED_POKEMON = {
  "445": {
    "resourceType": "pokemon",
    "id": 445,
    "speciesId": 445,
    "pokemonSlug": "garchomp",
    "speciesSlug": "garchomp",
    "calcSpeciesName": "Garchomp",
    "names": {
      "zh-hans": "烈咬陆鲨",
      "zh-hant": "烈咬陸鯊",
      "en": "Garchomp",
      "ja": "ガブリアス"
    },
    "speciesNames": {
      "zh-hans": "烈咬陆鲨",
      "zh-hant": "烈咬陸鯊",
      "en": "Garchomp",
      "ja": "ガブリアス"
    },
    "formNames": {},
    "types": [
      "dragon",
      "ground"
    ],
    "baseStats": {
      "hp": 108,
      "atk": 130,
      "def": 95,
      "spa": 80,
      "spd": 85,
      "spe": 102
    }
  },
  "591": {
    "resourceType": "pokemon",
    "id": 591,
    "speciesId": 591,
    "pokemonSlug": "amoonguss",
    "speciesSlug": "amoonguss",
    "calcSpeciesName": "Amoonguss",
    "names": {
      "zh-hans": "败露球菇",
      "zh-hant": "敗露球菇",
      "en": "Amoonguss",
      "ja": "モロバレル"
    },
    "speciesNames": {
      "zh-hans": "败露球菇",
      "zh-hant": "敗露球菇",
      "en": "Amoonguss",
      "ja": "モロバレル"
    },
    "formNames": {},
    "types": [
      "grass",
      "poison"
    ],
    "baseStats": {
      "hp": 114,
      "atk": 85,
      "def": 70,
      "spa": 85,
      "spd": 80,
      "spe": 30
    }
  },
  "727": {
    "resourceType": "pokemon",
    "id": 727,
    "speciesId": 727,
    "pokemonSlug": "incineroar",
    "speciesSlug": "incineroar",
    "calcSpeciesName": "Incineroar",
    "names": {
      "zh-hans": "炽焰咆哮虎",
      "zh-hant": "熾焰咆哮虎",
      "en": "Incineroar",
      "ja": "ガオガエン"
    },
    "speciesNames": {
      "zh-hans": "炽焰咆哮虎",
      "zh-hant": "熾焰咆哮虎",
      "en": "Incineroar",
      "ja": "ガオガエン"
    },
    "formNames": {},
    "types": [
      "fire",
      "dark"
    ],
    "baseStats": {
      "hp": 95,
      "atk": 115,
      "def": 90,
      "spa": 80,
      "spd": 90,
      "spe": 60
    }
  },
  "812": {
    "resourceType": "pokemon",
    "id": 812,
    "speciesId": 812,
    "pokemonSlug": "rillaboom",
    "speciesSlug": "rillaboom",
    "calcSpeciesName": "Rillaboom",
    "names": {
      "zh-hans": "轰擂金刚猩",
      "zh-hant": "轟擂金剛猩",
      "en": "Rillaboom",
      "ja": "ゴリランダー"
    },
    "speciesNames": {
      "zh-hans": "轰擂金刚猩",
      "zh-hant": "轟擂金剛猩",
      "en": "Rillaboom",
      "ja": "ゴリランダー"
    },
    "formNames": {},
    "types": [
      "grass"
    ],
    "baseStats": {
      "hp": 100,
      "atk": 125,
      "def": 90,
      "spa": 60,
      "spd": 70,
      "spe": 85
    }
  },
  "987": {
    "resourceType": "pokemon",
    "id": 987,
    "speciesId": 987,
    "pokemonSlug": "flutter-mane",
    "speciesSlug": "flutter-mane",
    "calcSpeciesName": "Flutter Mane",
    "names": {
      "zh-hans": "振翼发",
      "zh-hant": "振翼髮",
      "en": "Flutter Mane",
      "ja": "ハバタクカミ"
    },
    "speciesNames": {
      "zh-hans": "振翼发",
      "zh-hant": "振翼髮",
      "en": "Flutter Mane",
      "ja": "ハバタクカミ"
    },
    "formNames": {},
    "types": [
      "ghost",
      "fairy"
    ],
    "baseStats": {
      "hp": 55,
      "atk": 55,
      "def": 55,
      "spa": 135,
      "spd": 135,
      "spe": 135
    }
  },
  "10021": {
    "resourceType": "pokemon",
    "id": 10021,
    "speciesId": 645,
    "pokemonSlug": "landorus-therian",
    "speciesSlug": "landorus",
    "calcSpeciesName": "Landorus-Therian",
    "names": {
      "zh-hans": "土地云-灵兽形态",
      "zh-hant": "土地雲-靈獸形態",
      "en": "Landorus-Therian Forme",
      "ja": "ランドロス-れいじゅうフォルム"
    },
    "speciesNames": {
      "zh-hans": "土地云",
      "zh-hant": "土地雲",
      "en": "Landorus",
      "ja": "ランドロス"
    },
    "formNames": {
      "zh-hans": "灵兽形态",
      "zh-hant": "靈獸形態",
      "en": "Therian Forme",
      "ja": "れいじゅうフォルム"
    },
    "types": [
      "ground",
      "flying"
    ],
    "baseStats": {
      "hp": 89,
      "atk": 145,
      "def": 90,
      "spa": 105,
      "spd": 80,
      "spe": 91
    }
  }
} as const satisfies Record<UpstreamResourceId, NormalizedBattlePokemon>

export const GENERATED_MOVES = {
  "85": {
    "resourceType": "move",
    "id": 85,
    "slug": "thunderbolt",
    "calcMoveName": "Thunderbolt",
    "names": {
      "zh-hans": "十万伏特",
      "zh-hant": "十萬伏特",
      "en": "Thunderbolt",
      "ja": "１０まんボルト"
    },
    "type": "electric",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-ailment"
  },
  "89": {
    "resourceType": "move",
    "id": 89,
    "slug": "earthquake",
    "calcMoveName": "Earthquake",
    "names": {
      "zh-hans": "地震",
      "zh-hant": "地震",
      "en": "Earthquake",
      "ja": "じしん"
    },
    "type": "ground",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage"
  },
  "157": {
    "resourceType": "move",
    "id": 157,
    "slug": "rock-slide",
    "calcMoveName": "Rock Slide",
    "names": {
      "zh-hans": "岩崩",
      "zh-hant": "岩崩",
      "en": "Rock Slide",
      "ja": "いわなだれ"
    },
    "type": "rock",
    "category": "physical",
    "power": 75,
    "accuracy": 90,
    "damageKind": "damage"
  },
  "182": {
    "resourceType": "move",
    "id": 182,
    "slug": "protect",
    "calcMoveName": "Protect",
    "names": {
      "zh-hans": "守住",
      "zh-hant": "守住",
      "en": "Protect",
      "ja": "まもる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique"
  },
  "247": {
    "resourceType": "move",
    "id": 247,
    "slug": "shadow-ball",
    "calcMoveName": "Shadow Ball",
    "names": {
      "zh-hans": "暗影球",
      "zh-hant": "暗影球",
      "en": "Shadow Ball",
      "ja": "シャドーボール"
    },
    "type": "ghost",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-lower"
  },
  "282": {
    "resourceType": "move",
    "id": 282,
    "slug": "knock-off",
    "calcMoveName": "Knock Off",
    "names": {
      "zh-hans": "拍落",
      "zh-hant": "拍落",
      "en": "Knock Off",
      "ja": "はたきおとす"
    },
    "type": "dark",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage"
  },
  "337": {
    "resourceType": "move",
    "id": 337,
    "slug": "dragon-claw",
    "calcMoveName": "Dragon Claw",
    "names": {
      "zh-hans": "龙爪",
      "zh-hant": "龍爪",
      "en": "Dragon Claw",
      "ja": "ドラゴンクロー"
    },
    "type": "dragon",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage"
  },
  "424": {
    "resourceType": "move",
    "id": 424,
    "slug": "fire-fang",
    "calcMoveName": "Fire Fang",
    "names": {
      "zh-hans": "火焰牙",
      "zh-hant": "火焰牙",
      "en": "Fire Fang",
      "ja": "ほのおのキバ"
    },
    "type": "fire",
    "category": "physical",
    "power": 65,
    "accuracy": 95,
    "damageKind": "damage-ailment"
  },
  "444": {
    "resourceType": "move",
    "id": 444,
    "slug": "stone-edge",
    "calcMoveName": "Stone Edge",
    "names": {
      "zh-hans": "尖石攻击",
      "zh-hant": "尖石攻擊",
      "en": "Stone Edge",
      "ja": "ストーンエッジ"
    },
    "type": "rock",
    "category": "physical",
    "power": 100,
    "accuracy": 80,
    "damageKind": "damage"
  },
  "585": {
    "resourceType": "move",
    "id": 585,
    "slug": "moonblast",
    "calcMoveName": "Moonblast",
    "names": {
      "zh-hans": "月亮之力",
      "zh-hant": "月亮之力",
      "en": "Moonblast",
      "ja": "ムーンフォース"
    },
    "type": "fairy",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "damageKind": "damage-lower"
  },
  "605": {
    "resourceType": "move",
    "id": 605,
    "slug": "dazzling-gleam",
    "calcMoveName": "Dazzling Gleam",
    "names": {
      "zh-hans": "魔法闪耀",
      "zh-hant": "魔法閃耀",
      "en": "Dazzling Gleam",
      "ja": "マジカルシャイン"
    },
    "type": "fairy",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage"
  },
  "707": {
    "resourceType": "move",
    "id": 707,
    "slug": "stomping-tantrum",
    "calcMoveName": "Stomping Tantrum",
    "names": {
      "zh-hans": "跺脚",
      "zh-hant": "跺腳",
      "en": "Stomping Tantrum",
      "ja": "じだんだ"
    },
    "type": "ground",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage"
  }
} as const satisfies Record<UpstreamResourceId, NormalizedMove>

export const RESOURCE_DIAGNOSTICS = {
  "generatedAt": "2026-07-03T06:25:01.255Z",
  "source": "pokeapi",
  "pokemonIds": [
    445,
    591,
    727,
    812,
    987,
    10021
  ],
  "moveIds": [
    85,
    89,
    157,
    182,
    247,
    282,
    337,
    424,
    444,
    585,
    605,
    707
  ],
  "missingLocaleNames": [],
  "unsupportedBattleIdentities": []
} as const satisfies GeneratedResourceDiagnostics

import type {
  ChampionsMoveUsageRecord,
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
  "14": {
    "resourceType": "move",
    "id": 14,
    "slug": "swords-dance",
    "calcMoveName": "Swords Dance",
    "names": {
      "zh-hans": "剑舞",
      "zh-hant": "劍舞",
      "en": "Swords Dance",
      "ja": "つるぎのまい"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats"
  },
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
  "252": {
    "resourceType": "move",
    "id": 252,
    "slug": "fake-out",
    "calcMoveName": "Fake Out",
    "names": {
      "zh-hans": "击掌奇袭",
      "zh-hant": "擊掌奇襲",
      "en": "Fake Out",
      "ja": "ねこだまし"
    },
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage"
  },
  "261": {
    "resourceType": "move",
    "id": 261,
    "slug": "will-o-wisp",
    "calcMoveName": "Will-O-Wisp",
    "names": {
      "zh-hans": "鬼火",
      "zh-hant": "鬼火",
      "en": "Will-O-Wisp",
      "ja": "おにび"
    },
    "type": "fire",
    "category": "status",
    "power": null,
    "accuracy": 85,
    "damageKind": "ailment"
  },
  "269": {
    "resourceType": "move",
    "id": 269,
    "slug": "taunt",
    "calcMoveName": "Taunt",
    "names": {
      "zh-hans": "挑衅",
      "zh-hant": "挑釁",
      "en": "Taunt",
      "ja": "ちょうはつ"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique"
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
  "317": {
    "resourceType": "move",
    "id": 317,
    "slug": "rock-tomb",
    "calcMoveName": "Rock Tomb",
    "names": {
      "zh-hans": "岩石封锁",
      "zh-hant": "岩石封鎖",
      "en": "Rock Tomb",
      "ja": "がんせきふうじ"
    },
    "type": "rock",
    "category": "physical",
    "power": 60,
    "accuracy": 95,
    "damageKind": "damage-lower"
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
  "370": {
    "resourceType": "move",
    "id": 370,
    "slug": "close-combat",
    "calcMoveName": "Close Combat",
    "names": {
      "zh-hans": "近身战",
      "zh-hant": "近身戰",
      "en": "Close Combat",
      "ja": "インファイト"
    },
    "type": "fighting",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage-raise"
  },
  "394": {
    "resourceType": "move",
    "id": 394,
    "slug": "flare-blitz",
    "calcMoveName": "Flare Blitz",
    "names": {
      "zh-hans": "闪焰冲锋",
      "zh-hant": "閃焰衝鋒",
      "en": "Flare Blitz",
      "ja": "フレアドライブ"
    },
    "type": "fire",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage-ailment"
  },
  "398": {
    "resourceType": "move",
    "id": 398,
    "slug": "poison-jab",
    "calcMoveName": "Poison Jab",
    "names": {
      "zh-hans": "毒击",
      "zh-hant": "毒擊",
      "en": "Poison Jab",
      "ja": "どくづき"
    },
    "type": "poison",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-ailment"
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
  "442": {
    "resourceType": "move",
    "id": 442,
    "slug": "iron-head",
    "calcMoveName": "Iron Head",
    "names": {
      "zh-hans": "铁头",
      "zh-hant": "鐵頭",
      "en": "Iron Head",
      "ja": "アイアンヘッド"
    },
    "type": "steel",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage"
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
  "555": {
    "resourceType": "move",
    "id": 555,
    "slug": "snarl",
    "calcMoveName": "Snarl",
    "names": {
      "zh-hans": "大声咆哮",
      "zh-hant": "大聲咆哮",
      "en": "Snarl",
      "ja": "バークアウト"
    },
    "type": "dark",
    "category": "special",
    "power": 55,
    "accuracy": 95,
    "damageKind": "damage-lower"
  },
  "575": {
    "resourceType": "move",
    "id": 575,
    "slug": "parting-shot",
    "calcMoveName": "Parting Shot",
    "names": {
      "zh-hans": "抛下狠话",
      "zh-hant": "拋下狠話",
      "en": "Parting Shot",
      "ja": "すてゼリフ"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats"
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
  "663": {
    "resourceType": "move",
    "id": 663,
    "slug": "darkest-lariat",
    "calcMoveName": "Darkest Lariat",
    "names": {
      "zh-hans": "ＤＤ金勾臂",
      "zh-hant": "ＤＤ金勾臂",
      "en": "Darkest Lariat",
      "ja": "ＤＤラリアット"
    },
    "type": "dark",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage"
  },
  "675": {
    "resourceType": "move",
    "id": 675,
    "slug": "throat-chop",
    "calcMoveName": "Throat Chop",
    "names": {
      "zh-hans": "地狱突刺",
      "zh-hant": "地獄突刺",
      "en": "Throat Chop",
      "ja": "じごくづき"
    },
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-ailment"
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
  },
  "799": {
    "resourceType": "move",
    "id": 799,
    "slug": "scale-shot",
    "calcMoveName": "Scale Shot",
    "names": {
      "zh-hans": "鳞射",
      "zh-hant": "鱗射",
      "en": "Scale Shot",
      "ja": "スケイルショット"
    },
    "type": "dragon",
    "category": "physical",
    "power": 25,
    "accuracy": 90,
    "damageKind": "damage"
  }
} as const satisfies Record<UpstreamResourceId, NormalizedMove>

export const CHAMPIONS_MOVE_USAGE = [
  {
    "battlePokemonId": 445,
    "moveId": 337,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 1,
    "percentage": 89.1,
    "championsMoveName": "Dragon Claw"
  },
  {
    "battlePokemonId": 445,
    "moveId": 157,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 2,
    "percentage": 84.3,
    "championsMoveName": "Rock Slide"
  },
  {
    "battlePokemonId": 445,
    "moveId": 89,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 3,
    "percentage": 78.8,
    "championsMoveName": "Earthquake"
  },
  {
    "battlePokemonId": 445,
    "moveId": 182,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 4,
    "percentage": 73,
    "championsMoveName": "Protect"
  },
  {
    "battlePokemonId": 445,
    "moveId": 707,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 5,
    "percentage": 32.1,
    "championsMoveName": "Stomping Tantrum"
  },
  {
    "battlePokemonId": 445,
    "moveId": 398,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 6,
    "percentage": 16.2,
    "championsMoveName": "Poison Jab"
  },
  {
    "battlePokemonId": 445,
    "moveId": 317,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 7,
    "percentage": 8.6,
    "championsMoveName": "Rock Tomb"
  },
  {
    "battlePokemonId": 445,
    "moveId": 799,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 8,
    "percentage": 2.8,
    "championsMoveName": "Scale Shot"
  },
  {
    "battlePokemonId": 445,
    "moveId": 442,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 9,
    "percentage": 2.5,
    "championsMoveName": "Iron Head"
  },
  {
    "battlePokemonId": 445,
    "moveId": 14,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv",
    "rank": 10,
    "percentage": 2.3,
    "championsMoveName": "Swords Dance"
  },
  {
    "battlePokemonId": 727,
    "moveId": 252,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 1,
    "percentage": 99.4,
    "championsMoveName": "Fake Out"
  },
  {
    "battlePokemonId": 727,
    "moveId": 575,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 2,
    "percentage": 94.3,
    "championsMoveName": "Parting Shot"
  },
  {
    "battlePokemonId": 727,
    "moveId": 394,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 3,
    "percentage": 91.6,
    "championsMoveName": "Flare Blitz"
  },
  {
    "battlePokemonId": 727,
    "moveId": 663,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 4,
    "percentage": 41.1,
    "championsMoveName": "Darkest Lariat"
  },
  {
    "battlePokemonId": 727,
    "moveId": 675,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 5,
    "percentage": 40.5,
    "championsMoveName": "Throat Chop"
  },
  {
    "battlePokemonId": 727,
    "moveId": 182,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 6,
    "percentage": 13.3,
    "championsMoveName": "Protect"
  },
  {
    "battlePokemonId": 727,
    "moveId": 261,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 7,
    "percentage": 4,
    "championsMoveName": "Will-O-Wisp"
  },
  {
    "battlePokemonId": 727,
    "moveId": 269,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 8,
    "percentage": 3.6,
    "championsMoveName": "Taunt"
  },
  {
    "battlePokemonId": 727,
    "moveId": 370,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 9,
    "percentage": 2.6,
    "championsMoveName": "Close Combat"
  },
  {
    "battlePokemonId": 727,
    "moveId": 555,
    "format": "Doubles",
    "season": "Season M-3",
    "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv",
    "rank": 10,
    "percentage": 2.3,
    "championsMoveName": "Snarl"
  }
] as const satisfies readonly ChampionsMoveUsageRecord[]

export const RESOURCE_DIAGNOSTICS = {
  "generatedAt": "2026-07-03T06:51:12.910Z",
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
    14,
    85,
    89,
    157,
    182,
    247,
    252,
    261,
    269,
    282,
    317,
    337,
    370,
    394,
    398,
    424,
    442,
    444,
    555,
    575,
    585,
    605,
    663,
    675,
    707,
    799
  ],
  "missingLocaleNames": [],
  "unsupportedBattleIdentities": [],
  "champions": {
    "defaultSeason": "Current",
    "format": "Doubles",
    "mappedPokemon": [
      {
        "battlePokemonId": 445,
        "championsName": "Garchomp",
        "championsSlug": "garchomp",
        "championsBattleName": "Garchomp",
        "source": "pokemon_champions_assets/battle_data/Doubles/Garchomp.csv"
      },
      {
        "battlePokemonId": 727,
        "championsName": "Incineroar",
        "championsSlug": "incineroar",
        "championsBattleName": "Incineroar",
        "source": "pokemon_champions_assets/battle_data/Doubles/Incineroar.csv"
      }
    ],
    "unmatchedPokemon": [
      {
        "battlePokemonId": 591,
        "pokemonName": "Amoonguss",
        "reason": "No matching Champions index Pokemon"
      },
      {
        "battlePokemonId": 812,
        "pokemonName": "Rillaboom",
        "reason": "No matching Champions index Pokemon"
      },
      {
        "battlePokemonId": 987,
        "pokemonName": "Flutter Mane",
        "reason": "No matching Champions index Pokemon"
      },
      {
        "battlePokemonId": 10021,
        "pokemonName": "Landorus Therian",
        "reason": "No matching Champions index Pokemon"
      }
    ],
    "unmatchedMoves": []
  }
} as const satisfies GeneratedResourceDiagnostics

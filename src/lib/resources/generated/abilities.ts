import type { NormalizedAbility, UpstreamResourceId } from "../types"

export const GENERATED_ABILITIES = {
  "1": {
    "resourceType": "ability",
    "id": 1,
    "slug": "stench",
    "calcAbilityName": "Stench",
    "names": {
      "zh-hans": "恶臭",
      "zh-hant": "惡臭",
      "en": "Stench",
      "ja": "あくしゅう"
    }
  },
  "2": {
    "resourceType": "ability",
    "id": 2,
    "slug": "drizzle",
    "calcAbilityName": "Drizzle",
    "names": {
      "zh-hans": "降雨",
      "zh-hant": "降雨",
      "en": "Drizzle",
      "ja": "あめふらし"
    }
  },
  "3": {
    "resourceType": "ability",
    "id": 3,
    "slug": "speed-boost",
    "calcAbilityName": "Speed Boost",
    "names": {
      "zh-hans": "加速",
      "zh-hant": "加速",
      "en": "Speed Boost",
      "ja": "かそく"
    }
  },
  "4": {
    "resourceType": "ability",
    "id": 4,
    "slug": "battle-armor",
    "calcAbilityName": "Battle Armor",
    "names": {
      "zh-hans": "战斗盔甲",
      "zh-hant": "戰鬥盔甲",
      "en": "Battle Armor",
      "ja": "カブトアーマー"
    }
  },
  "5": {
    "resourceType": "ability",
    "id": 5,
    "slug": "sturdy",
    "calcAbilityName": "Sturdy",
    "names": {
      "zh-hans": "结实",
      "zh-hant": "結實",
      "en": "Sturdy",
      "ja": "がんじょう"
    }
  },
  "6": {
    "resourceType": "ability",
    "id": 6,
    "slug": "damp",
    "calcAbilityName": "Damp",
    "names": {
      "zh-hans": "湿气",
      "zh-hant": "濕氣",
      "en": "Damp",
      "ja": "しめりけ"
    }
  },
  "7": {
    "resourceType": "ability",
    "id": 7,
    "slug": "limber",
    "calcAbilityName": "Limber",
    "names": {
      "zh-hans": "柔软",
      "zh-hant": "柔軟",
      "en": "Limber",
      "ja": "じゅうなん"
    }
  },
  "8": {
    "resourceType": "ability",
    "id": 8,
    "slug": "sand-veil",
    "calcAbilityName": "Sand Veil",
    "names": {
      "zh-hans": "沙隐",
      "zh-hant": "沙隱",
      "en": "Sand Veil",
      "ja": "すながくれ"
    }
  },
  "9": {
    "resourceType": "ability",
    "id": 9,
    "slug": "static",
    "calcAbilityName": "Static",
    "names": {
      "zh-hans": "静电",
      "zh-hant": "靜電",
      "en": "Static",
      "ja": "せいでんき"
    }
  },
  "10": {
    "resourceType": "ability",
    "id": 10,
    "slug": "volt-absorb",
    "calcAbilityName": "Volt Absorb",
    "names": {
      "zh-hans": "蓄电",
      "zh-hant": "蓄電",
      "en": "Volt Absorb",
      "ja": "ちくでん"
    }
  },
  "11": {
    "resourceType": "ability",
    "id": 11,
    "slug": "water-absorb",
    "calcAbilityName": "Water Absorb",
    "names": {
      "zh-hans": "储水",
      "zh-hant": "儲水",
      "en": "Water Absorb",
      "ja": "ちょすい"
    }
  },
  "12": {
    "resourceType": "ability",
    "id": 12,
    "slug": "oblivious",
    "calcAbilityName": "Oblivious",
    "names": {
      "zh-hans": "迟钝",
      "zh-hant": "遲鈍",
      "en": "Oblivious",
      "ja": "どんかん"
    }
  },
  "13": {
    "resourceType": "ability",
    "id": 13,
    "slug": "cloud-nine",
    "calcAbilityName": "Cloud Nine",
    "names": {
      "zh-hans": "无关天气",
      "zh-hant": "無關天氣",
      "en": "Cloud Nine",
      "ja": "ノーてんき"
    }
  },
  "14": {
    "resourceType": "ability",
    "id": 14,
    "slug": "compound-eyes",
    "calcAbilityName": "Compound Eyes",
    "names": {
      "zh-hans": "复眼",
      "zh-hant": "複眼",
      "en": "Compound Eyes",
      "ja": "ふくがん"
    }
  },
  "15": {
    "resourceType": "ability",
    "id": 15,
    "slug": "insomnia",
    "calcAbilityName": "Insomnia",
    "names": {
      "zh-hans": "不眠",
      "zh-hant": "不眠",
      "en": "Insomnia",
      "ja": "ふみん"
    }
  },
  "16": {
    "resourceType": "ability",
    "id": 16,
    "slug": "color-change",
    "calcAbilityName": "Color Change",
    "names": {
      "zh-hans": "变色",
      "zh-hant": "變色",
      "en": "Color Change",
      "ja": "へんしょく"
    }
  },
  "17": {
    "resourceType": "ability",
    "id": 17,
    "slug": "immunity",
    "calcAbilityName": "Immunity",
    "names": {
      "zh-hans": "免疫",
      "zh-hant": "免疫",
      "en": "Immunity",
      "ja": "めんえき"
    }
  },
  "18": {
    "resourceType": "ability",
    "id": 18,
    "slug": "flash-fire",
    "calcAbilityName": "Flash Fire",
    "names": {
      "zh-hans": "引火",
      "zh-hant": "引火",
      "en": "Flash Fire",
      "ja": "もらいび"
    }
  },
  "19": {
    "resourceType": "ability",
    "id": 19,
    "slug": "shield-dust",
    "calcAbilityName": "Shield Dust",
    "names": {
      "zh-hans": "鳞粉",
      "zh-hant": "鱗粉",
      "en": "Shield Dust",
      "ja": "りんぷん"
    }
  },
  "20": {
    "resourceType": "ability",
    "id": 20,
    "slug": "own-tempo",
    "calcAbilityName": "Own Tempo",
    "names": {
      "zh-hans": "我行我素",
      "zh-hant": "我行我素",
      "en": "Own Tempo",
      "ja": "マイペース"
    }
  },
  "21": {
    "resourceType": "ability",
    "id": 21,
    "slug": "suction-cups",
    "calcAbilityName": "Suction Cups",
    "names": {
      "zh-hans": "吸盘",
      "zh-hant": "吸盤",
      "en": "Suction Cups",
      "ja": "きゅうばん"
    }
  },
  "22": {
    "resourceType": "ability",
    "id": 22,
    "slug": "intimidate",
    "calcAbilityName": "Intimidate",
    "names": {
      "zh-hans": "威吓",
      "zh-hant": "威嚇",
      "en": "Intimidate",
      "ja": "いかく"
    }
  },
  "23": {
    "resourceType": "ability",
    "id": 23,
    "slug": "shadow-tag",
    "calcAbilityName": "Shadow Tag",
    "names": {
      "zh-hans": "踩影",
      "zh-hant": "踩影",
      "en": "Shadow Tag",
      "ja": "かげふみ"
    }
  },
  "24": {
    "resourceType": "ability",
    "id": 24,
    "slug": "rough-skin",
    "calcAbilityName": "Rough Skin",
    "names": {
      "zh-hans": "粗糙皮肤",
      "zh-hant": "粗糙皮膚",
      "en": "Rough Skin",
      "ja": "さめはだ"
    }
  },
  "25": {
    "resourceType": "ability",
    "id": 25,
    "slug": "wonder-guard",
    "calcAbilityName": "Wonder Guard",
    "names": {
      "zh-hans": "神奇守护",
      "zh-hant": "神奇守護",
      "en": "Wonder Guard",
      "ja": "ふしぎなまもり"
    }
  },
  "26": {
    "resourceType": "ability",
    "id": 26,
    "slug": "levitate",
    "calcAbilityName": "Levitate",
    "names": {
      "zh-hans": "飘浮",
      "zh-hant": "飄浮",
      "en": "Levitate",
      "ja": "ふゆう"
    }
  },
  "27": {
    "resourceType": "ability",
    "id": 27,
    "slug": "effect-spore",
    "calcAbilityName": "Effect Spore",
    "names": {
      "zh-hans": "孢子",
      "zh-hant": "孢子",
      "en": "Effect Spore",
      "ja": "ほうし"
    }
  },
  "28": {
    "resourceType": "ability",
    "id": 28,
    "slug": "synchronize",
    "calcAbilityName": "Synchronize",
    "names": {
      "zh-hans": "同步",
      "zh-hant": "同步",
      "en": "Synchronize",
      "ja": "シンクロ"
    }
  },
  "29": {
    "resourceType": "ability",
    "id": 29,
    "slug": "clear-body",
    "calcAbilityName": "Clear Body",
    "names": {
      "zh-hans": "恒净之躯",
      "zh-hant": "恆淨之軀",
      "en": "Clear Body",
      "ja": "クリアボディ"
    }
  },
  "30": {
    "resourceType": "ability",
    "id": 30,
    "slug": "natural-cure",
    "calcAbilityName": "Natural Cure",
    "names": {
      "zh-hans": "自然回复",
      "zh-hant": "自然回復",
      "en": "Natural Cure",
      "ja": "しぜんかいふく"
    }
  },
  "31": {
    "resourceType": "ability",
    "id": 31,
    "slug": "lightning-rod",
    "calcAbilityName": "Lightning Rod",
    "names": {
      "zh-hans": "避雷针",
      "zh-hant": "避雷針",
      "en": "Lightning Rod",
      "ja": "ひらいしん"
    }
  },
  "32": {
    "resourceType": "ability",
    "id": 32,
    "slug": "serene-grace",
    "calcAbilityName": "Serene Grace",
    "names": {
      "zh-hans": "天恩",
      "zh-hant": "天恩",
      "en": "Serene Grace",
      "ja": "てんのめぐみ"
    }
  },
  "33": {
    "resourceType": "ability",
    "id": 33,
    "slug": "swift-swim",
    "calcAbilityName": "Swift Swim",
    "names": {
      "zh-hans": "悠游自如",
      "zh-hant": "悠游自如",
      "en": "Swift Swim",
      "ja": "すいすい"
    }
  },
  "34": {
    "resourceType": "ability",
    "id": 34,
    "slug": "chlorophyll",
    "calcAbilityName": "Chlorophyll",
    "names": {
      "zh-hans": "叶绿素",
      "zh-hant": "葉綠素",
      "en": "Chlorophyll",
      "ja": "ようりょくそ"
    }
  },
  "35": {
    "resourceType": "ability",
    "id": 35,
    "slug": "illuminate",
    "calcAbilityName": "Illuminate",
    "names": {
      "zh-hans": "发光",
      "zh-hant": "發光",
      "en": "Illuminate",
      "ja": "はっこう"
    }
  },
  "36": {
    "resourceType": "ability",
    "id": 36,
    "slug": "trace",
    "calcAbilityName": "Trace",
    "names": {
      "zh-hans": "复制",
      "zh-hant": "複製",
      "en": "Trace",
      "ja": "トレース"
    }
  },
  "37": {
    "resourceType": "ability",
    "id": 37,
    "slug": "huge-power",
    "calcAbilityName": "Huge Power",
    "names": {
      "zh-hans": "大力士",
      "zh-hant": "大力士",
      "en": "Huge Power",
      "ja": "ちからもち"
    }
  },
  "38": {
    "resourceType": "ability",
    "id": 38,
    "slug": "poison-point",
    "calcAbilityName": "Poison Point",
    "names": {
      "zh-hans": "毒刺",
      "zh-hant": "毒刺",
      "en": "Poison Point",
      "ja": "どくのトゲ"
    }
  },
  "39": {
    "resourceType": "ability",
    "id": 39,
    "slug": "inner-focus",
    "calcAbilityName": "Inner Focus",
    "names": {
      "zh-hans": "精神力",
      "zh-hant": "精神力",
      "en": "Inner Focus",
      "ja": "せいしんりょく"
    }
  },
  "40": {
    "resourceType": "ability",
    "id": 40,
    "slug": "magma-armor",
    "calcAbilityName": "Magma Armor",
    "names": {
      "zh-hans": "熔岩铠甲",
      "zh-hant": "熔岩鎧甲",
      "en": "Magma Armor",
      "ja": "マグマのよろい"
    }
  },
  "41": {
    "resourceType": "ability",
    "id": 41,
    "slug": "water-veil",
    "calcAbilityName": "Water Veil",
    "names": {
      "zh-hans": "水幕",
      "zh-hant": "水幕",
      "en": "Water Veil",
      "ja": "みずのベール"
    }
  },
  "42": {
    "resourceType": "ability",
    "id": 42,
    "slug": "magnet-pull",
    "calcAbilityName": "Magnet Pull",
    "names": {
      "zh-hans": "磁力",
      "zh-hant": "磁力",
      "en": "Magnet Pull",
      "ja": "じりょく"
    }
  },
  "43": {
    "resourceType": "ability",
    "id": 43,
    "slug": "soundproof",
    "calcAbilityName": "Soundproof",
    "names": {
      "zh-hans": "隔音",
      "zh-hant": "隔音",
      "en": "Soundproof",
      "ja": "ぼうおん"
    }
  },
  "44": {
    "resourceType": "ability",
    "id": 44,
    "slug": "rain-dish",
    "calcAbilityName": "Rain Dish",
    "names": {
      "zh-hans": "雨盘",
      "zh-hant": "雨盤",
      "en": "Rain Dish",
      "ja": "あめうけざら"
    }
  },
  "45": {
    "resourceType": "ability",
    "id": 45,
    "slug": "sand-stream",
    "calcAbilityName": "Sand Stream",
    "names": {
      "zh-hans": "扬沙",
      "zh-hant": "揚沙",
      "en": "Sand Stream",
      "ja": "すなおこし"
    }
  },
  "46": {
    "resourceType": "ability",
    "id": 46,
    "slug": "pressure",
    "calcAbilityName": "Pressure",
    "names": {
      "zh-hans": "压迫感",
      "zh-hant": "壓迫感",
      "en": "Pressure",
      "ja": "プレッシャー"
    }
  },
  "47": {
    "resourceType": "ability",
    "id": 47,
    "slug": "thick-fat",
    "calcAbilityName": "Thick Fat",
    "names": {
      "zh-hans": "厚脂肪",
      "zh-hant": "厚脂肪",
      "en": "Thick Fat",
      "ja": "あついしぼう"
    }
  },
  "48": {
    "resourceType": "ability",
    "id": 48,
    "slug": "early-bird",
    "calcAbilityName": "Early Bird",
    "names": {
      "zh-hans": "早起",
      "zh-hant": "早起",
      "en": "Early Bird",
      "ja": "はやおき"
    }
  },
  "49": {
    "resourceType": "ability",
    "id": 49,
    "slug": "flame-body",
    "calcAbilityName": "Flame Body",
    "names": {
      "zh-hans": "火焰之躯",
      "zh-hant": "火焰之軀",
      "en": "Flame Body",
      "ja": "ほのおのからだ"
    }
  },
  "50": {
    "resourceType": "ability",
    "id": 50,
    "slug": "run-away",
    "calcAbilityName": "Run Away",
    "names": {
      "zh-hans": "逃跑",
      "zh-hant": "逃跑",
      "en": "Run Away",
      "ja": "にげあし"
    }
  },
  "51": {
    "resourceType": "ability",
    "id": 51,
    "slug": "keen-eye",
    "calcAbilityName": "Keen Eye",
    "names": {
      "zh-hans": "锐利目光",
      "zh-hant": "銳利目光",
      "en": "Keen Eye",
      "ja": "するどいめ"
    }
  },
  "52": {
    "resourceType": "ability",
    "id": 52,
    "slug": "hyper-cutter",
    "calcAbilityName": "Hyper Cutter",
    "names": {
      "zh-hans": "怪力钳",
      "zh-hant": "怪力鉗",
      "en": "Hyper Cutter",
      "ja": "かいりきバサミ"
    }
  },
  "53": {
    "resourceType": "ability",
    "id": 53,
    "slug": "pickup",
    "calcAbilityName": "Pickup",
    "names": {
      "zh-hans": "捡拾",
      "zh-hant": "撿拾",
      "en": "Pickup",
      "ja": "ものひろい"
    }
  },
  "54": {
    "resourceType": "ability",
    "id": 54,
    "slug": "truant",
    "calcAbilityName": "Truant",
    "names": {
      "zh-hans": "懒惰",
      "zh-hant": "懶惰",
      "en": "Truant",
      "ja": "なまけ"
    }
  },
  "55": {
    "resourceType": "ability",
    "id": 55,
    "slug": "hustle",
    "calcAbilityName": "Hustle",
    "names": {
      "zh-hans": "活力",
      "zh-hant": "活力",
      "en": "Hustle",
      "ja": "はりきり"
    }
  },
  "56": {
    "resourceType": "ability",
    "id": 56,
    "slug": "cute-charm",
    "calcAbilityName": "Cute Charm",
    "names": {
      "zh-hans": "迷人之躯",
      "zh-hant": "迷人之軀",
      "en": "Cute Charm",
      "ja": "メロメロボディ"
    }
  },
  "57": {
    "resourceType": "ability",
    "id": 57,
    "slug": "plus",
    "calcAbilityName": "Plus",
    "names": {
      "zh-hans": "正电",
      "zh-hant": "正電",
      "en": "Plus",
      "ja": "プラス"
    }
  },
  "58": {
    "resourceType": "ability",
    "id": 58,
    "slug": "minus",
    "calcAbilityName": "Minus",
    "names": {
      "zh-hans": "负电",
      "zh-hant": "負電",
      "en": "Minus",
      "ja": "マイナス"
    }
  },
  "59": {
    "resourceType": "ability",
    "id": 59,
    "slug": "forecast",
    "calcAbilityName": "Forecast",
    "names": {
      "zh-hans": "阴晴不定",
      "zh-hant": "陰晴不定",
      "en": "Forecast",
      "ja": "てんきや"
    }
  },
  "60": {
    "resourceType": "ability",
    "id": 60,
    "slug": "sticky-hold",
    "calcAbilityName": "Sticky Hold",
    "names": {
      "zh-hans": "黏着",
      "zh-hant": "黏著",
      "en": "Sticky Hold",
      "ja": "ねんちゃく"
    }
  },
  "61": {
    "resourceType": "ability",
    "id": 61,
    "slug": "shed-skin",
    "calcAbilityName": "Shed Skin",
    "names": {
      "zh-hans": "蜕皮",
      "zh-hant": "蛻皮",
      "en": "Shed Skin",
      "ja": "だっぴ"
    }
  },
  "62": {
    "resourceType": "ability",
    "id": 62,
    "slug": "guts",
    "calcAbilityName": "Guts",
    "names": {
      "zh-hans": "毅力",
      "zh-hant": "毅力",
      "en": "Guts",
      "ja": "こんじょう"
    }
  },
  "63": {
    "resourceType": "ability",
    "id": 63,
    "slug": "marvel-scale",
    "calcAbilityName": "Marvel Scale",
    "names": {
      "zh-hans": "神奇鳞片",
      "zh-hant": "神奇鱗片",
      "en": "Marvel Scale",
      "ja": "ふしぎなうろこ"
    }
  },
  "64": {
    "resourceType": "ability",
    "id": 64,
    "slug": "liquid-ooze",
    "calcAbilityName": "Liquid Ooze",
    "names": {
      "zh-hans": "污泥浆",
      "zh-hant": "污泥漿",
      "en": "Liquid Ooze",
      "ja": "ヘドロえき"
    }
  },
  "65": {
    "resourceType": "ability",
    "id": 65,
    "slug": "overgrow",
    "calcAbilityName": "Overgrow",
    "names": {
      "zh-hans": "茂盛",
      "zh-hant": "茂盛",
      "en": "Overgrow",
      "ja": "しんりょく"
    }
  },
  "66": {
    "resourceType": "ability",
    "id": 66,
    "slug": "blaze",
    "calcAbilityName": "Blaze",
    "names": {
      "zh-hans": "猛火",
      "zh-hant": "猛火",
      "en": "Blaze",
      "ja": "もうか"
    }
  },
  "67": {
    "resourceType": "ability",
    "id": 67,
    "slug": "torrent",
    "calcAbilityName": "Torrent",
    "names": {
      "zh-hans": "激流",
      "zh-hant": "激流",
      "en": "Torrent",
      "ja": "げきりゅう"
    }
  },
  "68": {
    "resourceType": "ability",
    "id": 68,
    "slug": "swarm",
    "calcAbilityName": "Swarm",
    "names": {
      "zh-hans": "虫之预感",
      "zh-hant": "蟲之預感",
      "en": "Swarm",
      "ja": "むしのしらせ"
    }
  },
  "69": {
    "resourceType": "ability",
    "id": 69,
    "slug": "rock-head",
    "calcAbilityName": "Rock Head",
    "names": {
      "zh-hans": "坚硬脑袋",
      "zh-hant": "堅硬腦袋",
      "en": "Rock Head",
      "ja": "いしあたま"
    }
  },
  "70": {
    "resourceType": "ability",
    "id": 70,
    "slug": "drought",
    "calcAbilityName": "Drought",
    "names": {
      "zh-hans": "日照",
      "zh-hant": "日照",
      "en": "Drought",
      "ja": "ひでり"
    }
  },
  "71": {
    "resourceType": "ability",
    "id": 71,
    "slug": "arena-trap",
    "calcAbilityName": "Arena Trap",
    "names": {
      "zh-hans": "沙穴",
      "zh-hant": "沙穴",
      "en": "Arena Trap",
      "ja": "ありじごく"
    }
  },
  "72": {
    "resourceType": "ability",
    "id": 72,
    "slug": "vital-spirit",
    "calcAbilityName": "Vital Spirit",
    "names": {
      "zh-hans": "干劲",
      "zh-hant": "幹勁",
      "en": "Vital Spirit",
      "ja": "やるき"
    }
  },
  "73": {
    "resourceType": "ability",
    "id": 73,
    "slug": "white-smoke",
    "calcAbilityName": "White Smoke",
    "names": {
      "zh-hans": "白色烟雾",
      "zh-hant": "白色煙霧",
      "en": "White Smoke",
      "ja": "しろいけむり"
    }
  },
  "74": {
    "resourceType": "ability",
    "id": 74,
    "slug": "pure-power",
    "calcAbilityName": "Pure Power",
    "names": {
      "zh-hans": "瑜伽之力",
      "zh-hant": "瑜伽之力",
      "en": "Pure Power",
      "ja": "ヨガパワー"
    }
  },
  "75": {
    "resourceType": "ability",
    "id": 75,
    "slug": "shell-armor",
    "calcAbilityName": "Shell Armor",
    "names": {
      "zh-hans": "硬壳盔甲",
      "zh-hant": "硬殼盔甲",
      "en": "Shell Armor",
      "ja": "シェルアーマー"
    }
  },
  "76": {
    "resourceType": "ability",
    "id": 76,
    "slug": "air-lock",
    "calcAbilityName": "Air Lock",
    "names": {
      "zh-hans": "气闸",
      "zh-hant": "氣閘",
      "en": "Air Lock",
      "ja": "エアロック"
    }
  },
  "77": {
    "resourceType": "ability",
    "id": 77,
    "slug": "tangled-feet",
    "calcAbilityName": "Tangled Feet",
    "names": {
      "zh-hans": "蹒跚",
      "zh-hant": "蹣跚",
      "en": "Tangled Feet",
      "ja": "ちどりあし"
    }
  },
  "78": {
    "resourceType": "ability",
    "id": 78,
    "slug": "motor-drive",
    "calcAbilityName": "Motor Drive",
    "names": {
      "zh-hans": "电气引擎",
      "zh-hant": "電氣引擎",
      "en": "Motor Drive",
      "ja": "でんきエンジン"
    }
  },
  "79": {
    "resourceType": "ability",
    "id": 79,
    "slug": "rivalry",
    "calcAbilityName": "Rivalry",
    "names": {
      "zh-hans": "斗争心",
      "zh-hant": "鬥爭心",
      "en": "Rivalry",
      "ja": "とうそうしん"
    }
  },
  "80": {
    "resourceType": "ability",
    "id": 80,
    "slug": "steadfast",
    "calcAbilityName": "Steadfast",
    "names": {
      "zh-hans": "不屈之心",
      "zh-hant": "不屈之心",
      "en": "Steadfast",
      "ja": "ふくつのこころ"
    }
  },
  "81": {
    "resourceType": "ability",
    "id": 81,
    "slug": "snow-cloak",
    "calcAbilityName": "Snow Cloak",
    "names": {
      "zh-hans": "雪隐",
      "zh-hant": "雪隱",
      "en": "Snow Cloak",
      "ja": "ゆきがくれ"
    }
  },
  "82": {
    "resourceType": "ability",
    "id": 82,
    "slug": "gluttony",
    "calcAbilityName": "Gluttony",
    "names": {
      "zh-hans": "贪吃鬼",
      "zh-hant": "貪吃鬼",
      "en": "Gluttony",
      "ja": "くいしんぼう"
    }
  },
  "83": {
    "resourceType": "ability",
    "id": 83,
    "slug": "anger-point",
    "calcAbilityName": "Anger Point",
    "names": {
      "zh-hans": "愤怒穴位",
      "zh-hant": "憤怒穴位",
      "en": "Anger Point",
      "ja": "いかりのつぼ"
    }
  },
  "84": {
    "resourceType": "ability",
    "id": 84,
    "slug": "unburden",
    "calcAbilityName": "Unburden",
    "names": {
      "zh-hans": "轻装",
      "zh-hant": "輕裝",
      "en": "Unburden",
      "ja": "かるわざ"
    }
  },
  "85": {
    "resourceType": "ability",
    "id": 85,
    "slug": "heatproof",
    "calcAbilityName": "Heatproof",
    "names": {
      "zh-hans": "耐热",
      "zh-hant": "耐熱",
      "en": "Heatproof",
      "ja": "たいねつ"
    }
  },
  "86": {
    "resourceType": "ability",
    "id": 86,
    "slug": "simple",
    "calcAbilityName": "Simple",
    "names": {
      "zh-hans": "单纯",
      "zh-hant": "單純",
      "en": "Simple",
      "ja": "たんじゅん"
    }
  },
  "87": {
    "resourceType": "ability",
    "id": 87,
    "slug": "dry-skin",
    "calcAbilityName": "Dry Skin",
    "names": {
      "zh-hans": "干燥皮肤",
      "zh-hant": "乾燥皮膚",
      "en": "Dry Skin",
      "ja": "かんそうはだ"
    }
  },
  "88": {
    "resourceType": "ability",
    "id": 88,
    "slug": "download",
    "calcAbilityName": "Download",
    "names": {
      "zh-hans": "下载",
      "zh-hant": "下載",
      "en": "Download",
      "ja": "ダウンロード"
    }
  },
  "89": {
    "resourceType": "ability",
    "id": 89,
    "slug": "iron-fist",
    "calcAbilityName": "Iron Fist",
    "names": {
      "zh-hans": "铁拳",
      "zh-hant": "鐵拳",
      "en": "Iron Fist",
      "ja": "てつのこぶし"
    }
  },
  "90": {
    "resourceType": "ability",
    "id": 90,
    "slug": "poison-heal",
    "calcAbilityName": "Poison Heal",
    "names": {
      "zh-hans": "毒疗",
      "zh-hant": "毒療",
      "en": "Poison Heal",
      "ja": "ポイズンヒール"
    }
  },
  "91": {
    "resourceType": "ability",
    "id": 91,
    "slug": "adaptability",
    "calcAbilityName": "Adaptability",
    "names": {
      "zh-hans": "适应力",
      "zh-hant": "適應力",
      "en": "Adaptability",
      "ja": "てきおうりょく"
    }
  },
  "92": {
    "resourceType": "ability",
    "id": 92,
    "slug": "skill-link",
    "calcAbilityName": "Skill Link",
    "names": {
      "zh-hans": "连续攻击",
      "zh-hant": "連續攻擊",
      "en": "Skill Link",
      "ja": "スキルリンク"
    }
  },
  "93": {
    "resourceType": "ability",
    "id": 93,
    "slug": "hydration",
    "calcAbilityName": "Hydration",
    "names": {
      "zh-hans": "湿润之躯",
      "zh-hant": "濕潤之軀",
      "en": "Hydration",
      "ja": "うるおいボディ"
    }
  },
  "94": {
    "resourceType": "ability",
    "id": 94,
    "slug": "solar-power",
    "calcAbilityName": "Solar Power",
    "names": {
      "zh-hans": "太阳之力",
      "zh-hant": "太陽之力",
      "en": "Solar Power",
      "ja": "サンパワー"
    }
  },
  "95": {
    "resourceType": "ability",
    "id": 95,
    "slug": "quick-feet",
    "calcAbilityName": "Quick Feet",
    "names": {
      "zh-hans": "飞毛腿",
      "zh-hant": "飛毛腿",
      "en": "Quick Feet",
      "ja": "はやあし"
    }
  },
  "96": {
    "resourceType": "ability",
    "id": 96,
    "slug": "normalize",
    "calcAbilityName": "Normalize",
    "names": {
      "zh-hans": "一般皮肤",
      "zh-hant": "一般皮膚",
      "en": "Normalize",
      "ja": "ノーマルスキン"
    }
  },
  "97": {
    "resourceType": "ability",
    "id": 97,
    "slug": "sniper",
    "calcAbilityName": "Sniper",
    "names": {
      "zh-hans": "狙击手",
      "zh-hant": "狙擊手",
      "en": "Sniper",
      "ja": "スナイパー"
    }
  },
  "98": {
    "resourceType": "ability",
    "id": 98,
    "slug": "magic-guard",
    "calcAbilityName": "Magic Guard",
    "names": {
      "zh-hans": "魔法防守",
      "zh-hant": "魔法防守",
      "en": "Magic Guard",
      "ja": "マジックガード"
    }
  },
  "99": {
    "resourceType": "ability",
    "id": 99,
    "slug": "no-guard",
    "calcAbilityName": "No Guard",
    "names": {
      "zh-hans": "无防守",
      "zh-hant": "無防守",
      "en": "No Guard",
      "ja": "ノーガード"
    }
  },
  "100": {
    "resourceType": "ability",
    "id": 100,
    "slug": "stall",
    "calcAbilityName": "Stall",
    "names": {
      "zh-hans": "慢出",
      "zh-hant": "慢出",
      "en": "Stall",
      "ja": "あとだし"
    }
  },
  "101": {
    "resourceType": "ability",
    "id": 101,
    "slug": "technician",
    "calcAbilityName": "Technician",
    "names": {
      "zh-hans": "技术高手",
      "zh-hant": "技術高手",
      "en": "Technician",
      "ja": "テクニシャン"
    }
  },
  "102": {
    "resourceType": "ability",
    "id": 102,
    "slug": "leaf-guard",
    "calcAbilityName": "Leaf Guard",
    "names": {
      "zh-hans": "叶子防守",
      "zh-hant": "葉子防守",
      "en": "Leaf Guard",
      "ja": "リーフガード"
    }
  },
  "103": {
    "resourceType": "ability",
    "id": 103,
    "slug": "klutz",
    "calcAbilityName": "Klutz",
    "names": {
      "zh-hans": "笨拙",
      "zh-hant": "笨拙",
      "en": "Klutz",
      "ja": "ぶきよう"
    }
  },
  "104": {
    "resourceType": "ability",
    "id": 104,
    "slug": "mold-breaker",
    "calcAbilityName": "Mold Breaker",
    "names": {
      "zh-hans": "破格",
      "zh-hant": "破格",
      "en": "Mold Breaker",
      "ja": "かたやぶり"
    }
  },
  "105": {
    "resourceType": "ability",
    "id": 105,
    "slug": "super-luck",
    "calcAbilityName": "Super Luck",
    "names": {
      "zh-hans": "超幸运",
      "zh-hant": "超幸運",
      "en": "Super Luck",
      "ja": "きょううん"
    }
  },
  "106": {
    "resourceType": "ability",
    "id": 106,
    "slug": "aftermath",
    "calcAbilityName": "Aftermath",
    "names": {
      "zh-hans": "引爆",
      "zh-hant": "引爆",
      "en": "Aftermath",
      "ja": "ゆうばく"
    }
  },
  "107": {
    "resourceType": "ability",
    "id": 107,
    "slug": "anticipation",
    "calcAbilityName": "Anticipation",
    "names": {
      "zh-hans": "危险预知",
      "zh-hant": "危險預知",
      "en": "Anticipation",
      "ja": "きけんよち"
    }
  },
  "108": {
    "resourceType": "ability",
    "id": 108,
    "slug": "forewarn",
    "calcAbilityName": "Forewarn",
    "names": {
      "zh-hans": "预知梦",
      "zh-hant": "預知夢",
      "en": "Forewarn",
      "ja": "よちむ"
    }
  },
  "109": {
    "resourceType": "ability",
    "id": 109,
    "slug": "unaware",
    "calcAbilityName": "Unaware",
    "names": {
      "zh-hans": "纯朴",
      "zh-hant": "純樸",
      "en": "Unaware",
      "ja": "てんねん"
    }
  },
  "110": {
    "resourceType": "ability",
    "id": 110,
    "slug": "tinted-lens",
    "calcAbilityName": "Tinted Lens",
    "names": {
      "zh-hans": "有色眼镜",
      "zh-hant": "有色眼鏡",
      "en": "Tinted Lens",
      "ja": "いろめがね"
    }
  },
  "111": {
    "resourceType": "ability",
    "id": 111,
    "slug": "filter",
    "calcAbilityName": "Filter",
    "names": {
      "zh-hans": "过滤",
      "zh-hant": "過濾",
      "en": "Filter",
      "ja": "フィルター"
    }
  },
  "112": {
    "resourceType": "ability",
    "id": 112,
    "slug": "slow-start",
    "calcAbilityName": "Slow Start",
    "names": {
      "zh-hans": "慢启动",
      "zh-hant": "慢啟動",
      "en": "Slow Start",
      "ja": "スロースタート"
    }
  },
  "113": {
    "resourceType": "ability",
    "id": 113,
    "slug": "scrappy",
    "calcAbilityName": "Scrappy",
    "names": {
      "zh-hans": "胆量",
      "zh-hant": "膽量",
      "en": "Scrappy",
      "ja": "きもったま"
    }
  },
  "114": {
    "resourceType": "ability",
    "id": 114,
    "slug": "storm-drain",
    "calcAbilityName": "Storm Drain",
    "names": {
      "zh-hans": "引水",
      "zh-hant": "引水",
      "en": "Storm Drain",
      "ja": "よびみず"
    }
  },
  "115": {
    "resourceType": "ability",
    "id": 115,
    "slug": "ice-body",
    "calcAbilityName": "Ice Body",
    "names": {
      "zh-hans": "冰冻之躯",
      "zh-hant": "冰凍之軀",
      "en": "Ice Body",
      "ja": "アイスボディ"
    }
  },
  "116": {
    "resourceType": "ability",
    "id": 116,
    "slug": "solid-rock",
    "calcAbilityName": "Solid Rock",
    "names": {
      "zh-hans": "坚硬岩石",
      "zh-hant": "堅硬岩石",
      "en": "Solid Rock",
      "ja": "ハードロック"
    }
  },
  "117": {
    "resourceType": "ability",
    "id": 117,
    "slug": "snow-warning",
    "calcAbilityName": "Snow Warning",
    "names": {
      "zh-hans": "降雪",
      "zh-hant": "降雪",
      "en": "Snow Warning",
      "ja": "ゆきふらし"
    }
  },
  "118": {
    "resourceType": "ability",
    "id": 118,
    "slug": "honey-gather",
    "calcAbilityName": "Honey Gather",
    "names": {
      "zh-hans": "采蜜",
      "zh-hant": "採蜜",
      "en": "Honey Gather",
      "ja": "みつあつめ"
    }
  },
  "119": {
    "resourceType": "ability",
    "id": 119,
    "slug": "frisk",
    "calcAbilityName": "Frisk",
    "names": {
      "zh-hans": "察觉",
      "zh-hant": "察覺",
      "en": "Frisk",
      "ja": "おみとおし"
    }
  },
  "120": {
    "resourceType": "ability",
    "id": 120,
    "slug": "reckless",
    "calcAbilityName": "Reckless",
    "names": {
      "zh-hans": "舍身",
      "zh-hant": "捨身",
      "en": "Reckless",
      "ja": "すてみ"
    }
  },
  "121": {
    "resourceType": "ability",
    "id": 121,
    "slug": "multitype",
    "calcAbilityName": "Multitype",
    "names": {
      "zh-hans": "多属性",
      "zh-hant": "多屬性",
      "en": "Multitype",
      "ja": "マルチタイプ"
    }
  },
  "122": {
    "resourceType": "ability",
    "id": 122,
    "slug": "flower-gift",
    "calcAbilityName": "Flower Gift",
    "names": {
      "zh-hans": "花之礼",
      "zh-hant": "花之禮",
      "en": "Flower Gift",
      "ja": "フラワーギフト"
    }
  },
  "123": {
    "resourceType": "ability",
    "id": 123,
    "slug": "bad-dreams",
    "calcAbilityName": "Bad Dreams",
    "names": {
      "zh-hans": "梦魇",
      "zh-hant": "夢魘",
      "en": "Bad Dreams",
      "ja": "ナイトメア"
    }
  },
  "124": {
    "resourceType": "ability",
    "id": 124,
    "slug": "pickpocket",
    "calcAbilityName": "Pickpocket",
    "names": {
      "zh-hans": "顺手牵羊",
      "zh-hant": "順手牽羊",
      "en": "Pickpocket",
      "ja": "わるいてぐせ"
    }
  },
  "125": {
    "resourceType": "ability",
    "id": 125,
    "slug": "sheer-force",
    "calcAbilityName": "Sheer Force",
    "names": {
      "zh-hans": "强行",
      "zh-hant": "強行",
      "en": "Sheer Force",
      "ja": "ちからずく"
    }
  },
  "126": {
    "resourceType": "ability",
    "id": 126,
    "slug": "contrary",
    "calcAbilityName": "Contrary",
    "names": {
      "zh-hans": "唱反调",
      "zh-hant": "唱反調",
      "en": "Contrary",
      "ja": "あまのじゃく"
    }
  },
  "127": {
    "resourceType": "ability",
    "id": 127,
    "slug": "unnerve",
    "calcAbilityName": "Unnerve",
    "names": {
      "zh-hans": "紧张感",
      "zh-hant": "緊張感",
      "en": "Unnerve",
      "ja": "きんちょうかん"
    }
  },
  "128": {
    "resourceType": "ability",
    "id": 128,
    "slug": "defiant",
    "calcAbilityName": "Defiant",
    "names": {
      "zh-hans": "不服输",
      "zh-hant": "不服輸",
      "en": "Defiant",
      "ja": "まけんき"
    }
  },
  "129": {
    "resourceType": "ability",
    "id": 129,
    "slug": "defeatist",
    "calcAbilityName": "Defeatist",
    "names": {
      "zh-hans": "软弱",
      "zh-hant": "軟弱",
      "en": "Defeatist",
      "ja": "よわき"
    }
  },
  "130": {
    "resourceType": "ability",
    "id": 130,
    "slug": "cursed-body",
    "calcAbilityName": "Cursed Body",
    "names": {
      "zh-hans": "诅咒之躯",
      "zh-hant": "詛咒之軀",
      "en": "Cursed Body",
      "ja": "のろわれボディ"
    }
  },
  "131": {
    "resourceType": "ability",
    "id": 131,
    "slug": "healer",
    "calcAbilityName": "Healer",
    "names": {
      "zh-hans": "治愈之心",
      "zh-hant": "治癒之心",
      "en": "Healer",
      "ja": "いやしのこころ"
    }
  },
  "132": {
    "resourceType": "ability",
    "id": 132,
    "slug": "friend-guard",
    "calcAbilityName": "Friend Guard",
    "names": {
      "zh-hans": "友情防守",
      "zh-hant": "友情防守",
      "en": "Friend Guard",
      "ja": "フレンドガード"
    }
  },
  "133": {
    "resourceType": "ability",
    "id": 133,
    "slug": "weak-armor",
    "calcAbilityName": "Weak Armor",
    "names": {
      "zh-hans": "碎裂铠甲",
      "zh-hant": "碎裂鎧甲",
      "en": "Weak Armor",
      "ja": "くだけるよろい"
    }
  },
  "134": {
    "resourceType": "ability",
    "id": 134,
    "slug": "heavy-metal",
    "calcAbilityName": "Heavy Metal",
    "names": {
      "zh-hans": "重金属",
      "zh-hant": "重金屬",
      "en": "Heavy Metal",
      "ja": "ヘヴィメタル"
    }
  },
  "135": {
    "resourceType": "ability",
    "id": 135,
    "slug": "light-metal",
    "calcAbilityName": "Light Metal",
    "names": {
      "zh-hans": "轻金属",
      "zh-hant": "輕金屬",
      "en": "Light Metal",
      "ja": "ライトメタル"
    }
  },
  "136": {
    "resourceType": "ability",
    "id": 136,
    "slug": "multiscale",
    "calcAbilityName": "Multiscale",
    "names": {
      "zh-hans": "多重鳞片",
      "zh-hant": "多重鱗片",
      "en": "Multiscale",
      "ja": "マルチスケイル"
    }
  },
  "137": {
    "resourceType": "ability",
    "id": 137,
    "slug": "toxic-boost",
    "calcAbilityName": "Toxic Boost",
    "names": {
      "zh-hans": "中毒激升",
      "zh-hant": "中毒激升",
      "en": "Toxic Boost",
      "ja": "どくぼうそう"
    }
  },
  "138": {
    "resourceType": "ability",
    "id": 138,
    "slug": "flare-boost",
    "calcAbilityName": "Flare Boost",
    "names": {
      "zh-hans": "受热激升",
      "zh-hant": "受熱激升",
      "en": "Flare Boost",
      "ja": "ねつぼうそう"
    }
  },
  "139": {
    "resourceType": "ability",
    "id": 139,
    "slug": "harvest",
    "calcAbilityName": "Harvest",
    "names": {
      "zh-hans": "收获",
      "zh-hant": "收穫",
      "en": "Harvest",
      "ja": "しゅうかく"
    }
  },
  "140": {
    "resourceType": "ability",
    "id": 140,
    "slug": "telepathy",
    "calcAbilityName": "Telepathy",
    "names": {
      "zh-hans": "心灵感应",
      "zh-hant": "心靈感應",
      "en": "Telepathy",
      "ja": "テレパシー"
    }
  },
  "141": {
    "resourceType": "ability",
    "id": 141,
    "slug": "moody",
    "calcAbilityName": "Moody",
    "names": {
      "zh-hans": "心情不定",
      "zh-hant": "心情不定",
      "en": "Moody",
      "ja": "ムラっけ"
    }
  },
  "142": {
    "resourceType": "ability",
    "id": 142,
    "slug": "overcoat",
    "calcAbilityName": "Overcoat",
    "names": {
      "zh-hans": "防尘",
      "zh-hant": "防塵",
      "en": "Overcoat",
      "ja": "ぼうじん"
    }
  },
  "143": {
    "resourceType": "ability",
    "id": 143,
    "slug": "poison-touch",
    "calcAbilityName": "Poison Touch",
    "names": {
      "zh-hans": "毒手",
      "zh-hant": "毒手",
      "en": "Poison Touch",
      "ja": "どくしゅ"
    }
  },
  "144": {
    "resourceType": "ability",
    "id": 144,
    "slug": "regenerator",
    "calcAbilityName": "Regenerator",
    "names": {
      "zh-hans": "再生力",
      "zh-hant": "再生力",
      "en": "Regenerator",
      "ja": "さいせいりょく"
    }
  },
  "145": {
    "resourceType": "ability",
    "id": 145,
    "slug": "big-pecks",
    "calcAbilityName": "Big Pecks",
    "names": {
      "zh-hans": "健壮胸肌",
      "zh-hant": "健壯胸肌",
      "en": "Big Pecks",
      "ja": "はとむね"
    }
  },
  "146": {
    "resourceType": "ability",
    "id": 146,
    "slug": "sand-rush",
    "calcAbilityName": "Sand Rush",
    "names": {
      "zh-hans": "拨沙",
      "zh-hant": "撥沙",
      "en": "Sand Rush",
      "ja": "すなかき"
    }
  },
  "147": {
    "resourceType": "ability",
    "id": 147,
    "slug": "wonder-skin",
    "calcAbilityName": "Wonder Skin",
    "names": {
      "zh-hans": "奇迹皮肤",
      "zh-hant": "奇跡皮膚",
      "en": "Wonder Skin",
      "ja": "ミラクルスキン"
    }
  },
  "148": {
    "resourceType": "ability",
    "id": 148,
    "slug": "analytic",
    "calcAbilityName": "Analytic",
    "names": {
      "zh-hans": "分析",
      "zh-hant": "分析",
      "en": "Analytic",
      "ja": "アナライズ"
    }
  },
  "149": {
    "resourceType": "ability",
    "id": 149,
    "slug": "illusion",
    "calcAbilityName": "Illusion",
    "names": {
      "zh-hans": "幻觉",
      "zh-hant": "幻覺",
      "en": "Illusion",
      "ja": "イリュージョン"
    }
  },
  "150": {
    "resourceType": "ability",
    "id": 150,
    "slug": "imposter",
    "calcAbilityName": "Imposter",
    "names": {
      "zh-hans": "变身者",
      "zh-hant": "變身者",
      "en": "Imposter",
      "ja": "かわりもの"
    }
  },
  "151": {
    "resourceType": "ability",
    "id": 151,
    "slug": "infiltrator",
    "calcAbilityName": "Infiltrator",
    "names": {
      "zh-hans": "穿透",
      "zh-hant": "穿透",
      "en": "Infiltrator",
      "ja": "すりぬけ"
    }
  },
  "152": {
    "resourceType": "ability",
    "id": 152,
    "slug": "mummy",
    "calcAbilityName": "Mummy",
    "names": {
      "zh-hans": "木乃伊",
      "zh-hant": "木乃伊",
      "en": "Mummy",
      "ja": "ミイラ"
    }
  },
  "153": {
    "resourceType": "ability",
    "id": 153,
    "slug": "moxie",
    "calcAbilityName": "Moxie",
    "names": {
      "zh-hans": "自信过度",
      "zh-hant": "自信過度",
      "en": "Moxie",
      "ja": "じしんかじょう"
    }
  },
  "154": {
    "resourceType": "ability",
    "id": 154,
    "slug": "justified",
    "calcAbilityName": "Justified",
    "names": {
      "zh-hans": "正义之心",
      "zh-hant": "正義之心",
      "en": "Justified",
      "ja": "せいぎのこころ"
    }
  },
  "155": {
    "resourceType": "ability",
    "id": 155,
    "slug": "rattled",
    "calcAbilityName": "Rattled",
    "names": {
      "zh-hans": "胆怯",
      "zh-hant": "膽怯",
      "en": "Rattled",
      "ja": "びびり"
    }
  },
  "156": {
    "resourceType": "ability",
    "id": 156,
    "slug": "magic-bounce",
    "calcAbilityName": "Magic Bounce",
    "names": {
      "zh-hans": "魔法镜",
      "zh-hant": "魔法鏡",
      "en": "Magic Bounce",
      "ja": "マジックミラー"
    }
  },
  "157": {
    "resourceType": "ability",
    "id": 157,
    "slug": "sap-sipper",
    "calcAbilityName": "Sap Sipper",
    "names": {
      "zh-hans": "食草",
      "zh-hant": "食草",
      "en": "Sap Sipper",
      "ja": "そうしょく"
    }
  },
  "158": {
    "resourceType": "ability",
    "id": 158,
    "slug": "prankster",
    "calcAbilityName": "Prankster",
    "names": {
      "zh-hans": "恶作剧之心",
      "zh-hant": "惡作劇之心",
      "en": "Prankster",
      "ja": "いたずらごころ"
    }
  },
  "159": {
    "resourceType": "ability",
    "id": 159,
    "slug": "sand-force",
    "calcAbilityName": "Sand Force",
    "names": {
      "zh-hans": "沙之力",
      "zh-hant": "沙之力",
      "en": "Sand Force",
      "ja": "すなのちから"
    }
  },
  "160": {
    "resourceType": "ability",
    "id": 160,
    "slug": "iron-barbs",
    "calcAbilityName": "Iron Barbs",
    "names": {
      "zh-hans": "铁刺",
      "zh-hant": "鐵刺",
      "en": "Iron Barbs",
      "ja": "てつのトゲ"
    }
  },
  "161": {
    "resourceType": "ability",
    "id": 161,
    "slug": "zen-mode",
    "calcAbilityName": "Zen Mode",
    "names": {
      "zh-hans": "达摩模式",
      "zh-hant": "達摩模式",
      "en": "Zen Mode",
      "ja": "ダルマモード"
    }
  },
  "162": {
    "resourceType": "ability",
    "id": 162,
    "slug": "victory-star",
    "calcAbilityName": "Victory Star",
    "names": {
      "zh-hans": "胜利之星",
      "zh-hant": "勝利之星",
      "en": "Victory Star",
      "ja": "しょうりのほし"
    }
  },
  "163": {
    "resourceType": "ability",
    "id": 163,
    "slug": "turboblaze",
    "calcAbilityName": "Turboblaze",
    "names": {
      "zh-hans": "涡轮火焰",
      "zh-hant": "渦輪火焰",
      "en": "Turboblaze",
      "ja": "ターボブレイズ"
    }
  },
  "164": {
    "resourceType": "ability",
    "id": 164,
    "slug": "teravolt",
    "calcAbilityName": "Teravolt",
    "names": {
      "zh-hans": "兆级电压",
      "zh-hant": "兆級電壓",
      "en": "Teravolt",
      "ja": "テラボルテージ"
    }
  },
  "165": {
    "resourceType": "ability",
    "id": 165,
    "slug": "aroma-veil",
    "calcAbilityName": "Aroma Veil",
    "names": {
      "zh-hans": "芳香幕",
      "zh-hant": "芳香幕",
      "en": "Aroma Veil",
      "ja": "アロマベール"
    }
  },
  "166": {
    "resourceType": "ability",
    "id": 166,
    "slug": "flower-veil",
    "calcAbilityName": "Flower Veil",
    "names": {
      "zh-hans": "花幕",
      "zh-hant": "花幕",
      "en": "Flower Veil",
      "ja": "フラワーベール"
    }
  },
  "167": {
    "resourceType": "ability",
    "id": 167,
    "slug": "cheek-pouch",
    "calcAbilityName": "Cheek Pouch",
    "names": {
      "zh-hans": "颊囊",
      "zh-hant": "頰囊",
      "en": "Cheek Pouch",
      "ja": "ほおぶくろ"
    }
  },
  "168": {
    "resourceType": "ability",
    "id": 168,
    "slug": "protean",
    "calcAbilityName": "Protean",
    "names": {
      "zh-hans": "变幻自如",
      "zh-hant": "變幻自如",
      "en": "Protean",
      "ja": "へんげんじざい"
    }
  },
  "169": {
    "resourceType": "ability",
    "id": 169,
    "slug": "fur-coat",
    "calcAbilityName": "Fur Coat",
    "names": {
      "zh-hans": "毛皮大衣",
      "zh-hant": "毛皮大衣",
      "en": "Fur Coat",
      "ja": "ファーコート"
    }
  },
  "170": {
    "resourceType": "ability",
    "id": 170,
    "slug": "magician",
    "calcAbilityName": "Magician",
    "names": {
      "zh-hans": "魔术师",
      "zh-hant": "魔術師",
      "en": "Magician",
      "ja": "マジシャン"
    }
  },
  "171": {
    "resourceType": "ability",
    "id": 171,
    "slug": "bulletproof",
    "calcAbilityName": "Bulletproof",
    "names": {
      "zh-hans": "防弹",
      "zh-hant": "防彈",
      "en": "Bulletproof",
      "ja": "ぼうだん"
    }
  },
  "172": {
    "resourceType": "ability",
    "id": 172,
    "slug": "competitive",
    "calcAbilityName": "Competitive",
    "names": {
      "zh-hans": "好胜",
      "zh-hant": "好勝",
      "en": "Competitive",
      "ja": "かちき"
    }
  },
  "173": {
    "resourceType": "ability",
    "id": 173,
    "slug": "strong-jaw",
    "calcAbilityName": "Strong Jaw",
    "names": {
      "zh-hans": "强壮之颚",
      "zh-hant": "強壯之顎",
      "en": "Strong Jaw",
      "ja": "がんじょうあご"
    }
  },
  "174": {
    "resourceType": "ability",
    "id": 174,
    "slug": "refrigerate",
    "calcAbilityName": "Refrigerate",
    "names": {
      "zh-hans": "冰冻皮肤",
      "zh-hant": "冰凍皮膚",
      "en": "Refrigerate",
      "ja": "フリーズスキン"
    }
  },
  "175": {
    "resourceType": "ability",
    "id": 175,
    "slug": "sweet-veil",
    "calcAbilityName": "Sweet Veil",
    "names": {
      "zh-hans": "甜幕",
      "zh-hant": "甜幕",
      "en": "Sweet Veil",
      "ja": "スイートベール"
    }
  },
  "176": {
    "resourceType": "ability",
    "id": 176,
    "slug": "stance-change",
    "calcAbilityName": "Stance Change",
    "names": {
      "zh-hans": "战斗切换",
      "zh-hant": "戰鬥切換",
      "en": "Stance Change",
      "ja": "バトルスイッチ"
    }
  },
  "177": {
    "resourceType": "ability",
    "id": 177,
    "slug": "gale-wings",
    "calcAbilityName": "Gale Wings",
    "names": {
      "zh-hans": "疾风之翼",
      "zh-hant": "疾風之翼",
      "en": "Gale Wings",
      "ja": "はやてのつばさ"
    }
  },
  "178": {
    "resourceType": "ability",
    "id": 178,
    "slug": "mega-launcher",
    "calcAbilityName": "Mega Launcher",
    "names": {
      "zh-hans": "超级发射器",
      "zh-hant": "超級發射器",
      "en": "Mega Launcher",
      "ja": "メガランチャー"
    }
  },
  "179": {
    "resourceType": "ability",
    "id": 179,
    "slug": "grass-pelt",
    "calcAbilityName": "Grass Pelt",
    "names": {
      "zh-hans": "草之毛皮",
      "zh-hant": "草之毛皮",
      "en": "Grass Pelt",
      "ja": "くさのけがわ"
    }
  },
  "180": {
    "resourceType": "ability",
    "id": 180,
    "slug": "symbiosis",
    "calcAbilityName": "Symbiosis",
    "names": {
      "zh-hans": "共生",
      "zh-hant": "共生",
      "en": "Symbiosis",
      "ja": "きょうせい"
    }
  },
  "181": {
    "resourceType": "ability",
    "id": 181,
    "slug": "tough-claws",
    "calcAbilityName": "Tough Claws",
    "names": {
      "zh-hans": "硬爪",
      "zh-hant": "硬爪",
      "en": "Tough Claws",
      "ja": "かたいツメ"
    }
  },
  "182": {
    "resourceType": "ability",
    "id": 182,
    "slug": "pixilate",
    "calcAbilityName": "Pixilate",
    "names": {
      "zh-hans": "妖精皮肤",
      "zh-hant": "妖精皮膚",
      "en": "Pixilate",
      "ja": "フェアリースキン"
    }
  },
  "183": {
    "resourceType": "ability",
    "id": 183,
    "slug": "gooey",
    "calcAbilityName": "Gooey",
    "names": {
      "zh-hans": "黏滑",
      "zh-hant": "黏滑",
      "en": "Gooey",
      "ja": "ぬめぬめ"
    }
  },
  "184": {
    "resourceType": "ability",
    "id": 184,
    "slug": "aerilate",
    "calcAbilityName": "Aerilate",
    "names": {
      "zh-hans": "飞行皮肤",
      "zh-hant": "飛行皮膚",
      "en": "Aerilate",
      "ja": "スカイスキン"
    }
  },
  "185": {
    "resourceType": "ability",
    "id": 185,
    "slug": "parental-bond",
    "calcAbilityName": "Parental Bond",
    "names": {
      "zh-hans": "亲子爱",
      "zh-hant": "親子愛",
      "en": "Parental Bond",
      "ja": "おやこあい"
    }
  },
  "186": {
    "resourceType": "ability",
    "id": 186,
    "slug": "dark-aura",
    "calcAbilityName": "Dark Aura",
    "names": {
      "zh-hans": "暗黑气场",
      "zh-hant": "暗黑氣場",
      "en": "Dark Aura",
      "ja": "ダークオーラ"
    }
  },
  "187": {
    "resourceType": "ability",
    "id": 187,
    "slug": "fairy-aura",
    "calcAbilityName": "Fairy Aura",
    "names": {
      "zh-hans": "妖精气场",
      "zh-hant": "妖精氣場",
      "en": "Fairy Aura",
      "ja": "フェアリーオーラ"
    }
  },
  "188": {
    "resourceType": "ability",
    "id": 188,
    "slug": "aura-break",
    "calcAbilityName": "Aura Break",
    "names": {
      "zh-hans": "气场破坏",
      "zh-hant": "氣場破壞",
      "en": "Aura Break",
      "ja": "オーラブレイク"
    }
  },
  "189": {
    "resourceType": "ability",
    "id": 189,
    "slug": "primordial-sea",
    "calcAbilityName": "Primordial Sea",
    "names": {
      "zh-hans": "始源之海",
      "zh-hant": "始源之海",
      "en": "Primordial Sea",
      "ja": "はじまりのうみ"
    }
  },
  "190": {
    "resourceType": "ability",
    "id": 190,
    "slug": "desolate-land",
    "calcAbilityName": "Desolate Land",
    "names": {
      "zh-hans": "终结之地",
      "zh-hant": "終結之地",
      "en": "Desolate Land",
      "ja": "おわりのだいち"
    }
  },
  "191": {
    "resourceType": "ability",
    "id": 191,
    "slug": "delta-stream",
    "calcAbilityName": "Delta Stream",
    "names": {
      "zh-hans": "德尔塔气流",
      "zh-hant": "德爾塔氣流",
      "en": "Delta Stream",
      "ja": "デルタストリーム"
    }
  },
  "192": {
    "resourceType": "ability",
    "id": 192,
    "slug": "stamina",
    "calcAbilityName": "Stamina",
    "names": {
      "zh-hans": "持久力",
      "zh-hant": "持久力",
      "en": "Stamina",
      "ja": "じきゅうりょく"
    }
  },
  "193": {
    "resourceType": "ability",
    "id": 193,
    "slug": "wimp-out",
    "calcAbilityName": "Wimp Out",
    "names": {
      "zh-hans": "跃跃欲逃",
      "zh-hant": "躍躍欲逃",
      "en": "Wimp Out",
      "ja": "にげごし"
    }
  },
  "194": {
    "resourceType": "ability",
    "id": 194,
    "slug": "emergency-exit",
    "calcAbilityName": "Emergency Exit",
    "names": {
      "zh-hans": "危险回避",
      "zh-hant": "危險迴避",
      "en": "Emergency Exit",
      "ja": "ききかいひ"
    }
  },
  "195": {
    "resourceType": "ability",
    "id": 195,
    "slug": "water-compaction",
    "calcAbilityName": "Water Compaction",
    "names": {
      "zh-hans": "遇水凝固",
      "zh-hant": "遇水凝固",
      "en": "Water Compaction",
      "ja": "みずがため"
    }
  },
  "196": {
    "resourceType": "ability",
    "id": 196,
    "slug": "merciless",
    "calcAbilityName": "Merciless",
    "names": {
      "zh-hans": "不仁不义",
      "zh-hant": "不仁不義",
      "en": "Merciless",
      "ja": "ひとでなし"
    }
  },
  "197": {
    "resourceType": "ability",
    "id": 197,
    "slug": "shields-down",
    "calcAbilityName": "Shields Down",
    "names": {
      "zh-hans": "界限盾壳",
      "zh-hant": "界限盾殼",
      "en": "Shields Down",
      "ja": "リミットシールド"
    }
  },
  "198": {
    "resourceType": "ability",
    "id": 198,
    "slug": "stakeout",
    "calcAbilityName": "Stakeout",
    "names": {
      "zh-hans": "蹲守",
      "zh-hant": "監視",
      "en": "Stakeout",
      "ja": "はりこみ"
    }
  },
  "199": {
    "resourceType": "ability",
    "id": 199,
    "slug": "water-bubble",
    "calcAbilityName": "Water Bubble",
    "names": {
      "zh-hans": "水泡",
      "zh-hant": "水泡",
      "en": "Water Bubble",
      "ja": "すいほう"
    }
  },
  "200": {
    "resourceType": "ability",
    "id": 200,
    "slug": "steelworker",
    "calcAbilityName": "Steelworker",
    "names": {
      "zh-hans": "钢能力者",
      "zh-hant": "鋼能力者",
      "en": "Steelworker",
      "ja": "はがねつかい"
    }
  },
  "201": {
    "resourceType": "ability",
    "id": 201,
    "slug": "berserk",
    "calcAbilityName": "Berserk",
    "names": {
      "zh-hans": "怒火冲天",
      "zh-hant": "怒火沖天",
      "en": "Berserk",
      "ja": "ぎゃくじょう"
    }
  },
  "202": {
    "resourceType": "ability",
    "id": 202,
    "slug": "slush-rush",
    "calcAbilityName": "Slush Rush",
    "names": {
      "zh-hans": "拨雪",
      "zh-hant": "撥雪",
      "en": "Slush Rush",
      "ja": "ゆきかき"
    }
  },
  "203": {
    "resourceType": "ability",
    "id": 203,
    "slug": "long-reach",
    "calcAbilityName": "Long Reach",
    "names": {
      "zh-hans": "远隔",
      "zh-hant": "遠隔",
      "en": "Long Reach",
      "ja": "えんかく"
    }
  },
  "204": {
    "resourceType": "ability",
    "id": 204,
    "slug": "liquid-voice",
    "calcAbilityName": "Liquid Voice",
    "names": {
      "zh-hans": "湿润之声",
      "zh-hant": "濕潤之聲",
      "en": "Liquid Voice",
      "ja": "うるおいボイス"
    }
  },
  "205": {
    "resourceType": "ability",
    "id": 205,
    "slug": "triage",
    "calcAbilityName": "Triage",
    "names": {
      "zh-hans": "先行治疗",
      "zh-hant": "先行治療",
      "en": "Triage",
      "ja": "ヒーリングシフト"
    }
  },
  "206": {
    "resourceType": "ability",
    "id": 206,
    "slug": "galvanize",
    "calcAbilityName": "Galvanize",
    "names": {
      "zh-hans": "电气皮肤",
      "zh-hant": "電氣皮膚",
      "en": "Galvanize",
      "ja": "エレキスキン"
    }
  },
  "207": {
    "resourceType": "ability",
    "id": 207,
    "slug": "surge-surfer",
    "calcAbilityName": "Surge Surfer",
    "names": {
      "zh-hans": "冲浪之尾",
      "zh-hant": "衝浪之尾",
      "en": "Surge Surfer",
      "ja": "サーフテール"
    }
  },
  "208": {
    "resourceType": "ability",
    "id": 208,
    "slug": "schooling",
    "calcAbilityName": "Schooling",
    "names": {
      "zh-hans": "鱼群",
      "zh-hant": "魚群",
      "en": "Schooling",
      "ja": "ぎょぐん"
    }
  },
  "209": {
    "resourceType": "ability",
    "id": 209,
    "slug": "disguise",
    "calcAbilityName": "Disguise",
    "names": {
      "zh-hans": "画皮",
      "zh-hant": "畫皮",
      "en": "Disguise",
      "ja": "ばけのかわ"
    }
  },
  "210": {
    "resourceType": "ability",
    "id": 210,
    "slug": "battle-bond",
    "calcAbilityName": "Battle Bond",
    "names": {
      "zh-hans": "牵绊变身",
      "zh-hant": "牽絆變身",
      "en": "Battle Bond",
      "ja": "きずなへんげ"
    }
  },
  "211": {
    "resourceType": "ability",
    "id": 211,
    "slug": "power-construct",
    "calcAbilityName": "Power Construct",
    "names": {
      "zh-hans": "群聚变形",
      "zh-hant": "群聚變形",
      "en": "Power Construct",
      "ja": "スワームチェンジ"
    }
  },
  "212": {
    "resourceType": "ability",
    "id": 212,
    "slug": "corrosion",
    "calcAbilityName": "Corrosion",
    "names": {
      "zh-hans": "腐蚀",
      "zh-hant": "腐蝕",
      "en": "Corrosion",
      "ja": "ふしょく"
    }
  },
  "213": {
    "resourceType": "ability",
    "id": 213,
    "slug": "comatose",
    "calcAbilityName": "Comatose",
    "names": {
      "zh-hans": "绝对睡眠",
      "zh-hant": "絕對睡眠",
      "en": "Comatose",
      "ja": "ぜったいねむり"
    }
  },
  "214": {
    "resourceType": "ability",
    "id": 214,
    "slug": "queenly-majesty",
    "calcAbilityName": "Queenly Majesty",
    "names": {
      "zh-hans": "女王的威严",
      "zh-hant": "女王的威嚴",
      "en": "Queenly Majesty",
      "ja": "じょおうのいげん"
    }
  },
  "215": {
    "resourceType": "ability",
    "id": 215,
    "slug": "innards-out",
    "calcAbilityName": "Innards Out",
    "names": {
      "zh-hans": "飞出的内在物",
      "zh-hant": "飛出的內在物",
      "en": "Innards Out",
      "ja": "とびだすなかみ"
    }
  },
  "216": {
    "resourceType": "ability",
    "id": 216,
    "slug": "dancer",
    "calcAbilityName": "Dancer",
    "names": {
      "zh-hans": "舞者",
      "zh-hant": "舞者",
      "en": "Dancer",
      "ja": "おどりこ"
    }
  },
  "217": {
    "resourceType": "ability",
    "id": 217,
    "slug": "battery",
    "calcAbilityName": "Battery",
    "names": {
      "zh-hans": "蓄电池",
      "zh-hant": "蓄電池",
      "en": "Battery",
      "ja": "バッテリー"
    }
  },
  "218": {
    "resourceType": "ability",
    "id": 218,
    "slug": "fluffy",
    "calcAbilityName": "Fluffy",
    "names": {
      "zh-hans": "毛茸茸",
      "zh-hant": "毛茸茸",
      "en": "Fluffy",
      "ja": "もふもふ"
    }
  },
  "219": {
    "resourceType": "ability",
    "id": 219,
    "slug": "dazzling",
    "calcAbilityName": "Dazzling",
    "names": {
      "zh-hans": "鲜艳之躯",
      "zh-hant": "鮮艷之軀",
      "en": "Dazzling",
      "ja": "ビビッドボディ"
    }
  },
  "220": {
    "resourceType": "ability",
    "id": 220,
    "slug": "soul-heart",
    "calcAbilityName": "Soul-Heart",
    "names": {
      "zh-hans": "魂心",
      "zh-hant": "魂心",
      "en": "Soul-Heart",
      "ja": "ソウルハート"
    }
  },
  "221": {
    "resourceType": "ability",
    "id": 221,
    "slug": "tangling-hair",
    "calcAbilityName": "Tangling Hair",
    "names": {
      "zh-hans": "卷发",
      "zh-hant": "捲髮",
      "en": "Tangling Hair",
      "ja": "カーリーヘアー"
    }
  },
  "222": {
    "resourceType": "ability",
    "id": 222,
    "slug": "receiver",
    "calcAbilityName": "Receiver",
    "names": {
      "zh-hans": "接球手",
      "zh-hant": "接球手",
      "en": "Receiver",
      "ja": "レシーバー"
    }
  },
  "223": {
    "resourceType": "ability",
    "id": 223,
    "slug": "power-of-alchemy",
    "calcAbilityName": "Power of Alchemy",
    "names": {
      "zh-hans": "化学之力",
      "zh-hant": "化學之力",
      "en": "Power of Alchemy",
      "ja": "かがくのちから"
    }
  },
  "224": {
    "resourceType": "ability",
    "id": 224,
    "slug": "beast-boost",
    "calcAbilityName": "Beast Boost",
    "names": {
      "zh-hans": "异兽提升",
      "zh-hant": "異獸提升",
      "en": "Beast Boost",
      "ja": "ビーストブースト"
    }
  },
  "225": {
    "resourceType": "ability",
    "id": 225,
    "slug": "rks-system",
    "calcAbilityName": "RKS System",
    "names": {
      "zh-hans": "ＡＲ系统",
      "zh-hant": "ＡＲ系統",
      "en": "RKS System",
      "ja": "ＡＲシステム"
    }
  },
  "226": {
    "resourceType": "ability",
    "id": 226,
    "slug": "electric-surge",
    "calcAbilityName": "Electric Surge",
    "names": {
      "zh-hans": "电气制造者",
      "zh-hant": "電氣製造者",
      "en": "Electric Surge",
      "ja": "エレキメイカー"
    }
  },
  "227": {
    "resourceType": "ability",
    "id": 227,
    "slug": "psychic-surge",
    "calcAbilityName": "Psychic Surge",
    "names": {
      "zh-hans": "精神制造者",
      "zh-hant": "精神製造者",
      "en": "Psychic Surge",
      "ja": "サイコメイカー"
    }
  },
  "228": {
    "resourceType": "ability",
    "id": 228,
    "slug": "misty-surge",
    "calcAbilityName": "Misty Surge",
    "names": {
      "zh-hans": "薄雾制造者",
      "zh-hant": "薄霧製造者",
      "en": "Misty Surge",
      "ja": "ミストメイカー"
    }
  },
  "229": {
    "resourceType": "ability",
    "id": 229,
    "slug": "grassy-surge",
    "calcAbilityName": "Grassy Surge",
    "names": {
      "zh-hans": "青草制造者",
      "zh-hant": "青草製造者",
      "en": "Grassy Surge",
      "ja": "グラスメイカー"
    }
  },
  "230": {
    "resourceType": "ability",
    "id": 230,
    "slug": "full-metal-body",
    "calcAbilityName": "Full Metal Body",
    "names": {
      "zh-hans": "金属防护",
      "zh-hant": "金屬防護",
      "en": "Full Metal Body",
      "ja": "メタルプロテクト"
    }
  },
  "231": {
    "resourceType": "ability",
    "id": 231,
    "slug": "shadow-shield",
    "calcAbilityName": "Shadow Shield",
    "names": {
      "zh-hans": "幻影防守",
      "zh-hant": "幻影防守",
      "en": "Shadow Shield",
      "ja": "ファントムガード"
    }
  },
  "232": {
    "resourceType": "ability",
    "id": 232,
    "slug": "prism-armor",
    "calcAbilityName": "Prism Armor",
    "names": {
      "zh-hans": "棱镜装甲",
      "zh-hant": "稜鏡裝甲",
      "en": "Prism Armor",
      "ja": "プリズムアーマー"
    }
  },
  "233": {
    "resourceType": "ability",
    "id": 233,
    "slug": "neuroforce",
    "calcAbilityName": "Neuroforce",
    "names": {
      "zh-hans": "脑核之力",
      "zh-hant": "腦核之力",
      "en": "Neuroforce",
      "ja": "ブレインフォース"
    }
  },
  "234": {
    "resourceType": "ability",
    "id": 234,
    "slug": "intrepid-sword",
    "calcAbilityName": "Intrepid Sword",
    "names": {
      "zh-hans": "不挠之剑",
      "zh-hant": "不撓之劍",
      "en": "Intrepid Sword",
      "ja": "ふとうのけん"
    }
  },
  "235": {
    "resourceType": "ability",
    "id": 235,
    "slug": "dauntless-shield",
    "calcAbilityName": "Dauntless Shield",
    "names": {
      "zh-hans": "不屈之盾",
      "zh-hant": "不屈之盾",
      "en": "Dauntless Shield",
      "ja": "ふくつのたて"
    }
  },
  "236": {
    "resourceType": "ability",
    "id": 236,
    "slug": "libero",
    "calcAbilityName": "Libero",
    "names": {
      "zh-hans": "自由者",
      "zh-hant": "自由者",
      "en": "Libero",
      "ja": "リベロ"
    }
  },
  "237": {
    "resourceType": "ability",
    "id": 237,
    "slug": "ball-fetch",
    "calcAbilityName": "Ball Fetch",
    "names": {
      "zh-hans": "捡球",
      "zh-hant": "撿球",
      "en": "Ball Fetch",
      "ja": "たまひろい"
    }
  },
  "238": {
    "resourceType": "ability",
    "id": 238,
    "slug": "cotton-down",
    "calcAbilityName": "Cotton Down",
    "names": {
      "zh-hans": "棉絮",
      "zh-hant": "棉絮",
      "en": "Cotton Down",
      "ja": "わたげ"
    }
  },
  "239": {
    "resourceType": "ability",
    "id": 239,
    "slug": "propeller-tail",
    "calcAbilityName": "Propeller Tail",
    "names": {
      "zh-hans": "螺旋尾鳍",
      "zh-hant": "螺旋尾鰭",
      "en": "Propeller Tail",
      "ja": "スクリューおびれ"
    }
  },
  "240": {
    "resourceType": "ability",
    "id": 240,
    "slug": "mirror-armor",
    "calcAbilityName": "Mirror Armor",
    "names": {
      "zh-hans": "镜甲",
      "zh-hant": "鏡甲",
      "en": "Mirror Armor",
      "ja": "ミラーアーマー"
    }
  },
  "241": {
    "resourceType": "ability",
    "id": 241,
    "slug": "gulp-missile",
    "calcAbilityName": "Gulp Missile",
    "names": {
      "zh-hans": "一口导弹",
      "zh-hant": "一口飛彈",
      "en": "Gulp Missile",
      "ja": "うのミサイル"
    }
  },
  "242": {
    "resourceType": "ability",
    "id": 242,
    "slug": "stalwart",
    "calcAbilityName": "Stalwart",
    "names": {
      "zh-hans": "坚毅",
      "zh-hant": "堅毅",
      "en": "Stalwart",
      "ja": "すじがねいり"
    }
  },
  "243": {
    "resourceType": "ability",
    "id": 243,
    "slug": "steam-engine",
    "calcAbilityName": "Steam Engine",
    "names": {
      "zh-hans": "蒸汽机",
      "zh-hant": "蒸汽機",
      "en": "Steam Engine",
      "ja": "じょうききかん"
    }
  },
  "244": {
    "resourceType": "ability",
    "id": 244,
    "slug": "punk-rock",
    "calcAbilityName": "Punk Rock",
    "names": {
      "zh-hans": "庞克摇滚",
      "zh-hant": "龐克搖滾",
      "en": "Punk Rock",
      "ja": "パンクロック"
    }
  },
  "245": {
    "resourceType": "ability",
    "id": 245,
    "slug": "sand-spit",
    "calcAbilityName": "Sand Spit",
    "names": {
      "zh-hans": "吐沙",
      "zh-hant": "吐沙",
      "en": "Sand Spit",
      "ja": "すなはき"
    }
  },
  "246": {
    "resourceType": "ability",
    "id": 246,
    "slug": "ice-scales",
    "calcAbilityName": "Ice Scales",
    "names": {
      "zh-hans": "冰鳞粉",
      "zh-hant": "冰鱗粉",
      "en": "Ice Scales",
      "ja": "こおりのりんぷん"
    }
  },
  "247": {
    "resourceType": "ability",
    "id": 247,
    "slug": "ripen",
    "calcAbilityName": "Ripen",
    "names": {
      "zh-hans": "熟成",
      "zh-hant": "熟成",
      "en": "Ripen",
      "ja": "じゅくせい"
    }
  },
  "248": {
    "resourceType": "ability",
    "id": 248,
    "slug": "ice-face",
    "calcAbilityName": "Ice Face",
    "names": {
      "zh-hans": "结冻头",
      "zh-hant": "結凍頭",
      "en": "Ice Face",
      "ja": "アイスフェイス"
    }
  },
  "249": {
    "resourceType": "ability",
    "id": 249,
    "slug": "power-spot",
    "calcAbilityName": "Power Spot",
    "names": {
      "zh-hans": "能量点",
      "zh-hant": "能量點",
      "en": "Power Spot",
      "ja": "パワースポット"
    }
  },
  "250": {
    "resourceType": "ability",
    "id": 250,
    "slug": "mimicry",
    "calcAbilityName": "Mimicry",
    "names": {
      "zh-hans": "拟态",
      "zh-hant": "擬態",
      "en": "Mimicry",
      "ja": "ぎたい"
    }
  },
  "251": {
    "resourceType": "ability",
    "id": 251,
    "slug": "screen-cleaner",
    "calcAbilityName": "Screen Cleaner",
    "names": {
      "zh-hans": "除障",
      "zh-hant": "除障",
      "en": "Screen Cleaner",
      "ja": "バリアフリー"
    }
  },
  "252": {
    "resourceType": "ability",
    "id": 252,
    "slug": "steely-spirit",
    "calcAbilityName": "Steely Spirit",
    "names": {
      "zh-hans": "钢之意志",
      "zh-hant": "鋼之意志",
      "en": "Steely Spirit",
      "ja": "はがねのせいしん"
    }
  },
  "253": {
    "resourceType": "ability",
    "id": 253,
    "slug": "perish-body",
    "calcAbilityName": "Perish Body",
    "names": {
      "zh-hans": "灭亡之躯",
      "zh-hant": "滅亡之軀",
      "en": "Perish Body",
      "ja": "ほろびのボディ"
    }
  },
  "254": {
    "resourceType": "ability",
    "id": 254,
    "slug": "wandering-spirit",
    "calcAbilityName": "Wandering Spirit",
    "names": {
      "zh-hans": "游魂",
      "zh-hant": "遊魂",
      "en": "Wandering Spirit",
      "ja": "さまようたましい"
    }
  },
  "255": {
    "resourceType": "ability",
    "id": 255,
    "slug": "gorilla-tactics",
    "calcAbilityName": "Gorilla Tactics",
    "names": {
      "zh-hans": "一猩一意",
      "zh-hant": "一猩一意",
      "en": "Gorilla Tactics",
      "ja": "ごりむちゅう"
    }
  },
  "256": {
    "resourceType": "ability",
    "id": 256,
    "slug": "neutralizing-gas",
    "calcAbilityName": "Neutralizing Gas",
    "names": {
      "zh-hans": "化学变化气体",
      "zh-hant": "化學變化氣體",
      "en": "Neutralizing Gas",
      "ja": "かがくへんかガス"
    }
  },
  "257": {
    "resourceType": "ability",
    "id": 257,
    "slug": "pastel-veil",
    "calcAbilityName": "Pastel Veil",
    "names": {
      "zh-hans": "粉彩护幕",
      "zh-hant": "粉彩護幕",
      "en": "Pastel Veil",
      "ja": "パステルベール"
    }
  },
  "258": {
    "resourceType": "ability",
    "id": 258,
    "slug": "hunger-switch",
    "calcAbilityName": "Hunger Switch",
    "names": {
      "zh-hans": "饱了又饿",
      "zh-hant": "飽了又餓",
      "en": "Hunger Switch",
      "ja": "はらぺこスイッチ"
    }
  },
  "259": {
    "resourceType": "ability",
    "id": 259,
    "slug": "quick-draw",
    "calcAbilityName": "Quick Draw",
    "names": {
      "zh-hans": "速击",
      "zh-hant": "速擊",
      "en": "Quick Draw",
      "ja": "クイックドロウ"
    }
  },
  "260": {
    "resourceType": "ability",
    "id": 260,
    "slug": "unseen-fist",
    "calcAbilityName": "Unseen Fist",
    "names": {
      "zh-hans": "无形拳",
      "zh-hant": "無形拳",
      "en": "Unseen Fist",
      "ja": "ふかしのこぶし"
    }
  },
  "261": {
    "resourceType": "ability",
    "id": 261,
    "slug": "curious-medicine",
    "calcAbilityName": "Curious Medicine",
    "names": {
      "zh-hans": "怪药",
      "zh-hant": "怪藥",
      "en": "Curious Medicine",
      "ja": "きみょうなくすり"
    }
  },
  "262": {
    "resourceType": "ability",
    "id": 262,
    "slug": "transistor",
    "calcAbilityName": "Transistor",
    "names": {
      "zh-hans": "电晶体",
      "zh-hant": "電晶體",
      "en": "Transistor",
      "ja": "トランジスタ"
    }
  },
  "263": {
    "resourceType": "ability",
    "id": 263,
    "slug": "dragons-maw",
    "calcAbilityName": "Dragon’s Maw",
    "names": {
      "zh-hans": "龙颚",
      "zh-hant": "龍顎",
      "en": "Dragon’s Maw",
      "ja": "りゅうのあぎと"
    }
  },
  "264": {
    "resourceType": "ability",
    "id": 264,
    "slug": "chilling-neigh",
    "calcAbilityName": "Chilling Neigh",
    "names": {
      "zh-hans": "苍白嘶鸣",
      "zh-hant": "蒼白嘶鳴",
      "en": "Chilling Neigh",
      "ja": "しろのいななき"
    }
  },
  "265": {
    "resourceType": "ability",
    "id": 265,
    "slug": "grim-neigh",
    "calcAbilityName": "Grim Neigh",
    "names": {
      "zh-hans": "漆黑嘶鸣",
      "zh-hant": "漆黑嘶鳴",
      "en": "Grim Neigh",
      "ja": "くろのいななき"
    }
  },
  "266": {
    "resourceType": "ability",
    "id": 266,
    "slug": "as-one-glastrier",
    "calcAbilityName": "As One (Glastrier)",
    "names": {
      "zh-hans": "人马一体",
      "zh-hant": "人馬一體",
      "en": "As One",
      "ja": "じんばいったい"
    }
  },
  "267": {
    "resourceType": "ability",
    "id": 267,
    "slug": "as-one-spectrier",
    "calcAbilityName": "As One (Spectrier)",
    "names": {
      "zh-hans": "人马一体",
      "zh-hant": "人馬一體",
      "en": "As One",
      "ja": "じんばいったい"
    }
  },
  "268": {
    "resourceType": "ability",
    "id": 268,
    "slug": "lingering-aroma",
    "calcAbilityName": "Lingering Aroma",
    "names": {
      "zh-hans": "甩不掉的气味",
      "zh-hant": "甩不掉的氣味",
      "en": "Lingering Aroma",
      "ja": "とれないにおい"
    }
  },
  "269": {
    "resourceType": "ability",
    "id": 269,
    "slug": "seed-sower",
    "calcAbilityName": "Seed Sower",
    "names": {
      "zh-hans": "掉出种子",
      "zh-hant": "掉出種子",
      "en": "Seed Sower",
      "ja": "こぼれダネ"
    }
  },
  "270": {
    "resourceType": "ability",
    "id": 270,
    "slug": "thermal-exchange",
    "calcAbilityName": "Thermal Exchange",
    "names": {
      "zh-hans": "热交换",
      "zh-hant": "熱交換",
      "en": "Thermal Exchange",
      "ja": "ねつこうかん"
    }
  },
  "271": {
    "resourceType": "ability",
    "id": 271,
    "slug": "anger-shell",
    "calcAbilityName": "Anger Shell",
    "names": {
      "zh-hans": "愤怒甲壳",
      "zh-hant": "憤怒甲殼",
      "en": "Anger Shell",
      "ja": "いかりのこうら"
    }
  },
  "272": {
    "resourceType": "ability",
    "id": 272,
    "slug": "purifying-salt",
    "calcAbilityName": "Purifying Salt",
    "names": {
      "zh-hans": "洁净之盐",
      "zh-hant": "潔淨之鹽",
      "en": "Purifying Salt",
      "ja": "きよめのしお"
    }
  },
  "273": {
    "resourceType": "ability",
    "id": 273,
    "slug": "well-baked-body",
    "calcAbilityName": "Well-Baked Body",
    "names": {
      "zh-hans": "焦香之躯",
      "zh-hant": "焦香之軀",
      "en": "Well-Baked Body",
      "ja": "こんがりボディ"
    }
  },
  "274": {
    "resourceType": "ability",
    "id": 274,
    "slug": "wind-rider",
    "calcAbilityName": "Wind Rider",
    "names": {
      "zh-hans": "乘风",
      "zh-hant": "乘風",
      "en": "Wind Rider",
      "ja": "かぜのり"
    }
  },
  "275": {
    "resourceType": "ability",
    "id": 275,
    "slug": "guard-dog",
    "calcAbilityName": "Guard Dog",
    "names": {
      "zh-hans": "看门犬",
      "zh-hant": "看門犬",
      "en": "Guard Dog",
      "ja": "ばんけん"
    }
  },
  "276": {
    "resourceType": "ability",
    "id": 276,
    "slug": "rocky-payload",
    "calcAbilityName": "Rocky Payload",
    "names": {
      "zh-hans": "搬岩",
      "zh-hant": "搬岩",
      "en": "Rocky Payload",
      "ja": "いわはこび"
    }
  },
  "277": {
    "resourceType": "ability",
    "id": 277,
    "slug": "wind-power",
    "calcAbilityName": "Wind Power",
    "names": {
      "zh-hans": "风力发电",
      "zh-hant": "風力發電",
      "en": "Wind Power",
      "ja": "ふうりょくでんき"
    }
  },
  "278": {
    "resourceType": "ability",
    "id": 278,
    "slug": "zero-to-hero",
    "calcAbilityName": "Zero to Hero",
    "names": {
      "zh-hans": "全能变身",
      "zh-hant": "全能變身",
      "en": "Zero to Hero",
      "ja": "マイティチェンジ"
    }
  },
  "279": {
    "resourceType": "ability",
    "id": 279,
    "slug": "commander",
    "calcAbilityName": "Commander",
    "names": {
      "zh-hans": "发号施令",
      "zh-hant": "發號施令",
      "en": "Commander",
      "ja": "しれいとう"
    }
  },
  "280": {
    "resourceType": "ability",
    "id": 280,
    "slug": "electromorphosis",
    "calcAbilityName": "Electromorphosis",
    "names": {
      "zh-hans": "电力转换",
      "zh-hant": "電力轉換",
      "en": "Electromorphosis",
      "ja": "でんきにかえる"
    }
  },
  "281": {
    "resourceType": "ability",
    "id": 281,
    "slug": "protosynthesis",
    "calcAbilityName": "Protosynthesis",
    "names": {
      "zh-hans": "古代活性",
      "zh-hant": "古代活性",
      "en": "Protosynthesis",
      "ja": "こだいかっせい"
    }
  },
  "282": {
    "resourceType": "ability",
    "id": 282,
    "slug": "quark-drive",
    "calcAbilityName": "Quark Drive",
    "names": {
      "zh-hans": "夸克充能",
      "zh-hant": "夸克充能",
      "en": "Quark Drive",
      "ja": "クォークチャージ"
    }
  },
  "283": {
    "resourceType": "ability",
    "id": 283,
    "slug": "good-as-gold",
    "calcAbilityName": "Good as Gold",
    "names": {
      "zh-hans": "黄金之躯",
      "zh-hant": "黃金之軀",
      "en": "Good as Gold",
      "ja": "おうごんのからだ"
    }
  },
  "284": {
    "resourceType": "ability",
    "id": 284,
    "slug": "vessel-of-ruin",
    "calcAbilityName": "Vessel of Ruin",
    "names": {
      "zh-hans": "灾祸之鼎",
      "zh-hant": "災禍之鼎",
      "en": "Vessel of Ruin",
      "ja": "わざわいのうつわ"
    }
  },
  "285": {
    "resourceType": "ability",
    "id": 285,
    "slug": "sword-of-ruin",
    "calcAbilityName": "Sword of Ruin",
    "names": {
      "zh-hans": "灾祸之剑",
      "zh-hant": "災禍之劍",
      "en": "Sword of Ruin",
      "ja": "わざわいのつるぎ"
    }
  },
  "286": {
    "resourceType": "ability",
    "id": 286,
    "slug": "tablets-of-ruin",
    "calcAbilityName": "Tablets of Ruin",
    "names": {
      "zh-hans": "灾祸之简",
      "zh-hant": "災禍之簡",
      "en": "Tablets of Ruin",
      "ja": "わざわいのおふだ"
    }
  },
  "287": {
    "resourceType": "ability",
    "id": 287,
    "slug": "beads-of-ruin",
    "calcAbilityName": "Beads of Ruin",
    "names": {
      "zh-hans": "灾祸之玉",
      "zh-hant": "災禍之玉",
      "en": "Beads of Ruin",
      "ja": "わざわいのたま"
    }
  },
  "288": {
    "resourceType": "ability",
    "id": 288,
    "slug": "orichalcum-pulse",
    "calcAbilityName": "Orichalcum Pulse",
    "names": {
      "zh-hans": "绯红脉动",
      "zh-hant": "緋紅脈動",
      "en": "Orichalcum Pulse",
      "ja": "ひひいろのこどう"
    }
  },
  "289": {
    "resourceType": "ability",
    "id": 289,
    "slug": "hadron-engine",
    "calcAbilityName": "Hadron Engine",
    "names": {
      "zh-hans": "强子引擎",
      "zh-hant": "強子引擎",
      "en": "Hadron Engine",
      "ja": "ハドロンエンジン"
    }
  },
  "290": {
    "resourceType": "ability",
    "id": 290,
    "slug": "opportunist",
    "calcAbilityName": "Opportunist",
    "names": {
      "zh-hans": "跟风",
      "zh-hant": "跟風",
      "en": "Opportunist",
      "ja": "びんじょう"
    }
  },
  "291": {
    "resourceType": "ability",
    "id": 291,
    "slug": "cud-chew",
    "calcAbilityName": "Cud Chew",
    "names": {
      "zh-hans": "反刍",
      "zh-hant": "反芻",
      "en": "Cud Chew",
      "ja": "はんすう"
    }
  },
  "292": {
    "resourceType": "ability",
    "id": 292,
    "slug": "sharpness",
    "calcAbilityName": "Sharpness",
    "names": {
      "zh-hans": "锋锐",
      "zh-hant": "鋒銳",
      "en": "Sharpness",
      "ja": "きれあじ"
    }
  },
  "293": {
    "resourceType": "ability",
    "id": 293,
    "slug": "supreme-overlord",
    "calcAbilityName": "Supreme Overlord",
    "names": {
      "zh-hans": "大将",
      "zh-hant": "大將",
      "en": "Supreme Overlord",
      "ja": "そうだいしょう"
    }
  },
  "294": {
    "resourceType": "ability",
    "id": 294,
    "slug": "costar",
    "calcAbilityName": "Costar",
    "names": {
      "zh-hans": "同台共演",
      "zh-hant": "同台共演",
      "en": "Costar",
      "ja": "きょうえん"
    }
  },
  "295": {
    "resourceType": "ability",
    "id": 295,
    "slug": "toxic-debris",
    "calcAbilityName": "Toxic Debris",
    "names": {
      "zh-hans": "毒满地",
      "zh-hant": "毒滿地",
      "en": "Toxic Debris",
      "ja": "どくげしょう"
    }
  },
  "296": {
    "resourceType": "ability",
    "id": 296,
    "slug": "armor-tail",
    "calcAbilityName": "Armor Tail",
    "names": {
      "zh-hans": "尾甲",
      "zh-hant": "尾甲",
      "en": "Armor Tail",
      "ja": "テイルアーマー"
    }
  },
  "297": {
    "resourceType": "ability",
    "id": 297,
    "slug": "earth-eater",
    "calcAbilityName": "Earth Eater",
    "names": {
      "zh-hans": "食土",
      "zh-hant": "食土",
      "en": "Earth Eater",
      "ja": "どしょく"
    }
  },
  "298": {
    "resourceType": "ability",
    "id": 298,
    "slug": "mycelium-might",
    "calcAbilityName": "Mycelium Might",
    "names": {
      "zh-hans": "菌丝之力",
      "zh-hant": "菌絲之力",
      "en": "Mycelium Might",
      "ja": "きんしのちから"
    }
  },
  "299": {
    "resourceType": "ability",
    "id": 299,
    "slug": "minds-eye",
    "calcAbilityName": "Mind’s Eye",
    "names": {
      "zh-hans": "心眼",
      "zh-hant": "心眼",
      "en": "Mind’s Eye",
      "ja": "しんがん"
    }
  },
  "300": {
    "resourceType": "ability",
    "id": 300,
    "slug": "supersweet-syrup",
    "calcAbilityName": "Supersweet Syrup",
    "names": {
      "zh-hans": "甘露之蜜",
      "zh-hant": "甘露之蜜",
      "en": "Supersweet Syrup",
      "ja": "かんろなミツ"
    }
  },
  "301": {
    "resourceType": "ability",
    "id": 301,
    "slug": "hospitality",
    "calcAbilityName": "Hospitality",
    "names": {
      "zh-hans": "款待",
      "zh-hant": "款待",
      "en": "Hospitality",
      "ja": "おもてなし"
    }
  },
  "302": {
    "resourceType": "ability",
    "id": 302,
    "slug": "toxic-chain",
    "calcAbilityName": "Toxic Chain",
    "names": {
      "zh-hans": "毒锁链",
      "zh-hant": "毒鎖鏈",
      "en": "Toxic Chain",
      "ja": "どくのくさり"
    }
  },
  "304": {
    "resourceType": "ability",
    "id": 304,
    "slug": "tera-shift",
    "calcAbilityName": "Tera Shift",
    "names": {
      "zh-hans": "太晶变形",
      "zh-hant": "太晶變形",
      "en": "Tera Shift",
      "ja": "テラスチェンジ"
    }
  },
  "305": {
    "resourceType": "ability",
    "id": 305,
    "slug": "tera-shell",
    "calcAbilityName": "Tera Shell",
    "names": {
      "zh-hans": "太晶甲壳",
      "zh-hant": "太晶甲殼",
      "en": "Tera Shell",
      "ja": "テラスシェル"
    }
  },
  "306": {
    "resourceType": "ability",
    "id": 306,
    "slug": "teraform-zero",
    "calcAbilityName": "Teraform Zero",
    "names": {
      "zh-hans": "归零化境",
      "zh-hant": "歸零化境",
      "en": "Teraform Zero",
      "ja": "ゼロフォーミング"
    }
  },
  "307": {
    "resourceType": "ability",
    "id": 307,
    "slug": "poison-puppeteer",
    "calcAbilityName": "Poison Puppeteer",
    "names": {
      "zh-hans": "毒傀儡",
      "zh-hant": "毒傀儡",
      "en": "Poison Puppeteer",
      "ja": "どくくぐつ"
    }
  },
  "309": {
    "resourceType": "ability",
    "id": 309,
    "slug": "dragonize",
    "calcAbilityName": "Dragonize",
    "names": {
      "zh-hans": "龙皮肤",
      "zh-hant": "龍皮膚",
      "en": "Dragonize",
      "ja": "ドラゴンスキン"
    }
  },
  "310": {
    "resourceType": "ability",
    "id": 310,
    "slug": "mega-sol",
    "calcAbilityName": "Mega Sol",
    "names": {
      "zh-hans": "超级日光",
      "zh-hant": "超級日光",
      "en": "Mega Sol",
      "ja": "メガソーラー"
    }
  },
  "312": {
    "resourceType": "ability",
    "id": 312,
    "slug": "eelevate",
    "calcAbilityName": "Eelevate",
    "names": {
      "zh-hans": "Eelevate",
      "zh-hant": "Eelevate",
      "en": "Eelevate",
      "ja": "Eelevate"
    }
  },
  "313": {
    "resourceType": "ability",
    "id": 313,
    "slug": "fire-mane",
    "calcAbilityName": "Fire Mane",
    "names": {
      "zh-hans": "Fire Mane",
      "zh-hant": "Fire Mane",
      "en": "Fire Mane",
      "ja": "Fire Mane"
    }
  }
} as const satisfies Record<UpstreamResourceId, NormalizedAbility>

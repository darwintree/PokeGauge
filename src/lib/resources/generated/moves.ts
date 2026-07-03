import type { NormalizedMove, UpstreamResourceId } from "../types"

export const GENERATED_MOVES = {
  "1": {
    "resourceType": "move",
    "id": 1,
    "slug": "pound",
    "calcMoveName": "Pound",
    "names": {
      "zh-hans": "拍击",
      "zh-hant": "拍擊",
      "en": "Pound",
      "ja": "はたく"
    },
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "2": {
    "resourceType": "move",
    "id": 2,
    "slug": "karate-chop",
    "calcMoveName": "Karate Chop",
    "names": {
      "zh-hans": "空手劈",
      "zh-hant": "空手劈",
      "en": "Karate Chop",
      "ja": "からてチョップ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "3": {
    "resourceType": "move",
    "id": 3,
    "slug": "double-slap",
    "calcMoveName": "Double Slap",
    "names": {
      "zh-hans": "连环巴掌",
      "zh-hant": "連環巴掌",
      "en": "Double Slap",
      "ja": "おうふくビンタ"
    },
    "type": "normal",
    "category": "physical",
    "power": 15,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "4": {
    "resourceType": "move",
    "id": 4,
    "slug": "comet-punch",
    "calcMoveName": "Comet Punch",
    "names": {
      "zh-hans": "连续拳",
      "zh-hant": "連續拳",
      "en": "Comet Punch",
      "ja": "れんぞくパンチ"
    },
    "type": "normal",
    "category": "physical",
    "power": 18,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "5": {
    "resourceType": "move",
    "id": 5,
    "slug": "mega-punch",
    "calcMoveName": "Mega Punch",
    "names": {
      "zh-hans": "百万吨重拳",
      "zh-hant": "百萬噸重拳",
      "en": "Mega Punch",
      "ja": "メガトンパンチ"
    },
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "6": {
    "resourceType": "move",
    "id": 6,
    "slug": "pay-day",
    "calcMoveName": "Pay Day",
    "names": {
      "zh-hans": "聚宝功",
      "zh-hant": "聚寶功",
      "en": "Pay Day",
      "ja": "ネコにこばん"
    },
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "7": {
    "resourceType": "move",
    "id": 7,
    "slug": "fire-punch",
    "calcMoveName": "Fire Punch",
    "names": {
      "zh-hans": "火焰拳",
      "zh-hant": "火焰拳",
      "en": "Fire Punch",
      "ja": "ほのおのパンチ"
    },
    "type": "fire",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "8": {
    "resourceType": "move",
    "id": 8,
    "slug": "ice-punch",
    "calcMoveName": "Ice Punch",
    "names": {
      "zh-hans": "冰冻拳",
      "zh-hant": "冰凍拳",
      "en": "Ice Punch",
      "ja": "れいとうパンチ"
    },
    "type": "ice",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "9": {
    "resourceType": "move",
    "id": 9,
    "slug": "thunder-punch",
    "calcMoveName": "Thunder Punch",
    "names": {
      "zh-hans": "雷电拳",
      "zh-hant": "雷電拳",
      "en": "Thunder Punch",
      "ja": "かみなりパンチ"
    },
    "type": "electric",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10": {
    "resourceType": "move",
    "id": 10,
    "slug": "scratch",
    "calcMoveName": "Scratch",
    "names": {
      "zh-hans": "抓",
      "zh-hant": "抓",
      "en": "Scratch",
      "ja": "ひっかく"
    },
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "11": {
    "resourceType": "move",
    "id": 11,
    "slug": "vice-grip",
    "calcMoveName": "Vise Grip",
    "names": {
      "zh-hans": "夹住",
      "zh-hant": "夾住",
      "en": "Vise Grip",
      "ja": "はさむ"
    },
    "type": "normal",
    "category": "physical",
    "power": 55,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "12": {
    "resourceType": "move",
    "id": 12,
    "slug": "guillotine",
    "calcMoveName": "Guillotine",
    "names": {
      "zh-hans": "断头钳",
      "zh-hant": "斷頭鉗",
      "en": "Guillotine",
      "ja": "ハサミギロチン"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 30,
    "damageKind": "ohko",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "13": {
    "resourceType": "move",
    "id": 13,
    "slug": "razor-wind",
    "calcMoveName": "Razor Wind",
    "names": {
      "zh-hans": "旋风刀",
      "zh-hant": "旋風刀",
      "en": "Razor Wind",
      "ja": "かまいたち"
    },
    "type": "normal",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
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
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "15": {
    "resourceType": "move",
    "id": 15,
    "slug": "cut",
    "calcMoveName": "Cut",
    "names": {
      "zh-hans": "居合斩",
      "zh-hant": "居合斬",
      "en": "Cut",
      "ja": "いあいぎり"
    },
    "type": "normal",
    "category": "physical",
    "power": 50,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "16": {
    "resourceType": "move",
    "id": 16,
    "slug": "gust",
    "calcMoveName": "Gust",
    "names": {
      "zh-hans": "起风",
      "zh-hant": "起風",
      "en": "Gust",
      "ja": "かぜおこし"
    },
    "type": "flying",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "17": {
    "resourceType": "move",
    "id": 17,
    "slug": "wing-attack",
    "calcMoveName": "Wing Attack",
    "names": {
      "zh-hans": "翅膀攻击",
      "zh-hant": "翅膀攻擊",
      "en": "Wing Attack",
      "ja": "つばさでうつ"
    },
    "type": "flying",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "18": {
    "resourceType": "move",
    "id": 18,
    "slug": "whirlwind",
    "calcMoveName": "Whirlwind",
    "names": {
      "zh-hans": "吹飞",
      "zh-hant": "吹飛",
      "en": "Whirlwind",
      "ja": "ふきとばし"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "force-switch",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "19": {
    "resourceType": "move",
    "id": 19,
    "slug": "fly",
    "calcMoveName": "Fly",
    "names": {
      "zh-hans": "飞翔",
      "zh-hant": "飛翔",
      "en": "Fly",
      "ja": "そらをとぶ"
    },
    "type": "flying",
    "category": "physical",
    "power": 90,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "20": {
    "resourceType": "move",
    "id": 20,
    "slug": "bind",
    "calcMoveName": "Bind",
    "names": {
      "zh-hans": "绑紧",
      "zh-hant": "綁緊",
      "en": "Bind",
      "ja": "しめつける"
    },
    "type": "normal",
    "category": "physical",
    "power": 15,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "21": {
    "resourceType": "move",
    "id": 21,
    "slug": "slam",
    "calcMoveName": "Slam",
    "names": {
      "zh-hans": "摔打",
      "zh-hant": "摔打",
      "en": "Slam",
      "ja": "たたきつける"
    },
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 75,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "22": {
    "resourceType": "move",
    "id": 22,
    "slug": "vine-whip",
    "calcMoveName": "Vine Whip",
    "names": {
      "zh-hans": "藤鞭",
      "zh-hant": "藤鞭",
      "en": "Vine Whip",
      "ja": "つるのムチ"
    },
    "type": "grass",
    "category": "physical",
    "power": 45,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "23": {
    "resourceType": "move",
    "id": 23,
    "slug": "stomp",
    "calcMoveName": "Stomp",
    "names": {
      "zh-hans": "踩踏",
      "zh-hant": "踩踏",
      "en": "Stomp",
      "ja": "ふみつけ"
    },
    "type": "normal",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "24": {
    "resourceType": "move",
    "id": 24,
    "slug": "double-kick",
    "calcMoveName": "Double Kick",
    "names": {
      "zh-hans": "二连踢",
      "zh-hant": "二連踢",
      "en": "Double Kick",
      "ja": "にどげり"
    },
    "type": "fighting",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "25": {
    "resourceType": "move",
    "id": 25,
    "slug": "mega-kick",
    "calcMoveName": "Mega Kick",
    "names": {
      "zh-hans": "百万吨重踢",
      "zh-hant": "百萬噸重踢",
      "en": "Mega Kick",
      "ja": "メガトンキック"
    },
    "type": "normal",
    "category": "physical",
    "power": 120,
    "accuracy": 75,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "26": {
    "resourceType": "move",
    "id": 26,
    "slug": "jump-kick",
    "calcMoveName": "Jump Kick",
    "names": {
      "zh-hans": "飞踢",
      "zh-hant": "飛踢",
      "en": "Jump Kick",
      "ja": "とびげり"
    },
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "27": {
    "resourceType": "move",
    "id": 27,
    "slug": "rolling-kick",
    "calcMoveName": "Rolling Kick",
    "names": {
      "zh-hans": "回旋踢",
      "zh-hant": "迴旋踢",
      "en": "Rolling Kick",
      "ja": "まわしげり"
    },
    "type": "fighting",
    "category": "physical",
    "power": 60,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "28": {
    "resourceType": "move",
    "id": 28,
    "slug": "sand-attack",
    "calcMoveName": "Sand Attack",
    "names": {
      "zh-hans": "泼沙",
      "zh-hant": "潑沙",
      "en": "Sand Attack",
      "ja": "すなかけ"
    },
    "type": "ground",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "29": {
    "resourceType": "move",
    "id": 29,
    "slug": "headbutt",
    "calcMoveName": "Headbutt",
    "names": {
      "zh-hans": "头锤",
      "zh-hant": "頭錘",
      "en": "Headbutt",
      "ja": "ずつき"
    },
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "30": {
    "resourceType": "move",
    "id": 30,
    "slug": "horn-attack",
    "calcMoveName": "Horn Attack",
    "names": {
      "zh-hans": "角撞",
      "zh-hant": "角撞",
      "en": "Horn Attack",
      "ja": "つのでつく"
    },
    "type": "normal",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "31": {
    "resourceType": "move",
    "id": 31,
    "slug": "fury-attack",
    "calcMoveName": "Fury Attack",
    "names": {
      "zh-hans": "乱击",
      "zh-hant": "亂擊",
      "en": "Fury Attack",
      "ja": "みだれづき"
    },
    "type": "normal",
    "category": "physical",
    "power": 15,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "32": {
    "resourceType": "move",
    "id": 32,
    "slug": "horn-drill",
    "calcMoveName": "Horn Drill",
    "names": {
      "zh-hans": "角钻",
      "zh-hant": "角鑽",
      "en": "Horn Drill",
      "ja": "つのドリル"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 30,
    "damageKind": "ohko",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "33": {
    "resourceType": "move",
    "id": 33,
    "slug": "tackle",
    "calcMoveName": "Tackle",
    "names": {
      "zh-hans": "撞击",
      "zh-hant": "撞擊",
      "en": "Tackle",
      "ja": "たいあたり"
    },
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "34": {
    "resourceType": "move",
    "id": 34,
    "slug": "body-slam",
    "calcMoveName": "Body Slam",
    "names": {
      "zh-hans": "泰山压顶",
      "zh-hant": "泰山壓頂",
      "en": "Body Slam",
      "ja": "のしかかり"
    },
    "type": "normal",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "35": {
    "resourceType": "move",
    "id": 35,
    "slug": "wrap",
    "calcMoveName": "Wrap",
    "names": {
      "zh-hans": "紧束",
      "zh-hant": "緊束",
      "en": "Wrap",
      "ja": "まきつく"
    },
    "type": "normal",
    "category": "physical",
    "power": 15,
    "accuracy": 90,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "36": {
    "resourceType": "move",
    "id": 36,
    "slug": "take-down",
    "calcMoveName": "Take Down",
    "names": {
      "zh-hans": "猛撞",
      "zh-hant": "猛撞",
      "en": "Take Down",
      "ja": "とっしん"
    },
    "type": "normal",
    "category": "physical",
    "power": 90,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "37": {
    "resourceType": "move",
    "id": 37,
    "slug": "thrash",
    "calcMoveName": "Thrash",
    "names": {
      "zh-hans": "大闹一番",
      "zh-hant": "大鬧一番",
      "en": "Thrash",
      "ja": "あばれる"
    },
    "type": "normal",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "random-opponent",
    "isSpread": false
  },
  "38": {
    "resourceType": "move",
    "id": 38,
    "slug": "double-edge",
    "calcMoveName": "Double-Edge",
    "names": {
      "zh-hans": "舍身冲撞",
      "zh-hant": "捨身衝撞",
      "en": "Double-Edge",
      "ja": "すてみタックル"
    },
    "type": "normal",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "39": {
    "resourceType": "move",
    "id": 39,
    "slug": "tail-whip",
    "calcMoveName": "Tail Whip",
    "names": {
      "zh-hans": "摇尾巴",
      "zh-hant": "搖尾巴",
      "en": "Tail Whip",
      "ja": "しっぽをふる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "all-opponents",
    "isSpread": true
  },
  "40": {
    "resourceType": "move",
    "id": 40,
    "slug": "poison-sting",
    "calcMoveName": "Poison Sting",
    "names": {
      "zh-hans": "毒针",
      "zh-hant": "毒針",
      "en": "Poison Sting",
      "ja": "どくばり"
    },
    "type": "poison",
    "category": "physical",
    "power": 15,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "41": {
    "resourceType": "move",
    "id": 41,
    "slug": "twineedle",
    "calcMoveName": "Twineedle",
    "names": {
      "zh-hans": "双针",
      "zh-hant": "雙針",
      "en": "Twineedle",
      "ja": "ダブルニードル"
    },
    "type": "bug",
    "category": "physical",
    "power": 25,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "42": {
    "resourceType": "move",
    "id": 42,
    "slug": "pin-missile",
    "calcMoveName": "Pin Missile",
    "names": {
      "zh-hans": "飞弹针",
      "zh-hant": "飛彈針",
      "en": "Pin Missile",
      "ja": "ミサイルばり"
    },
    "type": "bug",
    "category": "physical",
    "power": 25,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "43": {
    "resourceType": "move",
    "id": 43,
    "slug": "leer",
    "calcMoveName": "Leer",
    "names": {
      "zh-hans": "瞪眼",
      "zh-hant": "瞪眼",
      "en": "Leer",
      "ja": "にらみつける"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "all-opponents",
    "isSpread": true
  },
  "44": {
    "resourceType": "move",
    "id": 44,
    "slug": "bite",
    "calcMoveName": "Bite",
    "names": {
      "zh-hans": "咬住",
      "zh-hant": "咬住",
      "en": "Bite",
      "ja": "かみつく"
    },
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "45": {
    "resourceType": "move",
    "id": 45,
    "slug": "growl",
    "calcMoveName": "Growl",
    "names": {
      "zh-hans": "叫声",
      "zh-hant": "叫聲",
      "en": "Growl",
      "ja": "なきごえ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "all-opponents",
    "isSpread": true
  },
  "46": {
    "resourceType": "move",
    "id": 46,
    "slug": "roar",
    "calcMoveName": "Roar",
    "names": {
      "zh-hans": "吼叫",
      "zh-hant": "吼叫",
      "en": "Roar",
      "ja": "ほえる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "force-switch",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "47": {
    "resourceType": "move",
    "id": 47,
    "slug": "sing",
    "calcMoveName": "Sing",
    "names": {
      "zh-hans": "唱歌",
      "zh-hant": "唱歌",
      "en": "Sing",
      "ja": "うたう"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 55,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "48": {
    "resourceType": "move",
    "id": 48,
    "slug": "supersonic",
    "calcMoveName": "Supersonic",
    "names": {
      "zh-hans": "超音波",
      "zh-hant": "超音波",
      "en": "Supersonic",
      "ja": "ちょうおんぱ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 55,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "49": {
    "resourceType": "move",
    "id": 49,
    "slug": "sonic-boom",
    "calcMoveName": "Sonic Boom",
    "names": {
      "zh-hans": "音爆",
      "zh-hant": "音爆",
      "en": "Sonic Boom",
      "ja": "ソニックブーム"
    },
    "type": "normal",
    "category": "special",
    "power": null,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "50": {
    "resourceType": "move",
    "id": 50,
    "slug": "disable",
    "calcMoveName": "Disable",
    "names": {
      "zh-hans": "定身法",
      "zh-hant": "定身法",
      "en": "Disable",
      "ja": "かなしばり"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "51": {
    "resourceType": "move",
    "id": 51,
    "slug": "acid",
    "calcMoveName": "Acid",
    "names": {
      "zh-hans": "溶解液",
      "zh-hant": "溶解液",
      "en": "Acid",
      "ja": "ようかいえき"
    },
    "type": "poison",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "52": {
    "resourceType": "move",
    "id": 52,
    "slug": "ember",
    "calcMoveName": "Ember",
    "names": {
      "zh-hans": "火花",
      "zh-hant": "火花",
      "en": "Ember",
      "ja": "ひのこ"
    },
    "type": "fire",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "53": {
    "resourceType": "move",
    "id": 53,
    "slug": "flamethrower",
    "calcMoveName": "Flamethrower",
    "names": {
      "zh-hans": "喷射火焰",
      "zh-hant": "噴射火焰",
      "en": "Flamethrower",
      "ja": "かえんほうしゃ"
    },
    "type": "fire",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "54": {
    "resourceType": "move",
    "id": 54,
    "slug": "mist",
    "calcMoveName": "Mist",
    "names": {
      "zh-hans": "白雾",
      "zh-hant": "白霧",
      "en": "Mist",
      "ja": "しろいきり"
    },
    "type": "ice",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "55": {
    "resourceType": "move",
    "id": 55,
    "slug": "water-gun",
    "calcMoveName": "Water Gun",
    "names": {
      "zh-hans": "水枪",
      "zh-hant": "水槍",
      "en": "Water Gun",
      "ja": "みずでっぽう"
    },
    "type": "water",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "56": {
    "resourceType": "move",
    "id": 56,
    "slug": "hydro-pump",
    "calcMoveName": "Hydro Pump",
    "names": {
      "zh-hans": "水炮",
      "zh-hant": "水炮",
      "en": "Hydro Pump",
      "ja": "ハイドロポンプ"
    },
    "type": "water",
    "category": "special",
    "power": 110,
    "accuracy": 80,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "57": {
    "resourceType": "move",
    "id": 57,
    "slug": "surf",
    "calcMoveName": "Surf",
    "names": {
      "zh-hans": "冲浪",
      "zh-hant": "衝浪",
      "en": "Surf",
      "ja": "なみのり"
    },
    "type": "water",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "58": {
    "resourceType": "move",
    "id": 58,
    "slug": "ice-beam",
    "calcMoveName": "Ice Beam",
    "names": {
      "zh-hans": "冰冻光束",
      "zh-hant": "冰凍光束",
      "en": "Ice Beam",
      "ja": "れいとうビーム"
    },
    "type": "ice",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "59": {
    "resourceType": "move",
    "id": 59,
    "slug": "blizzard",
    "calcMoveName": "Blizzard",
    "names": {
      "zh-hans": "暴风雪",
      "zh-hant": "暴風雪",
      "en": "Blizzard",
      "ja": "ふぶき"
    },
    "type": "ice",
    "category": "special",
    "power": 110,
    "accuracy": 70,
    "damageKind": "damage-ailment",
    "target": "all-opponents",
    "isSpread": true
  },
  "60": {
    "resourceType": "move",
    "id": 60,
    "slug": "psybeam",
    "calcMoveName": "Psybeam",
    "names": {
      "zh-hans": "幻象光线",
      "zh-hant": "幻象光線",
      "en": "Psybeam",
      "ja": "サイケこうせん"
    },
    "type": "psychic",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "61": {
    "resourceType": "move",
    "id": 61,
    "slug": "bubble-beam",
    "calcMoveName": "Bubble Beam",
    "names": {
      "zh-hans": "泡沫光线",
      "zh-hant": "泡沫光線",
      "en": "Bubble Beam",
      "ja": "バブルこうせん"
    },
    "type": "water",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "62": {
    "resourceType": "move",
    "id": 62,
    "slug": "aurora-beam",
    "calcMoveName": "Aurora Beam",
    "names": {
      "zh-hans": "极光束",
      "zh-hant": "極光束",
      "en": "Aurora Beam",
      "ja": "オーロラビーム"
    },
    "type": "ice",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "63": {
    "resourceType": "move",
    "id": 63,
    "slug": "hyper-beam",
    "calcMoveName": "Hyper Beam",
    "names": {
      "zh-hans": "破坏光线",
      "zh-hant": "破壞光線",
      "en": "Hyper Beam",
      "ja": "はかいこうせん"
    },
    "type": "normal",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "64": {
    "resourceType": "move",
    "id": 64,
    "slug": "peck",
    "calcMoveName": "Peck",
    "names": {
      "zh-hans": "啄",
      "zh-hant": "啄",
      "en": "Peck",
      "ja": "つつく"
    },
    "type": "flying",
    "category": "physical",
    "power": 35,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "65": {
    "resourceType": "move",
    "id": 65,
    "slug": "drill-peck",
    "calcMoveName": "Drill Peck",
    "names": {
      "zh-hans": "啄钻",
      "zh-hant": "啄鑽",
      "en": "Drill Peck",
      "ja": "ドリルくちばし"
    },
    "type": "flying",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "66": {
    "resourceType": "move",
    "id": 66,
    "slug": "submission",
    "calcMoveName": "Submission",
    "names": {
      "zh-hans": "地狱翻滚",
      "zh-hant": "地獄翻滾",
      "en": "Submission",
      "ja": "じごくぐるま"
    },
    "type": "fighting",
    "category": "physical",
    "power": 80,
    "accuracy": 80,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "67": {
    "resourceType": "move",
    "id": 67,
    "slug": "low-kick",
    "calcMoveName": "Low Kick",
    "names": {
      "zh-hans": "踢倒",
      "zh-hant": "踢倒",
      "en": "Low Kick",
      "ja": "けたぐり"
    },
    "type": "fighting",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "68": {
    "resourceType": "move",
    "id": 68,
    "slug": "counter",
    "calcMoveName": "Counter",
    "names": {
      "zh-hans": "双倍奉还",
      "zh-hant": "雙倍奉還",
      "en": "Counter",
      "ja": "カウンター"
    },
    "type": "fighting",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "specific-move",
    "isSpread": false
  },
  "69": {
    "resourceType": "move",
    "id": 69,
    "slug": "seismic-toss",
    "calcMoveName": "Seismic Toss",
    "names": {
      "zh-hans": "地球上投",
      "zh-hant": "地球上投",
      "en": "Seismic Toss",
      "ja": "ちきゅうなげ"
    },
    "type": "fighting",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "70": {
    "resourceType": "move",
    "id": 70,
    "slug": "strength",
    "calcMoveName": "Strength",
    "names": {
      "zh-hans": "怪力",
      "zh-hant": "怪力",
      "en": "Strength",
      "ja": "かいりき"
    },
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "71": {
    "resourceType": "move",
    "id": 71,
    "slug": "absorb",
    "calcMoveName": "Absorb",
    "names": {
      "zh-hans": "吸取",
      "zh-hant": "吸取",
      "en": "Absorb",
      "ja": "すいとる"
    },
    "type": "grass",
    "category": "special",
    "power": 20,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "72": {
    "resourceType": "move",
    "id": 72,
    "slug": "mega-drain",
    "calcMoveName": "Mega Drain",
    "names": {
      "zh-hans": "超级吸取",
      "zh-hant": "超級吸取",
      "en": "Mega Drain",
      "ja": "メガドレイン"
    },
    "type": "grass",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "73": {
    "resourceType": "move",
    "id": 73,
    "slug": "leech-seed",
    "calcMoveName": "Leech Seed",
    "names": {
      "zh-hans": "寄生种子",
      "zh-hant": "寄生種子",
      "en": "Leech Seed",
      "ja": "やどりぎのタネ"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 90,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "74": {
    "resourceType": "move",
    "id": 74,
    "slug": "growth",
    "calcMoveName": "Growth",
    "names": {
      "zh-hans": "生长",
      "zh-hant": "生長",
      "en": "Growth",
      "ja": "せいちょう"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "75": {
    "resourceType": "move",
    "id": 75,
    "slug": "razor-leaf",
    "calcMoveName": "Razor Leaf",
    "names": {
      "zh-hans": "飞叶快刀",
      "zh-hant": "飛葉快刀",
      "en": "Razor Leaf",
      "ja": "はっぱカッター"
    },
    "type": "grass",
    "category": "physical",
    "power": 55,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "76": {
    "resourceType": "move",
    "id": 76,
    "slug": "solar-beam",
    "calcMoveName": "Solar Beam",
    "names": {
      "zh-hans": "日光束",
      "zh-hant": "日光束",
      "en": "Solar Beam",
      "ja": "ソーラービーム"
    },
    "type": "grass",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "77": {
    "resourceType": "move",
    "id": 77,
    "slug": "poison-powder",
    "calcMoveName": "Poison Powder",
    "names": {
      "zh-hans": "毒粉",
      "zh-hant": "毒粉",
      "en": "Poison Powder",
      "ja": "どくのこな"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": 75,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "78": {
    "resourceType": "move",
    "id": 78,
    "slug": "stun-spore",
    "calcMoveName": "Stun Spore",
    "names": {
      "zh-hans": "麻痹粉",
      "zh-hant": "麻痺粉",
      "en": "Stun Spore",
      "ja": "しびれごな"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 75,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "79": {
    "resourceType": "move",
    "id": 79,
    "slug": "sleep-powder",
    "calcMoveName": "Sleep Powder",
    "names": {
      "zh-hans": "催眠粉",
      "zh-hant": "催眠粉",
      "en": "Sleep Powder",
      "ja": "ねむりごな"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 75,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "80": {
    "resourceType": "move",
    "id": 80,
    "slug": "petal-dance",
    "calcMoveName": "Petal Dance",
    "names": {
      "zh-hans": "花瓣舞",
      "zh-hant": "花瓣舞",
      "en": "Petal Dance",
      "ja": "はなびらのまい"
    },
    "type": "grass",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "random-opponent",
    "isSpread": false
  },
  "81": {
    "resourceType": "move",
    "id": 81,
    "slug": "string-shot",
    "calcMoveName": "String Shot",
    "names": {
      "zh-hans": "吐丝",
      "zh-hant": "吐絲",
      "en": "String Shot",
      "ja": "いとをはく"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": 95,
    "damageKind": "net-good-stats",
    "target": "all-opponents",
    "isSpread": true
  },
  "82": {
    "resourceType": "move",
    "id": 82,
    "slug": "dragon-rage",
    "calcMoveName": "Dragon Rage",
    "names": {
      "zh-hans": "龙之怒",
      "zh-hant": "龍之怒",
      "en": "Dragon Rage",
      "ja": "りゅうのいかり"
    },
    "type": "dragon",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "83": {
    "resourceType": "move",
    "id": 83,
    "slug": "fire-spin",
    "calcMoveName": "Fire Spin",
    "names": {
      "zh-hans": "火焰旋涡",
      "zh-hant": "火焰旋渦",
      "en": "Fire Spin",
      "ja": "ほのおのうず"
    },
    "type": "fire",
    "category": "special",
    "power": 35,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "84": {
    "resourceType": "move",
    "id": 84,
    "slug": "thunder-shock",
    "calcMoveName": "Thunder Shock",
    "names": {
      "zh-hans": "电击",
      "zh-hant": "電擊",
      "en": "Thunder Shock",
      "ja": "でんきショック"
    },
    "type": "electric",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "86": {
    "resourceType": "move",
    "id": 86,
    "slug": "thunder-wave",
    "calcMoveName": "Thunder Wave",
    "names": {
      "zh-hans": "电磁波",
      "zh-hant": "電磁波",
      "en": "Thunder Wave",
      "ja": "でんじは"
    },
    "type": "electric",
    "category": "status",
    "power": null,
    "accuracy": 90,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "87": {
    "resourceType": "move",
    "id": 87,
    "slug": "thunder",
    "calcMoveName": "Thunder",
    "names": {
      "zh-hans": "打雷",
      "zh-hant": "打雷",
      "en": "Thunder",
      "ja": "かみなり"
    },
    "type": "electric",
    "category": "special",
    "power": 110,
    "accuracy": 70,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "88": {
    "resourceType": "move",
    "id": 88,
    "slug": "rock-throw",
    "calcMoveName": "Rock Throw",
    "names": {
      "zh-hans": "落石",
      "zh-hant": "落石",
      "en": "Rock Throw",
      "ja": "いわおとし"
    },
    "type": "rock",
    "category": "physical",
    "power": 50,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "90": {
    "resourceType": "move",
    "id": 90,
    "slug": "fissure",
    "calcMoveName": "Fissure",
    "names": {
      "zh-hans": "地裂",
      "zh-hant": "地裂",
      "en": "Fissure",
      "ja": "じわれ"
    },
    "type": "ground",
    "category": "physical",
    "power": null,
    "accuracy": 30,
    "damageKind": "ohko",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "91": {
    "resourceType": "move",
    "id": 91,
    "slug": "dig",
    "calcMoveName": "Dig",
    "names": {
      "zh-hans": "挖洞",
      "zh-hant": "挖洞",
      "en": "Dig",
      "ja": "あなをほる"
    },
    "type": "ground",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "92": {
    "resourceType": "move",
    "id": 92,
    "slug": "toxic",
    "calcMoveName": "Toxic",
    "names": {
      "zh-hans": "剧毒",
      "zh-hant": "劇毒",
      "en": "Toxic",
      "ja": "どくどく"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": 90,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "93": {
    "resourceType": "move",
    "id": 93,
    "slug": "confusion",
    "calcMoveName": "Confusion",
    "names": {
      "zh-hans": "念力",
      "zh-hant": "念力",
      "en": "Confusion",
      "ja": "ねんりき"
    },
    "type": "psychic",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "94": {
    "resourceType": "move",
    "id": 94,
    "slug": "psychic",
    "calcMoveName": "Psychic",
    "names": {
      "zh-hans": "精神强念",
      "zh-hant": "精神強念",
      "en": "Psychic",
      "ja": "サイコキネシス"
    },
    "type": "psychic",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "95": {
    "resourceType": "move",
    "id": 95,
    "slug": "hypnosis",
    "calcMoveName": "Hypnosis",
    "names": {
      "zh-hans": "催眠术",
      "zh-hant": "催眠術",
      "en": "Hypnosis",
      "ja": "さいみんじゅつ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": 60,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "96": {
    "resourceType": "move",
    "id": 96,
    "slug": "meditate",
    "calcMoveName": "Meditate",
    "names": {
      "zh-hans": "瑜伽姿势",
      "zh-hant": "瑜伽姿勢",
      "en": "Meditate",
      "ja": "ヨガのポーズ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "97": {
    "resourceType": "move",
    "id": 97,
    "slug": "agility",
    "calcMoveName": "Agility",
    "names": {
      "zh-hans": "高速移动",
      "zh-hant": "高速移動",
      "en": "Agility",
      "ja": "こうそくいどう"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "98": {
    "resourceType": "move",
    "id": 98,
    "slug": "quick-attack",
    "calcMoveName": "Quick Attack",
    "names": {
      "zh-hans": "电光一闪",
      "zh-hant": "電光一閃",
      "en": "Quick Attack",
      "ja": "でんこうせっか"
    },
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "99": {
    "resourceType": "move",
    "id": 99,
    "slug": "rage",
    "calcMoveName": "Rage",
    "names": {
      "zh-hans": "愤怒",
      "zh-hant": "憤怒",
      "en": "Rage",
      "ja": "いかり"
    },
    "type": "normal",
    "category": "physical",
    "power": 20,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "100": {
    "resourceType": "move",
    "id": 100,
    "slug": "teleport",
    "calcMoveName": "Teleport",
    "names": {
      "zh-hans": "瞬间移动",
      "zh-hant": "瞬間移動",
      "en": "Teleport",
      "ja": "テレポート"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "101": {
    "resourceType": "move",
    "id": 101,
    "slug": "night-shade",
    "calcMoveName": "Night Shade",
    "names": {
      "zh-hans": "黑夜魔影",
      "zh-hant": "黑夜魔影",
      "en": "Night Shade",
      "ja": "ナイトヘッド"
    },
    "type": "ghost",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "102": {
    "resourceType": "move",
    "id": 102,
    "slug": "mimic",
    "calcMoveName": "Mimic",
    "names": {
      "zh-hans": "模仿",
      "zh-hant": "模仿",
      "en": "Mimic",
      "ja": "ものまね"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "103": {
    "resourceType": "move",
    "id": 103,
    "slug": "screech",
    "calcMoveName": "Screech",
    "names": {
      "zh-hans": "刺耳声",
      "zh-hant": "刺耳聲",
      "en": "Screech",
      "ja": "いやなおと"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 85,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "104": {
    "resourceType": "move",
    "id": 104,
    "slug": "double-team",
    "calcMoveName": "Double Team",
    "names": {
      "zh-hans": "影子分身",
      "zh-hant": "影子分身",
      "en": "Double Team",
      "ja": "かげぶんしん"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "105": {
    "resourceType": "move",
    "id": 105,
    "slug": "recover",
    "calcMoveName": "Recover",
    "names": {
      "zh-hans": "自我再生",
      "zh-hant": "自我再生",
      "en": "Recover",
      "ja": "じこさいせい"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "106": {
    "resourceType": "move",
    "id": 106,
    "slug": "harden",
    "calcMoveName": "Harden",
    "names": {
      "zh-hans": "变硬",
      "zh-hant": "變硬",
      "en": "Harden",
      "ja": "かたくなる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "107": {
    "resourceType": "move",
    "id": 107,
    "slug": "minimize",
    "calcMoveName": "Minimize",
    "names": {
      "zh-hans": "变小",
      "zh-hant": "變小",
      "en": "Minimize",
      "ja": "ちいさくなる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "108": {
    "resourceType": "move",
    "id": 108,
    "slug": "smokescreen",
    "calcMoveName": "Smokescreen",
    "names": {
      "zh-hans": "烟幕",
      "zh-hant": "煙幕",
      "en": "Smokescreen",
      "ja": "えんまく"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "109": {
    "resourceType": "move",
    "id": 109,
    "slug": "confuse-ray",
    "calcMoveName": "Confuse Ray",
    "names": {
      "zh-hans": "奇异之光",
      "zh-hant": "奇異之光",
      "en": "Confuse Ray",
      "ja": "あやしいひかり"
    },
    "type": "ghost",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "110": {
    "resourceType": "move",
    "id": 110,
    "slug": "withdraw",
    "calcMoveName": "Withdraw",
    "names": {
      "zh-hans": "缩入壳中",
      "zh-hant": "縮入殼中",
      "en": "Withdraw",
      "ja": "からにこもる"
    },
    "type": "water",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "111": {
    "resourceType": "move",
    "id": 111,
    "slug": "defense-curl",
    "calcMoveName": "Defense Curl",
    "names": {
      "zh-hans": "变圆",
      "zh-hant": "變圓",
      "en": "Defense Curl",
      "ja": "まるくなる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "112": {
    "resourceType": "move",
    "id": 112,
    "slug": "barrier",
    "calcMoveName": "Barrier",
    "names": {
      "zh-hans": "屏障",
      "zh-hant": "屏障",
      "en": "Barrier",
      "ja": "バリアー"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "113": {
    "resourceType": "move",
    "id": 113,
    "slug": "light-screen",
    "calcMoveName": "Light Screen",
    "names": {
      "zh-hans": "光墙",
      "zh-hant": "光牆",
      "en": "Light Screen",
      "ja": "ひかりのかべ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "114": {
    "resourceType": "move",
    "id": 114,
    "slug": "haze",
    "calcMoveName": "Haze",
    "names": {
      "zh-hans": "黑雾",
      "zh-hant": "黑霧",
      "en": "Haze",
      "ja": "くろいきり"
    },
    "type": "ice",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "115": {
    "resourceType": "move",
    "id": 115,
    "slug": "reflect",
    "calcMoveName": "Reflect",
    "names": {
      "zh-hans": "反射壁",
      "zh-hant": "反射壁",
      "en": "Reflect",
      "ja": "リフレクター"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "116": {
    "resourceType": "move",
    "id": 116,
    "slug": "focus-energy",
    "calcMoveName": "Focus Energy",
    "names": {
      "zh-hans": "聚气",
      "zh-hant": "聚氣",
      "en": "Focus Energy",
      "ja": "きあいだめ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "117": {
    "resourceType": "move",
    "id": 117,
    "slug": "bide",
    "calcMoveName": "Bide",
    "names": {
      "zh-hans": "忍耐",
      "zh-hant": "忍耐",
      "en": "Bide",
      "ja": "がまん"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "user",
    "isSpread": false
  },
  "118": {
    "resourceType": "move",
    "id": 118,
    "slug": "metronome",
    "calcMoveName": "Metronome",
    "names": {
      "zh-hans": "挥指",
      "zh-hant": "揮指",
      "en": "Metronome",
      "ja": "ゆびをふる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "119": {
    "resourceType": "move",
    "id": 119,
    "slug": "mirror-move",
    "calcMoveName": "Mirror Move",
    "names": {
      "zh-hans": "鹦鹉学舌",
      "zh-hant": "鸚鵡學舌",
      "en": "Mirror Move",
      "ja": "オウムがえし"
    },
    "type": "flying",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "120": {
    "resourceType": "move",
    "id": 120,
    "slug": "self-destruct",
    "calcMoveName": "Self-Destruct",
    "names": {
      "zh-hans": "自爆",
      "zh-hant": "自爆",
      "en": "Self-Destruct",
      "ja": "じばく"
    },
    "type": "normal",
    "category": "physical",
    "power": 200,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "121": {
    "resourceType": "move",
    "id": 121,
    "slug": "egg-bomb",
    "calcMoveName": "Egg Bomb",
    "names": {
      "zh-hans": "炸蛋",
      "zh-hant": "炸蛋",
      "en": "Egg Bomb",
      "ja": "タマゴばくだん"
    },
    "type": "normal",
    "category": "physical",
    "power": 100,
    "accuracy": 75,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "122": {
    "resourceType": "move",
    "id": 122,
    "slug": "lick",
    "calcMoveName": "Lick",
    "names": {
      "zh-hans": "舌舔",
      "zh-hant": "舌舔",
      "en": "Lick",
      "ja": "したでなめる"
    },
    "type": "ghost",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "123": {
    "resourceType": "move",
    "id": 123,
    "slug": "smog",
    "calcMoveName": "Smog",
    "names": {
      "zh-hans": "浊雾",
      "zh-hant": "濁霧",
      "en": "Smog",
      "ja": "スモッグ"
    },
    "type": "poison",
    "category": "special",
    "power": 30,
    "accuracy": 70,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "124": {
    "resourceType": "move",
    "id": 124,
    "slug": "sludge",
    "calcMoveName": "Sludge",
    "names": {
      "zh-hans": "污泥攻击",
      "zh-hant": "污泥攻擊",
      "en": "Sludge",
      "ja": "ヘドロこうげき"
    },
    "type": "poison",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "125": {
    "resourceType": "move",
    "id": 125,
    "slug": "bone-club",
    "calcMoveName": "Bone Club",
    "names": {
      "zh-hans": "骨棒",
      "zh-hant": "骨棒",
      "en": "Bone Club",
      "ja": "ホネこんぼう"
    },
    "type": "ground",
    "category": "physical",
    "power": 65,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "126": {
    "resourceType": "move",
    "id": 126,
    "slug": "fire-blast",
    "calcMoveName": "Fire Blast",
    "names": {
      "zh-hans": "大字爆炎",
      "zh-hant": "大字爆炎",
      "en": "Fire Blast",
      "ja": "だいもんじ"
    },
    "type": "fire",
    "category": "special",
    "power": 110,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "127": {
    "resourceType": "move",
    "id": 127,
    "slug": "waterfall",
    "calcMoveName": "Waterfall",
    "names": {
      "zh-hans": "攀瀑",
      "zh-hant": "攀瀑",
      "en": "Waterfall",
      "ja": "たきのぼり"
    },
    "type": "water",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "128": {
    "resourceType": "move",
    "id": 128,
    "slug": "clamp",
    "calcMoveName": "Clamp",
    "names": {
      "zh-hans": "贝壳夹击",
      "zh-hant": "貝殼夾擊",
      "en": "Clamp",
      "ja": "からではさむ"
    },
    "type": "water",
    "category": "physical",
    "power": 35,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "129": {
    "resourceType": "move",
    "id": 129,
    "slug": "swift",
    "calcMoveName": "Swift",
    "names": {
      "zh-hans": "高速星星",
      "zh-hant": "高速星星",
      "en": "Swift",
      "ja": "スピードスター"
    },
    "type": "normal",
    "category": "special",
    "power": 60,
    "accuracy": null,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "130": {
    "resourceType": "move",
    "id": 130,
    "slug": "skull-bash",
    "calcMoveName": "Skull Bash",
    "names": {
      "zh-hans": "火箭头锤",
      "zh-hant": "火箭頭錘",
      "en": "Skull Bash",
      "ja": "ロケットずつき"
    },
    "type": "normal",
    "category": "physical",
    "power": 130,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "131": {
    "resourceType": "move",
    "id": 131,
    "slug": "spike-cannon",
    "calcMoveName": "Spike Cannon",
    "names": {
      "zh-hans": "尖刺加农炮",
      "zh-hant": "尖刺加農炮",
      "en": "Spike Cannon",
      "ja": "とげキャノン"
    },
    "type": "normal",
    "category": "physical",
    "power": 20,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "132": {
    "resourceType": "move",
    "id": 132,
    "slug": "constrict",
    "calcMoveName": "Constrict",
    "names": {
      "zh-hans": "缠绕",
      "zh-hant": "纏繞",
      "en": "Constrict",
      "ja": "からみつく"
    },
    "type": "normal",
    "category": "physical",
    "power": 10,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "133": {
    "resourceType": "move",
    "id": 133,
    "slug": "amnesia",
    "calcMoveName": "Amnesia",
    "names": {
      "zh-hans": "瞬间失忆",
      "zh-hant": "瞬間失憶",
      "en": "Amnesia",
      "ja": "ドわすれ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "134": {
    "resourceType": "move",
    "id": 134,
    "slug": "kinesis",
    "calcMoveName": "Kinesis",
    "names": {
      "zh-hans": "折弯汤匙",
      "zh-hant": "折彎湯匙",
      "en": "Kinesis",
      "ja": "スプーンまげ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": 80,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "135": {
    "resourceType": "move",
    "id": 135,
    "slug": "soft-boiled",
    "calcMoveName": "Soft-Boiled",
    "names": {
      "zh-hans": "生蛋",
      "zh-hant": "生蛋",
      "en": "Soft-Boiled",
      "ja": "タマゴうみ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "136": {
    "resourceType": "move",
    "id": 136,
    "slug": "high-jump-kick",
    "calcMoveName": "High Jump Kick",
    "names": {
      "zh-hans": "飞膝踢",
      "zh-hant": "飛膝踢",
      "en": "High Jump Kick",
      "ja": "とびひざげり"
    },
    "type": "fighting",
    "category": "physical",
    "power": 130,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "137": {
    "resourceType": "move",
    "id": 137,
    "slug": "glare",
    "calcMoveName": "Glare",
    "names": {
      "zh-hans": "大蛇瞪眼",
      "zh-hant": "大蛇瞪眼",
      "en": "Glare",
      "ja": "へびにらみ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "138": {
    "resourceType": "move",
    "id": 138,
    "slug": "dream-eater",
    "calcMoveName": "Dream Eater",
    "names": {
      "zh-hans": "食梦",
      "zh-hant": "食夢",
      "en": "Dream Eater",
      "ja": "ゆめくい"
    },
    "type": "psychic",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "139": {
    "resourceType": "move",
    "id": 139,
    "slug": "poison-gas",
    "calcMoveName": "Poison Gas",
    "names": {
      "zh-hans": "毒瓦斯",
      "zh-hant": "毒瓦斯",
      "en": "Poison Gas",
      "ja": "どくガス"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": 90,
    "damageKind": "ailment",
    "target": "all-opponents",
    "isSpread": true
  },
  "140": {
    "resourceType": "move",
    "id": 140,
    "slug": "barrage",
    "calcMoveName": "Barrage",
    "names": {
      "zh-hans": "投球",
      "zh-hant": "投球",
      "en": "Barrage",
      "ja": "たまなげ"
    },
    "type": "normal",
    "category": "physical",
    "power": 15,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "141": {
    "resourceType": "move",
    "id": 141,
    "slug": "leech-life",
    "calcMoveName": "Leech Life",
    "names": {
      "zh-hans": "吸血",
      "zh-hant": "吸血",
      "en": "Leech Life",
      "ja": "きゅうけつ"
    },
    "type": "bug",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "142": {
    "resourceType": "move",
    "id": 142,
    "slug": "lovely-kiss",
    "calcMoveName": "Lovely Kiss",
    "names": {
      "zh-hans": "恶魔之吻",
      "zh-hant": "惡魔之吻",
      "en": "Lovely Kiss",
      "ja": "あくまのキッス"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 75,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "143": {
    "resourceType": "move",
    "id": 143,
    "slug": "sky-attack",
    "calcMoveName": "Sky Attack",
    "names": {
      "zh-hans": "神鸟猛击",
      "zh-hant": "神鳥猛擊",
      "en": "Sky Attack",
      "ja": "ゴッドバード"
    },
    "type": "flying",
    "category": "physical",
    "power": 140,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "144": {
    "resourceType": "move",
    "id": 144,
    "slug": "transform",
    "calcMoveName": "Transform",
    "names": {
      "zh-hans": "变身",
      "zh-hant": "變身",
      "en": "Transform",
      "ja": "へんしん"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "145": {
    "resourceType": "move",
    "id": 145,
    "slug": "bubble",
    "calcMoveName": "Bubble",
    "names": {
      "zh-hans": "泡沫",
      "zh-hant": "泡沫",
      "en": "Bubble",
      "ja": "あわ"
    },
    "type": "water",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "146": {
    "resourceType": "move",
    "id": 146,
    "slug": "dizzy-punch",
    "calcMoveName": "Dizzy Punch",
    "names": {
      "zh-hans": "迷昏拳",
      "zh-hant": "迷昏拳",
      "en": "Dizzy Punch",
      "ja": "ピヨピヨパンチ"
    },
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "147": {
    "resourceType": "move",
    "id": 147,
    "slug": "spore",
    "calcMoveName": "Spore",
    "names": {
      "zh-hans": "蘑菇孢子",
      "zh-hant": "蘑菇孢子",
      "en": "Spore",
      "ja": "キノコのほうし"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "148": {
    "resourceType": "move",
    "id": 148,
    "slug": "flash",
    "calcMoveName": "Flash",
    "names": {
      "zh-hans": "闪光",
      "zh-hant": "閃光",
      "en": "Flash",
      "ja": "フラッシュ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "149": {
    "resourceType": "move",
    "id": 149,
    "slug": "psywave",
    "calcMoveName": "Psywave",
    "names": {
      "zh-hans": "精神波",
      "zh-hant": "精神波",
      "en": "Psywave",
      "ja": "サイコウェーブ"
    },
    "type": "psychic",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "150": {
    "resourceType": "move",
    "id": 150,
    "slug": "splash",
    "calcMoveName": "Splash",
    "names": {
      "zh-hans": "跃起",
      "zh-hant": "躍起",
      "en": "Splash",
      "ja": "はねる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "151": {
    "resourceType": "move",
    "id": 151,
    "slug": "acid-armor",
    "calcMoveName": "Acid Armor",
    "names": {
      "zh-hans": "溶化",
      "zh-hant": "溶化",
      "en": "Acid Armor",
      "ja": "とける"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "152": {
    "resourceType": "move",
    "id": 152,
    "slug": "crabhammer",
    "calcMoveName": "Crabhammer",
    "names": {
      "zh-hans": "蟹钳锤",
      "zh-hant": "蟹鉗錘",
      "en": "Crabhammer",
      "ja": "クラブハンマー"
    },
    "type": "water",
    "category": "physical",
    "power": 100,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "153": {
    "resourceType": "move",
    "id": 153,
    "slug": "explosion",
    "calcMoveName": "Explosion",
    "names": {
      "zh-hans": "大爆炸",
      "zh-hant": "大爆炸",
      "en": "Explosion",
      "ja": "だいばくはつ"
    },
    "type": "normal",
    "category": "physical",
    "power": 250,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "154": {
    "resourceType": "move",
    "id": 154,
    "slug": "fury-swipes",
    "calcMoveName": "Fury Swipes",
    "names": {
      "zh-hans": "乱抓",
      "zh-hant": "亂抓",
      "en": "Fury Swipes",
      "ja": "みだれひっかき"
    },
    "type": "normal",
    "category": "physical",
    "power": 18,
    "accuracy": 80,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "155": {
    "resourceType": "move",
    "id": 155,
    "slug": "bonemerang",
    "calcMoveName": "Bonemerang",
    "names": {
      "zh-hans": "骨头回力镖",
      "zh-hant": "骨頭回力鏢",
      "en": "Bonemerang",
      "ja": "ホネブーメラン"
    },
    "type": "ground",
    "category": "physical",
    "power": 50,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "156": {
    "resourceType": "move",
    "id": 156,
    "slug": "rest",
    "calcMoveName": "Rest",
    "names": {
      "zh-hans": "睡觉",
      "zh-hant": "睡覺",
      "en": "Rest",
      "ja": "ねむる"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "158": {
    "resourceType": "move",
    "id": 158,
    "slug": "hyper-fang",
    "calcMoveName": "Hyper Fang",
    "names": {
      "zh-hans": "必杀门牙",
      "zh-hant": "必殺門牙",
      "en": "Hyper Fang",
      "ja": "ひっさつまえば"
    },
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "159": {
    "resourceType": "move",
    "id": 159,
    "slug": "sharpen",
    "calcMoveName": "Sharpen",
    "names": {
      "zh-hans": "棱角化",
      "zh-hant": "稜角化",
      "en": "Sharpen",
      "ja": "かくばる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "160": {
    "resourceType": "move",
    "id": 160,
    "slug": "conversion",
    "calcMoveName": "Conversion",
    "names": {
      "zh-hans": "纹理",
      "zh-hant": "紋理",
      "en": "Conversion",
      "ja": "テクスチャー"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "161": {
    "resourceType": "move",
    "id": 161,
    "slug": "tri-attack",
    "calcMoveName": "Tri Attack",
    "names": {
      "zh-hans": "三重攻击",
      "zh-hant": "三重攻擊",
      "en": "Tri Attack",
      "ja": "トライアタック"
    },
    "type": "normal",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "162": {
    "resourceType": "move",
    "id": 162,
    "slug": "super-fang",
    "calcMoveName": "Super Fang",
    "names": {
      "zh-hans": "愤怒门牙",
      "zh-hant": "憤怒門牙",
      "en": "Super Fang",
      "ja": "いかりのまえば"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "163": {
    "resourceType": "move",
    "id": 163,
    "slug": "slash",
    "calcMoveName": "Slash",
    "names": {
      "zh-hans": "劈开",
      "zh-hant": "劈開",
      "en": "Slash",
      "ja": "きりさく"
    },
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "164": {
    "resourceType": "move",
    "id": 164,
    "slug": "substitute",
    "calcMoveName": "Substitute",
    "names": {
      "zh-hans": "替身",
      "zh-hant": "替身",
      "en": "Substitute",
      "ja": "みがわり"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "165": {
    "resourceType": "move",
    "id": 165,
    "slug": "struggle",
    "calcMoveName": "Struggle",
    "names": {
      "zh-hans": "挣扎",
      "zh-hant": "掙扎",
      "en": "Struggle",
      "ja": "わるあがき"
    },
    "type": "normal",
    "category": "physical",
    "power": 50,
    "accuracy": null,
    "damageKind": "damage",
    "target": "random-opponent",
    "isSpread": false
  },
  "166": {
    "resourceType": "move",
    "id": 166,
    "slug": "sketch",
    "calcMoveName": "Sketch",
    "names": {
      "zh-hans": "写生",
      "zh-hant": "寫生",
      "en": "Sketch",
      "ja": "スケッチ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "167": {
    "resourceType": "move",
    "id": 167,
    "slug": "triple-kick",
    "calcMoveName": "Triple Kick",
    "names": {
      "zh-hans": "三连踢",
      "zh-hant": "三連踢",
      "en": "Triple Kick",
      "ja": "トリプルキック"
    },
    "type": "fighting",
    "category": "physical",
    "power": 10,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "168": {
    "resourceType": "move",
    "id": 168,
    "slug": "thief",
    "calcMoveName": "Thief",
    "names": {
      "zh-hans": "小偷",
      "zh-hant": "小偷",
      "en": "Thief",
      "ja": "どろぼう"
    },
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "169": {
    "resourceType": "move",
    "id": 169,
    "slug": "spider-web",
    "calcMoveName": "Spider Web",
    "names": {
      "zh-hans": "蛛网",
      "zh-hant": "蛛網",
      "en": "Spider Web",
      "ja": "クモのす"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "170": {
    "resourceType": "move",
    "id": 170,
    "slug": "mind-reader",
    "calcMoveName": "Mind Reader",
    "names": {
      "zh-hans": "心之眼",
      "zh-hant": "心之眼",
      "en": "Mind Reader",
      "ja": "こころのめ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "171": {
    "resourceType": "move",
    "id": 171,
    "slug": "nightmare",
    "calcMoveName": "Nightmare",
    "names": {
      "zh-hans": "恶梦",
      "zh-hant": "惡夢",
      "en": "Nightmare",
      "ja": "あくむ"
    },
    "type": "ghost",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "172": {
    "resourceType": "move",
    "id": 172,
    "slug": "flame-wheel",
    "calcMoveName": "Flame Wheel",
    "names": {
      "zh-hans": "火焰轮",
      "zh-hant": "火焰輪",
      "en": "Flame Wheel",
      "ja": "かえんぐるま"
    },
    "type": "fire",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "173": {
    "resourceType": "move",
    "id": 173,
    "slug": "snore",
    "calcMoveName": "Snore",
    "names": {
      "zh-hans": "打鼾",
      "zh-hant": "打鼾",
      "en": "Snore",
      "ja": "いびき"
    },
    "type": "normal",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "174": {
    "resourceType": "move",
    "id": 174,
    "slug": "curse",
    "calcMoveName": "Curse",
    "names": {
      "zh-hans": "诅咒",
      "zh-hant": "詛咒",
      "en": "Curse",
      "ja": "のろい"
    },
    "type": "ghost",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "specific-move",
    "isSpread": false
  },
  "175": {
    "resourceType": "move",
    "id": 175,
    "slug": "flail",
    "calcMoveName": "Flail",
    "names": {
      "zh-hans": "抓狂",
      "zh-hant": "抓狂",
      "en": "Flail",
      "ja": "じたばた"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "176": {
    "resourceType": "move",
    "id": 176,
    "slug": "conversion-2",
    "calcMoveName": "Conversion 2",
    "names": {
      "zh-hans": "纹理２",
      "zh-hant": "紋理２",
      "en": "Conversion 2",
      "ja": "テクスチャー２"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "177": {
    "resourceType": "move",
    "id": 177,
    "slug": "aeroblast",
    "calcMoveName": "Aeroblast",
    "names": {
      "zh-hans": "气旋攻击",
      "zh-hant": "氣旋攻擊",
      "en": "Aeroblast",
      "ja": "エアロブラスト"
    },
    "type": "flying",
    "category": "special",
    "power": 100,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "178": {
    "resourceType": "move",
    "id": 178,
    "slug": "cotton-spore",
    "calcMoveName": "Cotton Spore",
    "names": {
      "zh-hans": "棉孢子",
      "zh-hant": "棉孢子",
      "en": "Cotton Spore",
      "ja": "わたほうし"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "all-opponents",
    "isSpread": true
  },
  "179": {
    "resourceType": "move",
    "id": 179,
    "slug": "reversal",
    "calcMoveName": "Reversal",
    "names": {
      "zh-hans": "起死回生",
      "zh-hant": "起死回生",
      "en": "Reversal",
      "ja": "きしかいせい"
    },
    "type": "fighting",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "180": {
    "resourceType": "move",
    "id": 180,
    "slug": "spite",
    "calcMoveName": "Spite",
    "names": {
      "zh-hans": "怨恨",
      "zh-hant": "怨恨",
      "en": "Spite",
      "ja": "うらみ"
    },
    "type": "ghost",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "181": {
    "resourceType": "move",
    "id": 181,
    "slug": "powder-snow",
    "calcMoveName": "Powder Snow",
    "names": {
      "zh-hans": "细雪",
      "zh-hant": "細雪",
      "en": "Powder Snow",
      "ja": "こなゆき"
    },
    "type": "ice",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "all-opponents",
    "isSpread": true
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
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "183": {
    "resourceType": "move",
    "id": 183,
    "slug": "mach-punch",
    "calcMoveName": "Mach Punch",
    "names": {
      "zh-hans": "音速拳",
      "zh-hant": "音速拳",
      "en": "Mach Punch",
      "ja": "マッハパンチ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "184": {
    "resourceType": "move",
    "id": 184,
    "slug": "scary-face",
    "calcMoveName": "Scary Face",
    "names": {
      "zh-hans": "鬼面",
      "zh-hant": "鬼面",
      "en": "Scary Face",
      "ja": "こわいかお"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "185": {
    "resourceType": "move",
    "id": 185,
    "slug": "feint-attack",
    "calcMoveName": "Feint Attack",
    "names": {
      "zh-hans": "出奇一击",
      "zh-hant": "出奇一擊",
      "en": "Feint Attack",
      "ja": "だましうち"
    },
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "186": {
    "resourceType": "move",
    "id": 186,
    "slug": "sweet-kiss",
    "calcMoveName": "Sweet Kiss",
    "names": {
      "zh-hans": "天使之吻",
      "zh-hant": "天使之吻",
      "en": "Sweet Kiss",
      "ja": "てんしのキッス"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": 75,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "187": {
    "resourceType": "move",
    "id": 187,
    "slug": "belly-drum",
    "calcMoveName": "Belly Drum",
    "names": {
      "zh-hans": "腹鼓",
      "zh-hant": "腹鼓",
      "en": "Belly Drum",
      "ja": "はらだいこ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "188": {
    "resourceType": "move",
    "id": 188,
    "slug": "sludge-bomb",
    "calcMoveName": "Sludge Bomb",
    "names": {
      "zh-hans": "污泥炸弹",
      "zh-hant": "污泥炸彈",
      "en": "Sludge Bomb",
      "ja": "ヘドロばくだん"
    },
    "type": "poison",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "189": {
    "resourceType": "move",
    "id": 189,
    "slug": "mud-slap",
    "calcMoveName": "Mud-Slap",
    "names": {
      "zh-hans": "掷泥",
      "zh-hant": "擲泥",
      "en": "Mud-Slap",
      "ja": "どろかけ"
    },
    "type": "ground",
    "category": "special",
    "power": 20,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "190": {
    "resourceType": "move",
    "id": 190,
    "slug": "octazooka",
    "calcMoveName": "Octazooka",
    "names": {
      "zh-hans": "章鱼桶炮",
      "zh-hant": "章魚桶炮",
      "en": "Octazooka",
      "ja": "オクタンほう"
    },
    "type": "water",
    "category": "special",
    "power": 65,
    "accuracy": 85,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "191": {
    "resourceType": "move",
    "id": 191,
    "slug": "spikes",
    "calcMoveName": "Spikes",
    "names": {
      "zh-hans": "撒菱",
      "zh-hant": "撒菱",
      "en": "Spikes",
      "ja": "まきびし"
    },
    "type": "ground",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "opponents-field",
    "isSpread": false
  },
  "192": {
    "resourceType": "move",
    "id": 192,
    "slug": "zap-cannon",
    "calcMoveName": "Zap Cannon",
    "names": {
      "zh-hans": "电磁炮",
      "zh-hant": "電磁炮",
      "en": "Zap Cannon",
      "ja": "でんじほう"
    },
    "type": "electric",
    "category": "special",
    "power": 120,
    "accuracy": 50,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "193": {
    "resourceType": "move",
    "id": 193,
    "slug": "foresight",
    "calcMoveName": "Foresight",
    "names": {
      "zh-hans": "识破",
      "zh-hant": "識破",
      "en": "Foresight",
      "ja": "みやぶる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "194": {
    "resourceType": "move",
    "id": 194,
    "slug": "destiny-bond",
    "calcMoveName": "Destiny Bond",
    "names": {
      "zh-hans": "同命",
      "zh-hant": "同命",
      "en": "Destiny Bond",
      "ja": "みちづれ"
    },
    "type": "ghost",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "195": {
    "resourceType": "move",
    "id": 195,
    "slug": "perish-song",
    "calcMoveName": "Perish Song",
    "names": {
      "zh-hans": "灭亡之歌",
      "zh-hant": "滅亡之歌",
      "en": "Perish Song",
      "ja": "ほろびのうた"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "ailment",
    "target": "all-pokemon",
    "isSpread": false
  },
  "196": {
    "resourceType": "move",
    "id": 196,
    "slug": "icy-wind",
    "calcMoveName": "Icy Wind",
    "names": {
      "zh-hans": "冰冻之风",
      "zh-hant": "冰凍之風",
      "en": "Icy Wind",
      "ja": "こごえるかぜ"
    },
    "type": "ice",
    "category": "special",
    "power": 55,
    "accuracy": 95,
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "197": {
    "resourceType": "move",
    "id": 197,
    "slug": "detect",
    "calcMoveName": "Detect",
    "names": {
      "zh-hans": "看穿",
      "zh-hant": "看穿",
      "en": "Detect",
      "ja": "みきり"
    },
    "type": "fighting",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "198": {
    "resourceType": "move",
    "id": 198,
    "slug": "bone-rush",
    "calcMoveName": "Bone Rush",
    "names": {
      "zh-hans": "骨棒乱打",
      "zh-hant": "骨棒亂打",
      "en": "Bone Rush",
      "ja": "ボーンラッシュ"
    },
    "type": "ground",
    "category": "physical",
    "power": 25,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "199": {
    "resourceType": "move",
    "id": 199,
    "slug": "lock-on",
    "calcMoveName": "Lock-On",
    "names": {
      "zh-hans": "锁定",
      "zh-hant": "鎖定",
      "en": "Lock-On",
      "ja": "ロックオン"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "200": {
    "resourceType": "move",
    "id": 200,
    "slug": "outrage",
    "calcMoveName": "Outrage",
    "names": {
      "zh-hans": "逆鳞",
      "zh-hant": "逆鱗",
      "en": "Outrage",
      "ja": "げきりん"
    },
    "type": "dragon",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "random-opponent",
    "isSpread": false
  },
  "201": {
    "resourceType": "move",
    "id": 201,
    "slug": "sandstorm",
    "calcMoveName": "Sandstorm",
    "names": {
      "zh-hans": "沙暴",
      "zh-hant": "沙暴",
      "en": "Sandstorm",
      "ja": "すなあらし"
    },
    "type": "rock",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "202": {
    "resourceType": "move",
    "id": 202,
    "slug": "giga-drain",
    "calcMoveName": "Giga Drain",
    "names": {
      "zh-hans": "终极吸取",
      "zh-hant": "終極吸取",
      "en": "Giga Drain",
      "ja": "ギガドレイン"
    },
    "type": "grass",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "203": {
    "resourceType": "move",
    "id": 203,
    "slug": "endure",
    "calcMoveName": "Endure",
    "names": {
      "zh-hans": "挺住",
      "zh-hant": "挺住",
      "en": "Endure",
      "ja": "こらえる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "204": {
    "resourceType": "move",
    "id": 204,
    "slug": "charm",
    "calcMoveName": "Charm",
    "names": {
      "zh-hans": "撒娇",
      "zh-hant": "撒嬌",
      "en": "Charm",
      "ja": "あまえる"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "205": {
    "resourceType": "move",
    "id": 205,
    "slug": "rollout",
    "calcMoveName": "Rollout",
    "names": {
      "zh-hans": "滚动",
      "zh-hant": "滾動",
      "en": "Rollout",
      "ja": "ころがる"
    },
    "type": "rock",
    "category": "physical",
    "power": 30,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "206": {
    "resourceType": "move",
    "id": 206,
    "slug": "false-swipe",
    "calcMoveName": "False Swipe",
    "names": {
      "zh-hans": "点到为止",
      "zh-hant": "點到為止",
      "en": "False Swipe",
      "ja": "みねうち"
    },
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "207": {
    "resourceType": "move",
    "id": 207,
    "slug": "swagger",
    "calcMoveName": "Swagger",
    "names": {
      "zh-hans": "虚张声势",
      "zh-hant": "虛張聲勢",
      "en": "Swagger",
      "ja": "いばる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 85,
    "damageKind": "swagger",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "208": {
    "resourceType": "move",
    "id": 208,
    "slug": "milk-drink",
    "calcMoveName": "Milk Drink",
    "names": {
      "zh-hans": "喝牛奶",
      "zh-hant": "喝牛奶",
      "en": "Milk Drink",
      "ja": "ミルクのみ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "209": {
    "resourceType": "move",
    "id": 209,
    "slug": "spark",
    "calcMoveName": "Spark",
    "names": {
      "zh-hans": "电光",
      "zh-hant": "電光",
      "en": "Spark",
      "ja": "スパーク"
    },
    "type": "electric",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "210": {
    "resourceType": "move",
    "id": 210,
    "slug": "fury-cutter",
    "calcMoveName": "Fury Cutter",
    "names": {
      "zh-hans": "连斩",
      "zh-hant": "連斬",
      "en": "Fury Cutter",
      "ja": "れんぞくぎり"
    },
    "type": "bug",
    "category": "physical",
    "power": 40,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "211": {
    "resourceType": "move",
    "id": 211,
    "slug": "steel-wing",
    "calcMoveName": "Steel Wing",
    "names": {
      "zh-hans": "钢翼",
      "zh-hant": "鋼翼",
      "en": "Steel Wing",
      "ja": "はがねのつばさ"
    },
    "type": "steel",
    "category": "physical",
    "power": 70,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "212": {
    "resourceType": "move",
    "id": 212,
    "slug": "mean-look",
    "calcMoveName": "Mean Look",
    "names": {
      "zh-hans": "黑色目光",
      "zh-hant": "黑色目光",
      "en": "Mean Look",
      "ja": "くろいまなざし"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "213": {
    "resourceType": "move",
    "id": 213,
    "slug": "attract",
    "calcMoveName": "Attract",
    "names": {
      "zh-hans": "迷人",
      "zh-hant": "迷人",
      "en": "Attract",
      "ja": "メロメロ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "214": {
    "resourceType": "move",
    "id": 214,
    "slug": "sleep-talk",
    "calcMoveName": "Sleep Talk",
    "names": {
      "zh-hans": "梦话",
      "zh-hant": "夢話",
      "en": "Sleep Talk",
      "ja": "ねごと"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "215": {
    "resourceType": "move",
    "id": 215,
    "slug": "heal-bell",
    "calcMoveName": "Heal Bell",
    "names": {
      "zh-hans": "治愈铃声",
      "zh-hant": "治癒鈴聲",
      "en": "Heal Bell",
      "ja": "いやしのすず"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user-and-allies",
    "isSpread": false
  },
  "216": {
    "resourceType": "move",
    "id": 216,
    "slug": "return",
    "calcMoveName": "Return",
    "names": {
      "zh-hans": "报恩",
      "zh-hant": "報恩",
      "en": "Return",
      "ja": "おんがえし"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "217": {
    "resourceType": "move",
    "id": 217,
    "slug": "present",
    "calcMoveName": "Present",
    "names": {
      "zh-hans": "礼物",
      "zh-hant": "禮物",
      "en": "Present",
      "ja": "プレゼント"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "218": {
    "resourceType": "move",
    "id": 218,
    "slug": "frustration",
    "calcMoveName": "Frustration",
    "names": {
      "zh-hans": "迁怒",
      "zh-hant": "遷怒",
      "en": "Frustration",
      "ja": "やつあたり"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "219": {
    "resourceType": "move",
    "id": 219,
    "slug": "safeguard",
    "calcMoveName": "Safeguard",
    "names": {
      "zh-hans": "神秘守护",
      "zh-hant": "神秘守護",
      "en": "Safeguard",
      "ja": "しんぴのまもり"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "220": {
    "resourceType": "move",
    "id": 220,
    "slug": "pain-split",
    "calcMoveName": "Pain Split",
    "names": {
      "zh-hans": "分担痛楚",
      "zh-hant": "分擔痛楚",
      "en": "Pain Split",
      "ja": "いたみわけ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "221": {
    "resourceType": "move",
    "id": 221,
    "slug": "sacred-fire",
    "calcMoveName": "Sacred Fire",
    "names": {
      "zh-hans": "神圣之火",
      "zh-hant": "神聖之火",
      "en": "Sacred Fire",
      "ja": "せいなるほのお"
    },
    "type": "fire",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "222": {
    "resourceType": "move",
    "id": 222,
    "slug": "magnitude",
    "calcMoveName": "Magnitude",
    "names": {
      "zh-hans": "震级",
      "zh-hant": "震級",
      "en": "Magnitude",
      "ja": "マグニチュード"
    },
    "type": "ground",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "223": {
    "resourceType": "move",
    "id": 223,
    "slug": "dynamic-punch",
    "calcMoveName": "Dynamic Punch",
    "names": {
      "zh-hans": "爆裂拳",
      "zh-hant": "爆裂拳",
      "en": "Dynamic Punch",
      "ja": "ばくれつパンチ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 50,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "224": {
    "resourceType": "move",
    "id": 224,
    "slug": "megahorn",
    "calcMoveName": "Megahorn",
    "names": {
      "zh-hans": "超级角击",
      "zh-hant": "超級角擊",
      "en": "Megahorn",
      "ja": "メガホーン"
    },
    "type": "bug",
    "category": "physical",
    "power": 120,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "225": {
    "resourceType": "move",
    "id": 225,
    "slug": "dragon-breath",
    "calcMoveName": "Dragon Breath",
    "names": {
      "zh-hans": "龙息",
      "zh-hant": "龍息",
      "en": "Dragon Breath",
      "ja": "りゅうのいぶき"
    },
    "type": "dragon",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "226": {
    "resourceType": "move",
    "id": 226,
    "slug": "baton-pass",
    "calcMoveName": "Baton Pass",
    "names": {
      "zh-hans": "接棒",
      "zh-hant": "接棒",
      "en": "Baton Pass",
      "ja": "バトンタッチ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "227": {
    "resourceType": "move",
    "id": 227,
    "slug": "encore",
    "calcMoveName": "Encore",
    "names": {
      "zh-hans": "再来一次",
      "zh-hant": "再來一次",
      "en": "Encore",
      "ja": "アンコール"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "228": {
    "resourceType": "move",
    "id": 228,
    "slug": "pursuit",
    "calcMoveName": "Pursuit",
    "names": {
      "zh-hans": "追打",
      "zh-hant": "追打",
      "en": "Pursuit",
      "ja": "おいうち"
    },
    "type": "dark",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "229": {
    "resourceType": "move",
    "id": 229,
    "slug": "rapid-spin",
    "calcMoveName": "Rapid Spin",
    "names": {
      "zh-hans": "高速旋转",
      "zh-hant": "高速旋轉",
      "en": "Rapid Spin",
      "ja": "こうそくスピン"
    },
    "type": "normal",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "230": {
    "resourceType": "move",
    "id": 230,
    "slug": "sweet-scent",
    "calcMoveName": "Sweet Scent",
    "names": {
      "zh-hans": "甜甜香气",
      "zh-hant": "甜甜香氣",
      "en": "Sweet Scent",
      "ja": "あまいかおり"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "all-opponents",
    "isSpread": true
  },
  "231": {
    "resourceType": "move",
    "id": 231,
    "slug": "iron-tail",
    "calcMoveName": "Iron Tail",
    "names": {
      "zh-hans": "铁尾",
      "zh-hant": "鐵尾",
      "en": "Iron Tail",
      "ja": "アイアンテール"
    },
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 75,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "232": {
    "resourceType": "move",
    "id": 232,
    "slug": "metal-claw",
    "calcMoveName": "Metal Claw",
    "names": {
      "zh-hans": "金属爪",
      "zh-hant": "金屬爪",
      "en": "Metal Claw",
      "ja": "メタルクロー"
    },
    "type": "steel",
    "category": "physical",
    "power": 50,
    "accuracy": 95,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "233": {
    "resourceType": "move",
    "id": 233,
    "slug": "vital-throw",
    "calcMoveName": "Vital Throw",
    "names": {
      "zh-hans": "借力摔",
      "zh-hant": "借力摔",
      "en": "Vital Throw",
      "ja": "あてみなげ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 70,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "234": {
    "resourceType": "move",
    "id": 234,
    "slug": "morning-sun",
    "calcMoveName": "Morning Sun",
    "names": {
      "zh-hans": "晨光",
      "zh-hant": "晨光",
      "en": "Morning Sun",
      "ja": "あさのひざし"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "235": {
    "resourceType": "move",
    "id": 235,
    "slug": "synthesis",
    "calcMoveName": "Synthesis",
    "names": {
      "zh-hans": "光合作用",
      "zh-hant": "光合作用",
      "en": "Synthesis",
      "ja": "こうごうせい"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "236": {
    "resourceType": "move",
    "id": 236,
    "slug": "moonlight",
    "calcMoveName": "Moonlight",
    "names": {
      "zh-hans": "月光",
      "zh-hant": "月光",
      "en": "Moonlight",
      "ja": "つきのひかり"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "237": {
    "resourceType": "move",
    "id": 237,
    "slug": "hidden-power",
    "calcMoveName": "Hidden Power",
    "names": {
      "zh-hans": "觉醒力量",
      "zh-hant": "覺醒力量",
      "en": "Hidden Power",
      "ja": "めざめるパワー"
    },
    "type": "normal",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "238": {
    "resourceType": "move",
    "id": 238,
    "slug": "cross-chop",
    "calcMoveName": "Cross Chop",
    "names": {
      "zh-hans": "十字劈",
      "zh-hant": "十字劈",
      "en": "Cross Chop",
      "ja": "クロスチョップ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 80,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "239": {
    "resourceType": "move",
    "id": 239,
    "slug": "twister",
    "calcMoveName": "Twister",
    "names": {
      "zh-hans": "龙卷风",
      "zh-hant": "龍捲風",
      "en": "Twister",
      "ja": "たつまき"
    },
    "type": "dragon",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "240": {
    "resourceType": "move",
    "id": 240,
    "slug": "rain-dance",
    "calcMoveName": "Rain Dance",
    "names": {
      "zh-hans": "求雨",
      "zh-hant": "求雨",
      "en": "Rain Dance",
      "ja": "あまごい"
    },
    "type": "water",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "241": {
    "resourceType": "move",
    "id": 241,
    "slug": "sunny-day",
    "calcMoveName": "Sunny Day",
    "names": {
      "zh-hans": "大晴天",
      "zh-hant": "大晴天",
      "en": "Sunny Day",
      "ja": "にほんばれ"
    },
    "type": "fire",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "242": {
    "resourceType": "move",
    "id": 242,
    "slug": "crunch",
    "calcMoveName": "Crunch",
    "names": {
      "zh-hans": "咬碎",
      "zh-hant": "咬碎",
      "en": "Crunch",
      "ja": "かみくだく"
    },
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "243": {
    "resourceType": "move",
    "id": 243,
    "slug": "mirror-coat",
    "calcMoveName": "Mirror Coat",
    "names": {
      "zh-hans": "镜面反射",
      "zh-hant": "鏡面反射",
      "en": "Mirror Coat",
      "ja": "ミラーコート"
    },
    "type": "psychic",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "specific-move",
    "isSpread": false
  },
  "244": {
    "resourceType": "move",
    "id": 244,
    "slug": "psych-up",
    "calcMoveName": "Psych Up",
    "names": {
      "zh-hans": "自我暗示",
      "zh-hant": "自我暗示",
      "en": "Psych Up",
      "ja": "じこあんじ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "245": {
    "resourceType": "move",
    "id": 245,
    "slug": "extreme-speed",
    "calcMoveName": "Extreme Speed",
    "names": {
      "zh-hans": "神速",
      "zh-hant": "神速",
      "en": "Extreme Speed",
      "ja": "しんそく"
    },
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "246": {
    "resourceType": "move",
    "id": 246,
    "slug": "ancient-power",
    "calcMoveName": "Ancient Power",
    "names": {
      "zh-hans": "原始之力",
      "zh-hant": "原始之力",
      "en": "Ancient Power",
      "ja": "げんしのちから"
    },
    "type": "rock",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "248": {
    "resourceType": "move",
    "id": 248,
    "slug": "future-sight",
    "calcMoveName": "Future Sight",
    "names": {
      "zh-hans": "预知未来",
      "zh-hant": "預知未來",
      "en": "Future Sight",
      "ja": "みらいよち"
    },
    "type": "psychic",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "249": {
    "resourceType": "move",
    "id": 249,
    "slug": "rock-smash",
    "calcMoveName": "Rock Smash",
    "names": {
      "zh-hans": "碎岩",
      "zh-hant": "碎岩",
      "en": "Rock Smash",
      "ja": "いわくだき"
    },
    "type": "fighting",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "250": {
    "resourceType": "move",
    "id": 250,
    "slug": "whirlpool",
    "calcMoveName": "Whirlpool",
    "names": {
      "zh-hans": "潮旋",
      "zh-hant": "潮旋",
      "en": "Whirlpool",
      "ja": "うずしお"
    },
    "type": "water",
    "category": "special",
    "power": 35,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "251": {
    "resourceType": "move",
    "id": 251,
    "slug": "beat-up",
    "calcMoveName": "Beat Up",
    "names": {
      "zh-hans": "围攻",
      "zh-hant": "圍攻",
      "en": "Beat Up",
      "ja": "ふくろだたき"
    },
    "type": "dark",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "253": {
    "resourceType": "move",
    "id": 253,
    "slug": "uproar",
    "calcMoveName": "Uproar",
    "names": {
      "zh-hans": "吵闹",
      "zh-hant": "吵鬧",
      "en": "Uproar",
      "ja": "さわぐ"
    },
    "type": "normal",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "random-opponent",
    "isSpread": false
  },
  "254": {
    "resourceType": "move",
    "id": 254,
    "slug": "stockpile",
    "calcMoveName": "Stockpile",
    "names": {
      "zh-hans": "蓄力",
      "zh-hant": "蓄力",
      "en": "Stockpile",
      "ja": "たくわえる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "255": {
    "resourceType": "move",
    "id": 255,
    "slug": "spit-up",
    "calcMoveName": "Spit Up",
    "names": {
      "zh-hans": "喷出",
      "zh-hant": "噴出",
      "en": "Spit Up",
      "ja": "はきだす"
    },
    "type": "normal",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "256": {
    "resourceType": "move",
    "id": 256,
    "slug": "swallow",
    "calcMoveName": "Swallow",
    "names": {
      "zh-hans": "吞下",
      "zh-hant": "吞下",
      "en": "Swallow",
      "ja": "のみこむ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "257": {
    "resourceType": "move",
    "id": 257,
    "slug": "heat-wave",
    "calcMoveName": "Heat Wave",
    "names": {
      "zh-hans": "热风",
      "zh-hant": "熱風",
      "en": "Heat Wave",
      "ja": "ねっぷう"
    },
    "type": "fire",
    "category": "special",
    "power": 95,
    "accuracy": 90,
    "damageKind": "damage-ailment",
    "target": "all-opponents",
    "isSpread": true
  },
  "258": {
    "resourceType": "move",
    "id": 258,
    "slug": "hail",
    "calcMoveName": "Hail",
    "names": {
      "zh-hans": "冰雹",
      "zh-hant": "冰雹",
      "en": "Hail",
      "ja": "あられ"
    },
    "type": "ice",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "259": {
    "resourceType": "move",
    "id": 259,
    "slug": "torment",
    "calcMoveName": "Torment",
    "names": {
      "zh-hans": "无理取闹",
      "zh-hant": "無理取鬧",
      "en": "Torment",
      "ja": "いちゃもん"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "260": {
    "resourceType": "move",
    "id": 260,
    "slug": "flatter",
    "calcMoveName": "Flatter",
    "names": {
      "zh-hans": "吹捧",
      "zh-hant": "吹捧",
      "en": "Flatter",
      "ja": "おだてる"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "swagger",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "262": {
    "resourceType": "move",
    "id": 262,
    "slug": "memento",
    "calcMoveName": "Memento",
    "names": {
      "zh-hans": "临别礼物",
      "zh-hant": "臨別禮物",
      "en": "Memento",
      "ja": "おきみやげ"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "263": {
    "resourceType": "move",
    "id": 263,
    "slug": "facade",
    "calcMoveName": "Facade",
    "names": {
      "zh-hans": "硬撑",
      "zh-hant": "硬撐",
      "en": "Facade",
      "ja": "からげんき"
    },
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "264": {
    "resourceType": "move",
    "id": 264,
    "slug": "focus-punch",
    "calcMoveName": "Focus Punch",
    "names": {
      "zh-hans": "真气拳",
      "zh-hant": "真氣拳",
      "en": "Focus Punch",
      "ja": "きあいパンチ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 150,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "265": {
    "resourceType": "move",
    "id": 265,
    "slug": "smelling-salts",
    "calcMoveName": "Smelling Salts",
    "names": {
      "zh-hans": "清醒",
      "zh-hant": "清醒",
      "en": "Smelling Salts",
      "ja": "きつけ"
    },
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "266": {
    "resourceType": "move",
    "id": 266,
    "slug": "follow-me",
    "calcMoveName": "Follow Me",
    "names": {
      "zh-hans": "看我嘛",
      "zh-hant": "看我嘛",
      "en": "Follow Me",
      "ja": "このゆびとまれ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "267": {
    "resourceType": "move",
    "id": 267,
    "slug": "nature-power",
    "calcMoveName": "Nature Power",
    "names": {
      "zh-hans": "自然之力",
      "zh-hant": "自然之力",
      "en": "Nature Power",
      "ja": "しぜんのちから"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "268": {
    "resourceType": "move",
    "id": 268,
    "slug": "charge",
    "calcMoveName": "Charge",
    "names": {
      "zh-hans": "充电",
      "zh-hant": "充電",
      "en": "Charge",
      "ja": "じゅうでん"
    },
    "type": "electric",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
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
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "270": {
    "resourceType": "move",
    "id": 270,
    "slug": "helping-hand",
    "calcMoveName": "Helping Hand",
    "names": {
      "zh-hans": "帮助",
      "zh-hant": "幫助",
      "en": "Helping Hand",
      "ja": "てだすけ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "ally",
    "isSpread": false
  },
  "271": {
    "resourceType": "move",
    "id": 271,
    "slug": "trick",
    "calcMoveName": "Trick",
    "names": {
      "zh-hans": "戏法",
      "zh-hant": "戲法",
      "en": "Trick",
      "ja": "トリック"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "272": {
    "resourceType": "move",
    "id": 272,
    "slug": "role-play",
    "calcMoveName": "Role Play",
    "names": {
      "zh-hans": "扮演",
      "zh-hant": "扮演",
      "en": "Role Play",
      "ja": "なりきり"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "273": {
    "resourceType": "move",
    "id": 273,
    "slug": "wish",
    "calcMoveName": "Wish",
    "names": {
      "zh-hans": "祈愿",
      "zh-hant": "祈願",
      "en": "Wish",
      "ja": "ねがいごと"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "274": {
    "resourceType": "move",
    "id": 274,
    "slug": "assist",
    "calcMoveName": "Assist",
    "names": {
      "zh-hans": "借助",
      "zh-hant": "借助",
      "en": "Assist",
      "ja": "ねこのて"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "275": {
    "resourceType": "move",
    "id": 275,
    "slug": "ingrain",
    "calcMoveName": "Ingrain",
    "names": {
      "zh-hans": "扎根",
      "zh-hant": "扎根",
      "en": "Ingrain",
      "ja": "ねをはる"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "ailment",
    "target": "user",
    "isSpread": false
  },
  "276": {
    "resourceType": "move",
    "id": 276,
    "slug": "superpower",
    "calcMoveName": "Superpower",
    "names": {
      "zh-hans": "蛮力",
      "zh-hant": "蠻力",
      "en": "Superpower",
      "ja": "ばかぢから"
    },
    "type": "fighting",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "277": {
    "resourceType": "move",
    "id": 277,
    "slug": "magic-coat",
    "calcMoveName": "Magic Coat",
    "names": {
      "zh-hans": "魔法反射",
      "zh-hant": "魔法反射",
      "en": "Magic Coat",
      "ja": "マジックコート"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "278": {
    "resourceType": "move",
    "id": 278,
    "slug": "recycle",
    "calcMoveName": "Recycle",
    "names": {
      "zh-hans": "回收利用",
      "zh-hant": "回收利用",
      "en": "Recycle",
      "ja": "リサイクル"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "279": {
    "resourceType": "move",
    "id": 279,
    "slug": "revenge",
    "calcMoveName": "Revenge",
    "names": {
      "zh-hans": "报复",
      "zh-hant": "報復",
      "en": "Revenge",
      "ja": "リベンジ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "280": {
    "resourceType": "move",
    "id": 280,
    "slug": "brick-break",
    "calcMoveName": "Brick Break",
    "names": {
      "zh-hans": "劈瓦",
      "zh-hant": "劈瓦",
      "en": "Brick Break",
      "ja": "かわらわり"
    },
    "type": "fighting",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "281": {
    "resourceType": "move",
    "id": 281,
    "slug": "yawn",
    "calcMoveName": "Yawn",
    "names": {
      "zh-hans": "哈欠",
      "zh-hant": "哈欠",
      "en": "Yawn",
      "ja": "あくび"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "283": {
    "resourceType": "move",
    "id": 283,
    "slug": "endeavor",
    "calcMoveName": "Endeavor",
    "names": {
      "zh-hans": "蛮干",
      "zh-hant": "蠻幹",
      "en": "Endeavor",
      "ja": "がむしゃら"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "284": {
    "resourceType": "move",
    "id": 284,
    "slug": "eruption",
    "calcMoveName": "Eruption",
    "names": {
      "zh-hans": "喷火",
      "zh-hant": "噴火",
      "en": "Eruption",
      "ja": "ふんか"
    },
    "type": "fire",
    "category": "special",
    "power": 150,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "285": {
    "resourceType": "move",
    "id": 285,
    "slug": "skill-swap",
    "calcMoveName": "Skill Swap",
    "names": {
      "zh-hans": "特性互换",
      "zh-hant": "特性互換",
      "en": "Skill Swap",
      "ja": "スキルスワップ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "286": {
    "resourceType": "move",
    "id": 286,
    "slug": "imprison",
    "calcMoveName": "Imprison",
    "names": {
      "zh-hans": "封印",
      "zh-hant": "封印",
      "en": "Imprison",
      "ja": "ふういん"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "287": {
    "resourceType": "move",
    "id": 287,
    "slug": "refresh",
    "calcMoveName": "Refresh",
    "names": {
      "zh-hans": "焕然一新",
      "zh-hant": "煥然一新",
      "en": "Refresh",
      "ja": "リフレッシュ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "288": {
    "resourceType": "move",
    "id": 288,
    "slug": "grudge",
    "calcMoveName": "Grudge",
    "names": {
      "zh-hans": "怨念",
      "zh-hant": "怨念",
      "en": "Grudge",
      "ja": "おんねん"
    },
    "type": "ghost",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "289": {
    "resourceType": "move",
    "id": 289,
    "slug": "snatch",
    "calcMoveName": "Snatch",
    "names": {
      "zh-hans": "抢夺",
      "zh-hant": "搶奪",
      "en": "Snatch",
      "ja": "よこどり"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "290": {
    "resourceType": "move",
    "id": 290,
    "slug": "secret-power",
    "calcMoveName": "Secret Power",
    "names": {
      "zh-hans": "秘密之力",
      "zh-hant": "秘密之力",
      "en": "Secret Power",
      "ja": "ひみつのちから"
    },
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "291": {
    "resourceType": "move",
    "id": 291,
    "slug": "dive",
    "calcMoveName": "Dive",
    "names": {
      "zh-hans": "潜水",
      "zh-hant": "潛水",
      "en": "Dive",
      "ja": "ダイビング"
    },
    "type": "water",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "292": {
    "resourceType": "move",
    "id": 292,
    "slug": "arm-thrust",
    "calcMoveName": "Arm Thrust",
    "names": {
      "zh-hans": "猛推",
      "zh-hant": "猛推",
      "en": "Arm Thrust",
      "ja": "つっぱり"
    },
    "type": "fighting",
    "category": "physical",
    "power": 15,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "293": {
    "resourceType": "move",
    "id": 293,
    "slug": "camouflage",
    "calcMoveName": "Camouflage",
    "names": {
      "zh-hans": "保护色",
      "zh-hant": "保護色",
      "en": "Camouflage",
      "ja": "ほごしょく"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "294": {
    "resourceType": "move",
    "id": 294,
    "slug": "tail-glow",
    "calcMoveName": "Tail Glow",
    "names": {
      "zh-hans": "萤火",
      "zh-hant": "螢火",
      "en": "Tail Glow",
      "ja": "ほたるび"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "295": {
    "resourceType": "move",
    "id": 295,
    "slug": "luster-purge",
    "calcMoveName": "Luster Purge",
    "names": {
      "zh-hans": "洁净光芒",
      "zh-hant": "潔淨光芒",
      "en": "Luster Purge",
      "ja": "ラスターパージ"
    },
    "type": "psychic",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "296": {
    "resourceType": "move",
    "id": 296,
    "slug": "mist-ball",
    "calcMoveName": "Mist Ball",
    "names": {
      "zh-hans": "薄雾球",
      "zh-hant": "薄霧球",
      "en": "Mist Ball",
      "ja": "ミストボール"
    },
    "type": "psychic",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "297": {
    "resourceType": "move",
    "id": 297,
    "slug": "feather-dance",
    "calcMoveName": "Feather Dance",
    "names": {
      "zh-hans": "羽毛舞",
      "zh-hant": "羽毛舞",
      "en": "Feather Dance",
      "ja": "フェザーダンス"
    },
    "type": "flying",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "298": {
    "resourceType": "move",
    "id": 298,
    "slug": "teeter-dance",
    "calcMoveName": "Teeter Dance",
    "names": {
      "zh-hans": "摇晃舞",
      "zh-hant": "搖晃舞",
      "en": "Teeter Dance",
      "ja": "フラフラダンス"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "299": {
    "resourceType": "move",
    "id": 299,
    "slug": "blaze-kick",
    "calcMoveName": "Blaze Kick",
    "names": {
      "zh-hans": "火焰踢",
      "zh-hant": "火焰踢",
      "en": "Blaze Kick",
      "ja": "ブレイズキック"
    },
    "type": "fire",
    "category": "physical",
    "power": 85,
    "accuracy": 90,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "300": {
    "resourceType": "move",
    "id": 300,
    "slug": "mud-sport",
    "calcMoveName": "Mud Sport",
    "names": {
      "zh-hans": "玩泥巴",
      "zh-hant": "玩泥巴",
      "en": "Mud Sport",
      "ja": "どろあそび"
    },
    "type": "ground",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "301": {
    "resourceType": "move",
    "id": 301,
    "slug": "ice-ball",
    "calcMoveName": "Ice Ball",
    "names": {
      "zh-hans": "冰球",
      "zh-hant": "冰球",
      "en": "Ice Ball",
      "ja": "アイスボール"
    },
    "type": "ice",
    "category": "physical",
    "power": 30,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "302": {
    "resourceType": "move",
    "id": 302,
    "slug": "needle-arm",
    "calcMoveName": "Needle Arm",
    "names": {
      "zh-hans": "尖刺臂",
      "zh-hant": "尖刺臂",
      "en": "Needle Arm",
      "ja": "ニードルアーム"
    },
    "type": "grass",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "303": {
    "resourceType": "move",
    "id": 303,
    "slug": "slack-off",
    "calcMoveName": "Slack Off",
    "names": {
      "zh-hans": "偷懒",
      "zh-hant": "偷懶",
      "en": "Slack Off",
      "ja": "なまける"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "304": {
    "resourceType": "move",
    "id": 304,
    "slug": "hyper-voice",
    "calcMoveName": "Hyper Voice",
    "names": {
      "zh-hans": "巨声",
      "zh-hant": "巨聲",
      "en": "Hyper Voice",
      "ja": "ハイパーボイス"
    },
    "type": "normal",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "305": {
    "resourceType": "move",
    "id": 305,
    "slug": "poison-fang",
    "calcMoveName": "Poison Fang",
    "names": {
      "zh-hans": "剧毒牙",
      "zh-hant": "劇毒牙",
      "en": "Poison Fang",
      "ja": "どくどくのキバ"
    },
    "type": "poison",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "306": {
    "resourceType": "move",
    "id": 306,
    "slug": "crush-claw",
    "calcMoveName": "Crush Claw",
    "names": {
      "zh-hans": "撕裂爪",
      "zh-hant": "撕裂爪",
      "en": "Crush Claw",
      "ja": "ブレイククロー"
    },
    "type": "normal",
    "category": "physical",
    "power": 75,
    "accuracy": 95,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "307": {
    "resourceType": "move",
    "id": 307,
    "slug": "blast-burn",
    "calcMoveName": "Blast Burn",
    "names": {
      "zh-hans": "爆炸烈焰",
      "zh-hant": "爆炸烈焰",
      "en": "Blast Burn",
      "ja": "ブラストバーン"
    },
    "type": "fire",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "308": {
    "resourceType": "move",
    "id": 308,
    "slug": "hydro-cannon",
    "calcMoveName": "Hydro Cannon",
    "names": {
      "zh-hans": "加农水炮",
      "zh-hant": "加農水炮",
      "en": "Hydro Cannon",
      "ja": "ハイドロカノン"
    },
    "type": "water",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "309": {
    "resourceType": "move",
    "id": 309,
    "slug": "meteor-mash",
    "calcMoveName": "Meteor Mash",
    "names": {
      "zh-hans": "彗星拳",
      "zh-hant": "彗星拳",
      "en": "Meteor Mash",
      "ja": "コメットパンチ"
    },
    "type": "steel",
    "category": "physical",
    "power": 90,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "310": {
    "resourceType": "move",
    "id": 310,
    "slug": "astonish",
    "calcMoveName": "Astonish",
    "names": {
      "zh-hans": "惊吓",
      "zh-hant": "驚嚇",
      "en": "Astonish",
      "ja": "おどろかす"
    },
    "type": "ghost",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "311": {
    "resourceType": "move",
    "id": 311,
    "slug": "weather-ball",
    "calcMoveName": "Weather Ball",
    "names": {
      "zh-hans": "气象球",
      "zh-hant": "氣象球",
      "en": "Weather Ball",
      "ja": "ウェザーボール"
    },
    "type": "normal",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "312": {
    "resourceType": "move",
    "id": 312,
    "slug": "aromatherapy",
    "calcMoveName": "Aromatherapy",
    "names": {
      "zh-hans": "芳香治疗",
      "zh-hant": "芳香治療",
      "en": "Aromatherapy",
      "ja": "アロマセラピー"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user-and-allies",
    "isSpread": false
  },
  "313": {
    "resourceType": "move",
    "id": 313,
    "slug": "fake-tears",
    "calcMoveName": "Fake Tears",
    "names": {
      "zh-hans": "假哭",
      "zh-hant": "假哭",
      "en": "Fake Tears",
      "ja": "うそなき"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "314": {
    "resourceType": "move",
    "id": 314,
    "slug": "air-cutter",
    "calcMoveName": "Air Cutter",
    "names": {
      "zh-hans": "空气利刃",
      "zh-hant": "空氣利刃",
      "en": "Air Cutter",
      "ja": "エアカッター"
    },
    "type": "flying",
    "category": "special",
    "power": 60,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "315": {
    "resourceType": "move",
    "id": 315,
    "slug": "overheat",
    "calcMoveName": "Overheat",
    "names": {
      "zh-hans": "过热",
      "zh-hant": "過熱",
      "en": "Overheat",
      "ja": "オーバーヒート"
    },
    "type": "fire",
    "category": "special",
    "power": 130,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "316": {
    "resourceType": "move",
    "id": 316,
    "slug": "odor-sleuth",
    "calcMoveName": "Odor Sleuth",
    "names": {
      "zh-hans": "气味侦测",
      "zh-hant": "氣味偵測",
      "en": "Odor Sleuth",
      "ja": "かぎわける"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "318": {
    "resourceType": "move",
    "id": 318,
    "slug": "silver-wind",
    "calcMoveName": "Silver Wind",
    "names": {
      "zh-hans": "银色旋风",
      "zh-hant": "銀色旋風",
      "en": "Silver Wind",
      "ja": "ぎんいろのかぜ"
    },
    "type": "bug",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "319": {
    "resourceType": "move",
    "id": 319,
    "slug": "metal-sound",
    "calcMoveName": "Metal Sound",
    "names": {
      "zh-hans": "金属音",
      "zh-hant": "金屬音",
      "en": "Metal Sound",
      "ja": "きんぞくおん"
    },
    "type": "steel",
    "category": "status",
    "power": null,
    "accuracy": 85,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "320": {
    "resourceType": "move",
    "id": 320,
    "slug": "grass-whistle",
    "calcMoveName": "Grass Whistle",
    "names": {
      "zh-hans": "草笛",
      "zh-hant": "草笛",
      "en": "Grass Whistle",
      "ja": "くさぶえ"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 55,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "321": {
    "resourceType": "move",
    "id": 321,
    "slug": "tickle",
    "calcMoveName": "Tickle",
    "names": {
      "zh-hans": "挠痒",
      "zh-hant": "搔癢",
      "en": "Tickle",
      "ja": "くすぐる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "322": {
    "resourceType": "move",
    "id": 322,
    "slug": "cosmic-power",
    "calcMoveName": "Cosmic Power",
    "names": {
      "zh-hans": "宇宙力量",
      "zh-hant": "宇宙力量",
      "en": "Cosmic Power",
      "ja": "コスモパワー"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "323": {
    "resourceType": "move",
    "id": 323,
    "slug": "water-spout",
    "calcMoveName": "Water Spout",
    "names": {
      "zh-hans": "喷水",
      "zh-hant": "噴水",
      "en": "Water Spout",
      "ja": "しおふき"
    },
    "type": "water",
    "category": "special",
    "power": 150,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "324": {
    "resourceType": "move",
    "id": 324,
    "slug": "signal-beam",
    "calcMoveName": "Signal Beam",
    "names": {
      "zh-hans": "信号光束",
      "zh-hant": "信號光束",
      "en": "Signal Beam",
      "ja": "シグナルビーム"
    },
    "type": "bug",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "325": {
    "resourceType": "move",
    "id": 325,
    "slug": "shadow-punch",
    "calcMoveName": "Shadow Punch",
    "names": {
      "zh-hans": "暗影拳",
      "zh-hant": "暗影拳",
      "en": "Shadow Punch",
      "ja": "シャドーパンチ"
    },
    "type": "ghost",
    "category": "physical",
    "power": 60,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "326": {
    "resourceType": "move",
    "id": 326,
    "slug": "extrasensory",
    "calcMoveName": "Extrasensory",
    "names": {
      "zh-hans": "神通力",
      "zh-hant": "神通力",
      "en": "Extrasensory",
      "ja": "じんつうりき"
    },
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "327": {
    "resourceType": "move",
    "id": 327,
    "slug": "sky-uppercut",
    "calcMoveName": "Sky Uppercut",
    "names": {
      "zh-hans": "冲天拳",
      "zh-hant": "衝天拳",
      "en": "Sky Uppercut",
      "ja": "スカイアッパー"
    },
    "type": "fighting",
    "category": "physical",
    "power": 85,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "328": {
    "resourceType": "move",
    "id": 328,
    "slug": "sand-tomb",
    "calcMoveName": "Sand Tomb",
    "names": {
      "zh-hans": "流沙地狱",
      "zh-hant": "流沙地獄",
      "en": "Sand Tomb",
      "ja": "すなじごく"
    },
    "type": "ground",
    "category": "physical",
    "power": 35,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "329": {
    "resourceType": "move",
    "id": 329,
    "slug": "sheer-cold",
    "calcMoveName": "Sheer Cold",
    "names": {
      "zh-hans": "绝对零度",
      "zh-hant": "絕對零度",
      "en": "Sheer Cold",
      "ja": "ぜったいれいど"
    },
    "type": "ice",
    "category": "special",
    "power": null,
    "accuracy": 30,
    "damageKind": "ohko",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "330": {
    "resourceType": "move",
    "id": 330,
    "slug": "muddy-water",
    "calcMoveName": "Muddy Water",
    "names": {
      "zh-hans": "浊流",
      "zh-hant": "濁流",
      "en": "Muddy Water",
      "ja": "だくりゅう"
    },
    "type": "water",
    "category": "special",
    "power": 90,
    "accuracy": 85,
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "331": {
    "resourceType": "move",
    "id": 331,
    "slug": "bullet-seed",
    "calcMoveName": "Bullet Seed",
    "names": {
      "zh-hans": "种子机关枪",
      "zh-hant": "種子機關槍",
      "en": "Bullet Seed",
      "ja": "タネマシンガン"
    },
    "type": "grass",
    "category": "physical",
    "power": 25,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "332": {
    "resourceType": "move",
    "id": 332,
    "slug": "aerial-ace",
    "calcMoveName": "Aerial Ace",
    "names": {
      "zh-hans": "燕返",
      "zh-hant": "燕返",
      "en": "Aerial Ace",
      "ja": "つばめがえし"
    },
    "type": "flying",
    "category": "physical",
    "power": 60,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "333": {
    "resourceType": "move",
    "id": 333,
    "slug": "icicle-spear",
    "calcMoveName": "Icicle Spear",
    "names": {
      "zh-hans": "冰锥",
      "zh-hant": "冰錐",
      "en": "Icicle Spear",
      "ja": "つららばり"
    },
    "type": "ice",
    "category": "physical",
    "power": 25,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "334": {
    "resourceType": "move",
    "id": 334,
    "slug": "iron-defense",
    "calcMoveName": "Iron Defense",
    "names": {
      "zh-hans": "铁壁",
      "zh-hant": "鐵壁",
      "en": "Iron Defense",
      "ja": "てっぺき"
    },
    "type": "steel",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "335": {
    "resourceType": "move",
    "id": 335,
    "slug": "block",
    "calcMoveName": "Block",
    "names": {
      "zh-hans": "挡路",
      "zh-hant": "擋路",
      "en": "Block",
      "ja": "とおせんぼう"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "336": {
    "resourceType": "move",
    "id": 336,
    "slug": "howl",
    "calcMoveName": "Howl",
    "names": {
      "zh-hans": "长嚎",
      "zh-hant": "長嚎",
      "en": "Howl",
      "ja": "とおぼえ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user-and-allies",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "338": {
    "resourceType": "move",
    "id": 338,
    "slug": "frenzy-plant",
    "calcMoveName": "Frenzy Plant",
    "names": {
      "zh-hans": "疯狂植物",
      "zh-hant": "瘋狂植物",
      "en": "Frenzy Plant",
      "ja": "ハードプラント"
    },
    "type": "grass",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "339": {
    "resourceType": "move",
    "id": 339,
    "slug": "bulk-up",
    "calcMoveName": "Bulk Up",
    "names": {
      "zh-hans": "健美",
      "zh-hant": "健美",
      "en": "Bulk Up",
      "ja": "ビルドアップ"
    },
    "type": "fighting",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "340": {
    "resourceType": "move",
    "id": 340,
    "slug": "bounce",
    "calcMoveName": "Bounce",
    "names": {
      "zh-hans": "弹跳",
      "zh-hant": "彈跳",
      "en": "Bounce",
      "ja": "とびはねる"
    },
    "type": "flying",
    "category": "physical",
    "power": 85,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "341": {
    "resourceType": "move",
    "id": 341,
    "slug": "mud-shot",
    "calcMoveName": "Mud Shot",
    "names": {
      "zh-hans": "泥巴射击",
      "zh-hant": "泥巴射擊",
      "en": "Mud Shot",
      "ja": "マッドショット"
    },
    "type": "ground",
    "category": "special",
    "power": 55,
    "accuracy": 95,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "342": {
    "resourceType": "move",
    "id": 342,
    "slug": "poison-tail",
    "calcMoveName": "Poison Tail",
    "names": {
      "zh-hans": "毒尾",
      "zh-hant": "毒尾",
      "en": "Poison Tail",
      "ja": "ポイズンテール"
    },
    "type": "poison",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "343": {
    "resourceType": "move",
    "id": 343,
    "slug": "covet",
    "calcMoveName": "Covet",
    "names": {
      "zh-hans": "渴望",
      "zh-hant": "渴望",
      "en": "Covet",
      "ja": "ほしがる"
    },
    "type": "normal",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "344": {
    "resourceType": "move",
    "id": 344,
    "slug": "volt-tackle",
    "calcMoveName": "Volt Tackle",
    "names": {
      "zh-hans": "伏特攻击",
      "zh-hant": "伏特攻擊",
      "en": "Volt Tackle",
      "ja": "ボルテッカー"
    },
    "type": "electric",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "345": {
    "resourceType": "move",
    "id": 345,
    "slug": "magical-leaf",
    "calcMoveName": "Magical Leaf",
    "names": {
      "zh-hans": "魔法叶",
      "zh-hant": "魔法葉",
      "en": "Magical Leaf",
      "ja": "マジカルリーフ"
    },
    "type": "grass",
    "category": "special",
    "power": 60,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "346": {
    "resourceType": "move",
    "id": 346,
    "slug": "water-sport",
    "calcMoveName": "Water Sport",
    "names": {
      "zh-hans": "玩水",
      "zh-hant": "玩水",
      "en": "Water Sport",
      "ja": "みずあそび"
    },
    "type": "water",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "347": {
    "resourceType": "move",
    "id": 347,
    "slug": "calm-mind",
    "calcMoveName": "Calm Mind",
    "names": {
      "zh-hans": "冥想",
      "zh-hant": "冥想",
      "en": "Calm Mind",
      "ja": "めいそう"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "348": {
    "resourceType": "move",
    "id": 348,
    "slug": "leaf-blade",
    "calcMoveName": "Leaf Blade",
    "names": {
      "zh-hans": "叶刃",
      "zh-hant": "葉刃",
      "en": "Leaf Blade",
      "ja": "リーフブレード"
    },
    "type": "grass",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "349": {
    "resourceType": "move",
    "id": 349,
    "slug": "dragon-dance",
    "calcMoveName": "Dragon Dance",
    "names": {
      "zh-hans": "龙之舞",
      "zh-hant": "龍之舞",
      "en": "Dragon Dance",
      "ja": "りゅうのまい"
    },
    "type": "dragon",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "350": {
    "resourceType": "move",
    "id": 350,
    "slug": "rock-blast",
    "calcMoveName": "Rock Blast",
    "names": {
      "zh-hans": "岩石爆击",
      "zh-hant": "岩石爆擊",
      "en": "Rock Blast",
      "ja": "ロックブラスト"
    },
    "type": "rock",
    "category": "physical",
    "power": 25,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "351": {
    "resourceType": "move",
    "id": 351,
    "slug": "shock-wave",
    "calcMoveName": "Shock Wave",
    "names": {
      "zh-hans": "电击波",
      "zh-hant": "電擊波",
      "en": "Shock Wave",
      "ja": "でんげきは"
    },
    "type": "electric",
    "category": "special",
    "power": 60,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "352": {
    "resourceType": "move",
    "id": 352,
    "slug": "water-pulse",
    "calcMoveName": "Water Pulse",
    "names": {
      "zh-hans": "水之波动",
      "zh-hant": "水之波動",
      "en": "Water Pulse",
      "ja": "みずのはどう"
    },
    "type": "water",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "353": {
    "resourceType": "move",
    "id": 353,
    "slug": "doom-desire",
    "calcMoveName": "Doom Desire",
    "names": {
      "zh-hans": "破灭之愿",
      "zh-hant": "破滅之願",
      "en": "Doom Desire",
      "ja": "はめつのねがい"
    },
    "type": "steel",
    "category": "special",
    "power": 140,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "354": {
    "resourceType": "move",
    "id": 354,
    "slug": "psycho-boost",
    "calcMoveName": "Psycho Boost",
    "names": {
      "zh-hans": "精神突进",
      "zh-hant": "精神突進",
      "en": "Psycho Boost",
      "ja": "サイコブースト"
    },
    "type": "psychic",
    "category": "special",
    "power": 140,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "355": {
    "resourceType": "move",
    "id": 355,
    "slug": "roost",
    "calcMoveName": "Roost",
    "names": {
      "zh-hans": "羽栖",
      "zh-hant": "羽棲",
      "en": "Roost",
      "ja": "はねやすめ"
    },
    "type": "flying",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "356": {
    "resourceType": "move",
    "id": 356,
    "slug": "gravity",
    "calcMoveName": "Gravity",
    "names": {
      "zh-hans": "重力",
      "zh-hant": "重力",
      "en": "Gravity",
      "ja": "じゅうりょく"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "357": {
    "resourceType": "move",
    "id": 357,
    "slug": "miracle-eye",
    "calcMoveName": "Miracle Eye",
    "names": {
      "zh-hans": "奇迹之眼",
      "zh-hant": "奇跡之眼",
      "en": "Miracle Eye",
      "ja": "ミラクルアイ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "358": {
    "resourceType": "move",
    "id": 358,
    "slug": "wake-up-slap",
    "calcMoveName": "Wake-Up Slap",
    "names": {
      "zh-hans": "唤醒巴掌",
      "zh-hant": "喚醒巴掌",
      "en": "Wake-Up Slap",
      "ja": "めざましビンタ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "359": {
    "resourceType": "move",
    "id": 359,
    "slug": "hammer-arm",
    "calcMoveName": "Hammer Arm",
    "names": {
      "zh-hans": "臂锤",
      "zh-hant": "臂錘",
      "en": "Hammer Arm",
      "ja": "アームハンマー"
    },
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "360": {
    "resourceType": "move",
    "id": 360,
    "slug": "gyro-ball",
    "calcMoveName": "Gyro Ball",
    "names": {
      "zh-hans": "陀螺球",
      "zh-hant": "陀螺球",
      "en": "Gyro Ball",
      "ja": "ジャイロボール"
    },
    "type": "steel",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "361": {
    "resourceType": "move",
    "id": 361,
    "slug": "healing-wish",
    "calcMoveName": "Healing Wish",
    "names": {
      "zh-hans": "治愈之愿",
      "zh-hant": "治癒之願",
      "en": "Healing Wish",
      "ja": "いやしのねがい"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "362": {
    "resourceType": "move",
    "id": 362,
    "slug": "brine",
    "calcMoveName": "Brine",
    "names": {
      "zh-hans": "盐水",
      "zh-hant": "鹽水",
      "en": "Brine",
      "ja": "しおみず"
    },
    "type": "water",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "363": {
    "resourceType": "move",
    "id": 363,
    "slug": "natural-gift",
    "calcMoveName": "Natural Gift",
    "names": {
      "zh-hans": "自然之恩",
      "zh-hant": "自然之恩",
      "en": "Natural Gift",
      "ja": "しぜんのめぐみ"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "364": {
    "resourceType": "move",
    "id": 364,
    "slug": "feint",
    "calcMoveName": "Feint",
    "names": {
      "zh-hans": "佯攻",
      "zh-hant": "佯攻",
      "en": "Feint",
      "ja": "フェイント"
    },
    "type": "normal",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "365": {
    "resourceType": "move",
    "id": 365,
    "slug": "pluck",
    "calcMoveName": "Pluck",
    "names": {
      "zh-hans": "啄食",
      "zh-hant": "啄食",
      "en": "Pluck",
      "ja": "ついばむ"
    },
    "type": "flying",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "366": {
    "resourceType": "move",
    "id": 366,
    "slug": "tailwind",
    "calcMoveName": "Tailwind",
    "names": {
      "zh-hans": "顺风",
      "zh-hant": "順風",
      "en": "Tailwind",
      "ja": "おいかぜ"
    },
    "type": "flying",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "367": {
    "resourceType": "move",
    "id": 367,
    "slug": "acupressure",
    "calcMoveName": "Acupressure",
    "names": {
      "zh-hans": "点穴",
      "zh-hant": "點穴",
      "en": "Acupressure",
      "ja": "つぼをつく"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user-or-ally",
    "isSpread": false
  },
  "368": {
    "resourceType": "move",
    "id": 368,
    "slug": "metal-burst",
    "calcMoveName": "Metal Burst",
    "names": {
      "zh-hans": "金属爆炸",
      "zh-hant": "金屬爆炸",
      "en": "Metal Burst",
      "ja": "メタルバースト"
    },
    "type": "steel",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "specific-move",
    "isSpread": false
  },
  "369": {
    "resourceType": "move",
    "id": 369,
    "slug": "u-turn",
    "calcMoveName": "U-turn",
    "names": {
      "zh-hans": "急速折返",
      "zh-hant": "急速折返",
      "en": "U-turn",
      "ja": "とんぼがえり"
    },
    "type": "bug",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "371": {
    "resourceType": "move",
    "id": 371,
    "slug": "payback",
    "calcMoveName": "Payback",
    "names": {
      "zh-hans": "以牙还牙",
      "zh-hant": "以牙還牙",
      "en": "Payback",
      "ja": "しっぺがえし"
    },
    "type": "dark",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "372": {
    "resourceType": "move",
    "id": 372,
    "slug": "assurance",
    "calcMoveName": "Assurance",
    "names": {
      "zh-hans": "恶意追击",
      "zh-hant": "惡意追擊",
      "en": "Assurance",
      "ja": "ダメおし"
    },
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "373": {
    "resourceType": "move",
    "id": 373,
    "slug": "embargo",
    "calcMoveName": "Embargo",
    "names": {
      "zh-hans": "查封",
      "zh-hant": "查封",
      "en": "Embargo",
      "ja": "さしおさえ"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "374": {
    "resourceType": "move",
    "id": 374,
    "slug": "fling",
    "calcMoveName": "Fling",
    "names": {
      "zh-hans": "投掷",
      "zh-hant": "投擲",
      "en": "Fling",
      "ja": "なげつける"
    },
    "type": "dark",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "375": {
    "resourceType": "move",
    "id": 375,
    "slug": "psycho-shift",
    "calcMoveName": "Psycho Shift",
    "names": {
      "zh-hans": "精神转移",
      "zh-hant": "精神轉移",
      "en": "Psycho Shift",
      "ja": "サイコシフト"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "376": {
    "resourceType": "move",
    "id": 376,
    "slug": "trump-card",
    "calcMoveName": "Trump Card",
    "names": {
      "zh-hans": "王牌",
      "zh-hant": "王牌",
      "en": "Trump Card",
      "ja": "きりふだ"
    },
    "type": "normal",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "377": {
    "resourceType": "move",
    "id": 377,
    "slug": "heal-block",
    "calcMoveName": "Heal Block",
    "names": {
      "zh-hans": "回复封锁",
      "zh-hant": "回復封鎖",
      "en": "Heal Block",
      "ja": "かいふくふうじ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "ailment",
    "target": "all-opponents",
    "isSpread": true
  },
  "378": {
    "resourceType": "move",
    "id": 378,
    "slug": "wring-out",
    "calcMoveName": "Wring Out",
    "names": {
      "zh-hans": "绞紧",
      "zh-hant": "絞緊",
      "en": "Wring Out",
      "ja": "しぼりとる"
    },
    "type": "normal",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "379": {
    "resourceType": "move",
    "id": 379,
    "slug": "power-trick",
    "calcMoveName": "Power Trick",
    "names": {
      "zh-hans": "力量戏法",
      "zh-hant": "力量戲法",
      "en": "Power Trick",
      "ja": "パワートリック"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "380": {
    "resourceType": "move",
    "id": 380,
    "slug": "gastro-acid",
    "calcMoveName": "Gastro Acid",
    "names": {
      "zh-hans": "胃液",
      "zh-hant": "胃液",
      "en": "Gastro Acid",
      "ja": "いえき"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "381": {
    "resourceType": "move",
    "id": 381,
    "slug": "lucky-chant",
    "calcMoveName": "Lucky Chant",
    "names": {
      "zh-hans": "幸运咒语",
      "zh-hant": "幸運咒語",
      "en": "Lucky Chant",
      "ja": "おまじない"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "382": {
    "resourceType": "move",
    "id": 382,
    "slug": "me-first",
    "calcMoveName": "Me First",
    "names": {
      "zh-hans": "抢先一步",
      "zh-hant": "搶先一步",
      "en": "Me First",
      "ja": "さきどり"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "383": {
    "resourceType": "move",
    "id": 383,
    "slug": "copycat",
    "calcMoveName": "Copycat",
    "names": {
      "zh-hans": "仿效",
      "zh-hant": "仿效",
      "en": "Copycat",
      "ja": "まねっこ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "384": {
    "resourceType": "move",
    "id": 384,
    "slug": "power-swap",
    "calcMoveName": "Power Swap",
    "names": {
      "zh-hans": "力量互换",
      "zh-hant": "力量互換",
      "en": "Power Swap",
      "ja": "パワースワップ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "385": {
    "resourceType": "move",
    "id": 385,
    "slug": "guard-swap",
    "calcMoveName": "Guard Swap",
    "names": {
      "zh-hans": "防守互换",
      "zh-hant": "防守互換",
      "en": "Guard Swap",
      "ja": "ガードスワップ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "386": {
    "resourceType": "move",
    "id": 386,
    "slug": "punishment",
    "calcMoveName": "Punishment",
    "names": {
      "zh-hans": "惩罚",
      "zh-hant": "懲罰",
      "en": "Punishment",
      "ja": "おしおき"
    },
    "type": "dark",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "387": {
    "resourceType": "move",
    "id": 387,
    "slug": "last-resort",
    "calcMoveName": "Last Resort",
    "names": {
      "zh-hans": "珍藏",
      "zh-hant": "珍藏",
      "en": "Last Resort",
      "ja": "とっておき"
    },
    "type": "normal",
    "category": "physical",
    "power": 140,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "388": {
    "resourceType": "move",
    "id": 388,
    "slug": "worry-seed",
    "calcMoveName": "Worry Seed",
    "names": {
      "zh-hans": "烦恼种子",
      "zh-hant": "煩惱種子",
      "en": "Worry Seed",
      "ja": "なやみのタネ"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "389": {
    "resourceType": "move",
    "id": 389,
    "slug": "sucker-punch",
    "calcMoveName": "Sucker Punch",
    "names": {
      "zh-hans": "突袭",
      "zh-hant": "突襲",
      "en": "Sucker Punch",
      "ja": "ふいうち"
    },
    "type": "dark",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "390": {
    "resourceType": "move",
    "id": 390,
    "slug": "toxic-spikes",
    "calcMoveName": "Toxic Spikes",
    "names": {
      "zh-hans": "毒菱",
      "zh-hant": "毒菱",
      "en": "Toxic Spikes",
      "ja": "どくびし"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "opponents-field",
    "isSpread": false
  },
  "391": {
    "resourceType": "move",
    "id": 391,
    "slug": "heart-swap",
    "calcMoveName": "Heart Swap",
    "names": {
      "zh-hans": "心灵互换",
      "zh-hant": "心靈互換",
      "en": "Heart Swap",
      "ja": "ハートスワップ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "392": {
    "resourceType": "move",
    "id": 392,
    "slug": "aqua-ring",
    "calcMoveName": "Aqua Ring",
    "names": {
      "zh-hans": "水流环",
      "zh-hant": "水流環",
      "en": "Aqua Ring",
      "ja": "アクアリング"
    },
    "type": "water",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "393": {
    "resourceType": "move",
    "id": 393,
    "slug": "magnet-rise",
    "calcMoveName": "Magnet Rise",
    "names": {
      "zh-hans": "电磁飘浮",
      "zh-hant": "電磁飄浮",
      "en": "Magnet Rise",
      "ja": "でんじふゆう"
    },
    "type": "electric",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
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
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "395": {
    "resourceType": "move",
    "id": 395,
    "slug": "force-palm",
    "calcMoveName": "Force Palm",
    "names": {
      "zh-hans": "发劲",
      "zh-hant": "發勁",
      "en": "Force Palm",
      "ja": "はっけい"
    },
    "type": "fighting",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "396": {
    "resourceType": "move",
    "id": 396,
    "slug": "aura-sphere",
    "calcMoveName": "Aura Sphere",
    "names": {
      "zh-hans": "波导弹",
      "zh-hant": "波導彈",
      "en": "Aura Sphere",
      "ja": "はどうだん"
    },
    "type": "fighting",
    "category": "special",
    "power": 80,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "397": {
    "resourceType": "move",
    "id": 397,
    "slug": "rock-polish",
    "calcMoveName": "Rock Polish",
    "names": {
      "zh-hans": "岩石打磨",
      "zh-hant": "岩石打磨",
      "en": "Rock Polish",
      "ja": "ロックカット"
    },
    "type": "rock",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
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
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "399": {
    "resourceType": "move",
    "id": 399,
    "slug": "dark-pulse",
    "calcMoveName": "Dark Pulse",
    "names": {
      "zh-hans": "恶之波动",
      "zh-hant": "惡之波動",
      "en": "Dark Pulse",
      "ja": "あくのはどう"
    },
    "type": "dark",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "400": {
    "resourceType": "move",
    "id": 400,
    "slug": "night-slash",
    "calcMoveName": "Night Slash",
    "names": {
      "zh-hans": "暗袭要害",
      "zh-hant": "暗襲要害",
      "en": "Night Slash",
      "ja": "つじぎり"
    },
    "type": "dark",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "401": {
    "resourceType": "move",
    "id": 401,
    "slug": "aqua-tail",
    "calcMoveName": "Aqua Tail",
    "names": {
      "zh-hans": "水流尾",
      "zh-hant": "水流尾",
      "en": "Aqua Tail",
      "ja": "アクアテール"
    },
    "type": "water",
    "category": "physical",
    "power": 90,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "402": {
    "resourceType": "move",
    "id": 402,
    "slug": "seed-bomb",
    "calcMoveName": "Seed Bomb",
    "names": {
      "zh-hans": "种子炸弹",
      "zh-hant": "種子炸彈",
      "en": "Seed Bomb",
      "ja": "タネばくだん"
    },
    "type": "grass",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "403": {
    "resourceType": "move",
    "id": 403,
    "slug": "air-slash",
    "calcMoveName": "Air Slash",
    "names": {
      "zh-hans": "空气斩",
      "zh-hant": "空氣斬",
      "en": "Air Slash",
      "ja": "エアスラッシュ"
    },
    "type": "flying",
    "category": "special",
    "power": 75,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "404": {
    "resourceType": "move",
    "id": 404,
    "slug": "x-scissor",
    "calcMoveName": "X-Scissor",
    "names": {
      "zh-hans": "十字剪",
      "zh-hant": "十字剪",
      "en": "X-Scissor",
      "ja": "シザークロス"
    },
    "type": "bug",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "405": {
    "resourceType": "move",
    "id": 405,
    "slug": "bug-buzz",
    "calcMoveName": "Bug Buzz",
    "names": {
      "zh-hans": "虫鸣",
      "zh-hant": "蟲鳴",
      "en": "Bug Buzz",
      "ja": "むしのさざめき"
    },
    "type": "bug",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "406": {
    "resourceType": "move",
    "id": 406,
    "slug": "dragon-pulse",
    "calcMoveName": "Dragon Pulse",
    "names": {
      "zh-hans": "龙之波动",
      "zh-hant": "龍之波動",
      "en": "Dragon Pulse",
      "ja": "りゅうのはどう"
    },
    "type": "dragon",
    "category": "special",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "407": {
    "resourceType": "move",
    "id": 407,
    "slug": "dragon-rush",
    "calcMoveName": "Dragon Rush",
    "names": {
      "zh-hans": "龙之俯冲",
      "zh-hant": "龍之俯衝",
      "en": "Dragon Rush",
      "ja": "ドラゴンダイブ"
    },
    "type": "dragon",
    "category": "physical",
    "power": 100,
    "accuracy": 75,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "408": {
    "resourceType": "move",
    "id": 408,
    "slug": "power-gem",
    "calcMoveName": "Power Gem",
    "names": {
      "zh-hans": "力量宝石",
      "zh-hant": "力量寶石",
      "en": "Power Gem",
      "ja": "パワージェム"
    },
    "type": "rock",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "409": {
    "resourceType": "move",
    "id": 409,
    "slug": "drain-punch",
    "calcMoveName": "Drain Punch",
    "names": {
      "zh-hans": "吸取拳",
      "zh-hant": "吸取拳",
      "en": "Drain Punch",
      "ja": "ドレインパンチ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "410": {
    "resourceType": "move",
    "id": 410,
    "slug": "vacuum-wave",
    "calcMoveName": "Vacuum Wave",
    "names": {
      "zh-hans": "真空波",
      "zh-hant": "真空波",
      "en": "Vacuum Wave",
      "ja": "しんくうは"
    },
    "type": "fighting",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "411": {
    "resourceType": "move",
    "id": 411,
    "slug": "focus-blast",
    "calcMoveName": "Focus Blast",
    "names": {
      "zh-hans": "真气弹",
      "zh-hant": "真氣彈",
      "en": "Focus Blast",
      "ja": "きあいだま"
    },
    "type": "fighting",
    "category": "special",
    "power": 120,
    "accuracy": 70,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "412": {
    "resourceType": "move",
    "id": 412,
    "slug": "energy-ball",
    "calcMoveName": "Energy Ball",
    "names": {
      "zh-hans": "能量球",
      "zh-hant": "能量球",
      "en": "Energy Ball",
      "ja": "エナジーボール"
    },
    "type": "grass",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "413": {
    "resourceType": "move",
    "id": 413,
    "slug": "brave-bird",
    "calcMoveName": "Brave Bird",
    "names": {
      "zh-hans": "勇鸟猛攻",
      "zh-hant": "勇鳥猛攻",
      "en": "Brave Bird",
      "ja": "ブレイブバード"
    },
    "type": "flying",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "414": {
    "resourceType": "move",
    "id": 414,
    "slug": "earth-power",
    "calcMoveName": "Earth Power",
    "names": {
      "zh-hans": "大地之力",
      "zh-hant": "大地之力",
      "en": "Earth Power",
      "ja": "だいちのちから"
    },
    "type": "ground",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "415": {
    "resourceType": "move",
    "id": 415,
    "slug": "switcheroo",
    "calcMoveName": "Switcheroo",
    "names": {
      "zh-hans": "掉包",
      "zh-hant": "掉包",
      "en": "Switcheroo",
      "ja": "すりかえ"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "416": {
    "resourceType": "move",
    "id": 416,
    "slug": "giga-impact",
    "calcMoveName": "Giga Impact",
    "names": {
      "zh-hans": "终极冲击",
      "zh-hant": "終極衝擊",
      "en": "Giga Impact",
      "ja": "ギガインパクト"
    },
    "type": "normal",
    "category": "physical",
    "power": 150,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "417": {
    "resourceType": "move",
    "id": 417,
    "slug": "nasty-plot",
    "calcMoveName": "Nasty Plot",
    "names": {
      "zh-hans": "诡计",
      "zh-hant": "詭計",
      "en": "Nasty Plot",
      "ja": "わるだくみ"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "418": {
    "resourceType": "move",
    "id": 418,
    "slug": "bullet-punch",
    "calcMoveName": "Bullet Punch",
    "names": {
      "zh-hans": "子弹拳",
      "zh-hant": "子彈拳",
      "en": "Bullet Punch",
      "ja": "バレットパンチ"
    },
    "type": "steel",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "419": {
    "resourceType": "move",
    "id": 419,
    "slug": "avalanche",
    "calcMoveName": "Avalanche",
    "names": {
      "zh-hans": "雪崩",
      "zh-hant": "雪崩",
      "en": "Avalanche",
      "ja": "ゆきなだれ"
    },
    "type": "ice",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "420": {
    "resourceType": "move",
    "id": 420,
    "slug": "ice-shard",
    "calcMoveName": "Ice Shard",
    "names": {
      "zh-hans": "冰砾",
      "zh-hant": "冰礫",
      "en": "Ice Shard",
      "ja": "こおりのつぶて"
    },
    "type": "ice",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "421": {
    "resourceType": "move",
    "id": 421,
    "slug": "shadow-claw",
    "calcMoveName": "Shadow Claw",
    "names": {
      "zh-hans": "暗影爪",
      "zh-hant": "暗影爪",
      "en": "Shadow Claw",
      "ja": "シャドークロー"
    },
    "type": "ghost",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "422": {
    "resourceType": "move",
    "id": 422,
    "slug": "thunder-fang",
    "calcMoveName": "Thunder Fang",
    "names": {
      "zh-hans": "雷电牙",
      "zh-hant": "雷電牙",
      "en": "Thunder Fang",
      "ja": "かみなりのキバ"
    },
    "type": "electric",
    "category": "physical",
    "power": 65,
    "accuracy": 95,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "423": {
    "resourceType": "move",
    "id": 423,
    "slug": "ice-fang",
    "calcMoveName": "Ice Fang",
    "names": {
      "zh-hans": "冰冻牙",
      "zh-hant": "冰凍牙",
      "en": "Ice Fang",
      "ja": "こおりのキバ"
    },
    "type": "ice",
    "category": "physical",
    "power": 65,
    "accuracy": 95,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "425": {
    "resourceType": "move",
    "id": 425,
    "slug": "shadow-sneak",
    "calcMoveName": "Shadow Sneak",
    "names": {
      "zh-hans": "影子偷袭",
      "zh-hant": "影子偷襲",
      "en": "Shadow Sneak",
      "ja": "かげうち"
    },
    "type": "ghost",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "426": {
    "resourceType": "move",
    "id": 426,
    "slug": "mud-bomb",
    "calcMoveName": "Mud Bomb",
    "names": {
      "zh-hans": "泥巴炸弹",
      "zh-hant": "泥巴炸彈",
      "en": "Mud Bomb",
      "ja": "どろばくだん"
    },
    "type": "ground",
    "category": "special",
    "power": 65,
    "accuracy": 85,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "427": {
    "resourceType": "move",
    "id": 427,
    "slug": "psycho-cut",
    "calcMoveName": "Psycho Cut",
    "names": {
      "zh-hans": "精神利刃",
      "zh-hant": "精神利刃",
      "en": "Psycho Cut",
      "ja": "サイコカッター"
    },
    "type": "psychic",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "428": {
    "resourceType": "move",
    "id": 428,
    "slug": "zen-headbutt",
    "calcMoveName": "Zen Headbutt",
    "names": {
      "zh-hans": "意念头锤",
      "zh-hant": "意念頭錘",
      "en": "Zen Headbutt",
      "ja": "しねんのずつき"
    },
    "type": "psychic",
    "category": "physical",
    "power": 80,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "429": {
    "resourceType": "move",
    "id": 429,
    "slug": "mirror-shot",
    "calcMoveName": "Mirror Shot",
    "names": {
      "zh-hans": "镜光射击",
      "zh-hant": "鏡光射擊",
      "en": "Mirror Shot",
      "ja": "ミラーショット"
    },
    "type": "steel",
    "category": "special",
    "power": 65,
    "accuracy": 85,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "430": {
    "resourceType": "move",
    "id": 430,
    "slug": "flash-cannon",
    "calcMoveName": "Flash Cannon",
    "names": {
      "zh-hans": "加农光炮",
      "zh-hant": "加農光炮",
      "en": "Flash Cannon",
      "ja": "ラスターカノン"
    },
    "type": "steel",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "431": {
    "resourceType": "move",
    "id": 431,
    "slug": "rock-climb",
    "calcMoveName": "Rock Climb",
    "names": {
      "zh-hans": "攀岩",
      "zh-hant": "攀岩",
      "en": "Rock Climb",
      "ja": "ロッククライム"
    },
    "type": "normal",
    "category": "physical",
    "power": 90,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "432": {
    "resourceType": "move",
    "id": 432,
    "slug": "defog",
    "calcMoveName": "Defog",
    "names": {
      "zh-hans": "清除浓雾",
      "zh-hant": "清除濃霧",
      "en": "Defog",
      "ja": "きりばらい"
    },
    "type": "flying",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "433": {
    "resourceType": "move",
    "id": 433,
    "slug": "trick-room",
    "calcMoveName": "Trick Room",
    "names": {
      "zh-hans": "戏法空间",
      "zh-hant": "戲法空間",
      "en": "Trick Room",
      "ja": "トリックルーム"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "434": {
    "resourceType": "move",
    "id": 434,
    "slug": "draco-meteor",
    "calcMoveName": "Draco Meteor",
    "names": {
      "zh-hans": "流星群",
      "zh-hant": "流星群",
      "en": "Draco Meteor",
      "ja": "りゅうせいぐん"
    },
    "type": "dragon",
    "category": "special",
    "power": 130,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "435": {
    "resourceType": "move",
    "id": 435,
    "slug": "discharge",
    "calcMoveName": "Discharge",
    "names": {
      "zh-hans": "放电",
      "zh-hant": "放電",
      "en": "Discharge",
      "ja": "ほうでん"
    },
    "type": "electric",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "436": {
    "resourceType": "move",
    "id": 436,
    "slug": "lava-plume",
    "calcMoveName": "Lava Plume",
    "names": {
      "zh-hans": "喷烟",
      "zh-hant": "噴煙",
      "en": "Lava Plume",
      "ja": "ふんえん"
    },
    "type": "fire",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "437": {
    "resourceType": "move",
    "id": 437,
    "slug": "leaf-storm",
    "calcMoveName": "Leaf Storm",
    "names": {
      "zh-hans": "飞叶风暴",
      "zh-hant": "飛葉風暴",
      "en": "Leaf Storm",
      "ja": "リーフストーム"
    },
    "type": "grass",
    "category": "special",
    "power": 130,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "438": {
    "resourceType": "move",
    "id": 438,
    "slug": "power-whip",
    "calcMoveName": "Power Whip",
    "names": {
      "zh-hans": "强力鞭打",
      "zh-hant": "強力鞭打",
      "en": "Power Whip",
      "ja": "パワーウィップ"
    },
    "type": "grass",
    "category": "physical",
    "power": 120,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "439": {
    "resourceType": "move",
    "id": 439,
    "slug": "rock-wrecker",
    "calcMoveName": "Rock Wrecker",
    "names": {
      "zh-hans": "岩石炮",
      "zh-hant": "岩石炮",
      "en": "Rock Wrecker",
      "ja": "がんせきほう"
    },
    "type": "rock",
    "category": "physical",
    "power": 150,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "440": {
    "resourceType": "move",
    "id": 440,
    "slug": "cross-poison",
    "calcMoveName": "Cross Poison",
    "names": {
      "zh-hans": "十字毒刃",
      "zh-hant": "十字毒刃",
      "en": "Cross Poison",
      "ja": "クロスポイズン"
    },
    "type": "poison",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "441": {
    "resourceType": "move",
    "id": 441,
    "slug": "gunk-shot",
    "calcMoveName": "Gunk Shot",
    "names": {
      "zh-hans": "垃圾射击",
      "zh-hant": "垃圾射擊",
      "en": "Gunk Shot",
      "ja": "ダストシュート"
    },
    "type": "poison",
    "category": "physical",
    "power": 120,
    "accuracy": 80,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "443": {
    "resourceType": "move",
    "id": 443,
    "slug": "magnet-bomb",
    "calcMoveName": "Magnet Bomb",
    "names": {
      "zh-hans": "磁铁炸弹",
      "zh-hant": "磁鐵炸彈",
      "en": "Magnet Bomb",
      "ja": "マグネットボム"
    },
    "type": "steel",
    "category": "physical",
    "power": 60,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "445": {
    "resourceType": "move",
    "id": 445,
    "slug": "captivate",
    "calcMoveName": "Captivate",
    "names": {
      "zh-hans": "诱惑",
      "zh-hant": "誘惑",
      "en": "Captivate",
      "ja": "ゆうわく"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "all-opponents",
    "isSpread": true
  },
  "446": {
    "resourceType": "move",
    "id": 446,
    "slug": "stealth-rock",
    "calcMoveName": "Stealth Rock",
    "names": {
      "zh-hans": "隐形岩",
      "zh-hant": "隱形岩",
      "en": "Stealth Rock",
      "ja": "ステルスロック"
    },
    "type": "rock",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "opponents-field",
    "isSpread": false
  },
  "447": {
    "resourceType": "move",
    "id": 447,
    "slug": "grass-knot",
    "calcMoveName": "Grass Knot",
    "names": {
      "zh-hans": "打草结",
      "zh-hant": "打草結",
      "en": "Grass Knot",
      "ja": "くさむすび"
    },
    "type": "grass",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "448": {
    "resourceType": "move",
    "id": 448,
    "slug": "chatter",
    "calcMoveName": "Chatter",
    "names": {
      "zh-hans": "喋喋不休",
      "zh-hant": "喋喋不休",
      "en": "Chatter",
      "ja": "おしゃべり"
    },
    "type": "flying",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "449": {
    "resourceType": "move",
    "id": 449,
    "slug": "judgment",
    "calcMoveName": "Judgment",
    "names": {
      "zh-hans": "制裁光砾",
      "zh-hant": "制裁光礫",
      "en": "Judgment",
      "ja": "さばきのつぶて"
    },
    "type": "normal",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "450": {
    "resourceType": "move",
    "id": 450,
    "slug": "bug-bite",
    "calcMoveName": "Bug Bite",
    "names": {
      "zh-hans": "虫咬",
      "zh-hant": "蟲咬",
      "en": "Bug Bite",
      "ja": "むしくい"
    },
    "type": "bug",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "451": {
    "resourceType": "move",
    "id": 451,
    "slug": "charge-beam",
    "calcMoveName": "Charge Beam",
    "names": {
      "zh-hans": "充电光束",
      "zh-hant": "充電光束",
      "en": "Charge Beam",
      "ja": "チャージビーム"
    },
    "type": "electric",
    "category": "special",
    "power": 50,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "452": {
    "resourceType": "move",
    "id": 452,
    "slug": "wood-hammer",
    "calcMoveName": "Wood Hammer",
    "names": {
      "zh-hans": "木槌",
      "zh-hant": "木槌",
      "en": "Wood Hammer",
      "ja": "ウッドハンマー"
    },
    "type": "grass",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "453": {
    "resourceType": "move",
    "id": 453,
    "slug": "aqua-jet",
    "calcMoveName": "Aqua Jet",
    "names": {
      "zh-hans": "水流喷射",
      "zh-hant": "水流噴射",
      "en": "Aqua Jet",
      "ja": "アクアジェット"
    },
    "type": "water",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "454": {
    "resourceType": "move",
    "id": 454,
    "slug": "attack-order",
    "calcMoveName": "Attack Order",
    "names": {
      "zh-hans": "攻击指令",
      "zh-hant": "攻擊指令",
      "en": "Attack Order",
      "ja": "こうげきしれい"
    },
    "type": "bug",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "455": {
    "resourceType": "move",
    "id": 455,
    "slug": "defend-order",
    "calcMoveName": "Defend Order",
    "names": {
      "zh-hans": "防御指令",
      "zh-hant": "防禦指令",
      "en": "Defend Order",
      "ja": "ぼうぎょしれい"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "456": {
    "resourceType": "move",
    "id": 456,
    "slug": "heal-order",
    "calcMoveName": "Heal Order",
    "names": {
      "zh-hans": "回复指令",
      "zh-hant": "回復指令",
      "en": "Heal Order",
      "ja": "かいふくしれい"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "457": {
    "resourceType": "move",
    "id": 457,
    "slug": "head-smash",
    "calcMoveName": "Head Smash",
    "names": {
      "zh-hans": "双刃头锤",
      "zh-hant": "雙刃頭錘",
      "en": "Head Smash",
      "ja": "もろはのずつき"
    },
    "type": "rock",
    "category": "physical",
    "power": 150,
    "accuracy": 80,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "458": {
    "resourceType": "move",
    "id": 458,
    "slug": "double-hit",
    "calcMoveName": "Double Hit",
    "names": {
      "zh-hans": "二连击",
      "zh-hant": "二連擊",
      "en": "Double Hit",
      "ja": "ダブルアタック"
    },
    "type": "normal",
    "category": "physical",
    "power": 35,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "459": {
    "resourceType": "move",
    "id": 459,
    "slug": "roar-of-time",
    "calcMoveName": "Roar of Time",
    "names": {
      "zh-hans": "时光咆哮",
      "zh-hant": "時光咆哮",
      "en": "Roar of Time",
      "ja": "ときのほうこう"
    },
    "type": "dragon",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "460": {
    "resourceType": "move",
    "id": 460,
    "slug": "spacial-rend",
    "calcMoveName": "Spacial Rend",
    "names": {
      "zh-hans": "亚空裂斩",
      "zh-hant": "亞空裂斬",
      "en": "Spacial Rend",
      "ja": "あくうせつだん"
    },
    "type": "dragon",
    "category": "special",
    "power": 100,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "461": {
    "resourceType": "move",
    "id": 461,
    "slug": "lunar-dance",
    "calcMoveName": "Lunar Dance",
    "names": {
      "zh-hans": "新月舞",
      "zh-hant": "新月舞",
      "en": "Lunar Dance",
      "ja": "みかづきのまい"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "462": {
    "resourceType": "move",
    "id": 462,
    "slug": "crush-grip",
    "calcMoveName": "Crush Grip",
    "names": {
      "zh-hans": "捏碎",
      "zh-hant": "捏碎",
      "en": "Crush Grip",
      "ja": "にぎりつぶす"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "463": {
    "resourceType": "move",
    "id": 463,
    "slug": "magma-storm",
    "calcMoveName": "Magma Storm",
    "names": {
      "zh-hans": "熔岩风暴",
      "zh-hant": "熔岩風暴",
      "en": "Magma Storm",
      "ja": "マグマストーム"
    },
    "type": "fire",
    "category": "special",
    "power": 100,
    "accuracy": 75,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "464": {
    "resourceType": "move",
    "id": 464,
    "slug": "dark-void",
    "calcMoveName": "Dark Void",
    "names": {
      "zh-hans": "暗黑洞",
      "zh-hant": "暗黑洞",
      "en": "Dark Void",
      "ja": "ダークホール"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 50,
    "damageKind": "ailment",
    "target": "all-opponents",
    "isSpread": true
  },
  "465": {
    "resourceType": "move",
    "id": 465,
    "slug": "seed-flare",
    "calcMoveName": "Seed Flare",
    "names": {
      "zh-hans": "种子闪光",
      "zh-hant": "種子閃光",
      "en": "Seed Flare",
      "ja": "シードフレア"
    },
    "type": "grass",
    "category": "special",
    "power": 120,
    "accuracy": 85,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "466": {
    "resourceType": "move",
    "id": 466,
    "slug": "ominous-wind",
    "calcMoveName": "Ominous Wind",
    "names": {
      "zh-hans": "奇异之风",
      "zh-hant": "奇異之風",
      "en": "Ominous Wind",
      "ja": "あやしいかぜ"
    },
    "type": "ghost",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "467": {
    "resourceType": "move",
    "id": 467,
    "slug": "shadow-force",
    "calcMoveName": "Shadow Force",
    "names": {
      "zh-hans": "暗影潜袭",
      "zh-hant": "暗影潛襲",
      "en": "Shadow Force",
      "ja": "シャドーダイブ"
    },
    "type": "ghost",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "468": {
    "resourceType": "move",
    "id": 468,
    "slug": "hone-claws",
    "calcMoveName": "Hone Claws",
    "names": {
      "zh-hans": "磨爪",
      "zh-hant": "磨爪",
      "en": "Hone Claws",
      "ja": "つめとぎ"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "469": {
    "resourceType": "move",
    "id": 469,
    "slug": "wide-guard",
    "calcMoveName": "Wide Guard",
    "names": {
      "zh-hans": "广域防守",
      "zh-hant": "廣域防守",
      "en": "Wide Guard",
      "ja": "ワイドガード"
    },
    "type": "rock",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "470": {
    "resourceType": "move",
    "id": 470,
    "slug": "guard-split",
    "calcMoveName": "Guard Split",
    "names": {
      "zh-hans": "防守平分",
      "zh-hant": "防守平分",
      "en": "Guard Split",
      "ja": "ガードシェア"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "471": {
    "resourceType": "move",
    "id": 471,
    "slug": "power-split",
    "calcMoveName": "Power Split",
    "names": {
      "zh-hans": "力量平分",
      "zh-hant": "力量平分",
      "en": "Power Split",
      "ja": "パワーシェア"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "472": {
    "resourceType": "move",
    "id": 472,
    "slug": "wonder-room",
    "calcMoveName": "Wonder Room",
    "names": {
      "zh-hans": "奇妙空间",
      "zh-hant": "奇妙空間",
      "en": "Wonder Room",
      "ja": "ワンダールーム"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "473": {
    "resourceType": "move",
    "id": 473,
    "slug": "psyshock",
    "calcMoveName": "Psyshock",
    "names": {
      "zh-hans": "精神冲击",
      "zh-hant": "精神衝擊",
      "en": "Psyshock",
      "ja": "サイコショック"
    },
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "474": {
    "resourceType": "move",
    "id": 474,
    "slug": "venoshock",
    "calcMoveName": "Venoshock",
    "names": {
      "zh-hans": "毒液冲击",
      "zh-hant": "毒液衝擊",
      "en": "Venoshock",
      "ja": "ベノムショック"
    },
    "type": "poison",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "475": {
    "resourceType": "move",
    "id": 475,
    "slug": "autotomize",
    "calcMoveName": "Autotomize",
    "names": {
      "zh-hans": "身体轻量化",
      "zh-hant": "身體輕量化",
      "en": "Autotomize",
      "ja": "ボディパージ"
    },
    "type": "steel",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "476": {
    "resourceType": "move",
    "id": 476,
    "slug": "rage-powder",
    "calcMoveName": "Rage Powder",
    "names": {
      "zh-hans": "愤怒粉",
      "zh-hant": "憤怒粉",
      "en": "Rage Powder",
      "ja": "いかりのこな"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "477": {
    "resourceType": "move",
    "id": 477,
    "slug": "telekinesis",
    "calcMoveName": "Telekinesis",
    "names": {
      "zh-hans": "意念移物",
      "zh-hant": "意念移物",
      "en": "Telekinesis",
      "ja": "テレキネシス"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "478": {
    "resourceType": "move",
    "id": 478,
    "slug": "magic-room",
    "calcMoveName": "Magic Room",
    "names": {
      "zh-hans": "魔法空间",
      "zh-hant": "魔法空間",
      "en": "Magic Room",
      "ja": "マジックルーム"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "479": {
    "resourceType": "move",
    "id": 479,
    "slug": "smack-down",
    "calcMoveName": "Smack Down",
    "names": {
      "zh-hans": "击落",
      "zh-hant": "擊落",
      "en": "Smack Down",
      "ja": "うちおとす"
    },
    "type": "rock",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "480": {
    "resourceType": "move",
    "id": 480,
    "slug": "storm-throw",
    "calcMoveName": "Storm Throw",
    "names": {
      "zh-hans": "山岚摔",
      "zh-hant": "山嵐摔",
      "en": "Storm Throw",
      "ja": "やまあらし"
    },
    "type": "fighting",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "481": {
    "resourceType": "move",
    "id": 481,
    "slug": "flame-burst",
    "calcMoveName": "Flame Burst",
    "names": {
      "zh-hans": "烈焰溅射",
      "zh-hant": "烈焰濺射",
      "en": "Flame Burst",
      "ja": "はじけるほのお"
    },
    "type": "fire",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "482": {
    "resourceType": "move",
    "id": 482,
    "slug": "sludge-wave",
    "calcMoveName": "Sludge Wave",
    "names": {
      "zh-hans": "污泥波",
      "zh-hant": "污泥波",
      "en": "Sludge Wave",
      "ja": "ヘドロウェーブ"
    },
    "type": "poison",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "483": {
    "resourceType": "move",
    "id": 483,
    "slug": "quiver-dance",
    "calcMoveName": "Quiver Dance",
    "names": {
      "zh-hans": "蝶舞",
      "zh-hant": "蝶舞",
      "en": "Quiver Dance",
      "ja": "ちょうのまい"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "484": {
    "resourceType": "move",
    "id": 484,
    "slug": "heavy-slam",
    "calcMoveName": "Heavy Slam",
    "names": {
      "zh-hans": "重磅冲撞",
      "zh-hant": "重磅衝撞",
      "en": "Heavy Slam",
      "ja": "ヘビーボンバー"
    },
    "type": "steel",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "485": {
    "resourceType": "move",
    "id": 485,
    "slug": "synchronoise",
    "calcMoveName": "Synchronoise",
    "names": {
      "zh-hans": "同步干扰",
      "zh-hant": "同步干擾",
      "en": "Synchronoise",
      "ja": "シンクロノイズ"
    },
    "type": "psychic",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "486": {
    "resourceType": "move",
    "id": 486,
    "slug": "electro-ball",
    "calcMoveName": "Electro Ball",
    "names": {
      "zh-hans": "电球",
      "zh-hant": "電球",
      "en": "Electro Ball",
      "ja": "エレキボール"
    },
    "type": "electric",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "487": {
    "resourceType": "move",
    "id": 487,
    "slug": "soak",
    "calcMoveName": "Soak",
    "names": {
      "zh-hans": "浸水",
      "zh-hant": "浸水",
      "en": "Soak",
      "ja": "みずびたし"
    },
    "type": "water",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "488": {
    "resourceType": "move",
    "id": 488,
    "slug": "flame-charge",
    "calcMoveName": "Flame Charge",
    "names": {
      "zh-hans": "蓄能焰袭",
      "zh-hant": "蓄能焰襲",
      "en": "Flame Charge",
      "ja": "ニトロチャージ"
    },
    "type": "fire",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "489": {
    "resourceType": "move",
    "id": 489,
    "slug": "coil",
    "calcMoveName": "Coil",
    "names": {
      "zh-hans": "盘蜷",
      "zh-hant": "盤蜷",
      "en": "Coil",
      "ja": "とぐろをまく"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "490": {
    "resourceType": "move",
    "id": 490,
    "slug": "low-sweep",
    "calcMoveName": "Low Sweep",
    "names": {
      "zh-hans": "下盘踢",
      "zh-hant": "下盤踢",
      "en": "Low Sweep",
      "ja": "ローキック"
    },
    "type": "fighting",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "491": {
    "resourceType": "move",
    "id": 491,
    "slug": "acid-spray",
    "calcMoveName": "Acid Spray",
    "names": {
      "zh-hans": "酸液炸弹",
      "zh-hant": "酸液炸彈",
      "en": "Acid Spray",
      "ja": "アシッドボム"
    },
    "type": "poison",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "492": {
    "resourceType": "move",
    "id": 492,
    "slug": "foul-play",
    "calcMoveName": "Foul Play",
    "names": {
      "zh-hans": "欺诈",
      "zh-hant": "欺詐",
      "en": "Foul Play",
      "ja": "イカサマ"
    },
    "type": "dark",
    "category": "physical",
    "power": 95,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "493": {
    "resourceType": "move",
    "id": 493,
    "slug": "simple-beam",
    "calcMoveName": "Simple Beam",
    "names": {
      "zh-hans": "单纯光束",
      "zh-hant": "單純光束",
      "en": "Simple Beam",
      "ja": "シンプルビーム"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "494": {
    "resourceType": "move",
    "id": 494,
    "slug": "entrainment",
    "calcMoveName": "Entrainment",
    "names": {
      "zh-hans": "找伙伴",
      "zh-hant": "找夥伴",
      "en": "Entrainment",
      "ja": "なかまづくり"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "495": {
    "resourceType": "move",
    "id": 495,
    "slug": "after-you",
    "calcMoveName": "After You",
    "names": {
      "zh-hans": "您先请",
      "zh-hant": "您先請",
      "en": "After You",
      "ja": "おさきにどうぞ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "496": {
    "resourceType": "move",
    "id": 496,
    "slug": "round",
    "calcMoveName": "Round",
    "names": {
      "zh-hans": "轮唱",
      "zh-hant": "輪唱",
      "en": "Round",
      "ja": "りんしょう"
    },
    "type": "normal",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "497": {
    "resourceType": "move",
    "id": 497,
    "slug": "echoed-voice",
    "calcMoveName": "Echoed Voice",
    "names": {
      "zh-hans": "回声",
      "zh-hant": "回聲",
      "en": "Echoed Voice",
      "ja": "エコーボイス"
    },
    "type": "normal",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "498": {
    "resourceType": "move",
    "id": 498,
    "slug": "chip-away",
    "calcMoveName": "Chip Away",
    "names": {
      "zh-hans": "逐步击破",
      "zh-hant": "逐步擊破",
      "en": "Chip Away",
      "ja": "なしくずし"
    },
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "499": {
    "resourceType": "move",
    "id": 499,
    "slug": "clear-smog",
    "calcMoveName": "Clear Smog",
    "names": {
      "zh-hans": "清除之烟",
      "zh-hant": "清除之煙",
      "en": "Clear Smog",
      "ja": "クリアスモッグ"
    },
    "type": "poison",
    "category": "special",
    "power": 50,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "500": {
    "resourceType": "move",
    "id": 500,
    "slug": "stored-power",
    "calcMoveName": "Stored Power",
    "names": {
      "zh-hans": "辅助力量",
      "zh-hant": "輔助力量",
      "en": "Stored Power",
      "ja": "アシストパワー"
    },
    "type": "psychic",
    "category": "special",
    "power": 20,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "501": {
    "resourceType": "move",
    "id": 501,
    "slug": "quick-guard",
    "calcMoveName": "Quick Guard",
    "names": {
      "zh-hans": "快速防守",
      "zh-hant": "快速防守",
      "en": "Quick Guard",
      "ja": "ファストガード"
    },
    "type": "fighting",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "502": {
    "resourceType": "move",
    "id": 502,
    "slug": "ally-switch",
    "calcMoveName": "Ally Switch",
    "names": {
      "zh-hans": "交换场地",
      "zh-hant": "交換場地",
      "en": "Ally Switch",
      "ja": "サイドチェンジ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "503": {
    "resourceType": "move",
    "id": 503,
    "slug": "scald",
    "calcMoveName": "Scald",
    "names": {
      "zh-hans": "热水",
      "zh-hant": "熱水",
      "en": "Scald",
      "ja": "ねっとう"
    },
    "type": "water",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "504": {
    "resourceType": "move",
    "id": 504,
    "slug": "shell-smash",
    "calcMoveName": "Shell Smash",
    "names": {
      "zh-hans": "破壳",
      "zh-hant": "破殼",
      "en": "Shell Smash",
      "ja": "からをやぶる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "505": {
    "resourceType": "move",
    "id": 505,
    "slug": "heal-pulse",
    "calcMoveName": "Heal Pulse",
    "names": {
      "zh-hans": "治愈波动",
      "zh-hant": "治癒波動",
      "en": "Heal Pulse",
      "ja": "いやしのはどう"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "506": {
    "resourceType": "move",
    "id": 506,
    "slug": "hex",
    "calcMoveName": "Hex",
    "names": {
      "zh-hans": "祸不单行",
      "zh-hant": "禍不單行",
      "en": "Hex",
      "ja": "たたりめ"
    },
    "type": "ghost",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "507": {
    "resourceType": "move",
    "id": 507,
    "slug": "sky-drop",
    "calcMoveName": "Sky Drop",
    "names": {
      "zh-hans": "自由落体",
      "zh-hant": "自由落體",
      "en": "Sky Drop",
      "ja": "フリーフォール"
    },
    "type": "flying",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "508": {
    "resourceType": "move",
    "id": 508,
    "slug": "shift-gear",
    "calcMoveName": "Shift Gear",
    "names": {
      "zh-hans": "换档",
      "zh-hant": "換檔",
      "en": "Shift Gear",
      "ja": "ギアチェンジ"
    },
    "type": "steel",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "509": {
    "resourceType": "move",
    "id": 509,
    "slug": "circle-throw",
    "calcMoveName": "Circle Throw",
    "names": {
      "zh-hans": "巴投",
      "zh-hant": "巴投",
      "en": "Circle Throw",
      "ja": "ともえなげ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 60,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "510": {
    "resourceType": "move",
    "id": 510,
    "slug": "incinerate",
    "calcMoveName": "Incinerate",
    "names": {
      "zh-hans": "烧尽",
      "zh-hant": "燒盡",
      "en": "Incinerate",
      "ja": "やきつくす"
    },
    "type": "fire",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "511": {
    "resourceType": "move",
    "id": 511,
    "slug": "quash",
    "calcMoveName": "Quash",
    "names": {
      "zh-hans": "延后",
      "zh-hant": "延後",
      "en": "Quash",
      "ja": "さきおくり"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "512": {
    "resourceType": "move",
    "id": 512,
    "slug": "acrobatics",
    "calcMoveName": "Acrobatics",
    "names": {
      "zh-hans": "杂技",
      "zh-hant": "雜技",
      "en": "Acrobatics",
      "ja": "アクロバット"
    },
    "type": "flying",
    "category": "physical",
    "power": 55,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "513": {
    "resourceType": "move",
    "id": 513,
    "slug": "reflect-type",
    "calcMoveName": "Reflect Type",
    "names": {
      "zh-hans": "镜面属性",
      "zh-hant": "鏡面屬性",
      "en": "Reflect Type",
      "ja": "ミラータイプ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "514": {
    "resourceType": "move",
    "id": 514,
    "slug": "retaliate",
    "calcMoveName": "Retaliate",
    "names": {
      "zh-hans": "报仇",
      "zh-hant": "報仇",
      "en": "Retaliate",
      "ja": "かたきうち"
    },
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "515": {
    "resourceType": "move",
    "id": 515,
    "slug": "final-gambit",
    "calcMoveName": "Final Gambit",
    "names": {
      "zh-hans": "搏命",
      "zh-hant": "搏命",
      "en": "Final Gambit",
      "ja": "いのちがけ"
    },
    "type": "fighting",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "516": {
    "resourceType": "move",
    "id": 516,
    "slug": "bestow",
    "calcMoveName": "Bestow",
    "names": {
      "zh-hans": "传递礼物",
      "zh-hant": "傳遞禮物",
      "en": "Bestow",
      "ja": "ギフトパス"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "517": {
    "resourceType": "move",
    "id": 517,
    "slug": "inferno",
    "calcMoveName": "Inferno",
    "names": {
      "zh-hans": "炼狱",
      "zh-hant": "煉獄",
      "en": "Inferno",
      "ja": "れんごく"
    },
    "type": "fire",
    "category": "special",
    "power": 100,
    "accuracy": 50,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "518": {
    "resourceType": "move",
    "id": 518,
    "slug": "water-pledge",
    "calcMoveName": "Water Pledge",
    "names": {
      "zh-hans": "水之誓约",
      "zh-hant": "水之誓約",
      "en": "Water Pledge",
      "ja": "みずのちかい"
    },
    "type": "water",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "519": {
    "resourceType": "move",
    "id": 519,
    "slug": "fire-pledge",
    "calcMoveName": "Fire Pledge",
    "names": {
      "zh-hans": "火之誓约",
      "zh-hant": "火之誓約",
      "en": "Fire Pledge",
      "ja": "ほのおのちかい"
    },
    "type": "fire",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "520": {
    "resourceType": "move",
    "id": 520,
    "slug": "grass-pledge",
    "calcMoveName": "Grass Pledge",
    "names": {
      "zh-hans": "草之誓约",
      "zh-hant": "草之誓約",
      "en": "Grass Pledge",
      "ja": "くさのちかい"
    },
    "type": "grass",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "521": {
    "resourceType": "move",
    "id": 521,
    "slug": "volt-switch",
    "calcMoveName": "Volt Switch",
    "names": {
      "zh-hans": "伏特替换",
      "zh-hant": "伏特替換",
      "en": "Volt Switch",
      "ja": "ボルトチェンジ"
    },
    "type": "electric",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "522": {
    "resourceType": "move",
    "id": 522,
    "slug": "struggle-bug",
    "calcMoveName": "Struggle Bug",
    "names": {
      "zh-hans": "虫之抵抗",
      "zh-hant": "蟲之抵抗",
      "en": "Struggle Bug",
      "ja": "むしのていこう"
    },
    "type": "bug",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "523": {
    "resourceType": "move",
    "id": 523,
    "slug": "bulldoze",
    "calcMoveName": "Bulldoze",
    "names": {
      "zh-hans": "重踏",
      "zh-hant": "重踏",
      "en": "Bulldoze",
      "ja": "じならし"
    },
    "type": "ground",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "524": {
    "resourceType": "move",
    "id": 524,
    "slug": "frost-breath",
    "calcMoveName": "Frost Breath",
    "names": {
      "zh-hans": "冰息",
      "zh-hant": "冰息",
      "en": "Frost Breath",
      "ja": "こおりのいぶき"
    },
    "type": "ice",
    "category": "special",
    "power": 60,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "525": {
    "resourceType": "move",
    "id": 525,
    "slug": "dragon-tail",
    "calcMoveName": "Dragon Tail",
    "names": {
      "zh-hans": "龙尾",
      "zh-hant": "龍尾",
      "en": "Dragon Tail",
      "ja": "ドラゴンテール"
    },
    "type": "dragon",
    "category": "physical",
    "power": 60,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "526": {
    "resourceType": "move",
    "id": 526,
    "slug": "work-up",
    "calcMoveName": "Work Up",
    "names": {
      "zh-hans": "自我激励",
      "zh-hant": "自我激勵",
      "en": "Work Up",
      "ja": "ふるいたてる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "527": {
    "resourceType": "move",
    "id": 527,
    "slug": "electroweb",
    "calcMoveName": "Electroweb",
    "names": {
      "zh-hans": "电网",
      "zh-hant": "電網",
      "en": "Electroweb",
      "ja": "エレキネット"
    },
    "type": "electric",
    "category": "special",
    "power": 55,
    "accuracy": 95,
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "528": {
    "resourceType": "move",
    "id": 528,
    "slug": "wild-charge",
    "calcMoveName": "Wild Charge",
    "names": {
      "zh-hans": "疯狂伏特",
      "zh-hant": "瘋狂伏特",
      "en": "Wild Charge",
      "ja": "ワイルドボルト"
    },
    "type": "electric",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "529": {
    "resourceType": "move",
    "id": 529,
    "slug": "drill-run",
    "calcMoveName": "Drill Run",
    "names": {
      "zh-hans": "直冲钻",
      "zh-hant": "直衝鑽",
      "en": "Drill Run",
      "ja": "ドリルライナー"
    },
    "type": "ground",
    "category": "physical",
    "power": 80,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "530": {
    "resourceType": "move",
    "id": 530,
    "slug": "dual-chop",
    "calcMoveName": "Dual Chop",
    "names": {
      "zh-hans": "二连劈",
      "zh-hant": "二連劈",
      "en": "Dual Chop",
      "ja": "ダブルチョップ"
    },
    "type": "dragon",
    "category": "physical",
    "power": 40,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "531": {
    "resourceType": "move",
    "id": 531,
    "slug": "heart-stamp",
    "calcMoveName": "Heart Stamp",
    "names": {
      "zh-hans": "爱心印章",
      "zh-hant": "愛心印章",
      "en": "Heart Stamp",
      "ja": "ハートスタンプ"
    },
    "type": "psychic",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "532": {
    "resourceType": "move",
    "id": 532,
    "slug": "horn-leech",
    "calcMoveName": "Horn Leech",
    "names": {
      "zh-hans": "木角",
      "zh-hant": "木角",
      "en": "Horn Leech",
      "ja": "ウッドホーン"
    },
    "type": "grass",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "533": {
    "resourceType": "move",
    "id": 533,
    "slug": "sacred-sword",
    "calcMoveName": "Sacred Sword",
    "names": {
      "zh-hans": "圣剑",
      "zh-hant": "聖劍",
      "en": "Sacred Sword",
      "ja": "せいなるつるぎ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "534": {
    "resourceType": "move",
    "id": 534,
    "slug": "razor-shell",
    "calcMoveName": "Razor Shell",
    "names": {
      "zh-hans": "贝壳刃",
      "zh-hant": "貝殼刃",
      "en": "Razor Shell",
      "ja": "シェルブレード"
    },
    "type": "water",
    "category": "physical",
    "power": 75,
    "accuracy": 95,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "535": {
    "resourceType": "move",
    "id": 535,
    "slug": "heat-crash",
    "calcMoveName": "Heat Crash",
    "names": {
      "zh-hans": "高温重压",
      "zh-hant": "高溫重壓",
      "en": "Heat Crash",
      "ja": "ヒートスタンプ"
    },
    "type": "fire",
    "category": "physical",
    "power": null,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "536": {
    "resourceType": "move",
    "id": 536,
    "slug": "leaf-tornado",
    "calcMoveName": "Leaf Tornado",
    "names": {
      "zh-hans": "青草搅拌器",
      "zh-hant": "青草攪拌器",
      "en": "Leaf Tornado",
      "ja": "グラスミキサー"
    },
    "type": "grass",
    "category": "special",
    "power": 65,
    "accuracy": 90,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "537": {
    "resourceType": "move",
    "id": 537,
    "slug": "steamroller",
    "calcMoveName": "Steamroller",
    "names": {
      "zh-hans": "疯狂滚压",
      "zh-hant": "瘋狂滾壓",
      "en": "Steamroller",
      "ja": "ハードローラー"
    },
    "type": "bug",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "538": {
    "resourceType": "move",
    "id": 538,
    "slug": "cotton-guard",
    "calcMoveName": "Cotton Guard",
    "names": {
      "zh-hans": "棉花防守",
      "zh-hant": "棉花防守",
      "en": "Cotton Guard",
      "ja": "コットンガード"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "539": {
    "resourceType": "move",
    "id": 539,
    "slug": "night-daze",
    "calcMoveName": "Night Daze",
    "names": {
      "zh-hans": "暗黑爆破",
      "zh-hant": "暗黑爆破",
      "en": "Night Daze",
      "ja": "ナイトバースト"
    },
    "type": "dark",
    "category": "special",
    "power": 85,
    "accuracy": 95,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "540": {
    "resourceType": "move",
    "id": 540,
    "slug": "psystrike",
    "calcMoveName": "Psystrike",
    "names": {
      "zh-hans": "精神击破",
      "zh-hant": "精神擊破",
      "en": "Psystrike",
      "ja": "サイコブレイク"
    },
    "type": "psychic",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "541": {
    "resourceType": "move",
    "id": 541,
    "slug": "tail-slap",
    "calcMoveName": "Tail Slap",
    "names": {
      "zh-hans": "扫尾拍打",
      "zh-hant": "掃尾拍打",
      "en": "Tail Slap",
      "ja": "スイープビンタ"
    },
    "type": "normal",
    "category": "physical",
    "power": 25,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "542": {
    "resourceType": "move",
    "id": 542,
    "slug": "hurricane",
    "calcMoveName": "Hurricane",
    "names": {
      "zh-hans": "暴风",
      "zh-hant": "暴風",
      "en": "Hurricane",
      "ja": "ぼうふう"
    },
    "type": "flying",
    "category": "special",
    "power": 110,
    "accuracy": 70,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "543": {
    "resourceType": "move",
    "id": 543,
    "slug": "head-charge",
    "calcMoveName": "Head Charge",
    "names": {
      "zh-hans": "爆炸头突击",
      "zh-hant": "爆炸頭突擊",
      "en": "Head Charge",
      "ja": "アフロブレイク"
    },
    "type": "normal",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "544": {
    "resourceType": "move",
    "id": 544,
    "slug": "gear-grind",
    "calcMoveName": "Gear Grind",
    "names": {
      "zh-hans": "齿轮飞盘",
      "zh-hant": "齒輪飛盤",
      "en": "Gear Grind",
      "ja": "ギアソーサー"
    },
    "type": "steel",
    "category": "physical",
    "power": 50,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "545": {
    "resourceType": "move",
    "id": 545,
    "slug": "searing-shot",
    "calcMoveName": "Searing Shot",
    "names": {
      "zh-hans": "火焰弹",
      "zh-hant": "火焰彈",
      "en": "Searing Shot",
      "ja": "かえんだん"
    },
    "type": "fire",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "546": {
    "resourceType": "move",
    "id": 546,
    "slug": "techno-blast",
    "calcMoveName": "Techno Blast",
    "names": {
      "zh-hans": "高科技光炮",
      "zh-hant": "高科技光炮",
      "en": "Techno Blast",
      "ja": "テクノバスター"
    },
    "type": "normal",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "547": {
    "resourceType": "move",
    "id": 547,
    "slug": "relic-song",
    "calcMoveName": "Relic Song",
    "names": {
      "zh-hans": "古老之歌",
      "zh-hant": "古老之歌",
      "en": "Relic Song",
      "ja": "いにしえのうた"
    },
    "type": "normal",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "all-opponents",
    "isSpread": true
  },
  "548": {
    "resourceType": "move",
    "id": 548,
    "slug": "secret-sword",
    "calcMoveName": "Secret Sword",
    "names": {
      "zh-hans": "神秘之剑",
      "zh-hant": "神秘之劍",
      "en": "Secret Sword",
      "ja": "しんぴのつるぎ"
    },
    "type": "fighting",
    "category": "special",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "549": {
    "resourceType": "move",
    "id": 549,
    "slug": "glaciate",
    "calcMoveName": "Glaciate",
    "names": {
      "zh-hans": "冰封世界",
      "zh-hant": "冰封世界",
      "en": "Glaciate",
      "ja": "こごえるせかい"
    },
    "type": "ice",
    "category": "special",
    "power": 65,
    "accuracy": 95,
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "550": {
    "resourceType": "move",
    "id": 550,
    "slug": "bolt-strike",
    "calcMoveName": "Bolt Strike",
    "names": {
      "zh-hans": "雷击",
      "zh-hant": "雷擊",
      "en": "Bolt Strike",
      "ja": "らいげき"
    },
    "type": "electric",
    "category": "physical",
    "power": 130,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "551": {
    "resourceType": "move",
    "id": 551,
    "slug": "blue-flare",
    "calcMoveName": "Blue Flare",
    "names": {
      "zh-hans": "青焰",
      "zh-hant": "青焰",
      "en": "Blue Flare",
      "ja": "あおいほのお"
    },
    "type": "fire",
    "category": "special",
    "power": 130,
    "accuracy": 85,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "552": {
    "resourceType": "move",
    "id": 552,
    "slug": "fiery-dance",
    "calcMoveName": "Fiery Dance",
    "names": {
      "zh-hans": "火之舞",
      "zh-hant": "火之舞",
      "en": "Fiery Dance",
      "ja": "ほのおのまい"
    },
    "type": "fire",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "553": {
    "resourceType": "move",
    "id": 553,
    "slug": "freeze-shock",
    "calcMoveName": "Freeze Shock",
    "names": {
      "zh-hans": "冰冻伏特",
      "zh-hant": "冰凍伏特",
      "en": "Freeze Shock",
      "ja": "フリーズボルト"
    },
    "type": "ice",
    "category": "physical",
    "power": 140,
    "accuracy": 90,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "554": {
    "resourceType": "move",
    "id": 554,
    "slug": "ice-burn",
    "calcMoveName": "Ice Burn",
    "names": {
      "zh-hans": "极寒冷焰",
      "zh-hant": "極寒冷焰",
      "en": "Ice Burn",
      "ja": "コールドフレア"
    },
    "type": "ice",
    "category": "special",
    "power": 140,
    "accuracy": 90,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "556": {
    "resourceType": "move",
    "id": 556,
    "slug": "icicle-crash",
    "calcMoveName": "Icicle Crash",
    "names": {
      "zh-hans": "冰柱坠击",
      "zh-hant": "冰柱墜擊",
      "en": "Icicle Crash",
      "ja": "つららおとし"
    },
    "type": "ice",
    "category": "physical",
    "power": 85,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "557": {
    "resourceType": "move",
    "id": 557,
    "slug": "v-create",
    "calcMoveName": "V-create",
    "names": {
      "zh-hans": "Ｖ热焰",
      "zh-hant": "Ｖ熱焰",
      "en": "V-create",
      "ja": "Ｖジェネレート"
    },
    "type": "fire",
    "category": "physical",
    "power": 180,
    "accuracy": 95,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "558": {
    "resourceType": "move",
    "id": 558,
    "slug": "fusion-flare",
    "calcMoveName": "Fusion Flare",
    "names": {
      "zh-hans": "交错火焰",
      "zh-hant": "交錯火焰",
      "en": "Fusion Flare",
      "ja": "クロスフレイム"
    },
    "type": "fire",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "559": {
    "resourceType": "move",
    "id": 559,
    "slug": "fusion-bolt",
    "calcMoveName": "Fusion Bolt",
    "names": {
      "zh-hans": "交错闪电",
      "zh-hant": "交錯閃電",
      "en": "Fusion Bolt",
      "ja": "クロスサンダー"
    },
    "type": "electric",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "560": {
    "resourceType": "move",
    "id": 560,
    "slug": "flying-press",
    "calcMoveName": "Flying Press",
    "names": {
      "zh-hans": "飞身重压",
      "zh-hant": "飛身重壓",
      "en": "Flying Press",
      "ja": "フライングプレス"
    },
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "561": {
    "resourceType": "move",
    "id": 561,
    "slug": "mat-block",
    "calcMoveName": "Mat Block",
    "names": {
      "zh-hans": "掀榻榻米",
      "zh-hant": "掀榻榻米",
      "en": "Mat Block",
      "ja": "たたみがえし"
    },
    "type": "fighting",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "562": {
    "resourceType": "move",
    "id": 562,
    "slug": "belch",
    "calcMoveName": "Belch",
    "names": {
      "zh-hans": "打嗝",
      "zh-hant": "打嗝",
      "en": "Belch",
      "ja": "ゲップ"
    },
    "type": "poison",
    "category": "special",
    "power": 120,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "563": {
    "resourceType": "move",
    "id": 563,
    "slug": "rototiller",
    "calcMoveName": "Rototiller",
    "names": {
      "zh-hans": "耕地",
      "zh-hant": "耕地",
      "en": "Rototiller",
      "ja": "たがやす"
    },
    "type": "ground",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "all-pokemon",
    "isSpread": false
  },
  "564": {
    "resourceType": "move",
    "id": 564,
    "slug": "sticky-web",
    "calcMoveName": "Sticky Web",
    "names": {
      "zh-hans": "黏黏网",
      "zh-hant": "黏黏網",
      "en": "Sticky Web",
      "ja": "ねばねばネット"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "opponents-field",
    "isSpread": false
  },
  "565": {
    "resourceType": "move",
    "id": 565,
    "slug": "fell-stinger",
    "calcMoveName": "Fell Stinger",
    "names": {
      "zh-hans": "致命针刺",
      "zh-hant": "致命針刺",
      "en": "Fell Stinger",
      "ja": "とどめばり"
    },
    "type": "bug",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "566": {
    "resourceType": "move",
    "id": 566,
    "slug": "phantom-force",
    "calcMoveName": "Phantom Force",
    "names": {
      "zh-hans": "潜灵奇袭",
      "zh-hant": "潛靈奇襲",
      "en": "Phantom Force",
      "ja": "ゴーストダイブ"
    },
    "type": "ghost",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "567": {
    "resourceType": "move",
    "id": 567,
    "slug": "trick-or-treat",
    "calcMoveName": "Trick-or-Treat",
    "names": {
      "zh-hans": "万圣夜",
      "zh-hant": "萬聖夜",
      "en": "Trick-or-Treat",
      "ja": "ハロウィン"
    },
    "type": "ghost",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "568": {
    "resourceType": "move",
    "id": 568,
    "slug": "noble-roar",
    "calcMoveName": "Noble Roar",
    "names": {
      "zh-hans": "战吼",
      "zh-hant": "戰吼",
      "en": "Noble Roar",
      "ja": "おたけび"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "569": {
    "resourceType": "move",
    "id": 569,
    "slug": "ion-deluge",
    "calcMoveName": "Ion Deluge",
    "names": {
      "zh-hans": "等离子浴",
      "zh-hant": "等離子浴",
      "en": "Ion Deluge",
      "ja": "プラズマシャワー"
    },
    "type": "electric",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "570": {
    "resourceType": "move",
    "id": 570,
    "slug": "parabolic-charge",
    "calcMoveName": "Parabolic Charge",
    "names": {
      "zh-hans": "抛物面充电",
      "zh-hant": "拋物面充電",
      "en": "Parabolic Charge",
      "ja": "パラボラチャージ"
    },
    "type": "electric",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "571": {
    "resourceType": "move",
    "id": 571,
    "slug": "forests-curse",
    "calcMoveName": "Forest’s Curse",
    "names": {
      "zh-hans": "森林诅咒",
      "zh-hant": "森林詛咒",
      "en": "Forest’s Curse",
      "ja": "もりののろい"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "572": {
    "resourceType": "move",
    "id": 572,
    "slug": "petal-blizzard",
    "calcMoveName": "Petal Blizzard",
    "names": {
      "zh-hans": "落英缤纷",
      "zh-hant": "落英繽紛",
      "en": "Petal Blizzard",
      "ja": "はなふぶき"
    },
    "type": "grass",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "573": {
    "resourceType": "move",
    "id": 573,
    "slug": "freeze-dry",
    "calcMoveName": "Freeze-Dry",
    "names": {
      "zh-hans": "冷冻干燥",
      "zh-hant": "冷凍乾燥",
      "en": "Freeze-Dry",
      "ja": "フリーズドライ"
    },
    "type": "ice",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "574": {
    "resourceType": "move",
    "id": 574,
    "slug": "disarming-voice",
    "calcMoveName": "Disarming Voice",
    "names": {
      "zh-hans": "魅惑之声",
      "zh-hant": "魅惑之聲",
      "en": "Disarming Voice",
      "ja": "チャームボイス"
    },
    "type": "fairy",
    "category": "special",
    "power": 40,
    "accuracy": null,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
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
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "576": {
    "resourceType": "move",
    "id": 576,
    "slug": "topsy-turvy",
    "calcMoveName": "Topsy-Turvy",
    "names": {
      "zh-hans": "颠倒",
      "zh-hant": "顛倒",
      "en": "Topsy-Turvy",
      "ja": "ひっくりかえす"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "577": {
    "resourceType": "move",
    "id": 577,
    "slug": "draining-kiss",
    "calcMoveName": "Draining Kiss",
    "names": {
      "zh-hans": "吸取之吻",
      "zh-hant": "吸取之吻",
      "en": "Draining Kiss",
      "ja": "ドレインキッス"
    },
    "type": "fairy",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "578": {
    "resourceType": "move",
    "id": 578,
    "slug": "crafty-shield",
    "calcMoveName": "Crafty Shield",
    "names": {
      "zh-hans": "戏法防守",
      "zh-hant": "戲法防守",
      "en": "Crafty Shield",
      "ja": "トリックガード"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "579": {
    "resourceType": "move",
    "id": 579,
    "slug": "flower-shield",
    "calcMoveName": "Flower Shield",
    "names": {
      "zh-hans": "鲜花防守",
      "zh-hant": "鮮花防守",
      "en": "Flower Shield",
      "ja": "フラワーガード"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "all-pokemon",
    "isSpread": false
  },
  "580": {
    "resourceType": "move",
    "id": 580,
    "slug": "grassy-terrain",
    "calcMoveName": "Grassy Terrain",
    "names": {
      "zh-hans": "青草场地",
      "zh-hant": "青草場地",
      "en": "Grassy Terrain",
      "ja": "グラスフィールド"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "581": {
    "resourceType": "move",
    "id": 581,
    "slug": "misty-terrain",
    "calcMoveName": "Misty Terrain",
    "names": {
      "zh-hans": "薄雾场地",
      "zh-hant": "薄霧場地",
      "en": "Misty Terrain",
      "ja": "ミストフィールド"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "582": {
    "resourceType": "move",
    "id": 582,
    "slug": "electrify",
    "calcMoveName": "Electrify",
    "names": {
      "zh-hans": "输电",
      "zh-hant": "輸電",
      "en": "Electrify",
      "ja": "そうでん"
    },
    "type": "electric",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "583": {
    "resourceType": "move",
    "id": 583,
    "slug": "play-rough",
    "calcMoveName": "Play Rough",
    "names": {
      "zh-hans": "嬉闹",
      "zh-hant": "嬉鬧",
      "en": "Play Rough",
      "ja": "じゃれつく"
    },
    "type": "fairy",
    "category": "physical",
    "power": 90,
    "accuracy": 90,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "584": {
    "resourceType": "move",
    "id": 584,
    "slug": "fairy-wind",
    "calcMoveName": "Fairy Wind",
    "names": {
      "zh-hans": "妖精之风",
      "zh-hant": "妖精之風",
      "en": "Fairy Wind",
      "ja": "ようせいのかぜ"
    },
    "type": "fairy",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "586": {
    "resourceType": "move",
    "id": 586,
    "slug": "boomburst",
    "calcMoveName": "Boomburst",
    "names": {
      "zh-hans": "爆音波",
      "zh-hant": "爆音波",
      "en": "Boomburst",
      "ja": "ばくおんぱ"
    },
    "type": "normal",
    "category": "special",
    "power": 140,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "587": {
    "resourceType": "move",
    "id": 587,
    "slug": "fairy-lock",
    "calcMoveName": "Fairy Lock",
    "names": {
      "zh-hans": "妖精之锁",
      "zh-hant": "妖精之鎖",
      "en": "Fairy Lock",
      "ja": "フェアリーロック"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "588": {
    "resourceType": "move",
    "id": 588,
    "slug": "kings-shield",
    "calcMoveName": "King’s Shield",
    "names": {
      "zh-hans": "王者盾牌",
      "zh-hant": "王者盾牌",
      "en": "King’s Shield",
      "ja": "キングシールド"
    },
    "type": "steel",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "589": {
    "resourceType": "move",
    "id": 589,
    "slug": "play-nice",
    "calcMoveName": "Play Nice",
    "names": {
      "zh-hans": "和睦相处",
      "zh-hant": "和睦相處",
      "en": "Play Nice",
      "ja": "なかよくする"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "590": {
    "resourceType": "move",
    "id": 590,
    "slug": "confide",
    "calcMoveName": "Confide",
    "names": {
      "zh-hans": "密语",
      "zh-hant": "密語",
      "en": "Confide",
      "ja": "ないしょばなし"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "591": {
    "resourceType": "move",
    "id": 591,
    "slug": "diamond-storm",
    "calcMoveName": "Diamond Storm",
    "names": {
      "zh-hans": "钻石风暴",
      "zh-hant": "鑽石風暴",
      "en": "Diamond Storm",
      "ja": "ダイヤストーム"
    },
    "type": "rock",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "damageKind": "damage-raise",
    "target": "all-opponents",
    "isSpread": true
  },
  "592": {
    "resourceType": "move",
    "id": 592,
    "slug": "steam-eruption",
    "calcMoveName": "Steam Eruption",
    "names": {
      "zh-hans": "蒸汽爆炸",
      "zh-hant": "蒸汽爆炸",
      "en": "Steam Eruption",
      "ja": "スチームバースト"
    },
    "type": "water",
    "category": "special",
    "power": 110,
    "accuracy": 95,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "593": {
    "resourceType": "move",
    "id": 593,
    "slug": "hyperspace-hole",
    "calcMoveName": "Hyperspace Hole",
    "names": {
      "zh-hans": "异次元洞",
      "zh-hant": "異次元洞",
      "en": "Hyperspace Hole",
      "ja": "いじげんホール"
    },
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "594": {
    "resourceType": "move",
    "id": 594,
    "slug": "water-shuriken",
    "calcMoveName": "Water Shuriken",
    "names": {
      "zh-hans": "飞水手里剑",
      "zh-hant": "飛水手裡劍",
      "en": "Water Shuriken",
      "ja": "みずしゅりけん"
    },
    "type": "water",
    "category": "special",
    "power": 15,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "595": {
    "resourceType": "move",
    "id": 595,
    "slug": "mystical-fire",
    "calcMoveName": "Mystical Fire",
    "names": {
      "zh-hans": "魔法火焰",
      "zh-hant": "魔法火焰",
      "en": "Mystical Fire",
      "ja": "マジカルフレイム"
    },
    "type": "fire",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "596": {
    "resourceType": "move",
    "id": 596,
    "slug": "spiky-shield",
    "calcMoveName": "Spiky Shield",
    "names": {
      "zh-hans": "尖刺防守",
      "zh-hant": "尖刺防守",
      "en": "Spiky Shield",
      "ja": "ニードルガード"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "597": {
    "resourceType": "move",
    "id": 597,
    "slug": "aromatic-mist",
    "calcMoveName": "Aromatic Mist",
    "names": {
      "zh-hans": "芳香薄雾",
      "zh-hant": "芳香薄霧",
      "en": "Aromatic Mist",
      "ja": "アロマミスト"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "ally",
    "isSpread": false
  },
  "598": {
    "resourceType": "move",
    "id": 598,
    "slug": "eerie-impulse",
    "calcMoveName": "Eerie Impulse",
    "names": {
      "zh-hans": "怪异电波",
      "zh-hant": "怪異電波",
      "en": "Eerie Impulse",
      "ja": "かいでんぱ"
    },
    "type": "electric",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "599": {
    "resourceType": "move",
    "id": 599,
    "slug": "venom-drench",
    "calcMoveName": "Venom Drench",
    "names": {
      "zh-hans": "毒液陷阱",
      "zh-hant": "毒液陷阱",
      "en": "Venom Drench",
      "ja": "ベノムトラップ"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "all-opponents",
    "isSpread": true
  },
  "600": {
    "resourceType": "move",
    "id": 600,
    "slug": "powder",
    "calcMoveName": "Powder",
    "names": {
      "zh-hans": "粉尘",
      "zh-hant": "粉塵",
      "en": "Powder",
      "ja": "ふんじん"
    },
    "type": "bug",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "601": {
    "resourceType": "move",
    "id": 601,
    "slug": "geomancy",
    "calcMoveName": "Geomancy",
    "names": {
      "zh-hans": "大地掌控",
      "zh-hant": "大地掌控",
      "en": "Geomancy",
      "ja": "ジオコントロール"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "602": {
    "resourceType": "move",
    "id": 602,
    "slug": "magnetic-flux",
    "calcMoveName": "Magnetic Flux",
    "names": {
      "zh-hans": "磁场操控",
      "zh-hant": "磁場操控",
      "en": "Magnetic Flux",
      "ja": "じばそうさ"
    },
    "type": "electric",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user-and-allies",
    "isSpread": false
  },
  "603": {
    "resourceType": "move",
    "id": 603,
    "slug": "happy-hour",
    "calcMoveName": "Happy Hour",
    "names": {
      "zh-hans": "欢乐时光",
      "zh-hant": "歡樂時光",
      "en": "Happy Hour",
      "ja": "ハッピータイム"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "users-field",
    "isSpread": false
  },
  "604": {
    "resourceType": "move",
    "id": 604,
    "slug": "electric-terrain",
    "calcMoveName": "Electric Terrain",
    "names": {
      "zh-hans": "电气场地",
      "zh-hant": "電氣場地",
      "en": "Electric Terrain",
      "ja": "エレキフィールド"
    },
    "type": "electric",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
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
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "606": {
    "resourceType": "move",
    "id": 606,
    "slug": "celebrate",
    "calcMoveName": "Celebrate",
    "names": {
      "zh-hans": "庆祝",
      "zh-hant": "慶祝",
      "en": "Celebrate",
      "ja": "おいわい"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "607": {
    "resourceType": "move",
    "id": 607,
    "slug": "hold-hands",
    "calcMoveName": "Hold Hands",
    "names": {
      "zh-hans": "牵手",
      "zh-hant": "牽手",
      "en": "Hold Hands",
      "ja": "てをつなぐ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "ally",
    "isSpread": false
  },
  "608": {
    "resourceType": "move",
    "id": 608,
    "slug": "baby-doll-eyes",
    "calcMoveName": "Baby-Doll Eyes",
    "names": {
      "zh-hans": "圆瞳",
      "zh-hant": "圓瞳",
      "en": "Baby-Doll Eyes",
      "ja": "つぶらなひとみ"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "609": {
    "resourceType": "move",
    "id": 609,
    "slug": "nuzzle",
    "calcMoveName": "Nuzzle",
    "names": {
      "zh-hans": "蹭蹭脸颊",
      "zh-hant": "蹭蹭臉頰",
      "en": "Nuzzle",
      "ja": "ほっぺすりすり"
    },
    "type": "electric",
    "category": "physical",
    "power": 20,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "610": {
    "resourceType": "move",
    "id": 610,
    "slug": "hold-back",
    "calcMoveName": "Hold Back",
    "names": {
      "zh-hans": "手下留情",
      "zh-hant": "手下留情",
      "en": "Hold Back",
      "ja": "てかげん"
    },
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "611": {
    "resourceType": "move",
    "id": 611,
    "slug": "infestation",
    "calcMoveName": "Infestation",
    "names": {
      "zh-hans": "死缠烂打",
      "zh-hant": "死纏爛打",
      "en": "Infestation",
      "ja": "まとわりつく"
    },
    "type": "bug",
    "category": "special",
    "power": 20,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "612": {
    "resourceType": "move",
    "id": 612,
    "slug": "power-up-punch",
    "calcMoveName": "Power-Up Punch",
    "names": {
      "zh-hans": "增强拳",
      "zh-hant": "增強拳",
      "en": "Power-Up Punch",
      "ja": "グロウパンチ"
    },
    "type": "fighting",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "613": {
    "resourceType": "move",
    "id": 613,
    "slug": "oblivion-wing",
    "calcMoveName": "Oblivion Wing",
    "names": {
      "zh-hans": "死亡之翼",
      "zh-hant": "死亡之翼",
      "en": "Oblivion Wing",
      "ja": "デスウイング"
    },
    "type": "flying",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "614": {
    "resourceType": "move",
    "id": 614,
    "slug": "thousand-arrows",
    "calcMoveName": "Thousand Arrows",
    "names": {
      "zh-hans": "千箭齐发",
      "zh-hant": "千箭齊發",
      "en": "Thousand Arrows",
      "ja": "サウザンアロー"
    },
    "type": "ground",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "615": {
    "resourceType": "move",
    "id": 615,
    "slug": "thousand-waves",
    "calcMoveName": "Thousand Waves",
    "names": {
      "zh-hans": "千波激荡",
      "zh-hant": "千波激盪",
      "en": "Thousand Waves",
      "ja": "サウザンウェーブ"
    },
    "type": "ground",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "616": {
    "resourceType": "move",
    "id": 616,
    "slug": "lands-wrath",
    "calcMoveName": "Land’s Wrath",
    "names": {
      "zh-hans": "大地神力",
      "zh-hant": "大地神力",
      "en": "Land’s Wrath",
      "ja": "グランドフォース"
    },
    "type": "ground",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "617": {
    "resourceType": "move",
    "id": 617,
    "slug": "light-of-ruin",
    "calcMoveName": "Light of Ruin",
    "names": {
      "zh-hans": "破灭之光",
      "zh-hant": "破滅之光",
      "en": "Light of Ruin",
      "ja": "はめつのひかり"
    },
    "type": "fairy",
    "category": "special",
    "power": 140,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "618": {
    "resourceType": "move",
    "id": 618,
    "slug": "origin-pulse",
    "calcMoveName": "Origin Pulse",
    "names": {
      "zh-hans": "根源波动",
      "zh-hant": "根源波動",
      "en": "Origin Pulse",
      "ja": "こんげんのはどう"
    },
    "type": "water",
    "category": "special",
    "power": 110,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "619": {
    "resourceType": "move",
    "id": 619,
    "slug": "precipice-blades",
    "calcMoveName": "Precipice Blades",
    "names": {
      "zh-hans": "断崖之剑",
      "zh-hant": "斷崖之劍",
      "en": "Precipice Blades",
      "ja": "だんがいのつるぎ"
    },
    "type": "ground",
    "category": "physical",
    "power": 120,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "620": {
    "resourceType": "move",
    "id": 620,
    "slug": "dragon-ascent",
    "calcMoveName": "Dragon Ascent",
    "names": {
      "zh-hans": "画龙点睛",
      "zh-hant": "畫龍點睛",
      "en": "Dragon Ascent",
      "ja": "ガリョウテンセイ"
    },
    "type": "flying",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "621": {
    "resourceType": "move",
    "id": 621,
    "slug": "hyperspace-fury",
    "calcMoveName": "Hyperspace Fury",
    "names": {
      "zh-hans": "异次元猛攻",
      "zh-hant": "異次元猛攻",
      "en": "Hyperspace Fury",
      "ja": "いじげんラッシュ"
    },
    "type": "dark",
    "category": "physical",
    "power": 100,
    "accuracy": null,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "622": {
    "resourceType": "move",
    "id": 622,
    "slug": "breakneck-blitz--physical",
    "calcMoveName": "Breakneck Blitz",
    "names": {
      "zh-hans": "究极无敌大冲撞",
      "zh-hant": "究極無敵大衝撞",
      "en": "Breakneck Blitz",
      "ja": "ウルトラダッシュアタック"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "623": {
    "resourceType": "move",
    "id": 623,
    "slug": "breakneck-blitz--special",
    "calcMoveName": "Breakneck Blitz",
    "names": {
      "zh-hans": "究极无敌大冲撞",
      "zh-hant": "究極無敵大衝撞",
      "en": "Breakneck Blitz",
      "ja": "ウルトラダッシュアタック"
    },
    "type": "normal",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "624": {
    "resourceType": "move",
    "id": 624,
    "slug": "all-out-pummeling--physical",
    "calcMoveName": "All-Out Pummeling",
    "names": {
      "zh-hans": "全力无双激烈拳",
      "zh-hant": "全力無雙激烈拳",
      "en": "All-Out Pummeling",
      "ja": "ぜんりょくむそうげきれつけん"
    },
    "type": "fighting",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "625": {
    "resourceType": "move",
    "id": 625,
    "slug": "all-out-pummeling--special",
    "calcMoveName": "All-Out Pummeling",
    "names": {
      "zh-hans": "全力无双激烈拳",
      "zh-hant": "全力無雙激烈拳",
      "en": "All-Out Pummeling",
      "ja": "ぜんりょくむそうげきれつけん"
    },
    "type": "fighting",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "626": {
    "resourceType": "move",
    "id": 626,
    "slug": "supersonic-skystrike--physical",
    "calcMoveName": "Supersonic Skystrike",
    "names": {
      "zh-hans": "极速俯冲轰烈撞",
      "zh-hant": "極速俯衝轟烈撞",
      "en": "Supersonic Skystrike",
      "ja": "ファイナルダイブクラッシュ"
    },
    "type": "flying",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "627": {
    "resourceType": "move",
    "id": 627,
    "slug": "supersonic-skystrike--special",
    "calcMoveName": "Supersonic Skystrike",
    "names": {
      "zh-hans": "极速俯冲轰烈撞",
      "zh-hant": "極速俯衝轟烈撞",
      "en": "Supersonic Skystrike",
      "ja": "ファイナルダイブクラッシュ"
    },
    "type": "flying",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "628": {
    "resourceType": "move",
    "id": 628,
    "slug": "acid-downpour--physical",
    "calcMoveName": "Acid Downpour",
    "names": {
      "zh-hans": "强酸剧毒灭绝雨",
      "zh-hant": "強酸劇毒滅絕雨",
      "en": "Acid Downpour",
      "ja": "アシッドポイズンデリート"
    },
    "type": "poison",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "629": {
    "resourceType": "move",
    "id": 629,
    "slug": "acid-downpour--special",
    "calcMoveName": "Acid Downpour",
    "names": {
      "zh-hans": "强酸剧毒灭绝雨",
      "zh-hant": "強酸劇毒滅絕雨",
      "en": "Acid Downpour",
      "ja": "アシッドポイズンデリート"
    },
    "type": "poison",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "630": {
    "resourceType": "move",
    "id": 630,
    "slug": "tectonic-rage--physical",
    "calcMoveName": "Tectonic Rage",
    "names": {
      "zh-hans": "地隆啸天大终结",
      "zh-hant": "地隆嘯天大終結",
      "en": "Tectonic Rage",
      "ja": "ライジングランドオーバー"
    },
    "type": "ground",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "631": {
    "resourceType": "move",
    "id": 631,
    "slug": "tectonic-rage--special",
    "calcMoveName": "Tectonic Rage",
    "names": {
      "zh-hans": "地隆啸天大终结",
      "zh-hant": "地隆嘯天大終結",
      "en": "Tectonic Rage",
      "ja": "ライジングランドオーバー"
    },
    "type": "ground",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "632": {
    "resourceType": "move",
    "id": 632,
    "slug": "continental-crush--physical",
    "calcMoveName": "Continental Crush",
    "names": {
      "zh-hans": "毁天灭地巨岩坠",
      "zh-hant": "毀天滅地巨岩墜",
      "en": "Continental Crush",
      "ja": "ワールズエンドフォール"
    },
    "type": "rock",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "633": {
    "resourceType": "move",
    "id": 633,
    "slug": "continental-crush--special",
    "calcMoveName": "Continental Crush",
    "names": {
      "zh-hans": "毁天灭地巨岩坠",
      "zh-hant": "毀天滅地巨岩墜",
      "en": "Continental Crush",
      "ja": "ワールズエンドフォール"
    },
    "type": "rock",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "634": {
    "resourceType": "move",
    "id": 634,
    "slug": "savage-spin-out--physical",
    "calcMoveName": "Savage Spin-Out",
    "names": {
      "zh-hans": "绝对捕食回旋斩",
      "zh-hant": "絕對捕食迴旋斬",
      "en": "Savage Spin-Out",
      "ja": "ぜったいほしょくかいてんざん"
    },
    "type": "bug",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "635": {
    "resourceType": "move",
    "id": 635,
    "slug": "savage-spin-out--special",
    "calcMoveName": "Savage Spin-Out",
    "names": {
      "zh-hans": "绝对捕食回旋斩",
      "zh-hant": "絕對捕食迴旋斬",
      "en": "Savage Spin-Out",
      "ja": "ぜったいほしょくかいてんざん"
    },
    "type": "bug",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "636": {
    "resourceType": "move",
    "id": 636,
    "slug": "never-ending-nightmare--physical",
    "calcMoveName": "Never-Ending Nightmare",
    "names": {
      "zh-hans": "无尽暗夜之诱惑",
      "zh-hant": "無盡暗夜之誘惑",
      "en": "Never-Ending Nightmare",
      "ja": "むげんあんやへのいざない"
    },
    "type": "ghost",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "637": {
    "resourceType": "move",
    "id": 637,
    "slug": "never-ending-nightmare--special",
    "calcMoveName": "Never-Ending Nightmare",
    "names": {
      "zh-hans": "无尽暗夜之诱惑",
      "zh-hant": "無盡暗夜之誘惑",
      "en": "Never-Ending Nightmare",
      "ja": "むげんあんやへのいざない"
    },
    "type": "ghost",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "638": {
    "resourceType": "move",
    "id": 638,
    "slug": "corkscrew-crash--physical",
    "calcMoveName": "Corkscrew Crash",
    "names": {
      "zh-hans": "超绝螺旋连击",
      "zh-hant": "超絕螺旋連擊",
      "en": "Corkscrew Crash",
      "ja": "ちょうぜつらせんれんげき"
    },
    "type": "steel",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "639": {
    "resourceType": "move",
    "id": 639,
    "slug": "corkscrew-crash--special",
    "calcMoveName": "Corkscrew Crash",
    "names": {
      "zh-hans": "超绝螺旋连击",
      "zh-hant": "超絕螺旋連擊",
      "en": "Corkscrew Crash",
      "ja": "ちょうぜつらせんれんげき"
    },
    "type": "steel",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "640": {
    "resourceType": "move",
    "id": 640,
    "slug": "inferno-overdrive--physical",
    "calcMoveName": "Inferno Overdrive",
    "names": {
      "zh-hans": "超强极限爆焰弹",
      "zh-hant": "超強極限爆焰彈",
      "en": "Inferno Overdrive",
      "ja": "ダイナミックフルフレイム"
    },
    "type": "fire",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "641": {
    "resourceType": "move",
    "id": 641,
    "slug": "inferno-overdrive--special",
    "calcMoveName": "Inferno Overdrive",
    "names": {
      "zh-hans": "超强极限爆焰弹",
      "zh-hant": "超強極限爆焰彈",
      "en": "Inferno Overdrive",
      "ja": "ダイナミックフルフレイム"
    },
    "type": "fire",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "642": {
    "resourceType": "move",
    "id": 642,
    "slug": "hydro-vortex--physical",
    "calcMoveName": "Hydro Vortex",
    "names": {
      "zh-hans": "超级水流大漩涡",
      "zh-hant": "超級水流大漩渦",
      "en": "Hydro Vortex",
      "ja": "スーパーアクアトルネード"
    },
    "type": "water",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "643": {
    "resourceType": "move",
    "id": 643,
    "slug": "hydro-vortex--special",
    "calcMoveName": "Hydro Vortex",
    "names": {
      "zh-hans": "超级水流大漩涡",
      "zh-hant": "超級水流大漩渦",
      "en": "Hydro Vortex",
      "ja": "スーパーアクアトルネード"
    },
    "type": "water",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "644": {
    "resourceType": "move",
    "id": 644,
    "slug": "bloom-doom--physical",
    "calcMoveName": "Bloom Doom",
    "names": {
      "zh-hans": "绚烂缤纷花怒放",
      "zh-hant": "絢爛繽紛花怒放",
      "en": "Bloom Doom",
      "ja": "ブルームシャインエクストラ"
    },
    "type": "grass",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "645": {
    "resourceType": "move",
    "id": 645,
    "slug": "bloom-doom--special",
    "calcMoveName": "Bloom Doom",
    "names": {
      "zh-hans": "绚烂缤纷花怒放",
      "zh-hant": "絢爛繽紛花怒放",
      "en": "Bloom Doom",
      "ja": "ブルームシャインエクストラ"
    },
    "type": "grass",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "646": {
    "resourceType": "move",
    "id": 646,
    "slug": "gigavolt-havoc--physical",
    "calcMoveName": "Gigavolt Havoc",
    "names": {
      "zh-hans": "终极伏特狂雷闪",
      "zh-hant": "終極伏特狂雷閃",
      "en": "Gigavolt Havoc",
      "ja": "スパーキングギガボルト"
    },
    "type": "electric",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "647": {
    "resourceType": "move",
    "id": 647,
    "slug": "gigavolt-havoc--special",
    "calcMoveName": "Gigavolt Havoc",
    "names": {
      "zh-hans": "终极伏特狂雷闪",
      "zh-hant": "終極伏特狂雷閃",
      "en": "Gigavolt Havoc",
      "ja": "スパーキングギガボルト"
    },
    "type": "electric",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "648": {
    "resourceType": "move",
    "id": 648,
    "slug": "shattered-psyche--physical",
    "calcMoveName": "Shattered Psyche",
    "names": {
      "zh-hans": "至高精神破坏波",
      "zh-hant": "至高精神破壞波",
      "en": "Shattered Psyche",
      "ja": "マキシマムサイブレイカー"
    },
    "type": "psychic",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "649": {
    "resourceType": "move",
    "id": 649,
    "slug": "shattered-psyche--special",
    "calcMoveName": "Shattered Psyche",
    "names": {
      "zh-hans": "至高精神破坏波",
      "zh-hant": "至高精神破壞波",
      "en": "Shattered Psyche",
      "ja": "マキシマムサイブレイカー"
    },
    "type": "psychic",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "650": {
    "resourceType": "move",
    "id": 650,
    "slug": "subzero-slammer--physical",
    "calcMoveName": "Subzero Slammer",
    "names": {
      "zh-hans": "激狂大地万里冰",
      "zh-hant": "激狂大地萬里冰",
      "en": "Subzero Slammer",
      "ja": "レイジングジオフリーズ"
    },
    "type": "ice",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "651": {
    "resourceType": "move",
    "id": 651,
    "slug": "subzero-slammer--special",
    "calcMoveName": "Subzero Slammer",
    "names": {
      "zh-hans": "激狂大地万里冰",
      "zh-hant": "激狂大地萬里冰",
      "en": "Subzero Slammer",
      "ja": "レイジングジオフリーズ"
    },
    "type": "ice",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "652": {
    "resourceType": "move",
    "id": 652,
    "slug": "devastating-drake--physical",
    "calcMoveName": "Devastating Drake",
    "names": {
      "zh-hans": "究极巨龙震天地",
      "zh-hant": "究極巨龍震天地",
      "en": "Devastating Drake",
      "ja": "アルティメットドラゴンバーン"
    },
    "type": "dragon",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "653": {
    "resourceType": "move",
    "id": 653,
    "slug": "devastating-drake--special",
    "calcMoveName": "Devastating Drake",
    "names": {
      "zh-hans": "究极巨龙震天地",
      "zh-hant": "究極巨龍震天地",
      "en": "Devastating Drake",
      "ja": "アルティメットドラゴンバーン"
    },
    "type": "dragon",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "654": {
    "resourceType": "move",
    "id": 654,
    "slug": "black-hole-eclipse--physical",
    "calcMoveName": "Black Hole Eclipse",
    "names": {
      "zh-hans": "黑洞吞噬万物灭",
      "zh-hant": "黑洞吞噬萬物滅",
      "en": "Black Hole Eclipse",
      "ja": "ブラックホールイクリプス"
    },
    "type": "dark",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "655": {
    "resourceType": "move",
    "id": 655,
    "slug": "black-hole-eclipse--special",
    "calcMoveName": "Black Hole Eclipse",
    "names": {
      "zh-hans": "黑洞吞噬万物灭",
      "zh-hant": "黑洞吞噬萬物滅",
      "en": "Black Hole Eclipse",
      "ja": "ブラックホールイクリプス"
    },
    "type": "dark",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "656": {
    "resourceType": "move",
    "id": 656,
    "slug": "twinkle-tackle--physical",
    "calcMoveName": "Twinkle Tackle",
    "names": {
      "zh-hans": "可爱星星飞天撞",
      "zh-hant": "可愛星星飛天撞",
      "en": "Twinkle Tackle",
      "ja": "ラブリースターインパクト"
    },
    "type": "fairy",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "657": {
    "resourceType": "move",
    "id": 657,
    "slug": "twinkle-tackle--special",
    "calcMoveName": "Twinkle Tackle",
    "names": {
      "zh-hans": "可爱星星飞天撞",
      "zh-hant": "可愛星星飛天撞",
      "en": "Twinkle Tackle",
      "ja": "ラブリースターインパクト"
    },
    "type": "fairy",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "658": {
    "resourceType": "move",
    "id": 658,
    "slug": "catastropika",
    "calcMoveName": "Catastropika",
    "names": {
      "zh-hans": "皮卡皮卡必杀击",
      "zh-hant": "皮卡皮卡必殺擊",
      "en": "Catastropika",
      "ja": "ひっさつのピカチュート"
    },
    "type": "electric",
    "category": "physical",
    "power": 210,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "659": {
    "resourceType": "move",
    "id": 659,
    "slug": "shore-up",
    "calcMoveName": "Shore Up",
    "names": {
      "zh-hans": "集沙",
      "zh-hant": "集沙",
      "en": "Shore Up",
      "ja": "すなあつめ"
    },
    "type": "ground",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user",
    "isSpread": false
  },
  "660": {
    "resourceType": "move",
    "id": 660,
    "slug": "first-impression",
    "calcMoveName": "First Impression",
    "names": {
      "zh-hans": "迎头一击",
      "zh-hant": "迎頭一擊",
      "en": "First Impression",
      "ja": "であいがしら"
    },
    "type": "bug",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "661": {
    "resourceType": "move",
    "id": 661,
    "slug": "baneful-bunker",
    "calcMoveName": "Baneful Bunker",
    "names": {
      "zh-hans": "碉堡",
      "zh-hant": "碉堡",
      "en": "Baneful Bunker",
      "ja": "トーチカ"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "662": {
    "resourceType": "move",
    "id": 662,
    "slug": "spirit-shackle",
    "calcMoveName": "Spirit Shackle",
    "names": {
      "zh-hans": "缝影",
      "zh-hant": "縫影",
      "en": "Spirit Shackle",
      "ja": "かげぬい"
    },
    "type": "ghost",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "664": {
    "resourceType": "move",
    "id": 664,
    "slug": "sparkling-aria",
    "calcMoveName": "Sparkling Aria",
    "names": {
      "zh-hans": "泡影的咏叹调",
      "zh-hant": "泡影的詠歎調",
      "en": "Sparkling Aria",
      "ja": "うたかたのアリア"
    },
    "type": "water",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "665": {
    "resourceType": "move",
    "id": 665,
    "slug": "ice-hammer",
    "calcMoveName": "Ice Hammer",
    "names": {
      "zh-hans": "冰锤",
      "zh-hant": "冰錘",
      "en": "Ice Hammer",
      "ja": "アイスハンマー"
    },
    "type": "ice",
    "category": "physical",
    "power": 100,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "666": {
    "resourceType": "move",
    "id": 666,
    "slug": "floral-healing",
    "calcMoveName": "Floral Healing",
    "names": {
      "zh-hans": "花疗",
      "zh-hant": "花療",
      "en": "Floral Healing",
      "ja": "フラワーヒール"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "667": {
    "resourceType": "move",
    "id": 667,
    "slug": "high-horsepower",
    "calcMoveName": "High Horsepower",
    "names": {
      "zh-hans": "十万马力",
      "zh-hant": "十萬馬力",
      "en": "High Horsepower",
      "ja": "１０まんばりき"
    },
    "type": "ground",
    "category": "physical",
    "power": 95,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "668": {
    "resourceType": "move",
    "id": 668,
    "slug": "strength-sap",
    "calcMoveName": "Strength Sap",
    "names": {
      "zh-hans": "吸取力量",
      "zh-hant": "吸取力量",
      "en": "Strength Sap",
      "ja": "ちからをすいとる"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "669": {
    "resourceType": "move",
    "id": 669,
    "slug": "solar-blade",
    "calcMoveName": "Solar Blade",
    "names": {
      "zh-hans": "日光刃",
      "zh-hant": "日光刃",
      "en": "Solar Blade",
      "ja": "ソーラーブレード"
    },
    "type": "grass",
    "category": "physical",
    "power": 125,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "670": {
    "resourceType": "move",
    "id": 670,
    "slug": "leafage",
    "calcMoveName": "Leafage",
    "names": {
      "zh-hans": "树叶",
      "zh-hant": "樹葉",
      "en": "Leafage",
      "ja": "このは"
    },
    "type": "grass",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "671": {
    "resourceType": "move",
    "id": 671,
    "slug": "spotlight",
    "calcMoveName": "Spotlight",
    "names": {
      "zh-hans": "聚光灯",
      "zh-hant": "聚光燈",
      "en": "Spotlight",
      "ja": "スポットライト"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "672": {
    "resourceType": "move",
    "id": 672,
    "slug": "toxic-thread",
    "calcMoveName": "Toxic Thread",
    "names": {
      "zh-hans": "毒丝",
      "zh-hant": "毒絲",
      "en": "Toxic Thread",
      "ja": "どくのいと"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "swagger",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "673": {
    "resourceType": "move",
    "id": 673,
    "slug": "laser-focus",
    "calcMoveName": "Laser Focus",
    "names": {
      "zh-hans": "磨砺",
      "zh-hant": "磨礪",
      "en": "Laser Focus",
      "ja": "とぎすます"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "674": {
    "resourceType": "move",
    "id": 674,
    "slug": "gear-up",
    "calcMoveName": "Gear Up",
    "names": {
      "zh-hans": "辅助齿轮",
      "zh-hant": "輔助齒輪",
      "en": "Gear Up",
      "ja": "アシストギア"
    },
    "type": "steel",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user-and-allies",
    "isSpread": false
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
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "676": {
    "resourceType": "move",
    "id": 676,
    "slug": "pollen-puff",
    "calcMoveName": "Pollen Puff",
    "names": {
      "zh-hans": "花粉团",
      "zh-hant": "花粉團",
      "en": "Pollen Puff",
      "ja": "かふんだんご"
    },
    "type": "bug",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "677": {
    "resourceType": "move",
    "id": 677,
    "slug": "anchor-shot",
    "calcMoveName": "Anchor Shot",
    "names": {
      "zh-hans": "掷锚",
      "zh-hant": "擲錨",
      "en": "Anchor Shot",
      "ja": "アンカーショット"
    },
    "type": "steel",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "678": {
    "resourceType": "move",
    "id": 678,
    "slug": "psychic-terrain",
    "calcMoveName": "Psychic Terrain",
    "names": {
      "zh-hans": "精神场地",
      "zh-hant": "精神場地",
      "en": "Psychic Terrain",
      "ja": "サイコフィールド"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "whole-field-effect",
    "target": "entire-field",
    "isSpread": true
  },
  "679": {
    "resourceType": "move",
    "id": 679,
    "slug": "lunge",
    "calcMoveName": "Lunge",
    "names": {
      "zh-hans": "猛扑",
      "zh-hant": "猛撲",
      "en": "Lunge",
      "ja": "とびかかる"
    },
    "type": "bug",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "680": {
    "resourceType": "move",
    "id": 680,
    "slug": "fire-lash",
    "calcMoveName": "Fire Lash",
    "names": {
      "zh-hans": "火焰鞭",
      "zh-hant": "火焰鞭",
      "en": "Fire Lash",
      "ja": "ほのおのムチ"
    },
    "type": "fire",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "681": {
    "resourceType": "move",
    "id": 681,
    "slug": "power-trip",
    "calcMoveName": "Power Trip",
    "names": {
      "zh-hans": "嚣张",
      "zh-hant": "囂張",
      "en": "Power Trip",
      "ja": "つけあがる"
    },
    "type": "dark",
    "category": "physical",
    "power": 20,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "682": {
    "resourceType": "move",
    "id": 682,
    "slug": "burn-up",
    "calcMoveName": "Burn Up",
    "names": {
      "zh-hans": "燃尽",
      "zh-hant": "燃盡",
      "en": "Burn Up",
      "ja": "もえつきる"
    },
    "type": "fire",
    "category": "special",
    "power": 130,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "683": {
    "resourceType": "move",
    "id": 683,
    "slug": "speed-swap",
    "calcMoveName": "Speed Swap",
    "names": {
      "zh-hans": "速度互换",
      "zh-hant": "速度互換",
      "en": "Speed Swap",
      "ja": "スピードスワップ"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "684": {
    "resourceType": "move",
    "id": 684,
    "slug": "smart-strike",
    "calcMoveName": "Smart Strike",
    "names": {
      "zh-hans": "修长之角",
      "zh-hant": "修長之角",
      "en": "Smart Strike",
      "ja": "スマートホーン"
    },
    "type": "steel",
    "category": "physical",
    "power": 70,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "685": {
    "resourceType": "move",
    "id": 685,
    "slug": "purify",
    "calcMoveName": "Purify",
    "names": {
      "zh-hans": "净化",
      "zh-hant": "淨化",
      "en": "Purify",
      "ja": "じょうか"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "686": {
    "resourceType": "move",
    "id": 686,
    "slug": "revelation-dance",
    "calcMoveName": "Revelation Dance",
    "names": {
      "zh-hans": "觉醒之舞",
      "zh-hant": "覺醒之舞",
      "en": "Revelation Dance",
      "ja": "めざめるダンス"
    },
    "type": "normal",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "687": {
    "resourceType": "move",
    "id": 687,
    "slug": "core-enforcer",
    "calcMoveName": "Core Enforcer",
    "names": {
      "zh-hans": "核心惩罚者",
      "zh-hant": "核心懲罰者",
      "en": "Core Enforcer",
      "ja": "コアパニッシャー"
    },
    "type": "dragon",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "688": {
    "resourceType": "move",
    "id": 688,
    "slug": "trop-kick",
    "calcMoveName": "Trop Kick",
    "names": {
      "zh-hans": "热带踢",
      "zh-hant": "熱帶踢",
      "en": "Trop Kick",
      "ja": "トロピカルキック"
    },
    "type": "grass",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "689": {
    "resourceType": "move",
    "id": 689,
    "slug": "instruct",
    "calcMoveName": "Instruct",
    "names": {
      "zh-hans": "号令",
      "zh-hant": "號令",
      "en": "Instruct",
      "ja": "さいはい"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "690": {
    "resourceType": "move",
    "id": 690,
    "slug": "beak-blast",
    "calcMoveName": "Beak Blast",
    "names": {
      "zh-hans": "鸟嘴加农炮",
      "zh-hant": "鳥嘴加農炮",
      "en": "Beak Blast",
      "ja": "くちばしキャノン"
    },
    "type": "flying",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "691": {
    "resourceType": "move",
    "id": 691,
    "slug": "clanging-scales",
    "calcMoveName": "Clanging Scales",
    "names": {
      "zh-hans": "鳞片噪音",
      "zh-hant": "鱗片噪音",
      "en": "Clanging Scales",
      "ja": "スケイルノイズ"
    },
    "type": "dragon",
    "category": "special",
    "power": 110,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "all-opponents",
    "isSpread": true
  },
  "692": {
    "resourceType": "move",
    "id": 692,
    "slug": "dragon-hammer",
    "calcMoveName": "Dragon Hammer",
    "names": {
      "zh-hans": "龙锤",
      "zh-hant": "龍錘",
      "en": "Dragon Hammer",
      "ja": "ドラゴンハンマー"
    },
    "type": "dragon",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "693": {
    "resourceType": "move",
    "id": 693,
    "slug": "brutal-swing",
    "calcMoveName": "Brutal Swing",
    "names": {
      "zh-hans": "狂舞挥打",
      "zh-hant": "狂舞揮打",
      "en": "Brutal Swing",
      "ja": "ぶんまわす"
    },
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "694": {
    "resourceType": "move",
    "id": 694,
    "slug": "aurora-veil",
    "calcMoveName": "Aurora Veil",
    "names": {
      "zh-hans": "极光幕",
      "zh-hant": "極光幕",
      "en": "Aurora Veil",
      "ja": "オーロラベール"
    },
    "type": "ice",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "field-effect",
    "target": "users-field",
    "isSpread": false
  },
  "695": {
    "resourceType": "move",
    "id": 695,
    "slug": "sinister-arrow-raid",
    "calcMoveName": "Sinister Arrow Raid",
    "names": {
      "zh-hans": "遮天蔽日暗影箭",
      "zh-hant": "遮天蔽日暗影箭",
      "en": "Sinister Arrow Raid",
      "ja": "シャドーアローズストライク"
    },
    "type": "ghost",
    "category": "physical",
    "power": 180,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "696": {
    "resourceType": "move",
    "id": 696,
    "slug": "malicious-moonsault",
    "calcMoveName": "Malicious Moonsault",
    "names": {
      "zh-hans": "极恶飞跃粉碎击",
      "zh-hant": "極惡飛躍粉碎擊",
      "en": "Malicious Moonsault",
      "ja": "ハイパーダーククラッシャー"
    },
    "type": "dark",
    "category": "physical",
    "power": 180,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "697": {
    "resourceType": "move",
    "id": 697,
    "slug": "oceanic-operetta",
    "calcMoveName": "Oceanic Operetta",
    "names": {
      "zh-hans": "海神庄严交响乐",
      "zh-hant": "海神莊嚴交響樂",
      "en": "Oceanic Operetta",
      "ja": "わだつみのシンフォニア"
    },
    "type": "water",
    "category": "special",
    "power": 195,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "698": {
    "resourceType": "move",
    "id": 698,
    "slug": "guardian-of-alola",
    "calcMoveName": "Guardian of Alola",
    "names": {
      "zh-hans": "巨人卫士・阿罗拉",
      "zh-hant": "巨人衛士・阿羅拉",
      "en": "Guardian of Alola",
      "ja": "ガーディアン・デ・アローラ"
    },
    "type": "fairy",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "699": {
    "resourceType": "move",
    "id": 699,
    "slug": "soul-stealing-7-star-strike",
    "calcMoveName": "Soul-Stealing 7-Star Strike",
    "names": {
      "zh-hans": "七星夺魂腿",
      "zh-hant": "七星奪魂腿",
      "en": "Soul-Stealing 7-Star Strike",
      "ja": "しちせいだっこんたい"
    },
    "type": "ghost",
    "category": "physical",
    "power": 195,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "700": {
    "resourceType": "move",
    "id": 700,
    "slug": "stoked-sparksurfer",
    "calcMoveName": "Stoked Sparksurfer",
    "names": {
      "zh-hans": "驾雷驭电戏冲浪",
      "zh-hant": "駕雷馭電戲衝浪",
      "en": "Stoked Sparksurfer",
      "ja": "ライトニングサーフライド"
    },
    "type": "electric",
    "category": "special",
    "power": 175,
    "accuracy": null,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "701": {
    "resourceType": "move",
    "id": 701,
    "slug": "pulverizing-pancake",
    "calcMoveName": "Pulverizing Pancake",
    "names": {
      "zh-hans": "认真起来大爆击",
      "zh-hant": "認真起來大爆擊",
      "en": "Pulverizing Pancake",
      "ja": "ほんきをだす　こうげき"
    },
    "type": "normal",
    "category": "physical",
    "power": 210,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "702": {
    "resourceType": "move",
    "id": 702,
    "slug": "extreme-evoboost",
    "calcMoveName": "Extreme Evoboost",
    "names": {
      "zh-hans": "九彩升华齐聚顶",
      "zh-hant": "九彩昇華齊聚頂",
      "en": "Extreme Evoboost",
      "ja": "ナインエボルブースト"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "703": {
    "resourceType": "move",
    "id": 703,
    "slug": "genesis-supernova",
    "calcMoveName": "Genesis Supernova",
    "names": {
      "zh-hans": "起源超新星大爆炸",
      "zh-hant": "起源超新星大爆炸",
      "en": "Genesis Supernova",
      "ja": "オリジンズスーパーノヴァ"
    },
    "type": "psychic",
    "category": "special",
    "power": 185,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "704": {
    "resourceType": "move",
    "id": 704,
    "slug": "shell-trap",
    "calcMoveName": "Shell Trap",
    "names": {
      "zh-hans": "陷阱甲壳",
      "zh-hant": "陷阱甲殼",
      "en": "Shell Trap",
      "ja": "トラップシェル"
    },
    "type": "fire",
    "category": "special",
    "power": 150,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "705": {
    "resourceType": "move",
    "id": 705,
    "slug": "fleur-cannon",
    "calcMoveName": "Fleur Cannon",
    "names": {
      "zh-hans": "花朵加农炮",
      "zh-hant": "花朵加農炮",
      "en": "Fleur Cannon",
      "ja": "フルールカノン"
    },
    "type": "fairy",
    "category": "special",
    "power": 130,
    "accuracy": 90,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "706": {
    "resourceType": "move",
    "id": 706,
    "slug": "psychic-fangs",
    "calcMoveName": "Psychic Fangs",
    "names": {
      "zh-hans": "精神之牙",
      "zh-hant": "精神之牙",
      "en": "Psychic Fangs",
      "ja": "サイコファング"
    },
    "type": "psychic",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "708": {
    "resourceType": "move",
    "id": 708,
    "slug": "shadow-bone",
    "calcMoveName": "Shadow Bone",
    "names": {
      "zh-hans": "暗影之骨",
      "zh-hant": "暗影之骨",
      "en": "Shadow Bone",
      "ja": "シャドーボーン"
    },
    "type": "ghost",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "709": {
    "resourceType": "move",
    "id": 709,
    "slug": "accelerock",
    "calcMoveName": "Accelerock",
    "names": {
      "zh-hans": "冲岩",
      "zh-hant": "衝岩",
      "en": "Accelerock",
      "ja": "アクセルロック"
    },
    "type": "rock",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "710": {
    "resourceType": "move",
    "id": 710,
    "slug": "liquidation",
    "calcMoveName": "Liquidation",
    "names": {
      "zh-hans": "水流裂破",
      "zh-hant": "水流裂破",
      "en": "Liquidation",
      "ja": "アクアブレイク"
    },
    "type": "water",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "711": {
    "resourceType": "move",
    "id": 711,
    "slug": "prismatic-laser",
    "calcMoveName": "Prismatic Laser",
    "names": {
      "zh-hans": "棱镜镭射",
      "zh-hant": "稜鏡鐳射",
      "en": "Prismatic Laser",
      "ja": "プリズムレーザー"
    },
    "type": "psychic",
    "category": "special",
    "power": 160,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "712": {
    "resourceType": "move",
    "id": 712,
    "slug": "spectral-thief",
    "calcMoveName": "Spectral Thief",
    "names": {
      "zh-hans": "暗影偷盗",
      "zh-hant": "暗影偷盜",
      "en": "Spectral Thief",
      "ja": "シャドースチール"
    },
    "type": "ghost",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "713": {
    "resourceType": "move",
    "id": 713,
    "slug": "sunsteel-strike",
    "calcMoveName": "Sunsteel Strike",
    "names": {
      "zh-hans": "流星闪冲",
      "zh-hant": "流星閃衝",
      "en": "Sunsteel Strike",
      "ja": "メテオドライブ"
    },
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "714": {
    "resourceType": "move",
    "id": 714,
    "slug": "moongeist-beam",
    "calcMoveName": "Moongeist Beam",
    "names": {
      "zh-hans": "暗影之光",
      "zh-hant": "暗影之光",
      "en": "Moongeist Beam",
      "ja": "シャドーレイ"
    },
    "type": "ghost",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "715": {
    "resourceType": "move",
    "id": 715,
    "slug": "tearful-look",
    "calcMoveName": "Tearful Look",
    "names": {
      "zh-hans": "泪眼汪汪",
      "zh-hant": "淚眼汪汪",
      "en": "Tearful Look",
      "ja": "なみだめ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "716": {
    "resourceType": "move",
    "id": 716,
    "slug": "zing-zap",
    "calcMoveName": "Zing Zap",
    "names": {
      "zh-hans": "麻麻刺刺",
      "zh-hant": "麻麻刺刺",
      "en": "Zing Zap",
      "ja": "びりびりちくちく"
    },
    "type": "electric",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "717": {
    "resourceType": "move",
    "id": 717,
    "slug": "natures-madness",
    "calcMoveName": "Nature’s Madness",
    "names": {
      "zh-hans": "自然之怒",
      "zh-hant": "自然之怒",
      "en": "Nature’s Madness",
      "ja": "しぜんのいかり"
    },
    "type": "fairy",
    "category": "special",
    "power": null,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "718": {
    "resourceType": "move",
    "id": 718,
    "slug": "multi-attack",
    "calcMoveName": "Multi-Attack",
    "names": {
      "zh-hans": "多属性攻击",
      "zh-hant": "多屬性攻擊",
      "en": "Multi-Attack",
      "ja": "マルチアタック"
    },
    "type": "normal",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "719": {
    "resourceType": "move",
    "id": 719,
    "slug": "10-000-000-volt-thunderbolt",
    "calcMoveName": "10,000,000 Volt Thunderbolt",
    "names": {
      "zh-hans": "千万伏特",
      "zh-hant": "千萬伏特",
      "en": "10,000,000 Volt Thunderbolt",
      "ja": "１０００まんボルト"
    },
    "type": "electric",
    "category": "special",
    "power": 195,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "720": {
    "resourceType": "move",
    "id": 720,
    "slug": "mind-blown",
    "calcMoveName": "Mind Blown",
    "names": {
      "zh-hans": "惊爆大头",
      "zh-hant": "驚爆大頭",
      "en": "Mind Blown",
      "ja": "ビックリヘッド"
    },
    "type": "fire",
    "category": "special",
    "power": 150,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "721": {
    "resourceType": "move",
    "id": 721,
    "slug": "plasma-fists",
    "calcMoveName": "Plasma Fists",
    "names": {
      "zh-hans": "等离子闪电拳",
      "zh-hant": "等離子閃電拳",
      "en": "Plasma Fists",
      "ja": "プラズマフィスト"
    },
    "type": "electric",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "722": {
    "resourceType": "move",
    "id": 722,
    "slug": "photon-geyser",
    "calcMoveName": "Photon Geyser",
    "names": {
      "zh-hans": "光子喷涌",
      "zh-hant": "光子噴湧",
      "en": "Photon Geyser",
      "ja": "フォトンゲイザー"
    },
    "type": "psychic",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "723": {
    "resourceType": "move",
    "id": 723,
    "slug": "light-that-burns-the-sky",
    "calcMoveName": "Light That Burns the Sky",
    "names": {
      "zh-hans": "焚天灭世炽光爆",
      "zh-hant": "焚天滅世熾光爆",
      "en": "Light That Burns the Sky",
      "ja": "てんこがすめつぼうのひかり"
    },
    "type": "psychic",
    "category": "special",
    "power": 200,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "724": {
    "resourceType": "move",
    "id": 724,
    "slug": "searing-sunraze-smash",
    "calcMoveName": "Searing Sunraze Smash",
    "names": {
      "zh-hans": "日光回旋下苍穹",
      "zh-hant": "日光迴旋下蒼穹",
      "en": "Searing Sunraze Smash",
      "ja": "サンシャインスマッシャー"
    },
    "type": "steel",
    "category": "physical",
    "power": 200,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "725": {
    "resourceType": "move",
    "id": 725,
    "slug": "menacing-moonraze-maelstrom",
    "calcMoveName": "Menacing Moonraze Maelstrom",
    "names": {
      "zh-hans": "月华飞溅落灵霄",
      "zh-hant": "月華飛濺落靈霄",
      "en": "Menacing Moonraze Maelstrom",
      "ja": "ムーンライトブラスター"
    },
    "type": "ghost",
    "category": "special",
    "power": 200,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "726": {
    "resourceType": "move",
    "id": 726,
    "slug": "lets-snuggle-forever",
    "calcMoveName": "Let’s Snuggle Forever",
    "names": {
      "zh-hans": "亲密无间大乱揍",
      "zh-hant": "親密無間大亂揍",
      "en": "Let’s Snuggle Forever",
      "ja": "ぽかぼかフレンドタイム"
    },
    "type": "fairy",
    "category": "physical",
    "power": 190,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "727": {
    "resourceType": "move",
    "id": 727,
    "slug": "splintered-stormshards",
    "calcMoveName": "Splintered Stormshards",
    "names": {
      "zh-hans": "狼啸石牙飓风暴",
      "zh-hant": "狼嘯石牙颶風暴",
      "en": "Splintered Stormshards",
      "ja": "ラジアルエッジストーム"
    },
    "type": "rock",
    "category": "physical",
    "power": 190,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "728": {
    "resourceType": "move",
    "id": 728,
    "slug": "clangorous-soulblaze",
    "calcMoveName": "Clangorous Soulblaze",
    "names": {
      "zh-hans": "炽魂热舞烈音爆",
      "zh-hant": "熾魂熱舞烈音爆",
      "en": "Clangorous Soulblaze",
      "ja": "ブレイジングソウルビート"
    },
    "type": "dragon",
    "category": "special",
    "power": 185,
    "accuracy": null,
    "damageKind": "damage-raise",
    "target": "all-opponents",
    "isSpread": true
  },
  "729": {
    "resourceType": "move",
    "id": 729,
    "slug": "zippy-zap",
    "calcMoveName": "Zippy Zap",
    "names": {
      "zh-hans": "电电加速",
      "zh-hant": "電電加速",
      "en": "Zippy Zap",
      "ja": "ばちばちアクセル"
    },
    "type": "electric",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "730": {
    "resourceType": "move",
    "id": 730,
    "slug": "splishy-splash",
    "calcMoveName": "Splishy Splash",
    "names": {
      "zh-hans": "滔滔冲浪",
      "zh-hant": "滔滔衝浪",
      "en": "Splishy Splash",
      "ja": "ざぶざぶサーフ"
    },
    "type": "water",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "all-opponents",
    "isSpread": true
  },
  "731": {
    "resourceType": "move",
    "id": 731,
    "slug": "floaty-fall",
    "calcMoveName": "Floaty Fall",
    "names": {
      "zh-hans": "飘飘坠落",
      "zh-hant": "飄飄墜落",
      "en": "Floaty Fall",
      "ja": "ふわふわフォール"
    },
    "type": "flying",
    "category": "physical",
    "power": 90,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "732": {
    "resourceType": "move",
    "id": 732,
    "slug": "pika-papow",
    "calcMoveName": "Pika Papow",
    "names": {
      "zh-hans": "闪闪雷光",
      "zh-hant": "閃閃雷光",
      "en": "Pika Papow",
      "ja": "ピカピカサンダー"
    },
    "type": "electric",
    "category": "special",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "733": {
    "resourceType": "move",
    "id": 733,
    "slug": "bouncy-bubble",
    "calcMoveName": "Bouncy Bubble",
    "names": {
      "zh-hans": "活活气泡",
      "zh-hant": "活活氣泡",
      "en": "Bouncy Bubble",
      "ja": "いきいきバブル"
    },
    "type": "water",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-heal",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "734": {
    "resourceType": "move",
    "id": 734,
    "slug": "buzzy-buzz",
    "calcMoveName": "Buzzy Buzz",
    "names": {
      "zh-hans": "麻麻电击",
      "zh-hant": "麻麻電擊",
      "en": "Buzzy Buzz",
      "ja": "びりびりエレキ"
    },
    "type": "electric",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "735": {
    "resourceType": "move",
    "id": 735,
    "slug": "sizzly-slide",
    "calcMoveName": "Sizzly Slide",
    "names": {
      "zh-hans": "熊熊火爆",
      "zh-hant": "熊熊火爆",
      "en": "Sizzly Slide",
      "ja": "めらめらバーン"
    },
    "type": "fire",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "736": {
    "resourceType": "move",
    "id": 736,
    "slug": "glitzy-glow",
    "calcMoveName": "Glitzy Glow",
    "names": {
      "zh-hans": "哗哗气场",
      "zh-hant": "嘩嘩氣場",
      "en": "Glitzy Glow",
      "ja": "どばどばオーラ"
    },
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "737": {
    "resourceType": "move",
    "id": 737,
    "slug": "baddy-bad",
    "calcMoveName": "Baddy Bad",
    "names": {
      "zh-hans": "坏坏领域",
      "zh-hant": "壞壞領域",
      "en": "Baddy Bad",
      "ja": "わるわるゾーン"
    },
    "type": "dark",
    "category": "special",
    "power": 80,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "738": {
    "resourceType": "move",
    "id": 738,
    "slug": "sappy-seed",
    "calcMoveName": "Sappy Seed",
    "names": {
      "zh-hans": "茁茁轰炸",
      "zh-hant": "茁茁轟炸",
      "en": "Sappy Seed",
      "ja": "すくすくボンバー"
    },
    "type": "grass",
    "category": "physical",
    "power": 100,
    "accuracy": 90,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "739": {
    "resourceType": "move",
    "id": 739,
    "slug": "freezy-frost",
    "calcMoveName": "Freezy Frost",
    "names": {
      "zh-hans": "冰冰霜冻",
      "zh-hant": "冰冰霜凍",
      "en": "Freezy Frost",
      "ja": "こちこちフロスト"
    },
    "type": "ice",
    "category": "special",
    "power": 100,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "740": {
    "resourceType": "move",
    "id": 740,
    "slug": "sparkly-swirl",
    "calcMoveName": "Sparkly Swirl",
    "names": {
      "zh-hans": "亮亮风暴",
      "zh-hant": "亮亮風暴",
      "en": "Sparkly Swirl",
      "ja": "きらきらストーム"
    },
    "type": "fairy",
    "category": "special",
    "power": 120,
    "accuracy": 85,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "741": {
    "resourceType": "move",
    "id": 741,
    "slug": "veevee-volley",
    "calcMoveName": "Veevee Volley",
    "names": {
      "zh-hans": "砰砰击破",
      "zh-hant": "砰砰擊破",
      "en": "Veevee Volley",
      "ja": "ブイブイブレイク"
    },
    "type": "normal",
    "category": "physical",
    "power": null,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "742": {
    "resourceType": "move",
    "id": 742,
    "slug": "double-iron-bash",
    "calcMoveName": "Double Iron Bash",
    "names": {
      "zh-hans": "钢拳双击",
      "zh-hant": "鋼拳雙擊",
      "en": "Double Iron Bash",
      "ja": "ダブルパンツァー"
    },
    "type": "steel",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "743": {
    "resourceType": "move",
    "id": 743,
    "slug": "max-guard",
    "calcMoveName": "Max Guard",
    "names": {
      "zh-hans": "极巨防壁",
      "zh-hant": "極巨防壁",
      "en": "Max Guard",
      "ja": "ダイウォール"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "744": {
    "resourceType": "move",
    "id": 744,
    "slug": "dynamax-cannon",
    "calcMoveName": "Dynamax Cannon",
    "names": {
      "zh-hans": "极巨炮",
      "zh-hant": "極巨炮",
      "en": "Dynamax Cannon",
      "ja": "ダイマックスほう"
    },
    "type": "dragon",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "745": {
    "resourceType": "move",
    "id": 745,
    "slug": "snipe-shot",
    "calcMoveName": "Snipe Shot",
    "names": {
      "zh-hans": "狙击",
      "zh-hant": "狙擊",
      "en": "Snipe Shot",
      "ja": "ねらいうち"
    },
    "type": "water",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "746": {
    "resourceType": "move",
    "id": 746,
    "slug": "jaw-lock",
    "calcMoveName": "Jaw Lock",
    "names": {
      "zh-hans": "紧咬不放",
      "zh-hant": "緊咬不放",
      "en": "Jaw Lock",
      "ja": "くらいつく"
    },
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "747": {
    "resourceType": "move",
    "id": 747,
    "slug": "stuff-cheeks",
    "calcMoveName": "Stuff Cheeks",
    "names": {
      "zh-hans": "大快朵颐",
      "zh-hant": "大快朵頤",
      "en": "Stuff Cheeks",
      "ja": "ほおばる"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "748": {
    "resourceType": "move",
    "id": 748,
    "slug": "no-retreat",
    "calcMoveName": "No Retreat",
    "names": {
      "zh-hans": "背水一战",
      "zh-hant": "背水一戰",
      "en": "No Retreat",
      "ja": "はいすいのじん"
    },
    "type": "fighting",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "749": {
    "resourceType": "move",
    "id": 749,
    "slug": "tar-shot",
    "calcMoveName": "Tar Shot",
    "names": {
      "zh-hans": "沥青射击",
      "zh-hant": "瀝青射擊",
      "en": "Tar Shot",
      "ja": "タールショット"
    },
    "type": "rock",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "swagger",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "750": {
    "resourceType": "move",
    "id": 750,
    "slug": "magic-powder",
    "calcMoveName": "Magic Powder",
    "names": {
      "zh-hans": "魔法粉",
      "zh-hant": "魔法粉",
      "en": "Magic Powder",
      "ja": "まほうのこな"
    },
    "type": "psychic",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "751": {
    "resourceType": "move",
    "id": 751,
    "slug": "dragon-darts",
    "calcMoveName": "Dragon Darts",
    "names": {
      "zh-hans": "龙箭",
      "zh-hant": "龍箭",
      "en": "Dragon Darts",
      "ja": "ドラゴンアロー"
    },
    "type": "dragon",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "752": {
    "resourceType": "move",
    "id": 752,
    "slug": "teatime",
    "calcMoveName": "Teatime",
    "names": {
      "zh-hans": "茶会",
      "zh-hant": "茶會",
      "en": "Teatime",
      "ja": "おちゃかい"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "all-pokemon",
    "isSpread": false
  },
  "753": {
    "resourceType": "move",
    "id": 753,
    "slug": "octolock",
    "calcMoveName": "Octolock",
    "names": {
      "zh-hans": "蛸固",
      "zh-hant": "蛸固",
      "en": "Octolock",
      "ja": "たこがため"
    },
    "type": "fighting",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "754": {
    "resourceType": "move",
    "id": 754,
    "slug": "bolt-beak",
    "calcMoveName": "Bolt Beak",
    "names": {
      "zh-hans": "电喙",
      "zh-hant": "電喙",
      "en": "Bolt Beak",
      "ja": "でんげきくちばし"
    },
    "type": "electric",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "755": {
    "resourceType": "move",
    "id": 755,
    "slug": "fishious-rend",
    "calcMoveName": "Fishious Rend",
    "names": {
      "zh-hans": "鳃咬",
      "zh-hant": "鰓咬",
      "en": "Fishious Rend",
      "ja": "エラがみ"
    },
    "type": "water",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "756": {
    "resourceType": "move",
    "id": 756,
    "slug": "court-change",
    "calcMoveName": "Court Change",
    "names": {
      "zh-hans": "换场",
      "zh-hant": "換場",
      "en": "Court Change",
      "ja": "コートチェンジ"
    },
    "type": "normal",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "entire-field",
    "isSpread": true
  },
  "757": {
    "resourceType": "move",
    "id": 757,
    "slug": "max-flare",
    "calcMoveName": "Max Flare",
    "names": {
      "zh-hans": "极巨火爆",
      "zh-hant": "極巨火爆",
      "en": "Max Flare",
      "ja": "ダイバーン"
    },
    "type": "fire",
    "category": "physical",
    "power": 100,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "758": {
    "resourceType": "move",
    "id": 758,
    "slug": "max-flutterby",
    "calcMoveName": "Max Flutterby",
    "names": {
      "zh-hans": "极巨虫蛊",
      "zh-hant": "極巨蟲蠱",
      "en": "Max Flutterby",
      "ja": "ダイワーム"
    },
    "type": "bug",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "759": {
    "resourceType": "move",
    "id": 759,
    "slug": "max-lightning",
    "calcMoveName": "Max Lightning",
    "names": {
      "zh-hans": "极巨闪电",
      "zh-hant": "極巨閃電",
      "en": "Max Lightning",
      "ja": "ダイサンダー"
    },
    "type": "electric",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "760": {
    "resourceType": "move",
    "id": 760,
    "slug": "max-strike",
    "calcMoveName": "Max Strike",
    "names": {
      "zh-hans": "极巨攻击",
      "zh-hant": "極巨攻擊",
      "en": "Max Strike",
      "ja": "ダイアタック"
    },
    "type": "normal",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "761": {
    "resourceType": "move",
    "id": 761,
    "slug": "max-knuckle",
    "calcMoveName": "Max Knuckle",
    "names": {
      "zh-hans": "极巨拳斗",
      "zh-hant": "極巨拳鬥",
      "en": "Max Knuckle",
      "ja": "ダイナックル"
    },
    "type": "fighting",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "762": {
    "resourceType": "move",
    "id": 762,
    "slug": "max-phantasm",
    "calcMoveName": "Max Phantasm",
    "names": {
      "zh-hans": "极巨幽魂",
      "zh-hant": "極巨幽魂",
      "en": "Max Phantasm",
      "ja": "ダイホロウ"
    },
    "type": "ghost",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "763": {
    "resourceType": "move",
    "id": 763,
    "slug": "max-hailstorm",
    "calcMoveName": "Max Hailstorm",
    "names": {
      "zh-hans": "极巨寒冰",
      "zh-hant": "極巨寒冰",
      "en": "Max Hailstorm",
      "ja": "ダイアイス"
    },
    "type": "ice",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "764": {
    "resourceType": "move",
    "id": 764,
    "slug": "max-ooze",
    "calcMoveName": "Max Ooze",
    "names": {
      "zh-hans": "极巨酸毒",
      "zh-hant": "極巨酸毒",
      "en": "Max Ooze",
      "ja": "ダイアシッド"
    },
    "type": "poison",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "765": {
    "resourceType": "move",
    "id": 765,
    "slug": "max-geyser",
    "calcMoveName": "Max Geyser",
    "names": {
      "zh-hans": "极巨水流",
      "zh-hant": "極巨水流",
      "en": "Max Geyser",
      "ja": "ダイストリーム"
    },
    "type": "water",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "766": {
    "resourceType": "move",
    "id": 766,
    "slug": "max-airstream",
    "calcMoveName": "Max Airstream",
    "names": {
      "zh-hans": "极巨飞冲",
      "zh-hant": "極巨飛衝",
      "en": "Max Airstream",
      "ja": "ダイジェット"
    },
    "type": "flying",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "767": {
    "resourceType": "move",
    "id": 767,
    "slug": "max-starfall",
    "calcMoveName": "Max Starfall",
    "names": {
      "zh-hans": "极巨妖精",
      "zh-hant": "極巨妖精",
      "en": "Max Starfall",
      "ja": "ダイフェアリー"
    },
    "type": "fairy",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "768": {
    "resourceType": "move",
    "id": 768,
    "slug": "max-wyrmwind",
    "calcMoveName": "Max Wyrmwind",
    "names": {
      "zh-hans": "极巨龙骑",
      "zh-hant": "極巨龍騎",
      "en": "Max Wyrmwind",
      "ja": "ダイドラグーン"
    },
    "type": "dragon",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "769": {
    "resourceType": "move",
    "id": 769,
    "slug": "max-mindstorm",
    "calcMoveName": "Max Mindstorm",
    "names": {
      "zh-hans": "极巨超能",
      "zh-hant": "極巨超能",
      "en": "Max Mindstorm",
      "ja": "ダイサイコ"
    },
    "type": "psychic",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "770": {
    "resourceType": "move",
    "id": 770,
    "slug": "max-rockfall",
    "calcMoveName": "Max Rockfall",
    "names": {
      "zh-hans": "极巨岩石",
      "zh-hant": "極巨岩石",
      "en": "Max Rockfall",
      "ja": "ダイロック"
    },
    "type": "rock",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "771": {
    "resourceType": "move",
    "id": 771,
    "slug": "max-quake",
    "calcMoveName": "Max Quake",
    "names": {
      "zh-hans": "极巨大地",
      "zh-hant": "極巨大地",
      "en": "Max Quake",
      "ja": "ダイアース"
    },
    "type": "ground",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "772": {
    "resourceType": "move",
    "id": 772,
    "slug": "max-darkness",
    "calcMoveName": "Max Darkness",
    "names": {
      "zh-hans": "极巨恶霸",
      "zh-hant": "極巨惡霸",
      "en": "Max Darkness",
      "ja": "ダイアーク"
    },
    "type": "dark",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "773": {
    "resourceType": "move",
    "id": 773,
    "slug": "max-overgrowth",
    "calcMoveName": "Max Overgrowth",
    "names": {
      "zh-hans": "极巨草原",
      "zh-hant": "極巨草原",
      "en": "Max Overgrowth",
      "ja": "ダイソウゲン"
    },
    "type": "grass",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "774": {
    "resourceType": "move",
    "id": 774,
    "slug": "max-steelspike",
    "calcMoveName": "Max Steelspike",
    "names": {
      "zh-hans": "极巨钢铁",
      "zh-hant": "極巨鋼鐵",
      "en": "Max Steelspike",
      "ja": "ダイスチル"
    },
    "type": "steel",
    "category": "physical",
    "power": 10,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon-me-first",
    "isSpread": false
  },
  "775": {
    "resourceType": "move",
    "id": 775,
    "slug": "clangorous-soul",
    "calcMoveName": "Clangorous Soul",
    "names": {
      "zh-hans": "魂舞烈音爆",
      "zh-hant": "魂舞烈音爆",
      "en": "Clangorous Soul",
      "ja": "ソウルビート"
    },
    "type": "dragon",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "net-good-stats",
    "target": "user",
    "isSpread": false
  },
  "776": {
    "resourceType": "move",
    "id": 776,
    "slug": "body-press",
    "calcMoveName": "Body Press",
    "names": {
      "zh-hans": "扑击",
      "zh-hant": "撲擊",
      "en": "Body Press",
      "ja": "ボディプレス"
    },
    "type": "fighting",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "777": {
    "resourceType": "move",
    "id": 777,
    "slug": "decorate",
    "calcMoveName": "Decorate",
    "names": {
      "zh-hans": "装饰",
      "zh-hant": "裝飾",
      "en": "Decorate",
      "ja": "デコレーション"
    },
    "type": "fairy",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "778": {
    "resourceType": "move",
    "id": 778,
    "slug": "drum-beating",
    "calcMoveName": "Drum Beating",
    "names": {
      "zh-hans": "鼓击",
      "zh-hant": "鼓擊",
      "en": "Drum Beating",
      "ja": "ドラムアタック"
    },
    "type": "grass",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "779": {
    "resourceType": "move",
    "id": 779,
    "slug": "snap-trap",
    "calcMoveName": "Snap Trap",
    "names": {
      "zh-hans": "捕兽夹",
      "zh-hant": "捕獸夾",
      "en": "Snap Trap",
      "ja": "トラバサミ"
    },
    "type": "grass",
    "category": "physical",
    "power": 35,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "780": {
    "resourceType": "move",
    "id": 780,
    "slug": "pyro-ball",
    "calcMoveName": "Pyro Ball",
    "names": {
      "zh-hans": "火焰球",
      "zh-hant": "火焰球",
      "en": "Pyro Ball",
      "ja": "かえんボール"
    },
    "type": "fire",
    "category": "physical",
    "power": 120,
    "accuracy": 90,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "781": {
    "resourceType": "move",
    "id": 781,
    "slug": "behemoth-blade",
    "calcMoveName": "Behemoth Blade",
    "names": {
      "zh-hans": "巨兽斩",
      "zh-hant": "巨獸斬",
      "en": "Behemoth Blade",
      "ja": "きょじゅうざん"
    },
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "782": {
    "resourceType": "move",
    "id": 782,
    "slug": "behemoth-bash",
    "calcMoveName": "Behemoth Bash",
    "names": {
      "zh-hans": "巨兽弹",
      "zh-hant": "巨獸彈",
      "en": "Behemoth Bash",
      "ja": "きょじゅうだん"
    },
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "783": {
    "resourceType": "move",
    "id": 783,
    "slug": "aura-wheel",
    "calcMoveName": "Aura Wheel",
    "names": {
      "zh-hans": "气场轮",
      "zh-hant": "氣場輪",
      "en": "Aura Wheel",
      "ja": "オーラぐるま"
    },
    "type": "electric",
    "category": "physical",
    "power": 110,
    "accuracy": 100,
    "damageKind": "damage-raise",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "784": {
    "resourceType": "move",
    "id": 784,
    "slug": "breaking-swipe",
    "calcMoveName": "Breaking Swipe",
    "names": {
      "zh-hans": "广域破坏",
      "zh-hant": "廣域破壞",
      "en": "Breaking Swipe",
      "ja": "ワイドブレイカー"
    },
    "type": "dragon",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "all-opponents",
    "isSpread": true
  },
  "785": {
    "resourceType": "move",
    "id": 785,
    "slug": "branch-poke",
    "calcMoveName": "Branch Poke",
    "names": {
      "zh-hans": "木枝突刺",
      "zh-hant": "木枝突刺",
      "en": "Branch Poke",
      "ja": "えだづき"
    },
    "type": "grass",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "786": {
    "resourceType": "move",
    "id": 786,
    "slug": "overdrive",
    "calcMoveName": "Overdrive",
    "names": {
      "zh-hans": "破音",
      "zh-hant": "破音",
      "en": "Overdrive",
      "ja": "オーバードライブ"
    },
    "type": "electric",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "787": {
    "resourceType": "move",
    "id": 787,
    "slug": "apple-acid",
    "calcMoveName": "Apple Acid",
    "names": {
      "zh-hans": "苹果酸",
      "zh-hant": "蘋果酸",
      "en": "Apple Acid",
      "ja": "りんごさん"
    },
    "type": "grass",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "788": {
    "resourceType": "move",
    "id": 788,
    "slug": "grav-apple",
    "calcMoveName": "Grav Apple",
    "names": {
      "zh-hans": "万有引力",
      "zh-hant": "萬有引力",
      "en": "Grav Apple",
      "ja": "Ｇのちから"
    },
    "type": "grass",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "789": {
    "resourceType": "move",
    "id": 789,
    "slug": "spirit-break",
    "calcMoveName": "Spirit Break",
    "names": {
      "zh-hans": "灵魂冲击",
      "zh-hant": "靈魂衝擊",
      "en": "Spirit Break",
      "ja": "ソウルクラッシュ"
    },
    "type": "fairy",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "790": {
    "resourceType": "move",
    "id": 790,
    "slug": "strange-steam",
    "calcMoveName": "Strange Steam",
    "names": {
      "zh-hans": "神奇蒸汽",
      "zh-hant": "神奇蒸汽",
      "en": "Strange Steam",
      "ja": "ワンダースチーム"
    },
    "type": "fairy",
    "category": "special",
    "power": 90,
    "accuracy": 95,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "791": {
    "resourceType": "move",
    "id": 791,
    "slug": "life-dew",
    "calcMoveName": "Life Dew",
    "names": {
      "zh-hans": "生命水滴",
      "zh-hant": "生命水滴",
      "en": "Life Dew",
      "ja": "いのちのしずく"
    },
    "type": "water",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "heal",
    "target": "user-and-allies",
    "isSpread": false
  },
  "792": {
    "resourceType": "move",
    "id": 792,
    "slug": "obstruct",
    "calcMoveName": "Obstruct",
    "names": {
      "zh-hans": "拦堵",
      "zh-hant": "攔堵",
      "en": "Obstruct",
      "ja": "ブロッキング"
    },
    "type": "dark",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "793": {
    "resourceType": "move",
    "id": 793,
    "slug": "false-surrender",
    "calcMoveName": "False Surrender",
    "names": {
      "zh-hans": "假跪真撞",
      "zh-hant": "假跪真撞",
      "en": "False Surrender",
      "ja": "どげざつき"
    },
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": null,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "794": {
    "resourceType": "move",
    "id": 794,
    "slug": "meteor-assault",
    "calcMoveName": "Meteor Assault",
    "names": {
      "zh-hans": "流星突击",
      "zh-hant": "流星突擊",
      "en": "Meteor Assault",
      "ja": "スターアサルト"
    },
    "type": "fighting",
    "category": "physical",
    "power": 150,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "795": {
    "resourceType": "move",
    "id": 795,
    "slug": "eternabeam",
    "calcMoveName": "Eternabeam",
    "names": {
      "zh-hans": "无极光束",
      "zh-hant": "無極光束",
      "en": "Eternabeam",
      "ja": "ムゲンダイビーム"
    },
    "type": "dragon",
    "category": "special",
    "power": 160,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "796": {
    "resourceType": "move",
    "id": 796,
    "slug": "steel-beam",
    "calcMoveName": "Steel Beam",
    "names": {
      "zh-hans": "铁蹄光线",
      "zh-hant": "鐵蹄光線",
      "en": "Steel Beam",
      "ja": "てっていこうせん"
    },
    "type": "steel",
    "category": "special",
    "power": 140,
    "accuracy": 95,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "797": {
    "resourceType": "move",
    "id": 797,
    "slug": "expanding-force",
    "calcMoveName": "Expanding Force",
    "names": {
      "zh-hans": "广域战力",
      "zh-hant": "廣域戰力",
      "en": "Expanding Force",
      "ja": "ワイドフォース"
    },
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "798": {
    "resourceType": "move",
    "id": 798,
    "slug": "steel-roller",
    "calcMoveName": "Steel Roller",
    "names": {
      "zh-hans": "铁滚轮",
      "zh-hant": "鐵滾輪",
      "en": "Steel Roller",
      "ja": "アイアンローラー"
    },
    "type": "steel",
    "category": "physical",
    "power": 130,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
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
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "800": {
    "resourceType": "move",
    "id": 800,
    "slug": "meteor-beam",
    "calcMoveName": "Meteor Beam",
    "names": {
      "zh-hans": "流星光束",
      "zh-hant": "流星光束",
      "en": "Meteor Beam",
      "ja": "メテオビーム"
    },
    "type": "rock",
    "category": "special",
    "power": 120,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "801": {
    "resourceType": "move",
    "id": 801,
    "slug": "shell-side-arm",
    "calcMoveName": "Shell Side Arm",
    "names": {
      "zh-hans": "臂贝武器",
      "zh-hant": "臂貝武器",
      "en": "Shell Side Arm",
      "ja": "シェルアームズ"
    },
    "type": "poison",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "802": {
    "resourceType": "move",
    "id": 802,
    "slug": "misty-explosion",
    "calcMoveName": "Misty Explosion",
    "names": {
      "zh-hans": "薄雾炸裂",
      "zh-hant": "薄霧炸裂",
      "en": "Misty Explosion",
      "ja": "ミストバースト"
    },
    "type": "fairy",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "803": {
    "resourceType": "move",
    "id": 803,
    "slug": "grassy-glide",
    "calcMoveName": "Grassy Glide",
    "names": {
      "zh-hans": "青草滑梯",
      "zh-hant": "青草滑梯",
      "en": "Grassy Glide",
      "ja": "グラススライダー"
    },
    "type": "grass",
    "category": "physical",
    "power": 55,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "804": {
    "resourceType": "move",
    "id": 804,
    "slug": "rising-voltage",
    "calcMoveName": "Rising Voltage",
    "names": {
      "zh-hans": "电力上升",
      "zh-hant": "電力上升",
      "en": "Rising Voltage",
      "ja": "ライジングボルト"
    },
    "type": "electric",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "805": {
    "resourceType": "move",
    "id": 805,
    "slug": "terrain-pulse",
    "calcMoveName": "Terrain Pulse",
    "names": {
      "zh-hans": "大地波动",
      "zh-hant": "大地波動",
      "en": "Terrain Pulse",
      "ja": "だいちのはどう"
    },
    "type": "normal",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "806": {
    "resourceType": "move",
    "id": 806,
    "slug": "skitter-smack",
    "calcMoveName": "Skitter Smack",
    "names": {
      "zh-hans": "爬击",
      "zh-hant": "爬擊",
      "en": "Skitter Smack",
      "ja": "はいよるいちげき"
    },
    "type": "bug",
    "category": "physical",
    "power": 70,
    "accuracy": 90,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "807": {
    "resourceType": "move",
    "id": 807,
    "slug": "burning-jealousy",
    "calcMoveName": "Burning Jealousy",
    "names": {
      "zh-hans": "妒火",
      "zh-hant": "妒火",
      "en": "Burning Jealousy",
      "ja": "しっとのほのお"
    },
    "type": "fire",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "all-opponents",
    "isSpread": true
  },
  "808": {
    "resourceType": "move",
    "id": 808,
    "slug": "lash-out",
    "calcMoveName": "Lash Out",
    "names": {
      "zh-hans": "泄愤",
      "zh-hant": "洩憤",
      "en": "Lash Out",
      "ja": "うっぷんばらし"
    },
    "type": "dark",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "809": {
    "resourceType": "move",
    "id": 809,
    "slug": "poltergeist",
    "calcMoveName": "Poltergeist",
    "names": {
      "zh-hans": "灵骚",
      "zh-hant": "靈騷",
      "en": "Poltergeist",
      "ja": "ポルターガイスト"
    },
    "type": "ghost",
    "category": "physical",
    "power": 110,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "810": {
    "resourceType": "move",
    "id": 810,
    "slug": "corrosive-gas",
    "calcMoveName": "Corrosive Gas",
    "names": {
      "zh-hans": "腐蚀气体",
      "zh-hant": "腐蝕氣體",
      "en": "Corrosive Gas",
      "ja": "ふしょくガス"
    },
    "type": "poison",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "all-other-pokemon",
    "isSpread": true
  },
  "811": {
    "resourceType": "move",
    "id": 811,
    "slug": "coaching",
    "calcMoveName": "Coaching",
    "names": {
      "zh-hans": "指导",
      "zh-hant": "指導",
      "en": "Coaching",
      "ja": "コーチング"
    },
    "type": "fighting",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "net-good-stats",
    "target": "user-and-allies",
    "isSpread": false
  },
  "812": {
    "resourceType": "move",
    "id": 812,
    "slug": "flip-turn",
    "calcMoveName": "Flip Turn",
    "names": {
      "zh-hans": "快速折返",
      "zh-hant": "快速折返",
      "en": "Flip Turn",
      "ja": "クイックターン"
    },
    "type": "water",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "813": {
    "resourceType": "move",
    "id": 813,
    "slug": "triple-axel",
    "calcMoveName": "Triple Axel",
    "names": {
      "zh-hans": "三旋击",
      "zh-hant": "三旋擊",
      "en": "Triple Axel",
      "ja": "トリプルアクセル"
    },
    "type": "ice",
    "category": "physical",
    "power": 20,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "814": {
    "resourceType": "move",
    "id": 814,
    "slug": "dual-wingbeat",
    "calcMoveName": "Dual Wingbeat",
    "names": {
      "zh-hans": "双翼",
      "zh-hant": "雙翼",
      "en": "Dual Wingbeat",
      "ja": "ダブルウイング"
    },
    "type": "flying",
    "category": "physical",
    "power": 40,
    "accuracy": 90,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "815": {
    "resourceType": "move",
    "id": 815,
    "slug": "scorching-sands",
    "calcMoveName": "Scorching Sands",
    "names": {
      "zh-hans": "热沙大地",
      "zh-hant": "熱沙大地",
      "en": "Scorching Sands",
      "ja": "ねっさのだいち"
    },
    "type": "ground",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "816": {
    "resourceType": "move",
    "id": 816,
    "slug": "jungle-healing",
    "calcMoveName": "Jungle Healing",
    "names": {
      "zh-hans": "丛林治疗",
      "zh-hant": "叢林治療",
      "en": "Jungle Healing",
      "ja": "ジャングルヒール"
    },
    "type": "grass",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user-and-allies",
    "isSpread": false
  },
  "817": {
    "resourceType": "move",
    "id": 817,
    "slug": "wicked-blow",
    "calcMoveName": "Wicked Blow",
    "names": {
      "zh-hans": "暗冥强击",
      "zh-hant": "暗冥強擊",
      "en": "Wicked Blow",
      "ja": "あんこくきょうだ"
    },
    "type": "dark",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "818": {
    "resourceType": "move",
    "id": 818,
    "slug": "surging-strikes",
    "calcMoveName": "Surging Strikes",
    "names": {
      "zh-hans": "水流连打",
      "zh-hant": "水流連打",
      "en": "Surging Strikes",
      "ja": "すいりゅうれんだ"
    },
    "type": "water",
    "category": "physical",
    "power": 25,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "819": {
    "resourceType": "move",
    "id": 819,
    "slug": "thunder-cage",
    "calcMoveName": "Thunder Cage",
    "names": {
      "zh-hans": "雷电囚笼",
      "zh-hant": "雷電囚籠",
      "en": "Thunder Cage",
      "ja": "サンダープリズン"
    },
    "type": "electric",
    "category": "special",
    "power": 80,
    "accuracy": 90,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "820": {
    "resourceType": "move",
    "id": 820,
    "slug": "dragon-energy",
    "calcMoveName": "Dragon Energy",
    "names": {
      "zh-hans": "巨龙威能",
      "zh-hant": "巨龍威能",
      "en": "Dragon Energy",
      "ja": "ドラゴンエナジー"
    },
    "type": "dragon",
    "category": "special",
    "power": 150,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "821": {
    "resourceType": "move",
    "id": 821,
    "slug": "freezing-glare",
    "calcMoveName": "Freezing Glare",
    "names": {
      "zh-hans": "冰冷视线",
      "zh-hant": "冰冷視線",
      "en": "Freezing Glare",
      "ja": "いてつくしせん"
    },
    "type": "psychic",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-ailment",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "822": {
    "resourceType": "move",
    "id": 822,
    "slug": "fiery-wrath",
    "calcMoveName": "Fiery Wrath",
    "names": {
      "zh-hans": "怒火中烧",
      "zh-hant": "怒火中燒",
      "en": "Fiery Wrath",
      "ja": "もえあがるいかり"
    },
    "type": "dark",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "823": {
    "resourceType": "move",
    "id": 823,
    "slug": "thunderous-kick",
    "calcMoveName": "Thunderous Kick",
    "names": {
      "zh-hans": "雷鸣蹴击",
      "zh-hant": "雷鳴蹴擊",
      "en": "Thunderous Kick",
      "ja": "らいめいげり"
    },
    "type": "fighting",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "damage-lower",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "824": {
    "resourceType": "move",
    "id": 824,
    "slug": "glacial-lance",
    "calcMoveName": "Glacial Lance",
    "names": {
      "zh-hans": "雪矛",
      "zh-hant": "雪矛",
      "en": "Glacial Lance",
      "ja": "ブリザードランス"
    },
    "type": "ice",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "825": {
    "resourceType": "move",
    "id": 825,
    "slug": "astral-barrage",
    "calcMoveName": "Astral Barrage",
    "names": {
      "zh-hans": "星碎",
      "zh-hant": "星碎",
      "en": "Astral Barrage",
      "ja": "アストラルビット"
    },
    "type": "ghost",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "all-opponents",
    "isSpread": true
  },
  "826": {
    "resourceType": "move",
    "id": 826,
    "slug": "eerie-spell",
    "calcMoveName": "Eerie Spell",
    "names": {
      "zh-hans": "诡异咒语",
      "zh-hant": "詭異咒語",
      "en": "Eerie Spell",
      "ja": "ぶきみなじゅもん"
    },
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "damage",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "827": {
    "resourceType": "move",
    "id": 827,
    "slug": "dire-claw",
    "calcMoveName": "Dire Claw",
    "names": {
      "zh-hans": "Dire Claw",
      "zh-hant": "克命爪",
      "en": "Dire Claw",
      "ja": "フェイタルクロー"
    },
    "type": "poison",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "828": {
    "resourceType": "move",
    "id": 828,
    "slug": "psyshield-bash",
    "calcMoveName": "Psyshield Bash",
    "names": {
      "zh-hans": "Psyshield Bash",
      "zh-hant": "屏障猛攻",
      "en": "Psyshield Bash",
      "ja": "バリアーラッシュ"
    },
    "type": "psychic",
    "category": "physical",
    "power": 70,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "829": {
    "resourceType": "move",
    "id": 829,
    "slug": "power-shift",
    "calcMoveName": "Power Shift",
    "names": {
      "zh-hans": "Power Shift",
      "zh-hant": "力量转换",
      "en": "Power Shift",
      "ja": "パワーシフト"
    },
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "830": {
    "resourceType": "move",
    "id": 830,
    "slug": "stone-axe",
    "calcMoveName": "Stone Axe",
    "names": {
      "zh-hans": "Stone Axe",
      "zh-hant": "岩斧",
      "en": "Stone Axe",
      "ja": "がんせきアックス"
    },
    "type": "rock",
    "category": "physical",
    "power": 65,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "831": {
    "resourceType": "move",
    "id": 831,
    "slug": "springtide-storm",
    "calcMoveName": "Springtide Storm",
    "names": {
      "zh-hans": "Springtide Storm",
      "zh-hant": "阳春风暴",
      "en": "Springtide Storm",
      "ja": "はるのあらし"
    },
    "type": "fairy",
    "category": "special",
    "power": 100,
    "accuracy": 80,
    "damageKind": "unique",
    "target": "all-opponents",
    "isSpread": true
  },
  "832": {
    "resourceType": "move",
    "id": 832,
    "slug": "mystical-power",
    "calcMoveName": "Mystical Power",
    "names": {
      "zh-hans": "Mystical Power",
      "zh-hant": "神秘之力",
      "en": "Mystical Power",
      "ja": "しんぴのちから"
    },
    "type": "psychic",
    "category": "special",
    "power": 70,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "833": {
    "resourceType": "move",
    "id": 833,
    "slug": "raging-fury",
    "calcMoveName": "Raging Fury",
    "names": {
      "zh-hans": "Raging Fury",
      "zh-hant": "大愤慨",
      "en": "Raging Fury",
      "ja": "だいふんげき"
    },
    "type": "fire",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "random-opponent",
    "isSpread": false
  },
  "834": {
    "resourceType": "move",
    "id": 834,
    "slug": "wave-crash",
    "calcMoveName": "Wave Crash",
    "names": {
      "zh-hans": "Wave Crash",
      "zh-hant": "波动冲",
      "en": "Wave Crash",
      "ja": "ウェーブタックル"
    },
    "type": "water",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "835": {
    "resourceType": "move",
    "id": 835,
    "slug": "chloroblast",
    "calcMoveName": "Chloroblast",
    "names": {
      "zh-hans": "Chloroblast",
      "zh-hant": "叶绿爆震",
      "en": "Chloroblast",
      "ja": "クロロブラスト"
    },
    "type": "grass",
    "category": "special",
    "power": 150,
    "accuracy": 95,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "836": {
    "resourceType": "move",
    "id": 836,
    "slug": "mountain-gale",
    "calcMoveName": "Mountain Gale",
    "names": {
      "zh-hans": "Mountain Gale",
      "zh-hant": "冰山风",
      "en": "Mountain Gale",
      "ja": "ひょうざんおろし"
    },
    "type": "ice",
    "category": "physical",
    "power": 100,
    "accuracy": 85,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "837": {
    "resourceType": "move",
    "id": 837,
    "slug": "victory-dance",
    "calcMoveName": "Victory Dance",
    "names": {
      "zh-hans": "Victory Dance",
      "zh-hant": "胜利之舞",
      "en": "Victory Dance",
      "ja": "しょうりのまい"
    },
    "type": "fighting",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "838": {
    "resourceType": "move",
    "id": 838,
    "slug": "headlong-rush",
    "calcMoveName": "Headlong Rush",
    "names": {
      "zh-hans": "Headlong Rush",
      "zh-hant": "突飞猛扑",
      "en": "Headlong Rush",
      "ja": "ぶちかまし"
    },
    "type": "ground",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "839": {
    "resourceType": "move",
    "id": 839,
    "slug": "barb-barrage",
    "calcMoveName": "Barb Barrage",
    "names": {
      "zh-hans": "Barb Barrage",
      "zh-hant": "毒千针",
      "en": "Barb Barrage",
      "ja": "どくばりセンボン"
    },
    "type": "poison",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "840": {
    "resourceType": "move",
    "id": 840,
    "slug": "esper-wing",
    "calcMoveName": "Esper Wing",
    "names": {
      "zh-hans": "Esper Wing",
      "zh-hant": "气场之翼",
      "en": "Esper Wing",
      "ja": "オーラウイング"
    },
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "841": {
    "resourceType": "move",
    "id": 841,
    "slug": "bitter-malice",
    "calcMoveName": "Bitter Malice",
    "names": {
      "zh-hans": "Bitter Malice",
      "zh-hant": "冤冤相报",
      "en": "Bitter Malice",
      "ja": "うらみつらみ"
    },
    "type": "ghost",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "842": {
    "resourceType": "move",
    "id": 842,
    "slug": "shelter",
    "calcMoveName": "Shelter",
    "names": {
      "zh-hans": "Shelter",
      "zh-hant": "闭关",
      "en": "Shelter",
      "ja": "たてこもる"
    },
    "type": "steel",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "843": {
    "resourceType": "move",
    "id": 843,
    "slug": "triple-arrows",
    "calcMoveName": "Triple Arrows",
    "names": {
      "zh-hans": "Triple Arrows",
      "zh-hant": "三连箭",
      "en": "Triple Arrows",
      "ja": "３ぼんのや"
    },
    "type": "fighting",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "844": {
    "resourceType": "move",
    "id": 844,
    "slug": "infernal-parade",
    "calcMoveName": "Infernal Parade",
    "names": {
      "zh-hans": "Infernal Parade",
      "zh-hant": "群魔乱舞",
      "en": "Infernal Parade",
      "ja": "ひゃっきやこう"
    },
    "type": "ghost",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "845": {
    "resourceType": "move",
    "id": 845,
    "slug": "ceaseless-edge",
    "calcMoveName": "Ceaseless Edge",
    "names": {
      "zh-hans": "Ceaseless Edge",
      "zh-hant": "秘剑・千重涛",
      "en": "Ceaseless Edge",
      "ja": "ひけん・ちえなみ"
    },
    "type": "dark",
    "category": "physical",
    "power": 65,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "846": {
    "resourceType": "move",
    "id": 846,
    "slug": "bleakwind-storm",
    "calcMoveName": "Bleakwind Storm",
    "names": {
      "zh-hans": "Bleakwind Storm",
      "zh-hant": "枯叶风暴",
      "en": "Bleakwind Storm",
      "ja": "こがらしあらし"
    },
    "type": "flying",
    "category": "special",
    "power": 100,
    "accuracy": 80,
    "damageKind": "unique",
    "target": "all-opponents",
    "isSpread": true
  },
  "847": {
    "resourceType": "move",
    "id": 847,
    "slug": "wildbolt-storm",
    "calcMoveName": "Wildbolt Storm",
    "names": {
      "zh-hans": "Wildbolt Storm",
      "zh-hant": "鸣雷风暴",
      "en": "Wildbolt Storm",
      "ja": "かみなりあらし"
    },
    "type": "electric",
    "category": "special",
    "power": 100,
    "accuracy": 80,
    "damageKind": "unique",
    "target": "all-opponents",
    "isSpread": true
  },
  "848": {
    "resourceType": "move",
    "id": 848,
    "slug": "sandsear-storm",
    "calcMoveName": "Sandsear Storm",
    "names": {
      "zh-hans": "Sandsear Storm",
      "zh-hant": "热沙风暴",
      "en": "Sandsear Storm",
      "ja": "ねっさのあらし"
    },
    "type": "ground",
    "category": "special",
    "power": 100,
    "accuracy": 80,
    "damageKind": "unique",
    "target": "all-opponents",
    "isSpread": true
  },
  "849": {
    "resourceType": "move",
    "id": 849,
    "slug": "lunar-blessing",
    "calcMoveName": "Lunar Blessing",
    "names": {
      "zh-hans": "Lunar Blessing",
      "zh-hant": "新月祈祷",
      "en": "Lunar Blessing",
      "ja": "みかづきのいのり"
    },
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "all-allies",
    "isSpread": false
  },
  "850": {
    "resourceType": "move",
    "id": 850,
    "slug": "take-heart",
    "calcMoveName": "Take Heart",
    "names": {
      "zh-hans": "Take Heart",
      "zh-hant": "勇气填充",
      "en": "Take Heart",
      "ja": "ブレイブチャージ"
    },
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "all-allies",
    "isSpread": false
  },
  "851": {
    "resourceType": "move",
    "id": 851,
    "slug": "tera-blast",
    "calcMoveName": "Tera Blast",
    "names": {
      "zh-hans": "Tera Blast",
      "zh-hant": "太晶爆发",
      "en": "Tera Blast",
      "ja": "テラバースト"
    },
    "type": "normal",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "852": {
    "resourceType": "move",
    "id": 852,
    "slug": "silk-trap",
    "calcMoveName": "Silk Trap",
    "names": {
      "zh-hans": "Silk Trap",
      "zh-hant": "线阱",
      "en": "Silk Trap",
      "ja": "スレッドトラップ"
    },
    "type": "bug",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "853": {
    "resourceType": "move",
    "id": 853,
    "slug": "axe-kick",
    "calcMoveName": "Axe Kick",
    "names": {
      "zh-hans": "Axe Kick",
      "zh-hant": "下压踢",
      "en": "Axe Kick",
      "ja": "かかとおとし"
    },
    "type": "fighting",
    "category": "physical",
    "power": 120,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "854": {
    "resourceType": "move",
    "id": 854,
    "slug": "last-respects",
    "calcMoveName": "Last Respects",
    "names": {
      "zh-hans": "Last Respects",
      "zh-hant": "扫墓",
      "en": "Last Respects",
      "ja": "おはかまいり"
    },
    "type": "ghost",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "855": {
    "resourceType": "move",
    "id": 855,
    "slug": "lumina-crash",
    "calcMoveName": "Lumina Crash",
    "names": {
      "zh-hans": "Lumina Crash",
      "zh-hant": "琉光冲激",
      "en": "Lumina Crash",
      "ja": "ルミナコリジョン"
    },
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "856": {
    "resourceType": "move",
    "id": 856,
    "slug": "order-up",
    "calcMoveName": "Order Up",
    "names": {
      "zh-hans": "Order Up",
      "zh-hant": "上菜",
      "en": "Order Up",
      "ja": "いっちょうあがり"
    },
    "type": "dragon",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "857": {
    "resourceType": "move",
    "id": 857,
    "slug": "jet-punch",
    "calcMoveName": "Jet Punch",
    "names": {
      "zh-hans": "Jet Punch",
      "zh-hant": "喷射拳",
      "en": "Jet Punch",
      "ja": "ジェットパンチ"
    },
    "type": "water",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "858": {
    "resourceType": "move",
    "id": 858,
    "slug": "spicy-extract",
    "calcMoveName": "Spicy Extract",
    "names": {
      "zh-hans": "Spicy Extract",
      "zh-hant": "辣椒精华",
      "en": "Spicy Extract",
      "ja": "ハバネロエキス"
    },
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "859": {
    "resourceType": "move",
    "id": 859,
    "slug": "spin-out",
    "calcMoveName": "Spin Out",
    "names": {
      "zh-hans": "Spin Out",
      "zh-hant": "疾速转轮",
      "en": "Spin Out",
      "ja": "ホイールスピン"
    },
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "860": {
    "resourceType": "move",
    "id": 860,
    "slug": "population-bomb",
    "calcMoveName": "Population Bomb",
    "names": {
      "zh-hans": "Population Bomb",
      "zh-hant": "鼠数儿",
      "en": "Population Bomb",
      "ja": "ネズミざん"
    },
    "type": "normal",
    "category": "physical",
    "power": 20,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "861": {
    "resourceType": "move",
    "id": 861,
    "slug": "ice-spinner",
    "calcMoveName": "Ice Spinner",
    "names": {
      "zh-hans": "Ice Spinner",
      "zh-hant": "冰旋",
      "en": "Ice Spinner",
      "ja": "アイススピナー"
    },
    "type": "ice",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "862": {
    "resourceType": "move",
    "id": 862,
    "slug": "glaive-rush",
    "calcMoveName": "Glaive Rush",
    "names": {
      "zh-hans": "Glaive Rush",
      "zh-hant": "巨剑突击",
      "en": "Glaive Rush",
      "ja": "きょけんとつげき"
    },
    "type": "dragon",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "863": {
    "resourceType": "move",
    "id": 863,
    "slug": "revival-blessing",
    "calcMoveName": "Revival Blessing",
    "names": {
      "zh-hans": "Revival Blessing",
      "zh-hant": "复生祈祷",
      "en": "Revival Blessing",
      "ja": "さいきのいのり"
    },
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "fainting-pokemon",
    "isSpread": false
  },
  "864": {
    "resourceType": "move",
    "id": 864,
    "slug": "salt-cure",
    "calcMoveName": "Salt Cure",
    "names": {
      "zh-hans": "Salt Cure",
      "zh-hant": "盐腌",
      "en": "Salt Cure",
      "ja": "しおづけ"
    },
    "type": "rock",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "865": {
    "resourceType": "move",
    "id": 865,
    "slug": "triple-dive",
    "calcMoveName": "Triple Dive",
    "names": {
      "zh-hans": "Triple Dive",
      "zh-hant": "三连钻",
      "en": "Triple Dive",
      "ja": "トリプルダイブ"
    },
    "type": "water",
    "category": "physical",
    "power": 30,
    "accuracy": 95,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "866": {
    "resourceType": "move",
    "id": 866,
    "slug": "mortal-spin",
    "calcMoveName": "Mortal Spin",
    "names": {
      "zh-hans": "Mortal Spin",
      "zh-hant": "晶光转转",
      "en": "Mortal Spin",
      "ja": "キラースピン"
    },
    "type": "poison",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "all-opponents",
    "isSpread": true
  },
  "867": {
    "resourceType": "move",
    "id": 867,
    "slug": "doodle",
    "calcMoveName": "Doodle",
    "names": {
      "zh-hans": "Doodle",
      "zh-hant": "描绘",
      "en": "Doodle",
      "ja": "うつしえ"
    },
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "868": {
    "resourceType": "move",
    "id": 868,
    "slug": "fillet-away",
    "calcMoveName": "Fillet Away",
    "names": {
      "zh-hans": "Fillet Away",
      "zh-hant": "甩肉",
      "en": "Fillet Away",
      "ja": "みをけずる"
    },
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "869": {
    "resourceType": "move",
    "id": 869,
    "slug": "kowtow-cleave",
    "calcMoveName": "Kowtow Cleave",
    "names": {
      "zh-hans": "Kowtow Cleave",
      "zh-hant": "仆刀",
      "en": "Kowtow Cleave",
      "ja": "ドゲザン"
    },
    "type": "dark",
    "category": "physical",
    "power": 85,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "870": {
    "resourceType": "move",
    "id": 870,
    "slug": "flower-trick",
    "calcMoveName": "Flower Trick",
    "names": {
      "zh-hans": "Flower Trick",
      "zh-hant": "千变万花",
      "en": "Flower Trick",
      "ja": "トリックフラワー"
    },
    "type": "grass",
    "category": "physical",
    "power": 70,
    "accuracy": null,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "871": {
    "resourceType": "move",
    "id": 871,
    "slug": "torch-song",
    "calcMoveName": "Torch Song",
    "names": {
      "zh-hans": "Torch Song",
      "zh-hant": "闪焰高歌",
      "en": "Torch Song",
      "ja": "フレアソング"
    },
    "type": "fire",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "872": {
    "resourceType": "move",
    "id": 872,
    "slug": "aqua-step",
    "calcMoveName": "Aqua Step",
    "names": {
      "zh-hans": "Aqua Step",
      "zh-hant": "流水旋舞",
      "en": "Aqua Step",
      "ja": "アクアステップ"
    },
    "type": "water",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "873": {
    "resourceType": "move",
    "id": 873,
    "slug": "raging-bull",
    "calcMoveName": "Raging Bull",
    "names": {
      "zh-hans": "Raging Bull",
      "zh-hant": "怒牛",
      "en": "Raging Bull",
      "ja": "レイジングブル"
    },
    "type": "normal",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "874": {
    "resourceType": "move",
    "id": 874,
    "slug": "make-it-rain",
    "calcMoveName": "Make It Rain",
    "names": {
      "zh-hans": "Make It Rain",
      "zh-hant": "淘金潮",
      "en": "Make It Rain",
      "ja": "ゴールドラッシュ"
    },
    "type": "steel",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "all-opponents",
    "isSpread": true
  },
  "875": {
    "resourceType": "move",
    "id": 875,
    "slug": "psyblade",
    "calcMoveName": "Psyblade",
    "names": {
      "zh-hans": "精神剑",
      "zh-hant": "精神劍",
      "en": "Psyblade",
      "ja": "サイコブレイド "
    },
    "type": "psychic",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "876": {
    "resourceType": "move",
    "id": 876,
    "slug": "hydro-steam",
    "calcMoveName": "Hydro Steam",
    "names": {
      "zh-hans": "水蒸气",
      "zh-hant": "水蒸氣",
      "en": "Hydro Steam",
      "ja": "ハイドロスチーム"
    },
    "type": "water",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "877": {
    "resourceType": "move",
    "id": 877,
    "slug": "ruination",
    "calcMoveName": "Ruination",
    "names": {
      "zh-hans": "Ruination",
      "zh-hant": "大灾难",
      "en": "Ruination",
      "ja": "カタストロフィ"
    },
    "type": "dark",
    "category": "special",
    "power": 1,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "878": {
    "resourceType": "move",
    "id": 878,
    "slug": "collision-course",
    "calcMoveName": "Collision Course",
    "names": {
      "zh-hans": "Collision Course",
      "zh-hant": "全开猛撞",
      "en": "Collision Course",
      "ja": "アクセルブレイク"
    },
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "879": {
    "resourceType": "move",
    "id": 879,
    "slug": "electro-drift",
    "calcMoveName": "Electro Drift",
    "names": {
      "zh-hans": "Electro Drift",
      "zh-hant": "闪电猛冲",
      "en": "Electro Drift",
      "ja": "イナズマドライブ"
    },
    "type": "electric",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "880": {
    "resourceType": "move",
    "id": 880,
    "slug": "shed-tail",
    "calcMoveName": "Shed Tail",
    "names": {
      "zh-hans": "Shed Tail",
      "zh-hant": "断尾",
      "en": "Shed Tail",
      "ja": "しっぽきり"
    },
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "881": {
    "resourceType": "move",
    "id": 881,
    "slug": "chilly-reception",
    "calcMoveName": "Chilly Reception",
    "names": {
      "zh-hans": "Chilly Reception",
      "zh-hant": "冷笑话",
      "en": "Chilly Reception",
      "ja": "さむいギャグ"
    },
    "type": "ice",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "entire-field",
    "isSpread": true
  },
  "882": {
    "resourceType": "move",
    "id": 882,
    "slug": "tidy-up",
    "calcMoveName": "Tidy Up",
    "names": {
      "zh-hans": "Tidy Up",
      "zh-hant": "大扫除",
      "en": "Tidy Up",
      "ja": "おかたづけ"
    },
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "883": {
    "resourceType": "move",
    "id": 883,
    "slug": "snowscape",
    "calcMoveName": "Snowscape",
    "names": {
      "zh-hans": "Snowscape",
      "zh-hant": "雪景",
      "en": "Snowscape",
      "ja": "ゆきげしき"
    },
    "type": "ice",
    "category": "status",
    "power": 0,
    "accuracy": null,
    "damageKind": "unique",
    "target": "entire-field",
    "isSpread": true
  },
  "884": {
    "resourceType": "move",
    "id": 884,
    "slug": "pounce",
    "calcMoveName": "Pounce",
    "names": {
      "zh-hans": "Pounce",
      "zh-hant": "虫扑",
      "en": "Pounce",
      "ja": "とびつく"
    },
    "type": "bug",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "885": {
    "resourceType": "move",
    "id": 885,
    "slug": "trailblaze",
    "calcMoveName": "Trailblaze",
    "names": {
      "zh-hans": "Trailblaze",
      "zh-hant": "起草",
      "en": "Trailblaze",
      "ja": "くさわけ"
    },
    "type": "grass",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "886": {
    "resourceType": "move",
    "id": 886,
    "slug": "chilling-water",
    "calcMoveName": "Chilling Water",
    "names": {
      "zh-hans": "Chilling Water",
      "zh-hant": "泼冷水",
      "en": "Chilling Water",
      "ja": "ひやみず"
    },
    "type": "water",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "887": {
    "resourceType": "move",
    "id": 887,
    "slug": "hyper-drill",
    "calcMoveName": "Hyper Drill",
    "names": {
      "zh-hans": "Hyper Drill",
      "zh-hant": "强力钻",
      "en": "Hyper Drill",
      "ja": "ハイパードリル"
    },
    "type": "normal",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "888": {
    "resourceType": "move",
    "id": 888,
    "slug": "twin-beam",
    "calcMoveName": "Twin Beam",
    "names": {
      "zh-hans": "Twin Beam",
      "zh-hant": "双光束",
      "en": "Twin Beam",
      "ja": "ツインビーム"
    },
    "type": "psychic",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "889": {
    "resourceType": "move",
    "id": 889,
    "slug": "rage-fist",
    "calcMoveName": "Rage Fist",
    "names": {
      "zh-hans": "Rage Fist",
      "zh-hant": "愤怒之拳",
      "en": "Rage Fist",
      "ja": "ふんどのこぶし"
    },
    "type": "ghost",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "890": {
    "resourceType": "move",
    "id": 890,
    "slug": "armor-cannon",
    "calcMoveName": "Armor Cannon",
    "names": {
      "zh-hans": "Armor Cannon",
      "zh-hant": "铠农炮",
      "en": "Armor Cannon",
      "ja": "アーマーキャノン"
    },
    "type": "fire",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "891": {
    "resourceType": "move",
    "id": 891,
    "slug": "bitter-blade",
    "calcMoveName": "Bitter Blade",
    "names": {
      "zh-hans": "Bitter Blade",
      "zh-hant": "悔念剑",
      "en": "Bitter Blade",
      "ja": "むねんのつるぎ"
    },
    "type": "fire",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "892": {
    "resourceType": "move",
    "id": 892,
    "slug": "double-shock",
    "calcMoveName": "Double Shock",
    "names": {
      "zh-hans": "Double Shock",
      "zh-hant": "电光双击",
      "en": "Double Shock",
      "ja": "でんこうそうげき"
    },
    "type": "electric",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "893": {
    "resourceType": "move",
    "id": 893,
    "slug": "gigaton-hammer",
    "calcMoveName": "Gigaton Hammer",
    "names": {
      "zh-hans": "Gigaton Hammer",
      "zh-hant": "巨力锤",
      "en": "Gigaton Hammer",
      "ja": "デカハンマー"
    },
    "type": "steel",
    "category": "physical",
    "power": 160,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "894": {
    "resourceType": "move",
    "id": 894,
    "slug": "comeuppance",
    "calcMoveName": "Comeuppance",
    "names": {
      "zh-hans": "Comeuppance",
      "zh-hant": "复仇",
      "en": "Comeuppance",
      "ja": "ほうふく"
    },
    "type": "dark",
    "category": "physical",
    "power": 1,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "specific-move",
    "isSpread": false
  },
  "895": {
    "resourceType": "move",
    "id": 895,
    "slug": "aqua-cutter",
    "calcMoveName": "Aqua Cutter",
    "names": {
      "zh-hans": "Aqua Cutter",
      "zh-hant": "水波刀",
      "en": "Aqua Cutter",
      "ja": "アクアカッター"
    },
    "type": "water",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "896": {
    "resourceType": "move",
    "id": 896,
    "slug": "blazing-torque",
    "calcMoveName": "Blazing Torque",
    "names": {
      "zh-hans": "Blazing Torque",
      "zh-hant": "灼热暴冲",
      "en": "Blazing Torque",
      "ja": "バーンアクセル"
    },
    "type": "fire",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "897": {
    "resourceType": "move",
    "id": 897,
    "slug": "wicked-torque",
    "calcMoveName": "Wicked Torque",
    "names": {
      "zh-hans": "Wicked Torque",
      "zh-hant": "黑暗暴冲",
      "en": "Wicked Torque",
      "ja": "ダークアクセル"
    },
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "898": {
    "resourceType": "move",
    "id": 898,
    "slug": "noxious-torque",
    "calcMoveName": "Noxious Torque",
    "names": {
      "zh-hans": "Noxious Torque",
      "zh-hant": "剧毒暴冲",
      "en": "Noxious Torque",
      "ja": "ポイズンアクセル"
    },
    "type": "poison",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "899": {
    "resourceType": "move",
    "id": 899,
    "slug": "combat-torque",
    "calcMoveName": "Combat Torque",
    "names": {
      "zh-hans": "Combat Torque",
      "zh-hant": "格斗暴冲",
      "en": "Combat Torque",
      "ja": "ファイトアクセル"
    },
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "900": {
    "resourceType": "move",
    "id": 900,
    "slug": "magical-torque",
    "calcMoveName": "Magical Torque",
    "names": {
      "zh-hans": "Magical Torque",
      "zh-hant": "魔法暴冲",
      "en": "Magical Torque",
      "ja": "マジカルアクセル"
    },
    "type": "fairy",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "901": {
    "resourceType": "move",
    "id": 901,
    "slug": "blood-moon",
    "calcMoveName": "Blood Moon",
    "names": {
      "zh-hans": "Blood Moon",
      "zh-hant": "Blood Moon",
      "en": "Blood Moon",
      "ja": "ブラッドムーン"
    },
    "type": "normal",
    "category": "special",
    "power": 140,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "902": {
    "resourceType": "move",
    "id": 902,
    "slug": "matcha-gotcha",
    "calcMoveName": "Matcha Gotcha",
    "names": {
      "zh-hans": "Matcha Gotcha",
      "zh-hant": "Matcha Gotcha",
      "en": "Matcha Gotcha",
      "ja": "シャカシャカほう"
    },
    "type": "grass",
    "category": "special",
    "power": 80,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "903": {
    "resourceType": "move",
    "id": 903,
    "slug": "syrup-bomb",
    "calcMoveName": "Syrup Bomb",
    "names": {
      "zh-hans": "Syrup Bomb",
      "zh-hant": "Syrup Bomb",
      "en": "Syrup Bomb",
      "ja": "みずあめボム"
    },
    "type": "grass",
    "category": "special",
    "power": 60,
    "accuracy": 85,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "904": {
    "resourceType": "move",
    "id": 904,
    "slug": "ivy-cudgel",
    "calcMoveName": "Ivy Cudgel",
    "names": {
      "zh-hans": "Ivy Cudgel",
      "zh-hant": "Ivy Cudgel",
      "en": "Ivy Cudgel",
      "ja": "ツタこんぼう"
    },
    "type": "grass",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "905": {
    "resourceType": "move",
    "id": 905,
    "slug": "electro-shot",
    "calcMoveName": "Electro Shot",
    "names": {
      "zh-hans": "电光束",
      "zh-hant": "電光束",
      "en": "Electro Shot",
      "ja": "エレクトロビーム"
    },
    "type": "electric",
    "category": "special",
    "power": 130,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "906": {
    "resourceType": "move",
    "id": 906,
    "slug": "tera-starstorm",
    "calcMoveName": "Tera Starstorm",
    "names": {
      "zh-hans": "晶光星群",
      "zh-hant": "晶光星群",
      "en": "Tera Starstorm",
      "ja": "テラクラスター"
    },
    "type": "normal",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "all-opponents",
    "isSpread": true
  },
  "907": {
    "resourceType": "move",
    "id": 907,
    "slug": "fickle-beam",
    "calcMoveName": "Fickle Beam",
    "names": {
      "zh-hans": "随机光",
      "zh-hant": "隨機光",
      "en": "Fickle Beam",
      "ja": "きまぐレーザー"
    },
    "type": "dragon",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "908": {
    "resourceType": "move",
    "id": 908,
    "slug": "burning-bulwark",
    "calcMoveName": "Burning Bulwark",
    "names": {
      "zh-hans": "火焰守护",
      "zh-hant": "火焰守護",
      "en": "Burning Bulwark",
      "ja": "かえんのまもり"
    },
    "type": "fire",
    "category": "status",
    "power": 0,
    "accuracy": 0,
    "damageKind": "unique",
    "target": "user",
    "isSpread": false
  },
  "909": {
    "resourceType": "move",
    "id": 909,
    "slug": "thunderclap",
    "calcMoveName": "Thunderclap",
    "names": {
      "zh-hans": "迅雷",
      "zh-hant": "迅雷",
      "en": "Thunderclap",
      "ja": "じんらい"
    },
    "type": "electric",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "910": {
    "resourceType": "move",
    "id": 910,
    "slug": "mighty-cleave",
    "calcMoveName": "Mighty Cleave",
    "names": {
      "zh-hans": "强刃攻击",
      "zh-hant": "強刃攻擊",
      "en": "Mighty Cleave",
      "ja": "パワフルエッジ"
    },
    "type": "rock",
    "category": "physical",
    "power": 95,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "911": {
    "resourceType": "move",
    "id": 911,
    "slug": "tachyon-cutter",
    "calcMoveName": "Tachyon Cutter",
    "names": {
      "zh-hans": "迅子利刃",
      "zh-hant": "迅子利刃",
      "en": "Tachyon Cutter",
      "ja": "タキオンカッター"
    },
    "type": "steel",
    "category": "special",
    "power": 50,
    "accuracy": 0,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "912": {
    "resourceType": "move",
    "id": 912,
    "slug": "hard-press",
    "calcMoveName": "Hard Press",
    "names": {
      "zh-hans": "硬压",
      "zh-hant": "硬壓",
      "en": "Hard Press",
      "ja": "ハードプレス"
    },
    "type": "steel",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "913": {
    "resourceType": "move",
    "id": 913,
    "slug": "dragon-cheer",
    "calcMoveName": "Dragon Cheer",
    "names": {
      "zh-hans": "龙声鼓舞",
      "zh-hant": "龍聲鼓舞",
      "en": "Dragon Cheer",
      "ja": "ドラゴンエール"
    },
    "type": "dragon",
    "category": "status",
    "power": 0,
    "accuracy": 0,
    "damageKind": "unique",
    "target": "all-allies",
    "isSpread": false
  },
  "914": {
    "resourceType": "move",
    "id": 914,
    "slug": "alluring-voice",
    "calcMoveName": "Alluring Voice",
    "names": {
      "zh-hans": "魅诱之声",
      "zh-hant": "魅誘之聲",
      "en": "Alluring Voice",
      "ja": "みわくのボイス"
    },
    "type": "fairy",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "915": {
    "resourceType": "move",
    "id": 915,
    "slug": "temper-flare",
    "calcMoveName": "Temper Flare",
    "names": {
      "zh-hans": "豁出去",
      "zh-hant": "豁出去",
      "en": "Temper Flare",
      "ja": "やけっぱち"
    },
    "type": "fire",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "916": {
    "resourceType": "move",
    "id": 916,
    "slug": "supercell-slam",
    "calcMoveName": "Supercell Slam",
    "names": {
      "zh-hans": "闪电强袭",
      "zh-hant": "閃電強襲",
      "en": "Supercell Slam",
      "ja": "サンダーダイブ"
    },
    "type": "electric",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "917": {
    "resourceType": "move",
    "id": 917,
    "slug": "psychic-noise",
    "calcMoveName": "Psychic Noise",
    "names": {
      "zh-hans": "精神噪音",
      "zh-hant": "精神噪音",
      "en": "Psychic Noise",
      "ja": "サイコノイズ"
    },
    "type": "psychic",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "918": {
    "resourceType": "move",
    "id": 918,
    "slug": "upper-hand",
    "calcMoveName": "Upper Hand",
    "names": {
      "zh-hans": "快手还击",
      "zh-hant": "快手還擊",
      "en": "Upper Hand",
      "ja": "はやてがえし"
    },
    "type": "fighting",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "919": {
    "resourceType": "move",
    "id": 919,
    "slug": "malignant-chain",
    "calcMoveName": "Malignant Chain",
    "names": {
      "zh-hans": "邪毒锁链",
      "zh-hant": "邪毒鎖鏈",
      "en": "Malignant Chain",
      "ja": "じゃどくのくさり"
    },
    "type": "poison",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10001": {
    "resourceType": "move",
    "id": 10001,
    "slug": "shadow-rush",
    "calcMoveName": "Shadow Rush",
    "names": {
      "zh-hans": "Shadow Rush",
      "zh-hant": "Shadow Rush",
      "en": "Shadow Rush",
      "ja": "ダークラッシュ"
    },
    "type": "shadow",
    "category": "physical",
    "power": 55,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10002": {
    "resourceType": "move",
    "id": 10002,
    "slug": "shadow-blast",
    "calcMoveName": "Shadow Blast",
    "names": {
      "zh-hans": "Shadow Blast",
      "zh-hant": "Shadow Blast",
      "en": "Shadow Blast",
      "ja": "ダークブラスト"
    },
    "type": "shadow",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10003": {
    "resourceType": "move",
    "id": 10003,
    "slug": "shadow-blitz",
    "calcMoveName": "Shadow Blitz",
    "names": {
      "zh-hans": "Shadow Blitz",
      "zh-hant": "Shadow Blitz",
      "en": "Shadow Blitz",
      "ja": "ダークアタック"
    },
    "type": "shadow",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10004": {
    "resourceType": "move",
    "id": 10004,
    "slug": "shadow-bolt",
    "calcMoveName": "Shadow Bolt",
    "names": {
      "zh-hans": "Shadow Bolt",
      "zh-hant": "Shadow Bolt",
      "en": "Shadow Bolt",
      "ja": "ダークサンダー"
    },
    "type": "shadow",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10005": {
    "resourceType": "move",
    "id": 10005,
    "slug": "shadow-break",
    "calcMoveName": "Shadow Break",
    "names": {
      "zh-hans": "Shadow Break",
      "zh-hant": "Shadow Break",
      "en": "Shadow Break",
      "ja": "ダークブレイク"
    },
    "type": "shadow",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10006": {
    "resourceType": "move",
    "id": 10006,
    "slug": "shadow-chill",
    "calcMoveName": "Shadow Chill",
    "names": {
      "zh-hans": "Shadow Chill",
      "zh-hant": "Shadow Chill",
      "en": "Shadow Chill",
      "ja": "ダークフリーズ"
    },
    "type": "shadow",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10007": {
    "resourceType": "move",
    "id": 10007,
    "slug": "shadow-end",
    "calcMoveName": "Shadow End",
    "names": {
      "zh-hans": "Shadow End",
      "zh-hant": "Shadow End",
      "en": "Shadow End",
      "ja": "ダークエンド"
    },
    "type": "shadow",
    "category": "physical",
    "power": 120,
    "accuracy": 60,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10008": {
    "resourceType": "move",
    "id": 10008,
    "slug": "shadow-fire",
    "calcMoveName": "Shadow Fire",
    "names": {
      "zh-hans": "Shadow Fire",
      "zh-hant": "Shadow Fire",
      "en": "Shadow Fire",
      "ja": "ダークファイア"
    },
    "type": "shadow",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "selected-pokemon",
    "isSpread": false
  },
  "10009": {
    "resourceType": "move",
    "id": 10009,
    "slug": "shadow-rave",
    "calcMoveName": "Shadow Rave",
    "names": {
      "zh-hans": "Shadow Rave",
      "zh-hant": "Shadow Rave",
      "en": "Shadow Rave",
      "ja": "ダークレイブ"
    },
    "type": "shadow",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "opponents-field",
    "isSpread": false
  },
  "10010": {
    "resourceType": "move",
    "id": 10010,
    "slug": "shadow-storm",
    "calcMoveName": "Shadow Storm",
    "names": {
      "zh-hans": "Shadow Storm",
      "zh-hant": "Shadow Storm",
      "en": "Shadow Storm",
      "ja": "ダークストーム"
    },
    "type": "shadow",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "opponents-field",
    "isSpread": false
  },
  "10011": {
    "resourceType": "move",
    "id": 10011,
    "slug": "shadow-wave",
    "calcMoveName": "Shadow Wave",
    "names": {
      "zh-hans": "Shadow Wave",
      "zh-hant": "Shadow Wave",
      "en": "Shadow Wave",
      "ja": "ダークウェーブ"
    },
    "type": "shadow",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "opponents-field",
    "isSpread": false
  },
  "10012": {
    "resourceType": "move",
    "id": 10012,
    "slug": "shadow-down",
    "calcMoveName": "Shadow Down",
    "names": {
      "zh-hans": "Shadow Down",
      "zh-hant": "Shadow Down",
      "en": "Shadow Down",
      "ja": "ダークダウン"
    },
    "type": "shadow",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "opponents-field",
    "isSpread": false
  },
  "10013": {
    "resourceType": "move",
    "id": 10013,
    "slug": "shadow-half",
    "calcMoveName": "Shadow Half",
    "names": {
      "zh-hans": "Shadow Half",
      "zh-hant": "Shadow Half",
      "en": "Shadow Half",
      "ja": "ダークハーフ"
    },
    "type": "shadow",
    "category": "special",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "entire-field",
    "isSpread": true
  },
  "10014": {
    "resourceType": "move",
    "id": 10014,
    "slug": "shadow-hold",
    "calcMoveName": "Shadow Hold",
    "names": {
      "zh-hans": "Shadow Hold",
      "zh-hant": "Shadow Hold",
      "en": "Shadow Hold",
      "ja": "ダークホールド"
    },
    "type": "shadow",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "opponents-field",
    "isSpread": false
  },
  "10015": {
    "resourceType": "move",
    "id": 10015,
    "slug": "shadow-mist",
    "calcMoveName": "Shadow Mist",
    "names": {
      "zh-hans": "Shadow Mist",
      "zh-hant": "Shadow Mist",
      "en": "Shadow Mist",
      "ja": "ダークミスト"
    },
    "type": "shadow",
    "category": "status",
    "power": null,
    "accuracy": 100,
    "damageKind": "unique",
    "target": "opponents-field",
    "isSpread": false
  },
  "10016": {
    "resourceType": "move",
    "id": 10016,
    "slug": "shadow-panic",
    "calcMoveName": "Shadow Panic",
    "names": {
      "zh-hans": "Shadow Panic",
      "zh-hant": "Shadow Panic",
      "en": "Shadow Panic",
      "ja": "ダークパニック"
    },
    "type": "shadow",
    "category": "status",
    "power": null,
    "accuracy": 90,
    "damageKind": "unique",
    "target": "opponents-field",
    "isSpread": false
  },
  "10017": {
    "resourceType": "move",
    "id": 10017,
    "slug": "shadow-shed",
    "calcMoveName": "Shadow Shed",
    "names": {
      "zh-hans": "Shadow Shed",
      "zh-hant": "Shadow Shed",
      "en": "Shadow Shed",
      "ja": "ダークリムーブ"
    },
    "type": "shadow",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "entire-field",
    "isSpread": true
  },
  "10018": {
    "resourceType": "move",
    "id": 10018,
    "slug": "shadow-sky",
    "calcMoveName": "Shadow Sky",
    "names": {
      "zh-hans": "Shadow Sky",
      "zh-hant": "Shadow Sky",
      "en": "Shadow Sky",
      "ja": "ダークウェザー"
    },
    "type": "shadow",
    "category": "status",
    "power": null,
    "accuracy": null,
    "damageKind": "unique",
    "target": "entire-field",
    "isSpread": true
  }
} as const satisfies Record<UpstreamResourceId, NormalizedMove>

import type { NormalizedHeldItem, UpstreamResourceId } from "../types"

export const GENERATED_HELD_ITEMS = {
  "112": {
    "resourceType": "item",
    "id": 112,
    "slug": "adamant-orb",
    "names": {
      "zh-hans": "金刚宝珠",
      "zh-hant": "金剛寶珠",
      "en": "Adamant Orb",
      "ja": "こんごうだま"
    },
    "spriteFilename": "adamant-orb.png",
    "spriteSourcePath": "sprites/items/adamant-orb.png"
  },
  "113": {
    "resourceType": "item",
    "id": 113,
    "slug": "lustrous-orb",
    "names": {
      "zh-hans": "白玉宝珠",
      "zh-hant": "白玉寶珠",
      "en": "Lustrous Orb",
      "ja": "しらたま"
    },
    "spriteFilename": "lustrous-orb.png",
    "spriteSourcePath": "sprites/items/lustrous-orb.png"
  },
  "161": {
    "resourceType": "item",
    "id": 161,
    "slug": "occa-berry",
    "names": {
      "zh-hans": "巧可果",
      "zh-hant": "巧可果",
      "en": "Occa Berry",
      "ja": "オッカのみ"
    },
    "spriteFilename": "occa-berry.png",
    "spriteSourcePath": "sprites/items/occa-berry.png"
  },
  "162": {
    "resourceType": "item",
    "id": 162,
    "slug": "passho-berry",
    "names": {
      "zh-hans": "千香果",
      "zh-hant": "千香果",
      "en": "Passho Berry",
      "ja": "イトケのみ"
    },
    "spriteFilename": "passho-berry.png",
    "spriteSourcePath": "sprites/items/passho-berry.png"
  },
  "163": {
    "resourceType": "item",
    "id": 163,
    "slug": "wacan-berry",
    "names": {
      "zh-hans": "烛木果",
      "zh-hant": "燭木果",
      "en": "Wacan Berry",
      "ja": "ソクノのみ"
    },
    "spriteFilename": "wacan-berry.png",
    "spriteSourcePath": "sprites/items/wacan-berry.png"
  },
  "164": {
    "resourceType": "item",
    "id": 164,
    "slug": "rindo-berry",
    "names": {
      "zh-hans": "罗子果",
      "zh-hant": "羅子果",
      "en": "Rindo Berry",
      "ja": "リンドのみ"
    },
    "spriteFilename": "rindo-berry.png",
    "spriteSourcePath": "sprites/items/rindo-berry.png"
  },
  "165": {
    "resourceType": "item",
    "id": 165,
    "slug": "yache-berry",
    "names": {
      "zh-hans": "番荔果",
      "zh-hant": "番荔果",
      "en": "Yache Berry",
      "ja": "ヤチェのみ"
    },
    "spriteFilename": "yache-berry.png",
    "spriteSourcePath": "sprites/items/yache-berry.png"
  },
  "166": {
    "resourceType": "item",
    "id": 166,
    "slug": "chople-berry",
    "names": {
      "zh-hans": "莲蒲果",
      "zh-hant": "蓮蒲果",
      "en": "Chople Berry",
      "ja": "ヨプのみ"
    },
    "spriteFilename": "chople-berry.png",
    "spriteSourcePath": "sprites/items/chople-berry.png"
  },
  "167": {
    "resourceType": "item",
    "id": 167,
    "slug": "kebia-berry",
    "names": {
      "zh-hans": "通通果",
      "zh-hant": "通通果",
      "en": "Kebia Berry",
      "ja": "ビアーのみ"
    },
    "spriteFilename": "kebia-berry.png",
    "spriteSourcePath": "sprites/items/kebia-berry.png"
  },
  "168": {
    "resourceType": "item",
    "id": 168,
    "slug": "shuca-berry",
    "names": {
      "zh-hans": "腰木果",
      "zh-hant": "腰木果",
      "en": "Shuca Berry",
      "ja": "シュカのみ"
    },
    "spriteFilename": "shuca-berry.png",
    "spriteSourcePath": "sprites/items/shuca-berry.png"
  },
  "169": {
    "resourceType": "item",
    "id": 169,
    "slug": "coba-berry",
    "names": {
      "zh-hans": "棱瓜果",
      "zh-hant": "稜瓜果",
      "en": "Coba Berry",
      "ja": "バコウのみ"
    },
    "spriteFilename": "coba-berry.png",
    "spriteSourcePath": "sprites/items/coba-berry.png"
  },
  "170": {
    "resourceType": "item",
    "id": 170,
    "slug": "payapa-berry",
    "names": {
      "zh-hans": "福禄果",
      "zh-hant": "福祿果",
      "en": "Payapa Berry",
      "ja": "ウタンのみ"
    },
    "spriteFilename": "payapa-berry.png",
    "spriteSourcePath": "sprites/items/payapa-berry.png"
  },
  "171": {
    "resourceType": "item",
    "id": 171,
    "slug": "tanga-berry",
    "names": {
      "zh-hans": "扁樱果",
      "zh-hant": "扁櫻果",
      "en": "Tanga Berry",
      "ja": "タンガのみ"
    },
    "spriteFilename": "tanga-berry.png",
    "spriteSourcePath": "sprites/items/tanga-berry.png"
  },
  "172": {
    "resourceType": "item",
    "id": 172,
    "slug": "charti-berry",
    "names": {
      "zh-hans": "草蚕果",
      "zh-hant": "草蠶果",
      "en": "Charti Berry",
      "ja": "ヨロギのみ"
    },
    "spriteFilename": "charti-berry.png",
    "spriteSourcePath": "sprites/items/charti-berry.png"
  },
  "173": {
    "resourceType": "item",
    "id": 173,
    "slug": "kasib-berry",
    "names": {
      "zh-hans": "佛柑果",
      "zh-hant": "佛柑果",
      "en": "Kasib Berry",
      "ja": "カシブのみ"
    },
    "spriteFilename": "kasib-berry.png",
    "spriteSourcePath": "sprites/items/kasib-berry.png"
  },
  "174": {
    "resourceType": "item",
    "id": 174,
    "slug": "haban-berry",
    "names": {
      "zh-hans": "莓榴果",
      "zh-hant": "莓榴果",
      "en": "Haban Berry",
      "ja": "ハバンのみ"
    },
    "spriteFilename": "haban-berry.png",
    "spriteSourcePath": "sprites/items/haban-berry.png"
  },
  "175": {
    "resourceType": "item",
    "id": 175,
    "slug": "colbur-berry",
    "names": {
      "zh-hans": "刺耳果",
      "zh-hant": "刺耳果",
      "en": "Colbur Berry",
      "ja": "ナモのみ"
    },
    "spriteFilename": "colbur-berry.png",
    "spriteSourcePath": "sprites/items/colbur-berry.png"
  },
  "176": {
    "resourceType": "item",
    "id": 176,
    "slug": "babiri-berry",
    "names": {
      "zh-hans": "霹霹果",
      "zh-hant": "霹霹果",
      "en": "Babiri Berry",
      "ja": "リリバのみ"
    },
    "spriteFilename": "babiri-berry.png",
    "spriteSourcePath": "sprites/items/babiri-berry.png"
  },
  "177": {
    "resourceType": "item",
    "id": 177,
    "slug": "chilan-berry",
    "names": {
      "zh-hans": "灯浆果",
      "zh-hant": "燈漿果",
      "en": "Chilan Berry",
      "ja": "ホズのみ"
    },
    "spriteFilename": "chilan-berry.png",
    "spriteSourcePath": "sprites/items/chilan-berry.png"
  },
  "190": {
    "resourceType": "item",
    "id": 190,
    "slug": "bright-powder",
    "names": {
      "zh-hans": "光粉",
      "zh-hant": "光粉",
      "en": "Bright Powder",
      "ja": "ひかりのこな"
    },
    "spriteFilename": "bright-powder.png",
    "spriteSourcePath": "sprites/items/bright-powder.png"
  },
  "197": {
    "resourceType": "item",
    "id": 197,
    "slug": "choice-band",
    "names": {
      "zh-hans": "讲究头带",
      "zh-hant": "講究頭帶",
      "en": "Choice Band",
      "ja": "こだわりハチマキ"
    },
    "spriteFilename": "choice-band.png",
    "spriteSourcePath": "sprites/items/choice-band.png"
  },
  "199": {
    "resourceType": "item",
    "id": 199,
    "slug": "silver-powder",
    "names": {
      "zh-hans": "银粉",
      "zh-hant": "銀粉",
      "en": "Silver Powder",
      "ja": "ぎんのこな"
    },
    "spriteFilename": "silver-powder.png",
    "spriteSourcePath": "sprites/items/silver-powder.png"
  },
  "202": {
    "resourceType": "item",
    "id": 202,
    "slug": "soul-dew",
    "names": {
      "zh-hans": "心之水滴",
      "zh-hant": "心之水滴",
      "en": "Soul Dew",
      "ja": "こころのしずく"
    },
    "spriteFilename": "soul-dew.png",
    "spriteSourcePath": "sprites/items/soul-dew.png"
  },
  "203": {
    "resourceType": "item",
    "id": 203,
    "slug": "deep-sea-tooth",
    "names": {
      "zh-hans": "深海之牙",
      "zh-hant": "深海之牙",
      "en": "Deep Sea Tooth",
      "ja": "しんかいのキバ"
    },
    "spriteFilename": "deep-sea-tooth.png",
    "spriteSourcePath": "sprites/items/deep-sea-tooth.png"
  },
  "204": {
    "resourceType": "item",
    "id": 204,
    "slug": "deep-sea-scale",
    "names": {
      "zh-hans": "深海鳞片",
      "zh-hant": "深海鱗片",
      "en": "Deep Sea Scale",
      "ja": "しんかいのウロコ"
    },
    "spriteFilename": "deep-sea-scale.png",
    "spriteSourcePath": "sprites/items/deep-sea-scale.png"
  },
  "209": {
    "resourceType": "item",
    "id": 209,
    "slug": "scope-lens",
    "names": {
      "zh-hans": "焦点镜",
      "zh-hant": "焦點鏡",
      "en": "Scope Lens",
      "ja": "ピントレンズ"
    },
    "spriteFilename": "scope-lens.png",
    "spriteSourcePath": "sprites/items/scope-lens.png"
  },
  "210": {
    "resourceType": "item",
    "id": 210,
    "slug": "metal-coat",
    "names": {
      "zh-hans": "金属膜",
      "zh-hant": "金屬膜",
      "en": "Metal Coat",
      "ja": "メタルコート"
    },
    "spriteFilename": "metal-coat.png",
    "spriteSourcePath": "sprites/items/metal-coat.png"
  },
  "213": {
    "resourceType": "item",
    "id": 213,
    "slug": "light-ball",
    "names": {
      "zh-hans": "电气球",
      "zh-hant": "電氣球",
      "en": "Light Ball",
      "ja": "でんきだま"
    },
    "spriteFilename": "light-ball.png",
    "spriteSourcePath": "sprites/items/light-ball.png"
  },
  "214": {
    "resourceType": "item",
    "id": 214,
    "slug": "soft-sand",
    "names": {
      "zh-hans": "柔软沙子",
      "zh-hant": "柔軟沙子",
      "en": "Soft Sand",
      "ja": "やわらかいすな"
    },
    "spriteFilename": "soft-sand.png",
    "spriteSourcePath": "sprites/items/soft-sand.png"
  },
  "215": {
    "resourceType": "item",
    "id": 215,
    "slug": "hard-stone",
    "names": {
      "zh-hans": "硬石头",
      "zh-hant": "硬石頭",
      "en": "Hard Stone",
      "ja": "かたいいし"
    },
    "spriteFilename": "hard-stone.png",
    "spriteSourcePath": "sprites/items/hard-stone.png"
  },
  "216": {
    "resourceType": "item",
    "id": 216,
    "slug": "miracle-seed",
    "names": {
      "zh-hans": "奇迹种子",
      "zh-hant": "奇跡種子",
      "en": "Miracle Seed",
      "ja": "きせきのタネ"
    },
    "spriteFilename": "miracle-seed.png",
    "spriteSourcePath": "sprites/items/miracle-seed.png"
  },
  "217": {
    "resourceType": "item",
    "id": 217,
    "slug": "black-glasses",
    "names": {
      "zh-hans": "黑色眼镜",
      "zh-hant": "黑色眼鏡",
      "en": "Black Glasses",
      "ja": "くろいメガネ"
    },
    "spriteFilename": "black-glasses.png",
    "spriteSourcePath": "sprites/items/black-glasses.png"
  },
  "218": {
    "resourceType": "item",
    "id": 218,
    "slug": "black-belt",
    "names": {
      "zh-hans": "黑带",
      "zh-hant": "黑帶",
      "en": "Black Belt",
      "ja": "くろおび"
    },
    "spriteFilename": "black-belt.png",
    "spriteSourcePath": "sprites/items/black-belt.png"
  },
  "219": {
    "resourceType": "item",
    "id": 219,
    "slug": "magnet",
    "names": {
      "zh-hans": "磁铁",
      "zh-hant": "磁鐵",
      "en": "Magnet",
      "ja": "じしゃく"
    },
    "spriteFilename": "magnet.png",
    "spriteSourcePath": "sprites/items/magnet.png"
  },
  "220": {
    "resourceType": "item",
    "id": 220,
    "slug": "mystic-water",
    "names": {
      "zh-hans": "神秘水滴",
      "zh-hant": "神秘水滴",
      "en": "Mystic Water",
      "ja": "しんぴのしずく"
    },
    "spriteFilename": "mystic-water.png",
    "spriteSourcePath": "sprites/items/mystic-water.png"
  },
  "221": {
    "resourceType": "item",
    "id": 221,
    "slug": "sharp-beak",
    "names": {
      "zh-hans": "锐利鸟嘴",
      "zh-hant": "銳利鳥嘴",
      "en": "Sharp Beak",
      "ja": "するどいくちばし"
    },
    "spriteFilename": "sharp-beak.png",
    "spriteSourcePath": "sprites/items/sharp-beak.png"
  },
  "222": {
    "resourceType": "item",
    "id": 222,
    "slug": "poison-barb",
    "names": {
      "zh-hans": "毒针",
      "zh-hant": "毒針",
      "en": "Poison Barb",
      "ja": "どくバリ"
    },
    "spriteFilename": "poison-barb.png",
    "spriteSourcePath": "sprites/items/poison-barb.png"
  },
  "223": {
    "resourceType": "item",
    "id": 223,
    "slug": "never-melt-ice",
    "names": {
      "zh-hans": "不融冰",
      "zh-hant": "不融冰",
      "en": "Never-Melt Ice",
      "ja": "とけないこおり"
    },
    "spriteFilename": "never-melt-ice.png",
    "spriteSourcePath": "sprites/items/never-melt-ice.png"
  },
  "224": {
    "resourceType": "item",
    "id": 224,
    "slug": "spell-tag",
    "names": {
      "zh-hans": "诅咒之符",
      "zh-hant": "詛咒之符",
      "en": "Spell Tag",
      "ja": "のろいのおふだ"
    },
    "spriteFilename": "spell-tag.png",
    "spriteSourcePath": "sprites/items/spell-tag.png"
  },
  "225": {
    "resourceType": "item",
    "id": 225,
    "slug": "twisted-spoon",
    "names": {
      "zh-hans": "弯曲的汤匙",
      "zh-hant": "彎曲的湯匙",
      "en": "Twisted Spoon",
      "ja": "まがったスプーン"
    },
    "spriteFilename": "twisted-spoon.png",
    "spriteSourcePath": "sprites/items/twisted-spoon.png"
  },
  "226": {
    "resourceType": "item",
    "id": 226,
    "slug": "charcoal",
    "names": {
      "zh-hans": "木炭",
      "zh-hant": "木炭",
      "en": "Charcoal",
      "ja": "もくたん"
    },
    "spriteFilename": "charcoal.png",
    "spriteSourcePath": "sprites/items/charcoal.png"
  },
  "227": {
    "resourceType": "item",
    "id": 227,
    "slug": "dragon-fang",
    "names": {
      "zh-hans": "龙之牙",
      "zh-hant": "龍之牙",
      "en": "Dragon Fang",
      "ja": "りゅうのキバ"
    },
    "spriteFilename": "dragon-fang.png",
    "spriteSourcePath": "sprites/items/dragon-fang.png"
  },
  "228": {
    "resourceType": "item",
    "id": 228,
    "slug": "silk-scarf",
    "names": {
      "zh-hans": "丝绸围巾",
      "zh-hant": "絲綢圍巾",
      "en": "Silk Scarf",
      "ja": "シルクのスカーフ"
    },
    "spriteFilename": "silk-scarf.png",
    "spriteSourcePath": "sprites/items/silk-scarf.png"
  },
  "231": {
    "resourceType": "item",
    "id": 231,
    "slug": "sea-incense",
    "names": {
      "zh-hans": "海潮薰香",
      "zh-hant": "海潮薰香",
      "en": "Sea Incense",
      "ja": "うしおのおこう"
    },
    "spriteFilename": "sea-incense.png",
    "spriteSourcePath": "sprites/items/sea-incense.png"
  },
  "232": {
    "resourceType": "item",
    "id": 232,
    "slug": "lax-incense",
    "names": {
      "zh-hans": "悠闲薰香",
      "zh-hant": "悠閒薰香",
      "en": "Lax Incense",
      "ja": "のんきのおこう"
    },
    "spriteFilename": "lax-incense.png",
    "spriteSourcePath": "sprites/items/lax-incense.png"
  },
  "233": {
    "resourceType": "item",
    "id": 233,
    "slug": "lucky-punch",
    "names": {
      "zh-hans": "吉利拳",
      "zh-hant": "吉利拳",
      "en": "Lucky Punch",
      "ja": "ラッキーパンチ"
    },
    "spriteFilename": "lucky-punch.png",
    "spriteSourcePath": "sprites/items/lucky-punch.png"
  },
  "235": {
    "resourceType": "item",
    "id": 235,
    "slug": "thick-club",
    "names": {
      "zh-hans": "粗骨头",
      "zh-hant": "粗骨頭",
      "en": "Thick Club",
      "ja": "ふといホネ"
    },
    "spriteFilename": "thick-club.png",
    "spriteSourcePath": "sprites/items/thick-club.png"
  },
  "236": {
    "resourceType": "item",
    "id": 236,
    "slug": "stick",
    "names": {
      "zh-hans": "大葱",
      "zh-hant": "大蔥",
      "en": "Leek",
      "ja": "ながねぎ"
    },
    "spriteFilename": "stick.png",
    "spriteSourcePath": "sprites/items/stick.png"
  },
  "242": {
    "resourceType": "item",
    "id": 242,
    "slug": "wide-lens",
    "names": {
      "zh-hans": "广角镜",
      "zh-hant": "廣角鏡",
      "en": "Wide Lens",
      "ja": "こうかくレンズ"
    },
    "spriteFilename": "wide-lens.png",
    "spriteSourcePath": "sprites/items/wide-lens.png"
  },
  "243": {
    "resourceType": "item",
    "id": 243,
    "slug": "muscle-band",
    "names": {
      "zh-hans": "力量头带",
      "zh-hant": "力量頭帶",
      "en": "Muscle Band",
      "ja": "ちからのハチマキ"
    },
    "spriteFilename": "muscle-band.png",
    "spriteSourcePath": "sprites/items/muscle-band.png"
  },
  "244": {
    "resourceType": "item",
    "id": 244,
    "slug": "wise-glasses",
    "names": {
      "zh-hans": "博识眼镜",
      "zh-hant": "博識眼鏡",
      "en": "Wise Glasses",
      "ja": "ものしりメガネ"
    },
    "spriteFilename": "wise-glasses.png",
    "spriteSourcePath": "sprites/items/wise-glasses.png"
  },
  "245": {
    "resourceType": "item",
    "id": 245,
    "slug": "expert-belt",
    "names": {
      "zh-hans": "达人带",
      "zh-hant": "達人帶",
      "en": "Expert Belt",
      "ja": "たつじんのおび"
    },
    "spriteFilename": "expert-belt.png",
    "spriteSourcePath": "sprites/items/expert-belt.png"
  },
  "247": {
    "resourceType": "item",
    "id": 247,
    "slug": "life-orb",
    "names": {
      "zh-hans": "生命宝珠",
      "zh-hant": "生命寶珠",
      "en": "Life Orb",
      "ja": "いのちのたま"
    },
    "spriteFilename": "life-orb.png",
    "spriteSourcePath": "sprites/items/life-orb.png"
  },
  "274": {
    "resourceType": "item",
    "id": 274,
    "slug": "choice-specs",
    "names": {
      "zh-hans": "讲究眼镜",
      "zh-hant": "講究眼鏡",
      "en": "Choice Specs",
      "ja": "こだわりメガネ"
    },
    "spriteFilename": "choice-specs.png",
    "spriteSourcePath": "sprites/items/choice-specs.png"
  },
  "275": {
    "resourceType": "item",
    "id": 275,
    "slug": "flame-plate",
    "names": {
      "zh-hans": "火球石板",
      "zh-hant": "火球石板",
      "en": "Flame Plate",
      "ja": "ひのたまプレート"
    },
    "spriteFilename": "flame-plate.png",
    "spriteSourcePath": "sprites/items/flame-plate.png"
  },
  "276": {
    "resourceType": "item",
    "id": 276,
    "slug": "splash-plate",
    "names": {
      "zh-hans": "水滴石板",
      "zh-hant": "水滴石板",
      "en": "Splash Plate",
      "ja": "しずくプレート"
    },
    "spriteFilename": "splash-plate.png",
    "spriteSourcePath": "sprites/items/splash-plate.png"
  },
  "277": {
    "resourceType": "item",
    "id": 277,
    "slug": "zap-plate",
    "names": {
      "zh-hans": "雷电石板",
      "zh-hant": "雷電石板",
      "en": "Zap Plate",
      "ja": "いかずちプレート"
    },
    "spriteFilename": "zap-plate.png",
    "spriteSourcePath": "sprites/items/zap-plate.png"
  },
  "278": {
    "resourceType": "item",
    "id": 278,
    "slug": "meadow-plate",
    "names": {
      "zh-hans": "碧绿石板",
      "zh-hant": "碧綠石板",
      "en": "Meadow Plate",
      "ja": "みどりのプレート"
    },
    "spriteFilename": "meadow-plate.png",
    "spriteSourcePath": "sprites/items/meadow-plate.png"
  },
  "279": {
    "resourceType": "item",
    "id": 279,
    "slug": "icicle-plate",
    "names": {
      "zh-hans": "冰柱石板",
      "zh-hant": "冰柱石板",
      "en": "Icicle Plate",
      "ja": "つららのプレート"
    },
    "spriteFilename": "icicle-plate.png",
    "spriteSourcePath": "sprites/items/icicle-plate.png"
  },
  "280": {
    "resourceType": "item",
    "id": 280,
    "slug": "fist-plate",
    "names": {
      "zh-hans": "拳头石板",
      "zh-hant": "拳頭石板",
      "en": "Fist Plate",
      "ja": "こぶしのプレート"
    },
    "spriteFilename": "fist-plate.png",
    "spriteSourcePath": "sprites/items/fist-plate.png"
  },
  "281": {
    "resourceType": "item",
    "id": 281,
    "slug": "toxic-plate",
    "names": {
      "zh-hans": "剧毒石板",
      "zh-hant": "劇毒石板",
      "en": "Toxic Plate",
      "ja": "もうどくプレート"
    },
    "spriteFilename": "toxic-plate.png",
    "spriteSourcePath": "sprites/items/toxic-plate.png"
  },
  "282": {
    "resourceType": "item",
    "id": 282,
    "slug": "earth-plate",
    "names": {
      "zh-hans": "大地石板",
      "zh-hant": "大地石板",
      "en": "Earth Plate",
      "ja": "だいちのプレート"
    },
    "spriteFilename": "earth-plate.png",
    "spriteSourcePath": "sprites/items/earth-plate.png"
  },
  "283": {
    "resourceType": "item",
    "id": 283,
    "slug": "sky-plate",
    "names": {
      "zh-hans": "蓝天石板",
      "zh-hant": "藍天石板",
      "en": "Sky Plate",
      "ja": "あおぞらプレート"
    },
    "spriteFilename": "sky-plate.png",
    "spriteSourcePath": "sprites/items/sky-plate.png"
  },
  "284": {
    "resourceType": "item",
    "id": 284,
    "slug": "mind-plate",
    "names": {
      "zh-hans": "神奇石板",
      "zh-hant": "神奇石板",
      "en": "Mind Plate",
      "ja": "ふしぎのプレート"
    },
    "spriteFilename": "mind-plate.png",
    "spriteSourcePath": "sprites/items/mind-plate.png"
  },
  "285": {
    "resourceType": "item",
    "id": 285,
    "slug": "insect-plate",
    "names": {
      "zh-hans": "玉虫石板",
      "zh-hant": "玉蟲石板",
      "en": "Insect Plate",
      "ja": "たまむしプレート"
    },
    "spriteFilename": "insect-plate.png",
    "spriteSourcePath": "sprites/items/insect-plate.png"
  },
  "286": {
    "resourceType": "item",
    "id": 286,
    "slug": "stone-plate",
    "names": {
      "zh-hans": "岩石石板",
      "zh-hant": "岩石石板",
      "en": "Stone Plate",
      "ja": "がんせきプレート"
    },
    "spriteFilename": "stone-plate.png",
    "spriteSourcePath": "sprites/items/stone-plate.png"
  },
  "287": {
    "resourceType": "item",
    "id": 287,
    "slug": "spooky-plate",
    "names": {
      "zh-hans": "妖怪石板",
      "zh-hant": "妖怪石板",
      "en": "Spooky Plate",
      "ja": "もののけプレート"
    },
    "spriteFilename": "spooky-plate.png",
    "spriteSourcePath": "sprites/items/spooky-plate.png"
  },
  "288": {
    "resourceType": "item",
    "id": 288,
    "slug": "draco-plate",
    "names": {
      "zh-hans": "龙之石板",
      "zh-hant": "龍之石板",
      "en": "Draco Plate",
      "ja": "りゅうのプレート"
    },
    "spriteFilename": "draco-plate.png",
    "spriteSourcePath": "sprites/items/draco-plate.png"
  },
  "289": {
    "resourceType": "item",
    "id": 289,
    "slug": "dread-plate",
    "names": {
      "zh-hans": "恶颜石板",
      "zh-hant": "惡顏石板",
      "en": "Dread Plate",
      "ja": "こわもてプレート"
    },
    "spriteFilename": "dread-plate.png",
    "spriteSourcePath": "sprites/items/dread-plate.png"
  },
  "290": {
    "resourceType": "item",
    "id": 290,
    "slug": "iron-plate",
    "names": {
      "zh-hans": "钢铁石板",
      "zh-hant": "鋼鐵石板",
      "en": "Iron Plate",
      "ja": "こうてつプレート"
    },
    "spriteFilename": "iron-plate.png",
    "spriteSourcePath": "sprites/items/iron-plate.png"
  },
  "291": {
    "resourceType": "item",
    "id": 291,
    "slug": "odd-incense",
    "names": {
      "zh-hans": "奇异薰香",
      "zh-hant": "奇異薰香",
      "en": "Odd Incense",
      "ja": "あやしいおこう"
    },
    "spriteFilename": "odd-incense.png",
    "spriteSourcePath": "sprites/items/odd-incense.png"
  },
  "292": {
    "resourceType": "item",
    "id": 292,
    "slug": "rock-incense",
    "names": {
      "zh-hans": "岩石薰香",
      "zh-hant": "岩石薰香",
      "en": "Rock Incense",
      "ja": "がんせきおこう"
    },
    "spriteFilename": "rock-incense.png",
    "spriteSourcePath": "sprites/items/rock-incense.png"
  },
  "294": {
    "resourceType": "item",
    "id": 294,
    "slug": "wave-incense",
    "names": {
      "zh-hans": "涟漪薰香",
      "zh-hant": "漣漪薰香",
      "en": "Wave Incense",
      "ja": "さざなみのおこう"
    },
    "spriteFilename": "wave-incense.png",
    "spriteSourcePath": "sprites/items/wave-incense.png"
  },
  "295": {
    "resourceType": "item",
    "id": 295,
    "slug": "rose-incense",
    "names": {
      "zh-hans": "花朵薰香",
      "zh-hant": "花朵薰香",
      "en": "Rose Incense",
      "ja": "おはなのおこう"
    },
    "spriteFilename": "rose-incense.png",
    "spriteSourcePath": "sprites/items/rose-incense.png"
  },
  "303": {
    "resourceType": "item",
    "id": 303,
    "slug": "razor-claw",
    "names": {
      "zh-hans": "锐利之爪",
      "zh-hant": "銳利之爪",
      "en": "Razor Claw",
      "ja": "するどいツメ"
    },
    "spriteFilename": "razor-claw.png",
    "spriteSourcePath": "sprites/items/razor-claw.png"
  },
  "442": {
    "resourceType": "item",
    "id": 442,
    "slug": "griseous-orb",
    "names": {
      "zh-hans": "白金宝珠",
      "zh-hant": "白金寶珠",
      "en": "Griseous Orb",
      "ja": "はっきんだま"
    },
    "spriteFilename": "griseous-orb.png",
    "spriteSourcePath": "sprites/items/griseous-orb.png"
  },
  "581": {
    "resourceType": "item",
    "id": 581,
    "slug": "eviolite",
    "names": {
      "zh-hans": "进化奇石",
      "zh-hant": "進化奇石",
      "en": "Eviolite",
      "ja": "しんかのきせき"
    },
    "spriteFilename": "eviolite.png",
    "spriteSourcePath": "sprites/items/eviolite.png"
  },
  "683": {
    "resourceType": "item",
    "id": 683,
    "slug": "assault-vest",
    "names": {
      "zh-hans": "突击背心",
      "zh-hant": "突擊背心",
      "en": "Assault Vest",
      "ja": "とつげきチョッキ"
    },
    "spriteFilename": "assault-vest.png",
    "spriteSourcePath": "sprites/items/assault-vest.png"
  },
  "684": {
    "resourceType": "item",
    "id": 684,
    "slug": "pixie-plate",
    "names": {
      "zh-hans": "妖精石板",
      "zh-hant": "妖精石板",
      "en": "Pixie Plate",
      "ja": "せいれいプレート"
    },
    "spriteFilename": "pixie-plate.png",
    "spriteSourcePath": "sprites/items/pixie-plate.png"
  },
  "723": {
    "resourceType": "item",
    "id": 723,
    "slug": "roseli-berry",
    "names": {
      "zh-hans": "洛玫果",
      "zh-hant": "洛玫果",
      "en": "Roseli Berry",
      "ja": "ロゼルのみ"
    },
    "spriteFilename": "roseli-berry.png",
    "spriteSourcePath": "sprites/items/roseli-berry.png"
  },
  "1181": {
    "resourceType": "item",
    "id": 1181,
    "slug": "utility-umbrella",
    "names": {
      "zh-hans": "万能伞",
      "zh-hant": "萬能傘",
      "en": "Utility Umbrella",
      "ja": "ばんのうがさ"
    },
    "spriteFilename": "utility-umbrella.png",
    "spriteSourcePath": "sprites/items/gen8/utility-umbrella.png"
  },
  "2105": {
    "resourceType": "item",
    "id": 2105,
    "slug": "fairy-feather",
    "names": {
      "zh-hans": "Fairy Feather",
      "zh-hant": "Fairy Feather",
      "en": "Fairy Feather",
      "ja": "ようせいのハネ"
    },
    "spriteFilename": "fairy-feather.png",
    "spriteSourcePath": "sprites/items/gen9/fairy-feather.png"
  },
  "2106": {
    "resourceType": "item",
    "id": 2106,
    "slug": "wellspring-mask",
    "names": {
      "zh-hans": "Wellspring Mask",
      "zh-hant": "Wellspring Mask",
      "en": "Wellspring Mask",
      "ja": "いどのめん"
    },
    "spriteFilename": "wellspring-mask.png",
    "spriteSourcePath": "sprites/items/gen9/wellspring-mask.png"
  },
  "2107": {
    "resourceType": "item",
    "id": 2107,
    "slug": "hearthflame-mask",
    "names": {
      "zh-hans": "Hearthflame Mask",
      "zh-hant": "Hearthflame Mask",
      "en": "Hearthflame Mask",
      "ja": "かまどのめん"
    },
    "spriteFilename": "hearthflame-mask.png",
    "spriteSourcePath": "sprites/items/gen9/hearthflame-mask.png"
  },
  "2108": {
    "resourceType": "item",
    "id": 2108,
    "slug": "cornerstone-mask",
    "names": {
      "zh-hans": "Cornerstone Mask",
      "zh-hant": "Cornerstone Mask",
      "en": "Cornerstone Mask",
      "ja": "いしずえのめん"
    },
    "spriteFilename": "cornerstone-mask.png",
    "spriteSourcePath": "sprites/items/gen9/cornerstone-mask.png"
  }
} as const satisfies Record<UpstreamResourceId, NormalizedHeldItem>

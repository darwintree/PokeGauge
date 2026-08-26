import type { NormalizedHeldItem, UpstreamResourceId } from "../types"

export const GENERATED_HELD_ITEMS = {
  "112": {
    "resourceType": "item",
    "id": 112,
    "slug": "adamant-orb",
    "calcItemName": "adamantorb",
    "names": {
      "zh-hans": "金刚宝珠",
      "zh-hant": "金剛寶珠",
      "en": "Adamant Orb",
      "ja": "こんごうだま"
    },
    "descriptions": {
      "zh-hans": "让帝牙卢卡携带的话， 龙和钢属性的招式威力就会提高。 散发着光辉的宝珠。",
      "zh-hant": "讓帝牙盧卡攜帶的話， 龍和鋼屬性的招式威力就會提高。 散發著光輝的寶珠。",
      "en": "A brightly gleaming orb to be held by Dialga. It boosts the power of Dragon- and Steel-type moves when it is held.",
      "ja": "ディアルガに もたせると ドラゴンと はがねタイプの わざの いりょくが あがる ひかり かがやく たま。"
    },
    "spriteSourcePath": "sprites/items/adamant-orb.png"
  },
  "113": {
    "resourceType": "item",
    "id": 113,
    "slug": "lustrous-orb",
    "calcItemName": "lustrousorb",
    "names": {
      "zh-hans": "白玉宝珠",
      "zh-hant": "白玉寶珠",
      "en": "Lustrous Orb",
      "ja": "しらたま"
    },
    "descriptions": {
      "zh-hans": "让帕路奇亚携带的话， 龙和水属性的招式威力就会提高。 散发着美丽光辉的宝珠。",
      "zh-hant": "讓帕路奇亞攜帶的話， 龍和水屬性的招式威力就會提高。 散發著美麗光輝的寶珠。",
      "en": "A beautifully glowing orb to be held by Palkia. It boosts the power of Dragon- and Water-type moves when it is held.",
      "ja": "パルキアに もたせると ドラゴンと みずタイプの わざの いりょくが あがる うつくしく かがやく たま。"
    },
    "spriteSourcePath": "sprites/items/lustrous-orb.png"
  },
  "161": {
    "resourceType": "item",
    "id": 161,
    "slug": "occa-berry",
    "calcItemName": "occaberry",
    "names": {
      "zh-hans": "巧可果",
      "zh-hant": "巧可果",
      "en": "Occa Berry",
      "ja": "オッカのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的火属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的火屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Fire-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの ほのお わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/occa-berry.png"
  },
  "162": {
    "resourceType": "item",
    "id": 162,
    "slug": "passho-berry",
    "calcItemName": "passhoberry",
    "names": {
      "zh-hans": "千香果",
      "zh-hant": "千香果",
      "en": "Passho Berry",
      "ja": "イトケのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的水属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的水屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Water-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの みず わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/passho-berry.png"
  },
  "163": {
    "resourceType": "item",
    "id": 163,
    "slug": "wacan-berry",
    "calcItemName": "wacanberry",
    "names": {
      "zh-hans": "烛木果",
      "zh-hant": "燭木果",
      "en": "Wacan Berry",
      "ja": "ソクノのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的电属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的電屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Electric-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの でんき わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/wacan-berry.png"
  },
  "164": {
    "resourceType": "item",
    "id": 164,
    "slug": "rindo-berry",
    "calcItemName": "rindoberry",
    "names": {
      "zh-hans": "罗子果",
      "zh-hant": "羅子果",
      "en": "Rindo Berry",
      "ja": "リンドのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的草属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的草屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Grass-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの くさ わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/rindo-berry.png"
  },
  "165": {
    "resourceType": "item",
    "id": 165,
    "slug": "yache-berry",
    "calcItemName": "yacheberry",
    "names": {
      "zh-hans": "番荔果",
      "zh-hant": "番荔果",
      "en": "Yache Berry",
      "ja": "ヤチェのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的冰属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的冰屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Ice-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの こおり わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/yache-berry.png"
  },
  "166": {
    "resourceType": "item",
    "id": 166,
    "slug": "chople-berry",
    "calcItemName": "chopleberry",
    "names": {
      "zh-hans": "莲蒲果",
      "zh-hant": "蓮蒲果",
      "en": "Chople Berry",
      "ja": "ヨプのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的格斗属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的格鬥屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Fighting-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの かくとう わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/chople-berry.png"
  },
  "167": {
    "resourceType": "item",
    "id": 167,
    "slug": "kebia-berry",
    "calcItemName": "kebiaberry",
    "names": {
      "zh-hans": "通通果",
      "zh-hant": "通通果",
      "en": "Kebia Berry",
      "ja": "ビアーのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的毒属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的毒屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Poison-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの どく わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/kebia-berry.png"
  },
  "168": {
    "resourceType": "item",
    "id": 168,
    "slug": "shuca-berry",
    "calcItemName": "shucaberry",
    "names": {
      "zh-hans": "腰木果",
      "zh-hant": "腰木果",
      "en": "Shuca Berry",
      "ja": "シュカのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的地面属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的地面屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Ground-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの じめん わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/shuca-berry.png"
  },
  "169": {
    "resourceType": "item",
    "id": 169,
    "slug": "coba-berry",
    "calcItemName": "cobaberry",
    "names": {
      "zh-hans": "棱瓜果",
      "zh-hant": "稜瓜果",
      "en": "Coba Berry",
      "ja": "バコウのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的飞行属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的飛行屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Flying-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの ひこう わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/coba-berry.png"
  },
  "170": {
    "resourceType": "item",
    "id": 170,
    "slug": "payapa-berry",
    "calcItemName": "payapaberry",
    "names": {
      "zh-hans": "福禄果",
      "zh-hant": "福祿果",
      "en": "Payapa Berry",
      "ja": "ウタンのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的超能力属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的超能力屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Psychic-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの エスパー わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/payapa-berry.png"
  },
  "171": {
    "resourceType": "item",
    "id": 171,
    "slug": "tanga-berry",
    "calcItemName": "tangaberry",
    "names": {
      "zh-hans": "扁樱果",
      "zh-hant": "扁櫻果",
      "en": "Tanga Berry",
      "ja": "タンガのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的虫属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的蟲屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Bug-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの むし わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/tanga-berry.png"
  },
  "172": {
    "resourceType": "item",
    "id": 172,
    "slug": "charti-berry",
    "calcItemName": "chartiberry",
    "names": {
      "zh-hans": "草蚕果",
      "zh-hant": "草蠶果",
      "en": "Charti Berry",
      "ja": "ヨロギのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的岩石属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的岩石屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Rock-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの いわ わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/charti-berry.png"
  },
  "173": {
    "resourceType": "item",
    "id": 173,
    "slug": "kasib-berry",
    "calcItemName": "kasibberry",
    "names": {
      "zh-hans": "佛柑果",
      "zh-hant": "佛柑果",
      "en": "Kasib Berry",
      "ja": "カシブのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的幽灵属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的幽靈屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Ghost-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの ゴースト わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/kasib-berry.png"
  },
  "174": {
    "resourceType": "item",
    "id": 174,
    "slug": "haban-berry",
    "calcItemName": "habanberry",
    "names": {
      "zh-hans": "莓榴果",
      "zh-hant": "莓榴果",
      "en": "Haban Berry",
      "ja": "ハバンのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的龙属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的龍屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Dragon-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの ドラゴン わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/haban-berry.png"
  },
  "175": {
    "resourceType": "item",
    "id": 175,
    "slug": "colbur-berry",
    "calcItemName": "colburberry",
    "names": {
      "zh-hans": "刺耳果",
      "zh-hant": "刺耳果",
      "en": "Colbur Berry",
      "ja": "ナモのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的恶属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的惡屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Dark-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの あく わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/colbur-berry.png"
  },
  "176": {
    "resourceType": "item",
    "id": 176,
    "slug": "babiri-berry",
    "calcItemName": "babiriberry",
    "names": {
      "zh-hans": "霹霹果",
      "zh-hant": "霹霹果",
      "en": "Babiri Berry",
      "ja": "リリバのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的钢属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的鋼屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Steel-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの はがね わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/babiri-berry.png"
  },
  "177": {
    "resourceType": "item",
    "id": 177,
    "slug": "chilan-berry",
    "calcItemName": "chilanberry",
    "names": {
      "zh-hans": "灯浆果",
      "zh-hant": "燈漿果",
      "en": "Chilan Berry",
      "ja": "ホズのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到一般属性招式攻击时， 能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到一般屬性招式攻擊時， 能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one Normal-type attack.",
      "ja": "ポケモンに もたせると ノーマル わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/chilan-berry.png"
  },
  "190": {
    "resourceType": "item",
    "id": 190,
    "slug": "bright-powder",
    "calcItemName": "brightpowder",
    "names": {
      "zh-hans": "光粉",
      "zh-hant": "光粉",
      "en": "Bright Powder",
      "ja": "ひかりのこな"
    },
    "descriptions": {
      "zh-hans": "闪闪发光的粉末。 携带后，光芒会迷惑对手， 从而使其招式变得不容易命中。",
      "zh-hant": "閃閃發光的粉末。 攜帶後，光芒會迷惑對手， 進而使其招式變得不容易命中。",
      "en": "An item to be held by a Pokémon. It casts a tricky glare that lowers the opposing Pokémon’s accuracy.",
      "ja": "キラキラ ひかるこな。 もたせると ひかりが あいてを まどわして わざが めいちゅう しにくくなる。"
    },
    "spriteSourcePath": "sprites/items/bright-powder.png"
  },
  "197": {
    "resourceType": "item",
    "id": 197,
    "slug": "choice-band",
    "calcItemName": "choiceband",
    "names": {
      "zh-hans": "讲究头带",
      "zh-hant": "講究頭帶",
      "en": "Choice Band",
      "ja": "こだわりハチマキ"
    },
    "descriptions": {
      "zh-hans": "有点讲究的头带。 虽然携带后攻击会提高， 但只能使出相同的招式。",
      "zh-hant": "有點講究的頭帶。 雖然攜帶後攻擊會提高， 但只能使出相同的招式。",
      "en": "An item to be held by a Pokémon. This curious headband boosts Attack but only allows the use of one move.",
      "ja": "ちょっと こだわった ハチマキ。 もたせると こうげきは あがるが おなじ わざしか だせなくなる。"
    },
    "spriteSourcePath": "sprites/items/choice-band.png"
  },
  "199": {
    "resourceType": "item",
    "id": 199,
    "slug": "silver-powder",
    "calcItemName": "silverpowder",
    "names": {
      "zh-hans": "银粉",
      "zh-hant": "銀粉",
      "en": "Silver Powder",
      "ja": "ぎんのこな"
    },
    "descriptions": {
      "zh-hans": "散发着银色光辉的粉末。 携带后，虫属性的 招式威力就会提高。",
      "zh-hant": "散發著銀色光輝的粉末。 攜帶後，蟲屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a shiny silver powder that will boost the power of Bug-type moves.",
      "ja": "ぎんいろに かがやく こな。 もたせると むしタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/silver-powder.png"
  },
  "202": {
    "resourceType": "item",
    "id": 202,
    "slug": "soul-dew",
    "calcItemName": "souldew",
    "names": {
      "zh-hans": "心之水滴",
      "zh-hant": "心之水滴",
      "en": "Soul Dew",
      "ja": "こころのしずく"
    },
    "descriptions": {
      "zh-hans": "让拉帝欧斯或拉帝亚斯携带后， 超能力和龙属性的招式威力 就会提高的神奇珠子。",
      "zh-hant": "讓拉帝歐斯或拉帝亞斯攜帶後， 超能力和龍屬性的招式威力 就會提高的神奇珠子。",
      "en": "A wondrous orb to be held by either Latios or Latias. It raises the power of Psychic- and Dragon-type moves.",
      "ja": "ラティオスや ラティアスに もたせると エスパーと ドラゴンタイプの わざの いりょくが あがる ふしぎな たま。"
    },
    "spriteSourcePath": "sprites/items/soul-dew.png"
  },
  "203": {
    "resourceType": "item",
    "id": 203,
    "slug": "deep-sea-tooth",
    "calcItemName": "deepseatooth",
    "names": {
      "zh-hans": "深海之牙",
      "zh-hant": "深海之牙",
      "en": "Deep Sea Tooth",
      "ja": "しんかいのキバ"
    },
    "descriptions": {
      "zh-hans": "让珍珠贝携带后， 特攻就会提高的牙齿。 散发着闪亮的银光。",
      "zh-hant": "讓珍珠貝攜帶後， 特攻就會提高的牙齒。 散發著銳利的銀色光芒。",
      "en": "An item to be held by Clamperl. This fang gleams a sharp silver and raises the holder’s Sp. Atk stat.",
      "ja": "パールルに もたせると とくこうが あがる キバ。 するどく ぎんいろに ひかる。"
    },
    "spriteSourcePath": "sprites/items/deep-sea-tooth.png"
  },
  "204": {
    "resourceType": "item",
    "id": 204,
    "slug": "deep-sea-scale",
    "calcItemName": "deepseascale",
    "names": {
      "zh-hans": "深海鳞片",
      "zh-hant": "深海鱗片",
      "en": "Deep Sea Scale",
      "ja": "しんかいのウロコ"
    },
    "descriptions": {
      "zh-hans": "让珍珠贝携带后， 特防就会提高的鳞片。 散发着淡淡的粉红色光芒。",
      "zh-hant": "讓珍珠貝攜帶後， 特防就會提高的鱗片。 散發著淡淡的粉紅色光芒。",
      "en": "An item to be held by Clamperl. This scale shines with a faint pink and raises the holder’s Sp. Def stat.",
      "ja": "パールルに もたせると とくぼうが あがる ウロコ。 うすい ピンクいろに ひかる。"
    },
    "spriteSourcePath": "sprites/items/deep-sea-scale.png"
  },
  "209": {
    "resourceType": "item",
    "id": 209,
    "slug": "scope-lens",
    "calcItemName": "scopelens",
    "names": {
      "zh-hans": "焦点镜",
      "zh-hant": "焦點鏡",
      "en": "Scope Lens",
      "ja": "ピントレンズ"
    },
    "descriptions": {
      "zh-hans": "能看见弱点的镜片。 携带它的宝可梦的招式 会变得容易击中要害。",
      "zh-hant": "能看見弱點的鏡片。 攜帶它的寶可夢的招式 會變得容易擊中要害。",
      "en": "An item to be held by a Pokémon. It’s a lens for scoping out weak points. It boosts the holder’s critical-hit ratio.",
      "ja": "じゃくてんが みえる レンズ。 もたせた ポケモンの わざが きゅうしょに あたりやすくなる。"
    },
    "spriteSourcePath": "sprites/items/scope-lens.png"
  },
  "210": {
    "resourceType": "item",
    "id": 210,
    "slug": "metal-coat",
    "calcItemName": "metalcoat",
    "names": {
      "zh-hans": "金属膜",
      "zh-hant": "金屬膜",
      "en": "Metal Coat",
      "ja": "メタルコート"
    },
    "descriptions": {
      "zh-hans": "特殊的金属膜。 携带后，钢属性的 招式威力就会提高。",
      "zh-hant": "特殊的金屬膜。 攜帶後，鋼屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a special metallic film that can boost the power of Steel-type moves.",
      "ja": "とくしゅな きんぞくの まく。 もたせると はがねタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/metal-coat.png"
  },
  "213": {
    "resourceType": "item",
    "id": 213,
    "slug": "light-ball",
    "calcItemName": "lightball",
    "names": {
      "zh-hans": "电气球",
      "zh-hant": "電氣球",
      "en": "Light Ball",
      "ja": "でんきだま"
    },
    "descriptions": {
      "zh-hans": "让皮卡丘携带后， 攻击和特攻的威力 就会提高的神奇之球。",
      "zh-hant": "讓皮卡丘攜帶後， 攻擊和特攻的威力 就會提高的神奇之球。",
      "en": "An item to be held by Pikachu. It’s a puzzling orb that boosts its Attack and Sp. Atk stats.",
      "ja": "ピカチュウに もたせると こうげきと とくこうの いりょくが あがる ふしぎな たま。"
    },
    "spriteSourcePath": "sprites/items/light-ball.png"
  },
  "214": {
    "resourceType": "item",
    "id": 214,
    "slug": "soft-sand",
    "calcItemName": "softsand",
    "names": {
      "zh-hans": "柔软沙子",
      "zh-hant": "柔軟沙子",
      "en": "Soft Sand",
      "ja": "やわらかいすな"
    },
    "descriptions": {
      "zh-hans": "手感细腻的沙子。 携带后，地面属性的 招式威力就会提高。",
      "zh-hant": "手感細緻的沙子。 攜帶後，地面屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a loose, silky sand that boosts the power of Ground-type moves.",
      "ja": "さわると サラサラする すな。 もたせると じめんタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/soft-sand.png"
  },
  "215": {
    "resourceType": "item",
    "id": 215,
    "slug": "hard-stone",
    "calcItemName": "hardstone",
    "names": {
      "zh-hans": "硬石头",
      "zh-hant": "硬石頭",
      "en": "Hard Stone",
      "ja": "かたいいし"
    },
    "descriptions": {
      "zh-hans": "绝对不会裂开的石头。 携带后，岩石属性的 招式威力就会提高。",
      "zh-hant": "絕對不會裂開的石頭。 攜帶後，岩石屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a durable stone that boosts the power of Rock-type moves.",
      "ja": "ぜったいに われない いし。 もたせると いわタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/hard-stone.png"
  },
  "216": {
    "resourceType": "item",
    "id": 216,
    "slug": "miracle-seed",
    "calcItemName": "miracleseed",
    "names": {
      "zh-hans": "奇迹种子",
      "zh-hant": "奇跡種子",
      "en": "Miracle Seed",
      "ja": "きせきのタネ"
    },
    "descriptions": {
      "zh-hans": "孕育生命的种子。 携带后，草属性的 招式威力就会提高。",
      "zh-hant": "蘊藏生命的種子。 攜帶後，草屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a seed imbued with life-force that boosts the power of Grass-type moves.",
      "ja": "せいめいが やどる タネ。 もたせると くさタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/miracle-seed.png"
  },
  "217": {
    "resourceType": "item",
    "id": 217,
    "slug": "black-glasses",
    "calcItemName": "blackglasses",
    "names": {
      "zh-hans": "黑色眼镜",
      "zh-hant": "黑色眼鏡",
      "en": "Black Glasses",
      "ja": "くろいメガネ"
    },
    "descriptions": {
      "zh-hans": "看上去很奇怪的眼镜。 携带后，恶属性的 招式威力就会提高。",
      "zh-hant": "看起來很奇怪的眼鏡。 攜帶後，惡屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a pair of shady-looking glasses that boost the power of Dark-type moves.",
      "ja": "あやしく みえる メガネ。 もたせると あくタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/black-glasses.png"
  },
  "218": {
    "resourceType": "item",
    "id": 218,
    "slug": "black-belt",
    "calcItemName": "blackbelt",
    "names": {
      "zh-hans": "黑带",
      "zh-hant": "黑帶",
      "en": "Black Belt",
      "ja": "くろおび"
    },
    "descriptions": {
      "zh-hans": "能振作精神的带子。 携带后，格斗属性的 招式威力就会提高。",
      "zh-hant": "能振作精神的帶子。 攜帶後，格鬥屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This belt helps the wearer to focus and boosts the power of Fighting-type moves.",
      "ja": "きが ひきしまる おび。 もたせると かくとうタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/black-belt.png"
  },
  "219": {
    "resourceType": "item",
    "id": 219,
    "slug": "magnet",
    "calcItemName": "magnet",
    "names": {
      "zh-hans": "磁铁",
      "zh-hant": "磁鐵",
      "en": "Magnet",
      "ja": "じしゃく"
    },
    "descriptions": {
      "zh-hans": "强力的磁铁。 携带后，电属性的 招式威力就会提高。",
      "zh-hant": "強力的磁鐵。 攜帶後，電屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a powerful magnet that boosts the power of Electric-type moves.",
      "ja": "きょうりょくな じしゃく。 もたせると でんきタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/magnet.png"
  },
  "220": {
    "resourceType": "item",
    "id": 220,
    "slug": "mystic-water",
    "calcItemName": "mysticwater",
    "names": {
      "zh-hans": "神秘水滴",
      "zh-hant": "神秘水滴",
      "en": "Mystic Water",
      "ja": "しんぴのしずく"
    },
    "descriptions": {
      "zh-hans": "水滴形状的宝石。 携带后，水属性的 招式威力就会提高。",
      "zh-hant": "水滴形狀的寶石。 攜帶後，水屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This teardrop-shaped gem boosts the power of Water-type moves.",
      "ja": "しずくの かたちの ほうせき。 もたせると みずタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/mystic-water.png"
  },
  "221": {
    "resourceType": "item",
    "id": 221,
    "slug": "sharp-beak",
    "calcItemName": "sharpbeak",
    "names": {
      "zh-hans": "锐利鸟嘴",
      "zh-hant": "銳利鳥嘴",
      "en": "Sharp Beak",
      "ja": "するどいくちばし"
    },
    "descriptions": {
      "zh-hans": "又长又尖的鸟嘴。 携带后，飞行属性的 招式威力就会提高。",
      "zh-hant": "又長又尖的鳥嘴。 攜帶後，飛行屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a long, sharp beak that boosts the power of Flying-type moves.",
      "ja": "ながく とがった くちばし。 もたせると ひこうタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/sharp-beak.png"
  },
  "222": {
    "resourceType": "item",
    "id": 222,
    "slug": "poison-barb",
    "calcItemName": "poisonbarb",
    "names": {
      "zh-hans": "毒针",
      "zh-hant": "毒針",
      "en": "Poison Barb",
      "ja": "どくバリ"
    },
    "descriptions": {
      "zh-hans": "有毒的小针。 携带后，毒属性的 招式威力就会提高。",
      "zh-hant": "有毒的小針。 攜帶後，毒屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This small, poisonous barb boosts the power of Poison-type moves.",
      "ja": "どくのある ちいさな ハリ。 もたせると どくタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/poison-barb.png"
  },
  "223": {
    "resourceType": "item",
    "id": 223,
    "slug": "never-melt-ice",
    "calcItemName": "nevermeltice",
    "names": {
      "zh-hans": "不融冰",
      "zh-hant": "不融冰",
      "en": "Never-Melt Ice",
      "ja": "とけないこおり"
    },
    "descriptions": {
      "zh-hans": "能隔绝热量的冰。 携带后，冰属性的 招式威力就会提高。",
      "zh-hant": "隔絕熱的冰。 攜帶後，冰屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a heat- repelling piece of ice that boosts the power of Ice-type moves.",
      "ja": "ねつを よせつけない こおり。 もたせると こおりタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/never-melt-ice.png"
  },
  "224": {
    "resourceType": "item",
    "id": 224,
    "slug": "spell-tag",
    "calcItemName": "spelltag",
    "names": {
      "zh-hans": "诅咒之符",
      "zh-hant": "詛咒之符",
      "en": "Spell Tag",
      "ja": "のろいのおふだ"
    },
    "descriptions": {
      "zh-hans": "古怪可怕的咒符。 携带后，幽灵属性的 招式威力就会提高。",
      "zh-hant": "古怪可怕的咒符。 攜帶後，幽靈屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a sinister, eerie tag that boosts the power of Ghost-type moves.",
      "ja": "あやしくて ぶきみな おふだ。 もたせると ゴーストタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/spell-tag.png"
  },
  "225": {
    "resourceType": "item",
    "id": 225,
    "slug": "twisted-spoon",
    "calcItemName": "twistedspoon",
    "names": {
      "zh-hans": "弯曲的汤匙",
      "zh-hant": "彎曲的湯匙",
      "en": "Twisted Spoon",
      "ja": "まがったスプーン"
    },
    "descriptions": {
      "zh-hans": "注入了念力的汤匙。 携带后，超能力属性的 招式威力就会提高。",
      "zh-hant": "注入了念力的湯匙。 攜帶後，超能力屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This spoon is imbued with telekinetic power and boosts Psychic-type moves.",
      "ja": "ねんりきを こめた スプーン。 もたせると エスパータイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/twisted-spoon.png"
  },
  "226": {
    "resourceType": "item",
    "id": 226,
    "slug": "charcoal",
    "calcItemName": "charcoal",
    "names": {
      "zh-hans": "木炭",
      "zh-hant": "木炭",
      "en": "Charcoal",
      "ja": "もくたん"
    },
    "descriptions": {
      "zh-hans": "焚烧用的燃料。 携带后，火属性的 招式威力就会提高。",
      "zh-hant": "燒東西的燃料。 攜帶後，火屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a combustible fuel that boosts the power of Fire-type moves.",
      "ja": "ものを もやす ねんりょう。 もたせると ほのおタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/charcoal.png"
  },
  "227": {
    "resourceType": "item",
    "id": 227,
    "slug": "dragon-fang",
    "calcItemName": "dragonfang",
    "names": {
      "zh-hans": "龙之牙",
      "zh-hant": "龍之牙",
      "en": "Dragon Fang",
      "ja": "りゅうのキバ"
    },
    "descriptions": {
      "zh-hans": "坚硬锐利的牙齿。 携带后，龙属性的 招式威力就会提高。",
      "zh-hant": "堅硬銳利的牙齒。 攜帶後，龍屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This hard and sharp fang boosts the power of Dragon-type moves.",
      "ja": "かたくて するどい キバ。 もたせると ドラゴンタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/dragon-fang.png"
  },
  "228": {
    "resourceType": "item",
    "id": 228,
    "slug": "silk-scarf",
    "calcItemName": "silkscarf",
    "names": {
      "zh-hans": "丝绸围巾",
      "zh-hant": "絲綢圍巾",
      "en": "Silk Scarf",
      "ja": "シルクのスカーフ"
    },
    "descriptions": {
      "zh-hans": "手感不错的围巾。 携带后，一般属性的 招式威力就会提高。",
      "zh-hant": "手感不錯的圍巾。 攜帶後，一般屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. It’s a sumptuous scarf that boosts the power of Normal-type moves.",
      "ja": "はだざわりの よい スカーフ。 もたせると ノーマルタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/silk-scarf.png"
  },
  "231": {
    "resourceType": "item",
    "id": 231,
    "slug": "sea-incense",
    "calcItemName": "seaincense",
    "names": {
      "zh-hans": "海潮薰香",
      "zh-hant": "海潮薰香",
      "en": "Sea Incense",
      "ja": "うしおのおこう"
    },
    "descriptions": {
      "zh-hans": "有着神奇香气的薰香。 携带后，水属性的 招式威力就会提高。",
      "zh-hant": "有著神奇香氣的薰香。 攜帶後，水屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This incense has a curious aroma that boosts the power of Water-type moves.",
      "ja": "ふしぎな かおりの おこう。 もたせると みずタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/sea-incense.png"
  },
  "232": {
    "resourceType": "item",
    "id": 232,
    "slug": "lax-incense",
    "calcItemName": "laxincense",
    "names": {
      "zh-hans": "悠闲薰香",
      "zh-hant": "悠閒薰香",
      "en": "Lax Incense",
      "ja": "のんきのおこう"
    },
    "descriptions": {
      "zh-hans": "携带后，薰香的 神奇香气会迷惑对手， 其招式会变得不容易命中。",
      "zh-hant": "攜帶後，薰香的 神奇香氣會迷惑對手， 其招式會變得不容易命中。",
      "en": "An item to be held by a Pokémon. The beguiling aroma of this incense may cause attacks to miss its holder.",
      "ja": "もたせると おこうの ふしぎな かおりが あいてを まどわせて わざが めいちゅう しにくくなる。"
    },
    "spriteSourcePath": "sprites/items/lax-incense.png"
  },
  "233": {
    "resourceType": "item",
    "id": 233,
    "slug": "lucky-punch",
    "calcItemName": "luckypunch",
    "names": {
      "zh-hans": "吉利拳",
      "zh-hant": "吉利拳",
      "en": "Lucky Punch",
      "ja": "ラッキーパンチ"
    },
    "descriptions": {
      "zh-hans": "能带来幸运的拳套。 让吉利蛋携带后， 招式会变得容易击中要害。",
      "zh-hant": "能帶來幸運的拳套。 讓吉利蛋攜帶後，招式會 變得容易擊中要害。",
      "en": "An item to be held by Chansey. This pair of lucky boxing gloves will boost Chansey’s critical-hit ratio.",
      "ja": "こううんを よぶ グローブ。 ラッキーに もたせると わざが きゅうしょに あたりやすくなる。"
    },
    "spriteSourcePath": "sprites/items/lucky-punch.png"
  },
  "235": {
    "resourceType": "item",
    "id": 235,
    "slug": "thick-club",
    "calcItemName": "thickclub",
    "names": {
      "zh-hans": "粗骨头",
      "zh-hant": "粗骨頭",
      "en": "Thick Club",
      "ja": "ふといホネ"
    },
    "descriptions": {
      "zh-hans": "某种坚硬的骨头。 让卡拉卡拉或嘎啦嘎啦携带后， 攻击就会提高。",
      "zh-hant": "某種堅硬的骨頭。 讓卡拉卡拉或嘎啦嘎啦攜帶後， 攻擊就會提高。",
      "en": "An item to be held by Cubone or Marowak. It’s a hard bone of some sort that boosts the Attack stat.",
      "ja": "なにかの かたい ホネ。 カラカラ または ガラガラに もたせると こうげきが あがる。"
    },
    "spriteSourcePath": "sprites/items/thick-club.png"
  },
  "236": {
    "resourceType": "item",
    "id": 236,
    "slug": "stick",
    "calcItemName": "leek",
    "names": {
      "zh-hans": "大葱",
      "zh-hant": "大蔥",
      "en": "Leek",
      "ja": "ながねぎ"
    },
    "descriptions": {
      "zh-hans": "非常长且坚硬的茎。 让大葱鸭携带后， 招式会变得容易击中要害。",
      "zh-hant": "非常長且堅硬的莖。 讓大蔥鴨攜帶後，招式會 變得容易擊中要害。",
      "en": "An item to be held by Farfetch’d. This very long and stiff stalk of leek boosts its critical-hit ratio.",
      "ja": "とても ながくて かたい クキ。 カモネギに もたせると わざが きゅうしょに あたりやすくなる。"
    },
    "spriteSourcePath": "sprites/items/stick.png"
  },
  "242": {
    "resourceType": "item",
    "id": 242,
    "slug": "wide-lens",
    "calcItemName": "widelens",
    "names": {
      "zh-hans": "广角镜",
      "zh-hant": "廣角鏡",
      "en": "Wide Lens",
      "ja": "こうかくレンズ"
    },
    "descriptions": {
      "zh-hans": "能放大观看物体的镜片。 携带后，招式的命中率 就会少量提高。",
      "zh-hant": "會讓物體看起來比較大的鏡片。 攜帶後，招式的命中率 就會少量提高。",
      "en": "An item to be held by a Pokémon. It’s a magnifying lens that slightly boosts the accuracy of moves.",
      "ja": "ものが おおきく みえる レンズ。 もたせると わざの めいちゅうりつが すこし あがる。"
    },
    "spriteSourcePath": "sprites/items/wide-lens.png"
  },
  "243": {
    "resourceType": "item",
    "id": 243,
    "slug": "muscle-band",
    "calcItemName": "muscleband",
    "names": {
      "zh-hans": "力量头带",
      "zh-hant": "力量頭帶",
      "en": "Muscle Band",
      "ja": "ちからのハチマキ"
    },
    "descriptions": {
      "zh-hans": "力如泉涌的头带。 携带后，物理招式的 威力就会少量提高。",
      "zh-hant": "力如泉湧的頭帶。 攜帶後，物理招式的 威力就會少量提高。",
      "en": "An item to be held by a Pokémon. This headband exudes strength, slightly boosting the power of physical moves.",
      "ja": "ちからが わいてくる ハチマキ。 もたせると ぶつりわざの いりょくが すこし あがる。"
    },
    "spriteSourcePath": "sprites/items/muscle-band.png"
  },
  "244": {
    "resourceType": "item",
    "id": 244,
    "slug": "wise-glasses",
    "calcItemName": "wiseglasses",
    "names": {
      "zh-hans": "博识眼镜",
      "zh-hant": "博識眼鏡",
      "en": "Wise Glasses",
      "ja": "ものしりメガネ"
    },
    "descriptions": {
      "zh-hans": "装着很厚镜片的眼镜。 携带后，特殊招式的 威力就会少量提高。",
      "zh-hant": "裝著很厚鏡片的眼鏡。 攜帶後，特殊招式的 威力就會少量提高。",
      "en": "An item to be held by a Pokémon. This thick pair of glasses slightly boosts the power of special moves.",
      "ja": "ぶあつい レンズの ついた メガネ。 もたせると とくしゅわざの いりょくが すこし あがる。"
    },
    "spriteSourcePath": "sprites/items/wise-glasses.png"
  },
  "245": {
    "resourceType": "item",
    "id": 245,
    "slug": "expert-belt",
    "calcItemName": "expertbelt",
    "names": {
      "zh-hans": "达人带",
      "zh-hant": "達人帶",
      "en": "Expert Belt",
      "ja": "たつじんのおび"
    },
    "descriptions": {
      "zh-hans": "用惯了的黑色带子。 携带后，效果绝佳时的 招式威力就会少量提高。",
      "zh-hant": "用慣了的黑色帶子。 攜帶後，效果絕佳時的 招式威力就會少量提高。",
      "en": "An item to be held by a Pokémon. It’s a well-worn belt that slightly boosts the power of supereffective moves.",
      "ja": "つかいこまれた くろい おび。 もたせると こうかばつぐんの とき わざの いりょくが すこし あがる。"
    },
    "spriteSourcePath": "sprites/items/expert-belt.png"
  },
  "247": {
    "resourceType": "item",
    "id": 247,
    "slug": "life-orb",
    "calcItemName": "lifeorb",
    "names": {
      "zh-hans": "生命宝珠",
      "zh-hant": "生命寶珠",
      "en": "Life Orb",
      "ja": "いのちのたま"
    },
    "descriptions": {
      "zh-hans": "携带后，虽然每次攻击时 ＨＰ少量减少， 但招式的威力会提高。",
      "zh-hant": "攜帶後，雖然每次攻擊時 ＨＰ會少量減少，但招式的 威力會提高。",
      "en": "An item to be held by a Pokémon. It boosts the power of moves but at the cost of some HP on each hit.",
      "ja": "もたせると こうげきする たびに ＨＰが すこし へってしまうが わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/life-orb.png"
  },
  "274": {
    "resourceType": "item",
    "id": 274,
    "slug": "choice-specs",
    "calcItemName": "choicespecs",
    "names": {
      "zh-hans": "讲究眼镜",
      "zh-hant": "講究眼鏡",
      "en": "Choice Specs",
      "ja": "こだわりメガネ"
    },
    "descriptions": {
      "zh-hans": "有点讲究的眼镜。 虽然携带后特攻会提高， 但只能使出相同的招式。",
      "zh-hant": "有點講究的眼鏡。 雖然攜帶後特攻會提高， 但只能使出相同的招式。",
      "en": "An item to be held by a Pokémon. These curious glasses boost Sp. Atk but only allow the use of one move.",
      "ja": "ちょっと こだわった メガネ。 もたせると とくこうは あがるが おなじ わざしか だせなくなる。"
    },
    "spriteSourcePath": "sprites/items/choice-specs.png"
  },
  "275": {
    "resourceType": "item",
    "id": 275,
    "slug": "flame-plate",
    "calcItemName": "flameplate",
    "names": {
      "zh-hans": "火球石板",
      "zh-hant": "火球石板",
      "en": "Flame Plate",
      "ja": "ひのたまプレート"
    },
    "descriptions": {
      "zh-hans": "火属性的石板。 携带后，火属性的 招式威力就会增强。",
      "zh-hant": "火屬性的石板。 攜帶後，火屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Fire-type moves.",
      "ja": "ほのおの タイプの せきばん。 もたせると ほのおタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/flame-plate.png"
  },
  "276": {
    "resourceType": "item",
    "id": 276,
    "slug": "splash-plate",
    "calcItemName": "splashplate",
    "names": {
      "zh-hans": "水滴石板",
      "zh-hant": "水滴石板",
      "en": "Splash Plate",
      "ja": "しずくプレート"
    },
    "descriptions": {
      "zh-hans": "水属性的石板。 携带后，水属性的 招式威力就会增强。",
      "zh-hant": "水屬性的石板。 攜帶後，水屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Water-type moves.",
      "ja": "みずの タイプの せきばん。 もたせると みずタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/splash-plate.png"
  },
  "277": {
    "resourceType": "item",
    "id": 277,
    "slug": "zap-plate",
    "calcItemName": "zapplate",
    "names": {
      "zh-hans": "雷电石板",
      "zh-hant": "雷電石板",
      "en": "Zap Plate",
      "ja": "いかずちプレート"
    },
    "descriptions": {
      "zh-hans": "电属性的石板。 携带后，电属性的 招式威力就会增强。",
      "zh-hant": "電屬性的石板。 攜帶後，電屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Electric-type moves.",
      "ja": "でんきの タイプの せきばん。 もたせると でんきタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/zap-plate.png"
  },
  "278": {
    "resourceType": "item",
    "id": 278,
    "slug": "meadow-plate",
    "calcItemName": "meadowplate",
    "names": {
      "zh-hans": "碧绿石板",
      "zh-hant": "碧綠石板",
      "en": "Meadow Plate",
      "ja": "みどりのプレート"
    },
    "descriptions": {
      "zh-hans": "草属性的石板。 携带后，草属性的 招式威力就会增强。",
      "zh-hant": "草屬性的石板。 攜帶後，草屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Grass-type moves.",
      "ja": "くさの タイプの せきばん。 もたせると くさタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/meadow-plate.png"
  },
  "279": {
    "resourceType": "item",
    "id": 279,
    "slug": "icicle-plate",
    "calcItemName": "icicleplate",
    "names": {
      "zh-hans": "冰柱石板",
      "zh-hant": "冰柱石板",
      "en": "Icicle Plate",
      "ja": "つららのプレート"
    },
    "descriptions": {
      "zh-hans": "冰属性的石板。 携带后，冰属性的 招式威力就会增强。",
      "zh-hant": "冰屬性的石板。 攜帶後，冰屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Ice-type moves.",
      "ja": "こおりの タイプの せきばん。 もたせると こおりタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/icicle-plate.png"
  },
  "280": {
    "resourceType": "item",
    "id": 280,
    "slug": "fist-plate",
    "calcItemName": "fistplate",
    "names": {
      "zh-hans": "拳头石板",
      "zh-hant": "拳頭石板",
      "en": "Fist Plate",
      "ja": "こぶしのプレート"
    },
    "descriptions": {
      "zh-hans": "格斗属性的石板。 携带后，格斗属性的 招式威力就会增强。",
      "zh-hant": "格鬥屬性的石板。 攜帶後，格鬥屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Fighting-type moves.",
      "ja": "かくとうの タイプの せきばん。 もたせると かくとうタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/fist-plate.png"
  },
  "281": {
    "resourceType": "item",
    "id": 281,
    "slug": "toxic-plate",
    "calcItemName": "toxicplate",
    "names": {
      "zh-hans": "剧毒石板",
      "zh-hant": "劇毒石板",
      "en": "Toxic Plate",
      "ja": "もうどくプレート"
    },
    "descriptions": {
      "zh-hans": "毒属性的石板。 携带后，毒属性的 招式威力就会增强。",
      "zh-hant": "毒屬性的石板。 攜帶後，毒屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Poison-type moves.",
      "ja": "どくの タイプの せきばん。 もたせると どくタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/toxic-plate.png"
  },
  "282": {
    "resourceType": "item",
    "id": 282,
    "slug": "earth-plate",
    "calcItemName": "earthplate",
    "names": {
      "zh-hans": "大地石板",
      "zh-hant": "大地石板",
      "en": "Earth Plate",
      "ja": "だいちのプレート"
    },
    "descriptions": {
      "zh-hans": "地面属性的石板。 携带后，地面属性的 招式威力就会增强。",
      "zh-hant": "地面屬性的石板。 攜帶後，地面屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Ground-type moves.",
      "ja": "じめんの タイプの せきばん。 もたせると じめんタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/earth-plate.png"
  },
  "283": {
    "resourceType": "item",
    "id": 283,
    "slug": "sky-plate",
    "calcItemName": "skyplate",
    "names": {
      "zh-hans": "蓝天石板",
      "zh-hant": "藍天石板",
      "en": "Sky Plate",
      "ja": "あおぞらプレート"
    },
    "descriptions": {
      "zh-hans": "飞行属性的石板。 携带后，飞行属性的 招式威力就会增强。",
      "zh-hant": "飛行屬性的石板。 攜帶後，飛行屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Flying-type moves.",
      "ja": "ひこうの タイプの せきばん。 もたせると ひこうタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/sky-plate.png"
  },
  "284": {
    "resourceType": "item",
    "id": 284,
    "slug": "mind-plate",
    "calcItemName": "mindplate",
    "names": {
      "zh-hans": "神奇石板",
      "zh-hant": "神奇石板",
      "en": "Mind Plate",
      "ja": "ふしぎのプレート"
    },
    "descriptions": {
      "zh-hans": "超能力属性的石板。 携带后，超能力属性的 招式威力就会增强。",
      "zh-hant": "超能力屬性的石板。 攜帶後，超能力屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Psychic-type moves.",
      "ja": "エスパーの タイプの せきばん。 もたせると エスパータイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/mind-plate.png"
  },
  "285": {
    "resourceType": "item",
    "id": 285,
    "slug": "insect-plate",
    "calcItemName": "insectplate",
    "names": {
      "zh-hans": "玉虫石板",
      "zh-hant": "玉蟲石板",
      "en": "Insect Plate",
      "ja": "たまむしプレート"
    },
    "descriptions": {
      "zh-hans": "虫属性的石板。 携带后，虫属性的 招式威力就会增强。",
      "zh-hant": "蟲屬性的石板。 攜帶後，蟲屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Bug-type moves.",
      "ja": "むしの タイプの せきばん。 もたせると むしタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/insect-plate.png"
  },
  "286": {
    "resourceType": "item",
    "id": 286,
    "slug": "stone-plate",
    "calcItemName": "stoneplate",
    "names": {
      "zh-hans": "岩石石板",
      "zh-hant": "岩石石板",
      "en": "Stone Plate",
      "ja": "がんせきプレート"
    },
    "descriptions": {
      "zh-hans": "岩石属性的石板。 携带后，岩石属性的 招式威力就会增强。",
      "zh-hant": "岩石屬性的石板。 攜帶後，岩石屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Rock-type moves.",
      "ja": "いわの タイプの せきばん。 もたせると いわタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/stone-plate.png"
  },
  "287": {
    "resourceType": "item",
    "id": 287,
    "slug": "spooky-plate",
    "calcItemName": "spookyplate",
    "names": {
      "zh-hans": "妖怪石板",
      "zh-hant": "妖怪石板",
      "en": "Spooky Plate",
      "ja": "もののけプレート"
    },
    "descriptions": {
      "zh-hans": "幽灵属性的石板。 携带后，幽灵属性的 招式威力就会增强。",
      "zh-hant": "幽靈屬性的石板。 攜帶後，幽靈屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Ghost-type moves.",
      "ja": "ゴーストの タイプの せきばん。 もたせると ゴーストタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/spooky-plate.png"
  },
  "288": {
    "resourceType": "item",
    "id": 288,
    "slug": "draco-plate",
    "calcItemName": "dracoplate",
    "names": {
      "zh-hans": "龙之石板",
      "zh-hant": "龍之石板",
      "en": "Draco Plate",
      "ja": "りゅうのプレート"
    },
    "descriptions": {
      "zh-hans": "龙属性的石板。 携带后，龙属性的 招式威力就会增强。",
      "zh-hant": "龍屬性的石板。 攜帶後，龍屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Dragon-type moves.",
      "ja": "ドラゴンの タイプの せきばん。 もたせると ドラゴンタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/draco-plate.png"
  },
  "289": {
    "resourceType": "item",
    "id": 289,
    "slug": "dread-plate",
    "calcItemName": "dreadplate",
    "names": {
      "zh-hans": "恶颜石板",
      "zh-hant": "惡顏石板",
      "en": "Dread Plate",
      "ja": "こわもてプレート"
    },
    "descriptions": {
      "zh-hans": "恶属性的石板。 携带后，恶属性的 招式威力就会增强。",
      "zh-hant": "惡屬性的石板。 攜帶後，惡屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Dark-type moves.",
      "ja": "あくの タイプの せきばん。 もたせると あくタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/dread-plate.png"
  },
  "290": {
    "resourceType": "item",
    "id": 290,
    "slug": "iron-plate",
    "calcItemName": "ironplate",
    "names": {
      "zh-hans": "钢铁石板",
      "zh-hant": "鋼鐵石板",
      "en": "Iron Plate",
      "ja": "こうてつプレート"
    },
    "descriptions": {
      "zh-hans": "钢属性的石板。 携带后，钢属性的 招式威力就会增强。",
      "zh-hant": "鋼屬性的石板。 攜帶後，鋼屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Steel-type moves.",
      "ja": "はがねの タイプの せきばん。 もたせると はがねタイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/iron-plate.png"
  },
  "291": {
    "resourceType": "item",
    "id": 291,
    "slug": "odd-incense",
    "calcItemName": "oddincense",
    "names": {
      "zh-hans": "奇异薰香",
      "zh-hant": "奇異薰香",
      "en": "Odd Incense",
      "ja": "あやしいおこう"
    },
    "descriptions": {
      "zh-hans": "有着神奇香气的薰香。 携带后，超能力属性的 招式威力就会提高。",
      "zh-hant": "有著神奇香氣的薰香。 攜帶後，超能力屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This exotic-smelling incense boosts the power of Psychic-type moves.",
      "ja": "ふしぎな かおりの おこう。 もたせると エスパータイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/odd-incense.png"
  },
  "292": {
    "resourceType": "item",
    "id": 292,
    "slug": "rock-incense",
    "calcItemName": "rockincense",
    "names": {
      "zh-hans": "岩石薰香",
      "zh-hant": "岩石薰香",
      "en": "Rock Incense",
      "ja": "がんせきおこう"
    },
    "descriptions": {
      "zh-hans": "有着神奇香气的薰香。 携带后，岩石属性的 招式威力就会提高。",
      "zh-hant": "有著神奇香氣的薰香。 攜帶後，岩石屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This exotic-smelling incense boosts the power of Rock-type moves.",
      "ja": "ふしぎな かおりの おこう。 もたせると いわタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/rock-incense.png"
  },
  "294": {
    "resourceType": "item",
    "id": 294,
    "slug": "wave-incense",
    "calcItemName": "waveincense",
    "names": {
      "zh-hans": "涟漪薰香",
      "zh-hant": "漣漪薰香",
      "en": "Wave Incense",
      "ja": "さざなみのおこう"
    },
    "descriptions": {
      "zh-hans": "有着神奇香气的薰香。 携带后，水属性的 招式威力就会提高。",
      "zh-hant": "有著神奇香氣的薰香。 攜帶後，水屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This incense has a curious aroma that boosts the power of Water-type moves.",
      "ja": "ふしぎな かおりの おこう。 もたせると みずタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/wave-incense.png"
  },
  "295": {
    "resourceType": "item",
    "id": 295,
    "slug": "rose-incense",
    "calcItemName": "roseincense",
    "names": {
      "zh-hans": "花朵薰香",
      "zh-hant": "花朵薰香",
      "en": "Rose Incense",
      "ja": "おはなのおこう"
    },
    "descriptions": {
      "zh-hans": "有着神奇香气的薰香。 携带后，草属性的 招式威力就会提高。",
      "zh-hant": "有著神奇香氣的薰香。 攜帶後，草屬性的 招式威力就會提高。",
      "en": "An item to be held by a Pokémon. This exotic-smelling incense boosts the power of Grass-type moves.",
      "ja": "ふしぎな かおりの おこう。 もたせると くさタイプの わざの いりょくが あがる。"
    },
    "spriteSourcePath": "sprites/items/rose-incense.png"
  },
  "303": {
    "resourceType": "item",
    "id": 303,
    "slug": "razor-claw",
    "calcItemName": "razorclaw",
    "names": {
      "zh-hans": "锐利之爪",
      "zh-hant": "銳利之爪",
      "en": "Razor Claw",
      "ja": "するどいツメ"
    },
    "descriptions": {
      "zh-hans": "尖锐的爪子。 携带后，招式会 变得容易击中要害。",
      "zh-hant": "尖銳的爪子。 攜帶後，招式會 變得容易擊中要害。",
      "en": "An item to be held by a Pokémon. This sharply hooked claw increases the holder’s critical-hit ratio.",
      "ja": "するどく とがった ツメ。 もたせると わざが きゅうしょに あたりやすくなる。"
    },
    "spriteSourcePath": "sprites/items/razor-claw.png"
  },
  "442": {
    "resourceType": "item",
    "id": 442,
    "slug": "griseous-orb",
    "calcItemName": "griseousorb",
    "names": {
      "zh-hans": "白金宝珠",
      "zh-hant": "白金寶珠",
      "en": "Griseous Orb",
      "ja": "はっきんだま"
    },
    "descriptions": {
      "zh-hans": "让骑拉帝纳携带的话， 龙和幽灵属性的招式威力就会提高。 散发着光辉的宝珠。",
      "zh-hant": "讓騎拉帝納攜帶的話， 龍和幽靈屬性的招式威力就會提高。 散發著光輝的寶珠。",
      "en": "A glowing orb to be held by Giratina. It boosts the power of Dragon- and Ghost-type moves when it is held.",
      "ja": "ギラティナに もたせると ドラゴンと ゴーストタイプの わざの いりょくが あがる ひかり かがやく たま。"
    },
    "spriteSourcePath": "sprites/items/griseous-orb.png"
  },
  "581": {
    "resourceType": "item",
    "id": 581,
    "slug": "eviolite",
    "calcItemName": "eviolite",
    "names": {
      "zh-hans": "进化奇石",
      "zh-hant": "進化奇石",
      "en": "Eviolite",
      "ja": "しんかのきせき"
    },
    "descriptions": {
      "zh-hans": "进化的神奇石块。 携带后，还能进化的宝可梦的 防御和特防就会提高。",
      "zh-hant": "進化的神奇石塊。 攜帶後，還能進化的寶可夢的 防禦和特防就會提高。",
      "en": "A mysterious evolutionary lump. When held by a Pokémon that can still evolve, it raises both Defense and Sp. Def.",
      "ja": "しんかの ふしぎな かたまり。 もたせると しんかまえ ポケモンの ぼうぎょと とくぼうが あがる。"
    },
    "spriteSourcePath": "sprites/items/eviolite.png"
  },
  "683": {
    "resourceType": "item",
    "id": 683,
    "slug": "assault-vest",
    "calcItemName": "assaultvest",
    "names": {
      "zh-hans": "突击背心",
      "zh-hant": "突擊背心",
      "en": "Assault Vest",
      "ja": "とつげきチョッキ"
    },
    "descriptions": {
      "zh-hans": "会变得富有攻击性的背心。 虽然携带后特防会提高， 但会无法使出变化招式。",
      "zh-hant": "會變得富有攻擊性的背心。 雖然攜帶後特防會提高， 但會無法使出變化招式。",
      "en": "An item to be held by a Pokémon. This offensive vest raises Sp. Def but prevents the use of status moves.",
      "ja": "こうげきてきに なる チョッキ。 もたせると とくぼうが あがるが へんかわざを だせなくなる。"
    },
    "spriteSourcePath": "sprites/items/assault-vest.png"
  },
  "684": {
    "resourceType": "item",
    "id": 684,
    "slug": "pixie-plate",
    "calcItemName": "pixieplate",
    "names": {
      "zh-hans": "妖精石板",
      "zh-hant": "妖精石板",
      "en": "Pixie Plate",
      "ja": "せいれいプレート"
    },
    "descriptions": {
      "zh-hans": "妖精属性的石板。 携带后，妖精属性的 招式威力就会增强。",
      "zh-hant": "妖精屬性的石板。 攜帶後，妖精屬性的 招式威力就會增強。",
      "en": "An item to be held by a Pokémon. It’s a stone tablet that boosts the power of Fairy-type moves.",
      "ja": "フェアリーの タイプの せきばん。 もたせると フェアリータイプの わざの いりょくが つよまる。"
    },
    "spriteSourcePath": "sprites/items/pixie-plate.png"
  },
  "723": {
    "resourceType": "item",
    "id": 723,
    "slug": "roseli-berry",
    "calcItemName": "roseliberry",
    "names": {
      "zh-hans": "洛玫果",
      "zh-hant": "洛玫果",
      "en": "Roseli Berry",
      "ja": "ロゼルのみ"
    },
    "descriptions": {
      "zh-hans": "让宝可梦携带后， 在受到效果绝佳的妖精属性招式 攻击时，能令其威力减弱。",
      "zh-hant": "讓寶可夢攜帶後， 在受到效果絕佳的妖精屬性招式 攻擊時，能使其威力減弱。",
      "en": "If held by a Pokémon, this Berry will lessen the damage taken from one supereffective Fairy-type attack.",
      "ja": "ポケモンに もたせると こうかばつぐんの フェアリー わざを うけたとき いりょくが よわまる。"
    },
    "spriteSourcePath": "sprites/items/roseli-berry.png"
  },
  "1181": {
    "resourceType": "item",
    "id": 1181,
    "slug": "utility-umbrella",
    "calcItemName": "utilityumbrella",
    "names": {
      "zh-hans": "万能伞",
      "zh-hant": "萬能傘",
      "en": "Utility Umbrella",
      "ja": "ばんのうがさ"
    },
    "descriptions": {
      "zh-hans": "携带它的宝可梦 在下雨或日照很强时， 不会受到天气的影响。",
      "zh-hant": "攜帶它的寶可夢 在下雨或日照很強時， 不會受到天氣的影響。",
      "en": "An item to be held by a Pokémon. This sturdy umbrella protects the holder from the effects of rain and harsh sunlight.",
      "ja": "もたせた ポケモンは あめと ひざしがつよいときの えいきょうを うけなくなる。"
    },
    "spriteSourcePath": "sprites/items/gen8/utility-umbrella.png"
  },
  "2105": {
    "resourceType": "item",
    "id": 2105,
    "slug": "fairy-feather",
    "calcItemName": "fairyfeather",
    "names": {
      "zh-hans": "妖精之羽",
      "zh-hant": "妖精之羽",
      "en": "Fairy Feather",
      "ja": "ようせいのハネ"
    },
    "descriptions": {
      "zh-hans": "",
      "zh-hant": "",
      "en": "",
      "ja": ""
    },
    "spriteSourcePath": "sprites/items/gen9/fairy-feather.png"
  },
  "2106": {
    "resourceType": "item",
    "id": 2106,
    "slug": "wellspring-mask",
    "calcItemName": "wellspringmask",
    "names": {
      "zh-hans": "水井面具",
      "zh-hant": "水井面具",
      "en": "Wellspring Mask",
      "ja": "いどのめん"
    },
    "descriptions": {
      "zh-hans": "",
      "zh-hant": "",
      "en": "",
      "ja": ""
    },
    "spriteSourcePath": "sprites/items/gen9/wellspring-mask.png"
  },
  "2107": {
    "resourceType": "item",
    "id": 2107,
    "slug": "hearthflame-mask",
    "calcItemName": "hearthflamemask",
    "names": {
      "zh-hans": "火灶面具",
      "zh-hant": "火灶面具",
      "en": "Hearthflame Mask",
      "ja": "かまどのめん"
    },
    "descriptions": {
      "zh-hans": "",
      "zh-hant": "",
      "en": "",
      "ja": ""
    },
    "spriteSourcePath": "sprites/items/gen9/hearthflame-mask.png"
  },
  "2108": {
    "resourceType": "item",
    "id": 2108,
    "slug": "cornerstone-mask",
    "calcItemName": "cornerstonemask",
    "names": {
      "zh-hans": "础石面具",
      "zh-hant": "礎石面具",
      "en": "Cornerstone Mask",
      "ja": "いしずえのめん"
    },
    "descriptions": {
      "zh-hans": "",
      "zh-hant": "",
      "en": "",
      "ja": ""
    },
    "spriteSourcePath": "sprites/items/gen9/cornerstone-mask.png"
  }
} as const satisfies Record<UpstreamResourceId, NormalizedHeldItem>

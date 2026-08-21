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
    },
    "descriptions": {
      "zh-hans": "通过释放臭臭的气味， 在攻击的时候， 有时会使对手畏缩。",
      "zh-hant": "發出臭氣， 在攻擊的時候， 有時會使對手畏縮。",
      "en": "By releasing a stench when attacking, the Pokémon may cause the target to flinch.",
      "ja": "くさい においを はなつことによって こうげきした ときに あいてを ひるませることが ある。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 会将天气变为下雨。",
      "zh-hant": "出場時， 會將天氣變為下雨。",
      "en": "The Pokémon makes it rain when it enters a battle.",
      "ja": "とうじょう したときに てんきを あめに する。"
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
    },
    "descriptions": {
      "zh-hans": "每一回合速度会变快。",
      "zh-hant": "每一回合速度會變快。",
      "en": "The Pokémon's Speed stat is boosted every turn.",
      "ja": "まいターン すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "被坚硬的甲壳守护着， 不会被对手的攻击击中要害。",
      "zh-hant": "被堅硬的甲殼守護著， 不會被對手的攻擊擊中要害。",
      "en": "Hard armor protects the Pokémon from critical hits.",
      "ja": "かたい こうらに まもられて あいての こうげきが きゅうしょに あたらない。"
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
    },
    "descriptions": {
      "zh-hans": "即使受到对手的招式攻击， 也不会被一击打倒。 一击必杀的招式也没有效果。",
      "zh-hant": "受到對手的招式攻擊時 不會被一擊打倒。 一擊必殺的招式也沒有效果。",
      "en": "The Pokémon cannot be knocked out by a single hit as long as its HP is full. One-hit KO moves will also fail to knock it out.",
      "ja": "あいての わざを うけても いちげきで たおされることが ない。 いちげきひっさつわざも きかない。"
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
    },
    "descriptions": {
      "zh-hans": "通过把周围都弄湿， 使谁都无法使用自爆等爆炸类的招式。",
      "zh-hant": "透過把周圍都弄濕， 使誰都無法使用自爆等爆炸類的招式。",
      "en": "The Pokémon dampens its surroundings, preventing all Pokémon from using explosive moves such as Self-Destruct.",
      "ja": "あたりを しめらせることに よって じばく などの ばくはつする わざを だれも つかえなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "因为身体柔软， 不会变为麻痹状态。",
      "zh-hant": "因為身體柔軟， 不會陷入麻痺狀態。",
      "en": "The Pokémon's limber body prevents it from being paralyzed.",
      "ja": "じゅうなんな からだによって まひ じょうたいに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "在沙暴的时候， 闪避率会提高。",
      "zh-hant": "在沙暴中 閃避率會提高。",
      "en": "Boosts the Pokémon's evasiveness in a sandstorm.",
      "ja": "すなあらしの とき かいひりつが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "身上带有静电， 有时会让接触到的对手麻痹。",
      "zh-hant": "身上帶有靜電， 有時會令接觸到的對手麻痺。",
      "en": "The Pokémon is charged with static electricity and may paralyze attackers that make direct contact with it.",
      "ja": "せいでんきを からだに まとい さわった あいてを まひさせる ことがある。"
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
    },
    "descriptions": {
      "zh-hans": "受到电属性的招式攻击时， 不会受到伤害，而是会回复。",
      "zh-hant": "受到電屬性的招式攻擊時， 不會受到傷害，而是會回復。",
      "en": "If hit by an Electric-type move, the Pokémon has its HP restored instead of taking damage.",
      "ja": "でんきタイプの わざを うけると ダメージを うけずに かいふくする。"
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
    },
    "descriptions": {
      "zh-hans": "受到水属性的招式攻击时， 不会受到伤害，而是会回复。",
      "zh-hant": "受到水屬性的招式攻擊時， 不會受到傷害，而是會回復。",
      "en": "If hit by a Water-type move, the Pokémon has its HP restored instead of taking damage.",
      "ja": "みずタイプの わざを うけると ダメージを うけずに かいふくする。"
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
    },
    "descriptions": {
      "zh-hans": "因为感觉迟钝， 不会变为着迷和被挑衅状态。",
      "zh-hant": "感覺遲鈍， 不會陷入著迷和被挑釁狀態。",
      "en": "The Pokémon is oblivious, keeping it from being infatuated, falling for taunts, or being affected by Intimidate.",
      "ja": "どんかん なので メロメロや ちょうはつ じょうたいに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "任何天气的影响都会消失。",
      "zh-hant": "任何天氣的影響都會消失。",
      "en": "Eliminates the effects of weather.",
      "ja": "あらゆる てんきの えいきょうが なくなって しまう。"
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
    },
    "descriptions": {
      "zh-hans": "因为拥有复眼， 招式的命中率会提高。",
      "zh-hant": "因為擁有複眼， 會提高招式的命中率。",
      "en": "The Pokémon's compound eyes boost its accuracy.",
      "ja": "ふくがんを もっているため わざの めいちゅうりつが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "因为有着睡不着的体质， 所以不会陷入睡眠状态。",
      "zh-hant": "因為有著睡不著的體質， 所以不會陷入睡眠狀態。",
      "en": "The Pokémon's insomnia prevents it from falling asleep.",
      "ja": "ねむれない たいしつ なので ねむり じょうたいに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "自己的属性会变为 从对手处所受招式的属性。",
      "zh-hant": "自己的屬性會變為 擊中自己的對手招式的屬性。",
      "en": "The Pokémon’s type becomes the type of the move used on it.",
      "ja": "あいてから うけた わざの タイプに じぶんの タイプが へんか する。"
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
    },
    "descriptions": {
      "zh-hans": "因为体内拥有免疫能力， 不会变为中毒状态。",
      "zh-hant": "因為體內擁有免疫能力， 不會陷入中毒狀態。",
      "en": "The Pokémon's immune system prevents it from being poisoned.",
      "ja": "たいないに めんえきを もっているため どく じょうたいに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "受到火属性的招式攻击时， 吸收火焰，自己使出的 火属性招式会变强。",
      "zh-hant": "受到火屬性的招式攻擊時， 吸收火焰，讓自己使出的 火屬性招式變強。",
      "en": "If hit by a Fire-type move, the Pokémon absorbs the flames and uses them to power up its own Fire-type moves.",
      "ja": "ほのおタイプの わざを うけると ほのおを もらい じぶんが だす ほのおタイプの わざが つよくなる。"
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
    },
    "descriptions": {
      "zh-hans": "被鳞粉守护着， 不会受到招式的追加效果影响。",
      "zh-hant": "被鱗粉守護著， 不會受到招式的追加效果影響。",
      "en": "Protective dust shields the Pokémon from the additional effects of moves.",
      "ja": "りんぷんに まもられて わざの ついかこうかを うけなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "因为我行我素， 不会变为混乱状态。",
      "zh-hant": "因為我行我素， 不會陷入混亂狀態。",
      "en": "The Pokémon sticks to its own tempo, preventing it from becoming confused or being affected by Intimidate.",
      "ja": "マイペースなので こんらん じょうたいに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "用吸盘牢牢贴在地面上， 让替换宝可梦的招式和道具无效。",
      "zh-hant": "用吸盤將自己牢牢吸附在地面上， 讓替換寶可夢的招式和道具失效。",
      "en": "The Pokémon uses suction cups to stay in one spot. This protects it from moves and items that would force it to switch out.",
      "ja": "きゅうばんで じめんに はりつき ポケモンを いれかえさせる わざや どうぐが きかなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时威吓对手， 让其退缩， 降低对手的攻击。",
      "zh-hant": "出場時威嚇對手， 使其退縮， 從而降低對手的攻擊。",
      "en": "When the Pokémon enters a battle, it intimidates opposing Pokémon and makes them cower, lowering their Attack stats.",
      "ja": "とうじょう したとき いかくして あいてを いしゅくさせ あいての こうげきを さげて しまう。"
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
    },
    "descriptions": {
      "zh-hans": "踩住对手的影子 使其无法逃走或替换。",
      "zh-hant": "踩住對手的影子 使其無法逃走或替換。",
      "en": "The Pokémon steps on the opposing Pokémon's shadows to prevent them from fleeing or switching out.",
      "ja": "あいての かげを ふみ にげたり こうたい できなくする。"
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
    },
    "descriptions": {
      "zh-hans": "受到攻击时， 用粗糙的皮肤弄伤 接触到自己的对手。",
      "zh-hant": "受到攻擊時， 用粗糙的皮膚弄傷 接觸到自己的對手。",
      "en": "The Pokémon's rough skin damages attackers that make direct contact with it.",
      "ja": "こうげきを うけたとき じぶんに ふれた あいてを ざらざらの はだで キズつける。"
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
    },
    "descriptions": {
      "zh-hans": "不可思议的力量， 只有效果绝佳的招式才能击中。",
      "zh-hant": "不可思議的力量， 只有效果絕佳的招式才會擊中自己。",
      "en": "Its mysterious power only lets supereffective moves hit the Pokémon.",
      "ja": "こうかばつぐんの わざしか あたらない ふしぎな ちから。"
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
    },
    "descriptions": {
      "zh-hans": "从地面浮起， 从而不会受到地面属性招式的攻击。",
      "zh-hant": "從地面浮起， 從而不會受到地面屬性招式的攻擊。",
      "en": "By floating in the air, the Pokémon receives full immunity to all Ground-type moves.",
      "ja": "じめんから うくことによって じめんタイプの わざを うけない。"
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
    },
    "descriptions": {
      "zh-hans": "受到攻击时， 有时会把接触到自己的对手 变为中毒、麻痹或睡眠状态。",
      "zh-hant": "受到攻擊時， 有時會讓接觸到自己的對手 陷入中毒、麻痺或睡眠狀態。",
      "en": "Contact with the Pokémon may inflict poison, sleep, or paralysis on the attacker.",
      "ja": "こうげきで じぶんに ふれた あいてを どくや まひや ねむり じょうたいに する ことがある。"
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
    },
    "descriptions": {
      "zh-hans": "将自己的中毒、麻痹 或灼伤状态传染给对手。",
      "zh-hant": "將自己的中毒、麻痺或 灼傷狀態傳染給對手。",
      "en": "If the Pokémon is burned, paralyzed, or poisoned by another Pokémon, that Pokémon will be inflicted with the same status condition.",
      "ja": "じぶんが なってしまった どくや まひや やけどを あいてに うつす。"
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
    },
    "descriptions": {
      "zh-hans": "不会因为对手的招式或特性 而被降低能力。",
      "zh-hant": "不會因對手的招式或特性 而被降低能力。",
      "en": "Prevents other Pokémon's moves or Abilities from lowering the Pokémon's stats.",
      "ja": "あいての わざや とくせいで のうりょくを さげられない。"
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
    },
    "descriptions": {
      "zh-hans": "回到同行队伍后， 异常状态就会被治愈。",
      "zh-hant": "異常狀態會在 離場後治癒。",
      "en": "The Pokémon's status conditions are cured when it switches out.",
      "ja": "てもちに ひっこむと じょうたい いじょうが なおる。"
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
    },
    "descriptions": {
      "zh-hans": "将电属性的招式吸引到自己身上， 不会受到伤害，而是会提高特攻。",
      "zh-hant": "將電屬性的招式吸引到自己身上， 不但不會受到傷害，反而會提高特攻。",
      "en": "The Pokémon draws in all Electric-type moves. Instead of taking damage from them, its Sp. Atk stat is boosted.",
      "ja": "でんきタイプの わざを じぶんに よせつけ ダメージを うけずに とくこうが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "托天恩的福， 招式的追加效果容易出现。",
      "zh-hant": "受到上天保佑， 容易出現招式的追加效果。",
      "en": "Raises the likelihood of additional effects occurring when the Pokémon uses its moves.",
      "ja": "てんのめぐみの おかげで わざの ついかこうかが でやすい。"
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
    },
    "descriptions": {
      "zh-hans": "下雨天气时， 速度会提高。",
      "zh-hant": "天氣為下雨時， 速度會提高。",
      "en": "Boosts the Pokémon's Speed stat in rain.",
      "ja": "てんきが あめのとき すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "晴朗天气时， 速度会提高。",
      "zh-hant": "天氣為晴朗時， 速度會提高。",
      "en": "Boosts the Pokémon's Speed stat in harsh sunlight.",
      "ja": "てんきが はれのとき すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "通过让周围变亮， 变得容易遇到野生的宝可梦。",
      "zh-hant": "透過讓周圍變亮， 變得容易遇見野生的寶可夢。",
      "en": "By illuminating its surroundings, the Pokémon prevents its accuracy from being lowered.",
      "ja": "あたりを あかるくする ことで やせいの ポケモンに そうぐう しやすくなる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时，复制对手的特性， 变为与之相同的特性。",
      "zh-hant": "出場時，複製對手的特性， 變為與之相同的特性。",
      "en": "When it enters a battle, the Pokémon copies an opposing Pokémon's Ability.",
      "ja": "とうじょう したとき あいての とくせいを トレースして おなじ とくせいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "物理攻击的威力会变为２倍。",
      "zh-hant": "物理攻擊的威力會變為２倍。",
      "en": "Doubles the Pokémon's Attack stat.",
      "ja": "ぶつり こうげきの いりょくが ２ばいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "有时会让接触到自己的 对手变为中毒状态。",
      "zh-hant": "有時會讓接觸到自己的 對手陷入中毒狀態。",
      "en": "Contact with the Pokémon may poison the attacker.",
      "ja": "じぶんに さわった あいてを どく じょうたいに する ことがある。"
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
    },
    "descriptions": {
      "zh-hans": "拥有经过锻炼的精神， 而不会因对手的攻击而畏缩。",
      "zh-hant": "靠著經過鍛鍊的精神， 不會因對手的攻擊而畏縮。",
      "en": "The Pokémon's intense focus prevents it from flinching or being affected by Intimidate.",
      "ja": "きたえられた せいしんに よって あいての こうげきに ひるまない。"
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
    },
    "descriptions": {
      "zh-hans": "将炽热的熔岩覆盖在身上， 不会变为冰冻状态。",
      "zh-hant": "將熾熱的熔岩覆蓋在身上， 不會陷入冰凍狀態。",
      "en": "The Pokémon’s hot magma coating prevents it from being frozen.",
      "ja": "あつい マグマを みにまとい こおり じょうたいに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "将水幕裹在身上， 不会变为灼伤状态。",
      "zh-hant": "將水幕裹在身上， 不會陷入灼傷狀態。",
      "en": "The Pokémon's water veil prevents it from being burned.",
      "ja": "みずのベールを みにまとい やけど じょうたいに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "用磁力吸住钢属性的宝可梦， 使其无法逃走。",
      "zh-hant": "用磁力吸住鋼屬性的寶可夢， 使其無法逃走。",
      "en": "Prevents Steel-type Pokémon from fleeing by pulling them in with magnetism.",
      "ja": "はがねタイプの ポケモンを じりょくで ひきつけて にげられなくする。"
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
    },
    "descriptions": {
      "zh-hans": "通过屏蔽声音， 不受到声音招式的攻击。",
      "zh-hant": "透過遮蔽聲音， 不受到聲音招式的攻擊。",
      "en": "Soundproofing gives the Pokémon full immunity to all sound-based moves.",
      "ja": "おとを しゃだん することに よって おとの こうげきを うけない。"
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
    },
    "descriptions": {
      "zh-hans": "下雨天气时， 会缓缓回复ＨＰ。",
      "zh-hant": "天氣為下雨時， 會漸漸回復ＨＰ。",
      "en": "The Pokémon gradually regains HP in rain.",
      "ja": "てんきが あめのとき すこしずつ ＨＰを かいふくする。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 会把天气变为沙暴。",
      "zh-hant": "出場時， 會把天氣變為沙暴。",
      "en": "The Pokémon summons a sandstorm when it enters a battle.",
      "ja": "とうじょう したとき てんきを すなあらしに する。"
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
    },
    "descriptions": {
      "zh-hans": "给予对手压迫感， 大量减少其使用招式的ＰＰ。",
      "zh-hant": "給予對手壓迫感， 大量減少其使用招式的ＰＰ。",
      "en": "Puts other Pokémon under pressure, causing them to expend more PP to use their moves.",
      "ja": "プレッシャーを あたえて あいての つかう わざの ＰＰを おおく へらす。"
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
    },
    "descriptions": {
      "zh-hans": "因为被厚厚的脂肪保护着， 会让火属性和冰属性的招式伤害减半。",
      "zh-hant": "被厚厚的脂肪保護著， 能夠讓火屬性和冰屬性 招式的傷害減半。",
      "en": "The Pokémon is protected by a layer of thick fat, which halves the damage taken from Fire- and Ice-type moves.",
      "ja": "あつい しぼうで まもられているので ほのおタイプと こおりタイプの わざの ダメージを はんげんさせる。"
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
    },
    "descriptions": {
      "zh-hans": "即使变为睡眠状态， 也能以２倍的速度提早醒来。",
      "zh-hant": "即使陷入睡眠狀態， 也能以２倍的速度提早醒來。",
      "en": "The Pokémon awakens from sleep twice as fast as other Pokémon.",
      "ja": "ねむり じょうたいに なっても ２ばいの はやさで めざめる ことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "有时会让接触到自己的 对手变为灼伤状态。",
      "zh-hant": "有時會讓接觸到自己的 對手陷入灼傷狀態。",
      "en": "Contact with the Pokémon may burn the attacker.",
      "ja": "じぶんに さわった あいてを やけど じょうたいに する ことがある。"
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
    },
    "descriptions": {
      "zh-hans": "一定能从野生宝可梦 那儿逃走。",
      "zh-hant": "一定能從野生寶可夢 那裡逃走。",
      "en": "Enables a sure getaway from wild Pokémon.",
      "ja": "やせいの ポケモンから かならず にげられる。"
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
    },
    "descriptions": {
      "zh-hans": "多亏了锐利的目光， 命中率不会被降低。",
      "zh-hant": "靠著銳利的目光， 命中率不會被降低。",
      "en": "The Pokémon's keen eyes prevent its accuracy from being lowered.",
      "ja": "するどい めの おかげで めいちゅうりつを さげられない。"
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
    },
    "descriptions": {
      "zh-hans": "因为拥有以力量自豪的钳子， 不会被对手降低攻击。",
      "zh-hant": "因為擁有以力量為傲的鉗子， 不會被對手降低攻擊。",
      "en": "The Pokémon's prized, mighty pincers prevent other Pokémon from lowering its Attack stat.",
      "ja": "ちからじまんの ハサミを もっているので あいてに こうげきを さげられない。"
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
    },
    "descriptions": {
      "zh-hans": "有时会捡来对手用过的道具， 冒险过程中也会捡到。",
      "zh-hant": "有時會撿來對手用過的道具。 冒險過程中也會撿來。",
      "en": "The Pokémon may pick up an item another Pokémon used during a battle. It may pick up items outside of battle, too.",
      "ja": "あいての つかった どうぐを ひろってくることが ある。 ぼうけんちゅうも ひろってくる。"
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
    },
    "descriptions": {
      "zh-hans": "如果使出招式， 下一回合就会休息。",
      "zh-hant": "如果使出招式， 下一回合就需要休息。",
      "en": "Each time the Pokémon uses a move, it spends the next turn loafing around.",
      "ja": "わざを だすと つぎの ターンは やすんでしまう。"
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
    },
    "descriptions": {
      "zh-hans": "自己的攻击变高， 但命中率会降低。",
      "zh-hant": "自己的攻擊雖會變高， 但命中率會降低。",
      "en": "Boosts the Pokémon's Attack stat but lowers its accuracy.",
      "ja": "じぶんの こうげきが たかくなるが めいちゅうりつが さがる。"
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
    },
    "descriptions": {
      "zh-hans": "有时会让接触到自己的对手着迷。",
      "zh-hant": "有時會讓接觸到自己的對手 陷入著迷狀態。",
      "en": "The Pokémon may infatuate attackers that make direct contact with it.",
      "ja": "じぶんに さわった あいてを メロメロに することが ある。"
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
    },
    "descriptions": {
      "zh-hans": "出场的伙伴之间 如果有正电或负电特性的宝可梦， 自己的特攻会提高。",
      "zh-hant": "場上的夥伴之中， 如果有正電或負電特性的寶可夢， 自己的特攻會提高。",
      "en": "Boosts the Sp. Atk stat of the Pokémon if an ally with the Plus or Minus Ability is also in battle.",
      "ja": "プラスか マイナスの とくせいを もつ ポケモンが なかまに いると じぶんの とくこうが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "出场的伙伴之间 如果有正电或负电特性的宝可梦， 自己的特攻会提高。",
      "zh-hant": "場上的夥伴之中， 如果有正電或負電特性的寶可夢， 自己的特攻會提高。",
      "en": "Boosts the Sp. Atk stat of the Pokémon if an ally with the Plus or Minus Ability is also in battle.",
      "ja": "プラスか マイナスの とくせいを もつ ポケモンが なかまに いると じぶんの とくこうが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "受天气的影响， 会变为水属性、火属性 或冰属性中的某一个。",
      "zh-hant": "在天氣的影響下， 會變成水屬性、火屬性 或冰屬性之中的一種。",
      "en": "The Pokémon transforms with the weather to change its type to Water, Fire, or Ice.",
      "ja": "てんきの えいきょうを うけて みずタイプ ほのおタイプ こおりタイプの どれかに へんかする。"
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
    },
    "descriptions": {
      "zh-hans": "因为道具是粘在黏性身体上的， 所以不会被对手夺走。",
      "zh-hant": "道具會黏在 具有黏性的身體上， 不會被對手奪走。",
      "en": "The Pokémon's held items cling to its sticky body and cannot be removed by other Pokémon.",
      "ja": "ねんちゃくしつの からだに どうぐが くっついているため あいてに どうぐを うばわれない。"
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
    },
    "descriptions": {
      "zh-hans": "通过蜕去身上的皮， 有时会治愈异常状态。",
      "zh-hant": "透過蛻去身上的皮， 有時會治癒異常狀態。",
      "en": "The Pokémon may cure its own status conditions by shedding its skin.",
      "ja": "からだの かわを ぬぎすてることで じょうたい いじょうを なおすことが ある。"
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
    },
    "descriptions": {
      "zh-hans": "如果变为异常状态， 会拿出毅力， 攻击会提高。",
      "zh-hant": "陷入異常狀態時， 會拿出毅力， 攻擊會提高。",
      "en": "It's so gutsy that having a status condition boosts the Pokémon's Attack stat.",
      "ja": "じょうたい いじょうに なると こんじょうを だして こうげきが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "如果变为异常状态， 神奇鳞片会发生反应， 防御会提高。",
      "zh-hant": "陷入異常狀態時， 神奇鱗片會發生反應， 防禦會提高。",
      "en": "The Pokémon's marvelous scales boost its Defense stat if it has a status condition.",
      "ja": "じょうたい いじょうに なると ふしぎなうろこが はんのうして ぼうぎょが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "吸收了污泥浆的对手 会因强烈的恶臭 而受到伤害，减少ＨＰ。",
      "zh-hant": "吸收了污泥漿的對手 會因為強烈的惡臭而 使得ＨＰ減少。",
      "en": "The strong stench of the Pokémon's oozed liquid damages attackers that use HP-draining moves.",
      "ja": "ヘドロえきを すいとった あいては きょうれつな あくしゅうで ダメージを うけて ＨＰを へらす。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ减少的时候， 草属性的招式威力会提高。",
      "zh-hant": "ＨＰ減少的時候， 草屬性的招式威力會提高。",
      "en": "Powers up Grass-type moves when the Pokémon's HP is low.",
      "ja": "ＨＰが へったとき くさタイプの わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ减少的时候， 火属性的招式威力会提高。",
      "zh-hant": "ＨＰ減少的時候， 火屬性的招式威力會提高。",
      "en": "Powers up Fire-type moves when the Pokémon's HP is low.",
      "ja": "ＨＰが へったとき ほのおタイプの わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ减少的时候， 水属性的招式威力会提高。",
      "zh-hant": "ＨＰ減少的時候， 水屬性的招式威力會提高。",
      "en": "Powers up Water-type moves when the Pokémon's HP is low.",
      "ja": "ＨＰが へったとき みずタイプの わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ减少的时候， 虫属性的招式威力会提高。",
      "zh-hant": "ＨＰ減少的時候， 蟲屬性的招式威力會提高。",
      "en": "Powers up Bug-type moves when the Pokémon's HP is low.",
      "ja": "ＨＰが へったとき むしタイプの わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "即使使出会受反作用力伤害的招式， ＨＰ也不会减少。",
      "zh-hant": "即使使出會受反作用力傷害的招式， ＨＰ也不會減少。",
      "en": "Protects the Pokémon from recoil damage.",
      "ja": "はんどうを うける わざを だしても ＨＰが へらない。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 会将天气变为晴朗。",
      "zh-hant": "出場時， 會將天氣變為晴朗。",
      "en": "Turns the sunlight harsh when the Pokémon enters a battle.",
      "ja": "とうじょう したときに てんきを はれに する。"
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
    },
    "descriptions": {
      "zh-hans": "在战斗中让对手无法逃走。",
      "zh-hant": "在戰鬥中讓對手無法逃走。",
      "en": "Prevents opposing Pokémon from fleeing from battle.",
      "ja": "せんとうで あいてを にげられなくする。"
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
    },
    "descriptions": {
      "zh-hans": "通过激发出干劲， 不会变为睡眠状态。",
      "zh-hant": "透過激發出幹勁， 不會陷入睡眠狀態。",
      "en": "The Pokémon is full of vitality, and that prevents it from falling asleep.",
      "ja": "やるきを だすことに よって ねむり じょうたいに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "被白色烟雾保护着， 不会被对手降低能力。",
      "zh-hant": "被白色煙霧保護著， 不會被對手降低能力。",
      "en": "The Pokémon is protected by its white smoke, which prevents other Pokémon from lowering its stats.",
      "ja": "しろいけむりに まもられて あいてに のうりょくを さげられない。"
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
    },
    "descriptions": {
      "zh-hans": "因瑜伽的力量， 物理攻击的威力会变为２倍。",
      "zh-hant": "因瑜伽的力量， 物理攻擊的威力會變為２倍。",
      "en": "Using its pure power, the Pokémon doubles its Attack stat.",
      "ja": "ヨガの ちからで ぶつり こうげきの いりょくが ２ばいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "被坚硬的壳保护着， 对手的攻击不会击中要害。",
      "zh-hant": "被堅硬的殼保護著， 對手的攻擊不會擊中要害。",
      "en": "A hard shell protects the Pokémon from critical hits.",
      "ja": "かたい からに まもられ あいての こうげきが きゅうしょに あたらない。"
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
    },
    "descriptions": {
      "zh-hans": "所有天气的影响都会消失。",
      "zh-hant": "所有天氣的影響都會消失。",
      "en": "Eliminates the effects of weather.",
      "ja": "あらゆる てんきの えいきょうが きえて しまう。"
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
    },
    "descriptions": {
      "zh-hans": "在混乱状态时， 闪避率会提高。",
      "zh-hant": "陷入混亂狀態時， 閃避率會提高。",
      "en": "Boosts the Pokémon's evasiveness if it is confused.",
      "ja": "こんらん じょうたいの ときは かいひりつが アップする。"
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
    },
    "descriptions": {
      "zh-hans": "受到电属性的招式攻击时， 不会受到伤害，而是速度会提高。",
      "zh-hant": "受到電屬性的招式攻擊時， 不但不會受到傷害，反而速度會提高。",
      "en": "The Pokémon takes no damage when hit by Electric-type moves. Instead, its Speed stat is boosted.",
      "ja": "でんきタイプの わざを うけると ダメージを うけずに すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "面对性别相同的对手， 会燃起斗争心，变得更强。 而面对性别不同的，则会变弱。",
      "zh-hant": "面對性別相同的對手， 會燃起鬥爭心，變得更強。 面對性別不同的對手時則會變弱。",
      "en": "The Pokémon's competitive spirit makes it deal more damage to Pokémon of the same gender, but less damage to Pokémon of the opposite gender.",
      "ja": "せいべつが おなじだと とうそうしんを もやして つよくなる せいべつが ちがうと よわくなる"
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
    },
    "descriptions": {
      "zh-hans": "每次畏缩时， 不屈之心就会燃起， 速度也会提高。",
      "zh-hant": "每次畏縮時， 不屈之心就會燃起， 速度也會提高。",
      "en": "The Pokémon's determination boosts its Speed stat every time it flinches.",
      "ja": "ひるむ たびに ふくつのこころを もやして すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "冰雹天气时， 闪避率会提高。",
      "zh-hant": "天氣為冰雹時， 閃避率會提高。",
      "en": "Boosts the Pokémon's evasiveness in snow.",
      "ja": "てんきが あられのとき かいひりつが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "原本ＨＰ变得很少时才会吃树果， 在ＨＰ还有一半时就会把它吃掉。",
      "zh-hant": "原本ＨＰ變得很少時才會吃的樹果， 在ＨＰ還有一半時就會把它吃掉。",
      "en": "If the Pokémon is holding a Berry to be eaten when its HP is low, it will instead eat the Berry when its HP drops to half or less.",
      "ja": "ＨＰが すくなくなったら たべる きのみを ＨＰ はんぶんの ときに たべてしまう。"
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
    },
    "descriptions": {
      "zh-hans": "要害被击中时， 会大发雷霆， 攻击力变为最大。",
      "zh-hant": "要害被擊中時會大發雷霆。 攻擊力會提高到最大。",
      "en": "The Pokémon is angered when it takes a critical hit, and that maxes its Attack stat.",
      "ja": "きゅうしょに こうげきが あたると いかりくるって こうげきりょくが さいだいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "失去所持有的道具时， 速度会提高。",
      "zh-hant": "失去所持有的道具時， 速度會提高。",
      "en": "Boosts the Speed stat if the Pokémon's held item is used or lost.",
      "ja": "もっていた どうぐが なくなると すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "耐热的体质会 让火属性的招式威力减半。",
      "zh-hant": "靠著耐熱的體質， 讓火屬性的招式威力減半。",
      "en": "The Pokémon's heatproof body halves the damage taken from Fire-type moves.",
      "ja": "たいねつの からだに よって ほのおタイプの わざの ダメージを はんげんさせる"
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
    },
    "descriptions": {
      "zh-hans": "能力变化会变为平时的２倍。",
      "zh-hant": "能力變化會變為平時的２倍。",
      "en": "Doubles the effects of the Pokémon's stat changes.",
      "ja": "のうりょく へんかが いつもの ２ばいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "下雨天气时和受到水属性的招式时， ＨＰ会回复。晴朗天气时和受到火属性的 招式时，ＨＰ会减少。",
      "zh-hant": "下雨天氣時和受到水屬性的招式攻擊時， ＨＰ會回復。晴朗天氣時和受到火屬性的 招式攻擊時，ＨＰ會減少。",
      "en": "Restores the Pokémon's HP in rain or when it is hit by Water-type moves. Reduces HP in harsh sunlight, and increases the damage received from Fire-type moves.",
      "ja": "てんきが あめのときや みずタイプの わざで ＨＰが かいふくし はれのときや ほのおタイプの わざで へってしまう。"
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
    },
    "descriptions": {
      "zh-hans": "比较对手的防御和特防， 根据较低的那项能力 相应地提高自己的攻击或特攻。",
      "zh-hant": "比較對手的防禦和特防， 根據較低的那項能力 相應地提高自己的攻擊或特攻。",
      "en": "The Pokémon compares an opposing Pokémon's Defense and Sp. Def stats before raising its own Attack or Sp. Atk stat—whichever will be more effective.",
      "ja": "あいての ぼうぎょと とくぼうを くらべて ひくい ほうの のうりょくに あわせて じぶんの こうげきか とくこうを あげる。"
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
    },
    "descriptions": {
      "zh-hans": "使用拳类招式的威力会提高。",
      "zh-hant": "使用到拳頭的招式 威力會提高。",
      "en": "Powers up punching moves.",
      "ja": "パンチを つかう わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "变为中毒状态时， ＨＰ不会减少，反而会增加起来。",
      "zh-hant": "陷入中毒狀態時， ＨＰ不會減少，反而會漸漸增加。",
      "en": "If poisoned, the Pokémon has its HP restored instead of taking damage.",
      "ja": "どくじょうたいに なると ＨＰが へらずに ふえていく。"
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
    },
    "descriptions": {
      "zh-hans": "与自身同属性的招式 威力会提高。",
      "zh-hant": "與自身同屬性的招式 威力會提高。",
      "en": "Powers up moves of the same type as the Pokémon.",
      "ja": "じぶんと おなじ タイプの わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "如果使用连续招式， 总是能使出最高次数。",
      "zh-hant": "使用連續招式時， 每回都能以最多次數進行攻擊。",
      "en": "Maximizes the number of times multistrike moves hit.",
      "ja": "れんぞくわざを つかうと いつも さいこう かいすう だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "下雨天气时， 异常状态会治愈。",
      "zh-hant": "天氣為下雨時， 會治癒異常狀態。",
      "en": "Cures the Pokémon's status conditions in rain.",
      "ja": "てんきが あめのとき じょうたい いじょうが なおる。"
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
    },
    "descriptions": {
      "zh-hans": "晴朗天气时， 特攻会提高， 而每回合ＨＰ会减少。",
      "zh-hant": "天氣為晴朗時特攻會提高， 但每回合ＨＰ會減少。",
      "en": "In harsh sunlight, the Pokémon's Sp. Atk stat is boosted, but its HP decreases every turn.",
      "ja": "てんきが はれると とくこうが あがるが まいターン ＨＰが へる。"
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
    },
    "descriptions": {
      "zh-hans": "变为异常状态时， 速度会提高。",
      "zh-hant": "陷入異常狀態時， 速度會提高。",
      "en": "Boosts the Speed stat if the Pokémon has a status condition.",
      "ja": "じょうたい いじょうに なると すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "无论是什么属性的招式， 全部会变为一般属性。 威力会少量提高。",
      "zh-hant": "無論是什麼屬性的招式， 全部都會變為一般屬性。 威力會少量提高。",
      "en": "All the Pokémon’s moves become Normal type. The power of those moves is boosted a little.",
      "ja": "どんな タイプの わざでも すべて ノーマルタイプに なる。 いりょくが すこし あがる。"
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
    },
    "descriptions": {
      "zh-hans": "击中要害时， 威力会变得更强。",
      "zh-hant": "擊中要害時， 威力會進一步提高。",
      "en": "If the Pokémon's attack lands a critical hit, the attack is powered up even further.",
      "ja": "こうげきを きゅうしょに あてると いりょくが さらに あがる。"
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
    },
    "descriptions": {
      "zh-hans": "不会受到攻击以外的伤害。",
      "zh-hant": "不會受到攻擊以外的傷害。",
      "en": "The Pokémon only takes damage from attacks.",
      "ja": "こうげき いがいでは ダメージを うけない。"
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
    },
    "descriptions": {
      "zh-hans": "由于无防守战术， 双方使出的招式都必定会击中。",
      "zh-hant": "由於無防守戰術， 雙方使出的招式都必定會擊中。",
      "en": "The Pokémon employs no-guard tactics to ensure incoming and outgoing attacks always land.",
      "ja": "ノーガード せんぽうに よって おたがいの だす わざが かならず あたる ようになる。"
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
    },
    "descriptions": {
      "zh-hans": "使出招式的顺序 必定会变为最后。",
      "zh-hant": "使出招式的順序 必定會變為最後。",
      "en": "The Pokémon is always the last to use its moves.",
      "ja": "わざを だす じゅんばんが かならず さいごに なる。"
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
    },
    "descriptions": {
      "zh-hans": "攻击时可以将 低威力招式的威力提高。",
      "zh-hant": "可讓威力低的招式 提高威力來進行攻擊。",
      "en": "Powers up weak moves so the Pokémon can deal more damage with them.",
      "ja": "いりょくが ひくい わざの いりょくを たかくして こうげきできる。"
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
    },
    "descriptions": {
      "zh-hans": "晴朗天气时， 不会变为异常状态。",
      "zh-hant": "天氣為晴朗時， 不會陷入異常狀態。",
      "en": "Prevents status conditions in harsh sunlight.",
      "ja": "てんきが はれのときは じょうたい いじょうに ならない。"
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
    },
    "descriptions": {
      "zh-hans": "无法使用持有的道具。",
      "zh-hant": "無法使用持有的道具。",
      "en": "The Pokémon can't use any held items.",
      "ja": "もっている どうぐを つかうことが できない。"
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
    },
    "descriptions": {
      "zh-hans": "可以不受对手特性的干扰， 向对手使出招式。",
      "zh-hant": "可不受特性影響， 向對手使出招式。",
      "en": "The Pokémon's moves are unimpeded by the Ability of the target.",
      "ja": "あいての とくせいに じゃまされる ことなく あいてに わざを だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "因为拥有超幸运， 攻击容易击中对手的要害。",
      "zh-hant": "因為非常幸運， 容易擊中對手的要害。",
      "en": "The Pokémon is so lucky that the critical-hit ratios of its moves are boosted.",
      "ja": "きょううんを もっているため あいての きゅうしょに こうげきが あたりやすい。"
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
    },
    "descriptions": {
      "zh-hans": "变为濒死时， 会对接触到自己的对手造成伤害。",
      "zh-hant": "瀕死時， 會對接觸到自己的對手造成傷害。",
      "en": "Damages the attacker if it knocks out the Pokémon with a move that makes direct contact.",
      "ja": "ひんしに なったとき さわった あいてに ダメージを あたえる。"
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
    },
    "descriptions": {
      "zh-hans": "可以察觉到 对手拥有的危险招式。",
      "zh-hant": "察覺對手持有的 危險招式。",
      "en": "The Pokémon can sense an opposing Pokémon's dangerous moves.",
      "ja": "あいての もつ きけんな わざを さっちする ことができる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 只读取１个对手拥有的招式。",
      "zh-hant": "出場時，預見１個 對手持有的招式。",
      "en": "When it enters a battle, the Pokémon can tell one of the moves an opposing Pokémon has.",
      "ja": "とうじょう したとき あいての もつ わざを ひとつだけ よみとる。"
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
    },
    "descriptions": {
      "zh-hans": "可以无视对手能力的变化， 进行攻击。",
      "zh-hant": "可無視對手能力的變化， 進行攻擊。",
      "en": "When attacking, the Pokémon ignores the target's stat changes.",
      "ja": "あいての のうりょくの へんかを むしして こうげきが できる。"
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
    },
    "descriptions": {
      "zh-hans": "可以将效果不好的招式 以通常的威力使出。",
      "zh-hant": "可將效果不好的招式 以正常的威力使出。",
      "en": "The Pokémon can use “not very effective” moves to deal regular damage.",
      "ja": "こうかが いまひとつの わざを つうじょうの いりょくで だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "受到效果绝佳的攻击时， 可以减弱其威力。",
      "zh-hant": "受到效果絕佳的攻擊時， 可減弱其威力。",
      "en": "Reduces the power of supereffective attacks that hit the Pokémon.",
      "ja": "こうかばつぐんに なってしまう こうげきの いりょくを よわめる ことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "在５回合内， 攻击和速度减半。",
      "zh-hant": "在５回合內， 攻擊和速度會減半。",
      "en": "For five turns, the Pokémon's Attack and Speed stats are halved.",
      "ja": "５ターンの あいだ こうげきと すばやさが はんぶんに なる。"
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
    },
    "descriptions": {
      "zh-hans": "一般属性和格斗属性的招式 可以击中幽灵属性的宝可梦。",
      "zh-hant": "一般屬性和格鬥屬性的招式 可擊中幽靈屬性的寶可夢。",
      "en": "The Pokémon can hit Ghost-type Pokémon with Normal- and Fighting-type moves. It is also unaffected by Intimidate.",
      "ja": "ゴーストタイプの ポケモンに ノーマルタイプと かくとうタイプの わざを あてることが できる。"
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
    },
    "descriptions": {
      "zh-hans": "将水属性的招式引到自己身上， 不会受到伤害，而是会提高特攻。",
      "zh-hant": "將水屬性的招式引到自己身上， 不但不會受到傷害， 反而會提高特攻。",
      "en": "The Pokémon draws in all Water-type moves. Instead of taking damage from them, its Sp. Atk stat is boosted.",
      "ja": "みずタイプの わざを じぶんに よせつけ ダメージは うけずに とくこうが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "冰雹天气时， 会缓缓回复ＨＰ。",
      "zh-hant": "天氣為冰雹時， 會漸漸回復ＨＰ。",
      "en": "The Pokémon gradually regains HP in snow.",
      "ja": "てんきが あられのとき ＨＰを すこしずつ かいふく する。"
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
    },
    "descriptions": {
      "zh-hans": "受到效果绝佳的攻击时， 可以减弱其威力。",
      "zh-hant": "受到效果絕佳的攻擊時， 可減弱其威力。",
      "en": "Reduces the power of supereffective attacks that hit the Pokémon.",
      "ja": "こうかばつぐんに なってしまう こうげきの いりょくを よわめる ことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 会将天气变为冰雹。",
      "zh-hant": "出場時， 會將天氣變為冰雹。",
      "en": "The Pokémon makes it snow when it enters a battle.",
      "ja": "とうじょう したときに てんきを あられに する。"
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
    },
    "descriptions": {
      "zh-hans": "战斗结束时， 有时候会捡来甜甜蜜。",
      "zh-hant": "戰鬥結束時， 有時候會撿來甜甜蜜。",
      "en": "The Pokémon may gather Honey after a battle.",
      "ja": "せんとうが おわったとき あまいミツを ひろうことが ある。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 可以察觉对手的持有物。",
      "zh-hant": "出場時， 可以察覺對手的持有物。",
      "en": "When it enters a battle, the Pokémon can check an opposing Pokémon's held item.",
      "ja": "とうじょう したとき あいての もちものを みとおすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "自己会因反作用力受伤的招式， 其威力会提高。",
      "zh-hant": "會讓自己因反作用力而受傷的招式 威力會提高。",
      "en": "Powers up moves that have recoil damage.",
      "ja": "はんどうで ダメージを うける わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "自己的属性会根据持有的石板 或Ｚ纯晶的属性而改变。",
      "zh-hant": "自己的屬性會依持有的石板 或Ｚ純晶的屬性而改變。",
      "en": "Changes the Pokémon's type to match the plate it holds.",
      "ja": "もっている プレートや Ｚクリスタルの タイプによって じぶんの タイプが かわる。"
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
    },
    "descriptions": {
      "zh-hans": "晴朗天气时， 自己与同伴的攻击和 特防能力会提高。",
      "zh-hant": "天氣為晴朗時， 自己和同伴的攻擊和 特防能力會提高。",
      "en": "Boosts the Attack and Sp. Def stats of itself and allies in harsh sunlight.",
      "ja": "てんきが はれのとき じぶんと みかたの こうげきと とくぼうの のうりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "给予睡眠状态的对手伤害。",
      "zh-hant": "給予陷入睡眠狀態的對手傷害。",
      "en": "Damages opposing Pokémon that are asleep.",
      "ja": "ねむり じょうたいの あいてに ダメージを あたえる。"
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
    },
    "descriptions": {
      "zh-hans": "盗取接触到自己的 对手的道具。",
      "zh-hant": "盜取接觸到自己的 對手的道具。",
      "en": "The Pokémon steals the held item from attackers that made direct contact with it.",
      "ja": "さわられた あいての どうぐを ぬすんで しまう。"
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
    },
    "descriptions": {
      "zh-hans": "招式的追加效果消失， 但因此能以更高的威力使出招式。",
      "zh-hant": "招式會失去追加效果， 但可以用更高的威力使出招式。",
      "en": "Removes any additional effects from the Pokémon's moves, but increases the moves' power.",
      "ja": "わざの ついか こうかは なくなるが そのぶん たかい いりょくで わざを だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "能力的变化发生逆转， 原本提高时会降低， 而原本降低时会提高。",
      "zh-hant": "能力的變化會逆轉， 原本提高時會降低， 原本降低時會提高。",
      "en": "Reverses any stat changes affecting the Pokémon so that attempts to boost its stats instead lower them—and attempts to lower its stats will boost them.",
      "ja": "のうりょくの へんかが ぎゃくてんして あがるときに さがり さがるときに あがる。"
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
    },
    "descriptions": {
      "zh-hans": "让对手紧张， 使其无法食用树果。",
      "zh-hant": "讓對手感到緊張， 無法吃樹果。",
      "en": "Unnerves opposing Pokémon and makes them unable to eat Berries.",
      "ja": "あいてを きんちょうさせて きのみを たべられなく させる。"
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
    },
    "descriptions": {
      "zh-hans": "能力被降低时， 攻击会大幅提高。",
      "zh-hant": "能力被降低時， 攻擊會大幅提高。",
      "en": "If the Pokémon has any stat lowered by an opposing Pokémon, its Attack stat will be boosted sharply.",
      "ja": "のうりょくを さげられると こうげきが ぐーんと あがる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ减半时， 会变得软弱， 攻击和特攻会减半。",
      "zh-hant": "ＨＰ降到一半以下時， 會變得軟弱而使得 攻擊和特攻減半。",
      "en": "Halves the Pokémon’s Attack and Sp. Atk stats when its HP becomes half or less.",
      "ja": "ＨＰが はんぶんに なると よわきに なって こうげきと とくこうが はんげんする。"
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
    },
    "descriptions": {
      "zh-hans": "受到攻击时， 有时会把对手的招式 变为定身法状态。",
      "zh-hant": "受到攻擊時， 有時會把對手的招式 變為定身法狀態。",
      "en": "May disable a move that has dealt damage to the Pokémon.",
      "ja": "こうげきを うけると あいての わざを かなしばり じょうたいに することが ある。"
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
    },
    "descriptions": {
      "zh-hans": "有时会治愈异常状态的同伴。",
      "zh-hant": "有時會治癒同伴的異常狀態。",
      "en": "Sometimes cures the status conditions of the Pokémon's allies.",
      "ja": "じょうたい いじょうの みかたを たまに なおしてあげる。"
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
    },
    "descriptions": {
      "zh-hans": "可以减少我方的伤害。",
      "zh-hant": "可以減少我方受到的傷害。",
      "en": "Reduces damage dealt to allies.",
      "ja": "みかたの ダメージを へらすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "如果因物理招式受到伤害， 防御会降低， 速度会大幅提高。",
      "zh-hant": "因物理招式受到傷害時， 防禦會降低， 速度會大幅提高。",
      "en": "The Pokémon's Defense stat is lowered when it takes damage from physical moves, but its Speed stat is sharply boosted.",
      "ja": "ぶつりわざで ダメージを うけると ぼうぎょが さがり すばやさが ぐーんと あがる。"
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
    },
    "descriptions": {
      "zh-hans": "自身的重量会变为２倍。",
      "zh-hant": "自己的重量會變為２倍。",
      "en": "Doubles the Pokémon's weight.",
      "ja": "じぶんの おもさが ２ばいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "自身的重量会减半。",
      "zh-hant": "自己的重量會減半。",
      "en": "Halves the Pokémon's weight.",
      "ja": "じぶんの おもさが はんぶんに なる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ全满时， 受到的伤害会变少。",
      "zh-hant": "ＨＰ全滿時， 受到的傷害會變少。",
      "en": "Reduces the amount of damage the Pokémon takes while its HP is full.",
      "ja": "ＨＰが まんたんの ときに うける ダメージが すくなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "变为中毒状态时， 物理招式的威力会提高。",
      "zh-hant": "陷入中毒狀態時， 物理招式的威力會提高。",
      "en": "Powers up physical moves when the Pokémon is poisoned.",
      "ja": "どく じょうたいに なったとき ぶつりわざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "变为灼伤状态时， 特殊招式的威力会提高。",
      "zh-hant": "陷入灼傷狀態時， 特殊招式的威力會提高。",
      "en": "Powers up special moves when the Pokémon is burned.",
      "ja": "やけど じょうたいに なったとき とくしゅわざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "可以多次制作出 已被使用掉的树果。",
      "zh-hant": "可多次採收 已被使用過的樹果。",
      "en": "May create another Berry after one is used.",
      "ja": "つかった きのみを なんかいも つくりだす。"
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
    },
    "descriptions": {
      "zh-hans": "读取我方的攻击， 并闪避其招式伤害。",
      "zh-hant": "預測我方的攻擊， 並閃避其招式。",
      "en": "The Pokémon anticipates and dodges the attacks of its allies.",
      "ja": "みかたの こうげきを よみとって わざを かいひする。"
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
    },
    "descriptions": {
      "zh-hans": "每一回合，能力中的某项 会大幅提高，而某项会降低。",
      "zh-hant": "每一回合，能力中的某項 會大幅提高，相對地某項會降低。",
      "en": "Every turn, one of the Pokémon's stats will be boosted sharply but another stat will be lowered.",
      "ja": "まいターン のうりょくの どれかが ぐーんと あがって どれかが さがる。"
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
    },
    "descriptions": {
      "zh-hans": "不会受到沙暴或冰雹等的伤害。 不会受到粉末类招式的攻击。",
      "zh-hant": "不會受到沙暴或冰雹等的傷害。 不會受到粉末類招式的攻擊。",
      "en": "The Pokémon takes no damage from sandstorms. It is also protected from the effects of powders and spores.",
      "ja": "すなあらしや あられなどの ダメージを うけない。 こなの わざを うけない。"
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
    },
    "descriptions": {
      "zh-hans": "只通过接触就有可能 让对手变为中毒状态。",
      "zh-hant": "有時僅是接觸 就能讓對手中毒。",
      "en": "May poison a target when the Pokémon makes contact.",
      "ja": "さわる だけで あいてを どく じょうたいに することがある。"
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
    },
    "descriptions": {
      "zh-hans": "退回同行队伍后， ＨＰ会少量回复。",
      "zh-hant": "退回同行隊伍後， ＨＰ會少量回復。",
      "en": "The Pokémon has a little of its HP restored when withdrawn from battle.",
      "ja": "てもちに ひっこむと ＨＰが すこし かいふくする。"
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
    },
    "descriptions": {
      "zh-hans": "不会受到防御降低的效果。",
      "zh-hant": "不會受到降低防禦的效果影響。",
      "en": "Prevents the Pokémon from having its Defense stat lowered.",
      "ja": "ぼうぎょを さげる こうかを うけない。"
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
    },
    "descriptions": {
      "zh-hans": "沙暴天气时， 速度会提高。",
      "zh-hant": "天氣為沙暴時， 速度會提高。",
      "en": "Boosts the Pokémon's Speed stat in a sandstorm.",
      "ja": "てんきが すなあらし のとき すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "成为不易受到变化招式 攻击的身体。",
      "zh-hant": "不易受到變化類招式 攻擊的身體。",
      "en": "Makes status moves more likely to miss the Pokémon.",
      "ja": "へんかわざを うけにくい からだに なっている。"
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
    },
    "descriptions": {
      "zh-hans": "如果在最后使出招式， 招式的威力会提高。",
      "zh-hant": "如果在最後使出招式， 招式的威力就會變強。",
      "en": "Boosts the power of the Pokémon's move if it is the last to act that turn.",
      "ja": "いちばん さいごに わざを だすと わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "假扮成同行队伍中的 最后一只宝可梦出场， 迷惑对手。",
      "zh-hant": "假扮成同行隊伍中的 最後一隻寶可夢出場， 迷惑對手。",
      "en": "The Pokémon fools opponents by entering battle disguised as the last Pokémon in its Trainer's party.",
      "ja": "てもちの いちばん うしろに いる ポケモンに なりきって とうじょうして あいてを ばかす。"
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
    },
    "descriptions": {
      "zh-hans": "变身为当前面对的宝可梦。",
      "zh-hant": "變身為當前面對的寶可夢。",
      "en": "The Pokémon transforms itself into the Pokémon it's facing.",
      "ja": "めのまえの ポケモンに へんしん してしまう。"
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
    },
    "descriptions": {
      "zh-hans": "可以穿透对手的壁障 或替身进行攻击。",
      "zh-hant": "可穿透對手的屏障 或替身進行攻擊。",
      "en": "The Pokémon's moves are unaffected by the target's barriers, substitutes, and the like.",
      "ja": "あいての かべや みがわりを すりぬけて こうげき できる"
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
    },
    "descriptions": {
      "zh-hans": "被对手接触到后， 会将对手变为木乃伊。",
      "zh-hant": "被對手接觸到時， 會將對手變成木乃伊。",
      "en": "Contact with the Pokémon changes the attacker’s Ability to Mummy.",
      "ja": "あいてに さわられると あいてを ミイラに してしまう。"
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
    },
    "descriptions": {
      "zh-hans": "如果打倒对手， 就会充满自信，攻击会提高。",
      "zh-hant": "如果打倒對手， 會充滿自信並提高攻擊。",
      "en": "When the Pokémon knocks out a target, it shows moxie, which boosts its Attack stat.",
      "ja": "あいてを たおすと じしんが ついて こうげきが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "受到恶属性的招式攻击时， 因为正义感，攻击会提高。",
      "zh-hant": "受到惡屬性的招式攻擊時， 因為正義感，攻擊會提高。",
      "en": "When the Pokémon is hit by a Dark-type attack, its Attack stat is boosted by its sense of justice.",
      "ja": "あくタイプの こうげきを うけると せいぎかんで こうげきが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "受到恶属性、幽灵属性 和虫属性的招式攻击时， 会因胆怯而速度提高。",
      "zh-hant": "受到惡屬性、幽靈屬性 和蟲屬性的招式攻擊時， 會因膽怯而使得速度提高。",
      "en": "The Pokémon gets scared when hit by a Dark-, Ghost-, or Bug-type attack or if intimidated, which boosts its Speed stat.",
      "ja": "あくタイプと ゴーストタイプと むしタイプの わざを うけると びびって すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "可以不受到由对手使出的 变化招式影响，并将其反弹。",
      "zh-hant": "可不受到由對手使出的 變化類招式所影響，並將其反彈。",
      "en": "The Pokémon reflects status moves instead of getting hit by them.",
      "ja": "あいてに だされた へんかわざを うけずに そのまま かえす ことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "受到草属性的招式攻击时， 不会受到伤害，而是攻击会提高。",
      "zh-hant": "受到草屬性的招式攻擊時， 不但不會受到傷害，反而攻擊會提高。",
      "en": "The Pokémon takes no damage when hit by Grass-type moves. Instead, its Attack stat is boosted.",
      "ja": "くさタイプの わざを うけると ダメージを うけずに こうげきが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "可以率先使出变化招式。",
      "zh-hant": "可以搶先使出變化類招式。",
      "en": "Gives priority to the Pokémon's status moves.",
      "ja": "へんかわざを せんせいで だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "沙暴天气时， 岩石属性、地面属性 和钢属性的招式威力会提高。",
      "zh-hant": "天氣為沙暴時， 岩石屬性、地面屬性 和鋼屬性招式的威力會提高。",
      "en": "Boosts the power of Rock-, Ground-, and Steel-type moves in a sandstorm.",
      "ja": "てんきが すなあらしの とき いわタイプと じめんタイプと はがねタイプの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "用铁刺给予接触到自己的 对手伤害。",
      "zh-hant": "用鐵刺給予接觸到自己的 對手傷害。",
      "en": "Inflicts damage on the attacker upon contact with iron barbs.",
      "ja": "じぶんに さわった あいてに てつのトゲで ダメージを あたえる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ变为一半以下时， 样子会改变。",
      "zh-hant": "ＨＰ變為一半以下時， 樣子會改變。",
      "en": "Changes the Pokémon’s shape when HP is half or less.",
      "ja": "ＨＰが はんぶん いかに なると すがたが へんかする。"
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
    },
    "descriptions": {
      "zh-hans": "自己和同伴的命中率会提高。",
      "zh-hant": "自己和同伴的命中率會提高。",
      "en": "Boosts the accuracy of its allies and itself.",
      "ja": "じぶんや みかたの めいちゅうりつが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "可以不受对手特性的干扰， 向对手使出招式。",
      "zh-hant": "可以不受對手特性的干擾， 向對手使出招式。",
      "en": "The Pokémon's moves are unimpeded by the Ability of the target.",
      "ja": "あいての とくせいに じゃまされず あいてに わざを だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "可以不受对手特性的干扰， 向对手使出招式。",
      "zh-hant": "可以不受對手特性的干擾， 向對手使出招式。",
      "en": "The Pokémon's moves are unimpeded by the Ability of the target.",
      "ja": "あいての とくせいに じゃまされず あいてに わざを だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "可以防住向自己和同伴 发出的心灵攻击。",
      "zh-hant": "可防住向自己和同伴 發出的心靈攻擊。",
      "en": "Protects the Pokémon and its allies from effects that prevent the use of moves.",
      "ja": "じぶんと みかたへの メンタル こうげきを ふせぐことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "我方的草属性宝可梦 能力不会降低， 也不会变为异常状态。",
      "zh-hant": "我方的草屬性寶可夢 能力不會降低。 也不會陷入異常狀態。",
      "en": "Ally Grass-type Pokémon are protected from status conditions and the lowering of their stats.",
      "ja": "みかたの くさポケモンは のうりょくが さがらず じょうたい いじょうにも ならない。"
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
    },
    "descriptions": {
      "zh-hans": "无论是哪种树果， 食用后，ＨＰ都会回复。",
      "zh-hant": "無論是哪種樹果， 吃下去後ＨＰ都會回復。",
      "en": "The Pokémon's HP is restored when it eats any Berry, in addition to the Berry's usual effect.",
      "ja": "どんな きのみでも たべると ＨＰも かいふくする。"
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
    },
    "descriptions": {
      "zh-hans": "变为与自己使出的招式 相同的属性。",
      "zh-hant": "變為與自己使出的招式 相同的屬性。",
      "en": "Changes the Pokémon's type to the type of the move it's about to use. This works only once each time the Pokémon enters battle.",
      "ja": "じぶんが だす わざと おなじ タイプに へんかする。"
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
    },
    "descriptions": {
      "zh-hans": "对手给予的物理招式的 伤害会减半。",
      "zh-hant": "對手的物理招式造成的 傷害會減半。",
      "en": "Halves the damage from physical moves.",
      "ja": "あいてから うける ぶつりわざの ダメージが はんぶんに なる。"
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
    },
    "descriptions": {
      "zh-hans": "夺走被自己的招式 击中的对手的道具。",
      "zh-hant": "奪走被自己招式 擊中的對手的道具。",
      "en": "The Pokémon steals the held item from any target it hits with a move.",
      "ja": "わざを あてた あいての どうぐを うばってしまう。"
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
    },
    "descriptions": {
      "zh-hans": "可以防住对手的 球和弹类招式。",
      "zh-hant": "可防住對手的 球和彈類的招式。",
      "en": "Protects the Pokémon from ball and bomb moves.",
      "ja": "あいての たまや ばくだんなどの わざを ふせぐことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "如果能力被降低， 特攻就会大幅提高。",
      "zh-hant": "能力被降低時， 特攻會大幅提高。",
      "en": "Boosts the Pokémon's Sp. Atk stat sharply when its stats are lowered by an opposing Pokémon.",
      "ja": "のうりょくを さげられると とくこうが ぐーんと あがる。"
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
    },
    "descriptions": {
      "zh-hans": "因为颚部强壮， 啃咬类招式的威力会提高。",
      "zh-hant": "顎部強壯， 會提高啃咬類招式的威力。",
      "en": "The Pokémon's strong jaw boosts the power of its biting moves.",
      "ja": "あごが がんじょうで かむ わざの いりょくが たかくなる。"
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
    },
    "descriptions": {
      "zh-hans": "一般属性的招式 会变为冰属性。 威力会少量提高。",
      "zh-hant": "一般屬性的招式 會變為冰屬性。 威力會少量提高。",
      "en": "Normal-type moves become Ice-type moves. The power of those moves is boosted a little.",
      "ja": "ノーマルタイプの わざが こおりタイプになる。 いりょくが すこし あがる。"
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
    },
    "descriptions": {
      "zh-hans": "我方的宝可梦 不会变为睡眠状态。",
      "zh-hant": "我方的寶可夢 不會陷入睡眠狀態。",
      "en": "Prevents the Pokémon and its allies from falling asleep.",
      "ja": "みかたの ポケモンは ねむらなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "如果使出攻击招式，会变为刀剑形态， 如果使出招式“王者盾牌”， 会变为盾牌形态。",
      "zh-hant": "若使出攻擊招式，會變為刀劍形態， 若使出招式「王者盾牌」， 會變為盾牌形態。",
      "en": "The Pokémon changes its form to Blade Forme when it uses an attack move and changes to Shield Forme when it uses King’s Shield.",
      "ja": "こうげきわざを だすと ブレードフォルムに わざ キングシールドを だすと シールドフォルムに へんかする。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ全满时， 飞行属性的招式可以率先使出。",
      "zh-hant": "ＨＰ全滿時， 可以搶先在對手之前 使出飛行屬性的招式。",
      "en": "Gives priority to the Pokémon's Flying-type moves while its HP is full.",
      "ja": "ＨＰが まんたん だと ひこうタイプの わざを せんせいで だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "波动和波导类招式的 威力会提高。",
      "zh-hant": "波動和波導類招式的 威力會提高。",
      "en": "Powers up pulse moves.",
      "ja": "はどうの わざの いりょくが たかくなる。"
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
    },
    "descriptions": {
      "zh-hans": "在青草场地时， 防御会提高。",
      "zh-hant": "在青草場地時， 防禦會提高。",
      "en": "Boosts the Pokémon's Defense stat on Grassy Terrain.",
      "ja": "グラスフィールドのとき ぼうぎょが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "同伴使用道具时， 会把自己持有的道具传递给同伴。",
      "zh-hant": "同伴使用道具時， 會把自己持有的道具交給同伴。",
      "en": "The Pokémon passes its held item to an ally that has used up an item.",
      "ja": "みかたが どうぐを つかうと じぶんの もっている どうぐを みかたに わたす。"
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
    },
    "descriptions": {
      "zh-hans": "接触到对手的招式 威力会提高。",
      "zh-hant": "接觸到對手的招式 威力會提高。",
      "en": "Powers up moves that make direct contact.",
      "ja": "あいてに せっしょくする わざの いりょくが たかくなる。"
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
    },
    "descriptions": {
      "zh-hans": "一般属性的招式 会变为妖精属性。 威力会少量提高。",
      "zh-hant": "一般屬性的招式 會變為妖精屬性。 威力會少量提高。",
      "en": "Normal-type moves become Fairy-type moves. The power of those moves is boosted a little.",
      "ja": "ノーマルタイプの わざが フェアリータイプになる。 いりょくが すこし あがる。"
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
    },
    "descriptions": {
      "zh-hans": "对于用攻击接触到自己的对手， 会降低其速度。",
      "zh-hant": "對手用攻擊接觸到自己時， 降低此對手的速度。",
      "en": "Contact with the Pokémon lowers the attacker's Speed stat.",
      "ja": "こうげきで じぶんに ふれた あいての すばやさを さげる。"
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
    },
    "descriptions": {
      "zh-hans": "一般属性的招式 会变为飞行属性。 威力会少量提高。",
      "zh-hant": "一般屬性的招式 會變為飛行屬性。 威力會少量提高。",
      "en": "Normal-type moves become Flying-type moves. The power of those moves is boosted a little.",
      "ja": "ノーマルタイプの わざが ひこうタイプになる。 いりょくが すこし あがる。"
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
    },
    "descriptions": {
      "zh-hans": "亲子俩可以合计攻击２次。",
      "zh-hant": "親子倆可合計攻擊２次。",
      "en": "Parent and child each attacks.",
      "ja": "おやこ ２ひきで ２かい こうげきする ことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "全体的恶属性招式变强。",
      "zh-hant": "全體的惡屬性招式變強。",
      "en": "Powers up each Pokémon’s Dark-type moves.",
      "ja": "ぜんいんの あくタイプの わざが つよくなる。"
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
    },
    "descriptions": {
      "zh-hans": "全体的妖精属性招式变强。",
      "zh-hant": "全體的妖精屬性招式變強。",
      "en": "Powers up each Pokémon’s Fairy-type moves.",
      "ja": "ぜんいんの フェアリータイプの わざが つよくなる。"
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
    },
    "descriptions": {
      "zh-hans": "让气场的效果发生逆转， 降低威力。",
      "zh-hant": "讓氣場的效果逆轉， 並降低威力。",
      "en": "The effects of “Aura” Abilities are reversed to lower the power of affected moves.",
      "ja": "オーラの こうかを ぎゃくてんさせて いりょくを さげる。"
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
    },
    "descriptions": {
      "zh-hans": "变为不会受到 火属性攻击的天气。",
      "zh-hant": "變為讓火屬性攻擊 失效的天氣。",
      "en": "The Pokémon changes the weather to nullify Fire-type attacks.",
      "ja": "ほのおタイプの こうげきを うけない てんきにする。"
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
    },
    "descriptions": {
      "zh-hans": "变为不会受到 水属性攻击的天气。",
      "zh-hant": "變為讓水屬性攻擊 失效的天氣。",
      "en": "The Pokémon changes the weather to nullify Water-type attacks.",
      "ja": "みずタイプの こうげきを うけない てんきにする。"
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
    },
    "descriptions": {
      "zh-hans": "变为令飞行属性的弱点 消失的天气。",
      "zh-hant": "變為令飛行屬性的弱點 消失的天氣。",
      "en": "The Pokémon changes the weather to eliminate all of the Flying type’s weaknesses.",
      "ja": "ひこうタイプの じゃくてんが なくなる てんきにする。"
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
    },
    "descriptions": {
      "zh-hans": "受到攻击时， 防御会提高。",
      "zh-hant": "受到攻擊時， 防禦會提高。",
      "en": "Boosts the Defense stat when the Pokémon is hit by an attack.",
      "ja": "こうげきを うけると ぼうぎょが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ变为一半时， 会慌慌张张逃走， 退回同行队伍中。",
      "zh-hant": "ＨＰ變為一半時， 會慌慌張張逃走， 退回同行隊伍裡面。",
      "en": "The Pokémon cowardly switches out when its HP becomes half or less.",
      "ja": "ＨＰが はんぶんに なると あわてて にげだして てもちに ひっこんで しまう。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ变为一半时， 为了回避危险， 会退回到同行队伍中。",
      "zh-hant": "ＨＰ減到一半時， 為了避開危險， 會退回同行隊伍裡面。",
      "en": "The Pokémon, sensing danger, switches out when its HP becomes half or less.",
      "ja": "ＨＰが はんぶんに なると きけんを かいひするため てもちに ひっこんで しまう。"
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
    },
    "descriptions": {
      "zh-hans": "受到水属性的招式攻击时， 防御会大幅提高。",
      "zh-hant": "受到水屬性的招式攻擊時， 防禦會大幅提高。",
      "en": "Boosts the Defense stat sharply when the Pokémon is hit by a Water-type move.",
      "ja": "みずタイプの わざを うけると ぼうぎょが ぐーんと あがる。"
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
    },
    "descriptions": {
      "zh-hans": "攻击中毒状态的对手时， 必定会击中要害。",
      "zh-hant": "攻擊中毒狀態的對手時， 必定會擊中要害。",
      "en": "The Pokémon's attacks become critical hits if the target is poisoned.",
      "ja": "どく じょうたいの あいてを こうげきすると かならず きゅうしょに あたる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ变为一半时， 壳会坏掉，变得有攻击性。",
      "zh-hant": "ＨＰ變為一半時， 殼會壞掉，變得更有攻擊性。",
      "en": "When its HP drops to half or less, the Pokémon's shell breaks and it becomes aggressive.",
      "ja": "ＨＰが はんぶんに なると からが こわれて こうげきてきに なる。"
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
    },
    "descriptions": {
      "zh-hans": "可以对替换出场的对手 以２倍的伤害进行攻击。",
      "zh-hant": "可以向替換出場的對手 以２倍的傷害進行攻擊。",
      "en": "Doubles the damage dealt to a target that has just switched into battle.",
      "ja": "こうたいで でてきた あいてに ２ばいの ダメージで こうげき できる。"
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
    },
    "descriptions": {
      "zh-hans": "降低自己受到的火属性 招式的威力，不会灼伤。",
      "zh-hant": "降低自己受到的火屬性 招式的威力。不會灼傷。",
      "en": "Lowers the power of Fire-type moves that hit the Pokémon and prevents it from being burned.",
      "ja": "じぶんに たいする ほのおタイプの わざの いりょくを さげる。 やけど しない。"
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
    },
    "descriptions": {
      "zh-hans": "钢属性的招式威力会提高。",
      "zh-hant": "鋼屬性的招式威力會提高。",
      "en": "Powers up Steel-type moves.",
      "ja": "はがねタイプの わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "因对手的攻击 ＨＰ变为一半时， 特攻会提高。",
      "zh-hant": "ＨＰ因對手的攻擊 降到一半時， 特攻會提高。",
      "en": "Boosts the Pokémon's Sp. Atk stat when it takes a hit that causes its HP to drop to half or less.",
      "ja": "あいての こうげきで ＨＰが はんぶんに なると とくこうが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "冰雹天气时， 速度会提高。",
      "zh-hant": "天氣為冰雹時， 速度會提高。",
      "en": "Boosts the Pokémon's Speed stat in snow.",
      "ja": "てんきが あられ のとき すばやさが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "可以不接触对手 就使出所有的招式。",
      "zh-hant": "可以不接觸對手 就使出所有的招式。",
      "en": "The Pokémon uses its moves without making contact with the target.",
      "ja": "すべての わざを あいてに せっしょく しないで だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "所有的声音招式 都变为水属性。",
      "zh-hant": "所有的聲音招式 都變為水屬性。",
      "en": "Sound-based moves become Water-type moves.",
      "ja": "すべての おとわざが みずタイプに なる。"
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
    },
    "descriptions": {
      "zh-hans": "可以率先使出回复招式。",
      "zh-hant": "可以搶先使出回復招式。",
      "en": "Gives priority to the Pokémon's healing moves.",
      "ja": "かいふくわざを せんせいで だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "一般属性的招式 会变为电属性。 威力会少量提高。",
      "zh-hant": "一般屬性的招式 會變為電屬性。 威力會少量提高。",
      "en": "Normal-type moves become Electric-type moves. The power of those moves is boosted a little.",
      "ja": "ノーマルタイプの わざが でんきタイプになる。 いりょくが すこし あがる。"
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
    },
    "descriptions": {
      "zh-hans": "电气场地时， 速度会变为２倍。",
      "zh-hant": "電氣場地時， 速度會變為２倍。",
      "en": "Doubles the Pokémon's Speed stat on Electric Terrain.",
      "ja": "エレキフィールド のとき すばやさが ２ばいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ多的时候会聚起来变强。 ＨＰ剩余量变少时， 群体会分崩离析。",
      "zh-hant": "ＨＰ多的時候會聚起來變強。 ＨＰ剩餘量變少時， 群體會分崩離析。",
      "en": "When it has a lot of HP, the Pokémon forms a powerful school. It stops schooling when its HP is low.",
      "ja": "ＨＰが おおいときは むれて つよくなる。 ＨＰの のこりが すくなくなると むれは ちりぢりに なってしまう。"
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
    },
    "descriptions": {
      "zh-hans": "通过画皮覆盖住身体， 可以防住１次攻击。",
      "zh-hant": "用畫皮覆蓋住身體， 可防住１次攻擊。",
      "en": "Once per battle, the shroud that covers the Pokémon can protect it from an attack.",
      "ja": "からだを おおう ばけのかわで １かい こうげきを ふせぐことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "打倒对手时，与训练家的牵绊会增强， 变为小智版甲贺忍蛙。 飞水手里剑的招式威力会增强。",
      "zh-hant": "打倒對手時，與訓練家的牽絆會加深， 變化成小智版甲賀忍蛙。 飛水手裡劍的威力會增強。",
      "en": "When the Pokémon knocks out a target, its bond with its Trainer is strengthened, and its Attack, Sp. Atk, and Speed stats are boosted.",
      "ja": "あいてを たおすと トレーナーとの きずなが ふかまり サトシゲッコウガに へんげする。みずしゅりけんが つよくなる。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ变为一半时， 细胞们会赶来支援， 变为完全体形态。",
      "zh-hant": "ＨＰ變為一半時， 細胞們會趕來支援， 變為完全體形態。",
      "en": "Other Cells gather to aid when its HP becomes half or less. Then the Pokémon changes its form to Complete Forme.",
      "ja": "ＨＰが はんぶんに なると セルたちが おうえんに かけつけ パーフェクトフォルムに すがたを かえる。"
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
    },
    "descriptions": {
      "zh-hans": "可以使钢属性和毒属性的宝可梦 也陷入中毒状态。",
      "zh-hant": "就算對方是鋼屬性或毒屬性寶可夢， 也可讓對方陷入中毒狀態。",
      "en": "The Pokémon can poison the target even if it's a Steel or Poison type.",
      "ja": "はがねタイプや どくタイプも どく じょうたいに することが できる。"
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
    },
    "descriptions": {
      "zh-hans": "总是半梦半醒的状态， 绝对不会醒来。 可以就这么睡着进行攻击。",
      "zh-hant": "總是半夢半醒的狀態， 絕對不會醒來。 可在睡著的狀況下進行攻擊。",
      "en": "The Pokémon is always drowsing and will never wake up. It can attack while in its sleeping state.",
      "ja": "つねに ゆめうつつの じょうたいで ぜったいに めざめない。 ねむったまま こうげきが できる。"
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
    },
    "descriptions": {
      "zh-hans": "向对手施加威慑力， 使其无法对我方使出先制招式。",
      "zh-hant": "向對手施加威懾力， 使其無法對我方使出先制招式。",
      "en": "When the Pokémon uses Surf or Dive, it will come back with prey. When it takes damage, it will spit out the prey to attack.",
      "ja": "あいてに いあつかんを あたえ こちらに むかって せんせいわざを だせない ようにする。"
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
    },
    "descriptions": {
      "zh-hans": "被对手打倒的时候， 会给予对手相当于 ＨＰ剩余量的伤害。",
      "zh-hant": "被對手打倒的時候， 會給予對手相當於 ＨＰ剩餘量的傷害。",
      "en": "Damages the attacker landing the finishing hit by the amount equal to its last HP.",
      "ja": "あいてに たおされたとき ＨＰの のこりの ぶんだけ あいてに ダメージを あたえる。"
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
    },
    "descriptions": {
      "zh-hans": "有谁使出跳舞招式时， 自己也能就这么接着使出跳舞招式。",
      "zh-hant": "當有誰使出跳舞招式時， 自己也能接著使出跳舞招式。",
      "en": "Whenever a dance move is used in battle, the Pokémon will copy the user to immediately perform that dance move itself.",
      "ja": "だれかが おどりわざを つかうと じぶんも それに つづいて おどりわざを だすことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "会提高我方的 特殊招式的威力。",
      "zh-hant": "會提高我方的 特殊招式的威力。",
      "en": "Powers up ally Pokémon's special moves.",
      "ja": "みかたの とくしゅわざの いりょくを あげる。"
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
    },
    "descriptions": {
      "zh-hans": "会将对手所给予的接触类招式的伤害减半， 但火属性招式的伤害会变为２倍。",
      "zh-hant": "會將對手所給予的接觸類招式的傷害減半， 但火屬性招式的傷害會變為２倍。",
      "en": "Halves the damage taken from moves that make direct contact, but doubles that of Fire-type moves.",
      "ja": "あいてから うけた せっしょくする わざの ダメージを はんげんするが ほのおタイプの わざの ダメージは ２ばいになる。"
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
    },
    "descriptions": {
      "zh-hans": "让对手吓一跳， 使其无法对我方使出先制招式。",
      "zh-hant": "讓對手嚇一跳， 使其無法對我方使出先制招式。",
      "en": "The Pokémon dazzles its opponents, making them unable to use priority moves against the Pokémon or its allies.",
      "ja": "あいてを びっくり させて こちらに むかって せんせいわざを だせない ようにする。"
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
    },
    "descriptions": {
      "zh-hans": "宝可梦每次变为濒死状态时， 特攻会提高。",
      "zh-hant": "每當場上有寶可夢 陷入瀕死狀態時， 特攻就會提高。",
      "en": "Boosts the Pokémon's Sp. Atk stat every time another Pokémon faints.",
      "ja": "ポケモンが ひんしに なるたびに とくこうが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "对于用攻击接触到自己的对手， 会降低其速度。",
      "zh-hant": "對手用攻擊接觸到自己時， 降低此對手的速度。",
      "en": "Contact with the Pokémon lowers the attacker's Speed stat.",
      "ja": "こうげきで じぶんに ふれた あいての すばやさを さげる。"
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
    },
    "descriptions": {
      "zh-hans": "继承被打倒的同伴的特性， 变为相同的特性。",
      "zh-hant": "繼承被打倒的同伴的特性， 變為相同的特性。",
      "en": "The Pokémon copies the Ability of a defeated ally.",
      "ja": "たおされた みかたの とくせいを うけついで おなじ とくせいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "继承被打倒的同伴的特性， 变为相同的特性。",
      "zh-hant": "繼承被打倒的同伴的特性， 變為相同的特性。",
      "en": "The Pokémon copies the Ability of a defeated ally.",
      "ja": "たおされた みかたの とくせいを うけつぎ おなじ とくせいに かわる。"
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
    },
    "descriptions": {
      "zh-hans": "打倒对手的时候， 自己最高的那项能力会提高。",
      "zh-hant": "打倒對手的時候， 會提高自己最高的那項能力。",
      "en": "The Pokémon boosts its most proficient stat each time it knocks out a Pokémon.",
      "ja": "あいてを たおしたとき じぶんの いちばん たかい のうりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "根据持有的存储碟， 自己的属性会改变。",
      "zh-hant": "根據持有的記憶碟， 自己的屬性會改變。",
      "en": "Changes the Pokémon’s type to match the memory disc it holds.",
      "ja": "もっている メモリで じぶんの タイプが かわる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 会布下电气场地。",
      "zh-hant": "出場時， 會布下電氣場地。",
      "en": "Turns the ground into Electric Terrain when the Pokémon enters a battle.",
      "ja": "とうじょう したときに エレキフィールドを はりめぐらせる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 会布下精神场地。",
      "zh-hant": "出場時， 會布下精神場地。",
      "en": "Turns the ground into Psychic Terrain when the Pokémon enters a battle.",
      "ja": "とうじょう したときに サイコフィールドを はりめぐらせる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 会布下薄雾场地。",
      "zh-hant": "出場時， 會布下薄霧場地。",
      "en": "Turns the ground into Misty Terrain when the Pokémon enters a battle.",
      "ja": "とうじょう したときに ミストフィールドを はりめぐらせる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 会布下青草场地。",
      "zh-hant": "出場時， 會布下青草場地。",
      "en": "Turns the ground into Grassy Terrain when the Pokémon enters a battle.",
      "ja": "とうじょう したときに グラスフィールドを はりめぐらせる。"
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
    },
    "descriptions": {
      "zh-hans": "不会因为对手的招式或特性 而被降低能力。",
      "zh-hant": "不會因對手的招式或特性 而被降低能力。",
      "en": "Prevents other Pokémon’s moves or Abilities from lowering the Pokémon’s stats.",
      "ja": "あいての わざや とくせいで のうりょくを さげられない。"
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
    },
    "descriptions": {
      "zh-hans": "ＨＰ全满时， 受到的伤害会变少。",
      "zh-hant": "ＨＰ全滿時， 受到的傷害會變少。",
      "en": "Reduces the amount of damage the Pokémon takes while its HP is full.",
      "ja": "ＨＰが まんたんの ときに うける ダメージが すくなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "受到效果绝佳的攻击时， 可以减弱其威力。",
      "zh-hant": "受到效果絕佳的攻擊時， 可減弱其威力。",
      "en": "Reduces the power of supereffective attacks taken.",
      "ja": "こうかばつぐんに なってしまう こうげきの いりょくを よわめる ことが できる。"
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
    },
    "descriptions": {
      "zh-hans": "效果绝佳的攻击， 威力会变得更强。",
      "zh-hant": "可進一步提升 效果絕佳招式的威力。",
      "en": "Powers up moves that are super effective.",
      "ja": "こうかばつぐんの こうげきで いりょくが さらに あがる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 攻击会提高。",
      "zh-hant": "出場時， 攻擊會提高。",
      "en": "Boosts the Pokémon’s Attack stat the first time the Pokémon enters a battle.",
      "ja": "とうじょう したときに こうげきが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时， 防御会提高。",
      "zh-hant": "出場時， 防禦會提高。",
      "en": "Boosts the Pokémon’s Defense stat the first time the Pokémon enters a battle.",
      "ja": "とうじょう したときに ぼうぎょが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "变为与自己使出的招式 相同的属性。",
      "zh-hant": "變為與自己使出的招式 相同的屬性。",
      "en": "Changes the Pokémon's type to the type of the move it's about to use. This works only once each time the Pokémon enters battle.",
      "ja": "じぶんが だす わざと おなじ タイプに へんかする。"
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
    },
    "descriptions": {
      "zh-hans": "没有携带道具时， 会拾取第１个投出后 捕捉失败的精灵球。",
      "zh-hant": "當寶可夢沒有攜帶道具時， 會撿回第１個投出後 捕捉失敗的精靈球。",
      "en": "If the Pokémon is not holding an item, it will fetch the Poké Ball from the first failed throw of the battle.",
      "ja": "どうぐを もっていない ばあい １かいめに なげて しっぱい した モンスターボールを ひろってくる。"
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
    },
    "descriptions": {
      "zh-hans": "受到攻击后撒下棉絮， 降低除自己以外的 所有宝可梦的速度。",
      "zh-hant": "受到攻擊時會撒下棉絮， 降低除自己以外的 所有寶可夢的速度。",
      "en": "When the Pokémon is hit by an attack, it scatters cotton fluff around and lowers the Speed stat of all Pokémon except itself.",
      "ja": "こうげきを うけると わたげを ばらまいて じぶんいがいの ポケモン すべての すばやさを さげる。"
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
    },
    "descriptions": {
      "zh-hans": "能无视具有吸引 对手招式效果的 特性或招式的影响。",
      "zh-hant": "能無視具有吸引 對手招式效果的 特性或招式的影響。",
      "en": "Ignores the effects of opposing Pokémon's Abilities and moves that draw in moves.",
      "ja": "あいての わざを ひきうける とくせいや わざの えいきょうを むし できる。"
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
    },
    "descriptions": {
      "zh-hans": "只反弹自己受到的 能力降低效果。",
      "zh-hant": "只反彈自己受到的 能力降低效果。",
      "en": "Bounces back only the stat-lowering effects that the Pokémon receives.",
      "ja": "じぶんが うけた のうりょく ダウンの こうか だけを はねかえす。"
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
    },
    "descriptions": {
      "zh-hans": "冲浪或潜水时会叼来猎物。 受到伤害时， 会吐出猎物进行攻击。",
      "zh-hant": "衝浪或潛水時會叼來獵物。 當受到傷害時， 會吐出獵物攻擊對手。",
      "en": "When the Pokémon uses Surf or Dive, it will come back with prey. When it takes damage, it will spit out the prey to attack.",
      "ja": "なみのりか ダイビングを すると えものを くわえてくる。 ダメージを うけると えものを はきだして こうげき。"
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
    },
    "descriptions": {
      "zh-hans": "能无视具有吸引 对手招式效果的 特性或招式的影响。",
      "zh-hant": "能無視具有吸引 對手招式效果的 特性或招式的影響。",
      "en": "Ignores the effects of opposing Pokémon's Abilities and moves that draw in moves.",
      "ja": "あいての わざを ひきうける とくせいや わざの えいきょうを むし できる。"
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
    },
    "descriptions": {
      "zh-hans": "受到水属性或 火属性的招式攻击时， 速度会巨幅提高。",
      "zh-hant": "受到水屬性或 火屬性招式攻擊時， 速度會極大幅提高。",
      "en": "Boosts the Speed stat drastically when the Pokémon is hit by a Fire- or Water-type move.",
      "ja": "みずタイプ ほのおタイプの わざを うけると すばやさが ぐぐーんと あがる。"
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
    },
    "descriptions": {
      "zh-hans": "声音招式的威力会提高。 受到的声音招式伤害会减半。",
      "zh-hant": "聲音招式的威力會提高。 受到聲音招式的傷害會減半。",
      "en": "Boosts the power of sound-based moves. The Pokémon also takes half the damage from these kinds of moves.",
      "ja": "おとわざの いりょくが あがる。 うけた おとわざの ダメージは はんぶんに なる。"
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
    },
    "descriptions": {
      "zh-hans": "受到攻击时， 会刮起沙暴。",
      "zh-hant": "受到攻擊時， 會刮起沙暴。",
      "en": "The Pokémon creates a sandstorm when it's hit by an attack.",
      "ja": "こうげきを うけると すなあらしを おこす。"
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
    },
    "descriptions": {
      "zh-hans": "由于有冰鳞粉的守护， 受到的特殊攻击伤害会减半。",
      "zh-hant": "得到冰鱗粉的守護， 受到的特殊攻擊傷害會減半。",
      "en": "The Pokémon is protected by ice scales, which halve the damage taken from special moves.",
      "ja": "こおりのりんぷんに まもられて とくしゅこうげきで うける ダメージが はんげん する。"
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
    },
    "descriptions": {
      "zh-hans": "使树果成熟， 效果变为２倍。",
      "zh-hant": "讓樹果成熟， 使效果變為２倍。",
      "en": "Ripens Berries and doubles their effect.",
      "ja": "じゅくせい させることで きのみの こうかが ばいに なる。"
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
    },
    "descriptions": {
      "zh-hans": "头部的冰会代替自己承受 物理攻击，但是样子会改变。 下冰雹时，冰会恢复原状。",
      "zh-hant": "頭部的冰會代替自己承受 物理攻擊，但是樣子會改變。 下冰雹時，冰會回復原狀。",
      "en": "The Pokémon's ice head can take a physical attack as a substitute, but the attack also changes the Pokémon's appearance. The ice will be restored when it snows.",
      "ja": "ぶつりこうげきは あたまの こおりが みがわりに なるが すがたも かわる。 こおりは あられが ふると もとにもどる。"
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
    },
    "descriptions": {
      "zh-hans": "只要处在相邻位置， 招式的威力就会提高。",
      "zh-hant": "只要站在旁邊， 招式的威力就會提高。",
      "en": "Just being next to the Pokémon powers up moves.",
      "ja": "となりに いるだけで わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "宝可梦的属性会根据 场地的状态而变化。",
      "zh-hant": "寶可夢的屬性會隨著 場地的狀態而改變。",
      "en": "Changes the Pokémon’s type depending on the terrain.",
      "ja": "フィールドの じょうたいに あわせて ポケモンの タイプが かわる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时，敌方和我方的光墙、 反射壁和极光幕的效果会消失。",
      "zh-hant": "出場時，敵方和我方的 光牆、反射壁和極光幕的效果會消失。",
      "en": "When the Pokémon enters a battle, the effects of Light Screen, Reflect, and Aurora Veil are nullified for both opposing and ally Pokémon.",
      "ja": "とうじょう したときに てきと みかたの ひかりのかべ リフレクター オーロラベールの こうかが きえる。"
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
    },
    "descriptions": {
      "zh-hans": "我方的钢属性 攻击威力会提高。",
      "zh-hant": "我方的鋼屬性 攻擊威力會提高。",
      "en": "Powers up the Steel-type moves of the Pokémon and its allies.",
      "ja": "みかたの はがねタイプの こうげきの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "受到接触类招式攻击时， 双方都会在３回合后变为濒死状态。 替换后效果消失。",
      "zh-hant": "在受到接觸類招式攻擊時， ３個回合後雙方都會陷入瀕死。 替換寶可夢後效果就會消失。",
      "en": "When hit by a move that makes direct contact, the Pokémon and the attacker will faint after three turns unless they switch out of battle.",
      "ja": "せっしょくする わざを うけると おたがい ３ターン たつと ひんしになる。 こうたいすると こうかは なくなる。"
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
    },
    "descriptions": {
      "zh-hans": "与使用接触类招式 攻击自己的宝可梦互换特性。",
      "zh-hant": "與使用接觸類招式 攻擊自己的寶可夢互換特性。",
      "en": "The Pokémon exchanges Abilities with a Pokémon that hits it with a move that makes direct contact.",
      "ja": "せっしょくする わざで こうげき してきた ポケモンと とくせいを いれかえる。"
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
    },
    "descriptions": {
      "zh-hans": "虽然攻击会提高， 但是只能使出 一开始所选的招式。",
      "zh-hant": "攻擊雖然會提高， 但只能使出 最初選擇的招式。",
      "en": "Boosts the Pokémon’s Attack stat but only allows the use of the first selected move.",
      "ja": "こうげきは あがるが さいしょに えらんだ わざしか だせなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "特性为化学变化气体的宝可梦在场时， 场上所有宝可梦的 特性效果都会消失或者无法生效。",
      "zh-hant": "當場上有特性是化學變化氣體的寶可夢時， 所有寶可夢的特性效果 都會消失或無法發動。",
      "en": "While the Pokémon is in the battle, the effects of all other Pokémon's Abilities will be nullified or will not be triggered.",
      "ja": "かがくへんかガスの ポケモンが ばにいると すべての ポケモンの とくせいの こうかが きえたり はつどう しなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "自己和同伴都不会 陷入中毒的异常状态。",
      "zh-hant": "自己和我方同伴都不會 陷入中毒的異常狀態。",
      "en": "Protects the Pokémon and its ally Pokémon from being poisoned.",
      "ja": "じぶんも みかたも どくの じょうたいいじょうを うけなくなる。"
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
    },
    "descriptions": {
      "zh-hans": "每回合结束时会在 满腹花纹与空腹花纹之间 交替改变样子。",
      "zh-hant": "在每個回合結束時， 會在滿腹花紋和空腹花紋之間 交替改變樣子。",
      "en": "The Pokémon changes its form, alternating between its Full Belly Mode and Hangry Mode after the end of every turn.",
      "ja": "ターンの おわりに まんぷくもよう はらぺこもよう まんぷくもよう……と こうごに すがたを かえる。"
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
    },
    "descriptions": {
      "zh-hans": "有时能比对手先一步行动。",
      "zh-hant": "有時能比對手先一步行動。",
      "en": "Enables the Pokémon to move first occasionally.",
      "ja": "あいてより さきに こうどう できることが ある。"
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
    },
    "descriptions": {
      "zh-hans": "如果使出的是接触到对手的招式， 就可以无视守护效果进行攻击。",
      "zh-hant": "只要是接觸到對手的招式， 就可以無視對手的防守效果進行攻擊。",
      "en": "If the Pokémon uses moves that make direct contact, it can attack the target even if the target protects itself.",
      "ja": "あいてに せっしょくする わざなら まもりの こうかを むしして こうげき することが できる。"
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
    },
    "descriptions": {
      "zh-hans": "出场时会从贝壳撒药， 将我方的能力变化复原。",
      "zh-hant": "出場時，會從貝殼撒藥， 將我方的能力變化復原。",
      "en": "When the Pokémon enters a battle, it scatters medicine from its shell, which removes all stat changes from allies.",
      "ja": "とうじょう したときに かいがらから くすりを ふりまいて みかたの のうりょくへんかを もとにもどす。"
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
    },
    "descriptions": {
      "zh-hans": "电属性的招式威力会提高。",
      "zh-hant": "電屬性的招式威力會提高。",
      "en": "Powers up Electric-type moves.",
      "ja": "でんきタイプの わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "龙属性的招式威力会提高。",
      "zh-hant": "龍屬性的招式威力會提高。",
      "en": "Powers up Dragon-type moves.",
      "ja": "ドラゴンタイプの わざの いりょくが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "打倒对手时 会用冰冷的声音嘶鸣 并提高攻击。",
      "zh-hant": "打倒對手時 會用冰冷的聲音嘶鳴 並提高攻擊。",
      "en": "When the Pokémon knocks out a target, it utters a chilling neigh, which boosts its Attack stat.",
      "ja": "あいてを たおすと つめたい こえで いなないて こうげきが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "打倒对手时 会用恐怖的声音嘶鸣 并提高特攻。",
      "zh-hant": "打倒對手時 會用恐怖的聲音嘶鳴 並提高特攻。",
      "en": "When the Pokémon knocks out a target, it utters a terrifying neigh, which boosts its Sp. Atk stat.",
      "ja": "あいてを たおすと おそろしい こえで いなないて とくこうが あがる。"
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
    },
    "descriptions": {
      "zh-hans": "兼备蕾冠王的紧张感和 雪暴马的苍白嘶鸣这两种特性。",
      "zh-hant": "兼具蕾冠王的緊張感和 雪暴馬的蒼白嘶鳴這２種特性。",
      "en": "This Ability combines the effects of both Calyrex's Unnerve Ability and Glastrier's Chilling Neigh Ability.",
      "ja": "バドレックスの きんちょうかんと ブリザポスの しろのいななきの ふたつの とくせいを あわせもつ。"
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
    },
    "descriptions": {
      "zh-hans": "兼备蕾冠王的紧张感和 灵幽马的漆黑嘶鸣这两种特性。",
      "zh-hant": "兼具蕾冠王的緊張感和 靈幽馬的漆黑嘶鳴這２種特性。",
      "en": "This Ability combines the effects of both Calyrex's Unnerve Ability and Spectrier's Grim Neigh Ability.",
      "ja": "バドレックスの きんちょうかんと レイスポスの くろのいななきの ふたつの とくせいを あわせもつ。"
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
    },
    "descriptions": {
      "zh-hans": "Contact with the Pokémon changes the attacker's Ability to Lingering Aroma.",
      "zh-hant": "Contact with the Pokémon changes the attacker's Ability to Lingering Aroma.",
      "en": "Contact with the Pokémon changes the attacker's Ability to Lingering Aroma.",
      "ja": "相手に 触られると とれないにおいが 相手に うつってしまう。"
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
    },
    "descriptions": {
      "zh-hans": "Turns the ground into Grassy Terrain when the Pokémon is hit by an attack.",
      "zh-hant": "Turns the ground into Grassy Terrain when the Pokémon is hit by an attack.",
      "en": "Turns the ground into Grassy Terrain when the Pokémon is hit by an attack.",
      "ja": "攻撃を 受けると グラスフィールドに する。"
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
    },
    "descriptions": {
      "zh-hans": "Boosts the Attack stat when the Pokémon is hit by a Fire-type move. The Pokémon also cannot be burned.",
      "zh-hant": "Boosts the Attack stat when the Pokémon is hit by a Fire-type move. The Pokémon also cannot be burned.",
      "en": "Boosts the Attack stat when the Pokémon is hit by a Fire-type move. The Pokémon also cannot be burned.",
      "ja": "ほのおタイプの 技を 受けると 攻撃が 上がる。 やけど状態に ならない。"
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
    },
    "descriptions": {
      "zh-hans": "When an attack causes its HP to drop to half or less, the Pokémon gets angry. This lowers its Defense and Sp. Def stats but boosts its Attack, Sp. Atk, and Speed stats.",
      "zh-hant": "When an attack causes its HP to drop to half or less, the Pokémon gets angry. This lowers its Defense and Sp. Def stats but boosts its Attack, Sp. Atk, and Speed stats.",
      "en": "When an attack causes its HP to drop to half or less, the Pokémon gets angry. This lowers its Defense and Sp. Def stats but boosts its Attack, Sp. Atk, and Speed stats.",
      "ja": "相手の攻撃で HPが 半分に なると 怒りで 防御と 特防が 下がるが 攻撃 特攻 素早さが 上がる。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon's pure salt protects it from status conditions and halves the damage taken from Ghost-type moves.",
      "zh-hant": "The Pokémon's pure salt protects it from status conditions and halves the damage taken from Ghost-type moves.",
      "en": "The Pokémon's pure salt protects it from status conditions and halves the damage taken from Ghost-type moves.",
      "ja": "清らかな塩で 状態異常に ならない。 ゴーストタイプの 技の ダメージを 半減させる。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon takes no damage when hit by Fire-type moves. Instead, its Defense stat is sharply boosted.",
      "zh-hant": "The Pokémon takes no damage when hit by Fire-type moves. Instead, its Defense stat is sharply boosted.",
      "en": "The Pokémon takes no damage when hit by Fire-type moves. Instead, its Defense stat is sharply boosted.",
      "ja": "ほのおタイプの 技を 受けると ダメージを 受けずに 防御が ぐーんと 上がる。"
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
    },
    "descriptions": {
      "zh-hans": "Boosts the Pokémon's Attack stat if Tailwind takes effect or if the Pokémon is hit by a wind move. The Pokémon also takes no damage from wind moves.",
      "zh-hant": "Boosts the Pokémon's Attack stat if Tailwind takes effect or if the Pokémon is hit by a wind move. The Pokémon also takes no damage from wind moves.",
      "en": "Boosts the Pokémon's Attack stat if Tailwind takes effect or if the Pokémon is hit by a wind move. The Pokémon also takes no damage from wind moves.",
      "ja": "おいかぜが 吹いたり 風技を 受けると ダメージを 受けずに 攻撃が 上がる。"
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
    },
    "descriptions": {
      "zh-hans": "Boosts the Pokémon’s Attack stat if intimidated. Moves and items that would force the Pokémon to switch out also fail to work.",
      "zh-hant": "Boosts the Pokémon’s Attack stat if intimidated. Moves and items that would force the Pokémon to switch out also fail to work.",
      "en": "Boosts the Pokémon’s Attack stat if intimidated. Moves and items that would force the Pokémon to switch out also fail to work.",
      "ja": "いかく されると 攻撃が 上がる。 ポケモンを 入れ替えさせる 技や 道具が 効かない。"
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
    },
    "descriptions": {
      "zh-hans": "Powers up Rock-type moves.",
      "zh-hant": "Powers up Rock-type moves.",
      "en": "Powers up Rock-type moves.",
      "ja": "いわタイプの 技の 威力が 上がる。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon becomes charged when it is hit by a wind move, boosting the power of the next Electric-type move the Pokémon uses.",
      "zh-hant": "The Pokémon becomes charged when it is hit by a wind move, boosting the power of the next Electric-type move the Pokémon uses.",
      "en": "The Pokémon becomes charged when it is hit by a wind move, boosting the power of the next Electric-type move the Pokémon uses.",
      "ja": "風技を 受けると じゅうでん 状態に なる。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon transforms into its Hero Form when it switches out.",
      "zh-hant": "The Pokémon transforms into its Hero Form when it switches out.",
      "en": "The Pokémon transforms into its Hero Form when it switches out.",
      "ja": "手持ちに ひっこむと マイティフォルムに 変化する。"
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
    },
    "descriptions": {
      "zh-hans": "When the Pokémon enters a battle, it goes inside the mouth of an ally Dondozo if one is on the field. The Pokémon then issues commands from there.",
      "zh-hant": "When the Pokémon enters a battle, it goes inside the mouth of an ally Dondozo if one is on the field. The Pokémon then issues commands from there.",
      "en": "When the Pokémon enters a battle, it goes inside the mouth of an ally Dondozo if one is on the field. The Pokémon then issues commands from there.",
      "ja": "登場したとき 味方に ヘイラッシャが いると 口の中に 入って そこから 指令を だす。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon becomes charged when it takes damage, boosting the power of the next Electric-type move the Pokémon uses.",
      "zh-hant": "The Pokémon becomes charged when it takes damage, boosting the power of the next Electric-type move the Pokémon uses.",
      "en": "The Pokémon becomes charged when it takes damage, boosting the power of the next Electric-type move the Pokémon uses.",
      "ja": "ダメージを 受けると じゅうでん 状態に なる。"
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
    },
    "descriptions": {
      "zh-hans": "Boosts the Pokémon's most proficient stat in harsh sunlight or if the Pokémon is holding Booster Energy.",
      "zh-hant": "Boosts the Pokémon's most proficient stat in harsh sunlight or if the Pokémon is holding Booster Energy.",
      "en": "Boosts the Pokémon's most proficient stat in harsh sunlight or if the Pokémon is holding Booster Energy.",
      "ja": "ブーストエナジーを 持たせるか 天気が 晴れのとき いちばん 高い能力が 上がる。"
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
    },
    "descriptions": {
      "zh-hans": "Boosts the Pokémon's most proficient stat on Electric Terrain or if the Pokémon is holding Booster Energy.",
      "zh-hant": "Boosts the Pokémon's most proficient stat on Electric Terrain or if the Pokémon is holding Booster Energy.",
      "en": "Boosts the Pokémon's most proficient stat on Electric Terrain or if the Pokémon is holding Booster Energy.",
      "ja": "ブーストエナジーを 持たせるか エレキフィールドのとき いちばん 高い能力が 上がる。"
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
    },
    "descriptions": {
      "zh-hans": "A body of pure, solid gold gives the Pokémon full immunity to other Pokémon's status moves.",
      "zh-hant": "A body of pure, solid gold gives the Pokémon full immunity to other Pokémon's status moves.",
      "en": "A body of pure, solid gold gives the Pokémon full immunity to other Pokémon's status moves.",
      "ja": "酸化せず 丈夫な 黄金の体は 相手からの 変化技を 受けない。"
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
    },
    "descriptions": {
      "zh-hans": "The power of the Pokémon's ruinous vessel lowers the Sp. Atk stats of all Pokémon except itself.",
      "zh-hant": "The power of the Pokémon's ruinous vessel lowers the Sp. Atk stats of all Pokémon except itself.",
      "en": "The power of the Pokémon's ruinous vessel lowers the Sp. Atk stats of all Pokémon except itself.",
      "ja": "災厄を 呼ぶ 器の力で 自分以外の 特攻が 弱くなる。"
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
    },
    "descriptions": {
      "zh-hans": "The power of the Pokémon's ruinous sword lowers the Defense stats of all Pokémon except itself.",
      "zh-hant": "The power of the Pokémon's ruinous sword lowers the Defense stats of all Pokémon except itself.",
      "en": "The power of the Pokémon's ruinous sword lowers the Defense stats of all Pokémon except itself.",
      "ja": "災厄を 呼ぶ 剣の力で 自分以外の 防御が 弱くなる。"
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
    },
    "descriptions": {
      "zh-hans": "The power of the Pokémon's ruinous wooden tablets lowers the Attack stats of all Pokémon except itself.",
      "zh-hant": "The power of the Pokémon's ruinous wooden tablets lowers the Attack stats of all Pokémon except itself.",
      "en": "The power of the Pokémon's ruinous wooden tablets lowers the Attack stats of all Pokémon except itself.",
      "ja": "災厄を 呼ぶ 木札の力で 自分以外の 攻撃が 弱くなる。"
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
    },
    "descriptions": {
      "zh-hans": "The power of the Pokémon's ruinous beads lowers the Sp. Def stats of all Pokémon except itself.",
      "zh-hant": "The power of the Pokémon's ruinous beads lowers the Sp. Def stats of all Pokémon except itself.",
      "en": "The power of the Pokémon's ruinous beads lowers the Sp. Def stats of all Pokémon except itself.",
      "ja": "災厄を 呼ぶ 勾玉の力で 自分以外の 特防が 弱くなる。"
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
    },
    "descriptions": {
      "zh-hans": "Turns the sunlight harsh when the Pokémon enters a battle. The ancient pulse thrumming through the Pokémon also boosts its Attack stat in harsh sunlight.",
      "zh-hant": "Turns the sunlight harsh when the Pokémon enters a battle. The ancient pulse thrumming through the Pokémon also boosts its Attack stat in harsh sunlight.",
      "en": "Turns the sunlight harsh when the Pokémon enters a battle. The ancient pulse thrumming through the Pokémon also boosts its Attack stat in harsh sunlight.",
      "ja": "登場したとき 天気を 晴れにする。 日差しが 強いと 古代の 鼓動により 攻撃が 高まる。"
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
    },
    "descriptions": {
      "zh-hans": "Turns the ground into Electric Terrain when the Pokémon enters a battle. The futuristic engine within the Pokémon also boosts its Sp. Atk stat on Electric Terrain.",
      "zh-hant": "Turns the ground into Electric Terrain when the Pokémon enters a battle. The futuristic engine within the Pokémon also boosts its Sp. Atk stat on Electric Terrain.",
      "en": "Turns the ground into Electric Terrain when the Pokémon enters a battle. The futuristic engine within the Pokémon also boosts its Sp. Atk stat on Electric Terrain.",
      "ja": "登場したとき エレキフィールドを はる。 エレキフィールドだと 未来の 機関により 特攻が 高まる。"
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
    },
    "descriptions": {
      "zh-hans": "If an opponent's stat is boosted, the Pokémon seizes the opportunity to boost the same stat for itself.",
      "zh-hant": "If an opponent's stat is boosted, the Pokémon seizes the opportunity to boost the same stat for itself.",
      "en": "If an opponent's stat is boosted, the Pokémon seizes the opportunity to boost the same stat for itself.",
      "ja": "相手の 能力が 上がったとき 自分も 便乗して 同じように 能力を 上げる。"
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
    },
    "descriptions": {
      "zh-hans": "When the Pokémon eats a Berry, it will regurgitate that Berry at the end of the next turn and eat it one more time.",
      "zh-hant": "When the Pokémon eats a Berry, it will regurgitate that Berry at the end of the next turn and eat it one more time.",
      "en": "When the Pokémon eats a Berry, it will regurgitate that Berry at the end of the next turn and eat it one more time.",
      "ja": "きのみを 食べると 次のターンの 終わりに 胃から 出して もう1回だけ 食べる。"
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
    },
    "descriptions": {
      "zh-hans": "Powers up slicing moves.",
      "zh-hant": "Powers up slicing moves.",
      "en": "Powers up slicing moves.",
      "ja": "相手を 切る技の 威力が 上がる。"
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
    },
    "descriptions": {
      "zh-hans": "When the Pokémon enters a battle, its Attack and Sp. Atk stats are slightly boosted for each of the allies in its party that have already been defeated.",
      "zh-hant": "When the Pokémon enters a battle, its Attack and Sp. Atk stats are slightly boosted for each of the allies in its party that have already been defeated.",
      "en": "When the Pokémon enters a battle, its Attack and Sp. Atk stats are slightly boosted for each of the allies in its party that have already been defeated.",
      "ja": "登場したとき 今まで 倒された 味方の 数が 多いほど 少しずつ 攻撃と 特攻が 上がる。"
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
    },
    "descriptions": {
      "zh-hans": "When the Pokémon enters a battle, it copies an ally's stat changes.",
      "zh-hant": "When the Pokémon enters a battle, it copies an ally's stat changes.",
      "en": "When the Pokémon enters a battle, it copies an ally's stat changes.",
      "ja": "登場 したときに 味方の 能力変化を コピーする。"
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
    },
    "descriptions": {
      "zh-hans": "Scatters poison spikes at the feet of the opposing team when the Pokémon takes damage from physical moves.",
      "zh-hant": "Scatters poison spikes at the feet of the opposing team when the Pokémon takes damage from physical moves.",
      "en": "Scatters poison spikes at the feet of the opposing team when the Pokémon takes damage from physical moves.",
      "ja": "物理技で ダメージを 受けると 相手の 足下に どくびしが ちらばる。"
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
    },
    "descriptions": {
      "zh-hans": "The mysterious tail covering the Pokémon's head makes opponents unable to use priority moves against the Pokémon or its allies.",
      "zh-hant": "The mysterious tail covering the Pokémon's head makes opponents unable to use priority moves against the Pokémon or its allies.",
      "en": "The mysterious tail covering the Pokémon's head makes opponents unable to use priority moves against the Pokémon or its allies.",
      "ja": "頭を包む 謎のしっぽが こちらに むかって 先制技を 出せない ようにする。"
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
    },
    "descriptions": {
      "zh-hans": "If hit by a Ground-type move, the Pokémon has its HP restored instead of taking damage.",
      "zh-hant": "If hit by a Ground-type move, the Pokémon has its HP restored instead of taking damage.",
      "en": "If hit by a Ground-type move, the Pokémon has its HP restored instead of taking damage.",
      "ja": "じめんタイプの 技を 受けると ダメージを 受けずに 回復する。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon will always act more slowly when using status moves, but these moves will be unimpeded by the Ability of the target.",
      "zh-hant": "The Pokémon will always act more slowly when using status moves, but these moves will be unimpeded by the Ability of the target.",
      "en": "The Pokémon will always act more slowly when using status moves, but these moves will be unimpeded by the Ability of the target.",
      "ja": "変化技を 出すとき 必ず 行動が 遅くなるが 相手の 特性に ジャマされない。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon ignores changes to opponents' evasiveness, its accuracy can't be lowered, and it can hit Ghost types with Normal-type and Fighting-type moves",
      "zh-hant": "The Pokémon ignores changes to opponents' evasiveness, its accuracy can't be lowered, and it can hit Ghost types with Normal-type and Fighting-type moves",
      "en": "The Pokémon ignores changes to opponents' evasiveness, its accuracy can't be lowered, and it can hit Ghost types with Normal-type and Fighting-type moves",
      "ja": "ノーマル かくとうタイプの技を ゴーストタイプに 当てることが できる。 相手の 回避率の 変化を 無視し 命中率も 下げられない。"
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
    },
    "descriptions": {
      "zh-hans": "Lowers the evasion of opposing Pokémon by 1 stage when first sent into battle",
      "zh-hant": "Lowers the evasion of opposing Pokémon by 1 stage when first sent into battle",
      "en": "Lowers the evasion of opposing Pokémon by 1 stage when first sent into battle",
      "ja": "最初に 登場 したとき 甘ったるい 蜜の香りを ふりまいて 相手の 回避率を 下げる。"
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
    },
    "descriptions": {
      "zh-hans": "When the Pokémon enters a battle, it showers its ally with hospitality, restoring a small amount of the ally's HP",
      "zh-hant": "When the Pokémon enters a battle, it showers its ally with hospitality, restoring a small amount of the ally's HP",
      "en": "When the Pokémon enters a battle, it showers its ally with hospitality, restoring a small amount of the ally's HP",
      "ja": "登場したとき 味方を もてなして HPを 少しだけ 回復してあげる。"
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
    },
    "descriptions": {
      "zh-hans": "The power of the Pokémon's toxic chain may badly poison any target the Pokémon hits with a move",
      "zh-hant": "The power of the Pokémon's toxic chain may badly poison any target the Pokémon hits with a move",
      "en": "The power of the Pokémon's toxic chain may badly poison any target the Pokémon hits with a move",
      "ja": "毒素を ふくんだ 鎖の力で 技を 当てた 相手を 猛毒の状態に することが ある。"
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
    },
    "descriptions": {
      "zh-hans": "When the Pokémon enters a battle, it absorbs the energy around itself and transforms into its Terastal Form.",
      "zh-hant": "When the Pokémon enters a battle, it absorbs the energy around itself and transforms into its Terastal Form.",
      "en": "When the Pokémon enters a battle, it absorbs the energy around itself and transforms into its Terastal Form.",
      "ja": "登場したとき 周囲の エネルギーを 吸収し テラスタルフォルムに 変化する。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon's shell contains the powers of each type. All damage-dealing moves that hit the Pokémon when its HP is full will not be very effective.",
      "zh-hant": "The Pokémon's shell contains the powers of each type. All damage-dealing moves that hit the Pokémon when its HP is full will not be very effective.",
      "en": "The Pokémon's shell contains the powers of each type. All damage-dealing moves that hit the Pokémon when its HP is full will not be very effective.",
      "ja": "全タイプの力を 秘めた甲羅は HPが 満タンの ときに 受ける ダメージを すべて 今ひとつに する。"
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
    },
    "descriptions": {
      "zh-hans": "When Terapagos changes into its Stellar Form, it uses its hidden powers to eliminate all effects of weather and terrain, reducing them to zero.",
      "zh-hant": "When Terapagos changes into its Stellar Form, it uses its hidden powers to eliminate all effects of weather and terrain, reducing them to zero.",
      "en": "When Terapagos changes into its Stellar Form, it uses its hidden powers to eliminate all effects of weather and terrain, reducing them to zero.",
      "ja": "テラパゴスが ステラフォルムに なったとき 秘められた力で 天気と フィールドの 影響を すべて ゼロにする。"
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
    },
    "descriptions": {
      "zh-hans": "Pokémon poisoned by Pecharunt's moves will also become confused.",
      "zh-hant": "Pokémon poisoned by Pecharunt's moves will also become confused.",
      "en": "Pokémon poisoned by Pecharunt's moves will also become confused.",
      "ja": "モモワロウの 技によって どく状態に なった 相手は こんらん状態にも なってしまう。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon's Normal-type moves become Dragon-type moves and their power is boosted by 20%.",
      "zh-hant": "The Pokémon's Normal-type moves become Dragon-type moves and their power is boosted by 20%.",
      "en": "The Pokémon's Normal-type moves become Dragon-type moves and their power is boosted by 20%.",
      "ja": "ノーマルタイプの技がドラゴンタイプになり 威力が1.2倍になる。"
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
    },
    "descriptions": {
      "zh-hans": "Even when the sunlight has not turned harsh, the Pokémon can use its moves as if the weather were harsh sunlight.",
      "zh-hant": "Even when the sunlight has not turned harsh, the Pokémon can use its moves as if the weather were harsh sunlight.",
      "en": "Even when the sunlight has not turned harsh, the Pokémon can use its moves as if the weather were harsh sunlight.",
      "ja": "天気が にほんばれ状態でなくても にほんばれ状態として 技を使うことができる。"
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
    },
    "descriptions": {
      "zh-hans": "The Pokémon floats off the ground, making it immune to Ground-type moves, as well as the Spikes, Toxic Spikes, and Sticky Web statuses. When the Pokémon knocks out a target with an attack, its highest stat is boosted by 1 stage.",
      "zh-hant": "The Pokémon floats off the ground, making it immune to Ground-type moves, as well as the Spikes, Toxic Spikes, and Sticky Web statuses. When the Pokémon knocks out a target with an attack, its highest stat is boosted by 1 stage.",
      "en": "The Pokémon floats off the ground, making it immune to Ground-type moves, as well as the Spikes, Toxic Spikes, and Sticky Web statuses. When the Pokémon knocks out a target with an attack, its highest stat is boosted by 1 stage.",
      "ja": "The Pokémon floats off the ground, making it immune to Ground-type moves, as well as the Spikes, Toxic Spikes, and Sticky Web statuses. When the Pokémon knocks out a target with an attack, its highest stat is boosted by 1 stage."
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
    },
    "descriptions": {
      "zh-hans": "Boosts the power of the Pokémon's Fire-type moves by 50%.",
      "zh-hant": "Boosts the power of the Pokémon's Fire-type moves by 50%.",
      "en": "Boosts the power of the Pokémon's Fire-type moves by 50%.",
      "ja": "Boosts the power of the Pokémon's Fire-type moves by 50%."
    }
  }
} as const satisfies Record<UpstreamResourceId, NormalizedAbility>

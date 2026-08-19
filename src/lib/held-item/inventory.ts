import type { PokemonType } from "@/lib/pokemon"

export const HELD_ITEM_POOLS = ["attacker", "defender", "lock"] as const

export type HeldItemPool = (typeof HELD_ITEM_POOLS)[number]
export type HeldItemWarning = "persistent-berry" | "utility-umbrella"
export type HeldItemModifier = 2048 | 3686 | 4505 | 4915 | 5324 | 6144 | 8192
export type HeldItemBattleStat =
  | "attack"
  | "special-attack"
  | "defense"
  | "special-defense"

export type HeldItemGate =
  | { kind: "damaging-move" }
  | { kind: "move-category"; category: "physical" | "special" }
  | { kind: "move-type"; types: readonly PokemonType[] }
  | { kind: "super-effective" }
  | { kind: "holder-species"; speciesIds: readonly number[] }
  | { kind: "holder-identity"; battlePokemonIds: readonly number[] }
  | { kind: "eviolite-eligible" }
  | { kind: "numeric-accuracy" }
  | { kind: "weather"; weathers: readonly ("sun" | "rain")[] }

type GatedEffect = { gates: readonly HeldItemGate[] }

export type HeldItemEffect =
  | (GatedEffect & { kind: "base-power"; modifier: HeldItemModifier })
  | (GatedEffect & {
      kind: "battle-stat"
      stats: readonly HeldItemBattleStat[]
      modifier: HeldItemModifier
    })
  | (GatedEffect & { kind: "final-damage"; modifier: HeldItemModifier })
  | (GatedEffect & {
      kind: "accuracy"
      direction: "outgoing" | "incoming"
      modifier: HeldItemModifier
    })
  | (GatedEffect & { kind: "critical-stage"; stage: 1 | 2 })
  | (GatedEffect & { kind: "suppress-ordinary-weather-damage" })

export type FrozenHeldItem = {
  id: number
  calcItemName: string
  pool: HeldItemPool
  mb: boolean
  effect: HeldItemEffect
  warning?: HeldItemWarning
}

const HALF = 2048
const ACCURACY_DOWN = 3686
const TEN_PERCENT = 4505
const TWENTY_PERCENT = 4915
const LIFE_ORB = 5324
const FIFTY_PERCENT = 6144
const DOUBLE = 8192

const damagingMove = (): HeldItemGate => ({ kind: "damaging-move" })
const moveCategory = (category: "physical" | "special"): HeldItemGate => ({
  kind: "move-category",
  category,
})
const moveType = (...types: PokemonType[]): HeldItemGate => ({
  kind: "move-type",
  types,
})
const superEffective = (): HeldItemGate => ({ kind: "super-effective" })
const holderSpecies = (...speciesIds: number[]): HeldItemGate => ({
  kind: "holder-species",
  speciesIds,
})
const holderIdentity = (...battlePokemonIds: number[]): HeldItemGate => ({
  kind: "holder-identity",
  battlePokemonIds,
})

const basePower = (
  modifier: HeldItemModifier,
  ...gates: HeldItemGate[]
): HeldItemEffect => ({ kind: "base-power", modifier, gates })
const battleStat = (
  stats: readonly HeldItemBattleStat[],
  modifier: HeldItemModifier,
  ...gates: HeldItemGate[]
): HeldItemEffect => ({ kind: "battle-stat", stats, modifier, gates })
const finalDamage = (
  modifier: HeldItemModifier,
  ...gates: HeldItemGate[]
): HeldItemEffect => ({ kind: "final-damage", modifier, gates })
const accuracy = (
  direction: "outgoing" | "incoming",
  modifier: HeldItemModifier,
): HeldItemEffect => ({
  kind: "accuracy",
  direction,
  modifier,
  gates: [{ kind: "numeric-accuracy" }],
})
const criticalStage = (
  stage: 1 | 2,
  ...gates: HeldItemGate[]
): HeldItemEffect => ({ kind: "critical-stage", stage, gates })

function item(
  id: number,
  calcItemName: string,
  pool: HeldItemPool,
  mb: boolean,
  effect: HeldItemEffect,
  warning?: HeldItemWarning,
): FrozenHeldItem {
  return { id, calcItemName, pool, mb, effect, ...(warning ? { warning } : {}) }
}

function typeBooster(
  id: number,
  calcItemName: string,
  type: PokemonType,
  mb: boolean,
): FrozenHeldItem {
  return item(id, calcItemName, "attacker", mb, basePower(TWENTY_PERCENT, moveType(type)))
}

function resistanceBerry(
  id: number,
  calcItemName: string,
  type: PokemonType,
  mb: boolean,
  requiresSuperEffective = true,
): FrozenHeldItem {
  return item(
    id,
    calcItemName,
    "defender",
    mb,
    finalDamage(
      HALF,
      moveType(type),
      ...(requiresSuperEffective ? [superEffective()] : []),
    ),
    "persistent-berry",
  )
}

/** Normative order from the frozen-85 specification; pool order is product behavior. */
export const FROZEN_HELD_ITEMS: readonly FrozenHeldItem[] = [
  item(247, "lifeorb", "attacker", true, finalDamage(LIFE_ORB, damagingMove())),
  item(245, "expertbelt", "attacker", true, finalDamage(TWENTY_PERCENT, damagingMove(), superEffective())),
  item(213, "lightball", "attacker", true, battleStat(["attack", "special-attack"], DOUBLE, holderSpecies(25))),
  item(243, "muscleband", "attacker", true, basePower(TEN_PERCENT, moveCategory("physical"))),
  item(244, "wiseglasses", "attacker", true, basePower(TEN_PERCENT, moveCategory("special"))),
  item(197, "choiceband", "attacker", false, battleStat(["attack"], FIFTY_PERCENT, moveCategory("physical"))),
  item(274, "choicespecs", "attacker", false, battleStat(["special-attack"], FIFTY_PERCENT, moveCategory("special"))),
  typeBooster(218, "blackbelt", "fighting", true),
  typeBooster(217, "blackglasses", "dark", true),
  typeBooster(226, "charcoal", "fire", true),
  typeBooster(227, "dragonfang", "dragon", true),
  typeBooster(2105, "fairyfeather", "fairy", true),
  typeBooster(215, "hardstone", "rock", true),
  typeBooster(219, "magnet", "electric", true),
  typeBooster(210, "metalcoat", "steel", true),
  typeBooster(216, "miracleseed", "grass", true),
  typeBooster(220, "mysticwater", "water", true),
  typeBooster(223, "nevermeltice", "ice", true),
  typeBooster(222, "poisonbarb", "poison", true),
  typeBooster(221, "sharpbeak", "flying", true),
  typeBooster(228, "silkscarf", "normal", true),
  typeBooster(199, "silverpowder", "bug", true),
  typeBooster(214, "softsand", "ground", true),
  typeBooster(224, "spelltag", "ghost", true),
  typeBooster(225, "twistedspoon", "psychic", true),
  resistanceBerry(176, "babiriberry", "steel", true),
  resistanceBerry(172, "chartiberry", "rock", true),
  resistanceBerry(177, "chilanberry", "normal", true, false),
  resistanceBerry(166, "chopleberry", "fighting", true),
  resistanceBerry(169, "cobaberry", "flying", true),
  resistanceBerry(175, "colburberry", "dark", true),
  resistanceBerry(174, "habanberry", "dragon", true),
  resistanceBerry(173, "kasibberry", "ghost", true),
  resistanceBerry(167, "kebiaberry", "poison", true),
  resistanceBerry(161, "occaberry", "fire", true),
  resistanceBerry(162, "passhoberry", "water", true),
  resistanceBerry(170, "payapaberry", "psychic", true),
  resistanceBerry(164, "rindoberry", "grass", true),
  resistanceBerry(723, "roseliberry", "fairy", true),
  resistanceBerry(168, "shucaberry", "ground", true),
  resistanceBerry(171, "tangaberry", "bug", true),
  resistanceBerry(163, "wacanberry", "electric", true),
  resistanceBerry(165, "yacheberry", "ice", true),
  item(190, "brightpowder", "defender", true, accuracy("incoming", ACCURACY_DOWN)),
  item(242, "widelens", "attacker", true, accuracy("outgoing", TEN_PERCENT)),
  item(209, "scopelens", "attacker", true, criticalStage(1)),
  item(232, "laxincense", "defender", false, accuracy("incoming", ACCURACY_DOWN)),
  item(303, "razorclaw", "attacker", false, criticalStage(1)),
  item(236, "leek", "attacker", false, criticalStage(2, holderSpecies(83, 865))),
  item(233, "luckypunch", "attacker", false, criticalStage(2, holderSpecies(113))),
  typeBooster(288, "dracoplate", "dragon", false),
  typeBooster(289, "dreadplate", "dark", false),
  typeBooster(282, "earthplate", "ground", false),
  typeBooster(280, "fistplate", "fighting", false),
  typeBooster(275, "flameplate", "fire", false),
  typeBooster(279, "icicleplate", "ice", false),
  typeBooster(285, "insectplate", "bug", false),
  typeBooster(290, "ironplate", "steel", false),
  typeBooster(278, "meadowplate", "grass", false),
  typeBooster(284, "mindplate", "psychic", false),
  typeBooster(684, "pixieplate", "fairy", false),
  typeBooster(283, "skyplate", "flying", false),
  typeBooster(276, "splashplate", "water", false),
  typeBooster(287, "spookyplate", "ghost", false),
  typeBooster(286, "stoneplate", "rock", false),
  typeBooster(281, "toxicplate", "poison", false),
  typeBooster(277, "zapplate", "electric", false),
  typeBooster(291, "oddincense", "psychic", false),
  typeBooster(292, "rockincense", "rock", false),
  typeBooster(295, "roseincense", "grass", false),
  typeBooster(231, "seaincense", "water", false),
  typeBooster(294, "waveincense", "water", false),
  item(235, "thickclub", "attacker", false, battleStat(["attack"], DOUBLE, holderSpecies(104, 105))),
  item(203, "deepseatooth", "attacker", false, battleStat(["special-attack"], DOUBLE, holderSpecies(366))),
  item(204, "deepseascale", "defender", false, battleStat(["special-defense"], DOUBLE, holderSpecies(366))),
  item(683, "assaultvest", "defender", false, battleStat(["special-defense"], FIFTY_PERCENT, moveCategory("special"))),
  item(581, "eviolite", "defender", false, battleStat(["defense", "special-defense"], FIFTY_PERCENT, { kind: "eviolite-eligible" })),
  item(112, "adamantorb", "attacker", false, basePower(TWENTY_PERCENT, holderSpecies(483), moveType("steel", "dragon"))),
  item(113, "lustrousorb", "attacker", false, basePower(TWENTY_PERCENT, holderSpecies(484), moveType("water", "dragon"))),
  item(442, "griseousorb", "attacker", false, basePower(TWENTY_PERCENT, holderSpecies(487), moveType("ghost", "dragon"))),
  item(202, "souldew", "attacker", false, basePower(TWENTY_PERCENT, holderSpecies(380, 381), moveType("psychic", "dragon"))),
  item(2108, "cornerstonemask", "lock", false, basePower(TWENTY_PERCENT, holderIdentity(10275), damagingMove())),
  item(2107, "hearthflamemask", "lock", false, basePower(TWENTY_PERCENT, holderIdentity(10274), damagingMove())),
  item(2106, "wellspringmask", "lock", false, basePower(TWENTY_PERCENT, holderIdentity(10273), damagingMove())),
  item(
    1181,
    "utilityumbrella",
    "defender",
    false,
    {
      kind: "suppress-ordinary-weather-damage",
      gates: [
        { kind: "weather", weathers: ["sun", "rain"] },
        moveType("fire", "water"),
      ],
    },
    "utility-umbrella",
  ),
]

export const FROZEN_HELD_ITEM_BY_ID: ReadonlyMap<number, FrozenHeldItem> = new Map(
  FROZEN_HELD_ITEMS.map((entry) => [entry.id, entry]),
)

export const FROZEN_HELD_ITEM_IDS = FROZEN_HELD_ITEMS.map((entry) => entry.id)

export function heldItemIdsForPool(pool: HeldItemPool): number[] {
  return FROZEN_HELD_ITEMS
    .filter((entry) => entry.pool === pool)
    .map((entry) => entry.id)
}

export const ATTACKER_HELD_ITEM_IDS = heldItemIdsForPool("attacker")
export const DEFENDER_HELD_ITEM_IDS = heldItemIdsForPool("defender")
export const LOCK_HELD_ITEM_IDS = heldItemIdsForPool("lock")

export function isFrozenHeldItemId(value: unknown): value is number {
  return typeof value === "number" && FROZEN_HELD_ITEM_BY_ID.has(value)
}

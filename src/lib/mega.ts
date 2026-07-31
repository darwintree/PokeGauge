import type { SupportedLocale } from "@/lib/i18n"
import { localeMessages } from "@/lib/i18n/messages"
import { GENERATED_MEGA_STONES } from "@/lib/resources/generated/mega-stones"
import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"

export const UNKNOWN_ABILITY_ID = 0
export const UNKNOWN_MEGA_STONE_ID = "unknown-mega-stone" as const
export type MegaStoneId = UpstreamResourceId | typeof UNKNOWN_MEGA_STONE_ID

const MEGA_STONE_BY_ID: Partial<Record<BattlePokemonId, UpstreamResourceId>> = {
  10033: 698,
  10034: 699,
  10035: 717,
  10036: 700,
  10037: 718,
  10038: 695,
  10039: 714,
  10040: 710,
  10041: 715,
  10042: 711,
  10043: 701,
  10044: 702,
  10045: 697,
  10046: 709,
  10047: 719,
  10048: 705,
  10049: 708,
  10050: 703,
  10051: 696,
  10052: 720,
  10053: 706,
  10054: 704,
  10055: 721,
  10056: 707,
  10057: 716,
  10058: 722,
  10059: 712,
  10060: 713,
  10062: 760,
  10063: 761,
  10064: 793,
  10065: 794,
  10066: 795,
  10067: 796,
  10068: 797,
  10069: 798,
  10070: 800,
  10071: 801,
  10072: 802,
  10073: 803,
  10074: 804,
  10075: 805,
  10076: 799,
  10087: 808,
  10088: 809,
  10089: 810,
  10090: 811,
}

export function megaStoneFor(id: BattlePokemonId): MegaStoneId | null {
  if (id === 10079) return null
  return MEGA_STONE_BY_ID[id] ?? UNKNOWN_MEGA_STONE_ID
}

function megaStoneResourceId(id: string | number): UpstreamResourceId | null {
  const resourceId = typeof id === "number" ? id : Number(id)
  return Number.isInteger(resourceId) &&
    resourceId in GENERATED_MEGA_STONES
    ? resourceId
    : null
}

export function isMegaStone(id: string | number): boolean {
  return id === UNKNOWN_MEGA_STONE_ID || megaStoneResourceId(id) !== null
}

export function megaStoneLabel(id: string | number, locale: SupportedLocale): string {
  if (id === UNKNOWN_MEGA_STONE_ID) {
    return localeMessages[locale]["track.item.unknownMegaStone"]
  }
  const resourceId = megaStoneResourceId(id)
  if (resourceId === null) return String(id)
  return (GENERATED_MEGA_STONES as Record<
    UpstreamResourceId,
    { names: Record<SupportedLocale, string> }
  >)[resourceId].names[locale]
}

export const EXPLICIT_NO_ITEM_ID = "none" as const
export const UNKNOWN_MEGA_STONE_ITEM_ID = "unknown-mega-stone" as const

export type HeldItemId =
  | number
  | typeof EXPLICIT_NO_ITEM_ID
  | typeof UNKNOWN_MEGA_STONE_ITEM_ID

export const USAGE_TIP_MUTE_STORAGE_KEY = "pokegauge.usage-tip.mute-date"

export const USAGE_TIPS = [
  { id: "feedback", titleId: "usageTip.feedback.title", bodyId: "usageTip.feedback.body" },
  { id: "share", titleId: "usageTip.share.title", bodyId: "usageTip.share.body" },
  { id: "bookmark", titleId: "usageTip.bookmark.title", bodyId: "usageTip.bookmark.body" },
] as const

export type UsageTipId = (typeof USAGE_TIPS)[number]["id"]
export type UsageTipEntry = (typeof USAGE_TIPS)[number]

export function localCalendarDateKey(now = new Date()): string {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function isUsageTipMutedOn(now = new Date()): boolean {
  try {
    return localStorage.getItem(USAGE_TIP_MUTE_STORAGE_KEY) === localCalendarDateKey(now)
  } catch {
    return false
  }
}

export function muteUsageTipsForLocalDay(now = new Date()): void {
  localStorage.setItem(USAGE_TIP_MUTE_STORAGE_KEY, localCalendarDateKey(now))
}

export function pickUsageTip(
  tips: readonly UsageTipEntry[] = USAGE_TIPS,
  random = Math.random,
): UsageTipEntry | null {
  if (tips.length === 0) return null
  return tips[Math.floor(random() * tips.length)] ?? null
}

import {
  Activity,
  BookmarkPlus,
  CloudSun,
  Crosshair,
  Gauge,
  HeartHandshake,
  ListChecks,
  MessageSquareWarning,
  MousePointerClick,
  Palette,
  Share2,
  ShieldAlert,
  Star,
} from "lucide-react"

export const USAGE_TIP_MUTE_STORAGE_KEY = "pokegauge.usage-tip.mute-date"

export const USAGE_TIPS = [
  { id: "modes", icon: Crosshair, titleId: "usageTip.modes.title", bodyId: "usageTip.modes.body" },
  { id: "spMechanic", icon: Gauge, titleId: "usageTip.spMechanic.title", bodyId: "usageTip.spMechanic.body" },
  { id: "statValueOptions", icon: ListChecks, titleId: "usageTip.statValueOptions.title", bodyId: "usageTip.statValueOptions.body" },
  { id: "boxColors", icon: Palette, titleId: "usageTip.boxColors.title", bodyId: "usageTip.boxColors.body" },
  { id: "gradient", icon: Activity, titleId: "usageTip.gradient.title", bodyId: "usageTip.gradient.body" },
  { id: "expandStat", icon: MousePointerClick, titleId: "usageTip.expandStat.title", bodyId: "usageTip.expandStat.body" },
  { id: "ex", icon: Star, titleId: "usageTip.ex.title", bodyId: "usageTip.ex.body" },
  { id: "intimidate", icon: ShieldAlert, titleId: "usageTip.intimidate.title", bodyId: "usageTip.intimidate.body" },
  { id: "defiant", icon: ShieldAlert, titleId: "usageTip.defiant.title", bodyId: "usageTip.defiant.body" },
  { id: "weatherAbilities", icon: CloudSun, titleId: "usageTip.weatherAbilities.title", bodyId: "usageTip.weatherAbilities.body" },
  { id: "credits", icon: HeartHandshake, titleId: "usageTip.credits.title", bodyId: "usageTip.credits.body" },
  { id: "feedback", icon: MessageSquareWarning, titleId: "usageTip.feedback.title", bodyId: "usageTip.feedback.body" },
  { id: "share", icon: Share2, titleId: "usageTip.share.title", bodyId: "usageTip.share.body" },
  { id: "bookmark", icon: BookmarkPlus, titleId: "usageTip.bookmark.title", bodyId: "usageTip.bookmark.body" },
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

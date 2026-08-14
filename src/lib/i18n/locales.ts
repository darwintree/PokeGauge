export const SUPPORTED_LOCALES = ["zh-hans", "zh-hant", "en", "ja"] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = "zh-hans"
export const LOCALE_STORAGE_KEY = "pokegauge.locale"

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale)
}

function normalizeLocaleTag(value: string): SupportedLocale | null {
  const tag = value.toLowerCase().replace("_", "-")
  if (isSupportedLocale(tag)) return tag
  if (tag === "zh-cn" || tag === "zh-sg" || tag === "zh") return "zh-hans"
  if (tag === "zh-tw" || tag === "zh-hk" || tag === "zh-mo") return "zh-hant"
  if (tag.startsWith("en")) return "en"
  if (tag.startsWith("ja")) return "ja"
  return null
}

export function resolveInitialLocale(
  storedLocale: string | null,
  browserLanguages: readonly string[],
): SupportedLocale {
  if (storedLocale && isSupportedLocale(storedLocale)) return storedLocale

  for (const language of browserLanguages) {
    const matched = normalizeLocaleTag(language)
    if (matched) return matched
  }

  return DEFAULT_LOCALE
}

export function loadInitialLocale(): SupportedLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  return resolveInitialLocale(
    window.localStorage.getItem(LOCALE_STORAGE_KEY),
    window.navigator.languages.length > 0
      ? window.navigator.languages
      : [window.navigator.language],
  )
}

export function saveLocale(locale: SupportedLocale): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

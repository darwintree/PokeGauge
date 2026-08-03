import type { SupportedLocale } from "./locales"

import { enMessages } from "./messages/en"
import { jaMessages } from "./messages/ja"
import { zhHansMessages } from "./messages/zh-hans"
import { zhHantMessages } from "./messages/zh-hant"

export const localeMessages: Record<SupportedLocale, Record<string, string>> = {
  "zh-hans": zhHansMessages,
  "zh-hant": zhHantMessages,
  en: enMessages,
  ja: jaMessages,
}

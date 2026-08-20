import { describe, expect, it } from "vitest"

import { enMessages } from "@/lib/i18n/messages/en"
import { jaMessages } from "@/lib/i18n/messages/ja"
import { zhHansMessages } from "@/lib/i18n/messages/zh-hans"
import { zhHantMessages } from "@/lib/i18n/messages/zh-hant"

const RESET_HOME_KEYS = [
  "matchup.resetHome",
  "matchup.resetHomeTitle",
  "matchup.resetHomeDescription",
  "matchup.resetHomeConfirm",
] as const

describe("matchup reset-home copy", () => {
  it("is present in every locale", () => {
    for (const messages of [zhHansMessages, zhHantMessages, enMessages, jaMessages]) {
      for (const key of RESET_HOME_KEYS) {
        expect(messages[key]?.trim().length).toBeGreaterThan(0)
      }
    }
  })
})

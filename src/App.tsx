import { useEffect, useState } from "react"
import { IntlProvider } from "react-intl"

import { AppHeader } from "@/components/app-header"
import { ConditionCardPrototype } from "@/features/scenario-explorer/results/prototype/condition-card.prototype"
import { HeldItemPickerPrototype } from "@/features/scenario-explorer/tracks/held-item/prototype/held-item-picker.prototype"
import { MoveTrackCollapsedChipsPrototype } from "@/features/scenario-explorer/tracks/move/prototype/move-track-collapsed-chips.prototype"
import { ScenarioExplorerPage } from "@/features/scenario-explorer/scenario-explorer-page"
import { TooltipProvider } from "@/components/ui/tooltip"
import { loadInitialLocale, localeMessages, saveLocale, type SupportedLocale } from "@/lib/i18n"

const PROTOTYPE = new URLSearchParams(window.location.search).get("prototype")

function App() {
  const [locale, setLocaleState] = useState<SupportedLocale>(loadInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  function setLocale(locale: SupportedLocale) {
    saveLocale(locale)
    setLocaleState(locale)
  }

  return (
    <IntlProvider locale={locale} messages={localeMessages[locale]}>
      <TooltipProvider delay={0}>
        <div className="min-h-dvh bg-bg-app">
          <AppHeader locale={locale} onLocaleChange={setLocale} />
          <div className="mx-auto max-w-7xl">
            {PROTOTYPE === "move-track-collapsed-chips" ? (
              <MoveTrackCollapsedChipsPrototype />
            ) : PROTOTYPE === "held-item-picker" ? (
              <HeldItemPickerPrototype />
            ) : PROTOTYPE === "condition-card" ? (
              <ConditionCardPrototype />
            ) : (
              <ScenarioExplorerPage locale={locale} />
            )}
          </div>
        </div>
      </TooltipProvider>
    </IntlProvider>
  )
}

export default App

import { useEffect, useState } from "react"
import { IntlProvider } from "react-intl"

import { AppHeader } from "@/components/app-header"
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

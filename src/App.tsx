import { useEffect, useState } from "react"
import { IntlProvider } from "react-intl"

import { AppHeader } from "@/components/app-header"
import { ScenarioExplorerPage } from "@/features/scenario-explorer/scenario-explorer-page"
import { MovePickerRowsPrototype } from "@/features/scenario-explorer/tracks/move/move-picker-rows.prototype"
import { TooltipProvider } from "@/components/ui/tooltip"
import { loadInitialLocale, localeMessages, saveLocale, type SupportedLocale } from "@/lib/i18n"

function readMovePickerRowsPrototype() {
  return (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("prototype") === "move-picker-rows"
  )
}

function App() {
  const [locale, setLocaleState] = useState<SupportedLocale>(loadInitialLocale)
  const movePickerRowsPrototype = readMovePickerRowsPrototype()

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
            {movePickerRowsPrototype ? (
              <MovePickerRowsPrototype locale={locale} />
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

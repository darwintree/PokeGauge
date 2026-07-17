import { useEffect, useState } from "react"
import { IntlProvider } from "react-intl"

import { ScenarioExplorerPage } from "@/components/scenario-explorer/scenario-explorer-page"
import { TooltipProvider } from "@/components/ui/tooltip"
import { loadInitialLocale, localeMessages, saveLocale, type SupportedLocale } from "@/lib/i18n"

function App() {
  const [locale, setLocaleState] = useState<SupportedLocale>(loadInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")
    const syncTheme = () => document.documentElement.classList.toggle("dark", colorScheme.matches)

    syncTheme()
    colorScheme.addEventListener("change", syncTheme)
    return () => colorScheme.removeEventListener("change", syncTheme)
  }, [])

  function setLocale(locale: SupportedLocale) {
    saveLocale(locale)
    setLocaleState(locale)
  }

  return (
    <IntlProvider locale={locale} messages={localeMessages[locale]}>
      <TooltipProvider delay={0}>
        <ScenarioExplorerPage locale={locale} onLocaleChange={setLocale} />
      </TooltipProvider>
    </IntlProvider>
  )
}

export default App

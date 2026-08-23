import { useCallback, useEffect, useState } from "react"
import { IntlProvider } from "react-intl"

import { AppHeader } from "@/components/app-header"
import { ScenarioExplorerPage } from "@/features/scenario-explorer/scenario-explorer-page"
import { UsageTipsPrototype } from "@/features/scenario-explorer/usage-tip/usage-tips.prototype"
import { TooltipProvider } from "@/components/ui/tooltip"
import { loadInitialLocale, localeMessages, saveLocale, type SupportedLocale } from "@/lib/i18n"

function isUsageTipsPage() {
  return window.location.pathname === "/usage-tips"
}

function App() {
  const [locale, setLocaleState] = useState<SupportedLocale>(loadInitialLocale)
  const [feedbackScenarioUrl, setFeedbackScenarioUrl] = useState<string | null>(null)
  const [brandHomeAction, setBrandHomeAction] = useState<(() => void) | null>(null)
  const usageTipsPage = isUsageTipsPage()

  useEffect(() => {
    document.documentElement.lang = locale
    const messages = localeMessages[locale]
    document.title = `${messages["app.name"]} - ${messages["app.tagline"]}`
  }, [locale])

  function setLocale(locale: SupportedLocale) {
    saveLocale(locale)
    setLocaleState(locale)
  }

  const handleBrandHomeActionChange = useCallback((action: (() => void) | null) => {
    setBrandHomeAction(() => action)
  }, [])

  return (
    <IntlProvider locale={locale} messages={localeMessages[locale]}>
      <TooltipProvider delay={0}>
        <div className="min-h-dvh bg-bg-app">
          <AppHeader
            locale={locale}
            onLocaleChange={setLocale}
            feedbackScenarioUrl={feedbackScenarioUrl}
            onBrandHomeClick={brandHomeAction}
          />
          <div className="mx-auto max-w-7xl">
            {usageTipsPage ? (
              <UsageTipsPrototype />
            ) : (
              <ScenarioExplorerPage
                locale={locale}
                onFeedbackScenarioUrlChange={setFeedbackScenarioUrl}
                onBrandHomeActionChange={handleBrandHomeActionChange}
              />
            )}
          </div>
        </div>
      </TooltipProvider>
    </IntlProvider>
  )
}

export default App

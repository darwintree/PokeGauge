import { CalculationRulesContext } from "@/lib/calculation-rules-context"
import { loadCalculationRules, saveCalculationRules, type CalculationRules } from "@/lib/calculation-rules"
import { useCallback, useEffect, useState } from "react"
import { IntlProvider } from "react-intl"

import { AppHeader } from "@/components/app-header"
import { ScenarioExplorerPage } from "@/features/scenario-explorer/scenario-explorer-page"
import { UsageTipsPrototype } from "@/features/scenario-explorer/usage-tip/usage-tips.prototype"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useTrackProductEventOnce } from "@/lib/analytics"
import type { ProbabilityMode } from "@/lib/damage-calculation"
import { loadInitialLocale, localeMessages, saveLocale, type SupportedLocale } from "@/lib/i18n"
import { loadProbabilityMode, saveProbabilityMode } from "@/lib/probability-mode-preference"
import { startUsageSession } from "@/lib/usage-store"
import {
  loadStatNameStrategy,
  saveStatNameStrategy,
  type StatNameStrategy,
} from "@/lib/stat-preset"

function isUsageTipsPage() {
  return window.location.pathname === "/usage-tips"
}

function App() {
  const [calculationRules, setCalculationRulesState] = useState<CalculationRules>(loadCalculationRules)
  const [locale, setLocaleState] = useState<SupportedLocale>(loadInitialLocale)
  const [probabilityMode, setProbabilityModeState] = useState<ProbabilityMode>(loadProbabilityMode)
  const [statNameStrategy, setStatNameStrategyState] = useState<StatNameStrategy>(loadStatNameStrategy)
  const [feedbackScenarioUrl, setFeedbackScenarioUrl] = useState<string | null>(null)
  const [brandHomeAction, setBrandHomeAction] = useState<(() => void) | null>(null)
  const usageTipsPage = isUsageTipsPage()
  useTrackProductEventOnce("page_view", locale)

  useEffect(() => {
    void startUsageSession()
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    const messages = localeMessages[locale]
    document.title = `${messages["app.name"]} - ${messages["app.tagline"]}`
  }, [locale])

  function setLocale(locale: SupportedLocale) {
    saveLocale(locale)
    setLocaleState(locale)
  }

  function setCalculationRules(rules: CalculationRules) {
    saveCalculationRules(rules)
    setCalculationRulesState(rules)
  }

  function setProbabilityMode(mode: ProbabilityMode) {
    saveProbabilityMode(mode)
    setProbabilityModeState(mode)
  }

  function setStatNameStrategy(strategy: StatNameStrategy) {
    saveStatNameStrategy(strategy)
    setStatNameStrategyState(strategy)
  }

  const handleBrandHomeActionChange = useCallback((action: (() => void) | null) => {
    setBrandHomeAction(() => action)
  }, [])

  return (
    <IntlProvider locale={locale} messages={localeMessages[locale]}>
      <CalculationRulesContext value={calculationRules}>
        <TooltipProvider>
          <div className="min-h-dvh bg-bg-app">
            <AppHeader
              locale={locale}
              onLocaleChange={setLocale}
              calculationRules={calculationRules}
              onCalculationRulesChange={setCalculationRules}
              probabilityMode={probabilityMode}
              onProbabilityModeChange={setProbabilityMode}
              statNameStrategy={statNameStrategy}
              onStatNameStrategyChange={setStatNameStrategy}
              feedbackScenarioUrl={feedbackScenarioUrl}
              onBrandHomeClick={brandHomeAction}
            />
            <div className="mx-auto max-w-7xl">
              {usageTipsPage ? (
                <UsageTipsPrototype />
              ) : (
                <ScenarioExplorerPage
                  locale={locale}
                  probabilityMode={probabilityMode}
                  statNameStrategy={statNameStrategy}
                  onFeedbackScenarioUrlChange={setFeedbackScenarioUrl}
                  onBrandHomeActionChange={handleBrandHomeActionChange}
                />
              )}
            </div>
          </div>
        </TooltipProvider>
      </CalculationRulesContext>
    </IntlProvider>
  )
}

export default App

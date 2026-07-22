import { useEffect, useState } from "react"
import { IntlProvider } from "react-intl"

import { AppHeader } from "@/components/app-header"
import { ScenarioExplorerPage } from "@/components/scenario-explorer/scenario-explorer-page"
import { TooltipProvider } from "@/components/ui/tooltip"
import { loadInitialLocale, localeMessages, saveLocale, type SupportedLocale } from "@/lib/i18n"

const THEME_STORAGE_KEY = "pokemon-damage-calc.theme"

type Theme = "light" | "dark"

function App() {
  const [locale, setLocaleState] = useState<SupportedLocale>(loadInitialLocale)
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const isDark = theme === "dark"
    document.documentElement.classList.toggle("dark", isDark)
    document
      .querySelector<HTMLMetaElement>("#theme-color")
      ?.setAttribute("content", isDark ? "#171717" : "#fafafa")
  }, [theme])

  useEffect(() => {
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")
    const syncTheme = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem(THEME_STORAGE_KEY) === null) {
        setTheme(event.matches ? "dark" : "light")
      }
    }

    colorScheme.addEventListener("change", syncTheme)
    return () => colorScheme.removeEventListener("change", syncTheme)
  }, [])

  function setLocale(locale: SupportedLocale) {
    saveLocale(locale)
    setLocaleState(locale)
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark"
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    setTheme(nextTheme)
  }

  return (
    <IntlProvider locale={locale} messages={localeMessages[locale]}>
      <TooltipProvider delay={0}>
        <AppHeader
          locale={locale}
          isDark={theme === "dark"}
          onLocaleChange={setLocale}
          onThemeToggle={toggleTheme}
        />
        <ScenarioExplorerPage locale={locale} />
      </TooltipProvider>
    </IntlProvider>
  )
}

export default App

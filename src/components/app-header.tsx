import {
  ExternalLinkIcon,
  MessageSquareWarningIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CHANGELOG_ENTRIES } from "@/lib/changelog"
import { trackProductEvent } from "@/lib/analytics"
import type { ProbabilityMode } from "@/lib/damage-calculation"
import type { UsageSource } from "@/lib/usage-source-preference"
import { createFeedbackUrl } from "@/lib/feedback"
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n"
import {
  STAT_NAME_STRATEGY_OPTIONS,
  type StatNameStrategy,
} from "@/lib/stat-preset"

const SOURCE_URL = "https://github.com/darwintree/PokeGauge"

const LICENSE_LINKS = [
  {
    nameId: "credits.license.name",
    href: `${SOURCE_URL}/blob/main/LICENSE`,
    descriptionId: "credits.license",
  },
  {
    nameId: "credits.source.name",
    href: SOURCE_URL,
    descriptionId: "credits.source",
  },
] as const

const CREDIT_LINKS = [
  {
    name: "Smogon Damage Calc",
    href: "https://github.com/smogon/damage-calc",
    descriptionId: "credits.smogon",
  },
  {
    name: "PokéAPI",
    href: "https://pokeapi.co/docs",
    descriptionId: "credits.pokeapi",
  },
  {
    name: "Pokémon Champions Battle Data",
    href: "https://championsbattledata.com/",
    descriptionId: "credits.champions",
  },
  {
    name: "Pikalytics",
    href: "https://www.pikalytics.com/pokedex",
    descriptionId: "credits.pikalytics",
  },
] as const

type LocaleControlProps = {
  locale: SupportedLocale
  onLocaleChange: (locale: SupportedLocale) => void
}

type AppHeaderProps = LocaleControlProps & {
  feedbackScenarioUrl: string | null
  probabilityMode: ProbabilityMode
  onProbabilityModeChange: (mode: ProbabilityMode) => void
  statNameStrategy: StatNameStrategy
  onStatNameStrategyChange: (strategy: StatNameStrategy) => void
  usageSource?: UsageSource
  onUsageSourceChange?: (source: UsageSource) => void
  /** When set, brand is a control that requests return to matchup landing. */
  onBrandHomeClick?: (() => void) | null
}

type SettingsDialogProps = LocaleControlProps & Pick<
  AppHeaderProps,
  | "probabilityMode"
  | "onProbabilityModeChange"
  | "statNameStrategy"
  | "onStatNameStrategyChange"
  | "usageSource"
  | "onUsageSourceChange"
>

const SELECT_CLASS =
  "h-10 w-full rounded-[10px] border border-hud-frame bg-paper px-3 text-sm font-bold text-ink shadow-hud-chip outline-none hover:bg-token-bg focus-visible:ring-2 focus-visible:ring-signal-yellow"
const TAB_CLASS =
  "h-10 flex-none rounded-[9px] px-4 font-extrabold data-active:bg-signal-yellow data-active:shadow-hud-chip"

function SettingsLinkRow({
  href,
  name,
  descriptionId,
}: {
  href: string
  name: React.ReactNode
  descriptionId: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group -mx-2 grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-3 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span className="min-w-0">
        <span className="block font-medium">{name}</span>
        <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
          <FormattedMessage id={descriptionId} />
        </span>
      </span>
      <ExternalLinkIcon
        aria-hidden
        className="text-muted-foreground size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
      <span className="sr-only">
        <FormattedMessage id="header.opensNewTab" />
      </span>
    </a>
  )
}

function PreferenceRow({
  htmlFor,
  label,
  description,
  children,
}: {
  htmlFor: string
  label: React.ReactNode
  description: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3 border-b border-hairline py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,17rem)] sm:items-center">
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="font-extrabold text-ink">{label}</label>
        <div id={`${htmlFor}-description`} className="mt-1 text-xs leading-relaxed font-medium text-hud-muted">
          {description}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

function SettingsDialog({
  locale,
  onLocaleChange,
  probabilityMode,
  onProbabilityModeChange,
  statNameStrategy,
  onStatNameStrategyChange,
  usageSource,
  onUsageSourceChange,
}: SettingsDialogProps) {
  const intl = useIntl()
  usageSource ??= "champions"
  onUsageSourceChange ??= () => {}
  const probabilityHintId = probabilityMode === "battle-odds"
    ? "probability.mode.battleOdds.hint"
    : "probability.mode.classic.hint"

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-11 rounded-full border border-hud-frame bg-paper px-0 text-ink shadow-hud-chip hover:bg-signal-yellow hover:text-ink sm:size-10 md:w-auto md:px-2.5 lg:h-8"
            aria-label={intl.formatMessage({ id: "settings.title" })}
          />
        }
      >
        <SettingsIcon aria-hidden />
        <span className="hidden md:inline">
          <FormattedMessage id="settings.title" />
        </span>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden border border-hud-frame bg-paper p-0 shadow-hud-panel sm:h-auto sm:max-h-[min(82dvh,42rem)] sm:max-w-2xl"
      >
        <DialogClose
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 size-11 sm:size-9"
              aria-label={intl.formatMessage({ id: "app.close" })}
            />
          }
        >
          <XIcon aria-hidden />
        </DialogClose>
        <DialogHeader className="border-b border-hairline px-5 py-4 pr-14">
          <DialogTitle className="text-lg font-extrabold">
            <FormattedMessage id="settings.title" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="settings.description" />
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preferences" className="min-h-0 gap-0">
          <TabsList className="group-data-horizontal/tabs:h-auto w-full shrink-0 justify-start gap-1 overflow-x-auto rounded-none border-b border-hairline bg-token-bg/70 p-2">
            <TabsTrigger className={TAB_CLASS} value="preferences">
              <FormattedMessage id="settings.preferences" />
            </TabsTrigger>
            <TabsTrigger className={TAB_CLASS} value="changelog">
              <FormattedMessage id="settings.changelog" />
            </TabsTrigger>
            <TabsTrigger className={TAB_CLASS} value="credits">
              <FormattedMessage id="settings.credits" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="min-h-0 overscroll-contain overflow-y-auto px-5 py-2 sm:px-6">
            <PreferenceRow
              htmlFor="settings-locale"
              label={<FormattedMessage id="locale.label" />}
              description={<FormattedMessage id="settings.language.description" />}
            >
              <select
                id="settings-locale"
                aria-describedby="settings-locale-description"
                value={locale}
                onChange={(event) => onLocaleChange(event.target.value as SupportedLocale)}
                className={SELECT_CLASS}
              >
                {SUPPORTED_LOCALES.map((value) => (
                  <option key={value} value={value}>
                    {intl.formatMessage({ id: `locale.${value}` })}
                  </option>
                ))}
              </select>
            </PreferenceRow>
            <PreferenceRow htmlFor="settings-usage-source" label={<FormattedMessage id="settings.usageSource.label" />} description={<FormattedMessage id="settings.usageSource.description" />}>
              <select id="settings-usage-source" value={usageSource} onChange={(event) => onUsageSourceChange(event.target.value as UsageSource)} className={SELECT_CLASS}>
                <option value="champions">Pokémon Champions</option>
                <option value="smogon">Smogon</option><option value="pikalytics">Pikalytics</option>
              </select>
            </PreferenceRow>

            <PreferenceRow
              htmlFor="settings-stat-display"
              label={<FormattedMessage id="stat.display" />}
              description={<FormattedMessage id="settings.statDisplay.description" />}
            >
              <select
                id="settings-stat-display"
                aria-describedby="settings-stat-display-description"
                value={statNameStrategy}
                onChange={(event) => onStatNameStrategyChange(event.target.value as StatNameStrategy)}
                className={SELECT_CLASS}
              >
                {STAT_NAME_STRATEGY_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {intl.formatMessage({ id: `stat.strategy.${value}` })}
                  </option>
                ))}
              </select>
            </PreferenceRow>

            <PreferenceRow
              htmlFor="settings-probability-mode"
              label={<FormattedMessage id="settings.probabilityMode" />}
              description={<FormattedMessage id={probabilityHintId} />}
            >
              <select
                id="settings-probability-mode"
                aria-describedby="settings-probability-mode-description"
                value={probabilityMode}
                onChange={(event) => onProbabilityModeChange(event.target.value as ProbabilityMode)}
                className={SELECT_CLASS}
              >
                <option value="battle-odds">
                  {intl.formatMessage({ id: "probability.mode.battleOdds" })}
                </option>
                <option value="classic">
                  {intl.formatMessage({ id: "probability.mode.classic" })}
                </option>
              </select>
            </PreferenceRow>
          </TabsContent>

          <TabsContent value="changelog" className="min-h-0 overscroll-contain overflow-y-auto px-5 py-5 sm:max-h-[min(60dvh,30rem)] sm:px-6">
            {CHANGELOG_ENTRIES.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                <FormattedMessage id="changelog.empty" />
              </p>
            ) : (
              <div className="space-y-5 pr-1">
                {CHANGELOG_ENTRIES.map((entry, index) => (
                  <article
                    key={`${entry.version ?? "unreleased"}-${index}`}
                    className="space-y-1.5"
                  >
                    <h2 className="text-muted-foreground text-xs font-bold tabular-nums">
                      {entry.version ? (
                        `v${entry.version}`
                      ) : (
                        <FormattedMessage id="changelog.unreleased" />
                      )}
                    </h2>
                    <div className="space-y-2">
                      {entry.messages[locale].map((message, messageIndex) => (
                        <p key={messageIndex} className="leading-relaxed">
                          {message}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="credits" className="min-h-0 overscroll-contain overflow-y-auto px-5 py-3 sm:px-6">
            <div className="grid">
              {LICENSE_LINKS.map((link) => (
                <SettingsLinkRow
                  key={link.nameId}
                  href={link.href}
                  name={<FormattedMessage id={link.nameId} />}
                  descriptionId={link.descriptionId}
                />
              ))}
            </div>
            <div className="my-1 border-t border-hairline" role="separator" />
            <div className="grid">
              {CREDIT_LINKS.map((credit) => (
                <SettingsLinkRow
                  key={credit.name}
                  href={credit.href}
                  name={credit.name}
                  descriptionId={credit.descriptionId}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export function AppHeader({
  locale,
  onLocaleChange,
  probabilityMode,
  onProbabilityModeChange,
  statNameStrategy,
  onStatNameStrategyChange,
  usageSource,
  onUsageSourceChange,
  feedbackScenarioUrl,
  onBrandHomeClick = null,
}: AppHeaderProps) {
  const intl = useIntl()

  const brand = (
    <>
      <img
        src="/favicon-32x32.png"
        srcSet="/pokegauge-icon-64.png 2x, /pokegauge-icon-96.png 3x"
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0"
      />
      <span className="truncate text-[15px] font-extrabold tracking-tight text-paper">
        <FormattedMessage id="app.name" />
        <span aria-hidden className="text-signal-yellow">.</span>
      </span>
    </>
  )

  return (
    <header className="z-40 h-14 border-b border-hud-frame bg-[var(--appbar)] text-paper lg:sticky lg:top-0">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-1 px-4 sm:gap-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {onBrandHomeClick ? (
            <button
              type="button"
              onClick={onBrandHomeClick}
              className="flex min-w-0 cursor-pointer items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-signal-yellow"
              aria-label={intl.formatMessage({ id: "matchup.resetHome" })}
              title={intl.formatMessage({ id: "matchup.resetHome" })}
            >
              {brand}
            </button>
          ) : (
            <div className="flex min-w-0 items-center gap-3">{brand}</div>
          )}
          <span aria-hidden className="hidden h-4 w-px bg-paper/30 lg:block" />
          <span className="hidden truncate text-xs text-paper/75 lg:block">
            <FormattedMessage id="matchup.context" />
          </span>
        </div>

        <nav
          aria-label={intl.formatMessage({ id: "header.navigation" })}
          className="flex shrink-0 items-center gap-0.5"
        >
          <Button
            nativeButton={false}
            render={
              <a
                href={createFeedbackUrl(feedbackScenarioUrl)}
                target="_blank"
                rel="noreferrer"
                aria-label={intl.formatMessage({ id: "header.feedbackNewTab" })}
                onClick={() => trackProductEvent("feedback", locale)}
              />
            }
            variant="ghost"
            size="sm"
            className="size-11 rounded-full border border-hud-frame bg-paper px-0 text-ink shadow-hud-chip hover:bg-signal-yellow hover:text-ink sm:size-10 md:w-auto md:px-2.5 lg:h-8"
          >
            <MessageSquareWarningIcon aria-hidden />
            <span className="hidden md:inline">
              <FormattedMessage id="header.feedback" />
            </span>
          </Button>

          <SettingsDialog
            locale={locale}
            onLocaleChange={onLocaleChange}
            probabilityMode={probabilityMode}
            onProbabilityModeChange={onProbabilityModeChange}
            statNameStrategy={statNameStrategy}
            onStatNameStrategyChange={onStatNameStrategyChange}
            usageSource={usageSource}
            onUsageSourceChange={onUsageSourceChange}
          />
        </nav>
      </div>
    </header>
  )
}

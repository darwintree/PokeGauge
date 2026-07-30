import {
  ExternalLinkIcon,
  InfoIcon,
  MessageSquareWarningIcon,
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
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const FEEDBACK_URL = "https://github.com/darwintree/pokemon-damage-calc/issues/new"

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
] as const

type LocaleControlProps = {
  locale: SupportedLocale
  onLocaleChange: (locale: SupportedLocale) => void
}

type AppHeaderProps = LocaleControlProps

function LocaleSelect({
  id,
  locale,
  onLocaleChange,
  className,
}: LocaleControlProps & { id: string; className?: string }) {
  const intl = useIntl()

  return (
    <select
      id={id}
      value={locale}
      onChange={(event) => onLocaleChange(event.target.value as SupportedLocale)}
      className={cn(
        "h-9 rounded-full border-2 border-ink bg-paper px-2 text-xs font-bold text-ink shadow-hud-chip",
        className,
      )}
      aria-label={intl.formatMessage({ id: "locale.label" })}
    >
      {SUPPORTED_LOCALES.map((value) => (
        <option key={value} value={value}>
          {intl.formatMessage({ id: `locale.${value}` })}
        </option>
      ))}
    </select>
  )
}

function ProjectDialog({ locale, onLocaleChange }: LocaleControlProps) {
  const intl = useIntl()

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-11 rounded-full border-2 border-ink bg-paper px-0 text-ink shadow-hud-chip hover:bg-signal-yellow hover:text-ink sm:size-10 md:w-auto md:px-2.5 lg:h-8"
            aria-label={intl.formatMessage({ id: "header.projectInfo" })}
          />
        }
      >
        <InfoIcon aria-hidden />
        <span className="hidden md:inline">
          <FormattedMessage id="header.projectInfo" />
        </span>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="gap-5 border-2 border-ink bg-paper shadow-hud-panel sm:max-w-md">
        <DialogClose
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1.5 right-1.5 size-11 sm:top-2 sm:right-2 sm:size-8"
              aria-label={intl.formatMessage({ id: "app.close" })}
            />
          }
        >
          <XIcon aria-hidden />
        </DialogClose>
        <DialogHeader className="pr-12">
          <DialogTitle>
            <FormattedMessage id="header.projectInfo" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="header.projectDescription" />
            <span className="mt-1 block">
              <FormattedMessage id="matchup.context" />
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4 border-b pb-4 sm:hidden">
          <label htmlFor="mobile-locale" className="text-sm font-medium">
            <FormattedMessage id="locale.label" />
          </label>
          <LocaleSelect
            id="mobile-locale"
            locale={locale}
            onLocaleChange={onLocaleChange}
          />
        </div>

        <Tabs defaultValue="changelog">
          <TabsList variant="line" className="w-full border-b">
            <TabsTrigger value="changelog">
              <FormattedMessage id="header.changelog" />
            </TabsTrigger>
            <TabsTrigger value="credits">
              <FormattedMessage id="header.credits" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="changelog" className="pt-4">
            <article className="space-y-2">
              <time
                dateTime="2026-07-22"
                className="text-muted-foreground text-xs tabular-nums"
              >
                {intl.formatDate(new Date("2026-07-22T00:00:00Z"), {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <h2 className="font-medium">
                <FormattedMessage id="changelog.structure.title" />
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                <FormattedMessage id="changelog.structure.body" />
              </p>
            </article>
          </TabsContent>

          <TabsContent value="credits" className="pt-2">
            <div className="grid">
              {CREDIT_LINKS.map((credit) => (
                <a
                  key={credit.name}
                  href={credit.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group -mx-2 grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-3 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{credit.name}</span>
                    <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                      <FormattedMessage id={credit.descriptionId} />
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
}: AppHeaderProps) {
  const intl = useIntl()

  return (
    <header className="sticky top-0 z-40 h-14 border-b-2 border-ink bg-[var(--appbar)] text-paper">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-1 px-4 sm:gap-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/favicon-32x32.png"
            srcSet="/pokelens-icon-64.png 2x, /pokelens-icon-96.png 3x"
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0"
          />
          <span className="truncate text-[15px] font-extrabold tracking-tight text-paper">
            <FormattedMessage id="app.name" />
            <span aria-hidden className="text-signal-yellow">.</span>
          </span>
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
                href={FEEDBACK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label={intl.formatMessage({ id: "header.feedbackNewTab" })}
              />
            }
            variant="ghost"
            size="sm"
            className="size-11 rounded-full border-2 border-ink bg-paper px-0 text-ink shadow-hud-chip hover:bg-signal-yellow hover:text-ink sm:size-10 md:w-auto md:px-2.5 lg:h-8"
          >
            <MessageSquareWarningIcon aria-hidden />
            <span className="hidden md:inline">
              <FormattedMessage id="header.feedback" />
            </span>
          </Button>

          <ProjectDialog locale={locale} onLocaleChange={onLocaleChange} />

          <LocaleSelect
            id="header-locale"
            locale={locale}
            onLocaleChange={onLocaleChange}
            className="ml-1 hidden sm:block"
          />
        </nav>
      </div>
    </header>
  )
}

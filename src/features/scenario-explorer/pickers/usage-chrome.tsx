import { useState, type ReactElement } from "react"
import { Check, ChevronDown, Ellipsis, LoaderCircle, RefreshCw } from "lucide-react"
import { FormattedMessage, FormattedRelativeTime, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  applyUsageStorePending,
  refreshUsageStore,
  setUsageStoreRule,
  setUsageStoreSource,
  useUsageStore,
} from "@/lib/usage-store"
import { usageSourceMessageId, USAGE_SOURCES } from "@/lib/usage-source-preference"
import { cn } from "@/lib/utils"

const HUD_CHIP_BUTTON =
  "border border-hud-frame bg-paper font-bold shadow-hud-chip hover:bg-token-bg/60"

function relativeSeconds(fetchedAt: number): number {
  return Math.round((fetchedAt - Date.now()) / 1000)
}

type UsageFetchStatusProps = {
  showPending?: boolean
  className?: string
  id?: string
}

export function UsageFetchStatus({
  showPending = false,
  className,
  id,
}: UsageFetchStatusProps): ReactElement {
  const intl = useIntl()
  const usage = useUsageStore()
  const [failed, setFailed] = useState(false)
  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-2", className)} id={id}>
      <p className="text-hud-muted min-w-0 flex-1 truncate text-xs font-medium">
        {usage.fetchedAt == null ? (
          <FormattedMessage id="settings.usageFetched.never" />
        ) : (
          <FormattedMessage id="settings.usageFetched.label" values={{
            time: <FormattedRelativeTime value={relativeSeconds(usage.fetchedAt)} numeric="auto" updateIntervalInSeconds={60} />,
          }} />
        )}
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={usage.refreshing}
        aria-label={intl.formatMessage({ id: "settings.usageRefresh" })}
        className={HUD_CHIP_BUTTON}
        onClick={() => {
          setFailed(false)
          void refreshUsageStore().catch(() => setFailed(true))
        }}
      >
        <RefreshCw className={cn("size-3.5", usage.refreshing && "animate-spin motion-reduce:animate-none")} />
        <FormattedMessage id="settings.usageRefresh" />
      </Button>
      {failed ? (
        <p role="alert" className="w-full text-xs text-hud-muted">
          <FormattedMessage id="usage.rules.error" />
        </p>
      ) : null}
      {showPending && usage.pendingUpdate ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={intl.formatMessage({ id: "usage.pendingUpdate" })}
          className={HUD_CHIP_BUTTON}
          onClick={applyUsageStorePending}
        >
          <FormattedMessage id="usage.applyUpdate" />
        </Button>
      ) : null}
    </div>
  )
}

type UsagePickerChromeProps = {
  className?: string
  variant?: "popover" | "settings"
}

/** Shared selection behavior, with a compact picker or an inline settings layout. */
export function UsagePickerChrome({ className, variant = "popover" }: UsagePickerChromeProps): ReactElement {
  const intl = useIntl()
  const usage = useUsageStore()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const selected = usage.rules.find(rule => rule.id === usage.ruleId)
  const sourceLabel = intl.formatMessage({ id: usageSourceMessageId(usage.source) })
  const hidden = usage.rules.filter(rule => !rule.recommended && rule.id !== usage.ruleId)
  const visible = usage.rules.filter(rule => expanded || rule.recommended || rule.id === usage.ruleId)
  const activeSource = usage.loadingSource ?? usage.catalogError ?? usage.source
  const settings = variant === "settings"

  function selectRule(ruleId: string): void {
    void setUsageStoreRule(ruleId)
    if (!settings) {
      setOpen(false)
      setExpanded(false)
    }
  }

  let ruleContent: ReactElement
  if (usage.loadingSource) {
    ruleContent = (
      <p role="status" className="p-2 text-xs text-hud-muted">
        <FormattedMessage id="usage.rules.loading" />
      </p>
    )
  } else if (usage.catalogError) {
    ruleContent = (
      <div className="space-y-2 p-2">
        <p role="alert" className="text-xs text-hud-muted">
          <FormattedMessage id="usage.rules.error" />
        </p>
        <Button size="sm" variant="outline" onClick={() => void setUsageStoreSource(activeSource)}>
          <FormattedMessage id="usage.rules.retry" />
        </Button>
      </div>
    )
  } else {
    ruleContent = (
      <>
        {visible.map(rule => (
          <Button
            key={rule.id}
            variant="ghost"
            aria-pressed={usage.ruleId === rule.id}
            title={rule.label}
            className={cn(
              "h-auto min-h-10 w-full justify-between gap-2 whitespace-normal px-2 py-2 text-left text-xs",
              settings && "min-h-11 px-3 py-3 text-sm",
              usage.ruleId === rule.id && "bg-signal-yellow hover:bg-signal-yellow",
            )}
            onClick={() => selectRule(rule.id)}
          >
            <span className="min-w-0 break-words">{settings ? rule.label : rule.displayName ?? rule.label}</span>
            {usage.ruleId === rule.id ? <Check className="size-3.5 shrink-0" /> : null}
          </Button>
        ))}
        {hidden.length > 0 ? (
          <Button
            variant="ghost"
            aria-expanded={expanded}
            className={cn("mt-1 h-auto min-h-10 w-full justify-start whitespace-normal px-2 py-2 text-left text-xs text-hud-muted", settings && "text-sm")}
            onClick={() => setExpanded(value => !value)}
          >
            <Ellipsis className="shrink-0" />
            <FormattedMessage id={expanded ? "usage.rules.less" : "usage.rules.more"} values={{ count: hidden.length }} />
          </Button>
        ) : null}
      </>
    )
  }

  const panel = (
    <>
      <div className={settings ? "space-y-5" : "grid grid-cols-[110px_minmax(0,1fr)]"}>
        <nav
          aria-label={intl.formatMessage({ id: "settings.usageSource.label" })}
          className={settings ? "space-y-2" : "space-y-1 border-r border-hairline bg-token-bg/40 p-2"}
        >
          {settings ? <h3 className="text-sm font-bold"><FormattedMessage id="settings.usageSource.label" /></h3> : null}
          <div className={settings ? "grid grid-cols-3 gap-2" : "space-y-1"}>
            {USAGE_SOURCES.map(source => (
              <Button
                key={source}
                variant="ghost"
                aria-pressed={activeSource === source}
                className={cn(
                  "h-auto min-h-10 w-full justify-start whitespace-normal px-2 py-2 text-left text-xs",
                  settings && "min-h-12 justify-center rounded-md border border-hairline text-center text-sm",
                  activeSource === source && (settings ? "border-hud-frame bg-token-bg font-bold" : "bg-paper font-bold"),
                )}
                onClick={() => {
                  setExpanded(false)
                  void setUsageStoreSource(source)
                }}
              >
                <FormattedMessage id={usageSourceMessageId(source)} />
              </Button>
            ))}
          </div>
        </nav>
        <section
          aria-label={intl.formatMessage({ id: "settings.usageRule.label" })}
          className={settings ? "min-w-0 space-y-2" : "max-h-[min(50dvh,20rem)] min-w-0 overflow-y-auto overscroll-contain p-2"}
          aria-busy={!!usage.loadingSource}
        >
          {settings ? <h3 className="text-sm font-bold"><FormattedMessage id="settings.usageRule.label" /></h3> : null}
          {ruleContent}
        </section>
      </div>
      {!usage.loadingSource && !usage.catalogError ? (
        <div className={cn("space-y-3 border-t border-hairline", settings ? "mt-5 pt-4" : "p-3")}>
          {!settings && selected ? <p className="break-words text-xs leading-relaxed text-hud-muted">{selected.label}</p> : null}
          <UsageFetchStatus showPending />
        </div>
      ) : null}
    </>
  )

  if (settings) return <div className={className}>{panel}</div>

  return (
    <Popover open={open} onOpenChange={next => {
      setOpen(next)
      if (!next) setExpanded(false)
    }}>
      <PopoverTrigger render={<Button variant="outline" className={cn(HUD_CHIP_BUTTON, "h-8 w-full min-w-0 justify-between gap-2 px-2 text-xs", className)} />}>
        <span className="min-w-0 truncate">
          {sourceLabel}
          <span className="ml-2 font-medium text-hud-muted">{selected?.displayName ?? selected?.label ?? usage.ruleId}</span>
        </span>
        {usage.pendingUpdate ? <span className="shrink-0 text-[10px] text-hud-muted"><FormattedMessage id="usage.updateHint" /></span> : null}
        {usage.loadingSource ? <LoaderCircle className="size-3.5 shrink-0 animate-spin motion-reduce:animate-none" /> : <ChevronDown className="size-3.5 shrink-0" />}
      </PopoverTrigger>
      <PopoverContent align="start" aria-label={intl.formatMessage({ id: "settings.usageRule.label" })} className="w-[min(420px,calc(100vw-2rem))] overflow-hidden border border-hud-frame bg-paper p-0 shadow-hud-panel">
        {panel}
      </PopoverContent>
    </Popover>
  )
}

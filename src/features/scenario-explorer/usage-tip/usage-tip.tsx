import { Bookmark, ChevronDown, Lightbulb, X, type LucideIcon } from "lucide-react"
import { useState, type CSSProperties, type ReactNode } from "react"
import { useIntl } from "react-intl"

import { cn } from "@/lib/utils"

import { RangeMark } from "../tracks/stats/stat-mode-switch"
import {
  isUsageTipMutedOn,
  muteUsageTipsForLocalDay,
  pickUsageTip,
  type UsageTipEntry,
} from "./usage-tips"

function TipPill({
  icon: Icon,
  children,
  className,
  style,
}: {
  icon?: LucideIcon
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 align-middle font-extrabold text-ink", className)}
      style={style}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden /> : null}
      {children}
    </span>
  )
}

const BOX_SWATCH_COLORS = {
  green: "var(--damage-safe-end)",
  orange: "var(--damage-warm-end)",
  darkred: "var(--damage-guaranteed-end)",
} as const

function BoxSwatch({ color, children }: { color: keyof typeof BOX_SWATCH_COLORS; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle font-extrabold text-ink">
      <span
        aria-hidden
        className="inline-block h-2 w-3.5 shrink-0 rounded-[2px]"
        style={{ backgroundColor: BOX_SWATCH_COLORS[color] }}
      />
      {children}
    </span>
  )
}

export function UsageTipCard({
  tip,
  attached,
  onDismiss,
}: {
  tip: UsageTipEntry
  attached?: boolean
  onDismiss?: () => void
}) {
  const intl = useIntl()

  function dismiss() {
    onDismiss?.()
  }

  return (
    <aside className={cn("flex items-start gap-3", attached && "border-t border-hairline pt-3")}>
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={2.5} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold tracking-tight text-ink">
          {intl.formatMessage({ id: tip.titleId })}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug font-medium text-hud-muted">
          {intl.formatMessage(
            { id: tip.bodyId },
            {
              b: (chunks) => <TipPill icon={tip.icon}>{chunks}</TipPill>,
              bookmark: (chunks) => <TipPill icon={Bookmark}>{chunks}</TipPill>,
              ex: (chunks) => (
                <TipPill
                  className="rounded-md border px-1.5 py-px text-[11px]"
                  style={{ borderColor: "var(--stat-tier-ex-border)", backgroundColor: "var(--stat-tier-ex-bg)", color: "var(--stat-tier-ex-fg)" }}
                >
                  {chunks}
                </TipPill>
              ),
              green: (chunks) => <BoxSwatch color="green">{chunks}</BoxSwatch>,
              orange: (chunks) => <BoxSwatch color="orange">{chunks}</BoxSwatch>,
              darkred: (chunks) => <BoxSwatch color="darkred">{chunks}</BoxSwatch>,
              range: (chunks) => (
                <TipPill>
                  <span className="inline-flex h-3 w-7 shrink-0" aria-hidden>
                    <RangeMark />
                  </span>
                  {chunks}
                </TipPill>
              ),
              expand: (chunks) => <TipPill icon={ChevronDown}>{chunks}</TipPill>,
            },
          )}
        </p>
      </div>
      <button
        type="button"
        className="grid size-11 shrink-0 place-items-center rounded-[9px] hover:bg-token-bg sm:size-8"
        aria-label={intl.formatMessage({ id: "usageTip.dismiss" })}
        onClick={dismiss}
      >
        <X className="size-3.5" />
      </button>
    </aside>
  )
}

export function UsageTip({ attached }: { attached?: boolean }) {
  const [muted, setMuted] = useState(isUsageTipMutedOn)
  const [tip] = useState(pickUsageTip)

  if (muted || !tip) return null

  return (
    <UsageTipCard
      tip={tip}
      attached={attached}
      onDismiss={() => {
        muteUsageTipsForLocalDay()
        setMuted(true)
      }}
    />
  )
}

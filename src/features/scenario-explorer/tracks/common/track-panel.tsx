import { ChevronDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { FormattedMessage } from "react-intl"

import { cn } from "@/lib/utils"

type TrackPanelProps = {
  label: ReactNode
  icon: LucideIcon
  summary: ReactNode
  expanded: boolean
  onToggle: () => void
  children: ReactNode
  summaryLayout?: "inline" | "stack"
  labelExtra?: ReactNode
  trailing?: ReactNode
  preview?: ReactNode
  className?: string
  side?: "attacker" | "defender"
}

export function TrackPanel({
  label,
  icon: Icon,
  summary,
  expanded,
  onToggle,
  children,
  summaryLayout = "inline",
  labelExtra,
  trailing,
  preview,
  className,
  side,
}: TrackPanelProps) {
  const richSummary = typeof summary !== "string"
  const stack = summaryLayout === "stack" && richSummary
  const sideMark = side ? (
    <>
      <span
        aria-hidden
        className={cn(
          "inline-flex h-3 shrink-0 items-center rounded-[3px] px-0.5 text-[0.65em] font-extrabold leading-none text-[var(--battle-side-foreground)]",
          side === "attacker"
            ? "bg-[var(--battle-side-attacker)]"
            : "bg-[var(--battle-side-defender)]",
        )}
      >
        {side === "attacker" ? "ATK" : "DEF"}
      </span>
      <span className="sr-only">
        <FormattedMessage id={side === "attacker" ? "track.attacker" : "track.defender"} />
      </span>
    </>
  ) : null

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[14px] border-2 border-ink bg-paper shadow-hud-panel transition-colors",
        className,
      )}
    >
      {stack ? (
        <div className="relative flex h-11 items-center gap-2 px-2.5 sm:h-10">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={onToggle}
            className="hover:bg-token-bg/60 focus-visible:ring-ring absolute inset-0 focus-visible:ring-2 focus-visible:outline-none"
          />
          <span className="pointer-events-none relative flex min-w-0 flex-1 items-center gap-2">
            <Icon className="text-muted-foreground size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="flex min-w-0 items-center gap-1 text-xs font-extrabold">
              {sideMark}
              <span className="truncate">{label}</span>
            </span>
          </span>
          <ChevronDown
            className={cn(
              "pointer-events-none relative size-3.5 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </div>
      ) : (
        <div className="flex w-full min-w-0 items-center gap-2 px-2.5 py-2">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={onToggle}
            className="hover:bg-token-bg/60 focus-visible:ring-ring flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:ring-2 focus-visible:outline-none"
          >
            <Icon className="text-muted-foreground size-3.5 shrink-0" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-1 text-[10px] leading-3 text-muted-foreground">
                {sideMark}
                <span className="truncate">{label}</span>
              </span>
              <div
                className={cn(
                  "mt-0.5 min-h-4 text-xs leading-4 font-extrabold",
                  !richSummary && "truncate",
                )}
              >
                {summary}
              </div>
            </div>
            <ChevronDown
              className={cn(
                "text-muted-foreground size-3.5 shrink-0 transition-transform",
                expanded && "rotate-180",
              )}
            />
          </button>
          {labelExtra}
          {trailing}
        </div>
      )}
      {stack && !expanded && (
        <div className="flex items-start gap-1.5 border-t px-2.5 py-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {summary}
          </div>
          {(labelExtra || trailing) && (
            <div className="flex shrink-0 items-center gap-1">
              {labelExtra}
              {trailing}
            </div>
          )}
        </div>
      )}
      {preview && <div className="border-t p-2">{preview}</div>}
      {expanded && <div className="border-t p-3">{children}</div>}
    </section>
  )
}

import { ChevronDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

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
}: TrackPanelProps) {
  const richSummary = typeof summary !== "string"
  const stack = summaryLayout === "stack" && richSummary

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
            <span className="truncate text-xs font-extrabold">{label}</span>
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
            className={cn(
              "hover:bg-token-bg/60 focus-visible:ring-ring flex min-w-0 items-center gap-2 text-left focus-visible:ring-2 focus-visible:outline-none",
              !richSummary && "flex-1",
            )}
          >
            <Icon className="text-muted-foreground size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className="text-muted-foreground block truncate text-[10px] leading-3">
                {label}
              </span>
              {!richSummary && (
                <span className="mt-0.5 block min-h-4 truncate text-xs leading-4 font-extrabold">
                  {summary}
                </span>
              )}
            </span>
            {!richSummary && (
              <ChevronDown
                className={cn(
                  "text-muted-foreground size-3.5 shrink-0 transition-transform",
                  expanded && "rotate-180",
                )}
              />
            )}
          </button>
          {labelExtra}
          {richSummary && (
            <>
              <div className="min-w-0 flex-1">{summary}</div>
              {trailing}
              <button
                type="button"
                tabIndex={-1}
                aria-hidden
                onClick={onToggle}
                className="hover:bg-token-bg/60 shrink-0 rounded-sm p-0.5"
              >
                <ChevronDown
                  className={cn(
                    "text-muted-foreground size-3.5 transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            </>
          )}
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

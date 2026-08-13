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
  preview,
  className,
}: TrackPanelProps) {
  const richSummary = typeof summary !== "string"

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[14px] border-2 border-ink bg-paper shadow-hud-panel transition-colors",
        className,
      )}
    >
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
        {richSummary && (
          <>
            <div className="min-w-0 flex-1">{summary}</div>
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
      {preview && <div className="border-t p-2">{preview}</div>}
      {expanded && <div className="border-t p-3">{children}</div>}
    </section>
  )
}

import type { ReactNode } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import type { StatSelectMode } from "@/lib/scenario"

function flipMode(mode: StatSelectMode): StatSelectMode {
  return mode === "range" ? "preset" : "range"
}

function RangeMark() {
  return (
    <span className="flex h-full min-w-0 flex-1 items-center gap-px" aria-hidden>
      <span className="size-[5px] shrink-0 rounded-full bg-current" />
      <span className="h-[2px] min-w-0 flex-1 rounded-full bg-current" />
      <span className="size-[5px] shrink-0 rounded-full bg-current" />
    </span>
  )
}

function ChoiceMark() {
  return (
    <span className="flex h-full min-w-0 flex-1 items-center" aria-hidden>
      <span className="size-[5px] shrink-0 rounded-[1px] bg-current" />
      <span className="h-px min-w-0 flex-1 bg-current" />
      <span className="size-[5px] shrink-0 rounded-[1px] bg-current" />
      <span className="h-px min-w-0 flex-1 bg-current" />
      <span className="size-[5px] shrink-0 rounded-[1px] bg-current" />
      <span className="h-px min-w-0 flex-1 bg-current" />
      <span className="size-[5px] shrink-0 rounded-[1px] bg-current" />
    </span>
  )
}

export function StatModeWell({
  mode,
  onMode,
  children,
}: {
  mode: StatSelectMode
  onMode: (mode: StatSelectMode) => void
  children: ReactNode
}) {
  const intl = useIntl()
  const range = mode === "range"
  const current = intl.formatMessage({ id: range ? "track.range" : "track.choice" })
  const next = intl.formatMessage({ id: range ? "track.choice" : "track.range" })
  return (
    <span className="relative flex w-full min-w-0 cursor-pointer flex-col rounded-[8px] bg-token-bg px-1.5 pt-1 pb-1 text-muted-foreground hover:bg-ink/5 hover:text-ink">
      <button
        type="button"
        aria-pressed={range}
        aria-label={`${current}. ${next}`}
        title={next}
        onClick={() => onMode(flipMode(mode))}
        className="absolute inset-0 z-0 rounded-[8px] focus-visible:outline-2 focus-visible:outline-ink"
      />
      <span className="relative z-10 min-w-0 pointer-events-none [&_button]:pointer-events-auto">
        {children}
      </span>
      <span className="pointer-events-none relative mt-0.5 flex h-3.5 w-full items-center gap-1">
        {range ? <RangeMark /> : <ChoiceMark />}
        <span className="shrink-0 text-[10px] font-extrabold leading-none">
          <FormattedMessage id={range ? "track.range" : "track.choice"} />
        </span>
      </span>
    </span>
  )
}

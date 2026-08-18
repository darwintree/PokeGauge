import { Lightbulb, X } from "lucide-react"
import { useState } from "react"
import { useIntl } from "react-intl"

import { cn } from "@/lib/utils"

import {
  isUsageTipMutedOn,
  muteUsageTipsForLocalDay,
  pickUsageTip,
} from "./usage-tips"

export function UsageTip({ attached }: { attached?: boolean }) {
  const intl = useIntl()
  const [muted, setMuted] = useState(isUsageTipMutedOn)
  const [tip] = useState(pickUsageTip)

  if (muted || !tip) return null

  function dismiss() {
    muteUsageTipsForLocalDay()
    setMuted(true)
  }

  return (
    <aside className={cn("flex items-start gap-3", attached && "border-t border-hairline pt-3")}>
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={2.5} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold tracking-tight text-ink">
          {intl.formatMessage({ id: tip.titleId })}
        </p>
        <p className="mt-0.5 text-[12px] leading-snug font-medium text-hud-muted">
          {intl.formatMessage({ id: tip.bodyId })}
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

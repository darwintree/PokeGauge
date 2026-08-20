import { useState } from "react"
import { useIntl } from "react-intl"

import { UsageTipCard } from "./usage-tip"
import { USAGE_TIPS } from "./usage-tips"

/** Debug page: preview every usage tip. Follows the current app locale. */
export function UsageTipsPrototype() {
  const intl = useIntl()
  const [mutedIds, setMutedIds] = useState<Set<string>>(new Set())

  function toggleMuted(id: string) {
    setMutedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <header>
        <h1 className="text-lg font-extrabold tracking-tight">Usage tips preview</h1>
      </header>

      <p className="text-xs font-medium text-hud-muted">
        {intl.formatMessage({ id: "usageTip.dismiss" })} — each card simulates a shown tip.
      </p>

      <div className="space-y-2">
        {USAGE_TIPS.map((tip) => (
          <section
            key={tip.id}
            className="rounded-xl border-2 border-ink bg-paper p-3 shadow-hud-panel"
          >
            <div className="mb-1 flex items-center justify-between">
              <code className="text-[11px] font-bold text-hud-muted">{tip.id}</code>
              <button
                type="button"
                className="rounded-md px-2 py-0.5 text-[11px] font-bold text-hud-muted hover:bg-token-bg"
                onClick={() => toggleMuted(tip.id)}
              >
                {mutedIds.has(tip.id) ? "unmuted" : "muted"}
              </button>
            </div>
            <div className="border border-dashed border-hairline p-3">
              <UsageTipCard
                tip={tip}
                onDismiss={() => toggleMuted(tip.id)}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

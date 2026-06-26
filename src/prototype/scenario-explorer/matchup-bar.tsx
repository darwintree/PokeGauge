/** PROTOTYPE — stub matchup selector for IA exploration (#5) */

import { MOCK_MATCHUP } from "./mock-data"

type MatchupBarProps = {
  compact?: boolean
}

export function MatchupBar({ compact = false }: MatchupBarProps) {
  return (
    <div
      className={`flex items-center gap-2 ${compact ? "text-sm" : ""}`}
      title="原型：对手切换尚未接线"
    >
      <button
        type="button"
        className="rounded-lg border bg-card px-3 py-1.5 font-medium transition-colors hover:bg-muted/50"
      >
        {MOCK_MATCHUP.attacker}
      </button>
      <span className="text-muted-foreground text-xs">→</span>
      <button
        type="button"
        className="rounded-lg border bg-card px-3 py-1.5 font-medium transition-colors hover:bg-muted/50"
      >
        {MOCK_MATCHUP.defender}
      </button>
      {!compact && (
        <span className="text-muted-foreground ml-1 text-xs">
          Champions · VGC 双打 · 点击可换对手（stub）
        </span>
      )}
    </div>
  )
}

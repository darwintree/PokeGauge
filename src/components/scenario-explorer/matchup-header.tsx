import type { MatchupIdentity } from "@/lib/catalog/types"

type MatchupHeaderProps = {
  matchup: MatchupIdentity
}

export function MatchupHeader({ matchup }: MatchupHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="text-muted-foreground text-xs font-medium">对战</div>
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{matchup.attackerLabel}</span>
        <span className="text-muted-foreground text-xs">→</span>
        <span>{matchup.defenderLabel}</span>
      </div>
      <p className="text-muted-foreground text-[10px]">
        Champions · VGC 双打 · Level 50
      </p>
    </div>
  )
}

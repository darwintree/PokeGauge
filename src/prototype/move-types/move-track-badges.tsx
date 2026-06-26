/** PROTOTYPE — move track with TypeBadge per option */

import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { MatchupCatalog } from "@/lib/catalog"
import type { ScenarioState } from "@/components/scenario-explorer/use-scenario-state"

import { TypeBadge } from "../type-colors/type-badge"
import { moveType } from "../type-colors/type-data"

export function MoveTrackWithBadges({
  catalog,
  state,
}: {
  catalog: MatchupCatalog
  state: ScenarioState
}) {
  const { trackState } = state
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">招式</Label>
      <ToggleGroup
        multiple
        variant="outline"
        size="sm"
        spacing={0}
        value={trackState.moveIds}
        onValueChange={(ids) => {
          const selected = new Set(ids)
          state.setMoveIds(
            catalog.moves.filter((m) => selected.has(m.id)).map((m) => m.id),
          )
        }}
        className="flex w-full flex-wrap rounded-lg border bg-muted/30 p-1"
      >
        {catalog.moves.map((move) => {
          const type = moveType(move.id)
          return (
            <ToggleGroupItem
              key={move.id}
              value={move.id}
              className="h-auto min-h-7 flex-1 basis-auto gap-1.5 px-2 py-1.5 text-left data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              {type && <TypeBadge type={type} size="xs" />}
              <span>{move.label}</span>
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </div>
  )
}

import { useMemo } from "react"
import { FormattedMessage } from "react-intl"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  defenseTemplatesForState,
  offenseTemplatesForState,
  rowLabels,
  type ScenarioRow,
  type TrackState,
} from "@/lib/scenario-pipeline"
import type { StatNameStrategy } from "@/lib/stat-value-template"

import { BoxPlotLegend, DamageAxis, DamageBoxPlot } from "./damage-box-plot"
import { ShowActualValuesSwitch } from "./stat-value-template-preset"

type ScenarioResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
  trackState: TrackState
  statNameStrategy: StatNameStrategy
  showMoveOnRow: boolean
  onShowResultActualChange: (checked: boolean) => void
  onProbabilityModeChange: (mode: TrackState["probabilityMode"]) => void
  compact?: boolean
}

function catalogOption<T extends { id: string | number }>(options: T[], id: string | number): T {
  const found = options.find((o) => o.id === id)
  if (!found) throw new Error(`Unknown catalog option: ${id}`)
  return found
}

export function ScenarioResults({
  catalog,
  rows,
  trackState,
  statNameStrategy,
  showMoveOnRow,
  onShowResultActualChange,
  onProbabilityModeChange,
  compact = false,
}: ScenarioResultsProps) {
  const rowLabelTemplates = useMemo(
    () => ({
      offense: offenseTemplatesForState(catalog, trackState),
      defense: defenseTemplatesForState(catalog, trackState),
    }),
    [catalog, trackState],
  )

  if (rows.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyDescription>
            <FormattedMessage id="app.empty" />
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          value={[trackState.probabilityMode]}
          onValueChange={(value) => {
            if (value[0] === "rolls" || value[0] === "actual") {
              onProbabilityModeChange(value[0])
            }
          }}
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="KO probability mode"
        >
          <ToggleGroupItem value="rolls">
            <FormattedMessage id="probability.mode.rolls" />
          </ToggleGroupItem>
          <ToggleGroupItem value="actual">
            <FormattedMessage id="probability.mode.actual" />
          </ToggleGroupItem>
        </ToggleGroup>
        <ShowActualValuesSwitch
          checked={trackState.showResultActual}
          onCheckedChange={onShowResultActualChange}
        />
      </div>
      <DamageAxis />
      <ul className={compact ? "space-y-8 pb-2" : "space-y-12 pb-2"}>
        {rows.map((row) => {
          const labels = rowLabels(catalog, row, trackState, statNameStrategy, rowLabelTemplates)
          const isRangeEnvelope =
            row.attackerStatId === RANGE_STAT_ID || row.defenderId === RANGE_DEFENDER_ID

          return (
            <li key={row.calculationIdentity}>
              <DamageBoxPlot
                move={catalogOption(catalog.moves, row.moveId)}
                attackerStat={{
                  id: row.attackerStatId,
                  label: labels.stat,
                  actual: labels.statActual,
                }}
                defender={{
                  id: row.defenderId,
                  label: labels.defender,
                  actual: labels.defenderActual,
                }}
                row={row}
                showMove={showMoveOnRow}
                isRangeEnvelope={isRangeEnvelope}
              />
            </li>
          )
        })}
      </ul>
      <BoxPlotLegend />
    </>
  )
}

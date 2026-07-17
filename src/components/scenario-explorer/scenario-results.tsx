import { useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"

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
  type UnavailableScenarioGroup,
} from "@/lib/scenario-pipeline"
import type { StatNameStrategy } from "@/lib/stat-value-template"

import { BoxPlotLegend, DamageAxis, DamageBoxPlot } from "./damage-box-plot"
import { ShowActualValuesSwitch } from "./stat-value-template-preset"

type ScenarioResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
  unavailable: UnavailableScenarioGroup[]
  trackState: TrackState
  statNameStrategy: StatNameStrategy
  showMoveOnRow: boolean
  onShowResultActualChange: (checked: boolean) => void
  onProbabilityModeChange: (mode: TrackState["probabilityMode"]) => void
  compact?: boolean
}

function UnavailableNotices({
  catalog,
  unavailable,
}: {
  catalog: MatchupCatalog
  unavailable: UnavailableScenarioGroup[]
}) {
  const intl = useIntl()

  if (unavailable.length === 0) return null

  return (
    <ul className="mb-3 space-y-2">
      {unavailable.map((group) => {
        const move = catalog.moves.find((candidate) => candidate.id === group.moveId)
        const fields = group.missingFields
          .map((field) => intl.formatMessage({ id: `damage.unavailable.field.${field}` }))
          .join(", ")
        return (
          <li
            key={group.snapshotId}
            className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs"
          >
            <span className="font-medium">{move?.label ?? group.moveId}</span>
            {": "}
            {group.reasons.map((reason) =>
              intl.formatMessage({ id: `damage.unavailable.reason.${reason}` }),
            ).join("; ")}
            {fields && (
              <span className="text-muted-foreground">
                {" · "}
                {intl.formatMessage(
                  { id: "damage.unavailable.missing" },
                  { fields },
                )}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function catalogOption<T extends { id: string | number }>(options: T[], id: string | number): T {
  const found = options.find((o) => o.id === id)
  if (!found) throw new Error(`Unknown catalog option: ${id}`)
  return found
}

export function ScenarioResults({
  catalog,
  rows,
  unavailable,
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
      <>
        <UnavailableNotices catalog={catalog} unavailable={unavailable} />
        {unavailable.length === 0 && (
          <Empty className="border">
            <EmptyHeader>
              <EmptyDescription>
                <FormattedMessage id="app.empty" />
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </>
    )
  }

  return (
    <>
      <UnavailableNotices catalog={catalog} unavailable={unavailable} />
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
                attackerAbilities={catalog.attackerAbilities}
                defenderAbilities={catalog.defenderAbilities}
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

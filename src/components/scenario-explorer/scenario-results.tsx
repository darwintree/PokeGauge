import { TriangleAlert } from "lucide-react"
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
import { cn } from "@/lib/utils"

import { BoxPlotLegend, DamageAxis, DamageBoxPlot } from "./damage-box-plot"
import { ShowActualValuesSwitch } from "./stat-value-template-preset"

type ScenarioResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioRow[]
  unavailable: UnavailableScenarioGroup[]
  trackState: TrackState
  statNameStrategy: StatNameStrategy
  onShowResultActualChange: (checked: boolean) => void
  onProbabilityModeChange: (mode: TrackState["probabilityMode"]) => void
}

function UnavailableNotices({
  catalog,
  unavailable,
}: {
  catalog: MatchupCatalog
  unavailable: UnavailableScenarioGroup[]
}) {
  const intl = useIntl()
  const notices = unavailable.flatMap((group) => {
    const reasons = group.reasons.filter((reason) => reason !== "unconfigured-move")
    return reasons.length > 0 ? [{ ...group, reasons }] : []
  })

  if (notices.length === 0) return null

  return (
    <ul className="mb-3 space-y-2">
      {notices.map((group) => {
        const move = catalog.moves.find((candidate) => candidate.id === group.moveId)
        return (
          <li
            key={group.snapshotId}
            className="flex items-center gap-2.5 rounded-[10px] border-2 border-ink bg-notice-bg py-2 pr-3 pl-4 text-[11px] font-bold shadow-[inset_8px_0_0_0_var(--signal-yellow)]"
          >
            <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-signal-yellow">
              <TriangleAlert className="size-3 text-ink" strokeWidth={2.5} />
            </span>
            <span>
              <span className="font-extrabold">{move?.label ?? group.moveId}</span>
              {": "}
              {group.reasons.map((reason) =>
                intl.formatMessage({ id: `damage.unavailable.reason.${reason}` }),
              ).join("; ")}
            </span>
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
  onShowResultActualChange,
  onProbabilityModeChange,
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
          <Empty className="rounded-2xl border-2 border-ink bg-paper shadow-hud-board">
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
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          value={[trackState.probabilityMode]}
          onValueChange={(value) => {
            if (value[0] === "rolls" || value[0] === "actual") {
              onProbabilityModeChange(value[0])
            }
          }}
          variant="default"
          size="sm"
          spacing={0}
          aria-label="KO probability mode"
          className="gap-0 rounded-[10px] border-2 border-ink bg-paper p-0.5 shadow-hud-chip"
        >
          <ToggleGroupItem
            value="rolls"
            className="rounded-[7px] px-2.5 text-[11px] font-extrabold text-ink hover:bg-token-bg aria-pressed:bg-signal-yellow aria-pressed:text-ink aria-pressed:shadow-none"
          >
            <FormattedMessage id="probability.mode.rolls" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="actual"
            className="rounded-[7px] px-2.5 text-[11px] font-extrabold text-ink hover:bg-token-bg aria-pressed:bg-signal-yellow aria-pressed:text-ink aria-pressed:shadow-none"
          >
            <FormattedMessage id="probability.mode.actual" />
          </ToggleGroupItem>
        </ToggleGroup>
        <ShowActualValuesSwitch
          checked={trackState.showResultActual}
          onCheckedChange={onShowResultActualChange}
        />
      </div>
      {/* The board is the only chunky container in the results area. */}
      <div className="rounded-[16px] border-2 border-ink bg-paper shadow-hud-board">
        <DamageAxis />
        <ul className="pb-2">
          {rows.map((row, index) => {
            const labels = rowLabels(catalog, row, trackState, statNameStrategy, rowLabelTemplates)
            const isRangeEnvelope =
              row.attackerStatId === RANGE_STAT_ID || row.defenderId === RANGE_DEFENDER_ID
            const startsMoveGroup = index === 0 || rows[index - 1].snapshotId !== row.snapshotId

            return (
              <li
                key={row.calculationIdentity}
                className={cn(
                  /* Rest rhythm: pt/pb give the hairline separators air on both
                     sides and contain the percent labels hanging below the plot. */
                  "rounded-[10px] px-3 pt-2.5 pb-3 sm:px-4",
                  /* Keep the row flat and separators visible; hover adds only a
                     quiet token wash so dense comparisons remain one board. */
                  "hover:bg-token-bg/55",
                  index > 0 &&
                    (startsMoveGroup
                      ? "mt-3 border-t-2 border-dashed border-ink/35 pt-3"
                      : "border-t border-hairline"),
                )}
              >
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
                  isRangeEnvelope={isRangeEnvelope}
                  showAccuracy={trackState.probabilityMode === "actual"}
                />
              </li>
            )
          })}
        </ul>
        <BoxPlotLegend
          showAverage={rows.some(
            (row) =>
              row.attackerStatId !== RANGE_STAT_ID &&
              row.defenderId !== RANGE_DEFENDER_ID,
          )}
        />
      </div>
    </>
  )
}

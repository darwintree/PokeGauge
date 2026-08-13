import { TriangleAlert } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
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
  defensePresetsForState,
  expandRangeParentBlocks,
  offensePresetsForState,
  type RangeAxisExpansion,
  type ScenarioResult,
  type TrackState,
  type UnavailableScenarioGroup,
} from "@/lib/scenario"
import type { StatNameStrategy } from "@/lib/stat-preset"
import { cn } from "@/lib/utils"

import {
  DamagePercentAxis,
  DamageRangeLegend,
  DamageResultRow,
} from "./damage-result-row"
import { ShowStatValuesSwitch } from "../tracks/common/show-stat-values-switch"
import { rowIdentity } from "./row-labels"

type DamageResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioResult[]
  unavailable: UnavailableScenarioGroup[]
  trackState: TrackState
  statNameStrategy: StatNameStrategy
  onShowResultStatValueChange: (checked: boolean) => void
  onProbabilityModeChange: (mode: TrackState["probabilityMode"]) => void
}

function UnavailableScenarioNotices({
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

export function DamageResults({
  catalog,
  rows,
  unavailable,
  trackState,
  statNameStrategy,
  onShowResultStatValueChange,
  onProbabilityModeChange,
}: DamageResultsProps) {
  const rowLabelPresets = useMemo(
    () => ({
      offense: offensePresetsForState(catalog, trackState),
      defense: defensePresetsForState(catalog, trackState),
    }),
    [catalog, trackState],
  )
  const [expanded, setExpanded] = useState<Record<string, RangeAxisExpansion>>({})

  useEffect(() => {
    setExpanded({})
  }, [trackState.statMode, trackState.defenderMode])

  const blocks = useMemo(
    () => expandRangeParentBlocks(catalog, trackState, rows, expanded),
    [catalog, trackState, rows, expanded],
  )

  function toggleAxis(parentId: string, axis: keyof RangeAxisExpansion) {
    setExpanded((current) => {
      const nextAxis = {
        offense: current[parentId]?.offense ?? false,
        defense: current[parentId]?.defense ?? false,
        [axis]: !(current[parentId]?.[axis] ?? false),
      }
      if (!nextAxis.offense && !nextAxis.defense) {
        const rest = { ...current }
        delete rest[parentId]
        return rest
      }
      return { ...current, [parentId]: nextAxis }
    })
  }

  if (rows.length === 0) {
    return (
      <>
        <UnavailableScenarioNotices catalog={catalog} unavailable={unavailable} />
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
      <UnavailableScenarioNotices catalog={catalog} unavailable={unavailable} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          value={[trackState.probabilityMode]}
          onValueChange={(value) => {
            if (value[0] === "classic" || value[0] === "battle-odds") {
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
            value="classic"
            className="rounded-[7px] px-2.5 text-[11px] font-extrabold text-ink hover:bg-token-bg aria-pressed:bg-signal-yellow aria-pressed:text-ink aria-pressed:shadow-none"
          >
            <FormattedMessage id="probability.mode.classic" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="battle-odds"
            className="rounded-[7px] px-2.5 text-[11px] font-extrabold text-ink hover:bg-token-bg aria-pressed:bg-signal-yellow aria-pressed:text-ink aria-pressed:shadow-none"
          >
            <FormattedMessage id="probability.mode.battleOdds" />
          </ToggleGroupItem>
        </ToggleGroup>
        <ShowStatValuesSwitch
          checked={trackState.showResultStatValue}
          onCheckedChange={onShowResultStatValueChange}
        />
      </div>
      {/* The board is the only chunky container in the results area. */}
      <div className="rounded-[16px] border-2 border-ink bg-paper shadow-hud-board">
        <DamagePercentAxis />
        <ul className="pb-2">
          {blocks.flatMap((block) => {
            const expansion = expanded[block.parent.calculationIdentity] ?? {
              offense: false,
              defense: false,
            }
            return [
              { row: block.parent, role: "parent" as const, expansion },
              ...block.children.map((row) => ({ row, role: "child" as const, expansion })),
            ]
          }).map((item, index, displayRows) => {
            const { row, role, expansion } = item
            const identity = rowIdentity(catalog, row, trackState, statNameStrategy, rowLabelPresets)
            const offenseExpandable = role === "parent" && row.attackerStatId === RANGE_STAT_ID
            const defenseExpandable = role === "parent" && row.defenderId === RANGE_DEFENDER_ID
            const isRangeEnvelope =
              row.attackerStatId === RANGE_STAT_ID || row.defenderId === RANGE_DEFENDER_ID
            const startsMoveGroup =
              index === 0 || displayRows[index - 1].row.snapshotId !== row.snapshotId

            return (
              <li
                key={`${role}:${row.calculationIdentity}`}
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
                <DamageResultRow
                  move={catalogOption(catalog.moves, row.moveId)}
                  attackerAbilities={catalog.attackerAbilities}
                  defenderAbilities={catalog.defenderAbilities}
                  attackerStat={{
                    id: row.attackerStatId,
                    chips: identity.offenseChips,
                    showActual: trackState.showResultStatValue,
                    expandable: offenseExpandable,
                    expanded: offenseExpandable && expansion.offense,
                    onToggle: offenseExpandable
                      ? () => toggleAxis(row.calculationIdentity, "offense")
                      : undefined,
                  }}
                  defender={{
                    id: row.defenderId,
                    chips: identity.defenseChips,
                    showActual: trackState.showResultStatValue,
                    expandable: defenseExpandable,
                    expanded: defenseExpandable && expansion.defense,
                    onToggle: defenseExpandable
                      ? () => toggleAxis(row.calculationIdentity, "defense")
                      : undefined,
                  }}
                  row={row}
                  isRangeEnvelope={isRangeEnvelope}
                  showAccuracy={trackState.probabilityMode === "battle-odds"}
                  diff={role === "child" ? expansion : undefined}
                />
              </li>
            )
          })}
        </ul>
        <DamageRangeLegend
          showAverage={blocks.some(
            (block) =>
              [block.parent, ...block.children].some(
                (row) =>
                  row.attackerStatId !== RANGE_STAT_ID &&
                  row.defenderId !== RANGE_DEFENDER_ID,
              ),
          )}
        />
      </div>
    </>
  )
}

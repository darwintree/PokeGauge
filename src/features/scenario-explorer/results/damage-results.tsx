import { TriangleAlert } from "lucide-react"
import { Fragment, useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty"
import type { CatalogMoveOption, MatchupCatalog } from "@/lib/catalog"
import type { ProbabilityMode } from "@/lib/damage-calculation"
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
import { TypeBadge } from "@/components/pokemon/type-badge"
import { rowIdentity } from "./row-labels"

type DamageResultsProps = {
  catalog: MatchupCatalog
  rows: ScenarioResult[]
  unavailable: UnavailableScenarioGroup[]
  trackState: TrackState
  statNameStrategy: StatNameStrategy
  probabilityMode: ProbabilityMode
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

function MoveGroupHeader({ move }: { move: CatalogMoveOption }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-2 pt-3 pb-1 md:hidden">
      <span className="flex min-w-0 items-center gap-1.5">
        <TypeBadge type={move.type} />
        <span className="truncate text-[14px] font-extrabold leading-none">
          {move.label}
        </span>
      </span>
    </div>
  )
}

export function DamageResults({
  catalog,
  rows,
  unavailable,
  trackState,
  statNameStrategy,
  probabilityMode,
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
    () => expandRangeParentBlocks(catalog, trackState, rows, expanded, probabilityMode),
    [catalog, expanded, probabilityMode, rows, trackState],
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

  const board = (
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
          const move = catalogOption(catalog.moves, row.moveId)
          const offenseExpandable = role === "parent" && row.attackerStatId === RANGE_STAT_ID
          const defenseExpandable = role === "parent" && row.defenderId === RANGE_DEFENDER_ID
          const startsMoveGroup =
            index === 0 || displayRows[index - 1].row.snapshotId !== row.snapshotId
          const rowProps = {
            move,
            attackerAbilities: catalog.attackerAbilities,
            defenderAbilities: catalog.defenderAbilities,
            attackerStat: {
              id: row.attackerStatId,
              chips: identity.offenseChips,
              expandable: offenseExpandable,
              expanded: offenseExpandable && expansion.offense,
              onToggle: offenseExpandable
                ? () => toggleAxis(row.calculationIdentity, "offense")
                : undefined,
            },
            defender: {
              id: row.defenderId,
              chips: identity.defenseChips,
              expandable: defenseExpandable,
              expanded: defenseExpandable && expansion.defense,
              onToggle: defenseExpandable
                ? () => toggleAxis(row.calculationIdentity, "defense")
                : undefined,
            },
            row,
            showAccuracy: probabilityMode === "battle-odds",
            diff: role === "child" ? expansion : undefined,
          }

          return (
            <Fragment key={`${role}:${row.calculationIdentity}`}>
              {startsMoveGroup && (
                <li className="md:hidden" data-move-group={move.id}>
                  <MoveGroupHeader move={move} />
                </li>
              )}
              <li
                data-result-row={row.calculationIdentity}
                className={cn(
                  "px-2 py-0.5 hover:bg-token-bg/55 md:rounded-[10px] md:px-3 md:pt-2.5 md:pb-3 lg:px-4",
                  index > 0 &&
                    (startsMoveGroup
                      ? "md:mt-3 md:border-t-2 md:border-ink/35 md:pt-3"
                      : "md:border-t md:border-hairline"),
                )}
              >
                <DamageResultRow {...rowProps} showMoveInCaption={false} />
              </li>
            </Fragment>
          )
        })}
      </ul>
      <DamageRangeLegend />
    </div>
  )

  return (
    <>
      <UnavailableScenarioNotices catalog={catalog} unavailable={unavailable} />
      {board}
    </>
  )
}

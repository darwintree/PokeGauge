import { TypeBadge } from "@/components/pokemon/type-badge"
import { HeldItemSpriteIcon } from "../tracks/held-item/held-item-sprite-icon"
import { FieldConditionIcon } from "../tracks/common/field-condition-icon"
import { TriangleAlert, Fence, Sparkles, TrendingUp } from "lucide-react"
import { Fragment, useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { CatalogMoveOption, MatchupCatalog } from "@/lib/catalog"
import type { ProbabilityMode, Weather, Terrain } from "@/lib/damage-calculation"
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
import { groupResults, type ResultGrouping, type ResultGroup } from "./result-groups"
import { rowIdentity } from "./row-labels"

type DamageResultsProps = {
  grouping?: ResultGrouping | null
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
      <span className="truncate text-[14px] font-extrabold leading-none">
        {move.label}
      </span>
    </div>
  )
}

export function DamageResults({
  grouping = null,
  catalog,
  rows,
  unavailable,
  trackState,
  statNameStrategy,
  probabilityMode,
}: DamageResultsProps) {
  const intl = useIntl()
  const [selection, setSelection] = useState<{ grouping: ResultGrouping; id: string } | null>(null)
  const groups = useMemo(() => grouping ? groupResults(rows, grouping) : [], [rows, grouping])
  const selectedGroup = groups.find(
    group => selection?.grouping === grouping && group.id === selection.id,
  ) ?? groups[0]
  const visibleRows = grouping && selectedGroup ? selectedGroup.rows : rows
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
    () => expandRangeParentBlocks(catalog, trackState, visibleRows, expanded, probabilityMode),
    [catalog, expanded, probabilityMode, visibleRows, trackState],
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

  function groupIdentity(group: ResultGroup) {
    const row = group.rows[0]
    if (grouping === "item" || grouping === "defender-held-item") {
      const items = grouping === "item" ? catalog.attackerItems : catalog.defenderItems
      const label = items.find(item => String(item.id) === group.id)?.label ?? group.id
      return <span className="inline-flex items-center gap-2 text-ink"><HeldItemSpriteIcon id={group.id} /><span>{label}</span></span>
    }
    if (grouping === "attacker-ability" || grouping === "defender-ability") {
      const abilities = grouping === "attacker-ability" ? catalog.attackerAbilities : catalog.defenderAbilities
      const label = abilities.find(ability => String(ability.id) === group.id)?.label ?? intl.formatMessage({ id: "track.ability.unknown" })
      return <span className="inline-flex items-center gap-2 text-ink"><Sparkles aria-hidden className="size-4 text-hud-muted" />{label}</span>
    }
    if (grouping === "attacker-stage" || grouping === "defender-stage") {
      const stage = Number(group.id)
      return <span className="inline-flex items-center gap-2 text-ink"><TrendingUp aria-hidden className="size-4 text-hud-muted" /><span className="text-base font-extrabold tabular-nums">{stage > 0 ? `+${stage}` : stage}</span></span>
    }
    if (grouping === "weather" || grouping === "terrain") {
      return <span className="inline-flex items-center gap-2 text-ink"><FieldConditionIcon condition={group.id as Weather | Terrain} />{intl.formatMessage({ id: `track.${grouping}.${group.id}` })}</span>
    }
    if (grouping === "screen") {
      return <span className="inline-flex items-center gap-2 text-ink"><Fence aria-hidden className="size-5 text-hud-muted" />{intl.formatMessage({ id: `track.screen.${group.id}` })}</span>
    }
    const identity = rowIdentity(catalog, row, trackState, statNameStrategy, rowLabelPresets)
    if (grouping === "move") {
      const move = catalogOption(catalog.moves, row.moveId)
      const sameMove = groups.filter(candidate => candidate.rows[0].moveId === row.moveId)
      const label = sameMove.length > 1 ? `${identity.move} · ${sameMove.findIndex(candidate => candidate.id === group.id) + 1}` : identity.move
      return <span className="inline-flex items-center gap-2 text-ink"><TypeBadge type={move.type} /><span>{label}</span></span>
    }
    const chips = grouping === "offense" ? identity.offenseChips : identity.defenseChips
    return (
      <span className="inline-flex items-center gap-1.5">
        {chips.map((chip, index) => (
          <Fragment key={`${chip.actual}:${index}`}>
            {index > 0 && <span className="text-hud-muted">~</span>}
            <span className="inline-flex flex-col items-center gap-0.5">
              <span className={cn("stat-value-chip pointer-events-none", `stat-value-chip--${chip.band}`, chip.temporary && "stat-value-chip--temporary")}>{chip.label}</span>
              <span className="text-[10px] font-medium text-hud-muted tabular-nums">{chip.actual}</span>
            </span>
          </Fragment>
        ))}
      </span>
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
                <DamageResultRow {...rowProps} />
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
      {grouping && selectedGroup ? (
        <Tabs
          value={selectedGroup.id}
          onValueChange={(id) => setSelection({ grouping, id: String(id) })}
          className="isolate min-w-0 gap-0"
        >
          <div className="relative z-20 min-w-0 overflow-x-auto overflow-y-hidden px-3 pt-1">
            <TabsList variant="folder" aria-label={intl.formatMessage({ id: "results.grouping.groups" })}>
              {groups.map(group => (
                <TabsTrigger key={group.id} value={group.id}>
                  {groupIdentity(group)}
                  <span title={intl.formatMessage({ id: "summary.rows" }, { count: group.rows.length })} className="ml-1 border-l border-card-border pl-2 text-[11px] font-medium text-hud-muted tabular-nums">{group.rows.length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {groups.map(group => (
            <TabsContent key={group.id} value={group.id} className="-mt-0.5">
              {group.id === selectedGroup.id && board}
            </TabsContent>
          ))}
        </Tabs>
      ) : board}
    </>
  )
}

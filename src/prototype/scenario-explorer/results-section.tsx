/** PROTOTYPE — damage box plot result list */

import { BoxPlotLegend, DamageAxis, DamageBoxPlot } from "./damage-box-plot"
import {
  ATTACKER_ITEM_CONFIGS,
  ATTACKER_STAT_CONFIGS,
  configById,
  DEFENDER_CONFIGS,
  MOVES,
  RANGE_STAT_CONFIG,
  resultKey,
} from "./mock-data"
import type { ScenarioState } from "./use-scenario-state"

type ResultsSectionProps = {
  state: ScenarioState
  showLegend?: boolean
  compact?: boolean
}

export function ResultsSection({
  state,
  showLegend = true,
  compact = false,
}: ResultsSectionProps) {
  const { results, showMoveOnRow } = state

  if (results.length === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
        请至少各选一维配置以展示伤害对比
      </p>
    )
  }

  return (
    <>
      <DamageAxis />
      <div className={compact ? "space-y-8 pb-2" : "space-y-12 pb-2"}>
        {results.map((result) => {
          const attackerStat =
            result.attackerStatId === RANGE_STAT_CONFIG.id
              ? {
                  ...RANGE_STAT_CONFIG,
                  label: `物攻 ${result.statRange!.min}–${result.statRange!.max}`,
                  summary: `区间 × roll 合并`,
                }
              : configById(ATTACKER_STAT_CONFIGS, result.attackerStatId)!
          return (
            <DamageBoxPlot
              key={resultKey(result)}
              move={configById(MOVES, result.moveId)!}
              attackerStat={attackerStat}
              attackerItem={configById(ATTACKER_ITEM_CONFIGS, result.attackerItemId)!}
              defender={configById(DEFENDER_CONFIGS, result.defenderId)!}
              result={result}
              showMove={showMoveOnRow}
              isRangeEnvelope={result.attackerStatId === RANGE_STAT_CONFIG.id}
            />
          )
        })}
      </div>
      {showLegend && <BoxPlotLegend />}
    </>
  )
}

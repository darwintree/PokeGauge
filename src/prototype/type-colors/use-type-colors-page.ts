/** PROTOTYPE — shared page state for type-color variants */

import { useMemo, useState } from "react"

import {
  getCatalog,
  getDefaultMatchupIds,
  listAttackers,
  listDefenders,
} from "@/lib/catalog"

import { useScenarioState } from "@/components/scenario-explorer/use-scenario-state"

export function useTypeColorsPage() {
  const attackers = listAttackers()
  const defenders = listDefenders()
  const defaults = getDefaultMatchupIds()

  const [attackerId, setAttackerId] = useState<string>(defaults.attackerId)
  const [defenderId, setDefenderId] = useState<string>(defaults.defenderId)

  const catalog = useMemo(
    () => getCatalog(attackerId, defenderId),
    [attackerId, defenderId],
  )
  const state = useScenarioState(catalog)

  return {
    attackers,
    defenders,
    attackerId,
    defenderId,
    setAttackerId,
    setDefenderId,
    catalog,
    state,
  }
}

export type TypeColorsPageProps = ReturnType<typeof useTypeColorsPage>

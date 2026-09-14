import { createContext, useContext } from "react"

import { DEFAULT_CALCULATION_RULES, type CalculationRules } from "./calculation-rules"

export const CalculationRulesContext = createContext<CalculationRules>(DEFAULT_CALCULATION_RULES)

export function useCalculationRules(): CalculationRules {
  return useContext(CalculationRulesContext)
}

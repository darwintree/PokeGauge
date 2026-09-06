import { Info } from "lucide-react"
import { useIntl } from "react-intl"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { MoveMechanics } from "@/lib/damage-calculation"
import { formatPower } from "./format-power"

export function MoveExecutionDetails({ mechanics, touch = false }: { mechanics: MoveMechanics; touch?: boolean }) {
  const intl = useIntl()
  if (!mechanics.hits) return null
  const accuracy = mechanics.hitFact === "always-hits"
    ? intl.formatMessage({ id: "damage.conditions.alwaysHits" })
    : intl.formatNumber(mechanics.hitFact / 100, { style: "percent", maximumFractionDigits: 0 })
  const trigger = <Button variant="ghost" size="icon-xs" aria-label={intl.formatMessage({ id: "damage.hit.details" })} />
  const icon = <Info className="text-muted-foreground" />
  const contentClassName = "max-h-[min(32rem,80dvh)] w-80 max-w-[calc(100vw-2rem)] flex-col items-stretch gap-3 overflow-y-auto rounded-xl border border-hud-frame bg-paper p-3 shadow-hud-panel ring-0"
  const content = (
    <>
        <p className="font-medium">{intl.formatMessage({ id: "damage.hit.details" })}</p>
        <div className="flex flex-col gap-1 text-xs">
          <p>{intl.formatMessage({ id: "damage.hit.count" }, { count: formatPower(mechanics.hitCounts) })}</p>
          <p>{intl.formatMessage({ id: mechanics.accuracyScope === "hit" ? "damage.hit.accuracyPerHit" : "damage.hit.accuracyPerMove" })}{": "}{accuracy}</p>
          <p className="text-muted-foreground">{intl.formatMessage({ id: mechanics.accuracyScope === "hit" ? "damage.hit.stopOnMiss" : "damage.hit.sharedAccuracy" })}</p>
        </div>
        {mechanics.hitProbability === 1 && typeof mechanics.hitFact === "number" && mechanics.hitFact < 100 && (
          <p className="text-xs text-muted-foreground">{intl.formatMessage({ id: "damage.hit.assumedAccuracy" })}</p>
        )}
        <dl className="flex flex-col gap-1 text-xs">
          {mechanics.normal && <div className="flex justify-between gap-3">
            <dt>{intl.formatMessage({ id: "damage.conditions.effectivePower" })}</dt>
            <dd className="font-bold tabular-nums">{formatPower(mechanics.normal.effectivePower)}</dd>
          </div>}
          {mechanics.critical && <div className="flex justify-between gap-3">
            <dt>{intl.formatMessage({ id: "damage.hit.atLeastOneCritical" })}</dt>
            <dd className="font-bold tabular-nums">{formatPower(mechanics.critical.effectivePower)}</dd>
          </div>}
        </dl>
        <table className="w-full text-right text-xs tabular-nums">
          <caption className="pb-2 text-left text-[10px] text-muted-foreground">{intl.formatMessage({ id: "damage.hit.powerDetails" })}</caption>
          <thead className="text-[10px] text-muted-foreground">
            <tr>
              <th scope="col" className="text-left">{intl.formatMessage({ id: "damage.hit.label" })}</th>
              <th scope="col">{intl.formatMessage({ id: "damage.conditions.basePower" })}</th>
              {mechanics.normal && <th scope="col">{intl.formatMessage({ id: "damage.normal" })}</th>}
              {mechanics.critical && <th scope="col">{intl.formatMessage({ id: "damage.critical" })}</th>}
            </tr>
          </thead>
          <tbody>
            {mechanics.hits.map((hit, index) => (
              <tr key={index}>
                <th scope="row" className="py-1 text-left font-normal">{index + 1}</th>
                <td>{hit.basePower}</td>
                {mechanics.normal && <td>{hit.normal}</td>}
                {mechanics.critical && <td>{hit.critical}</td>}
              </tr>
            ))}
          </tbody>
        </table>
    </>
  )
  return touch ? (
    <Popover>
      <PopoverTrigger render={trigger}>{icon}</PopoverTrigger>
      <PopoverContent align="end" aria-label={intl.formatMessage({ id: "damage.hit.details" })} className={contentClassName}>{content}</PopoverContent>
    </Popover>
  ) : (
    <Tooltip>
      <TooltipTrigger render={trigger}>{icon}</TooltipTrigger>
      <TooltipContent side="right" align="start" className={contentClassName}>{content}</TooltipContent>
    </Tooltip>
  )
}

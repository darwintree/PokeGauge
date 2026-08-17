import { ChevronDown } from "lucide-react"
import { useIntl } from "react-intl"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { NatureAdj, StatValueChipModel } from "@/lib/stat-preset"
import { cn } from "@/lib/utils"

function natureMessageId(nature: NatureAdj): string {
  if (nature === "plus") return "statValue.chip.nature.plus"
  if (nature === "minus") return "statValue.chip.nature.minus"
  return "statValue.chip.nature.none"
}

export function StatValueChipTooltipBody({ chip }: { chip: StatValueChipModel }) {
  const intl = useIntl()
  const sp = chip.sp ?? intl.formatMessage({ id: "statValue.chip.spUnknown" })
  return (
    <div className="grid min-w-[8.5rem] grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-left">
      <span className="text-muted-foreground">{intl.formatMessage({ id: "statValue.chip.actual" })}</span>
      <span className="text-right font-extrabold tabular-nums">{chip.actual}</span>
      <span className="text-muted-foreground">{intl.formatMessage({ id: "statValue.chip.sp" })}</span>
      <span className="text-right font-extrabold tabular-nums">{sp}</span>
      <span className="text-muted-foreground">{intl.formatMessage({ id: "statValue.chip.nature" })}</span>
      <span className="text-right font-extrabold">{intl.formatMessage({ id: natureMessageId(chip.nature) })}</span>
    </div>
  )
}

export function StatValueChip({
  chip,
  showActual = false,
  compact = false,
}: {
  chip: StatValueChipModel
  showActual?: boolean
  compact?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={chip.label}
            className={cn(
              "stat-value-chip",
              `stat-value-chip--${chip.band}`,
              compact && "stat-value-chip--compact",
              chip.temporary && "stat-value-chip--temporary",
            )}
          />
        }
      >
        {chip.label}
        {showActual ? <span className="stat-value-chip-actual">{chip.actual}</span> : null}
      </TooltipTrigger>
      <TooltipContent side="top" className="rounded-xl border-2 border-ink bg-paper p-2 shadow-hud-panel">
        <StatValueChipTooltipBody chip={chip} />
      </TooltipContent>
    </Tooltip>
  )
}

export function StatValueChipPair({
  chips,
  showActual = false,
  compact = false,
  expandable = false,
  expanded = false,
  onToggle,
  toggleLabel,
}: {
  chips: StatValueChipModel[]
  showActual?: boolean
  compact?: boolean
  expandable?: boolean
  expanded?: boolean
  onToggle?: () => void
  toggleLabel?: string
}) {
  const items = (
    <span className={cn("inline-flex min-w-0 flex-nowrap items-center", compact ? "gap-0.5" : "gap-1")}>
      {chips.map((chip, index) => (
        <span key={`${chip.label}:${chip.actual}:${index}`} className={cn("inline-flex items-center", compact ? "gap-0.5" : "gap-1")}>
          {index > 0 ? <span className="text-muted-foreground font-bold">~</span> : null}
          <StatValueChip chip={chip} showActual={showActual} compact={compact} />
        </span>
      ))}
    </span>
  )

  if (!expandable || !onToggle) return items

  return (
    <span
      className={cn(
        "-mx-0.5 inline-flex min-w-0 flex-nowrap items-center rounded-[8px] px-0.5 py-0.5",
        compact ? "gap-0" : "gap-0.5",
        expanded && "bg-token-bg",
      )}
    >
      {items}
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={toggleLabel}
        onClick={onToggle}
        className={cn(
          "hover:bg-token-bg focus-visible:ring-ring grid shrink-0 place-items-center rounded-[6px] focus-visible:ring-2 focus-visible:outline-none",
          compact ? "size-[1.125rem]" : "size-6",
        )}
      >
        <ChevronDown
          className={cn(
            "text-muted-foreground transition-transform",
            compact ? "size-3" : "size-3.5",
            expanded && "rotate-180 text-ink",
          )}
          strokeWidth={2}
        />
      </button>
    </span>
  )
}

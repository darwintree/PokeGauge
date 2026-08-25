import { Check, RefreshCw, Save, Trash2 } from "lucide-react"
import type { ReactNode } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  statTierModifierClass,
  type StatTierTokenSet,
} from "../stats/stat-tier-colors"
import type { InvestBand } from "@/lib/stat-preset"
import { cn } from "@/lib/utils"

type TrackOptionLayout = "text" | "icon"

export type TrackOptionModifier =
  | { kind: "tier"; tier: StatTierTokenSet }
  | { kind: "invest"; band: InvestBand }
  | { kind: "temporary" }
  | { kind: "user" }
  | { kind: "stab-boost" }
  | { kind: "added-boost" }
  | { kind: "core" }

export type TrackOptionActionKind = "remove" | "persist" | "cycleAllocation"

export type TrackOptionAction = {
  kind: TrackOptionActionKind
  label: string
  position: "top-right" | "bottom-right"
  onClick: () => void
  /** persist / cycleAllocation stay visible; remove stays hover-only */
  alwaysVisible?: boolean
}

type TrackOptionProps = {
  layout: TrackOptionLayout
  pressed: boolean
  onToggle: () => void
  ariaLabel: string
  children?: ReactNode
  modifier?: TrackOptionModifier
  actions?: TrackOptionAction[]
  className?: string
  tooltip?: ReactNode
  description?: ReactNode
  descriptionLabel?: ReactNode
  showDescription?: boolean
  disabled?: boolean
}

type TrackOptionGroupProps = {
  "aria-label"?: string
  className?: string
  children: ReactNode
}

type TrackOptionAddProps = {
  layout?: TrackOptionLayout
  ariaLabel: string
  onClick: () => void
  pressed?: boolean
  className?: string
}

const CORNER_POSITION: Record<TrackOptionAction["position"], string> = {
  "top-right": "track-option-action--top-right",
  "bottom-right": "track-option-action--bottom-right",
}

const INVEST_MODIFIER_CLASS: Record<InvestBand, string> = {
  none: "track-option-mod-invest-none",
  some: "track-option-mod-invest-some",
  heavy: "track-option-mod-invest-heavy",
  ex: "track-option-mod-invest-ex",
}

function modifierClass(modifier: TrackOptionModifier | undefined): string | undefined {
  if (!modifier) return undefined
  switch (modifier.kind) {
    case "tier":
      return statTierModifierClass(modifier.tier)
    case "invest":
      return INVEST_MODIFIER_CLASS[modifier.band]
    case "temporary":
      return "track-option-mod-temporary"
    case "user":
      return undefined
    case "stab-boost":
      return "track-option-mod-stab-boost"
    case "added-boost":
      return "track-option-mod-added-boost"
    case "core":
      return "track-option-mod-core"
  }
}

function ActionIcon({ kind }: { kind: TrackOptionActionKind }) {
  if (kind === "remove") return <Trash2 className="size-2" />
  if (kind === "persist") return <Save className="size-2" />
  return <RefreshCw className="size-2" />
}

function TrackOptionActionButton({ action }: { action: TrackOptionAction }) {
  return (
    <button
      type="button"
      aria-label={action.label}
      className={cn(
        "track-option-action",
        CORNER_POSITION[action.position],
        action.kind === "remove" && "track-option-action--remove",
        action.alwaysVisible && "track-option-action--visible",
      )}
      onClick={(event) => {
        event.stopPropagation()
        action.onClick()
      }}
    >
      <ActionIcon kind={action.kind} />
    </button>
  )
}

export function TrackOptionGroup({
  "aria-label": ariaLabel,
  className,
  children,
}: TrackOptionGroupProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("track-option-group", className)}
    >
      {children}
    </div>
  )
}

export function TrackOption({
  layout,
  pressed,
  onToggle,
  ariaLabel,
  children,
  modifier,
  actions = [],
  className,
  tooltip,
  description,
  descriptionLabel,
  showDescription = false,
  disabled = false,
}: TrackOptionProps) {
  const buttonClassName = cn(
    "track-option",
    layout === "text" ? "track-option--text" : "track-option--icon",
    showDescription && "track-option--described",
    modifierClass(modifier),
    className,
  )

  const content = showDescription ? (
    <>
      {layout === "icon" && <span className="track-option-description-icon">{children}</span>}
      <span className="track-option-description-copy">
        <span className="track-option-description-label">
          {descriptionLabel ?? children}
        </span>
        <span className="track-option-description-text">{description}</span>
      </span>
      <Check aria-hidden className="track-option-description-check" />
    </>
  ) : children

  const button = tooltip && !showDescription ? (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={ariaLabel}
            aria-pressed={pressed}
            disabled={disabled}
            onClick={onToggle}
            className={buttonClassName}
          />
        }
      >
        {content}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs rounded-xl border-2 border-ink bg-paper p-2 text-xs shadow-hud-panel">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  ) : (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onToggle}
      className={buttonClassName}
    >
      {content}
    </button>
  )

  if (actions.length === 0) return button

  return (
    <div className="track-option-wrap">
      {button}
      {actions.map((action) => (
        <TrackOptionActionButton key={`${action.kind}-${action.position}`} action={action} />
      ))}
    </div>
  )
}

export function TrackOptionSummary({ children }: { children: ReactNode }) {
  return <span className="track-option-summary">{children}</span>
}

export function TrackOptionAdd({
  layout = "icon",
  ariaLabel,
  onClick,
  pressed = false,
  className,
}: TrackOptionAddProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "track-option track-option--add",
        layout === "text" ? "track-option--add-text" : "track-option--icon",
        pressed && "track-option--add-open",
        className,
      )}
    >
      <span
        className={cn(
          "track-option-add-mark text-muted-foreground leading-none",
          layout === "text" ? "text-sm" : "text-base",
        )}
      >
        +
      </span>
    </button>
  )
}

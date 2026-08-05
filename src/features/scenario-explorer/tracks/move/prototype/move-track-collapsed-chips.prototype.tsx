/**
 * PROTOTYPE — Move Track collapsed chip styling (throwaway).
 *
 * Question: Which collapsed move chip style fits the HUD without overusing signal-yellow?
 * Run: pnpm dev → http://localhost:5173/?prototype=move-track-collapsed-chips
 * Switch variants with ?variant= or the bottom bar (← → keys work too).
 */

import { Check, ChevronDown, Swords } from "lucide-react"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { TypeBadge } from "@/components/pokemon/type-badge"
import {
  PrototypeSwitcher,
  readPrototypeVariant,
  setPrototypeVariant,
  type PrototypeVariant,
} from "@/components/prototype-switcher"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AbilityTrack } from "@/features/scenario-explorer/tracks/common/ability-track"
import { TrackOption, TrackOptionGroup } from "@/features/scenario-explorer/tracks/common/track-option"
import type { PokemonType } from "@/lib/pokemon"
import { cn } from "@/lib/utils"

const VARIANTS: PrototypeVariant[] = [
  { key: "current", name: "Current — full signal-yellow" },
  { key: "flat", name: "Flat — paper + card-border" },
  { key: "tint", name: "Subtle yellow tint" },
  { key: "check", name: "Paper + check mark" },
  { key: "track-option", name: "TrackOption (unpressed)" },
  { key: "hover-signal", name: "Flat default, yellow on hover" },
]

type MockMove = {
  id: string
  label: string
  type: PokemonType
}

const MOCK_MOVES: MockMove[] = [
  { id: "thunderbolt", label: "Thunderbolt", type: "electric" },
  { id: "ice-beam", label: "Ice Beam", type: "ice" },
  { id: "close-combat", label: "Close Combat", type: "fighting" },
]

const MOCK_ABILITIES = [
  { id: 1, label: "Adaptability", summary: "STAB boost" },
  { id: 2, label: "Intimidate", summary: "Lowers Attack" },
]

function MoveCategoryChip({ category }: { category: "physical" | "special" }) {
  const intl = useIntl()

  return (
    <ToggleGroup
      value={[category]}
      onValueChange={() => {}}
      aria-label={intl.formatMessage({ id: "track.moveSide" })}
      className="pointer-events-none gap-1"
    >
      {(["physical", "special"] as const).map((value) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className="h-auto min-w-0 rounded-[9px] border-2 border-card-border bg-paper px-2 py-0.5 text-[10px] font-extrabold aria-pressed:border-ink aria-pressed:bg-signal-yellow aria-pressed:shadow-hud-chip"
        >
          {intl.formatMessage({ id: `track.moveSide.${value}` })}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function CollapsedMoveTrackShell({
  variant,
  moves,
}: {
  variant: string
  moves: MockMove[]
}) {
  const intl = useIntl()

  return (
    <section className="overflow-hidden rounded-[14px] border-2 border-ink bg-paper shadow-hud-panel">
      <div className="flex h-11 items-center gap-2 px-2.5 sm:h-10">
        <Swords className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-xs font-extrabold">
          <FormattedMessage id="track.moves" />
        </span>
        <div className="ml-auto">
          <MoveCategoryChip category="special" />
        </div>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </div>
      <div className="border-t px-2.5 py-2">
        <div className="flex flex-wrap gap-1.5">
          {moves.map((move) => (
            <CollapsedMoveChip key={move.id} variant={variant} move={move} />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {intl.formatMessage({ id: "track.move.expand" })} · click chip to edit (prototype stub)
        </p>
      </div>
    </section>
  )
}

function CollapsedMoveChip({ variant, move }: { variant: string; move: MockMove }) {
  if (variant === "track-option") {
    return (
      <TrackOption
        layout="text"
        pressed={false}
        onToggle={() => {}}
        ariaLabel={move.label}
        className="h-auto min-h-0 gap-1 px-1.5 py-0.5 text-[11px]"
      >
        <TypeBadge type={move.type} />
        <span className="truncate">{move.label}</span>
      </TrackOption>
    )
  }

  const shared =
    "relative inline-flex max-w-full items-center gap-1 rounded-[9px] border-2 px-1.5 py-0.5 text-[11px] font-extrabold transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-ink"

  const variantClass = {
    current: "border-ink bg-signal-yellow shadow-hud-chip",
    flat: "border-card-border bg-paper hover:bg-token-bg/60",
    tint: "border-ink bg-[color-mix(in_srgb,var(--signal-yellow)_35%,var(--paper))] shadow-[inset_3px_0_0_0_var(--signal-yellow)]",
    check: "border-card-border bg-paper hover:bg-token-bg/60",
    "hover-signal":
      "border-card-border bg-paper [&:is(:hover,:active,:focus-visible)]:border-ink [&:is(:hover,:active,:focus-visible)]:bg-signal-yellow [&:is(:hover,:active,:focus-visible)]:shadow-hud-chip",
  }[variant] ?? "border-ink bg-signal-yellow shadow-hud-chip"

  return (
    <button type="button" className={cn(shared, variantClass)}>
      {variant === "check" ? (
        <span className="grid size-[14px] shrink-0 place-items-center rounded-[3px] border border-foreground bg-foreground text-background">
          <Check className="size-2.5" strokeWidth={2.5} />
        </span>
      ) : null}
      <TypeBadge type={move.type} />
      <span className="truncate">{move.label}</span>
    </button>
  )
}

function ExpandedSelectionReference() {
  const intl = useIntl()
  const move = MOCK_MOVES[0]

  return (
    <div className="overflow-hidden rounded-[14px] border border-dashed border-card-border bg-paper/50">
      <p className="border-b px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground">
        Reference — expanded row selection (checkbox, no yellow fill)
      </p>
      <div className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center sm:min-h-8">
        <div className="grid h-full min-h-11 grid-cols-[auto_minmax(0,1fr)_2rem_2rem_auto] items-center gap-2 px-2.5 sm:min-h-8">
          <TypeBadge type={move.type} />
          <span className="truncate text-xs font-medium">{move.label}</span>
          <span className="text-right text-[10px] tabular-nums text-muted-foreground">90</span>
          <span className="text-right text-[10px] tabular-nums text-muted-foreground">100</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </div>
        <button
          type="button"
          aria-label={intl.formatMessage({ id: "track.move.moveToCandidates" }, { move: move.label })}
          className="grid size-10 place-items-center sm:size-7"
        >
          <span className="grid size-[18px] place-items-center rounded-[4px] border border-foreground bg-foreground text-background">
            <Check className="size-3" strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </div>
  )
}

function NearbyTrackReference() {
  return (
    <AbilityTrack
      labelId="track.attackerAbility"
      options={MOCK_ABILITIES}
      selectedIds={[1]}
      onChange={() => {}}
      onReset={() => {}}
      expanded={false}
      onToggle={() => {}}
    />
  )
}

function TrackOptionPressedReference() {
  const intl = useIntl()

  return (
    <div className="space-y-2 rounded-[14px] border border-dashed border-card-border p-3">
      <p className="text-[10px] font-bold text-muted-foreground">
        Reference — TrackOption pressed (yellow is for active toggles)
      </p>
      <TrackOptionGroup aria-label="pressed reference">
        <TrackOption layout="text" pressed={false} onToggle={() => {}} ariaLabel="Off">
          Off
        </TrackOption>
        <TrackOption layout="text" pressed={true} onToggle={() => {}} ariaLabel="On">
          On
        </TrackOption>
      </TrackOptionGroup>
      <p className="text-[10px] text-muted-foreground">
        {intl.formatMessage({ id: "track.weather" })} / ability chips use yellow only when pressed.
      </p>
    </div>
  )
}

export function MoveTrackCollapsedChipsPrototype() {
  const [variant, setVariant] = useState(() => readPrototypeVariant(VARIANTS, "current"))

  function changeVariant(next: string) {
    setVariant(next)
    setPrototypeVariant(next)
  }

  const active = VARIANTS.find((item) => item.key === variant) ?? VARIANTS[0]

  return (
    <main className="mx-auto max-w-lg space-y-6 px-4 py-8 pb-24">
      <header className="space-y-2">
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
          Prototype · Move Track collapsed chips
        </p>
        <h1 className="text-lg font-extrabold">Collapsed move chip styling</h1>
        <p className="text-sm text-muted-foreground">
          Compare chip styles against nearby tracks and the expanded selection model. Variant{" "}
          <span className="font-bold text-ink">{active.key}</span>: {active.name}.
        </p>
      </header>

      <CollapsedMoveTrackShell variant={variant} moves={MOCK_MOVES} />

      <ExpandedSelectionReference />

      <NearbyTrackReference />

      <TrackOptionPressedReference />

      <PrototypeSwitcher variants={VARIANTS} current={variant} onChange={changeVariant} />
    </main>
  )
}

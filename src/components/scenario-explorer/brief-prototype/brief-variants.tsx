import type { LucideIcon } from "lucide-react"
import {
  ChevronsUpDown,
  CloudSun,
  Crosshair,
  Fence,
  Gauge,
  Gem,
  Shield,
  Sparkles,
  Swords,
} from "lucide-react"
import type { ReactNode } from "react"
import { useIntl } from "react-intl"

import { cn } from "@/lib/utils"

import {
  buildBriefTracks,
  type BriefTrack,
  type BriefTrackId,
} from "./brief-model"
import type { BriefEditorContext } from "./track-editor"

function useTracks(ctx: BriefEditorContext): BriefTrack[] {
  const intl = useIntl()
  return buildBriefTracks(ctx.catalog, ctx.state.trackState, intl, ctx.state.statNameStrategy)
}

function trackMap(tracks: BriefTrack[]): Record<BriefTrackId, BriefTrack> {
  return Object.fromEntries(tracks.map((t) => [t.id, t])) as Record<BriefTrackId, BriefTrack>
}

export const TRACK_ICON: Record<BriefTrackId, LucideIcon> = {
  attacker: Swords,
  defender: Shield,
  category: Crosshair,
  moves: Crosshair,
  offenseStats: Gauge,
  attackerStages: ChevronsUpDown,
  items: Gem,
  attackerAbilities: Sparkles,
  weather: CloudSun,
  defenseStats: Gauge,
  defenderStages: ChevronsUpDown,
  defenderAbilities: Sparkles,
  screens: Fence,
}

type SidePair = {
  atk: BriefTrackId | null
  def: BriefTrackId | null
}

/** Shared Atk/Def pairing for the brief map. */
export const SIDE_PAIRS: SidePair[] = [
  { atk: "attacker", def: "defender" },
  { atk: "moves", def: "screens" },
  { atk: "offenseStats", def: "defenseStats" },
  { atk: "attackerStages", def: "defenderStages" },
  { atk: "items", def: null },
  { atk: "attackerAbilities", def: "defenderAbilities" },
]

type BriefMapProps = {
  ctx: BriefEditorContext
  activeId: BriefTrackId | null
  onFocus: (id: BriefTrackId) => void
  /** When set, rendered under the row that owns `activeId` (inline expand). */
  expand?: ReactNode
}

/** Symmetric brief map (Atk | Def + weather); optional inline expand under the active row. */
export function BriefMap({ ctx, activeId, onFocus, expand }: BriefMapProps) {
  const byId = trackMap(useTracks(ctx))

  return (
    <nav aria-label="Scenario brief" className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <SideHeader
          icon={Swords}
          label={byId.attacker.label}
          active={activeId === "attacker"}
          onClick={() => onFocus("attacker")}
        />
        <SideHeader
          icon={Shield}
          label={byId.defender.label}
          active={activeId === "defender"}
          onClick={() => onFocus("defender")}
        />
      </div>

      <div className="space-y-1.5">
        {SIDE_PAIRS.map((pair) => {
          const ownsExpand =
            !!expand &&
            !!activeId &&
            (activeId === pair.atk || activeId === pair.def)
          return (
            <div key={`${pair.atk}-${pair.def}`} className="space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                <SideCell
                  track={pair.atk ? byId[pair.atk] : null}
                  emphasize={pair.atk === "attacker"}
                  active={pair.atk !== null && activeId === pair.atk}
                  onFocus={onFocus}
                />
                <SideCell
                  track={pair.def ? byId[pair.def] : null}
                  emphasize={pair.def === "defender"}
                  active={pair.def !== null && activeId === pair.def}
                  onFocus={onFocus}
                />
              </div>
              {ownsExpand && (
                <div className="border-border bg-muted/20 rounded-md border p-2.5">{expand}</div>
              )}
            </div>
          )
        })}
      </div>

      <FieldCell
        track={byId.weather}
        active={activeId === "weather"}
        onFocus={onFocus}
      />
      {expand && activeId === "weather" && (
        <div className="border-border bg-muted/20 rounded-md border p-2.5">{expand}</div>
      )}
    </nav>
  )
}

function SideHeader({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors",
        "hover:bg-muted/70",
        active && "bg-muted",
      )}
    >
      <Icon className="text-muted-foreground size-3.5 shrink-0" strokeWidth={1.75} />
      <span className="truncate text-[11px] font-medium tracking-tight">{label}</span>
    </button>
  )
}

function SideCell({
  track,
  emphasize,
  active,
  onFocus,
}: {
  track: BriefTrack | null
  emphasize?: boolean
  active: boolean
  onFocus: (id: BriefTrackId) => void
}) {
  if (!track) {
    return <div className="rounded-md border border-dashed border-transparent px-2 py-2" />
  }
  const Icon = TRACK_ICON[track.id]
  return (
    <button
      type="button"
      onClick={() => onFocus(track.id)}
      aria-current={active ? "true" : undefined}
      className={cn(
        "group flex min-w-0 flex-col gap-0.5 rounded-md border px-2 py-2 text-left transition-colors",
        "border-border/70 bg-background hover:border-border hover:bg-muted/50",
        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
        active && "border-foreground/25 bg-muted/60 ring-foreground/10 ring-1",
      )}
    >
      <span className="text-muted-foreground flex items-center gap-1 text-[10px] leading-none">
        <Icon className="size-3 opacity-70" strokeWidth={1.75} />
        <span className="truncate">{track.label}</span>
      </span>
      <span
        className={cn(
          "truncate tracking-tight",
          emphasize ? "text-[13px] font-semibold" : "text-xs font-medium",
        )}
      >
        {track.value}
      </span>
    </button>
  )
}

function FieldCell({
  track,
  active,
  onFocus,
}: {
  track: BriefTrack
  active: boolean
  onFocus: (id: BriefTrackId) => void
}) {
  const Icon = TRACK_ICON[track.id]
  return (
    <button
      type="button"
      onClick={() => onFocus(track.id)}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left transition-colors",
        "border-border/70 bg-muted/30 hover:bg-muted/60",
        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
        active && "border-foreground/25 bg-muted/70 ring-foreground/10 ring-1",
      )}
    >
      <Icon className="text-muted-foreground size-3.5 shrink-0" strokeWidth={1.75} />
      <span className="text-muted-foreground shrink-0 text-[10px]">{track.label}</span>
      <span className="min-w-0 flex-1 truncate text-xs font-medium tracking-tight">
        {track.value}
      </span>
    </button>
  )
}

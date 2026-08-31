import { Sprout } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { TERRAINS, type Terrain } from "@/lib/damage-calculation"

import { TrackPanel } from "./track-panel"
import { TrackOption, TrackOptionGroup } from "./track-option"

type TerrainTrackProps = {
  values: Terrain[]
  onChange: (values: Terrain[]) => void
}

export function TerrainTrack({ values, onChange }: TerrainTrackProps) {
  const intl = useIntl()
  const selected = new Set(values)

  function toggle(terrain: Terrain) {
    const next = TERRAINS.filter((candidate) =>
      candidate === terrain ? !selected.has(candidate) : selected.has(candidate),
    )
    onChange(next.length > 0 ? next : ["none"])
  }

  return (
    <TrackPanel
      expandable={false}
      icon={Sprout}
      label={<FormattedMessage id="track.terrain" />}
      summary={
        <TrackOptionGroup aria-label={intl.formatMessage({ id: "track.terrain" })}>
          {TERRAINS.map((terrain) => {
            const label = intl.formatMessage({ id: `track.terrain.${terrain}` })
            const description = intl.formatMessage({ id: `track.terrain.${terrain}.description` })
            const warning = terrain === "grassy"
              ? intl.formatMessage({ id: "track.terrain.warning.grassy-recovery" })
              : undefined
            return (
              <TrackOption
                key={terrain}
                layout="text"
                pressed={selected.has(terrain)}
                onToggle={() => toggle(terrain)}
                ariaLabel={[label, warning].filter(Boolean).join(", ")}
                tooltip={(
                  <span className="whitespace-pre-line">
                    {[description, warning].filter(Boolean).join("\n")}
                  </span>
                )}
                className="px-2"
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  {warning ? <span aria-hidden className="size-1.5 rounded-full bg-destructive" /> : null}
                </span>
              </TrackOption>
            )
          })}
        </TrackOptionGroup>
      }
    />
  )
}

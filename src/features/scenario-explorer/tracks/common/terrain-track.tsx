import { Sprout } from "lucide-react"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { TERRAINS, type Terrain } from "@/lib/damage-calculation"

import { TrackPanel } from "./track-panel"
import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackDescriptionToggle } from "./track-description-toggle"

type TerrainTrackProps = {
  values: Terrain[]
  onChange: (values: Terrain[]) => void
  expanded?: boolean
  onToggle?: () => void
}

export function TerrainTrack({
  values,
  onChange,
  expanded = true,
  onToggle = () => {},
}: TerrainTrackProps) {
  const intl = useIntl()
  const selected = new Set(values)
  const [showDescriptions, setShowDescriptions] = useState(false)

  function toggle(terrain: Terrain) {
    const next = TERRAINS.filter((candidate) =>
      candidate === terrain ? !selected.has(candidate) : selected.has(candidate),
    )
    onChange(next.length > 0 ? next : ["none"])
  }

  return (
    <TrackPanel
      icon={Sprout}
      label={<FormattedMessage id="track.terrain" />}
      summary={values
        .map((terrain) =>
          intl.formatMessage({ id: `track.terrain.${terrain}` }),
        )
        .join(", ")}
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-end gap-1">
          <TrackDescriptionToggle
            checked={showDescriptions}
            onCheckedChange={setShowDescriptions}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => onChange(["none"])}
          >
            <FormattedMessage id="track.stage.reset" />
          </Button>
        </div>
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
                description={(
                  <span className="whitespace-pre-line">
                    {[description, warning].filter(Boolean).join("\n")}
                  </span>
                )}
                showDescription={showDescriptions}
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
      </div>
    </TrackPanel>
  )
}

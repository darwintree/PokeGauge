import { CloudSun } from "lucide-react"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { WEATHERS, type Weather } from "@/lib/damage-calculation"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackDescriptionToggle } from "./track-description-toggle"
import { TrackPanel } from "./track-panel"

type WeatherTrackProps = {
  values: Weather[]
  onChange: (values: Weather[]) => void
  expanded?: boolean
  onToggle?: () => void
}

export function WeatherTrack({ values, onChange, expanded = true, onToggle = () => {} }: WeatherTrackProps) {
  const intl = useIntl()
  const selected = new Set(values)
  const [showDescriptions, setShowDescriptions] = useState(false)

  function toggle(weather: Weather) {
    onChange(
      WEATHERS.filter((candidate) =>
        candidate === weather ? !selected.has(candidate) : selected.has(candidate),
      ),
    )
  }

  return (
    <TrackPanel
      icon={CloudSun}
      label={<FormattedMessage id="track.weather" />}
      summary={values.map((weather) => intl.formatMessage({ id: `track.weather.${weather}` })).join(", ")}
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
        <TrackOptionGroup aria-label={intl.formatMessage({ id: "track.weather" })}>
          {WEATHERS.map((weather) => {
            const label = intl.formatMessage({ id: `track.weather.${weather}` })
            const description = intl.formatMessage({ id: `track.weather.${weather}.description` })
            return (
              <TrackOption
                key={weather}
                layout="text"
                pressed={selected.has(weather)}
                onToggle={() => toggle(weather)}
                ariaLabel={label}
                tooltip={description}
                description={description}
                showDescription={showDescriptions}
                className="px-2"
              >
                {label}
              </TrackOption>
            )
          })}
        </TrackOptionGroup>
      </div>
    </TrackPanel>
  )
}

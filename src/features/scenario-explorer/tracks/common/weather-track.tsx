import { CloudSun } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { WEATHERS, type Weather } from "@/lib/damage-calculation"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackPanel } from "./track-panel"

type WeatherTrackProps = {
  values: Weather[]
  onChange: (values: Weather[]) => void
}

export function WeatherTrack({ values, onChange }: WeatherTrackProps) {
  const intl = useIntl()
  const selected = new Set(values)

  function toggle(weather: Weather) {
    onChange(
      WEATHERS.filter((candidate) =>
        candidate === weather ? !selected.has(candidate) : selected.has(candidate),
      ),
    )
  }

  return (
    <TrackPanel
      expandable={false}
      icon={CloudSun}
      label={<FormattedMessage id="track.weather" />}
      summary={
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
                className="px-2"
              >
                {label}
              </TrackOption>
            )
          })}
        </TrackOptionGroup>
      }
    />
  )
}

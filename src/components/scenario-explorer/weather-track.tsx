import { CloudSun } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { WEATHERS, type Weather } from "@/lib/calc-adapter"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackCard } from "./track-card"

type WeatherTrackProps = {
  values: Weather[]
  onChange: (values: Weather[]) => void
  expanded?: boolean
  onToggle?: () => void
}

export function WeatherTrack({ values, onChange, expanded = true, onToggle = () => {} }: WeatherTrackProps) {
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
    <TrackCard
      icon={CloudSun}
      label={<FormattedMessage id="track.weather" />}
      summary={values.map((weather) => intl.formatMessage({ id: `track.weather.${weather}` })).join(", ")}
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="space-y-2">
        <div className="flex justify-end">
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
          return (
            <TrackOption
              key={weather}
              layout="text"
              pressed={selected.has(weather)}
              onToggle={() => toggle(weather)}
              ariaLabel={label}
              className="px-2"
            >
              {label}
            </TrackOption>
          )
        })}
      </TrackOptionGroup>
      </div>
    </TrackCard>
  )
}

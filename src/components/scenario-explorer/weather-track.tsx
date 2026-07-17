import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { WEATHERS, type Weather } from "@/lib/calc-adapter"

import { TrackOption, TrackOptionGroup } from "./track-option"

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
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-muted-foreground text-xs">
          <FormattedMessage id="track.weather" />
        </Label>
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
  )
}

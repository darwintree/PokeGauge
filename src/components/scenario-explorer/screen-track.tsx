import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SCREENS, type Screen } from "@/lib/calc-adapter"

import { TrackOption, TrackOptionGroup } from "./track-option"

type ScreenTrackProps = {
  values: Screen[]
  onChange: (values: Screen[]) => void
}

function toggleScreen(values: Screen[], screen: Screen): Screen[] {
  const selected = new Set(values)
  const next = SCREENS.filter((candidate) =>
    candidate === screen ? !selected.has(candidate) : selected.has(candidate),
  )
  return next.length > 0 ? next : ["none"]
}

export function ScreenTrack({ values, onChange }: ScreenTrackProps) {
  const intl = useIntl()
  const selected = new Set(values)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-muted-foreground text-xs">
          <FormattedMessage id="track.screen" />
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
      <TrackOptionGroup aria-label={intl.formatMessage({ id: "track.screen" })}>
        {SCREENS.map((screen) => {
          const label = intl.formatMessage({ id: `track.screen.${screen}` })
          return (
            <TrackOption
              key={screen}
              layout="text"
              pressed={selected.has(screen)}
              onToggle={() => onChange(toggleScreen(values, screen))}
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

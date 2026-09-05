import { Fence } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { SCREENS, type Screen } from "@/lib/damage-calculation"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackPanel } from "./track-panel"

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
    <TrackPanel
      expandable={false}
      icon={Fence}
      label={<FormattedMessage id="track.screen" />}
      summary={
        <TrackOptionGroup aria-label={intl.formatMessage({ id: "track.screen" })}>
          {SCREENS.map((screen) => {
            const label = intl.formatMessage({ id: `track.screen.${screen}` })
            const description = intl.formatMessage({ id: `track.screen.${screen}.description` })
            return (
              <TrackOption
                key={screen}
                layout="text"
                pressed={selected.has(screen)}
                onToggle={() => onChange(toggleScreen(values, screen))}
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

import { Fence } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { SCREENS, type Screen } from "@/lib/calc-adapter"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackPanel } from "./track-panel"

type ScreenTrackProps = {
  values: Screen[]
  onChange: (values: Screen[]) => void
  expanded?: boolean
  onToggle?: () => void
}

function toggleScreen(values: Screen[], screen: Screen): Screen[] {
  const selected = new Set(values)
  const next = SCREENS.filter((candidate) =>
    candidate === screen ? !selected.has(candidate) : selected.has(candidate),
  )
  return next.length > 0 ? next : ["none"]
}

export function ScreenTrack({ values, onChange, expanded = true, onToggle = () => {} }: ScreenTrackProps) {
  const intl = useIntl()
  const selected = new Set(values)

  return (
    <TrackPanel
      icon={Fence}
      label={<FormattedMessage id="track.screen" />}
      summary={values.map((screen) => intl.formatMessage({ id: `track.screen.${screen}` })).join(", ")}
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
    </TrackPanel>
  )
}

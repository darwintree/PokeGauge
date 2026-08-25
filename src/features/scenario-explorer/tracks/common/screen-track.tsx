import { Fence } from "lucide-react"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { SCREENS, type Screen } from "@/lib/damage-calculation"

import { TrackOption, TrackOptionGroup } from "./track-option"
import { TrackPanel } from "./track-panel"
import { TrackDescriptionToggle } from "./track-description-toggle"

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
  const [showDescriptions, setShowDescriptions] = useState(false)

  return (
    <TrackPanel
      icon={Fence}
      label={<FormattedMessage id="track.screen" />}
      summary={values.map((screen) => intl.formatMessage({ id: `track.screen.${screen}` })).join(", ")}
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

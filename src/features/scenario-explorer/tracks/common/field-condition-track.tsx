import { useState } from "react"
import { CloudSun, Sprout } from "lucide-react"
import { useIntl } from "react-intl"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Terrain, Weather } from "@/lib/damage-calculation"

import { FieldConditionIcon } from "./field-condition-icon"
import { TrackOption, TrackOptionAdd, TrackOptionGroup } from "./track-option"
import { TrackPanel } from "./track-panel"

const UNAVAILABLE_WEATHERS = ["harsh-sunshine", "heavy-rain", "strong-winds"] as const

type FieldConditionTrackProps<T extends Terrain | Weather> = {
  kind: "terrain" | "weather"
  catalog: readonly T[]
  pool: T[]
  values: T[]
  onChange: (values: T[]) => void
  onAdd: (value: T) => void
}

export function FieldConditionTrack<T extends Terrain | Weather>({
  kind, catalog, pool, values, onChange, onAdd,
}: FieldConditionTrackProps<T>) {
  const intl = useIntl()
  const [adding, setAdding] = useState(false)
  const remaining = catalog.filter((value) => !pool.includes(value) && !values.includes(value))
  const label = intl.formatMessage({ id: `track.${kind}` })
  const addLabel = intl.formatMessage({ id: kind === "weather" ? "track.addWeather" : "track.addTerrain" })

  function option(value: T, inPicker: boolean) {
    const name = intl.formatMessage({ id: `track.${kind}.${value}` })
    const description = intl.formatMessage({ id: `track.${kind}.${value}.description` })
    const warning = value === "grassy"
      ? intl.formatMessage({ id: "track.terrain.warning.grassy-recovery" })
      : undefined
    return (
      <TrackOption
        key={value}
        layout="icon"
        pressed={!inPicker && values.includes(value)}
        onToggle={() => {
          if (inPicker) {
            onAdd(value)
            setAdding(false)
          } else {
            onChange(catalog.filter((candidate) => candidate === value
              ? !values.includes(candidate)
              : values.includes(candidate)))
          }
        }}
        ariaLabel={[name, warning].filter(Boolean).join(", ")}
        tooltip={<span className="whitespace-pre-line">{[name, description, warning].filter(Boolean).join("\n")}</span>}
        showDescription={inPicker}
        descriptionLabel={name}
        description={[description, warning].filter(Boolean).join(" ")}
        className="relative"
      >
        <FieldConditionIcon condition={value} />
        {warning && !inPicker ? <span aria-hidden className="absolute right-1 top-1 size-1.5 rounded-full bg-destructive" /> : null}
      </TrackOption>
    )
  }

  return (
    <>
      <TrackPanel
        expandable={false}
        icon={kind === "weather" ? CloudSun : Sprout}
        label={label}
        summary={
          <TrackOptionGroup aria-label={label}>
            {catalog.filter((value) => pool.includes(value) || values.includes(value)).map((value) => option(value, false))}
            {(remaining.length > 0 || kind === "weather") && (
              <TrackOptionAdd ariaLabel={addLabel} onClick={() => setAdding(true)} />
            )}
          </TrackOptionGroup>
        }
      />
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <DialogHeader><DialogTitle>{addLabel}</DialogTitle></DialogHeader>
          <TrackOptionGroup aria-label={addLabel}>
            {remaining.map((value) => option(value, true))}
            {kind === "weather" && UNAVAILABLE_WEATHERS.map((weather) => {
              const name = intl.formatMessage({ id: `track.weather.${weather}` })
              const unavailable = intl.formatMessage({ id: "track.weather.unavailable" })
              return (
                <TrackOption
                  key={weather}
                  layout="icon"
                  pressed={false}
                  disabled
                  className="track-option--neutral-disabled"
                  onToggle={() => undefined}
                  ariaLabel={`${name}, ${unavailable}`}
                  showDescription
                  descriptionLabel={name}
                  description={unavailable}
                >
                  <FieldConditionIcon condition={weather} />
                </TrackOption>
              )
            })}
          </TrackOptionGroup>
        </DialogContent>
      </Dialog>
    </>
  )
}

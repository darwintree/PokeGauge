import { WEATHERS, type Weather } from "@/lib/damage-calculation"

import { FieldConditionTrack } from "./field-condition-track"

type WeatherTrackProps = {
  pool: Weather[]
  values: Weather[]
  onChange: (values: Weather[]) => void
  onAdd: (value: Weather) => void
}

export function WeatherTrack(props: WeatherTrackProps) {
  return <FieldConditionTrack kind="weather" catalog={WEATHERS} {...props} />
}

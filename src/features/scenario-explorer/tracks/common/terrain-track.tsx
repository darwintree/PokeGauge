import { TERRAINS, type Terrain } from "@/lib/damage-calculation"

import { FieldConditionTrack } from "./field-condition-track"

type TerrainTrackProps = {
  pool: Terrain[]
  values: Terrain[]
  onChange: (values: Terrain[]) => void
  onAdd: (value: Terrain) => void
}

export function TerrainTrack(props: TerrainTrackProps) {
  return <FieldConditionTrack kind="terrain" catalog={TERRAINS} {...props} />
}

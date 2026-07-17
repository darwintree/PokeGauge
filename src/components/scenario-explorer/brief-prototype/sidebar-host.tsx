import { X } from "lucide-react"
import { useState } from "react"
import { useIntl } from "react-intl"

import { Button } from "@/components/ui/button"

import { buildBriefTracks, type BriefTrackId } from "./brief-model"
import { BriefMap } from "./brief-variants"
import { TrackEditor, type BriefEditorContext } from "./track-editor"

/**
 * Inline-expand brief: map stays; editor opens under the selected row.
 * Chosen direction — see issue 852c847c-5b09-4e86-a449-56e73bb977b6.
 */
export function SidebarBriefHost({ ctx }: { ctx: BriefEditorContext }) {
  const intl = useIntl()
  const [focus, setFocus] = useState<BriefTrackId | null>(null)
  const tracks = buildBriefTracks(
    ctx.catalog,
    ctx.state.trackState,
    intl,
    ctx.state.statNameStrategy,
  )
  const focused = focus ? tracks.find((t) => t.id === focus) : null

  function toggle(id: BriefTrackId) {
    setFocus((current) => (current === id ? null : id))
  }

  const expand =
    focus && focused ? (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-[11px]">{focused.label}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-6"
            aria-label="Close editor"
            onClick={() => setFocus(null)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
        <TrackEditor focus={focus} ctx={ctx} />
      </div>
    ) : null

  return <BriefMap ctx={ctx} activeId={focus} onFocus={toggle} expand={expand} />
}

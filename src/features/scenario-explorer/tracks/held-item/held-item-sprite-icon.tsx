import { CircleSlash, Gem } from "lucide-react"
import { useState } from "react"

import { EXPLICIT_NO_ITEM_ID, itemSpriteUrl } from "@/lib/held-item"
import { cn } from "@/lib/utils"

type HeldItemSpriteIconProps = {
  id: string | number
  className?: string
}

export function HeldItemSpriteIcon({
  id,
  className,
}: HeldItemSpriteIconProps) {
  const url = itemSpriteUrl(id)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  // ponytail: classic PokeAPI item PNGs are 30×30 pixel art — box to that canvas
  // so 1×/2× DPR stays integer. gen8/gen9 are 160×160 illustrations in the same
  // box; bilinear scale, no pixelated (nearest-neighbor would mosaic them).
  const hiRes = url?.includes("/gen8/") === true || url?.includes("/gen9/") === true
  const markClassName = cn(
    "size-[30px] shrink-0 object-contain",
    url && !hiRes && "[image-rendering:pixelated]",
    className,
  )

  if (id === EXPLICIT_NO_ITEM_ID) {
    return <CircleSlash className={cn(markClassName, "text-hud-muted/60")} aria-hidden />
  }

  if (!url || failedUrl === url) {
    return <Gem className={cn(markClassName, "text-hud-muted/60")} aria-hidden />
  }

  return (
    <img
      src={url}
      alt=""
      className={markClassName}
      onError={() => setFailedUrl(url)}
    />
  )
}

import { CircleSlash, Gem } from "lucide-react"
import { useState } from "react"

import { EXPLICIT_NO_ITEM_ID, itemSpriteUrl } from "@/lib/held-item"
import { cn } from "@/lib/utils"

type HeldItemSpriteIconProps = {
  id: string | number
  className?: string
  imgClassName?: string
}

export function HeldItemSpriteIcon({
  id,
  className,
  imgClassName,
}: HeldItemSpriteIconProps) {
  const url = itemSpriteUrl(id)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (id === EXPLICIT_NO_ITEM_ID) {
    return (
      <CircleSlash
        className={cn("size-6 text-hud-muted/60", className)}
        aria-hidden
      />
    )
  }

  if (!url || failedUrl === url) {
    return (
      <Gem className={cn("size-6 text-hud-muted/60", className)} aria-hidden />
    )
  }

  return (
    <img
      src={url}
      alt=""
      className={cn("size-6 object-contain", imgClassName, className)}
      onError={() => setFailedUrl(url)}
    />
  )
}

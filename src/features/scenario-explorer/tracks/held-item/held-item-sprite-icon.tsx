import { Gem } from "lucide-react"
import { useState } from "react"

import { itemSpriteUrl } from "@/lib/held-item"
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

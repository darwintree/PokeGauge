import { useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export type PrototypeVariant = {
  key: string
  name: string
}

type PrototypeSwitcherProps = {
  variants: PrototypeVariant[]
  current: string
  onChange: (key: string) => void
  className?: string
}

function indexOfVariant(variants: PrototypeVariant[], key: string): number {
  const index = variants.findIndex((variant) => variant.key === key)
  return index >= 0 ? index : 0
}

function adjacentVariantKey(
  variants: PrototypeVariant[],
  current: string,
  direction: -1 | 1,
): string {
  const index = indexOfVariant(variants, current)
  return variants[(index + direction + variants.length) % variants.length].key
}

export function PrototypeSwitcher({
  variants,
  current,
  onChange,
  className,
}: PrototypeSwitcherProps) {
  const currentVariant = variants.find((variant) => variant.key === current) ?? variants[0]

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return
      }
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      onChange(
        adjacentVariantKey(variants, current, event.key === "ArrowRight" ? 1 : -1),
      )
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [current, onChange, variants])

  if (import.meta.env.PROD) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-ink bg-ink px-1 py-1 text-paper shadow-[4px_4px_0_0_rgba(31,36,48,0.35)]",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Previous variant"
        className="grid size-8 place-items-center rounded-full hover:bg-paper/15 focus-visible:outline-2 focus-visible:outline-paper"
        onClick={() => onChange(adjacentVariantKey(variants, current, -1))}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="min-w-[14rem] px-2 text-center text-xs font-bold">
        {currentVariant.key.toUpperCase()} — {currentVariant.name}
      </span>
      <button
        type="button"
        aria-label="Next variant"
        className="grid size-8 place-items-center rounded-full hover:bg-paper/15 focus-visible:outline-2 focus-visible:outline-paper"
        onClick={() => onChange(adjacentVariantKey(variants, current, 1))}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

export function readPrototypeVariant(
  variants: PrototypeVariant[],
  fallback = variants[0]?.key ?? "A",
): string {
  const key = new URLSearchParams(window.location.search).get("variant")
  return variants.some((variant) => variant.key === key) ? key! : fallback
}

export function setPrototypeVariant(key: string) {
  const url = new URL(window.location.href)
  url.searchParams.set("variant", key)
  window.history.replaceState(null, "", url)
}

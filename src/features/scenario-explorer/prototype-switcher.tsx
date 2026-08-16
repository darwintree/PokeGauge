import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect } from "react"
import { createPortal } from "react-dom"

export type PrototypeVariant = {
  key: string
  name: string
}

/** Throwaway prototype chrome. Not product UI. */
export function PrototypeSwitcher({
  variants,
  current,
  onChange,
  stateLine,
}: {
  variants: PrototypeVariant[]
  current: string
  onChange: (key: string) => void
  stateLine?: string
}) {
  const index = Math.max(0, variants.findIndex((variant) => variant.key === current))
  const active = variants[index] ?? variants[0]

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      const delta = event.key === "ArrowLeft" ? -1 : 1
      const next = variants[(index + delta + variants.length) % variants.length]
      if (next) onChange(next.key)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, onChange, variants])

  if (!import.meta.env.DEV || !active) return null

  function cycle(delta: number) {
    const next = variants[(index + delta + variants.length) % variants.length]
    if (next) onChange(next.key)
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[200] flex justify-center px-3">
      <div className="pointer-events-auto max-w-[min(36rem,calc(100vw-1.5rem))] rounded-[10px] border-2 border-ink bg-ink px-2 py-1.5 text-paper shadow-hud-chip">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-[7px] hover:bg-paper/15"
            aria-label="Previous variant"
            onClick={() => cycle(-1)}
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="min-w-0 flex-1 text-center text-xs font-extrabold tracking-tight">
            {active.key} - {active.name}
          </p>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-[7px] hover:bg-paper/15"
            aria-label="Next variant"
            onClick={() => cycle(1)}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        {stateLine ? (
          <p className="truncate px-2 pb-0.5 text-center text-[10px] font-medium text-paper/70">
            {stateLine}
          </p>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

export function readPrototypeVariant(keys: string[], fallback: string) {
  const value = new URLSearchParams(window.location.search).get("variant")
  return value && keys.includes(value) ? value : fallback
}

export function writePrototypeVariant(key: string) {
  const url = new URL(window.location.href)
  url.searchParams.set("variant", key)
  window.history.replaceState(null, "", url)
}

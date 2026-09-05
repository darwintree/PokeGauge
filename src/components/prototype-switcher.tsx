// THROWAWAY UI PROTOTYPE. Remove after a design is chosen.
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  label: string
  state: unknown
  onCycle: (direction: number) => void
}

export function PrototypeSwitcher({ label, state, onCycle }: Props) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.target as HTMLElement)?.closest('input, textarea, select, [contenteditable], [role="slider"], [role="dialog"]')) return
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      onCycle(event.key === "ArrowLeft" ? -1 : 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onCycle])

  if (!import.meta.env.DEV) return null
  return createPortal(
    <div className="prototype-switcher">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="icon" aria-label="上一个原型" onClick={() => onCycle(-1)}><ArrowLeft /></Button>
        <span className="min-w-0 flex-1 text-center text-xs">{label}</span>
        <Button variant="secondary" size="icon" aria-label="下一个原型" onClick={() => onCycle(1)}><ArrowRight /></Button>
      </div>
      <details>
        <summary className="cursor-pointer text-center text-[10px]">临时原型 · 不保存修改 · 查看状态</summary>
        <pre className="max-h-48 overflow-auto text-[10px]">{JSON.stringify(state, null, 2)}</pre>
      </details>
    </div>,
    document.body,
  )
}

// Throwaway FORM label study on /?prototype=forms.
import { ChevronDown } from "lucide-react"
import { useIntl } from "react-intl"
import { Button } from "@/components/ui/button"

export function FormPrototypeSwitcher() {
  if (!import.meta.env.DEV || new URLSearchParams(window.location.search).get("prototype") !== "forms") return null
  return <aside className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-xs shadow-hud-chip">
    FORM 按钮试样 · 可点击与按压反馈
  </aside>
}

export function FormButtonPrototype({ onClick }: { onClick: () => void }) {
  const intl = useIntl()
  return <Button
    size="sm"
    className="form-prototype-trigger"
    aria-label={intl.formatMessage({ id: "matchup.forms.open" })}
    aria-haspopup="dialog"
    onClick={onClick}
  >
    FORM <ChevronDown aria-hidden data-icon="inline-end" />
  </Button>
}

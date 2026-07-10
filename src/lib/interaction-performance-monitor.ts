const PREFIX = "[PERF-interaction]"
const SETTLE_DELAY_MS = 50

type Interaction = {
  id: number
  label: string
  startedAt: number
  firstMutationAt?: number
  firstFrameLogged: boolean
}

let activeInteraction: Interaction | null = null
let nextInteractionId = 1
let settleTimer: number | undefined

export function interactionMonitoringEnabled(): boolean {
  return new URLSearchParams(window.location.search).get("perf") === "interactions"
}

function log(kind: string, details: Record<string, unknown>) {
  console.info(PREFIX, JSON.stringify({ kind, ...details }))
}

function labelFor(element: Element): string {
  const labelledBy = element.getAttribute("aria-labelledby")
  const linkedLabel = element.id
    ? document.querySelector(`label[for="${element.id}"]`)?.textContent
    : undefined
  return (
    element.getAttribute("aria-label") ??
    (labelledBy ? document.getElementById(labelledBy)?.textContent : undefined) ??
    linkedLabel?.replace(/\s+/g, " ").trim() ??
    element.textContent?.replace(/\s+/g, " ").trim() ??
    element.tagName.toLowerCase()
  )
}

function scheduleSettledFrame(interaction: Interaction) {
  window.clearTimeout(settleTimer)
  settleTimer = window.setTimeout(() => {
    requestAnimationFrame(() => {
      if (activeInteraction?.id !== interaction.id) return
      log("settled-frame", {
        interactionId: interaction.id,
        label: interaction.label,
        ms: Number((performance.now() - interaction.startedAt).toFixed(1)),
      })
      activeInteraction = null
    })
  }, SETTLE_DELAY_MS)
}

export function installInteractionPerformanceMonitor() {
  if (!interactionMonitoringEnabled()) return

  document.addEventListener(
    "click",
    (event) => {
      const clicked = event.target instanceof Element
        ? event.target.closest("button, [role='tab'], [role='switch']")
        : null
      if (!clicked) return

      activeInteraction = {
        id: nextInteractionId++,
        label: labelFor(clicked),
        startedAt: performance.now(),
        firstFrameLogged: false,
      }
      scheduleSettledFrame(activeInteraction)
    },
    true,
  )

  const root = document.getElementById("root")
  if (!root) return

  new MutationObserver(() => {
    const interaction = activeInteraction
    if (!interaction) return

    interaction.firstMutationAt ??= performance.now()
    if (!interaction.firstFrameLogged) {
      interaction.firstFrameLogged = true
      requestAnimationFrame(() => {
        log("first-frame", {
          interactionId: interaction.id,
          label: interaction.label,
          firstMutationMs: Number(
            (interaction.firstMutationAt! - interaction.startedAt).toFixed(1),
          ),
          ms: Number((performance.now() - interaction.startedAt).toFixed(1)),
        })
      })
    }
    scheduleSettledFrame(interaction)
  }).observe(root, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  })

  log("monitor-ready", {})
}

export function measureInteractionWork<T>(name: string, work: () => T): T {
  if (!interactionMonitoringEnabled()) return work()

  const startedAt = performance.now()
  try {
    return work()
  } finally {
    log("work", {
      interactionId: activeInteraction?.id ?? null,
      label: activeInteraction?.label ?? null,
      name,
      ms: Number((performance.now() - startedAt).toFixed(1)),
    })
  }
}

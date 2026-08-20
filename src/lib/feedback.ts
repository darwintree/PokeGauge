const FEEDBACK_URL = "https://github.com/darwintree/pokemon-damage-calc/issues/new"

export function createFeedbackUrl(scenarioUrl: string | null): string {
  if (!scenarioUrl) return FEEDBACK_URL
  const url = new URL(FEEDBACK_URL)
  url.searchParams.set("body", `## Scenario setup\n\n${scenarioUrl}\n\n## Feedback\n\n`)
  return url.toString()
}

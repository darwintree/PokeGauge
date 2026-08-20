import { expect, it } from "vitest"

import { createFeedbackUrl } from "./feedback"

it("prefills feedback with the scenario share link", () => {
  const scenarioUrl = "https://pokegauge.example/?s=shared-setup"
  const feedbackUrl = new URL(createFeedbackUrl(scenarioUrl))

  expect(feedbackUrl.searchParams.get("body")).toContain(scenarioUrl)
  expect(createFeedbackUrl(null)).toBe(
    "https://github.com/darwintree/pokemon-damage-calc/issues/new",
  )
})

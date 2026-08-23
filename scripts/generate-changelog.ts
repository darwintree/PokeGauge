import { writeFileSync } from "node:fs"
import { readChangesets } from "@changesets/read"

import { assertLocalizedChangelogEntry } from "../src/lib/changelog-format.ts"

const changesets = await readChangesets(process.cwd())
const entries = changesets
  .map(({ summary }) => {
    assertLocalizedChangelogEntry(summary)
    return summary.trim()
  })
  .join("\n\n")
const output = `# PokeGauge\n\n## Unreleased\n${entries ? `\n${entries}\n` : ""}`

writeFileSync("CHANGELOG-UNRELEASE.md", output)

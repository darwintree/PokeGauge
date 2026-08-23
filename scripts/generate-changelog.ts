import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { assertLocalizedChangelogEntry } from "../src/lib/changelog-format.ts"

type ChangesetStatus = {
  changesets: Array<{ summary: string }>
}

const temporaryDirectory = mkdtempSync(join(tmpdir(), "pokegauge-changelog-"))
const statusPath = join(temporaryDirectory, "status.json")

try {
  execFileSync("pnpm", ["exec", "changeset", "status", "--output", statusPath], {
    stdio: "inherit",
  })

  const status = JSON.parse(readFileSync(statusPath, "utf8")) as ChangesetStatus
  const entries = status.changesets
    .map(({ summary }) => {
      assertLocalizedChangelogEntry(summary)
      return summary.trim()
    })
    .join("\n\n")
  const output = `# PokeGauge\n\n## Unreleased\n${entries ? `\n${entries}\n` : ""}`

  writeFileSync("CHANGELOG-UNRELEASE.md", output)
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}

import releasedChangelog from "../../CHANGELOG.md?raw"
import unreleasedChangelog from "../../CHANGELOG-UNRELEASE.md?raw"

import { parseChangelog } from "@/lib/changelog-format"

export const CHANGELOG_ENTRIES = [
  ...parseChangelog(unreleasedChangelog),
  ...parseChangelog(releasedChangelog),
]

import { SUPPORTED_LOCALES, type SupportedLocale } from "./i18n/locales.ts"

export type ChangelogEntry = {
  version: string | null
  messages: Record<SupportedLocale, string>
}

const ENTRY_PATTERN = /<!-- changelog:start -->([\s\S]*?)<!-- changelog:end -->/g

function markerCount(source: string, marker: string): number {
  return source.split(marker).length - 1
}

function parseMessages(source: string): Record<SupportedLocale, string> {
  const messages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => {
      const marker = `<!-- changelog:${locale} -->`
      if (markerCount(source, marker) !== 1) {
        throw new Error(`Changelog locale must appear exactly once: ${locale}`)
      }

      const bodyStart = source.indexOf(marker) + marker.length
      const nextMarker = source.indexOf("<!-- changelog:", bodyStart)
      const bodyEnd = nextMarker < 0 ? source.length : nextMarker
      const body = source
        .slice(bodyStart, bodyEnd)
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim()

      if (!body) throw new Error(`Changelog locale is empty: ${locale}`)
      return [locale, body]
    }),
  )

  return messages as Record<SupportedLocale, string>
}

export function assertLocalizedChangelogEntry(summary: string): void {
  const entries = [...summary.matchAll(ENTRY_PATTERN)]
  if (entries.length !== 1 || summary.replace(entries[0]?.[0] ?? "", "").trim()) {
    throw new Error("A changeset summary must contain exactly one localized changelog entry")
  }
  parseMessages(entries[0][1])
}

export function parseChangelog(markdown: string): ChangelogEntry[] {
  const headings = [...markdown.matchAll(/^## (.+)$/gm)]

  return headings.flatMap((heading, index) => {
    const sectionStart = heading.index + heading[0].length
    const sectionEnd = headings[index + 1]?.index ?? markdown.length
    const section = markdown.slice(sectionStart, sectionEnd)
    const version = heading[1].trim() === "Unreleased" ? null : heading[1].trim()

    return [...section.matchAll(ENTRY_PATTERN)].map((match) => ({
      version,
      messages: parseMessages(match[1]),
    }))
  })
}

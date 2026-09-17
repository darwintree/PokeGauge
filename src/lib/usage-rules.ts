export type UsageSource = "champions" | "smogon" | "pikalytics"
export const USAGE_SOURCES: readonly UsageSource[] = ["champions", "smogon", "pikalytics"]
export type UsageRule = { id: string; label: string; displayName?: string; compiled?: boolean }
export const CHAMPIONS_INDEX_URL = "https://championsbattledata.com/api"
export function isUsageSource(value: string | null | undefined): value is UsageSource {
  return USAGE_SOURCES.some(source => source === value)
}

export type UsageCatalog = { defaultId: string; rules: UsageRule[]; date?: string }

function regulation(id: string): string {
  return id.match(/reg([a-z]+?)(?=bo3(?:-|$)|s\d+(?:-|$)|-|$)/i)?.[1]?.toLowerCase() ?? ""
}

/** Discover a small working set from published metadata, never a format allowlist. */
export function selectCompileRules(source: UsageSource, catalog: UsageCatalog): string[] {
  const { rules, defaultId } = catalog
  if (source === "champions") {
    return [defaultId, ...rules.map(r => r.id).filter(id => id !== defaultId && /^M\d+$/i.test(id))
      .sort((a, b) => Number(b.slice(1)) - Number(a.slice(1))).slice(0, 2)]
  }
  if (source === "smogon") {
    const parsed = rules.flatMap(r => {
      const match = r.id.match(/^(\d{4}-\d{2})\/gen\d+championsvgc(\d{4})reg([a-z]+?)(bo3)?-(\d+)$/)
      return match ? [{ id: r.id, month: match[1], year: match[2], reg: match[3], bo3: !!match[4], rating: Number(match[5]) }] : []
    })
    const latest = [...parsed].sort((a, b) => b.month.localeCompare(a.month) || b.year.localeCompare(a.year) || b.reg.localeCompare(a.reg))[0]
    if (!latest) return []
    const current = parsed.filter(r => r.month === latest.month && r.year === latest.year && r.reg === latest.reg)
    return [false, true].flatMap(bo3 => {
      const group = current.filter(r => r.bo3 === bo3).sort((a, b) => a.rating - b.rating)
      return [...new Set([group.find(r => r.rating === 0)?.id, group.at(-1)?.id].filter((id): id is string => !!id))]
    })
  }
  const candidates = rules.filter(r => /championsvgc|^battledatareg|^(?:champions)?tournaments(?:reg|-|$)/i.test(r.id))
  const ranked = [...candidates].sort((a, b) => regulation(b.id).localeCompare(regulation(a.id)) ||
    Number(b.id.match(/s(\d+)(?:-|$)/)?.[1] ?? 0) - Number(a.id.match(/s(\d+)(?:-|$)/)?.[1] ?? 0))
  const picks = [
    candidates.find(r => r.id === defaultId),
    candidates.find(r => /tournaments/i.test(r.id) && !regulation(r.id)),
    ranked.find(r => /^battledatareg/i.test(r.id)),
    ranked.find(r => /tournamentsreg/i.test(r.id) && (!regulation(defaultId) || regulation(r.id) < regulation(defaultId))),
    ...ranked,
  ]
  return [...new Set(picks.flatMap(r => r ? [r.id] : []))].slice(0, 4)
}

/** Keep meaningful differences; unknown naming conventions keep their upstream label. */
export function nameUsageRules(rules: UsageRule[]): UsageRule[] {
  const years = new Set(rules.flatMap(rule => rule.id.match(/vgc(\d{4})/i)?.[1] ?? []))
  const named = rules.map(rule => {
    const label = rule.label
    const match = rule.id.match(/(?:^|\/)gen\d+(?:champions)?vgc(\d{4})reg([a-z]+?)(bo3)?-(\d+)$/i)
    const displayName = match ? [
      ...(years.size > 1 ? [match[1]] : []),
      match[2].toUpperCase().split("").join("-"),
      ...(/showdown/i.test(label) ? ["Showdown"] : []),
      ...(match[3] ? ["BO3"] : []),
      match[4],
    ].join(" · ") : label
      .replace(/Pok[eé]mon\s+Champions\s*/gi, "")
      .replace(/Regulation(?:\s+Set)?\s+/gi, "Reg ")
      .replace(/\s+/g, " ").trim() || label
    return { ...rule, displayName }
  })
  const counts = new Map<string, number>()
  for (const rule of named) counts.set(rule.displayName, (counts.get(rule.displayName) ?? 0) + 1)
  return named.map(rule => counts.get(rule.displayName)! > 1
    ? { ...rule, displayName: `${rule.label} · ${rule.id}` } : rule)
}

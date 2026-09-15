import { useSyncExternalStore } from "react"

import {
  fetchUsageRanking,
  listChampionsUsageRules,
  peekCachedPokemonUsageIds,
  setUsageSource,
} from "@/lib/champions"
import {
  loadUsageCache,
  loadUsagePreference,
  rememberedRuleId,
  saveUsageCache,
  saveUsagePreference,
  usageIsStale,
  withRememberedRule,
  type UsageRule,
  type UsageSource,
} from "@/lib/usage-source-preference"

export type UsageStoreSnapshot = {
  source: UsageSource
  ruleId: string | null
  rules: UsageRule[]
  fetchedAt: number | null
  pendingUpdate: boolean
  refreshing: boolean
  generation: number
}

type RemoteCatalog = {
  defaultId: string
  rules: UsageRule[]
  date?: string
}

type PendingRanking = {
  fingerprint: string
  pokemonIds: number[]
  fetchedAt: number
}

let preference = loadUsagePreference()
let ruleId: string | null = rememberedRuleId(preference, preference.source) ?? null
let rules: UsageRule[] = []
let pikalyticsDate: string | null = null
let fetchedAt: number | null = null
let pending: PendingRanking | null = null
let refreshing = false
let generation = 0
let snapshot: UsageStoreSnapshot = makeSnapshot()
const listeners = new Set<() => void>()
const catalogs = new Map<UsageSource, Promise<RemoteCatalog>>()
let started = false

function makeSnapshot(): UsageStoreSnapshot {
  return {
    source: preference.source,
    ruleId,
    rules,
    fetchedAt,
    pendingUpdate: pending != null,
    refreshing,
    generation,
  }
}

function emit(): void {
  snapshot = makeSnapshot()
  for (const listener of listeners) listener()
}

function persist(): void {
  saveUsagePreference(preference)
}

function syncModuleSelection(): void {
  setUsageSource(preference.source, ruleId, { pikalyticsDate })
  const cached = ruleId ? loadUsageCache(preference.source, ruleId) : null
  fetchedAt = cached?.fetchedAt ?? null
}

function bumpGeneration(): void {
  generation += 1
}

async function loadCatalog(source: UsageSource): Promise<RemoteCatalog> {
  let pendingCatalog = catalogs.get(source)
  if (!pendingCatalog) {
    pendingCatalog = fetchCatalog(source).catch((error) => {
      catalogs.delete(source)
      throw error
    })
    catalogs.set(source, pendingCatalog)
  }
  return pendingCatalog
}

async function fetchCatalog(source: UsageSource): Promise<RemoteCatalog> {
  if (source === "champions") return listChampionsUsageRules()
  const path = source === "smogon" ? "/api/smogon/formats" : "/api/pikalytics/formats"
  const response = await fetch(path)
  if (!response.ok) throw new Error(`Usage catalog failed ${response.status}: ${path}`)
  const body = await response.json() as {
    defaultId?: unknown
    rules?: unknown
    date?: unknown
  }
  const parsedRules = Array.isArray(body.rules)
    ? body.rules.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return []
        const rule = entry as { id?: unknown; label?: unknown }
        if (typeof rule.id !== "string" || rule.id.length === 0) return []
        return [{ id: rule.id, label: typeof rule.label === "string" && rule.label ? rule.label : rule.id }]
      })
    : []
  const defaultId = typeof body.defaultId === "string" && body.defaultId
    ? body.defaultId
    : parsedRules[0]?.id
  if (!defaultId) throw new Error(`Usage catalog missing default: ${path}`)
  return {
    defaultId,
    rules: parsedRules,
    date: typeof body.date === "string" ? body.date : undefined,
  }
}

function ruleFromCatalog(catalog: RemoteCatalog, source: UsageSource): string {
  const remembered = rememberedRuleId(preference, source)
  if (remembered && catalog.rules.some((rule) => rule.id === remembered)) return remembered
  return catalog.defaultId
}

async function selectSource(source: UsageSource, explicitRuleId?: string): Promise<void> {
  const catalog = await loadCatalog(source)
  const nextRule = explicitRuleId ?? ruleFromCatalog(catalog, source)
  preference = { ...withRememberedRule(preference, source, nextRule), source }
  ruleId = nextRule
  rules = catalog.rules
  pikalyticsDate = source === "pikalytics" ? catalog.date ?? null : null
  pending = null
  persist()
  syncModuleSelection()
  bumpGeneration()
  emit()
  if (peekCachedPokemonUsageIds()?.length && fetchedAt != null && usageIsStale(fetchedAt)) {
    void refreshRanking("pending")
  }
}

async function refreshRanking(mode: "apply" | "pending"): Promise<void> {
  if (!ruleId) return
  refreshing = true
  emit()
  try {
    const result = await fetchUsageRanking()
    const now = Date.now()
    const current = loadUsageCache(preference.source, ruleId)
    if (mode === "pending" && current && current.fingerprint !== result.fingerprint) {
      pending = { ...result, fetchedAt: now }
    } else {
      const changed = !current || current.fingerprint !== result.fingerprint
      pending = null
      saveUsageCache(preference.source, ruleId, {
        fetchedAt: now,
        fingerprint: result.fingerprint,
        pokemonIds: result.pokemonIds,
      })
      fetchedAt = now
      if (changed) {
        bumpGeneration()
        syncModuleSelection()
      }
    }
  } finally {
    refreshing = false
    emit()
  }
}

export function subscribeUsageStore(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getUsageStoreSnapshot(): UsageStoreSnapshot {
  return snapshot
}

export function useUsageStore(): UsageStoreSnapshot {
  return useSyncExternalStore(subscribeUsageStore, getUsageStoreSnapshot, getUsageStoreSnapshot)
}

export async function startUsageSession(): Promise<void> {
  if (started) return
  started = true
  syncModuleSelection()
  emit()
  try {
    await selectSource(preference.source, ruleId ?? undefined)
  } catch {
    emit()
  }
}

export async function setUsageStoreSource(source: UsageSource): Promise<void> {
  await selectSource(source)
}

export async function setUsageStoreRule(nextRuleId: string): Promise<void> {
  await selectSource(preference.source, nextRuleId)
}

export function refreshUsageStore(): Promise<void> {
  return refreshRanking("apply")
}

export function noteUsageRankingSaved(): void {
  fetchedAt = ruleId ? loadUsageCache(preference.source, ruleId)?.fetchedAt ?? null : null
  emit()
}

export function applyUsageStorePending(): void {
  if (!pending || !ruleId) return
  saveUsageCache(preference.source, ruleId, {
    fetchedAt: pending.fetchedAt,
    fingerprint: pending.fingerprint,
    pokemonIds: pending.pokemonIds,
  })
  fetchedAt = pending.fetchedAt
  pending = null
  syncModuleSelection()
  bumpGeneration()
  emit()
}

export function resetUsageStoreForTest(): void {
  catalogs.clear()
  started = false
  preference = loadUsagePreference()
  ruleId = rememberedRuleId(preference, preference.source) ?? null
  rules = []
  pikalyticsDate = null
  fetchedAt = null
  pending = null
  refreshing = false
  generation = 0
  snapshot = makeSnapshot()
}

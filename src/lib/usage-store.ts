import { useSyncExternalStore } from "react"

import type { UsageCatalog } from "@/lib/usage-rules"

import {
  fetchUsageRanking,
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
  loadingSource: UsageSource | null
  catalogError: UsageSource | null
  fetchedAt: number | null
  pendingUpdate: boolean
  refreshing: boolean
  generation: number
}

type PendingRanking = {
  fingerprint: string
  pokemonIds: number[]
  fetchedAt: number
}

let preference = loadUsagePreference()
let ruleId: string | null = rememberedRuleId(preference, preference.source) ?? null
let catalogRules: UsageRule[] = []
let loadingSource: UsageSource | null = null
let catalogError: UsageSource | null = null
let pikalyticsDate: string | null = null
let fetchedAt: number | null = null
let pending: PendingRanking | null = null
let refreshing = false
let generation = 0
let selectionRequest = 0
let snapshot: UsageStoreSnapshot = makeSnapshot()
const listeners = new Set<() => void>()
const catalogs = new Map<UsageSource, Promise<UsageCatalog>>()
let started = false

function makeSnapshot(): UsageStoreSnapshot {
  return {
    source: preference.source,
    ruleId,
    rules: catalogRules,
    loadingSource,
    catalogError,
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
  const cached = ruleId ? loadUsageCache(preference.source, ruleId, pikalyticsDate) : null
  fetchedAt = cached?.fetchedAt ?? null
}

function bumpGeneration(): void {
  generation += 1
}

async function loadCatalog(source: UsageSource): Promise<UsageCatalog> {
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

async function fetchCatalog(source: UsageSource): Promise<UsageCatalog> {
  const path = `/api/usage/rules/${source}`
  const response = await fetch(path, { signal: AbortSignal.timeout(20_000) })
  if (!response.ok) throw new Error(`Usage catalog failed ${response.status}: ${path}`)
  const body = await response.json() as {
    defaultId?: unknown
    rules?: unknown
    date?: unknown
  }
  const parsedRules = Array.isArray(body.rules)
    ? body.rules.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return []
        const rule = entry as { id?: unknown; label?: unknown; displayName?: unknown; recommended?: unknown }
        if (typeof rule.id !== "string" || rule.id.length === 0) return []
        return [{
          id: rule.id,
          label: typeof rule.label === "string" && rule.label ? rule.label : rule.id,
          displayName: typeof rule.displayName === "string" ? rule.displayName : undefined,
          recommended: rule.recommended === true,
        }]
      })
    : []
  const defaultId = typeof body.defaultId === "string" && body.defaultId
    ? body.defaultId
    : parsedRules[0]?.id
  if (!defaultId || !parsedRules.some(rule => rule.id === defaultId)) throw new Error(`Usage catalog missing default: ${path}`)
  return {
    defaultId,
    rules: parsedRules,
    date: typeof body.date === "string" ? body.date : undefined,
  }
}

function ruleFromCatalog(catalog: UsageCatalog, source: UsageSource): string {
  const remembered = rememberedRuleId(preference, source)
  if (remembered && catalog.rules.some((rule) => rule.id === remembered)) return remembered
  return catalog.defaultId
}

async function selectSource(source: UsageSource, explicitRuleId?: string): Promise<void> {
  // Loading a catalog is async, so two rapid picks could otherwise finish out of
  // order and leave the store on whichever resolved last rather than chosen last.
  const request = ++selectionRequest
  catalogError = null
  let catalog: UsageCatalog
  if (source === preference.source && catalogRules.length > 0) {
    // A local rule change must not unmount the focused rule button for a loading state.
    catalog = { defaultId: ruleId ?? catalogRules[0].id, rules: catalogRules, date: pikalyticsDate ?? undefined }
  } else {
    loadingSource = source
    emit()
    try {
      catalog = await loadCatalog(source)
    } catch {
      if (request !== selectionRequest) return
      loadingSource = null
      catalogError = source
      emit()
      return
    }
  }
  if (request !== selectionRequest) return
  loadingSource = null
  const nextRule = explicitRuleId && catalog.rules.some(rule => rule.id === explicitRuleId)
    ? explicitRuleId : ruleFromCatalog(catalog, source)
  preference = { ...withRememberedRule(preference, source, nextRule), source }
  ruleId = nextRule
  catalogRules = catalog.rules
  pikalyticsDate = source === "pikalytics" ? catalog.date ?? null : null
  pending = null
  persist()
  syncModuleSelection()
  bumpGeneration()
  emit()
  if (peekCachedPokemonUsageIds()?.length && fetchedAt != null && usageIsStale(fetchedAt)) {
    void refreshRanking("pending").catch(() => {})
  }
}

async function refreshRanking(mode: "apply" | "pending"): Promise<void> {
  if (!ruleId) return
  // Capture the identity before awaiting. Reading it afterwards let a switch to
  // another source during the fetch write this source's ranking into the new
  // source's cache slot.
  const source = preference.source
  const rule = ruleId
  const date = pikalyticsDate
  const selection = selectionRequest
  const reload = mode === "apply"
  refreshing = true
  emit()
  try {
    const result = await fetchUsageRanking({ reload })
    if (selection !== selectionRequest) return
    const now = Date.now()
    const current = loadUsageCache(source, rule, date)
    if (mode === "pending" && current && current.fingerprint !== result.fingerprint) {
      pending = { ...result, fetchedAt: now }
    } else {
      const changed = !current || current.fingerprint !== result.fingerprint
      pending = null
      saveUsageCache(source, rule, {
        fetchedAt: now,
        fingerprint: result.fingerprint,
        pokemonIds: result.pokemonIds,
      }, date)
      fetchedAt = now
      if (changed || reload) {
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
  fetchedAt = ruleId ? loadUsageCache(preference.source, ruleId, pikalyticsDate)?.fetchedAt ?? null : null
  emit()
}

export function applyUsageStorePending(): void {
  if (!pending || !ruleId) return
  saveUsageCache(preference.source, ruleId, {
    fetchedAt: pending.fetchedAt,
    fingerprint: pending.fingerprint,
    pokemonIds: pending.pokemonIds,
  }, pikalyticsDate)
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
  catalogRules = []
  loadingSource = null
  catalogError = null
  selectionRequest += 1
  pikalyticsDate = null
  fetchedAt = null
  pending = null
  refreshing = false
  generation = 0
  snapshot = makeSnapshot()
}

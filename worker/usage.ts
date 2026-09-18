import { GENERATED_POKEMON } from "../src/lib/resources/generated/pokemon"
import { isUsageSource, nameUsageRules, selectRecommendedRules, type UsageCatalog, type UsageSource } from "../src/lib/usage-rules"
import { isUsageArtifact, isUsageBuckets, usageArtifactUrl, usageManifestUrl, type UsageManifest } from "../src/lib/champions/usage-artifact"
import {
  CHAMPIONS_INDEX_URL, battlePokemonIdsByJoinName, battleRowUsageRank, championsBattleRowsUrl,
  championsBuckets, championsIndexUsageRank, normalizeJoinName, pikalyticsBuckets,
  resolveChampionsBattlePokemonId, smogonBuckets, usageDetailSourceId,
  type ChampionsBattleApi, type ChampionsIndexApi, type PikalyticsEntry, type UsageJoinPokemon,
} from "../src/lib/champions/upstream"
import { discoverUsageCatalog, UPSTREAM_HEADERS, withEdgeCache } from "./usage-upstream"

const pokemon: UsageJoinPokemon[] = Object.values(GENERATED_POKEMON).map(entry => ({
  battlePokemonId: entry.id, speciesId: entry.speciesId, name: entry.names.en,
  pokemonSlug: entry.pokemonSlug, calcSpeciesName: entry.calcSpeciesName,
  isMega: entry.isMega, isBattleOnly: entry.isBattleOnly,
}))
const byId = new Map(pokemon.map(entry => [entry.battlePokemonId, entry]))
const byName = battlePokemonIdsByJoinName(pokemon)
function methodNotAllowed(): Response {
  return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } })
}

type Assets = Pick<Env, "ASSETS">

async function assetJson(request: Request, env: Assets, path: string): Promise<unknown> {
  const response = await env.ASSETS.fetch(new Request(new URL(path, request.url)))
  if (response.status === 404 || (response.ok && !response.headers.get("content-type")?.includes("json"))) return null
  if (!response.ok) throw new Error(`Usage asset failed: ${response.status}`)
  return response.json()
}

async function manifestFor(request: Request, env: Assets, source: UsageSource): Promise<UsageManifest | null> {
  const value = await assetJson(request, env, usageManifestUrl(source)) as UsageManifest | null
  if (!value) return null
  if (value.source !== source || typeof value.defaultId !== "string" || !Array.isArray(value.rules) ||
      !value.rules.every(r => typeof r.id === "string" && typeof r.label === "string") ||
      !Array.isArray(value.compiledRules)) throw new Error("Invalid usage manifest")
  return value
}

export async function usageRules(request: Request, env: Assets): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed()
  const source = new URL(request.url).pathname.slice("/api/usage/rules/".length)
  if (!isUsageSource(source)) return new Response("Unknown usage source", { status: 400 })
  try {
    const catalog: UsageCatalog = await manifestFor(request, env, source) ?? await discoverUsageCatalog(source)
    const recommended = selectRecommendedRules(source, catalog)
    return Response.json({
      defaultId: catalog.defaultId, date: catalog.date,
      rules: nameUsageRules(catalog.rules).map(rule => ({ ...rule, recommended: recommended.includes(rule.id) })),
    })
  } catch (error) {
    return unavailable(source, error)
  }
}

function unavailable(source: string, error: unknown): Response {
  console.error("usage_unavailable", { source, message: error instanceof Error ? error.message : String(error) })
  return Response.json({ error: "Usage data unavailable" }, { status: 502 })
}

/** Cache upstream documents across different Pokemon requests, without isolate-scoped I/O promises. */
async function upstreamJson<T>(url: string, ctx: ExecutionContext, validate: (data: T) => unknown, allowMissing = false): Promise<T | null> {
  const request = new Request(url)
  const response = await withEdgeCache(request, ctx, async () => {
    const upstream = await fetch(url, { headers: UPSTREAM_HEADERS, signal: AbortSignal.timeout(15_000) })
    if (!upstream.ok) return upstream
    const data = await upstream.json() as T
    validate(data)
    return Response.json(data)
  }, request)
  if (allowMissing && response.status === 404) return null
  if (!response.ok) throw new Error(`Usage upstream failed ${response.status}: ${url}`)
  return response.json() as Promise<T>
}

function validateChampionsDetail(battle: ChampionsBattleApi): void {
  if (!isUsageBuckets(championsBuckets(battle))) throw new Error("Invalid Champions detail")
}

async function championsIndex(ctx: ExecutionContext): Promise<ChampionsIndexApi> {
  const index = await upstreamJson<ChampionsIndexApi>(CHAMPIONS_INDEX_URL, ctx, data => {
    if (!Array.isArray(data?.pokemon)) throw new Error("Invalid Champions index")
  })
  return index!
}

async function championsRanking(rule: string, ctx: ExecutionContext): Promise<number[]> {
  const index = await championsIndex(ctx)
  const targets = index.pokemon!.flatMap(entry => {
    const id = resolveChampionsBattlePokemonId(entry, byName)
    return id === undefined ? [] : [{ id, entry, rank: championsIndexUsageRank(entry, rule) }]
  })
  if (!targets.some(entry => entry.rank !== undefined) && rule !== "Current") {
    // ponytail: an uncompiled historical season needs one read per Pokemon; recommended seasons ship snapshots.
    for (let i = 0; i < targets.length; i += 8) {
      await Promise.all(targets.slice(i, i + 8).map(async target => {
        const battle = await upstreamJson<ChampionsBattleApi>(championsBattleRowsUrl(target.entry, rule), ctx, validateChampionsDetail, true)
        target.rank = battle ? battleRowUsageRank(battle) : undefined
      }))
    }
  }
  return [...new Set(targets.filter(r => r.rank !== undefined).sort((a, b) => a.rank! - b.rank!).map(r => r.id))]
}

async function championsDetail(rule: string, ids: number[], ctx: ExecutionContext) {
  for (const id of ids) {
    const resource = byId.get(id)!
    // Champions accepts Showdown IDs directly, so single details need no index download.
    const name = normalizeJoinName(resource.calcSpeciesName || resource.name)
    const battle = await upstreamJson<ChampionsBattleApi>(championsBattleRowsUrl({ name, battleName: name }, rule), ctx, validateChampionsDetail, true)
    if (battle) return championsBuckets(battle)
  }
  return {}
}

async function pikalyticsData(rule: string, date: string, ids: number[] | null, ctx: ExecutionContext) {
  const root = `https://www.pikalytics.com/api`
  const roster = await upstreamJson<PikalyticsEntry[]>(`${root}/l/${date}/${rule}`, ctx, data => {
    if (!Array.isArray(data) || !data.every(entry => typeof entry?.name === "string")) throw new Error("Invalid Pikalytics ranking")
  })
  const ranked = roster!.toSorted((a, b) => Number(a.rank) - Number(b.rank)).flatMap(entry => {
    const id = byName.get(normalizeJoinName(entry.name))
    return id === undefined ? [] : [{ id, name: entry.name }]
  })
  if (!ids) return { pokemonIds: [...new Set(ranked.map(r => r.id))] }
  const entry = ids.map(id => ranked.find(r => r.id === id)).find(Boolean)
  if (!entry) return {}
  const detail = await upstreamJson<PikalyticsEntry>(`${root}/p/${date}/${rule}/${encodeURIComponent(entry.name)}`, ctx, data => {
    if (!isUsageBuckets(pikalyticsBuckets(data))) throw new Error("Invalid Pikalytics detail")
  })
  if (!detail) throw new Error("Missing Pikalytics response")
  return pikalyticsBuckets(detail)
}

async function smogonData(rule: string, ids: number[] | null, ctx: ExecutionContext) {
  const [month, format] = rule.split("/")
  const response = await upstreamJson<{ data: Record<string, Record<string, unknown>> }>(
    `https://www.smogon.com/stats/${month}/chaos/${format}.json`, ctx, value => {
      if (!value?.data || typeof value.data !== "object" || Array.isArray(value.data) ||
          !Object.values(value.data).every(entry => entry !== null && typeof entry === "object")) throw new Error("Invalid Smogon data")
    })
  const entries = new Map(Object.entries(response!.data).sort(([, a], [, b]) => Number(b.usage) - Number(a.usage))
    .flatMap(([name, data]) => {
      const id = byName.get(normalizeJoinName(name))
      return id === undefined ? [] : [[id, data] as const]
    }))
  if (!ids) return { pokemonIds: [...entries.keys()] }
  for (const id of ids) {
    const entry = entries.get(id)
    if (entry) return smogonBuckets(entry)
  }
  return {}
}

export async function usageData(request: Request, env: Assets, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed()
  const url = new URL(request.url)
  const match = url.pathname.match(/^\/api\/usage\/(ranking|pokemon)\/([^/]+)(?:\/(\d+))?$/)
  if (!match || !isUsageSource(match[2])) return new Response("Bad Request", { status: 400 })
  const [, kind, source, pokemonId] = match as [string, string, UsageSource, string | undefined]
  const resource = pokemonId ? byId.get(Number(pokemonId)) : undefined
  if ((kind === "pokemon" && !resource) || (kind === "ranking" && pokemonId)) return new Response("Bad Request", { status: 400 })
  const requestedRule = url.searchParams.get("rule")
  const requestedDate = url.searchParams.get("date")
  const rulePattern = source === "smogon" ? /^\d{4}-(0[1-9]|1[0-2])\/gen[a-z0-9-]+$/ : /^[a-zA-Z0-9][a-zA-Z0-9-]{0,100}$/
  if ((requestedRule !== null && !rulePattern.test(requestedRule)) ||
      (requestedDate !== null && (source !== "pikalytics" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(requestedDate)))) {
    return new Response("Bad Request", { status: 400 })
  }
  try {
    const manifest = await manifestFor(request, env, source)
    const catalog = !requestedRule || (source === "pikalytics" && !requestedDate)
      ? manifest ?? await discoverUsageCatalog(source) : null
    const rule = requestedRule ?? catalog!.defaultId
    const date = source === "pikalytics" ? requestedDate ?? catalog?.date : undefined
    if (!rulePattern.test(rule) || (source === "pikalytics" && !date)) throw new Error("Missing usage dataset identity")
    const ids = resource ? [...new Set([usageDetailSourceId(resource), resource.battlePokemonId])] : null
    if (manifest?.compiledRules.includes(rule) && (source !== "pikalytics" || date === manifest.date)) {
      const artifact = await assetJson(request, env, usageArtifactUrl(source, rule))
      if (!isUsageArtifact(artifact) || artifact.source !== source || artifact.rule !== rule) throw new Error("Invalid usage snapshot")
      if (!ids) return Response.json({ pokemonIds: artifact.ranking })
      if (artifact.pokemon) {
        return Response.json(ids.map(id => artifact.pokemon![id]).find(entry => entry !== undefined) ?? {})
      }
    }
    // Canonical parameters separate rules/months without accepting arbitrary cache fragments.
    const key = new URL(url.pathname, url.origin)
    key.searchParams.set("rule", rule)
    if (date) key.searchParams.set("date", date)
    return await withEdgeCache(request, ctx, async () => {
      let result
      if (source === "pikalytics") result = await pikalyticsData(rule, date!, ids, ctx)
      else if (source === "smogon") result = await smogonData(rule, ids, ctx)
      else if (ids) result = await championsDetail(rule, ids, ctx)
      else result = { pokemonIds: await championsRanking(rule, ctx) }
      if (ids && !isUsageBuckets(result)) throw new Error("Invalid usage detail")
      return Response.json(result)
    }, new Request(key))
  } catch (error) {
    return unavailable(source, error)
  }
}

---
# This section is managed by the CLI. Do not edit manually.
id: "83f40b08-f775-4140-b89c-0c4058962c60"
title: "Record frontend performance regressions after Champion API and full resources"
status: "open"
priority: "high"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-07-06T08:18:00Z"
updated_at: "2026-07-06T08:23:00Z"
---
<!--
This body is user-owned. Adjust the sections freely to fit the issue.
Use the CLI to update front matter fields such as title, status, priority, and labels.
-->

## Problem

The Scenario Explorer has a serious frontend load delay after the Champion API / full resource integration. The primary symptom is delayed or blank initial render while the page waits for catalog initialization.

This issue records all performance findings from the 2026-07-06 diagnosis so follow-up work can fix them deliberately.

Wayfinder map: [[20260706_open_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]].

## Issue Assessment

- Impact: high. The default Scenario Explorer page blocks on third-party network requests before rendering usable content.
- Evidence: the first-page initialization path took about 4242 ms with live Champion usage resolution, but about 15 ms when the Champion usage fetcher was replaced with an empty local function.
- Scope: frontend load latency, runtime data fetching boundary, generated resource loading, and bundle size.
- Decision: valid.

## Findings

### 1. Champion usage is fetched at runtime and blocks first render

The current first-render path is:

1. `src/components/scenario-explorer/scenario-explorer-page.tsx:135` starts `Promise.all([listAttackers, listDefenders, getCatalog])`.
2. `src/lib/catalog/registry.ts:242` waits for `resolveDefaultMoveIds`.
3. `src/lib/catalog/registry.ts:211` waits for `listChampionsMoveUsageRecords`.
4. `src/lib/champions/move-usage.ts:90` fetches `https://championsbattledata.com/api`, then fetches the per-Pokemon battle rows endpoint.

Measured API timing for the default Garchomp matchup:

```json
{
  "indexStatus": 200,
  "indexMs": 824,
  "battleStatus": 200,
  "battleMs": 2740,
  "jsonMs": 1,
  "totalMs": 3565,
  "url": "https://championsbattledata.com/api/battle/Doubles/Garchomp?season=Current",
  "moveRows": 10
}
```

This makes the first page load depend on a live third-party service and current network conditions.

### 2. Catalog initialization waits for non-critical default move picks

Champion usage only selects the default Move pick. It is not required to render the Pokemon selector, defender selector, available fixed-power moves, stat tracks, or the rest of the page shell.

Current behavior treats default move picks as blocking catalog data. If Champion rows are slow or unavailable, the whole localized state remains `null`, and `ScenarioExplorerPage` returns `null` instead of rendering a shell or local fallback.

### 3. The intended generated Champion usage boundary regressed

Prior implementation notes say Champion usage should be imported during generation and read locally at runtime. The archived implementation trace also says the generator should write `CHAMPIONS_MOVE_USAGE`.

Current code no longer does that:

- `scripts/generate-pokeapi-resources.ts:277` writes only `pokemon.ts`, `moves.ts`, `diagnostics.ts`, and `index.ts`.
- `src/lib/champions/move-usage.ts:49` defaults `usageFetcher` to `fetchChampionsMoveUsageOnline`.

Historical commit `7c0f4df` had a local `CHAMPIONS_MOVE_USAGE` export in `src/lib/resources/generated/pokeapi.ts`. Current `main` commit `4dc39c6` split generated resources into large files and reintroduced runtime Champion fetching.

### 4. Generated resources create a large first-load JavaScript payload

Production build output from `./node_modules/.bin/vite build`:

```text
dist/assets/index-Dgw_t055.js  1,375.06 kB | gzip: 315.87 kB
```

Vite warned that some chunks are larger than 500 kB.

Generated source sizes:

```text
src/lib/resources/generated/pokemon.ts      ~965 KB
src/lib/resources/generated/moves.ts        ~410 KB
src/lib/resources/generated/diagnostics.ts   ~82 KB
```

Because `src/lib/resources/access.ts` imports generated Pokemon and moves at module load, the app currently pulls full generated data into the main frontend chunk.

### 5. Full Pokemon lists are eagerly built for both attacker and defender

First render calls both `listAttackers(locale)` and `listDefenders(locale)`. Each maps and sorts the full Pokemon resource set of about 1350 entries.

The measured cost was small compared with Champion network latency in Node, but the work is duplicated and still contributes to main-thread startup in the browser. It should not be treated as the first fix, but it is a real optimization target after removing network blocking.

### 6. `pnpm build` currently hits local dependency policy friction

Running `pnpm build` through the bundled pnpm path failed before app compilation because pnpm attempted install/status checks and rejected ignored build scripts for `esbuild@0.28.1`.

Directly running `./node_modules/.bin/vite build` succeeded. This is not the user-facing performance bug, but it makes normal verification less reliable for agents and should be cleaned up separately if it keeps recurring.

## Reproduction Notes

Measured current first-page initialization:

```bash
./node_modules/.bin/tsx -e 'import { performance } from "node:perf_hooks"; import { getCatalog, getDefaultMatchupIds, getDefaultMoveCategory, listAttackers, listDefenders } from "./src/lib/catalog/index.ts"; const locale="zh-hans"; const d=getDefaultMatchupIds(); const start=performance.now(); Promise.all([listAttackers(locale), listDefenders(locale), getCatalog(d.attackerId,d.defenderId,locale,getDefaultMoveCategory(d.attackerId))]).then(([a,b,c])=>{ console.log(JSON.stringify({ms:Math.round(performance.now()-start), attackers:a.length, defenders:b.length, moves:c.moves.length, defaultMoveIds:c.defaultMoveIds}, null, 2)); });'
```

Observed:

```json
{
  "ms": 4242,
  "attackers": 1350,
  "defenders": 1350,
  "moves": 346,
  "defaultMoveIds": [337, 157, 89, 707, 398, 317]
}
```

Measured same path with Champion fetcher replaced by an empty local function:

```json
{
  "ms": 15,
  "attackers": 1350,
  "defenders": 1350,
  "moves": 346,
  "defaultMoveIds": []
}
```

## Recommended Fix Direction

1. Restore the intended boundary: fetch/import Champion usage during `generate:pokeapi`, generate a local `CHAMPIONS_MOVE_USAGE` data module, and make runtime `listChampionsMoveUsageRecords` read local data only.
2. Keep third-party network out of initial render. If live refresh is ever desired, make it explicit and non-blocking.
3. Let `ScenarioExplorerPage` render a shell or deterministic local fallback even when default move pick data is absent.
4. After the Champion network blocker is removed, split generated resource loading so the main chunk does not include all Pokemon and all moves up front.
5. Cache shared localized Pokemon option lists per locale so attacker and defender selectors do not duplicate mapping/sorting work.
6. Fix or document the `pnpm build` dependency-policy friction so standard verification works for future agents.

## Verification Checklist

- [x] Problem reproduced
- [x] Root cause identified
- [ ] Fix implemented
- [ ] Tests added or updated
- [ ] Fix verified
- [ ] No regression found

## Progress Log

- 2026-07-06: Diagnosed first-load latency. Primary blocker is runtime Champion API usage resolution; secondary issues are large main chunk from generated resources, duplicated Pokemon option work, and `pnpm build` verification friction.

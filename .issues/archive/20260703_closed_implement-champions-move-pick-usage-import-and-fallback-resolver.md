---
# This section is managed by the CLI. Do not edit manually.
id: "5e8060a4-774c-4ecc-bee1-60137ced7031"
title: "Implement Champions Move pick usage import and fallback resolver"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "WAYFINDER:CLAIMED"]
created_at: "2026-07-03T06:15:00Z"
updated_at: "2026-07-03T06:53:00Z"
---
## Parent Map
[[20260702_closed_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Related Issue
[[20260701_closed_integrate-champions-battle-move-usage-rate-data|Integrate Champions Battle move usage-rate data]] (`2e6ef737-e571-4cd3-8b98-2edd2b38a686`)

## Blocked By
- [[20260703_closed_implement-generated-pokeapi-resource-boundary|Implement generated PokeAPI resource boundary]] (`d36f73d9-c5dc-42f3-9fb3-4c356bffa83d`)

## Task
Generate Champions Doubles move usage records joined to normalized Battle Pokemon and move ids, then resolve each attacker's default **Move pick** with the top-6 policy from the closed decision ticket.

## Acceptance Notes
- The resolver uses Champions rank order after filtering to fixed-power damaging moves on the active **move side**.
- Missing or too-few Champions defaults fall back to the global fixed-power damaging move pool, sorted by power descending with deterministic tie breakers.
- Unmatched Champions Pokemon/move rows are generation diagnostics, not silent UI behavior.
- User-added moves remain visible/selected only as user overrides and are not persisted into generated usage defaults.

## Resolution
Implemented a generated Champions Doubles move usage boundary and default **Move pick** resolver.

- `scripts/generate-pokeapi-resources.ts` now reads the Champions index, imports Doubles move rows for scoped Pokemon, joins move names to PokeAPI move ids, expands generated move metadata for joined rows, and writes `CHAMPIONS_MOVE_USAGE`.
- Generated diagnostics now record the source season/format, mapped Champions Pokemon, unmatched scoped Pokemon, and unmatched move rows.
- `src/lib/resources` exposes joined usage records through `listChampionsMoveUsageRecords`.
- `src/lib/catalog/registry.ts` resolves default move picks from Champions rank order for the active move side, filters to fixed-power damaging moves, and fills missing slots from the global same-side pool with deterministic ordering.
- User-added move behavior remains unchanged: visible/selected overrides are session state and do not write back into generated defaults.

Verification:
- `pnpm generate:pokeapi`
- `pnpm test`
- `pnpm lint` (passes with existing fast-refresh warnings)
- `pnpm build`

Trace:
- [[../../docs/traces/implementations/2026-07-03-champions-move-pick-import|Implementation Trace: Champions Move Pick Import]]

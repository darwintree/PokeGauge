# Implementation Trace: Split Generated Resources Out of Initial Chunk

Date: 2026-07-06
Source: `.issues/20260706_working_split-generated-resources-out-of-the-initial-chunk.md`
Language: zh-Hans

## Entries

### 1. Lazy Generated Resource Loading With Warmed Sync Cache

Type: tradeoff

Context:
The ticket requires splitting generated resources out of the initial chunk without weakening the ADR boundary that generated PokeAPI resources remain the local damage source. The current UI calculation path is synchronous and reads generated Pokemon/move data through `getBattlePokemonByCalcName` / `getMoveByCalcName`, while catalog loading already awaits `getResource` / `listResources`.

Decision:
Convert `src/lib/resources/access.ts` from static generated imports to dynamic imports that populate module-level resource caches. Async catalog/resource APIs await those chunks; existing sync lookup APIs read the warmed caches for the already-loaded matchup calculation path.

Reason:
This removes `pokemon.ts`, `moves.ts`, and `diagnostics.ts` from the application entry chunk while keeping generated local data authoritative. It also avoids a broad async rewrite of Scenario Explorer rendering and damage calculation in this performance ticket.

Follow-up:
None.

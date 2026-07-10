---
# This section is managed by the CLI. Do not edit manually.
id: "8ee8b703-ec96-452c-995b-4bb0202f33a4"
title: "Integrate actual KO probabilities into the scenario pipeline"
status: "closed"
priority: "high"
labels: ["WAYFINDER:TASK", "FEATURE-REQUEST"]
created_at: "2026-07-10T02:36:00Z"
updated_at: "2026-07-10T05:58:00Z"
---
## Parent map

[[../20260710_open_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

Connect the tested probability core to calc-adapter and scenario-pipeline outputs without changing the existing damage-range/crit-range visualization semantics. Fixed build configurations must expose OHKO and cumulative ≤2HKO probabilities; scenarios containing Range tracks must expose endpoint probability intervals rather than averaging build uncertainty. Preserve compatibility with arbitrary N at the core boundary.

Use the compilation contract resolved by [[20260710_closed_research-champions-base-critical-hit-and-accuracy-semantics|Research Champions base critical-hit and accuracy semantics]]: ordinary Gen 9 moves use conditional critical-hit probability `1 / 24`; numeric accuracy `1..100` compiles to `accuracy / 100`; only explicitly normalized `alwaysHits` moves compile to hit probability `1`. Omit actual probability for unclassified null, zero, contradictory, guaranteed/high-crit, per-hit, or otherwise unsupported exceptional semantics rather than silently coercing them.

## Blocked by

- [[20260710_closed_implement-and-test-the-actual-damage-probability-core|Implement and test the actual-damage probability core]]
- [[20260710_closed_research-champions-base-critical-hit-and-accuracy-semantics|Research Champions base critical-hit and accuracy semantics]]

## Resolution

Scenario pipeline rows now expose `koProbabilities` with OHKO and cumulative ≤2HKO values. `rolls` mode compiles hit probability `1` and critical-hit probability `0`; `actual` mode compiles ordinary numeric accuracy as `accuracy / 100` and the conditional Gen 9 base critical-hit probability as `1 / 24`. Unsupported null/zero accuracy, multi-hit metadata, and elevated/guaranteed critical-hit metadata retain their scenario rows but omit `koProbabilities`.

Fixed configurations expose scalar probabilities. A single Range track exposes an ordered range from its two endpoints. When both offense and defense Range tracks are active, the range uses only the two opposite endpoints explicitly confirmed by the user: minimum offense × maximum defense, and maximum offense × minimum defense. Existing damage-range, crit-range, and prototype `ohkoChance` behavior remains unchanged for the following UI ticket to replace.

The adapter reuses the opaque ADD/CDD core and keeps arbitrary positive N at that core boundary; this integration materializes only OHKO and cumulative ≤2HKO for the first UI rollout. PokeAPI generation now preserves `min_hits`, `max_hits`, and positive `crit_rate` metadata needed to exclude unsupported exceptional semantics.

Verification: `pnpm test` (75 tests), `pnpm build`, and `pnpm lint` (existing warnings only).

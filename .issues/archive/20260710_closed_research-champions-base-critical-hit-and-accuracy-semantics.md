---
# This section is managed by the CLI. Do not edit manually.
id: "3c6aca81-d861-47fc-97f9-1ad5b8f5882d"
title: "Research Champions base critical-hit and accuracy semantics"
status: "closed"
priority: "high"
labels: ["WAYFINDER:RESEARCH", "FEATURE-REQUEST"]
created_at: "2026-07-10T02:36:00Z"
updated_at: "2026-07-10T04:58:00Z"
---
## Parent map

[[20260710_closed_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

What unmodified base critical-hit probability applies to the current Pokémon Champions ruleset, and how should fixed-power damaging moves with numeric, null, or exceptional accuracy metadata be compiled for the first actual-damage-distribution implementation? Use high-trust primary sources where available, distinguish confirmed Champions behavior from inherited-series assumptions, and produce a linked Markdown research summary.

## Resolution

Research summary: [[../../docs/research/2026-07-10-champions-gen9-critical-hit-and-accuracy-semantics|Champions / Gen 9 Critical-Hit and Accuracy Semantics]].

Per the product decision made during this ticket, the current Champions adapter aligns these mechanics with Generation 9 rather than claiming a separately confirmed Champions-specific probability. For an ordinary move, compile base critical-hit probability as `1 / 24`, conditional on a hit. Compile ordinary numeric accuracy in `1..100` as `accuracy / 100` in the neutral context.

PokeAPI `accuracy: null` is not by itself a sufficient always-hit contract. The resource adapter may compile a null-backed move to hit probability `1` only after normalized semantics or a reviewed allowlist classifies it as `alwaysHits`; an unclassified null is unsupported. Zero, out-of-range, or contradictory metadata must likewise be rejected rather than silently coerced. Guaranteed-crit, elevated-crit, per-hit accuracy, and other exceptional move behavior requires explicit normalization or exclusion before actual probability is exposed.

The probability core remains unchanged: it receives only resolved hit probability and conditional critical-hit probability. Resource identity, PokeAPI nullability, and move eligibility stay in the adapter boundary.

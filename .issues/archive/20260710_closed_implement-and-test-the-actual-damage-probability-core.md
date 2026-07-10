---
# This section is managed by the CLI. Do not edit manually.
id: "c31527b1-55af-4367-93a9-2d622d4b2d4f"
title: "Implement and test the actual-damage probability core"
status: "closed"
priority: "high"
labels: ["WAYFINDER:TASK", "FEATURE-REQUEST"]
created_at: "2026-07-10T02:36:00Z"
updated_at: "2026-07-10T03:57:00Z"
---
## Parent map

[[../20260710_open_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

Implement and test the agreed pure-function core from [[20260710_closed_decide-the-stable-actual-damage-probability-module-contract|Decide the stable actual-damage probability module contract]]. Add an independent generic sparse convolution module and an opaque damage-distribution module exposing ADD construction from compiled hit probability, conditional crit probability, and normal/critical rolls; array-based CDD convolution for arbitrary positive N; and scalar KO probability queries. Verify probability mass with floating tolerance, duplicate and zero-damage aggregation, OHKO, 2HKO, and 3HKO behavior. Do not add runtime validation, a third-party math dependency, Range-track helpers, resource/UI knowledge, or performance optimization.

## Resolution

Implemented the dependency-free probability core in `src/lib/convolution/` and `src/lib/damage-distribution/`. The generic sparse convolution aggregates equal sums; the damage module keeps its probability map opaque while exposing the agreed ADD construction, array-based CDD convolution, and scalar KO query.

Tests cover floating-point probability mass, duplicate sums, zero-damage aggregation with misses, conditional critical-hit weighting, and cumulative OHKO/2HKO/3HKO behavior. Full verification passed: 13 test files / 71 tests, lint with only pre-existing warnings, and production build.

One unstated public-surface choice is recorded in [[../../docs/traces/implementations/2026-07-10-actual-damage-probability-core|Implementation Trace: Actual damage probability core]].

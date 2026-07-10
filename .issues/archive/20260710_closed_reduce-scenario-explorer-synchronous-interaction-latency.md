---
# This section is managed by the CLI. Do not edit manually.
id: "afa0eeb2-c0bf-4a58-ba86-ca813fa8cf4b"
title: "Reduce Scenario Explorer synchronous interaction latency"
status: "closed"
priority: "high"
labels: ["TECH-DEBT"]
created_at: "2026-07-10T06:51:00Z"
updated_at: "2026-07-10T07:02:00Z"
---
# Summary

Reduce the synchronous delay between Scenario Explorer interactions and the first visible result update. The baseline measurements and bottleneck decomposition are recorded in [[20260710_closed_record-scenario-explorer-interaction-latency-and-bottleneck-measurements]].

# Agreed approach

1. Replace repeated generated-resource scans by calc name with stable indexes.
2. Reuse stable offense and defense allocation results across damage calculation and result-label generation.
3. Re-measure the production build using the existing opt-in interaction monitor.
4. Only if the measured result remains materially delayed, separate calculation dependencies from display-only state and re-measure.

# Acceptance

- Damage, probability, allocation, and label outputs remain unchanged.
- Existing automated tests pass.
- Production-browser measurements cover the original 12-row scenario and a 24-row scenario.
- Record before/after interaction and pipeline measurements in this issue.
- Do not add a worker, virtualization, or a general-purpose caching dependency unless the preceding changes fail to address the measured bottleneck.

# Progress

- [x] Generated-resource lookup index
- [x] Stable allocation reuse
- [x] Focused and full automated validation
- [x] Production-browser re-measurement
- [x] Resolution evidence

# Resolution

Generated Pokémon and move resources now build calc-name indexes when they load, replacing repeated full-resource scans. Offense and defense allocation enumeration now reuses results for the same species, move category, target values, and naming strategy. The shared allocation reuse applies to both damage setup resolution and result-label generation.

The production-browser re-measurement used the same default Garchomp → Incineroar physical matchup and the same opt-in interaction monitor as the baseline. Each interaction was toggled repeatedly after the initial results had settled.

| Interaction | Baseline first visible frame | After | After pipeline work |
| --- | ---: | ---: | ---: |
| Actual probability ↔ 16 roll, 12 rows | 1.10–1.18 s | 5.1–7.9 ms | 0.5–1.4 ms |
| Select / deselect one move, 10 ↔ 12 rows | 0.94–1.11 s | 5.1–6.8 ms | 0.4–0.6 ms |
| Toggle result actual-stat display, 12 rows | 1.07–1.15 s | 5.8–7.3 ms | 0.5–0.6 ms |
| Select / deselect the 0A offense template, 12 ↔ 18 rows | 1.07–1.62 s | 5.1–11.2 ms | 0.5–1.3 ms |
| Select / deselect Life Orb, 12 ↔ 24 rows | 1.05–2.00 s | 6.1–13.0 ms | 0.5–1.8 ms |

All 13 test files and 78 tests pass. Lint passes with pre-existing warnings, the production build succeeds, the Scenario Explorer performance budget check passes, and `git diff --check` reports no whitespace errors.

The measured result met the stopping condition, so calculation/display state partitioning, workers, virtualization, and broader result caching were not implemented.

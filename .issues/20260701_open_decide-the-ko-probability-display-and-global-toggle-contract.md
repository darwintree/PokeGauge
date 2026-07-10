---
# This section is managed by the CLI. Do not edit manually.
id: "3dc80d14-8027-445a-8f97-19495f152ecf"
title: "Decide the KO probability display and global toggle contract"
status: "open"
priority: "high"
labels: ["WAYFINDER:GRILLING", "FEATURE-REQUEST"]
created_at: "2026-07-01T02:47:00Z"
updated_at: "2026-07-10T02:38:00Z"
---
## Parent map

[[20260710_open_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

How should Scenario Explorer evolve the current prototype KO display around one global, default-off actual-probability Button? Decide the Button placement and wording, how fixed OHKO and cumulative ≤2HKO probabilities are presented, how Range-track endpoint probability intervals are presented, and what changes when the Button is on versus off. The damage-range and crit-range plot semantics must remain unchanged, and 3HKO or higher is not shown in this iteration.

## Starting evidence

- Current `ohkoChance` in `src/lib/calc-adapter/compute-damage.ts` only counts normal 16 rolls that reach defender HP.
- [[archive/20260626_closed_damage-comparison-results-info-display-needs-refinement|Results info display]] introduced the current “crit-only OHKO” label as a prototype fallback.

---
# This section is managed by the CLI. Do not edit manually.
id: "8ee8b703-ec96-452c-995b-4bb0202f33a4"
title: "Integrate actual KO probabilities into the scenario pipeline"
status: "open"
priority: "high"
labels: ["WAYFINDER:TASK", "FEATURE-REQUEST"]
created_at: "2026-07-10T02:36:00Z"
updated_at: "2026-07-10T03:53:00Z"
---
## Parent map

[[20260710_open_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

Connect the tested probability core to calc-adapter and scenario-pipeline outputs without changing the existing damage-range/crit-range visualization semantics. Fixed build configurations must expose OHKO and cumulative ≤2HKO probabilities; scenarios containing Range tracks must expose endpoint probability intervals rather than averaging build uncertainty. Preserve compatibility with arbitrary N at the core boundary.

## Blocked by

- [[archive/20260710_closed_implement-and-test-the-actual-damage-probability-core|Implement and test the actual-damage probability core]]
- [[20260710_open_research-champions-base-critical-hit-and-accuracy-semantics|Research Champions base critical-hit and accuracy semantics]]

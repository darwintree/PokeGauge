---
# This section is managed by the CLI. Do not edit manually.
id: "fee574e6-ebc8-417d-b117-fff3783f4b31"
title: "Ship the global actual-probability toggle and KO display"
status: "open"
priority: "high"
labels: ["WAYFINDER:TASK", "FEATURE-REQUEST"]
created_at: "2026-07-10T02:36:00Z"
updated_at: "2026-07-10T02:38:00Z"
---
## Parent map

[[20260710_open_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

Implement the agreed global, default-off actual-probability Button and KO probability presentation in Scenario Explorer. Toggling on must incorporate base move accuracy and base crit; toggling off must compile accuracy to 100% and crit to 0%. Show OHKO and cumulative ≤2HKO only, handle fixed probabilities and Range-track probability intervals, leave the damage plot semantics unchanged, and add proportionate UI/pipeline verification.

## Blocked by

- [[20260710_open_integrate-actual-ko-probabilities-into-the-scenario-pipeline|Integrate actual KO probabilities into the scenario pipeline]]
- [[20260701_open_decide-the-ko-probability-display-and-global-toggle-contract|Decide the KO probability display and global toggle contract]]

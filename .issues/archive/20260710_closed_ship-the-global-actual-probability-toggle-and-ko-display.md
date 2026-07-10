---
# This section is managed by the CLI. Do not edit manually.
id: "fee574e6-ebc8-417d-b117-fff3783f4b31"
title: "Ship the global actual-probability toggle and KO display"
status: "closed"
priority: "high"
labels: ["WAYFINDER:TASK", "FEATURE-REQUEST"]
created_at: "2026-07-10T02:36:00Z"
updated_at: "2026-07-10T06:07:00Z"
---
## Parent map

[[20260710_closed_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

Implement the agreed global, default-off actual-probability Button and KO probability presentation in Scenario Explorer. Toggling on must incorporate base move accuracy and base crit; toggling off must compile accuracy to 100% and crit to 0%. Show OHKO and cumulative ≤2HKO only, handle fixed probabilities and Range-track probability intervals, leave the damage plot semantics unchanged, and add proportionate UI/pipeline verification.

## Blocked by

- [[20260710_closed_integrate-actual-ko-probabilities-into-the-scenario-pipeline|Integrate actual KO probabilities into the scenario pipeline]]
- [[20260701_closed_decide-the-ko-probability-display-and-global-toggle-contract|Decide the KO probability display and global toggle contract]]

## Resolution

Scenario Explorer now ships the agreed global KO-probability control and row presentation:

- A segmented `16 roll` / `Actual probability` control sits above the results beside the existing actual-stat display control. `16 roll` remains the default.
- The control updates the existing pipeline `probabilityMode`, so baseline mode uses guaranteed hit/no crit while actual mode includes supported move accuracy and base critical-hit probability.
- Every result row has aligned `OHKO` and `≤2HKO` columns. Fixed configurations show one percentage, Range tracks show the ordered endpoint range, explicit zero renders as `0%`, and unsupported actual semantics render a localized unavailable state without removing the row.
- The old inline normal-roll/critical-only OHKO fallback was removed; the damage box, average marker, crit whiskers, and damage-axis semantics remain unchanged.
- Probability labels and modes are localized for all supported locales.

Verification completed on 2026-07-10:

- `pnpm test`: 13 files and 77 tests passed, including fixed/zero/range presentation coverage and the existing rolls/actual pipeline cases.
- `pnpm build`: passed; the existing large-chunk warning remains.
- `pnpm lint`: passed with only pre-existing Fast Refresh and vendored PokeAPI warnings.
- Local browser verification confirmed column alignment, default selection, actual-mode value changes, and no runtime console errors.

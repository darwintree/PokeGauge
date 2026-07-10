---
# This section is managed by the CLI. Do not edit manually.
id: "3dc80d14-8027-445a-8f97-19495f152ecf"
title: "Decide the KO probability display and global toggle contract"
status: "closed"
priority: "high"
labels: ["WAYFINDER:PROTOTYPE", "FEATURE-REQUEST"]
created_at: "2026-07-01T02:47:00Z"
updated_at: "2026-07-10T05:43:00Z"
---
## Parent map

[[../20260710_open_wayfinder-actual-damage-distribution-and-ko-probability-rollout|Wayfinder: Actual damage distribution and KO probability rollout]]

## Question

How should Scenario Explorer evolve the current prototype KO display around one global, default-off actual-probability Button? Decide the Button placement and wording, how fixed OHKO and cumulative ≤2HKO probabilities are presented, how Range-track endpoint probability intervals are presented, and what changes when the Button is on versus off. The damage-range and crit-range plot semantics must remain unchanged, and 3HKO or higher is not shown in this iteration.

## Starting evidence

- Current `ohkoChance` in `src/lib/calc-adapter/compute-damage.ts` only counts normal 16 rolls that reach defender HP.
- [[20260626_closed_damage-comparison-results-info-display-needs-refinement|Results info display]] introduced the current “crit-only OHKO” label as a prototype fallback.

## Resolution

Use the selected prototype B, **Independent probability columns**:

- Place a global segmented Button at the top of the results area, beside the existing result display controls. Its two choices are `16 roll` and `Actual probability`; `16 roll` is selected by default.
- Keep the damage-range and critical-range plot unchanged. Add a dedicated probability area to the right of every result row with stable `OHKO` and `≤2HKO` columns, so values align vertically and remain scannable across scenarios.
- A fixed build configuration shows one percentage in each column. A scenario containing a Range track shows the ordered endpoint probability range in the same column, formatted `min–max`; the range is not averaged.
- In `16 roll` mode, probabilities use 100% hit probability and 0% critical-hit probability. In `Actual probability` mode, they include supported move accuracy, the Gen 9 base critical-hit probability, and both normal and critical 16-roll distributions.
- If actual probability semantics are unsupported for a move, retain the row and plot but show an unavailable state in its probability area rather than substituting a value. Switching back to `16 roll` restores the baseline probabilities.
- Always render both probability columns, including explicit `0%`, rather than using absence as zero. Remove the prototype “critical-only OHKO” fallback once these columns ship.

The throwaway A/B/C prototype was deleted after this decision; production implementation remains in its separately tracked work.

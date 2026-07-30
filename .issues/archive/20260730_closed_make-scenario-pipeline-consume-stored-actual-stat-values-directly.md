---
# This section is managed by the CLI. Do not edit manually.
id: "34f96601-d945-403c-a8eb-d9be4cb1634c"
title: "Make scenario pipeline consume stored actual stat values directly"
status: "closed"
priority: "high"
labels: ["TECH-DEBT", "NEEDS-TRIAGE"]
created_at: "2026-07-30T04:32:00Z"
updated_at: "2026-07-30T04:46:00Z"
---
<!--
This body is user-owned. Adjust the sections freely to fit the issue.
Use the CLI to update front matter fields such as title, status, priority, and labels.
-->

## Problem

The domain contract makes final actual stat values first-class:

- A Stat value template stores only the final actual value: one offense stat, or defender HP + defense.
- Nature and EV allocation are derived display metadata.
- Cycling between allocations changes only the label, never the persisted template, row product, or damage.

The current scenario pipeline violates that contract. It reverse-maps stored or selected actual values to a nature/EV setup, then the compiler recalculates stats from that setup. Range endpoints are likewise converted to the closest reachable setup.

For reachable values this usually round-trips to the same number and hides the problem. For an unreachable value, the pipeline calculates a different value: a range endpoint expands to adjacent reachable values, while an off-grid template may fall back to a default setup.

## Expected behavior

- Scenario calculation consumes the exact actual offense stat, defender HP, and defender defense selected by the user or stored in a template.
- Nature/EV enumeration is used only to derive SP labels and allocation choices.
- Reachability does not affect whether an integer actual stat can be calculated.
- Existing reachable presets produce unchanged damage results.

## Acceptance criteria

- [x] Preset-mode offense templates calculate with their stored offense value.
- [x] Preset-mode defense templates calculate with their stored HP and defense values.
- [x] Range-mode endpoints calculate with the exact selected endpoint values.
- [x] An unreachable offense value such as 186 reaches the damage formula as 186 without snapping or fallback.
- [x] Unreachable defense values likewise reach the formula unchanged.
- [x] Changing the visible SP allocation does not change calculation identity or damage.
- [x] Tests cover exact-value propagation for both offense and defense plus regression coverage for reachable presets.

## Related

- [[20260629_closed_retain-actual-stat-values-without-matching-sp-allocations|Skip unreachable stat values on offense/defense axes]]
- [[docs/traces/2026-06-28-stat-value-template-grill|Stat value template decisions]]
- [[docs/domain/stat-value-template-display-labels|Stat value template display labels]]

## Out of scope

- Whether the axes should offer unreachable values.
- The final label or tooltip copy for values with no matching nature/EV allocation.

## Issue Assessment

- Impact: Current calculations can silently disagree with the actual value shown or persisted.
- Evidence: The pipeline resolves templates and ranges to StatSetup/DefenderSetup, and the compiler derives stats from those setups.
- Scope: Replace the setup-dependent calculation path with exact actual-value propagation; keep setup enumeration in the label subsystem.
- Decision: valid

## Verification Checklist

- [x] Problem reproduced
- [x] Root cause identified
- [x] Fix implemented
- [x] Tests added or updated
- [x] Fix verified
- [x] No regression found

## Progress Log

- 2026-07-30: Confirmed the documented actual-value-first contract and isolated the setup-dependent pipeline implementation.
- 2026-07-30: Changed the scenario pipeline and compiler boundary to carry final offense, HP, and defense values directly; removed the obsolete setup fallback and Range corner conversion paths.
- 2026-07-30: Added off-grid Preset and Range propagation tests, allocation-cycle invariance coverage, and a reachable-system-preset regression.
- 2026-07-30: Verified 245 tests, lint, and the production build.

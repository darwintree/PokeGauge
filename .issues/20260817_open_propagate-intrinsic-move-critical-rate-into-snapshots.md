---
# This section is managed by the CLI. Do not edit manually.
id: "cd9380cb-3268-41f0-bcf7-5e3997768c1d"
title: "Propagate intrinsic Move critical rate into snapshots"
status: "open"
priority: "high"
labels: ["BUG", "NEEDS-TRIAGE"]
created_at: "2026-08-17T15:00:00Z"
updated_at: "2026-08-20T08:30:00Z"
---
## Problem

Generated Move resources retain `critRate`, but the localized catalog boundary and Move Snapshot creation do not consume it. High-critical-rate Moves therefore use the normal critical rate in Battle Odds unless covered by a handwritten reviewed default.

## Scope

- Carry intrinsic Move critical rate from generated resources into Move Template and new/reset Move Snapshot defaults.
- Preserve the existing rule that a user edit fully overrides the template default.
- Verify representative boosted-critical and guaranteed-critical Moves in Battle Odds.
- Audit persistence/share restoration so saved explicit Snapshot values remain authoritative.

## Out of scope

- Semi-supported Scenario warnings.
- Multi-hit composition or other Move mechanics.

## Evidence

The current candidate pool contains 25 Moves with generated `critRate > 0` and no reviewed Snapshot override. The resource field is dropped before Snapshot creation.

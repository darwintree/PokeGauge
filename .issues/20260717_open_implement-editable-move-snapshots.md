---
# This section is managed by the CLI. Do not edit manually.
id: "209178b6-fbf1-4431-9364-54cdf15e8610"
title: "Implement editable Move snapshots"
status: "open"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T03:51:00Z"
---
## Parent

[[archive/20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Make the Move Track operate on independent editable Move snapshots created from immutable Move templates. Users can keep duplicate snapshots of one template, edit their calculation fields, and see results update without changing the global template or another snapshot.

## Acceptance criteria

- [ ] Each snapshot has stable identity and independently stores power, accuracy, critical stage, and eligible spread state; multiple snapshots from one template never merge.
- [ ] Power is normalized to an integer from 0 through 1000, where blank or 0 is unconfigured, negatives become 0, decimals truncate, and larger values clamp to 1000.
- [ ] Template accuracy and always-hit semantics initialize the snapshot; a manual accuracy edit replaces them, while accuracy 0 remains unconfigured for actual-probability results.
- [ ] Critical stages +0 through +2 compile normal and critical branches, +3 compiles only the critical branch, and rolls versus actual probability uses the specified hit and critical probabilities.
- [ ] Only eligible spread moves expose the spread control, which defaults on in the current VGC doubles context and immediately changes the result.
- [ ] Changing defender preserves snapshots; changing attacker or Move side rebuilds them. Removing one snapshot does not affect its siblings.
- [ ] The Move candidate pool remains global and Snapshot-capable: current-attacker Champions usage moves are ordered first within the Move side, the remaining pool keeps its existing order, and missing usage falls back to the global order without legality validation.
- [ ] An unconfigured snapshot remains visible, produces no result rows, and shows its missing field only in the Move Track.

## Blocked by

- [[20260717_open_replace-positional-damage-paths-with-compiled-fixed-point-calculation|Replace positional damage paths with compiled fixed-point calculation]]

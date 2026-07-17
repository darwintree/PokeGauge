---
# This section is managed by the CLI. Do not edit manually.
id: "99fc21b9-7911-445e-aea2-dcbb497b346e"
title: "Merge effect-equivalent Scenarios with provenance"
status: "open"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T03:51:00Z"
---
## Parent

[[20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Merge raw Scenario combinations that compile to the same calculation within one Move snapshot, while retaining enough source state to explain which Track choices were effective, inactive, unsupported, or neutral.

## Acceptance criteria

- [ ] The pipeline expands raw products, compiles them, merges calculable outcomes by calculation identity, calls the kernel once per identity, and only then builds damage distributions and result rows.
- [ ] Calculation identity contains snapshot identity plus all compiled damage, branch, probability, KO, HP, and actual Range endpoint inputs; it excludes labels, raw option IDs, provenance, and final display numbers.
- [ ] Different Move snapshots never merge, and coincidentally equal rounded damage does not establish equivalence.
- [ ] Merged provenance stores option sets per Track in effective, inactive, unsupported, and neutral states without retaining every raw combination.
- [ ] Effective sources appear on the main row; neutral choices have no extra badge; explicit no-item and other omitted neutral defaults are not shown in results.
- [ ] Unavailable outcomes are grouped once per Move snapshot before kernel execution and are not represented as exceptions or zero-damage rows.
- [ ] Existing matching and non-matching held-item combinations demonstrate the required 12-to-6 merge while retaining inspectable source choices.
- [ ] Result groups follow Move snapshot creation order; internal row ordering remains implementation-flexible.

## Blocked by

- [[20260717_open_implement-editable-move-snapshots|Implement editable Move snapshots]]

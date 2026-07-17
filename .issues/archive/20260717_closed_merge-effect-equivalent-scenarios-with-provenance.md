---
# This section is managed by the CLI. Do not edit manually.
id: "99fc21b9-7911-445e-aea2-dcbb497b346e"
title: "Merge effect-equivalent Scenarios with provenance"
status: "closed"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T06:09:00Z"
---
## Parent

[[../20260715_open_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Merge raw Scenario combinations that compile to the same calculation within one Move snapshot, while retaining enough source state to explain which Track choices were effective, inactive, unsupported, or neutral.

## Acceptance criteria

- [x] The pipeline expands raw products, compiles them, merges calculable outcomes by calculation identity, calls the kernel once per identity, and only then builds damage distributions and result rows.
- [x] Calculation identity contains snapshot identity plus all compiled damage, branch, probability, KO, HP, and actual Range endpoint inputs; it excludes labels, raw option IDs, provenance, and final display numbers.
- [x] Different Move snapshots never merge, and coincidentally equal rounded damage does not establish equivalence.
- [x] Merged provenance stores option sets per Track in effective, inactive, unsupported, and neutral states without retaining every raw combination.
- [x] Effective sources appear on the main row; neutral choices have no extra badge; explicit no-item and other omitted neutral defaults are not shown in results.
- [x] Unavailable outcomes are grouped once per Move snapshot before kernel execution and are not represented as exceptions or zero-damage rows.
- [x] Existing matching and non-matching held-item combinations demonstrate the required 12-to-6 merge while retaining inspectable source choices.
- [x] Result groups follow Move snapshot creation order; internal row ordering remains implementation-flexible.

## Blocked by

- [[20260717_closed_implement-editable-move-snapshots|Implement editable Move snapshots]]

## Resolution

The scenario pipeline now expands and compiles every raw combination before grouping calculable outcomes by a snapshot-scoped serialization of the complete calculation, probability, and KO inputs. Each unique identity invokes the damage kernel and distribution summarizer once; unavailable combinations are instead aggregated once per snapshot with missing fields, stable reasons, and four-state per-Track provenance. Result rows preserve snapshot creation order, show effective held-item sources, omit neutral no-item defaults, and fold inactive or unsupported choices. Regression coverage proves exact-input identity, duplicate-snapshot isolation, coincidentally equal-roll separation, pre-kernel unavailability, and the required 12-to-6 held-item matrix.

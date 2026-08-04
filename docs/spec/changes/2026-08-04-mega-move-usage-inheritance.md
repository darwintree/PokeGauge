---
status: accepted
date: 2026-08-04
---

# Mega Move Usage Inheritance Spec Change

## Discussion Trace

- docs/traces/discussion/2026-08-04-mega-move-usage-inheritance.md

## Target Specs

- docs/spec/move-pick.md

## Problem

The Move Pick spec does not state how Champions usage applies to Mega Battle Pokémon Identities. Upstream Champions data reports usage per base Pokémon form and has no Mega-specific battle rows, so Mega identities currently resolve to no usage. The contract must define that Mega identities inherit their base species' usage rows and that inherited usage follows the same Move Pick rules.

## Contract Delta

### Added

- A Mega Battle Pokémon Identity whose species has an upstream Champions entry receives that species' usage rows as its own usage rows.
- Inherited usage rows follow the same ordering, top-10 pool boundary, default-selection, and snapshot-creation semantics as native rows.
- Each usage row records its Champions season, source path, and upstream data version.
- A Mega identity whose species has no upstream Champions entry has no usage rows and follows the existing missing-data behavior.

### Changed

- Champions usage rows resolve the active season from the Champions index `defaultSeason` rather than from per-Pokémon daily snapshot entries.

### Removed

None.

## Non-Goals

- No Mega Stone usage gating, weighting, or set-level inference.
- No second usage data source for species absent from the upstream index.
- No nature usage or stat-points usage contract.
- No source-form provenance marker in the record contract or UI.

## Compatibility

Non-Mega identities and existing missing-data behavior are unchanged. Mega identities that previously had no usage gain inherited usage when their species is present upstream.

## Acceptance Criteria

- Every Mega identity with an upstream base species entry exposes the same ordered usage rows as that species.
- Mega identities without an upstream base species entry produce no usage rows.
- Inherited usage follows the same top-10 boundary, selection rules, and ordering as native usage.
- Usage rows carry Champions season, source, and data version.
- Missing or failed usage data produces no initial Move snapshots and keeps manual Move selection available.

## Resolution

Accepted. The final contract is reflected in `docs/spec/move-pick.md`.

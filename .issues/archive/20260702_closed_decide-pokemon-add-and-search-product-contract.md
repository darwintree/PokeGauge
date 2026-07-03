---
# This section is managed by the CLI. Do not edit manually.
id: "ef3379af-5480-4900-bc9a-4738ca7b3a3e"
title: "Decide Pokemon add and search product contract"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-02T09:41:00Z"
updated_at: "2026-07-03T05:53:00Z"
---
## Parent Map
[[../20260702_open_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Question
What is the product contract for adding/searching Pokemon in a matchup: which identities are selectable, how type filtering combines with localized keyword search, and how form-level battle distinctions are presented without exposing upstream implementation details?

## Context
Use `/grilling` and `/domain-modeling`. Anchor terminology in `CONTEXT.md`, especially **Battle Pokemon identity**, **Type**, and **Supported locale**.

This ticket should decide behavior, not data-fetch implementation.

## Resolution
Pokemon add/search selects **Battle Pokemon identity** records directly. If a form changes battle stats or typing, it appears as its own selectable identity with a localized user-facing name and type badges. Species-level rows appear only when the species itself is a valid battle identity. Cosmetic forms or other upstream distinctions that do not change battle stats or typing are not part of the first selectable pool.

Type filtering and keyword search combine with AND semantics. Type filters narrow the candidate list first; keyword search runs within that narrowed list. Multiple selected types mean the identity has all selected types, so Fire + Flying finds dual-type identities rather than any Fire or any Flying identity.

Search is a product-level broad recall capability, not an upstream-id lookup. The current minimum implementation only needs to match the current **Supported locale** localized display name, but the contract leaves room for later aliases, English names, common slang, and other query expansions behind the same search module.

The selector exposes localized battle identity names and type badges, not PokeAPI concepts such as species/form/version-group. Implementation may derive display names from PokeAPI form names where that produces the right localized battle identity label, but that upstream source is not part of the product contract.

The Pokemon selection pool may be filtered by the current **Ruleset**. For the current product context, attacker and defender use the same ruleset-filtered Battle Pokemon identity pool, and the same identity may be selected on both sides of a matchup. Missing move usage data should be handled as a move-pick fallback later, not by silently removing the identity from the Pokemon selector.

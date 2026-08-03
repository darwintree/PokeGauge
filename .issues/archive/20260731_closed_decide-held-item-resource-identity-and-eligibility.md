---
# This section is managed by the CLI. Do not edit manually.
id: "dd0d9ddb-4158-41f0-b8d3-dde1564ede5e"
title: "Decide held-item resource identity and eligibility"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T10:16:00Z"
---
## Question

What is the product contract for canonical Held item identity, localized labels/sprites, candidate eligibility, M-B versus explicitly approved outside-M-B items, attacker/defender availability, invalid restored selections, and explicit no-item within the frozen scope?

The answer must keep usage-driven default selection and ordering out of scope.

## Parent map

[[20260731_closed_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Blocked by

- [[20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]
- [[20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]]

## Resolution

The held-item effect scope is a frozen 85-item whitelist: the researched 88 candidates minus Adamant Crystal, Lustrous Globe, and Griseous Core. Their supported damage behavior duplicates the retained Adamant Orb, Lustrous Orb, and Griseous Orb, while their distinct form behavior is out of scope. The resulting split is 44 M-B proxy items and 41 explicitly approved outside-M-B items; whitelist members receive identical candidate treatment, and items outside the whitelist receive no new effect, compatibility, or warning semantics.

Every real whitelist item uses its PokeAPI numeric id as the persisted identity. Showdown slugs are mechanics joins only; Leek maps explicitly to PokeAPI id 236 (`stick`). `none` remains the application-owned explicit no-item sentinel. Existing Mega Stone and Unknown Mega Stone locking remains unchanged outside the effect whitelist.

Localized labels come from PokeAPI in the requested supported locale, falling back to English with a resource diagnostic when that locale is absent; there is no handwritten translation table. All 85 whitelist sprites come from the pinned PokeAPI sprites repository and are vendored locally, resolving both flat default paths and generation-specific `gen8/` and `gen9/` paths. Runtime hotlinking to mutable `master` is excluded.

Attacker and defender candidate pools are statically separated by supported effect direction. Candidate visibility does not change merely because the current move, type, or Battle Pokémon identity fails an activation predicate. Unlocked Tracks always offer `none`, permit it alongside real items for Scenario comparison, and restore it when the last selection is removed. A Mega-locked Track offers only its Mega Stone or Unknown Mega Stone and rejects `none`.

Legacy synthetic item ids, ids outside the whitelist, and ids restored on the wrong side are not migrated. A saved Scenario containing one is rejected as a whole and returns to the matchup home; unknown entries in the old added-type-boost visibility store are filtered. Valid existing Mega Stone locks remain restorable. Usage-driven defaults and ordering remain out of scope.

Supporting records:

- [[../../docs/traces/discussion/2026-07-31-held-item-resource-identity-and-eligibility|Held-item resource identity and eligibility discussion trace]]
- [[../../docs/research/2026-07-31-pokeapi-held-item-sprite-coverage|PokeAPI held-item sprite coverage]]
- [[../../docs/research/2026-07-31-frozen-held-item-mechanics-matrix|Frozen held-item mechanics matrix]]

## Acceptance handoff

- [ ] Before implementation is considered complete, audit every decision in the linked discussion trace line by line against the delivered behavior.

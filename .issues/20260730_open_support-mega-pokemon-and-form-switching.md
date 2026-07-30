---
# This section is managed by the CLI. Do not edit manually.
id: "19742c17-e2c4-4d1c-bcb0-a519a19be0e2"
title: "Support Mega Pokémon and form switching"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-30T09:53:00Z"
updated_at: "2026-07-30T10:46:00Z"
---
<!--
This body is user-owned. Adjust the sections freely to fit the issue.
Use the CLI to update front matter fields such as title, status, priority, and labels.
-->

## Problem

The calculator treats Pokémon forms as separate selections and does not provide
an efficient Mega workflow. Users must be able to discover Mega-capable Pokémon,
switch to the relevant form, and receive the form's required battle setup
without manually reconstructing it.

## Discussion trace

[Mega Pokémon and form switching discussion](../docs/traces/discussion/2026-07-30-mega-pokemon-and-form-switching.md)

## Blocked by

- [[20260730_open_add-defender-held-item-track|Add defender held-item track]]

## Identity rules

- PokeAPI is the source of truth for Pokémon and form classification.
- A default PokémonForm with `is_mega = true` is a Mega identity.
- A non-Mega identity with `is_battle_only = false` is a directly selectable
  non-Mega form.
- Every selectable form is a distinct Battle Pokémon identity. Switching forms
  is equivalent to selecting another Pokémon and uses the ordinary identity
  change behavior.
- Do not remove PokeAPI-classified identities or merge them by matching stats,
  typing, or abilities.

## Scope

- Add form switching for both attacker and defender.
- The default identity for a species connects to every directly selectable
  non-Mega identity and every Mega identity in that species.
- A non-default, non-Mega identity connects only to the species' directly
  selectable non-Mega identities.
- A Mega identity connects to the default identity and the species' other Mega
  identities.
- Add a persistent Mega quick filter to the Pokémon selector. It displays Mega
  identities directly and combines with type filters using AND.
- On selecting a Mega identity:
  - lock both sides' ability Track to the identity's real ability;
  - when PokeAPI lacks the ability relation, lock the shared Unknown ability;
  - lock both sides' held-item Track to the mapped Mega Stone;
  - when the stone resource is unavailable, lock the shared Unknown Mega Stone;
  - keep Rayquaza's held-item Track editable and preserve its current item.
- Maintain an explicit reviewed Mega identity to Mega Stone mapping because
  PokeAPI does not provide that relationship.
- Do not restore prior item or ability choices when switching back from Mega.
- Do not implement additional Mega ability effects in this issue.
- Treat Mega Stones, Unknown Mega Stone, and Unknown ability as no-effect inputs
  for effect-equivalent merging and omit them from result conditions. Real
  abilities with unimplemented effects remain explicitly unsupported.
- Do not provide a special persistence migration when an unknown placeholder is
  later replaced by upstream data.

## Deferred interaction decision

- [ ] A later design pass must choose the concrete form-switch control, labels,
  and layout before implementation.

## Acceptance criteria

- [ ] Attacker and defender both expose the agreed form-switch interaction.
- [ ] A default identity can switch directly to each Mega identity and back.
- [ ] Pokémon with multiple Mega forms can select the intended form explicitly.
- [ ] Non-default ordinary forms cannot switch directly to Mega identities.
- [ ] PokeAPI non-battle-only forms use the same interaction without a
  product-maintained exception list.
- [ ] Selecting a Mega form applies and locks the correct Mega Stone.
- [ ] The locked Mega Stone cannot be cleared or replaced.
- [ ] Rayquaza follows its no-Mega-Stone exception.
- [ ] Selecting a Mega form applies and locks the correct ability.
- [ ] A Mega with missing upstream ability data locks Unknown ability.
- [ ] A Mega with a missing stone resource locks Unknown Mega Stone.
- [ ] The Pokémon selector's persistent Mega filter directly returns Mega
  identities and intersects with type filters.
- [ ] Form switching uses the ordinary identity-change reset behavior and does
  not restore prior item or ability choices.
- [ ] Mega Stones and unknown placeholders merge as no-effect inputs and are
  omitted from result conditions.
- [ ] Damage calculation receives the selected form's stats, typing, item, and
  ability.
- [ ] Tests cover form switching, Mega X/Y selection, locked values, and
  Rayquaza's exception.
- [ ] Tests cover one Mega with missing ability data and one with a missing
  stone resource.
- [ ] Before resolution, audit every decision in the discussion trace
  line-by-line and verify that each one is implemented or explicitly deferred.

## Progress Log

- 2026-07-30: Issue created; interaction form and non-Mega form subset remain to
  be decided during implementation design.
- 2026-07-30: Batch grilling resolved identity, filtering, transition, lock,
  fallback, and result semantics. The concrete form control remains deferred.

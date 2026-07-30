---
# This section is managed by the CLI. Do not edit manually.
id: "a2a77175-c41a-4473-be2e-2994f18ac9e9"
title: "Add defender held-item track"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-30T10:45:00Z"
updated_at: "2026-07-30T10:45:00Z"
---
## Problem

The defender has no Held item Track, so defensive item configurations cannot participate in a Matchup and a defender Mega identity cannot lock its required Mega Stone.

## Scope

- Add a defender Held item Track with the same multi-select and explicit no-item semantics as the attacker Track.
- Carry the selected defender held item through catalog construction, scenario state, persistence, row-product expansion, and compilation.
- Allow the Track to be constrained to one visible, non-clearable selection for identity-required items such as Mega Stones.
- Apply the existing effect-equivalent merge semantics to neutral and unsupported defender item effects.

## Out of scope

- Adding new held-item effect implementations; those remain tracked by [[20260730_open_implement-pokemon-held-item-effects|Implement Pokémon held-item effects]].
- Mega classification and form switching; those remain tracked by [[20260730_open_support-mega-pokemon-and-form-switching|Support Mega Pokémon and form switching]].

## Acceptance criteria

- [ ] Attackers and defenders each expose an independent Held item Track.
- [ ] The defender Track includes explicit no-item and never allows an empty selection set.
- [ ] Each Scenario row applies exactly one selected defender held item.
- [ ] Defender item selection participates in row-product expansion and effect-equivalent merging.
- [ ] Saved Matchups persist and restore the defender held-item selection.
- [ ] Damage compilation receives the selected defender held-item identity and its supported effect state.
- [ ] A consumer can lock the defender Track to one visible item that cannot be cleared or replaced.
- [ ] Tests cover selection, row expansion, persistence, compilation, and locked mode.

## Relationship

This issue blocks [[20260730_open_support-mega-pokemon-and-form-switching|Support Mega Pokémon and form switching]].

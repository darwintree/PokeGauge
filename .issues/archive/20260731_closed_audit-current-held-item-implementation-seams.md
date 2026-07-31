---
# This section is managed by the CLI. Do not edit manually.
id: "f35d7804-14b3-4800-821f-768eb7b00af5"
title: "Audit current held-item implementation seams"
status: "closed"
priority: "high"
labels: ["WAYFINDER:TASK"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T12:18:00Z"
---
## Question

Audit the repository's current Held item Track, catalog/resource identities, attacker and defender scenario state, compiler/kernel modifier phases, accuracy/critical distributions, N-hit calculation, provenance, effect-equivalent Scenario merging, form locking, and warning primitives.

Record which frozen families already fit an existing seam, which require a product decision, and which current contracts would be contradicted by a naive implementation. This is a read-only local audit that unblocks later decisions; it must not implement the destination.

## Parent map

[[../20260731_open_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Resolution

### Current end-to-end seam

`Held item Track -> TrackState -> RawScenario -> compileScenario -> CompiledDamageInput + ProbabilityInput -> local damage kernel / ADD convolution -> calculationIdentity merge + provenance -> Results` is already the authoritative path. `@smogon/calc` is only a test oracle. A second item calculator is unnecessary.

- Catalog/UI: `src/lib/held-item/items.ts`, `src/lib/catalog/registry.ts`, and `held-item-track.tsx` hard-code `none`, Life Orb, the category-matching Choice item, and 18 synthetic `type-boost-*` options. The Track supports both attacker and defender selection, but its visible pool is the same attacker-oriented pool on both sides.
- Identity/resources: `HeldItemId` already accepts `string | UpstreamResourceId`, and scenario storage round-trips both. However, the generated resource layer exposes only Pokémon, moves, and abilities through its generic access interface; item generation is restricted to Mega Stones. Core and type-boost items therefore use synthetic string identities, which contradicts the current `Upstream resource identity` contract if copied to the frozen inventory.
- Scenario/compiler: both item selections already participate in the row product. Attacker item compilation currently recognizes Life Orb, Choice Band/Specs, and the 18 type boosts. Every non-neutral defender item is compiled as inactive.
- Kernel: the existing branch interface already has independent base-power, attack, defense, spread, weather, critical, STAB, type-effectiveness, and final modifiers with integer chaining/rounding. No new kernel module is needed; the compiler needs to populate the existing fields at the correct verified phases.
- Probability/KO: `ProbabilityInput` already carries hit and critical probability and is part of `calculationIdentity`. Hit probability currently composes only move/weather accuracy; critical probability comes from the Move snapshot's total `criticalStage`. KO currently exposes one- and two-hit results by convolving the same ADD twice.
- Merge/provenance: calculation identity includes snapshot, compiled low/high branches, probability, and KO inputs, while deliberately excluding source selections. Effect-equivalent choices therefore merge and retain `effective | inactive | unsupported | neutral` source sets.
- Form locking: generic state and UI accept one locked item per side, but only the hard-coded Mega Stone map drives it. Identity-gated behavior can read both Battle Pokémon identities in the compiler; it has no item eligibility/effect metadata yet. Mega Rayquaza item preservation is another hard-coded identity exception.
- Warnings: `TrackOption` already supports tooltips, and `AbilityTrack` supplies the accessible red-dot pattern requested for unsupported effects. Held items do not yet have support metadata or this marker.

### Frozen families and the seams they can reuse

- Existing attacker modifier phases: Life Orb and Choice Band/Specs already compile. The 18 named type boosts already share a conditional type-boost seam. Plates, incenses, category boosts, Expert Belt, signature orbs/crystals/globes/cores, Soul Dew, and masks can reuse the compiler-to-kernel modifier fields once mechanics research fixes each exact phase and activation predicate.
- Identity-gated stat modifiers: Light Ball, Thick Club, Deep Sea Tooth, Deep Sea Scale, Soul Dew, Eviolite, and the legendary signature items can use the existing attacker/defender identity plus attack/defense modifier fields. They require data-driven eligibility instead of more identity `if` chains.
- General defender modifiers: Assault Vest and Eviolite fit the existing `defenseModifier`; resistance Berries fit a defender-side final-damage modifier. The missing seam is defender item compilation, not kernel math.
- Accuracy/evasion and critical items: Wide Lens, Bright Powder, Lax Incense, Scope Lens, Razor Claw, Leek, and Lucky Punch fit the existing probability result and merge identity. They require composing item factors/stage contributions before `compileProbability`; mutating the Move snapshot would violate snapshot ownership because its critical stage is move configuration.
- Cross-mechanism suppression: Utility Umbrella does not reduce to an item scalar. It must influence weather-effect compilation for the holder before weather modifiers/accuracy are compiled, while retaining weather provenance.
- Form lock reuse: the existing single locked-item UI/state shape can cover form-required masks if the eligibility decision says they are locked; the Mega-only lookup must become generic enough for the confirmed identities.

### Product decisions exposed by the audit

1. Choose canonical item identity/catalog metadata. Extending synthetic ids to the frozen 88 would violate the upstream numeric-id contract; numeric ids are already storage-compatible, but generalized item generation/localization does not exist.
2. Define one effect descriptor capable of side, activation predicate, formula phase or probability contribution, identity eligibility, support status, and warning copy. The current `CatalogOption` has only `id`, `label`, and `summary`.
3. Define partial support separately from source effectiveness. A resistance Berry must be both effective for the static damage calculation and marked as not modeling consumption. The current `ScenarioSource` has one mutually exclusive state, so naïvely choosing `unsupported` would hide the implemented reduction and choosing `effective` would lose the required warning.
4. Define derived critical stage and accuracy composition, including cap/rounding and how `rolls` versus `actual` probability modes expose item effects. Do not write item contribution back into a Move snapshot.
5. Define attacker-versus-defender item presentation. `moveMechanics.modifiers.item` and the formula tooltip currently flatten only the attacker's item phases into one scalar even though defender provenance already exists.
6. Define generic identity gating/locking for species/form-specific items without accumulating special cases beside the Mega Stone map and Mega Rayquaza preservation.
7. Confirm whether warning/support metadata participates in the merge key or is aggregated solely through provenance. Calculation-changing fields already merge correctly because calculation and probability are in the identity.

### Contracts a naive implementation would break

- Adding another calculator or delegating runtime item behavior to `@smogon/calc` would contradict ADR 0001 and split the authoritative formula path.
- Treating every frozen item as an untyped scalar would lose phase rounding, defender-side effects, probability effects, identity gates, and Utility Umbrella's weather interaction.
- Reusing synthetic slugs as persistent ids would contradict `Upstream resource identity`.
- Marking resistance Berries only `effective` or only `unsupported` cannot satisfy the confirmed static N-hit result plus red-dot consumption warning.
- Modeling Berry consumption by convolving different per-hit distributions would introduce battle history explicitly excluded from this map. Reusing the same static ADD naturally preserves the confirmed N-hit behavior.
- Encoding item critical bonuses by editing snapshots would make held-item selection mutate the user's Move comparison unit.
- Treating all defender selections as attacker items would keep Choice/Life Orb-style options visible on the wrong semantic path and cannot express defender-specific eligibility.

Read-only audit complete. No implementation change or implementation trace was needed because this ticket made no unresolved implementation choice; it only exposed decisions for the existing downstream tickets.

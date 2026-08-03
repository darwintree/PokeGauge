---
# This section is managed by the CLI. Do not edit manually.
id: "467c7792-bcc6-46dd-8a9c-c927c12d5aff"
title: "Decide form-locked and identity-gated item behavior"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T12:19:00Z"
---
## Question

How should Eviolite, Light Ball, Thick Club, Deep Sea items, Adamant/Lustrous/Griseous items, Soul Dew, and the three Ogerpon masks bind item effects to Battle Pokémon identity and required forms?

Decide candidate visibility, item locking or preservation during form changes, neutral behavior on an ineligible holder, and which form/item effects are supported without implementing move-specific or full battle-form mechanics.

If the chosen boundary leaves an unsupported form or identity behavior that can change calculator inputs or outputs, identify the affected items for the static red-dot warning established by [[20260731_closed_decide-supported-effect-and-warning-semantics|Decide supported-effect and warning semantics]].

## Parent map

[[20260731_closed_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Blocked by

- [[20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]
- [[20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]]

## Resolution

Bind every supported identity-gated effect to the selected current `Battle Pokémon identity`; do not infer eligibility from localized names, display labels, or the upstream template that originally produced the Scenario. Ordinary identity-gated items remain in their side's static candidate pool and compile a neutral contribution with source state `inactive` when the current holder or Move does not satisfy the predicate.

Generate Eviolite eligibility as one boolean per Battle Pokémon identity from the vendored PokeAPI tables. For a default Pokémon identity, an outgoing evolution without `base_form_id` makes it eligible. For a non-default identity, an outgoing evolution must name that Pokémon numeric id as `base_form_id`. Add reviewed positive overrides for Pumpkaboo-Small (`10027`), Pumpkaboo-Large (`10028`), Pumpkaboo-Super (`10029`), and Gimmighoul-Roaming (`10263`), whose PokeAPI evolution rows omit the shared evolution's explicit base form. Runtime compilation reads the generated boolean; it does not fetch or traverse an evolution chain. No Eviolite warning is needed because the supported result uses per-identity eligibility rather than a disclosed species-level approximation.

Use these base-species gates and existing Move predicates:

| Item family | Eligible holder | Additional activation |
| --- | --- | --- |
| Light Ball | every Pikachu identity (`speciesId 25`) | Attack and Special Attack stat modifiers |
| Thick Club | Cubone or Marowak, including Alolan Marowak (`speciesId 104/105`) | Attack stat modifier |
| Deep Sea Tooth / Scale | Clamperl (`speciesId 366`) | Special Attack / Special Defense stat modifier |
| Adamant Orb | every Dialga identity (`speciesId 483`) | Steel- or Dragon-type Move |
| Lustrous Orb | every Palkia identity (`speciesId 484`) | Water- or Dragon-type Move |
| Griseous Orb | every Giratina identity (`speciesId 487`) | Ghost- or Dragon-type Move |
| Soul Dew | every Latias or Latios identity (`speciesId 380/381`) | Psychic- or Dragon-type Move |

Treat Wellspring Mask, Hearthflame Mask, and Cornerstone Mask as `Identity-locked held item` exceptions to the ordinary static candidate pools. Ogerpon-Wellspring, Ogerpon-Hearthflame, and Ogerpon-Cornerstone each expose and lock only their corresponding Mask, using the existing one-item locked Track shape also used by Mega identities. The Masks do not appear as ordinary candidates for any other identity, and choosing an item never changes the selected Battle Pokémon identity.

The selected masked Ogerpon identities already own their PokeAPI types, base stats, and ability relations. Their locked Masks contribute the supported `4915/4096` Base Power effect to damaging Moves. Do not add a Held item partial-support warning for the Masks; unsupported Ogerpon Ability effects remain disclosed by the Ability Track. Terastallization, Embody Aspect, and battle-form transitions remain outside this item contract and do not cause the item selection to synthesize another identity.

Changing Battle Pokémon identity rebuilds the target identity's default state. A target with an identity-locked item receives that item; no previous-form item selection is preserved or restored. Preserve the existing Mega Rayquaza exception, whose item remains editable and carries through the current identity transition path. The earlier implementation audit's reference to Terapagos preservation was a factual error and has been corrected.

Adamant Crystal, Lustrous Globe, and Griseous Core remain outside the frozen 85-item whitelist. Their form behavior does not re-enter scope through this decision, and no effect, compatibility, or warning semantics are added for them.

Supporting records:

- [[../../docs/traces/discussion/2026-07-31-form-locked-and-identity-gated-held-items|Form-locked and identity-gated held items discussion trace]]
- [[../../docs/research/2026-07-31-pokeapi-eviolite-eligibility|PokeAPI Eviolite eligibility]]
- [[../../docs/research/2026-07-31-frozen-held-item-mechanics-matrix|Frozen held-item mechanics matrix]]

## Acceptance handoff

- [ ] Before implementation is considered complete, audit every decision in the linked discussion trace line by line against the delivered behavior.

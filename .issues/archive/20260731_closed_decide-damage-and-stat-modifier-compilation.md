---
# This section is managed by the CLI. Do not edit manually.
id: "9e196cd5-8f06-4172-8345-a111dfad2c53"
title: "Decide damage and stat modifier compilation"
status: "closed"
priority: "high"
labels: ["WAYFINDER:GRILLING"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T10:57:00Z"
---
## Question

How should every frozen Base Power, Attack, Defense, final-damage, resistance-Berry, and weather-suppression effect compile for attacker and defender items?

Decide activation predicates, holder-side separation, modifier phases, integer representation, rounding, stacking, neutral/inactive states, and interaction with snapshot edits, STAB, effectiveness, Weather, Terrain, Screens, Abilities, and critical damage.

## Parent map

[[20260731_closed_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Blocked by

- [[20260731_closed_verify-frozen-held-item-mechanics-against-primary-sources|Verify frozen held-item mechanics against primary sources]]
- [[20260731_closed_verify-held-item-modifier-phases-and-rounding|Verify held-item modifier phases and rounding]]
- [[20260731_closed_audit-current-held-item-implementation-seams|Audit current held-item implementation seams]]

## Resolution

Keep the existing `calculateDamageRolls(CompiledDamageInput)` damage-kernel interface. The kernel remains item-agnostic and continues to own the ordered Gen 9 integer formula. `compileScenario` owns item activation and folds each active item contribution into the kernel's existing phase fields; no second calculator or item-aware kernel interface is introduced.

Use the researched Gen 9 fixed-point values and exact phase semantics:

| Phase | Frozen item contributions |
| --- | --- |
| Base Power | `4915` for type boosters, Plates, Incenses, retained signature Orbs, Soul Dew, and Ogerpon masks; `4505` for Muscle Band and Wise Glasses |
| Attack / Special Attack | `6144` for Choice Band / Choice Specs; `8192` for Light Ball, Thick Club, and Deep Sea Tooth when eligible |
| Defense / Special Defense | `6144` for Assault Vest and Eviolite; `8192` for Deep Sea Scale when eligible |
| Final damage | `4915` for Expert Belt, `5324` for Life Orb, and `2048` for a triggered resistance Berry |
| Holder-relative Weather | Defender-held Utility Umbrella suppresses the ordinary sun/rain Fire/Water damage modifier instead of contributing a scalar |

Within each formula phase, chain active contributions with the researched 4096 integer rule and apply the chained scalar once with the researched half-down application rule. Preserve the existing phase order and interactions with stat stages, critical stage-ignore rules, Weather, Terrain, Screens, Abilities, spread damage, STAB, effectiveness, and final damage. Stat-item modifiers remain present on critical branches; critical hits alter stage and Screen behavior, not the item modifier itself.

Activation reads the current Scenario rather than upstream template defaults. Base Power items modify the current editable Move snapshot power. Stat items modify the current build/range endpoint after the kernel's stage handling. Type, category, effectiveness, holder side, and identity gates use the resolved Scenario inputs. Exact identity/form acceptance remains owned by the form/identity ticket.

When a whitelist item's supported activation predicate is not met, compile a neutral modifier and record the source as `inactive`. Reserve `neutral` for explicit no-item and other defined neutral identities such as Unknown Mega Stone. Partial-support warnings stay orthogonal, and no whitelist core effect uses `unsupported`.

Resistance Berries use only the inputs represented by the current model: matching incoming type and super effectiveness, except Chilan Berry, which uses its Normal-type rule. Substitute, `eatItem()`, prior consumption, and other battle history are not inputs. The confirmed N-hit projection reuses the same static Berry-modified distribution for every hit and relies on the separate red-dot warning.

Utility Umbrella support in this ticket is limited to defender-held suppression of ordinary sun/rain Fire/Water damage modification. Attacker-held move-specific interactions and weather accuracy remain excluded and do not expand the attacker candidate pool. Accuracy and critical-stage items remain owned by the dedicated probability ticket.

Supporting records:

- [[../../docs/traces/discussion/2026-07-31-held-item-damage-and-stat-modifier-compilation|Held-item damage and stat modifier compilation discussion trace]]
- [[../../docs/research/2026-07-31-held-item-modifier-phases-and-rounding|Held-item modifier phases and rounding]]
- [[../../docs/research/2026-07-31-frozen-held-item-mechanics-matrix|Frozen held-item mechanics matrix]]

## Acceptance handoff

- [ ] Before implementation is considered complete, audit every decision in the linked discussion trace line by line against the delivered behavior.

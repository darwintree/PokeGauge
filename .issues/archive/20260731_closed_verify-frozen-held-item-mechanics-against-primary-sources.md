---
# This section is managed by the CLI. Do not edit manually.
id: "9d42d5cd-d2d2-4750-9771-08b6599f6a93"
title: "Verify frozen held-item mechanics against primary sources"
status: "closed"
priority: "high"
labels: ["WAYFINDER:RESEARCH"]
created_at: "2026-07-31T09:27:00Z"
updated_at: "2026-07-31T09:41:00Z"
---
## Question

Verify the frozen 88-item inventory against primary sources and produce a cited per-family mechanics matrix that later decisions can rely on. For every item, record canonical Showdown identity, M-B legality, holder eligibility, activation predicate, affected side/stat/type/probability, exact scalar or critical-stage change, and relevant unsupported effects.

The frozen inventory is:

- M-B main scope (44): Life Orb; Black Belt, Black Glasses, Charcoal, Dragon Fang, Fairy Feather, Hard Stone, Magnet, Metal Coat, Miracle Seed, Mystic Water, Never-Melt Ice, Poison Barb, Sharp Beak, Silk Scarf, Silver Powder, Soft Sand, Spell Tag, Twisted Spoon; Expert Belt, Light Ball, Muscle Band, Wise Glasses; Babiri Berry, Charti Berry, Chilan Berry, Chople Berry, Coba Berry, Colbur Berry, Haban Berry, Kasib Berry, Kebia Berry, Occa Berry, Passho Berry, Payapa Berry, Rindo Berry, Roseli Berry, Shuca Berry, Tanga Berry, Wacan Berry, Yache Berry; Bright Powder, Wide Lens, Scope Lens.
- Already implemented outside M-B (2): Choice Band, Choice Specs.
- Same-path Plates and Incenses (22): Draco Plate, Dread Plate, Earth Plate, Fist Plate, Flame Plate, Icicle Plate, Insect Plate, Iron Plate, Meadow Plate, Mind Plate, Pixie Plate, Sky Plate, Splash Plate, Spooky Plate, Stone Plate, Toxic Plate, Zap Plate; Odd Incense, Rock Incense, Rose Incense, Sea Incense, Wave Incense.
- Identity-gated stats (3): Thick Club, Deep Sea Tooth, Deep Sea Scale.
- Identity-gated type damage (7): Adamant Orb, Adamant Crystal, Lustrous Orb, Lustrous Globe, Griseous Orb, Griseous Core, Soul Dew.
- Ogerpon masks (3): Cornerstone Mask, Hearthflame Mask, Wellspring Mask.
- Defensive stats (2): Assault Vest, Eviolite.
- Accuracy and critical siblings (4): Lax Incense, Razor Claw, Leek, Lucky Punch.
- Weather interaction (1): Utility Umbrella.

Official M-B sources decide legality; pinned Pokémon Showdown Gen 9 / Champions source should be investigated for executable mechanics. Usage statistics are not a mechanics source.

## Parent map

[[../20260731_open_wayfinder-held-item-effects-specification|Wayfinder: Held-item effects specification]]

## Resolution

Research artifact: [Frozen held-item mechanics matrix](../../docs/research/2026-07-31-frozen-held-item-mechanics-matrix.md).

- Verified exactly 88 distinct canonical Showdown item identities against pinned Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa`.
- The pinned Champions mod resolves the frozen M-B main scope as 44 standard items and the approved outside-M-B scope as 44 `Past` items.
- The official Regulation M-B notices do not publish a per-item allowlist. Therefore M-B membership is recorded as a versioned Showdown executable proxy, not claimed as official per-item confirmation.
- The matrix records every item's holder eligibility, activation predicate, affected phase/value, exact modifier or critical-stage change, and unsupported adjacent effects.
- The 88 items reduce to eight mechanics shapes: final damage, Base Power, battle stat, incoming damage, numeric accuracy, critical stage, identity-gated Base Power, and holder-relative weather visibility.
- Resistance Berry consumption remains deliberately unsupported; the confirmed map decision retains static-item N-hit output with a warning.

Research complete. The artifact is evidence for later product decisions, not itself the held-item spec.

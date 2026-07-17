---
# This section is managed by the CLI. Do not edit manually.
id: "f4b9e672-8d70-4af6-8a50-6d17ea9ed52e"
title: "Support reviewed move semantics and exclusions"
status: "open"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T03:51:00Z"
---
## Parent

[[archive/20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Apply the reviewed move rules needed for a snapshot to compile into an ordinary damage calculation, using upstream numeric identities and structured metadata rather than runtime Smogon names or localized text.

## Acceptance criteria

- [ ] Revelation Dance, Aura Wheel, Raging Bull, and Ivy Cudgel resolve move type from move ID plus attacker Battle Pokémon identity.
- [ ] The resolved type drives result display, STAB and Adaptability eligibility, type effectiveness, type-boost items, and generic weather handling.
- [ ] Psyshock, Psystrike, Secret Sword, Foul Play, Body Press, Photon Geyser, Light That Burns the Sky, Shell Side Arm, Hidden Power, Max Moves, and Z-Moves cannot appear in search or create snapshots.
- [ ] Tera Blast and Tera Starstorm remain ordinary static special moves while Terastallization is out of scope.
- [ ] Reviewed variable-power moves may enter the Snapshot-capable pool only through structured metadata; upstream null power alone does not grant eligibility.
- [ ] Raging Bull compiles its reviewed breaks-screens-before-damage property for the Screen feature to consume.
- [ ] Supported reviewed cases and exclusions are covered at the resource/compiler seam without runtime name mapping.

## Blocked by

- [[20260717_open_implement-editable-move-snapshots|Implement editable Move snapshots]]

---
# This section is managed by the CLI. Do not edit manually.
id: "f4b9e672-8d70-4af6-8a50-6d17ea9ed52e"
title: "Support reviewed move semantics and exclusions"
status: "closed"
labels: ["READY-FOR-AGENT"]
created_at: "2026-07-17T03:51:00Z"
updated_at: "2026-07-17T05:59:00Z"
---
## Parent

[[20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Core battle mechanics integration specification]]

## What to build

Apply the reviewed move rules needed for a snapshot to compile into an ordinary damage calculation, using upstream numeric identities and structured metadata rather than runtime Smogon names or localized text.

## Acceptance criteria

- [x] Revelation Dance, Aura Wheel, Raging Bull, and Ivy Cudgel resolve move type from move ID plus attacker Battle Pokémon identity.
- [x] The resolved type drives result display, STAB and Adaptability eligibility, type effectiveness, type-boost items, and generic weather handling.
- [x] Psyshock, Psystrike, Secret Sword, Foul Play, Body Press, Photon Geyser, Light That Burns the Sky, Shell Side Arm, Hidden Power, Max Moves, and Z-Moves cannot appear in search or create snapshots.
- [x] Tera Blast and Tera Starstorm remain ordinary static special moves while Terastallization is out of scope.
- [x] Reviewed variable-power moves may enter the Snapshot-capable pool only through structured metadata; upstream null power alone does not grant eligibility.
- [x] Raging Bull compiles its reviewed breaks-screens-before-damage property for the Screen feature to consume.
- [x] Supported reviewed cases and exclusions are covered at the resource/compiler seam without runtime name mapping.

## Blocked by

- [[20260717_closed_implement-editable-move-snapshots|Implement editable Move snapshots]]

## Resolution

Added one numeric reviewed-move metadata seam for snapshot defaults, identity-dependent typing, candidate exclusions, variable-power eligibility, and pre-damage screen breaking. Catalog options now resolve attacker-dependent types for display and filtering, while the compiler uses the same resolved type for STAB, effectiveness, type-boost items, and future ability/weather phases. Unsupported stat-source/dynamic-class/fixed-damage cases, Hidden Power, Z-Moves, and Max Moves are filtered and guarded at snapshot/compiler boundaries; Tera Blast and Tera Starstorm remain static candidates. Reviewed null-power templates enter unconfigured and compile only after the snapshot supplies concrete power. Coverage is based on numeric move and Battle Pokémon IDs, with no runtime localized or calc-name mapping.

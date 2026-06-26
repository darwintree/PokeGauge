---
# This section is managed by the CLI. Do not edit manually.
id: "2b5c7fba-56ff-41d4-9b2d-69f64ae38e61"
title: "Slice 3: Sidebar layout and multi-select tracks"
status: "open"
priority: "high"
labels: ["READY-FOR-AGENT", "FEATURE-REQUEST"]
created_at: "2026-06-26T00:47:00Z"
updated_at: "2026-06-26T00:51:00Z"
---
## Parent

[[20260626_open_scenario-explorer-matchup-damage-comparison-ui|Scenario Explorer — matchup damage comparison UI]]

## What to build

Add **Variant B — Sidebar refine** layout and interactive **multi-select tracks** for the fixed Garchomp → Incineroar matchup.

End-to-end behavior on one page:

- **Desktop**: left sticky parameter panel (~18rem) + right results main area
- **Mobile**: parameter block stacked above results
- Parameter panel: **read-only** matchup header (Garchomp → Incineroar; selector comes in slice #5) + track controls
- Results header: selection summary including **row count**

Tracks (all multi-select, preset offense mode only — range track is slice #4):

| Track | Behavior |
|-------|----------|
| Move | Toggle moves from move pick |
| Offense stat | Toggle spread presets |
| Attacker item | Toggle items including explicit no-item |
| Defender bulk | Toggle bulk presets |

User deselecting options **tightens** results (detailed view semantics) without mode switching. Same **row product rule** and stable sort as pipeline slice #1.

## Acceptance criteria

- [ ] Desktop layout: sticky left sidebar with tracks; scrollable results on the right
- [ ] Mobile layout: parameters above results in single column
- [ ] Each track control updates pipeline input and recomputes visible rows live
- [ ] Selection summary shows current row count; count drops when user deselects options
- [ ] Results area has stronger visual weight than parameter panel
- [ ] Box plots from slice #2 render for all visible rows after track changes

## Blocked by

[[20260626_open_slice-2-damage-box-plot-visualization|Slice 2: Damage box plot visualization]]
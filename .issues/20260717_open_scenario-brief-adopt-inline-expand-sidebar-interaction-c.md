---
# This section is managed by the CLI. Do not edit manually.
id: "852c847c-5b09-4e86-a449-56e73bb977b6"
title: "Scenario Brief: adopt inline-expand sidebar interaction (C)"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "READY-FOR-HUMAN"]
created_at: "2026-07-17T10:30:00Z"
updated_at: "2026-07-17T10:33:00Z"
---
## Context

Scenario Explorer sidebar redesign explored several layout and brief prototypes. After comparing interaction paradigms on a shared symmetric brief map (`?brief=A|B|C`), **C — Inline expand** was chosen as the direction to deepen.

Current entry: Scenario Explorer sidebar (inline-expand is the live setup UI).
Working code: `src/components/scenario-explorer/brief-prototype/` (`SidebarBriefHost` / `BriefMap` / `TrackEditor`). A/B comparison shells and the prototype switcher were removed after the choice.

Rejected (historical contrast only):

- **A Swap** — leave the map entirely for a full-pane editor, then return.
- **B Inspector** — map stays; a persistent detail pane below always follows selection.

## Decision (locked)

Sidebar interaction model:

1. The brief map stays visible and is the structural overview of all tracks.
2. Clicking a track expands its editor **inline under that track’s row** (not a separate page, not a bottom inspector).
3. Clicking the same track again (or an explicit close) collapses the editor.
4. Only one track is expanded at a time.
5. Attacker / defender presentation is **symmetric** (paired columns); weather/field sits as a shared row.

## Role of the brief

The brief is not a passive summary in the results header. It is the sidebar’s primary structure:

- Show **all tracks** (species, moves, stats, ability, item, screens, weather, …) in a scannable map.
- Let the user open the corresponding track editor by operating on that map cell/row.

## Current prototype shape (reference, not final polish)

- Shared `BriefMap`: Atk/Def headers + paired cells + weather cell; Lucide icons per track.
- Expand slot renders under the owning pair row (or under weather).
- `TrackEditor` mounts the existing control surfaces for the focused track.

## Open for deepening

These are intentionally unresolved; next work should grill / prototype them before productizing:

- [ ] Vertical budget: long editors (e.g. moves, stat axes) vs keeping the rest of the map visible — scroll policy, sticky map chrome, or height caps.
- [ ] Expand affordance: how active/expanded state reads vs mere hover/focus; whether close control is necessary or toggle-only.
- [ ] Cross-row context while editing: does the collapsed map stay dense enough, or do we need lighter “peek” values while one row is open.
- [ ] Mobile / narrow width: two-column Atk|Def symmetry may need a stacked fallback.
- [ ] Which tracks belong in the map vs stay elsewhere (locale, display options, etc. are out of the brief map unless explicitly pulled in).
- [ ] Rename / harden `brief-prototype/` into product module naming once deepen pass lands.
- [x] Remove A/B switcher and unused interaction hosts (done; C is the only shell).

## Out of scope (for now)

- Reopening full-page layout variants (drawer, arena stack, etc.).
- Productizing A Swap or B Inspector.
- Domain track coverage gaps (terrain, etc.) — separate issues.

## Acceptance (for a later implementation ticket)

When deepened and shipped:

- Live sidebar uses inline-expand brief as the default track navigation/edit model.
- All current tracks remain reachable from the brief without the old monolithic stacked controls as the primary IA.
- Atk/Def symmetry is preserved at the map level.
- Deepen open items above to product-quality polish (vertical budget, affordances, narrow width).
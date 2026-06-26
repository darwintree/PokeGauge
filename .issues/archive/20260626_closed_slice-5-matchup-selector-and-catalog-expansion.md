---
# This section is managed by the CLI. Do not edit manually.
id: "b569eea8-3554-4373-8d55-714172650731"
title: "Slice 5: Matchup selector and catalog expansion"
status: "closed"
priority: "high"
labels: ["READY-FOR-AGENT", "FEATURE-REQUEST"]
created_at: "2026-06-26T00:47:00Z"
updated_at: "2026-06-26T13:05:00Z"
---
## Parent

[[20260626_closed_scenario-explorer-matchup-damage-comparison-ui|Scenario Explorer — matchup damage comparison UI]]

## What to build

Generalize beyond the fixed Garchomp → Incineroar fixture: user selects **attacker** and **defender** species for a **matchup**, and the app loads the appropriate hardcoded catalogs.

End-to-end behavior:

- Matchup selector (searchable select or equivalent) replaces the read-only header from slice #3
- On matchup change: load species-specific **move pick** (usage-ranked top-N, hardcoded), offense/defense track options, and reset to default track selections (all top-N moves pre-selected)
- Catalog presets aligned with **Level 50 VGC** conventions (Champions ruleset semantics)
- Support at least 3 attacker species with distinct move picks — enough to demonstrate generalization, not exhaustive dex coverage
- **Move category routing**: offense stat and bulk stat tracks must follow move category (physical → atk/def, special → spa/spd). Either implement category-aware catalogs or restrict v1 species to physical attackers only — document the choice in code
- If slice #4 (stat range track) is already done: stat range **bounds and snap points** recompute when attacker species changes

All track interactions, box plots, sidebar layout, and optional range track from prior slices continue to work for any supported matchup.

Completing this slice satisfies PRD v1 scope for user-selectable matchups (parent PRD remains open as planning reference).

## Acceptance criteria

- [x] User can change attacker and/or defender from the parameter panel
- [x] Move pick options update per attacker species (hardcoded usage lists); default selection pre-selects all top-N moves
- [x] Offense stat and defender bulk tracks use correct stat for move category (physical/special), or v1 species are explicitly physical-only with comment documenting the restriction
- [x] Matchup change resets tracks to documented default selections
- [x] At least 3 attacker species with distinct move picks are supported in catalog
- [x] Calculations remain Level 50 VGC across all supported matchups
- [x] If stat range track exists (slice #4): attacker change recomputes stat bounds and snap points for the new species

## Resolution

Implemented in `src/lib/catalog/registry.ts`, `matchup-selector.tsx`, and category-aware calc-adapter. Category routing uses matchup-level `moveCategory` (single-category attackers in v1). Follow-up polish: special-attacker range UI labels and restored range-mode pipeline tests (2026-06-26).

## Blocked by

[[20260626_closed_slice-3-sidebar-layout-and-multi-select-tracks|Slice 3: Sidebar layout and multi-select tracks]]
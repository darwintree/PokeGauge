---
# This section is managed by the CLI. Do not edit manually.
id: "188f4a20-d60d-41e3-9a13-fe94356c2573"
title: "Decide whether dense Pokemon and move search needs a UI prototype"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:GRILLING", "WAYFINDER:CLAIMED"]
created_at: "2026-07-03T06:12:00Z"
updated_at: "2026-07-03T06:29:00Z"
---
## Parent Map
[[20260702_closed_wayfinder-pokeapi-and-champions-data-integration-route|Wayfinder: PokeAPI and Champions data integration route]] (`90b002f9-94ca-410b-b115-d0bc2aff4eb3`)

## Question
Now that Pokemon search and global move search contracts are decided, does Scenario Explorer need a prototype for dense Pokemon/move search and selection states before implementation, or is the contract clear enough to implement directly?

## Context
Use `/grilling` and `/domain-modeling`. The decision should focus on product risk: discoverability, scan density, mobile layout, and whether the physical/special move side switch plus type filters can fit the existing track controls without making results hard to scan.

## Resolution
A UI prototype was warranted before implementation. Three variants were evaluated at full-catalog density (~70+ Battle Pokemon identities, ~120 fixed-power moves per side) in the Scenario Explorer sidebar width (`lg:w-72`).

**Variant B — Command sheet** wins. The sidebar stays compact: it shows the current attacker/defender selections and the active move-side track summary only. Search is a deliberate affordance that opens a sheet (mobile: bottom sheet; desktop: centered panel) with keyword input, type filters, and a scrollable dense result list.

Pokemon sheet behavior follows the closed Pokemon search contract: AND semantics on multi-select type chips; rows show localized name plus type badges; picking a row sets that Battle Pokemon identity and closes the sheet.

Move sheet behavior follows the closed global move search contract: scoped to the active **move side**; single-select type filter; keyword plus type narrowing; power-descending sort; rows show name, type, power, and accuracy (`accuracy = null` as always-hit). Picking a row adds the move to the visible track and closes the sheet. The phys/special switch remains in the compact sidebar, not inside the sheet.

Do not extend the current inline `TrackOption` chip picker for global move add/search at full pool size. Selected moves may still render as compact track chips in the sidebar summary.

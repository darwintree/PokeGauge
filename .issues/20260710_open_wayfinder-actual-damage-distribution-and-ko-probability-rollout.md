---
# This section is managed by the CLI. Do not edit manually.
id: "c259b7ee-48f1-4ada-b034-1569ac1963a3"
title: "Wayfinder: Actual damage distribution and KO probability rollout"
status: "open"
priority: "high"
labels: ["WAYFINDER:MAP", "FEATURE-REQUEST"]
created_at: "2026-07-10T02:36:00Z"
updated_at: "2026-07-10T03:57:00Z"
---
## Destination

Scenario Explorer can optionally compute and display OHKO and cumulative ≤2HKO probabilities from Atomic Damage Distributions that include move accuracy, base critical-hit probability, and damage rolls. The probability core is tested as pure functions before the scenario pipeline and frontend are connected; the shipped global toggle defaults off.

## Notes

- This map explicitly carries execution through the destination: implementation tickets are in scope, despite Wayfinder being planning-only by default.
- Consult `CONTEXT.md`, especially Damage distribution, Atomic Damage Distribution, Convolved Damage Distribution, KO probability, KO probability range, Range track, Damage range, and Crit range.
- Preserve `docs/adr/0001-local-damage-kernel-for-generated-resources.md`: the local kernel stays product-scoped, and adapters compile resource/UI state into formula inputs.
- Use `grilling` and `domain-modeling` for domain/product decisions, `ponytail` for the minimum stable code surface, and `implementation-with-traces` for execution tickets.
- Confirmed kickoff constraints: the probability switch changes KO probability only; off compiles to accuracy 100% and crit 0%; on initially covers move base accuracy, unmodified base crit rate, and normal/critical 16 rolls; two uses are independent; fixed configurations return a probability and Range tracks return KO probability ranges; the core accepts arbitrary positive N while the first UI exposes OHKO and cumulative ≤2HKO only.
- Local tracker fallback: child tickets identify this map with a `Parent map` link; blocking is represented with a `Blocked by` section in ticket bodies.

## Decisions so far

- [[archive/20260710_closed_decide-the-stable-actual-damage-probability-module-contract|Decide the stable actual-damage probability module contract]] — Use an opaque DamageDistribution with ADD construction, array-based CDD convolution, and scalar KO queries; keep generic sparse convolution in an independent local module with no third-party math dependency or runtime validation.
- [[archive/20260710_closed_implement-and-test-the-actual-damage-probability-core|Implement and test the actual-damage probability core]] — Implemented and verified the dependency-free sparse convolution and opaque ADD/CDD core, including mass, aggregation, and cumulative OHKO/2HKO/3HKO behavior.

## Not yet specified

- Reviewing the current KO display prototype may expose additional accessibility, localization, or information-density work whose exact ticket boundary is not yet visible.

## Out of scope

- Performance optimization or alternative optimized internal algorithms; revisit only after measured need.
- Runtime validation or defined behavior for invalid probability-module inputs; internal callers own the agreed preconditions.
- Accuracy/evasion stages, guaranteed-hit abilities, crit-stage modifiers, multi-hit moves, and other random mechanics beyond base accuracy, unmodified base crit, and damage rolls.
- Between-turn healing or indirect damage, changing stats, and sequences that use different moves.
- Showing 3HKO or higher in the first frontend iteration; the pure-function interface must still support arbitrary positive N.

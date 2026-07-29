---
# This section is managed by the CLI. Do not edit manually.
id: "b4bc5949-18d5-4162-8806-c1eaac5d3560"
title: "Audit design.md for overly specific component decisions"
status: "closed"
priority: "medium"
labels: ["TECH-DEBT", "NEEDS-TRIAGE"]
created_at: "2026-07-29T09:16:00Z"
updated_at: "2026-07-29T09:28:00Z"
---
## Problem

`design.md` is intended to define the product-wide game HUD system and durable information-hierarchy invariants, but it can accumulate local component styling decisions. The removed result-row hover prescription was one confirmed example. Keeping such details in the top-level design contract makes small visual iterations look like global contract changes and causes the document to drift toward an implementation inventory.

## Scope

Review `design.md` for rules that specify local component presentation or transient interaction treatments more narrowly than a product-wide design-system contract requires. Classify each finding as a durable system invariant, a domain information-hierarchy contract, or a local implementation decision.

Decide where local decisions should live when they still need documentation.

## Out of scope

- Redesigning the UI during the audit.
- Changing result-surface information hierarchy without an explicit product decision.
- Rewriting durable HUD tokens, accessibility rules, or domain invariants merely for brevity.

## Acceptance criteria

- [x] The intended abstraction boundary of `design.md` is explicit.
- [x] Component-specific styling and interaction prescriptions are reviewed consistently across the document.
- [x] Findings identify what stays, what moves, and what is removed, with reasons.
- [x] Follow-up edits preserve the product-wide HUD rules while removing feature-level descriptions from this document.

## Context

The result-row hover rule was removed after confirming that this local styling decision did not belong in `design.md`. The production hover now uses a quiet background wash, but that implementation choice is intentionally not promoted into the top-level design contract.

## Resolution

`design.md` now defines only the product-wide HUD system: durable principles, semantic roles, shared visual rules, interaction states, voice, and accessibility requirements.

Feature behavior, page composition, component fields, interaction details, algorithms, and concrete implementation values were removed. They remain represented by their feature code and may move to dedicated feature specifications if a stable cross-implementation contract is needed later.

The review also removed historical rationale already owned by ADRs and resolved contradictions around shadows, pills, domain colors, and responsive guidance. An independent cold-read review found no remaining blocking problems.

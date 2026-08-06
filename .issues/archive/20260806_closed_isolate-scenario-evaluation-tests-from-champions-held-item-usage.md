---
# This section is managed by the CLI. Do not edit manually.
id: "1e5fdfb0-856c-44c1-9164-9fa3bac240dd"
title: "Isolate scenario evaluation tests from Champions held-item usage"
status: "closed"
priority: "high"
labels: ["BUG"]
created_at: "2026-08-06T08:36:00Z"
updated_at: "2026-08-06T08:37:00Z"
---
## Diagnosis

`src/lib/scenario/evaluate.test.ts` fixtures Champions move and Ability usage but leaves held-item usage on the repository data source. Since usage-driven held-item defaults were introduced, pipeline tests inherit multiple selected attacker and defender items and 15 legacy assertions fail even though the product row-product contract is correct.

## Acceptance

- [x] Scenario evaluation tests explicitly isolate Champions held-item usage.
- [x] The focused default-row repro passes without changing product behavior.
- [x] `evaluate.test.ts`, full tests, lint, and build pass.

## Resolution

Added the missing empty Champions item-usage fixture beside the existing move and Ability fixtures. This keeps `evaluate.test.ts` focused on Scenario expansion and merge behavior while dedicated catalog tests continue to cover usage-driven held-item defaults.

Verified with the focused default-row repro, all 34 tests in `evaluate.test.ts`, all 370 repository tests, `pnpm lint`, and `pnpm build`.

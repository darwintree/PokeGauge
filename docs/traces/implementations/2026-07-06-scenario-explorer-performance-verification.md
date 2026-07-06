# Implementation Trace: Scenario Explorer Performance Verification

Date: 2026-07-06
Source: .issues/20260706_working_add-repeatable-scenario-explorer-performance-verification.md
Language: zh-hans

## Entries

### 1. Verification Command Scope

Type: unresolved-implementation-decision

Context:
The ticket asks for a repeatable local verification command or test, but does not specify whether the check should live in the default Vitest suite, what performance budgets to enforce, or how browser-facing production behavior should be measured without adding a browser automation dependency.

Decision:
Add a dedicated `pnpm perf:scenario-explorer` command that runs outside the default `pnpm test` suite. It measures the existing catalog initialization path with the default zh-hans matchup and runs a Vite production build into a temporary directory, then checks the initial JavaScript referenced by `index.html`. The default budgets are 500 ms for catalog initialization, 900 KiB raw initial JS, and 250 KiB gzip initial JS, with environment variables available for local override.

Reason:
The current regression is expected to remain red until follow-up performance fixes land, so attaching the check to the default test suite would make unrelated work fail. A dedicated command is still red-capable and agent-runnable. The budgets are intentionally below the recorded regression values but above the expected local-only catalog path, making the command useful as a recovery gate rather than a microbenchmark.

Follow-up:
None.

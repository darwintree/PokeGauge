---
# This section is managed by the CLI. Do not edit manually.
id: "8b80d50c-5ff8-4044-83a9-6d4de0016be4"
title: "Localize hardcoded Chinese labels in StatRangeInput"
status: "closed"
priority: "medium"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:54:00Z"
---
## Context
stat-range-input.tsx hardcodes Chinese strings in user-visible accessibility labels: aria-label 下限/上限, and the fine-tune buttons 减 1 / 加 1. The app supports four locales (en, ja, zh-hans, zh-hant).

## Proposed change
Move these strings into src/lib/i18n/messages and resolve them with useIntl / FormattedMessage.

## Scope
- src/features/scenario-explorer/tracks/stats/stat-range-input.tsx
- src/lib/i18n/messages/en.ts, ja.ts, zh-hans.ts, zh-hant.ts

## Notes
Related minor finding: MovePickerDialog hardcodes id="move-search" instead of useId, a duplicate-ID risk.

## Resolution
- Added `stat.range.min`, `stat.range.max`, `stat.range.decrement`, `stat.range.increment` to en / ja / zh-hans / zh-hant messages.
- `StatRangeInput` now resolves the handle aria-labels (`{stat} 下限/上限`) and the fine-tune button labels (减 1 / 加 1) via `useIntl`; no hardcoded Chinese strings remain.
- `MovePickerDialog` now derives its search input id from `useId` instead of the hardcoded `move-search`, removing the duplicate-ID risk.
- Verified: `tsc -b` clean; oxlint no new warnings; full vitest suite 334/334 pass (including locale key parity); two-axis code review (standards + spec) found no findings.

---
# This section is managed by the CLI. Do not edit manually.
id: "8b80d50c-5ff8-4044-83a9-6d4de0016be4"
title: "Localize hardcoded Chinese labels in StatRangeInput"
status: "open"
priority: "medium"
labels: ["TECH-DEBT", "READY-FOR-AGENT"]
created_at: "2026-08-04T01:37:00Z"
updated_at: "2026-08-04T01:43:00Z"
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
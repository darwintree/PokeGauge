# Implementation Trace: Stat value template derived display labels

Date: 2026-07-01
Source: `.issues/20260628_open_define-derived-display-labels-for-stat-value-templates.md`
Language: 中文

## Entries

### 1. Single resolver for preset + results

Type: decision

Context:
Label logic was split across spread helpers, allocation enum, and `templateCardLabel`, with duplicate enumeration in preset cards.

Decision:
Add `resolveTemplateDisplay()` returning `{ primary, allocations, tooltip }`; preset cards and `rowLabels()` both call it.

Reason:
One mechanical path for SP / actual modes and tooltip content; avoids double enumeration in UI.

Follow-up:
None.

### 2. Stat name strategy storage

Type: decision

Context:
Issue requires global read preference in `localStorage`, not in matchup or pipeline state.

Decision:
`stat-name-strategy.ts` with `loadStatNameStrategy` / `saveStatNameStrategy`; React state in `useScenarioState` mirrors storage.

Reason:
Matches held-item storage pattern; keeps pipeline pure when strategy is passed as an argument.

Follow-up:
None.

### 3. Actual-value mode semantics

Type: interpretation

Context:
Old UI appended actual values below SP labels via `TrackOptionSummary`.

Decision:
Actual mode replaces the card / row primary label; allocation cycle hidden when actual mode is on.

Reason:
2026-07-01 grill supersedes 2026-06-28 “below card” wording.

Follow-up:
None.

### 4. Remove template `name` field

Type: decision

Context:
Issue forbids persisting default names; `placeholderTemplateName` was interim.

Decision:
Drop `name?` from types; strip legacy `name` on storage read; persist/create flows write values only.

Reason:
Labels are fully derived; no subjective naming in storage.

Follow-up:
None.

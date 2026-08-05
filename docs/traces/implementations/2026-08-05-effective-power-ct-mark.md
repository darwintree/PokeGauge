# Implementation Trace: Effective power CT mark

Date: 2026-08-05
Source: user request + prototype `effective-power-display` (removed after fold)
Language: zh-hans

## Entries

### 2026-08-05 — CT mark in tooltip only

- Decision: Formula tooltip final row uses `normal(CT critical)` with a compact purple `CT` chip (`bg-damage-critical`); card header keeps a single normal `effectivePower`.
- Why: Prototype variants settled on CT over slash / paren-text / domain-dot; header already surfaces one primary number and adding crit there crowded the dense summary chrome.
- Alternatives considered: `224 / 336`, `224(暴击336)`, critical-dot marker, dual values in the header.
- Fold: Winner landed in `damage-scenario-summary.tsx`; throwaway prototype route removed from `App.tsx`.

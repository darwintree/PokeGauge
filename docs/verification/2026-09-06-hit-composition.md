# Hit Composition verification

Implementation branch: `codex/hit-composition`, based on synchronized `main` at `1053b29`.
Contract: [confirmed discussion](../traces/discussion/2026-09-06-hit-composition.md).
Architecture: [ADR 0008](../adr/0008-hit-composition-and-berry-state.md).

## Automated verification

- 83 test files, 814 tests pass. New cases cover independent hit rolls and critical events, stop-on-miss behavior, random count weights, landed immunity, conditional Berry state after a miss, mixed-critical equivalent power, Classic references, Skill Link, Parental Bond exclusions and child Berry consumption.
- Share, bookmark and persisted-workspace tests accept compatible native multi-hit powers and reject conflicting old overrides without migration.
- `pnpm build` passes. `pnpm lint` and `git diff --check` pass; existing lint warnings remain.
- The preexisting standalone performance script cannot initialize because `src/lib/assets.ts` reads Vite's `import.meta.env` directly in Node. Application code was measured in the browser instead.

## Frontend review and corrections

Reviewed the actual page with agent-browser at desktop width 1280 and mobile width 390, in English and Simplified Chinese. The existing light game HUD and damage/result hierarchy remain intact.

Corrections applied: prevent total-power ranges from wrapping; expose the total beside the mobile move caption; describe at-least-one-critical whiskers; distinguish actual 90% accuracy from Classic's assumed-success calculation; mark incompatible bookmarks unloadable before selection.

Verified:

- Triple Axel shows all three read-only powers, 20 / 40 / 60. Accuracy and critical stage remain editable.
- Both modes show 3 hits for Triple Axel, ordinary equivalent power 120 and mixed-critical power 130–180 against the neutral target. Battle Odds KO probabilities still include early misses.
- Classic details show 3 hits, ordinary power 120 and mixed-critical power 130–180, retaining the actual 90% per-check accuracy and explaining the mode assumption.
- Mobile popovers stay within the viewport; Escape closes them and returns focus to the trigger. No horizontal page overflow or browser errors were observed.
- Three representative moves, including Population Bomb, took approximately 3–6 ms per pipeline evaluation after resources loaded.

Lighthouse 13.4.1, mobile throttling, same shared scenario in production previews:

| Measurement | Updated implementation | Isolated main baseline |
| --- | --- | --- |
| Performance | 67 | 69 |
| Accessibility | 100 | 100 |
| LCP | 5.0 s | 5.0 s |
| Total blocking time | 360 ms | 330 ms |
| CLS | 0 | 0 |
| Initial JS gzip | about 382 KB | about 375 KB |

These single-run measurements show that initial loading remains above the frontend performance target on both versions. They do not establish a statistical regression. This work adds about 7.5 KB gzipped to the initial script; the existing large-bundle warning also occurs on main.

## Remaining scope limits

This implements the existing reviewed move/item inputs, including all 18 resistance Berries. Loaded Dice is not in the current item catalog and is not added by this change. Other battle-state changes, additional targets and complete battle simulation remain outside this delivery; warnings are attached to concrete unmodeled effects rather than all multi-hit moves or Parental Bond. Per-hit equivalent power retains the existing display assumptions for other ability/stat changes and is not an alternative damage engine.

## Copy review correction

Following user review, removed the blanket multi-hit and Parental Bond warnings and the repetitive totals footnote. Native multi-hit identity alone no longer marks a Scenario partially supported. Move-specific stat-change warnings remain; the attacker-stat wording now identifies the missing carry-over between uses. Reviewed Triple Axel alongside Power-Up Punch with Parental Bond to verify selective warning display.

## Output-reference revision

Per discussion decision 18, damage, mixed-critical and equivalent-power references now assume successful accuracy checks in both modes. Tests verify identical references at 50% and 90% accuracy while KO odds differ, and preserve random 2–5 hit ranges. The probability resolver's stopping and Berry-state tests remain unchanged.

## PR review and main integration

Rebased onto main `1d8a5ac` (HUD borders and motion) before opening the PR. The hit details surface uses the updated fine border. Desktop details now use the same Tooltip interaction and icon as ordinary moves, with hover and keyboard focus; mobile retains a tap-open Popover. Reviewed both at 1280px and 390px, including Escape and overflow. After integration, all 814 tests, build, lint and diff checks pass (existing warnings remain).

The standards review identified a repeated native-power compatibility predicate; `movePowerIsCompatible` now owns it for compilation, shares, bookmarks and workspace restoration. The spec review identified a stale desktop-only sentence in the design spec; it now states the mobile multi-hit exception.

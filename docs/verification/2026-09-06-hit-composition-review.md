# Review against main

Initial review: `git diff 1053b29...bc98fb1`. Then rebased onto `1d8a5ac` and reviewed the incremental changes. Standards and Spec were reviewed by independent agents.

## Standards

- Repeated native-power validation: resolved with `movePowerIsCompatible`, retaining each boundary's error handling.
- The tooltip adjustment initially replaced the existing Button with raw markup: resolved by using the same shadcn Button for ordinary and multi-hit details.
- No remaining findings. The breaking changeset is major.

## Spec

- The desktop-only sentence conflicted with the mobile multi-hit display: clarified the existing mobile exception in `design.md`.
- No remaining findings. Other ability/stat state changes remain subject to the documented display assumptions; this change promises Berry carry-over, not full battle simulation.

## Feedback triage

Claims: G = Grounded, A = Accurate, R = Reachable, M = Material, O = Owned. Response claims E = Effective, C = Complexity justified, S = Semantic fit, V = Verifiable. T/F mean true/false.

| Comment | Target | Comment Claims | Response Claims | Decision | Evidence |
| --- | --- | --- | --- | --- | --- |
| “These four boundaries independently encode the ADR 0008 compatibility predicate. A future rule change could make bookmark loadability disagree with restoration or compilation. Consider a shared move-domain predicate while retaining each boundary’s existing error handling. This is maintainability guidance, not a demonstrated behavioral defect.” | Compiler, share, bookmarks, storage | G/A/R/M/O=T; M concerns maintaining a breaking input rule | E/C/S/V=T | Fix code | `movePowerIsCompatible` owns the rule; existing share/storage/bookmark tests pass. |
| “One remaining standards concern: [move-execution-details.tsx:17] replaces the existing shadcn `Button` with a handcrafted `<button>`. AGENTS.md requires extending the existing primitive through variants, `className`, or composition before introducing parallel markup. Preserve the matching tooltip appearance through `Button` styling; retain an appropriate touch target for the mobile popover.” | Detail triggers | G/A/R/M/O=T | E/C/S/V=T | Fix code | Both ordinary and multi-hit triggers now use Button ghost/icon-xs, providing shared hover/focus styling and target size. |
| “The mobile caption adds equivalent power at `damage-scenario-summary.tsx:496`, conflicting with unchanged `design.md:152`: ‘Effective power, accuracy, formula, and other-conditions remain on the desktop card.’ However, verification documents explicitly record this frontend correction, and touch-accessible details are requested. Treat as a documentation inconsistency requiring clarification, rather than removing the feature.” | design.md | G/A/R/M/O=T | E/C/S/V=T | Fix documentation | The mobile exception is explicit in the result contract; the already reviewed touch-accessible behavior is preserved. |
| “I reproduced a discrepancy in `hit-execution.ts:22–28`: Double Kick against Multiscale displays equivalent powers 30/30 although calc’s second-hit damage doubles. The normal total therefore displays 60 instead of a fully state-aware 90. However, verification explicitly states ‘Per-hit equivalent power retains the existing display assumptions for other ability/stat changes,’ and the relevant ability selection already discloses full-HP assumptions. This is a documented limitation, not an undisclosed failure of the specifically promised Berry-state behavior.” | Equivalent-power state assumptions | G/A/R=T; M=F as a violation of this delivery contract; O=T; Unencoded rebuttal=F | n/a | No change | Verification remaining-scope section and ability full-HP disclosure encode the assumption; discussion entries 2/3 retain gradual support, while Berry state is specifically implemented. |

Validation: 814 tests passed after rebase and compatibility refactor; build and lint passed with existing warnings. The final Button adjustment passed focused result tests and TypeScript checks. Browser review covered desktop hover/focus and mobile tap, Escape, and overflow.

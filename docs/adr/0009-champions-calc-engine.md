# Select Gen 9 or Champions rules from the updated calc

PokeGauge uses calc built from upstream commit `e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d` and exposes a global calculation-rules setting for Gen 9 or Champions, both from the same updated package. This retains ADR 0007's choice of calc as the runtime damage source while making the ruleset selectable; the objective is to enable content blocked by the old package's lack of Champions support, including Dragonize. Pokémon Showdown remains an independent comparison source rather than replacing calc with a full battle simulator.

The setting defaults to Champions and remembers the user's choice, and ability/item support markings follow the selected rules. Bookmarks and share links do not carry the ruleset: they record configuration, not historical results, and recalculation uses the current rules without a notice merely because damage or KO probabilities change. This follows the current-rules contract in ADRs 0004 and 0005.

Candidates remain visible across rulesets. Champions catalog membership is not a sufficient support criterion: out-of-catalog content may be supported when its relevant mechanics are implemented and verified for the current scenario, while missing or partial effects require explicit support markings.

Switching rules preserves selections. An unsupported ability or item is marked unsupported and contributes no effect, rather than being deleted or replaced; switching back restores its supported effect. An unsupported move preserves its configuration but makes the corresponding Scenario unavailable.

Champions support has not yet reached the npm release, so the migration uses a reproducible build from a fixed upstream commit with its source recorded. Updates require validation rather than following `master` automatically; return to the official npm package when it includes the needed changes.

The build and checksum are recorded in [vendor/README.md](../../vendor/README.md); mechanism boundaries are documented in the [support audit](../research/2026-09-14-champions-engine-support-audit.md). Resolved discussion decisions are recorded in the [migration discussion trace](../traces/discussion/2026-09-14-champions-calc-migration.md).

# Implementation Trace: Command Sheet Search UI

Date: 2026-07-03
Source: `.issues/20260703_open_implement-command-sheet-pokemon-and-move-search-ui.md`
Language: English

## Entries

### 1. Full Move Pool Boundary

Type: unresolved-implementation-decision

Context:
The ticket requires move search to use the full generated fixed-power move pool scoped to the active move side, but the existing catalog only exposed a small attacker-specific default/extra move list.

Decision:
Expose localized generated Pokemon and move list helpers from the resource boundary, and have the catalog build `moves` from the fixed-power physical/special pool while keeping `defaultMoveIds` as the selected default set.

Reason:
This keeps generated data normalization in `src/lib/resources`, preserves Scenario Explorer's existing catalog-facing state API, and avoids UI components importing raw generated records.

Follow-up:
None.

### 2. Opposite-Side Default Move Pick

Type: unresolved-implementation-decision

Context:
The ticket requires the physical/special side switch to restore that side's default Move pick, but the current hardcoded attacker data only defines defaults for one category per attacker and Champions usage defaults are still a later wayfinder ticket.

Decision:
Use the attacker's hardcoded defaults when they match the active side; otherwise seed the side with the first six fixed-power moves from the generated global pool sorted by power descending, then name, then id.

Reason:
This makes the side switch behavior complete and deterministic now, while leaving the later Champions usage resolver free to replace the fallback with usage-ranked defaults.

Follow-up:
Replace fallback defaults with Champions usage-ranked Move picks when `.issues/20260703_open_implement-champions-move-pick-usage-import-and-fallback-resolver.md` is resolved.

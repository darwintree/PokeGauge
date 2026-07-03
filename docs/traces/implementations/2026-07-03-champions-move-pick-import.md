# Implementation Trace: Champions Move Pick Import

Date: 2026-07-03
Source: .issues/20260703_open_implement-champions-move-pick-usage-import-and-fallback-resolver.md
Language: en

## Entries

### 1. Expand Generated Move Scope From Joined Usage Rows

Type: unresolved-implementation-decision

Context:
The ticket requires generated Champions move usage records joined to normalized move ids and top-6 defaults, but the existing PokeAPI generator only seeded a small handpicked move id list. Live Champions rows for scoped Pokemon include fixed-power damaging moves outside that seed list, so resolving top 6 from only the seed list would silently truncate valid usage data.

Decision:
The generator first imports and joins Champions Doubles move rows for scoped Pokemon, then adds every joined move id to the generated PokeAPI move set before writing `GENERATED_MOVES` and `CHAMPIONS_MOVE_USAGE`.

Reason:
This keeps the normalized resource boundary authoritative and lets the catalog resolver filter against complete local move metadata for the imported usage rows. Unmatched Pokemon and moves remain diagnostics instead of runtime behavior.

Follow-up:
None.

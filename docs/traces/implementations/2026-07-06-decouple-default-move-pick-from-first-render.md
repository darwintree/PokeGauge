# Implementation Trace: Decouple Default Move Pick From First Render

Date: 2026-07-06
Source: .issues/20260706_working_decouple-default-move-pick-from-first-render.md
Language: zh-hans

## Entries

### 1. Default Move Pick Fallback Semantics

Type: CONFLICT

Context:
Ticket question asks for a deterministic local fallback when default Move pick data is absent, slow, or loading. The ticket's decision input links to the later wayfinder decision "Choose Move pick strategy without generation-time Champion fetch", which requires online Champion API usage, shell-first rendering, a Move-pick-local loading state, and failure/timeout behavior that does not show default Move pick results while keeping manual move selection available.

Decision:
Follow the linked wayfinder decision input. The implementation renders a shell catalog with no selected default moves while Champion usage is loading, then applies online Champion Move pick when it resolves. If Champion usage fails or times out, the catalog marks default Move pick unavailable and leaves manual move selection available.

Reason:
The linked decision is more specific, newer, and captures owner input. Adding a deterministic local Move pick fallback would contradict the explicit failure behavior selected for this recovery path.

Follow-up:
None.

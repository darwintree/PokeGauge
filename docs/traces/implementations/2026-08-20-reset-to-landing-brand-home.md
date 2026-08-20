# Implementation Trace: Reset to landing (brand home)

Date: 2026-08-20
Source: prototype placement review — variant A + secondary confirm
Language: zh-Hans

## Entries

### 1. Placement: brand as home

Type: decision

Context:
Prototype compared brand home (A), results toolbar (B), and setup matchup footer (C). User chose A.

Decision:
In the workspace, the app-bar brand becomes a control that starts return-to-landing. On the landing page the brand stays non-interactive.

Reason:
Matches the validated prototype winner; always reachable without depending on setup/results mobile tabs.

Follow-up:
None.

### 2. Always confirm before reset

Type: decision

Context:
User asked for secondary confirmation. Reset discards in-memory track state and the local scenario snapshot; bookmarks remain.

Decision:
Brand click opens a confirm dialog; only the confirm action runs reset. Cancel / dismiss leaves the workspace unchanged.

Reason:
Accidental brand clicks are easy; confirmation matches existing Dialog patterns (e.g. held-item form trigger).

Follow-up:
None.

### 3. Dialog ownership

Type: decision

Context:
Confirm could live in AppHeader (next to brand) or ScenarioExplorerPage (owns matchup state).

Decision:
Page owns the dialog and reset; header only receives `onBrandHomeClick` that opens confirm.

Reason:
Keeps header free of scenario semantics; one place clears snapshot / share param / attacker / defender.

Follow-up:
None.

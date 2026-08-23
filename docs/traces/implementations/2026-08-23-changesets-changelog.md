# Implementation Trace: Changesets changelog migration

Date: 2026-08-23
Source: User request to replace Release Please with Changesets and compile unreleased entries for dev/build
Language: Chinese

## Entries

### 1. Preserve entries after release

Type: unresolved-implementation-decision

Context:
The request requires compiling unreleased entries, but does not specify how the frontend should retain them after `changeset version` consumes their fragment files.

Decision:
Generate `CHANGELOG-UNRELEASE.md` from `changeset status` before dev/build, then let the frontend aggregate it with the tracked `CHANGELOG.md`. Changeset summaries use explicit locale markers so the same parser can read both files.

Reason:
This follows the user's clarified two-file structure, keeps Changesets as the release source of truth, and prevents entries from disappearing after release.

Follow-up:
None.

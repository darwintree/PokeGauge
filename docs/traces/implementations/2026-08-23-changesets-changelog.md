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

### 2. Build without a base Git ref

Type: unresolved-implementation-decision

Context:
Cloudflare builds clone the requested branch without a local `main` ref, so `changeset status` cannot calculate the branch divergence during `prebuild`.

Decision:
Generate `CHANGELOG-UNRELEASE.md` with the official `@changesets/read` package, reading all current fragments directly without a Git comparison.

Reason:
The unreleased feed needs every fragment already present in the checkout. Reading those fragments is sufficient and keeps dev/build independent of clone depth while Changesets still owns parsing.

Follow-up:
None.

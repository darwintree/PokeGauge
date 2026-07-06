# Implementation Trace: Fix pnpm Build Verification Friction

Date: 2026-07-06
Source: `.issues/20260706_working_fix-pnpm-build-verification-friction.md`
Language: zh-Hans

## Entries

### 1. Commit Build-Script Approval Instead of Documentation-Only Workaround

Type: tradeoff

Context:
The ticket asks for a repo-local fix or documentation so future agents can reliably run normal verification. `pnpm build` currently passes after local esbuild postinstall has run, but `pnpm install --frozen-lockfile` in non-TTY mode can still hit pnpm's build-approval flow unless the workspace records the approved dependency.

Decision:
Run `pnpm approve-builds --all` for the current pending package and commit the resulting `pnpm-workspace.yaml` approval: `allowBuilds.esbuild: true`.

Reason:
This keeps the normal `pnpm install` / `pnpm build` path reliable without requiring future agents to remember an interactive approval step or use a direct `vite build` workaround. It scopes approval to the known required native postinstall package, `esbuild`.

Follow-up:
None.

---
# This section is managed by the CLI. Do not edit manually.
id: "b2714928-e003-44cb-8062-1b2af3fccd4f"
title: "Fix pnpm build verification friction"
status: "closed"
priority: "medium"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "TECH-DEBT"]
created_at: "2026-07-06T08:23:00Z"
updated_at: "2026-07-06T09:33:00Z"
---
## Parent map

[[20260706_closed_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

Why does `pnpm build` fail in this workspace with ignored `esbuild@0.28.1` build scripts while direct `vite build` succeeds, and what repo-local fix or documentation should make normal verification reliable for future agents?

## Starting evidence

See [[20260706_closed_record-frontend-performance-regressions-after-champion-api-and-full-resources|Record frontend performance regressions after Champion API and full resources]], finding 6.

## Resolution

`pnpm build` depended on Vite's `esbuild@0.28.1` native postinstall having already run. The workspace had an unfinished approval placeholder in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  esbuild: set this to true or false
```

Running `pnpm approve-builds --all` approved the pending esbuild build script and rewrote the repo-local approval to:

```yaml
allowBuilds:
  esbuild: true
```

`pnpm config get onlyBuiltDependencies --json` now resolves that workspace setting to `["esbuild"]`, so future non-interactive installs know that esbuild is the allowed native build dependency instead of requiring an interactive approval step or a direct `vite build` workaround.

## Verification

- `CI=true pnpm install --frozen-lockfile` passed.
- `CI=true pnpm install --frozen-lockfile --modules-dir <tmp>` passed from an empty temporary modules directory and ran `esbuild@0.28.1` postinstall successfully.
- `pnpm build` passed after the workspace approval was recorded.
- `pnpm exec tsc -b --pretty false` passed.
- `pnpm test` passed: 11 files, 67 tests.
- `pnpm lint` passed with existing warnings only.
- `pnpm perf:scenario-explorer` passed:
  - catalog initialization: 50ms, budget 500ms
  - initial JS: 511,465 bytes raw / 158,368 bytes gzip
  - budgets: 921,600 bytes raw / 256,000 bytes gzip

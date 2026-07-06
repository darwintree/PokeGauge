---
# This section is managed by the CLI. Do not edit manually.
id: "b2714928-e003-44cb-8062-1b2af3fccd4f"
title: "Fix pnpm build verification friction"
status: "open"
priority: "medium"
labels: ["WAYFINDER:TASK", "READY-FOR-AGENT", "TECH-DEBT"]
created_at: "2026-07-06T08:23:00Z"
updated_at: "2026-07-06T08:23:00Z"
---
## Parent map

[[20260706_open_map-scenario-explorer-frontend-performance-recovery|Map Scenario Explorer frontend performance recovery]]

## Question

Why does `pnpm build` fail in this workspace with ignored `esbuild@0.28.1` build scripts while direct `vite build` succeeds, and what repo-local fix or documentation should make normal verification reliable for future agents?

## Starting evidence

See [[20260706_open_record-frontend-performance-regressions-after-champion-api-and-full-resources|Record frontend performance regressions after Champion API and full resources]], finding 6.

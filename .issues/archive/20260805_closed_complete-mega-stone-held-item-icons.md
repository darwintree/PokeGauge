---
# This section is managed by the CLI. Do not edit manually.
id: "f383fd06-25e8-4563-8a5b-1509fa016a8e"
title: "Complete Mega Stone held-item icons"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-05T04:59:00Z"
updated_at: "2026-08-05T06:33:00Z"
---
## Goal

补全 Mega Stone（及必要时同类形态道具）在 Held item Track / Picker 中的图标，避免长期依赖 `Gem` 占位。

## Resolution

**Done (2026-08-05).** Merged with sprite loading-path decision.

- All 47 Mega Stones have `spriteSourcePath` and resolve via `itemSpriteUrl` pin-hotlink.
- Track, Picker, locked chips, and result provenance use `HeldItemSpriteIcon` (shared `Gem` only when URL missing/`onError`, including `unknown-mega-stone`).
- Ogerpon Masks covered with frozen-85 gen9 paths.
- Companion close-out: [[20260803_closed_decide-held-item-sprite-loading-path]]
- Phase 2: [[../20260805_open_self-host-held-item-sprites-phase-2]]

## Acceptance

- [x] 可切换的 Mega Stone（Charizardite X/Y 等）在 track 与 picker 显示对应图标
- [x] 锁定 Mega Identity 的只读道具 chip 同样显示真实图标
- [x] 无 sprite 时的 fallback 仍可读；已知例外：`unknown-mega-stone`（及加载失败）→ 统一 `Gem`

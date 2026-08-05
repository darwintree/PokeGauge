---
# This section is managed by the CLI. Do not edit manually.
id: "f383fd06-25e8-4563-8a5b-1509fa016a8e"
title: "Complete Mega Stone held-item icons"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-05T04:59:00Z"
updated_at: "2026-08-05T04:59:00Z"
---
## Goal

补全 Mega Stone（及必要时同类形态道具）在 Held item Track / Picker 中的图标，避免长期依赖 `Gem` 占位。

## Context

验收 held-item pick 时，形态相关 Mega 道具在 track chip 与 picker 列表里常落到 `isMegaStone && !itemSprite` 的 `Gem` fallback（见 `held-item-track.tsx` / `itemSprite`）。普通道具已有 `/items/{spriteFilename}` 路径；Mega Stone 侧图标覆盖不完整。

与 [[20260803_open_decide-held-item-sprite-loading-path]] 相关但目标不同：本 issue 关注 **Mega 道具图标资产与产品侧映射补全**；那边决定权威来源、vendoring/托管与失败 fallback 的长期加载契约。

## Work to cover

- 盘点当前 `GENERATED_MEGA_STONES` / `itemSprite` 对哪些 Mega Stone id 缺 `spriteFilename` 或文件缺失
- 补齐缺失 sprite 文件（或生成管线输出），并接到现有 `/items/...` 运行时路径（或该加载路径 issue 决定的替代路径）
- 确认 Track chip、Picker 行、锁定 Identity 只读态都显示真实图标而非 `Gem`
- 明确 Ogerpon Mask 等已有 sprite 的形态道具是否也在本轮核对范围内（建议一并核对）

## Constraints

- 不改形态道具 confirm-to-switch 语义与 locked Identity 规则
- 不借本 issue 重开 frozen-85 效果白名单
- 若加载路径尚未决，优先按当前本地 `/items/` 约定补全；路径决策变更时再跟进迁移

## Related

- [[20260803_open_decide-held-item-sprite-loading-path]]
- [[20260805_open_polish-held-item-picker-ui-styling]]
- Spec out-of-scope note: `docs/spec/held-item-pick.md`（Sprite loading paths）

## Acceptance ideas

- [ ] 可切换的 Mega Stone（Charizardite X/Y 等）在 track 与 picker 显示对应图标
- [ ] 锁定 Mega Identity 的只读道具 chip 同样显示真实图标
- [ ] 无 sprite 时的 fallback 仍可读，但缺图数量应收敛到已知例外（若有）并文档化
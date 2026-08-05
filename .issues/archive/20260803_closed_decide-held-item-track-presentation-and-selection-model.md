---
# This section is managed by the CLI. Do not edit manually.
id: "b40bf775-ab1b-4219-923d-2cfcf00979ed"
title: "Decide held-item Track presentation and selection model"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:30:00Z"
updated_at: "2026-08-05T03:59:00Z"
---
## Goal

确定 Held item Track 中道具图片的展示、分区、排序与多选交互，使大量静态候选在桌面和移动端仍可识别、可操作。

## Decision

产品决策已确认。权威记录：

- 讨论：[[20260805_discussion_held-item-track-usage-defaults-and-form-switch|docs/traces/discussion/2026-08-05-held-item-track-usage-defaults-and-form-switch.md]]
- Spec change（accepted）：`docs/spec/changes/2026-08-05-held-item-pick-and-form-switch.md`
- 最终 spec：`docs/spec/held-item-pick.md`

摘要：Track 同构 Move Track（折叠已选 chip / 展开多选 + Picker）；不做效果族分区；空选中 → `["none"]`；部分支持警告保留；形态道具在池中为「将切换形态」导航提示。Picker：搜索 + 标签「专属」「威力」「能力」「树果」（AND）+「当前持有者可用」；无 `none`；目录 = 侧资格池 + 合法形态道具。

## Related

- [[20260731_closed_choose-default-held-items-from-usage-data]]
- [[20260803_closed_decide-whether-held-items-may-change-pokemon-form]]
- [[../20260805_open_iterate-held-item-default-recompute-untouched-policy]]

## Acceptance

- [x] Spec change 已 accepted，且 `docs/spec/held-item-pick.md` 反映展示与选择契约
- [x] 实现完成后：逐条审计讨论记录中与本 issue 相关的决定均已落地
- [x] 桌面与移动端均可完成池内多选、Picker 筛选添加、形态确认与锁定只读

## Resolution

Implemented against `docs/spec/held-item-pick.md`: usage/manual pool + add Picker (AND tags + holder-eligible), form-trigger confirm dialog, locked Identity read-only. Trace: `docs/traces/implementations/2026-08-05-held-item-pick-and-form-switch.md`.

## Non-goals

- 不决定 sprite 的来源或加载路径。
- 不在本 issue 单独重开使用率默认或形态映射（见相关 issue / 同一 change）。

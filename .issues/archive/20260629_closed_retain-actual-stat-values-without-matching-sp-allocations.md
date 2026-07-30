---
# This section is managed by the CLI. Do not edit manually.
id: "4cdd6cf4-edb8-4bc2-ae47-5adb5f62219c"
title: "Retain actual stat values without matching SP allocations"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-06-29T06:57:00Z"
updated_at: "2026-07-30T05:11:00Z"
---
## Context

Scenario Explorer 的数轴用于数轴选段与添加实数值模版。性格与努力值组合只能产生离散的 SP 标签，但实数值模版保存并计算的是最终实数值。

当前仍有两处临时兼容行为把无对应 SP 分配的实数值改写或伪装为邻近分配：

- `confirmAddOffense` / `confirmAddDefense` 在保存前吸附到最近可达值
- 标签引擎在枚举为空时回退到最近分配的 SP 标签

## Desired behavior

保留边界内的全部整数实数值，保存与计算均不吸附。性格与努力值只用于派生 SP 标签。

无对应 SP 分配时：

- 默认标签显示原始实数值：进攻如 `186`，防守如 `170 / 153`
- 标签旁显示一个低强调感叹号
- Tooltip 显示“无对应 SP 分配，按实数值参与计算。”
- 不显示错误态或 `undefined`
- 不提供分配切换
- 开启“显示实数值”时不重复显示同一数值
- 模版仍可保存、分享并正常参与 Preset 与 Range 切换

## Acceptance criteria

- [x] 添加进攻或防守模版时原样保存数轴选择，不吸附到邻近 SP 分配
- [x] 标签引擎在无对应 SP 分配时返回原始实数值
- [x] 模版卡片为无对应 SP 分配的标签显示感叹号与本地化 Tooltip
- [x] 开启“显示实数值”后，卡片与结果行均不重复显示同一数值
- [x] 无对应 SP 分配时不显示分配切换操作
- [x] 测试覆盖无对应 SP 分配的进攻和防守标签
- [x] 逐行核对 `docs/traces/discussion/2026-07-30-unreachable-stat-values.md` 中的每项决定均已实现

## Resolution

实数值模版现已原样保存数轴选择，删除了确认时吸附及其已无调用者的最近分配辅助逻辑。标签引擎在没有 SP 分配时直接显示实数值；模版卡片用低强调感叹号和本地化 Tooltip 解释该状态，并避免在卡片与结果行重复展示实数值。

验证：

- `pnpm test -- src/lib/stat-value-template/ability-points.test.ts src/lib/scenario-pipeline/pipeline.test.ts`：27 个测试文件、245 个测试通过
- `pnpm build`：通过
- `pnpm lint`：通过，仅有仓库既有警告
- 浏览器实测 186：原样保存、参与计算、显示感叹号、无分配切换、结果行不重复显示

## Related

- 讨论记录 → [`docs/traces/discussion/2026-07-30-unreachable-stat-values.md`](../../docs/traces/discussion/2026-07-30-unreachable-stat-values.md)
- 实数值计算链路 → [[20260730_closed_make-scenario-pipeline-consume-stored-actual-stat-values-directly]]
- 默认模版命名 → [[20260628_closed_define-derived-display-labels-for-stat-value-templates]]

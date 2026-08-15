---
# This section is managed by the CLI. Do not edit manually.
id: "475d4580-492c-45ae-895c-d9adf40314e1"
title: "Support Weather Ball before release"
status: "closed"
priority: "high"
labels: ["BUG", "NEEDS-TRIAGE"]
created_at: "2026-08-12T08:34:00Z"
updated_at: "2026-08-15T01:14:00Z"
---
## Problem

Weather Ball（Move ID 311）当前在无天气时可以按普通招式计算，但任意非 `none` 天气都会让 Scenario 以 `weather-type-change` unavailable。公开 release 前需要支持其天气下的直接伤害语义，避免核心天气 Track 与代表性天气招式互相排斥。

已确认的当前行为：

- Scenario compiler 继续按稳定 Move identity 应用招式特判；编辑 Snapshot 不会把 Weather Ball 转成普通自定义招式。
- Snapshot 编辑值只覆盖对应基础数值，Move-ID-bound 语义继续生效。
- 对带额外 ID 逻辑的可编辑招式，产品将新增统一 Tooltip，提示「修改可能导致不可预期的结算问题」。

## Issue Assessment

- Impact：Weather Ball 是天气机制的代表招式；天气 Track 已公开可用但该招式在天气下不可计算，会形成明显的功能断层。
- Scope：在所有当前支持的天气选择下编译 Weather Ball 的直接伤害语义，并确保 Snapshot 编辑、Scenario Move Type、STAB、克制、天气修正、Ability 交互与结果展示使用同一最终语义。
- Decision：valid；公开 release blocker。

## Confirmed contract

- Release 前支持 Weather Ball。
- 保留稳定 Move identity；编辑 Snapshot 后仍应用 Weather Ball 的 ID-bound 语义。
- 本票只覆盖影响当前输出的单次使用直接伤害语义，不扩展为完整战斗模拟。
- 不用本地化招式名称驱动计算规则。

## Open decisions

- Move Template 支持与具体 Scenario calculability 的关系，及 Weather Ball 是否建立通用的 Scenario-dependent support 模型。
- 无天气及各天气下的最终属性、威力与天气伤害修正如何组合，尤其避免天气加成重复计算。
- 被 Air Lock／Cloud Nine 等抑制的天气是否按无天气 Weather Ball 处理。
- Normalize、Pixilate 等招式属性改写与 Weather Ball 天气属性的优先级。
- Snapshot 编辑后的 power 是「天气翻倍前基础值」还是覆盖最终天气威力。
- Tooltip 使用统一风险文案时的触发范围与展示位置。

## Related issues

- [[../20260812_open_enforce-an-audited-move-calculation-boundary|Enforce an audited Move calculation boundary]]
- [[../20260812_open_unify-modifier-execution-and-explanation-representation|Unify modifier execution and explanation representation]]

## Out of scope

- Castform 形态变化。
- 天气造成的回合末伤害或其他不影响当前直接伤害输出的效果。
- 重新设计整个 Move Snapshot 编辑交互。

## Verification Checklist

- [x] 无天气、晴天、雨天、沙暴、雪天下的 Weather Ball 计算与最终属性有代表性回归案例。
- [x] 天气抑制、招式属性改写、STAB 与克制交互具有明确契约和测试。
- [x] Snapshot power／accuracy／criticalStage／spread 编辑不会绕过或意外移除 Weather Ball 身份语义。
- [x] Classic 与 Battle Odds 的伤害及 KO 概率使用同一编译结果。
- [x] 四种 Supported locale 的 Unavailable 文案完整；编辑风险 Tooltip 留给父票。
- [x] build、完整测试通过。无前端表面变更，不需要 frontend review-and-correct。

## Progress Log

- 2026-08-12：release readiness grilling 确认 Weather Ball 必须在公开 release 前支持，并从通用 Move calculation boundary 拆为独立 blocker。
- 2026-08-15：实现五种天气下的 Weather Ball 直接伤害语义；Cloud Nine／Air Lock 与 Mega Sol 走既有 effective Weather；Normalize／Pixilate 不改写天气属性。

## Resolution

Weather Ball（Move ID 311）在全部当前天气选择下可计算。Scenario Move Type 为 `none`→Normal、`sun`→Fire、`rain`→Water、`sand`→Rock、`snow`→Ice；非 `none` 时对 Snapshot power 施加 `8192`（2×）Base Power，晴雨 generic 伤害再按变化后的属性结算。Cloud Nine／Air Lock 压制后按无天气处理；Mega Sol 的 effective sun 现在会驱动 Weather Ball。编辑 Snapshot 不移除该 ID-bound 语义。统一编辑风险 Tooltip 由 [[../20260812_open_enforce-an-audited-move-calculation-boundary|Enforce an audited Move calculation boundary]] 实现。

Trace: [[../docs/traces/implementations/2026-08-15-weather-ball|2026-08-15-weather-ball]]。

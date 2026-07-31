# Implementation Trace: Mega Stone review fixes

Date: 2026-07-31
Source: `.issues/archive/20260730_closed_support-mega-pokemon-and-form-switching.md` and review-comment triage
Language: 中文

## Entries

### 1. 在同一 Held item Track 中区分上游与合成身份

Type: unresolved-implementation-decision

Context:
领域契约要求 PokeAPI 实体使用 numeric upstream id，但现有 Held item Track 还包含 `none`、效果类别和其他尚未资源化的字符串选项。来源没有规定两类身份如何在同一 Track、Scenario 状态和持久化结构中共存。

Decision:
将 `HeldItemId` 定义为字符串与 numeric upstream id 的联合类型。Mega Stone 使用 PokeAPI item numeric id；现有非上游或尚未迁移的 Track 选项保持字符串。进入 provenance 展示层时再统一序列化为字符串。

Reason:
这让新增的 PokeAPI 实体遵守 upstream identity 契约，同时避免把无关的既有道具系统迁移扩大到本 issue。

Follow-up:
None.

### 2. 使用轻量 DOM 环境验证真实交互

Type: tradeoff

Context:
Issue 明确要求测试 selector 偏好、锁定值和 Rayquaza 转换，但仓库的 Vitest 仅配置 Node 环境，没有 DOM 测试依赖。纯函数测试无法验证 dialog 关闭重开、badge 入口或 disabled 控件。

Decision:
增加 `happy-dom` 开发依赖，并直接使用 React `act`、`createRoot` 与现有 Vitest 编写最小交互测试，不增加 Testing Library。

Reason:
一个 DOM 依赖即可覆盖真实组件行为；继续复用现有测试栈，避免额外测试抽象和依赖。

Follow-up:
None.

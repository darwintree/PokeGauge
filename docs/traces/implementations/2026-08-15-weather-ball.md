# Implementation Trace: Weather Ball

Date: 2026-08-15
Source: `.issues/20260812_working_support-weather-ball-before-release.md`
Language: 中文

## Entries

### 1. 不建立通用 Scenario-dependent support 模型

Type: unresolved-implementation-decision

Context:
issue 未规定 Move Template 支持与 Scenario calculability 的关系，也未要求 Weather Ball 成为通用的 Scenario-dependent support 模型。

Decision:
Weather Ball 仍是一条 Move-ID-bound 天气规则。Template 保持可选择；当前支持的五种天气下 Scenario 均可计算。不新增通用 support 状态机。

Reason:
与 Solar Beam／Thunder 等既有 ID 规则同一形状，本票范围只要求补齐 Weather Ball 的直接伤害语义。

Follow-up:
None.

### 2. 属性、翻倍威力与晴雨伤害修正的组合

Type: unresolved-implementation-decision

Context:
issue 要求支持天气下的直接伤害，但未写明最终属性、威力翻倍与 generic 天气伤害如何组合，尤其要避免重复计算。

Decision:
- `none`：Normal，Snapshot power，无天气伤害修正。
- `sun`／`rain`／`sand`／`snow`：属性分别为 Fire／Water／Rock／Ice；对 Snapshot power 施加 `8192`（2×）Base Power 修正。
- 晴雨 generic 伤害再按**变化后**的 Scenario Move Type 结算（火晴／水雨 1.5×）。沙暴／下雪无 generic 伤害修正。

Reason:
对齐已引用的 Showdown Weather Ball：`onModifyType` 改属性、`onModifyMove` 将 power ×2，generic 天气伤害是后续独立 phase。2× 放在天气 Base Power，而不是改写 Snapshot 或再乘一遍伤害，避免与 1.5× 叠成 3×。

Follow-up:
None.

### 3. Cloud Nine／Air Lock 与 Mega Sol

Type: interpretation

Context:
issue 未冻结天气抑制后的 Weather Ball 语义。既有 composition 票曾规定：压制后按无天气计算；Mega Sol 不补齐 Weather Ball，组合可 unavailable。

Decision:
沿用现有 effective Weather：Cloud Nine／Air Lock 将 effective weather 置为 `none`，Weather Ball 按无天气 Normal／未翻倍计算。Mega Sol 提供 effective sun 后，Weather Ball 按晴天语义计算；先前的独立 unavailable 限制随本票解除。

Reason:
本票一旦支持天气变体，就应消费既有 effective Weather，而不是为 Weather Ball 另开一套抑制规则。Mega Sol 旧限制属于当时机制未实现，不是永久例外。

Follow-up:
None.

### 4. Normalize／Pixilate 与天气属性的优先级

Type: interpretation

Context:
issue 未规定 Normalize、Pixilate 等与 Weather Ball 天气属性的优先级。既有 Scenario Move Type 契约已把 Weather Ball 排除在 Normalize／-ate 改写之外。

Decision:
先按 effective Weather 解析 Weather Ball 身份属性，再跑 Ability 改写。Weather Ball 保持既有排除名单，天气下的 Fire／Water／Rock／Ice 也不会被 Normalize／-ate 改回。

Reason:
与已冻结的排除名单一致，且让 STAB、克制、道具／能力的 move-type gate 都看到同一最终属性。

Follow-up:
None.

### 5. 编辑后的 Snapshot power 是翻倍前基础值

Type: unresolved-implementation-decision

Context:
issue 未规定用户编辑的 power 是天气翻倍前基础值，还是覆盖最终天气威力。

Decision:
Snapshot power 仍是翻倍前基础值；2× 作为天气 Base Power 修正作用在当前 Snapshot power 上，与 Solar Beam／Solar Blade 对编辑值套天气倍率的既有模式相同。accuracy／criticalStage／spread 编辑不改变 Move identity 或天气属性规则。

Reason:
已确认契约是「编辑只覆盖对应基础数值，ID-bound 语义继续生效」。把 2× 写进 Snapshot 会让无天气与有天气共用一个已翻倍数字。

Follow-up:
None.

### 6. 编辑风险 Tooltip 不在本票实现

Type: unresolved-implementation-decision

Context:
grilling 记录了带额外 ID 逻辑的可编辑招式要有统一风险 Tooltip，但触发范围与展示位置仍是 open decision；父票「Enforce an audited Move calculation boundary」已把该 Tooltip 列为本票范围。本票 out of scope 包括重新设计 Move Snapshot 编辑交互。

Decision:
本票不新增编辑面 Tooltip。Weather Ball 的 ID-bound 语义由 compiler 保证；统一文案留给父票。

Reason:
最短路径只补计算语义。本票 verification 中的 locale 文案覆盖剩余 unavailable 原因；Weather Ball 不再产生 `weather-type-change`。

Follow-up:
由 [[../../.issues/archive/20260812_closed_enforce-an-audited-move-calculation-boundary|Enforce an audited Move calculation boundary]] 实现统一编辑风险 Tooltip。

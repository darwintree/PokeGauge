---
# This section is managed by the CLI. Do not edit manually.
id: "062eb67e-d711-40a3-852d-7b3188ca07c6"
title: "Publish auditable calculation cases and case submission"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-12T07:49:00Z"
updated_at: "2026-08-12T10:10:00Z"
---
## Problem

计算正确性目前主要通过仓库内测试保证，但用户无法查看一个结果由哪些公开案例覆盖、这些案例预期什么，也无法从当前计算快速提交一个可复现的 case。一次性的内部 oracle 审计无法持续建立产品信任。

需要把计算 case 建成公开、可执行、可浏览的产品资产：计算正确性 case 可在前端逐条展示和审计；实际结果提供通往相关审计页以及提交当前 case 的入口。

## Issue Assessment

- Impact：让计算依据、覆盖范围、已知差异和回归证据对用户与维护者同时可见，并把用户报告转化为稳定的可复现输入。
- Evidence：当前 40+ 个测试文件包含大量 mechanics、cross-mechanism 与 oracle case，但描述、输入、期望值和来源散落在 Vitest 代码中，不能直接被产品读取或稳定链接。
- Scope：定义公开 Calculation Case；让同一份 case 数据可由自动测试执行并由前端展示；建立 case 列表、详情、从结果到相关 case 的入口，以及提交当前计算配置的流程。
- Decision：valid；纳入 release 后的扩大化可信度工程，不作为首次 release blocker。

## Product contract direction

- 每个对产品计算契约有约束力的 case 都有稳定 identity、可读标题、输入、预期输出、机制标签、规则来源／版本和支持状态。
- 公开页面展示 case 的完整可审计输入与预期结果，不把测试源码文本当作产品界面。
- 自动测试与公开页面消费同一份结构化 case 定义；不得人工复制成第二份展示数据。
- 实际计算结果提供低干扰入口，能定位到与当前机制相关的 case；没有精确对应时进入经过筛选的 case 集合。
- “Submit case” 从当前 Scenario 生成稳定、可复现且不含本地化 identity 的载荷；提交渠道与隐私边界需在实现前确认。
- 技术性的 UI／状态单元测试可以不进入面向用户的计算目录，但必须与“计算契约 case”明确分类，不能让未公开的隐含计算期望成为唯一产品契约。

## Related issues

- [[20260812_open_unify-modifier-execution-and-explanation-representation|Unify modifier execution and explanation representation]]：为 case 与实际结果提供同源的阶段／modifier 解释。
- [[20260807_open_audit-showdown-vs-smogon-calc-damage-rule-mismatches|Audit Showdown vs @smogon/calc damage-rule mismatches]]：已有 oracle 差异审计，后续应转为公开 case 而非一次性报告。
- [[20260721_open_share-and-restore-scenario-explorer-configurations-by-url|Share and restore Scenario Explorer configurations by URL]]：可复现 Scenario 编码可复用于 case 链接和提交。
- [[20260812_open_enforce-an-audited-move-calculation-boundary|Enforce an audited Move calculation boundary]]：未审计 Move 必须 fail closed。

## Decisions needed before implementation

- 面向用户目录对“所有 test case”的精确边界与分类方式。
- case 与机制／结果行的关联粒度：精确命中、规则标签或两者组合。
- submit case 的目标渠道、审核状态和去重流程。
- 是否公开外部 oracle 的完整预期输出、已知差异及版本 pin。

## Out of scope

- 把任意 Vitest 实现细节或前端快照原样暴露给用户。
- 在本票内决定每一条战斗机制的正确规则。
- 用户账号、投票或完整社区讨论系统。

## Verification Checklist

- [ ] Calculation Case 的稳定结构、公开范围、版本与来源契约已确认。
- [ ] 所有计算契约 case 均由同一结构化定义驱动自动测试与前端展示。
- [ ] case 列表和详情可按 Move、Ability、Held item、Weather 等机制检索和审计。
- [ ] 实际结果可进入相关 case；关联失败时有诚实、可理解的降级行为。
- [ ] 用户可由当前 Scenario 发起可复现的 case submission。
- [ ] 提交数据、隐私、审核、去重和失效版本行为均有明确契约。
- [ ] 至少一个现有跨机制 oracle case 完成端到端公开化验证。

## Progress Log

- 2026-08-12：release 讨论决定将一次性 oracle 审计延后并扩大为公开、持续可执行的计算 case 体系。

---
# This section is managed by the CLI. Do not edit manually.
id: "f7d741a0-f1ff-484a-a56a-aeb140c07f8e"
title: "Wayfinder: Core battle mechanics specification"
status: "closed"
priority: "high"
labels: ["WAYFINDER:MAP", "FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-07-17T03:45:00Z"
---
## Destination

形成一套 decision-complete、可直接交给后续实现拆票的业务核心规格，覆盖效果等价 Scenario 合并、可编辑 Move snapshot、攻防能力阶级、天气、双方特性与墙。到达终点时，领域语义、产品交互、公式边界、修正顺序、等价规则与验收案例都已明确；本 map 不包含代码实现。

## Notes

- 本 map 遵循 Wayfinder 默认模式：只做规格与决策，不承载实现。
- 每次工作先阅读 `CONTEXT.md` 与 `docs/adr/0001-local-damage-kernel-for-generated-resources.md`；保持资源／UI 状态在 adapter 边界编译为公式输入，内核不认识上游名称或 UI id。
- 产品决策使用 `grilling` 与 `domain-modeling`；涉及交互形态的票使用 `prototype`；外部机制事实使用 `research` 并写入 `docs/research/`。
- 变量威力上游事实见 [[../../docs/research/2026-07-15-pokeapi-variable-power-move-data|PokeAPI Variable-power Move Data]]；普通命中与会心事实见 [[../../docs/research/2026-07-10-champions-gen9-critical-hit-and-accuracy-semantics|Champions / Gen 9 Critical-Hit and Accuracy Semantics]]。
- 本地 tracker 规则见 `docs/agents/issue-tracker.md`：`Tickets` 是直接子票的永久有序列表；子票用 `Parent map` 回链；`Blocked by` 表达阻塞；`open → working` 表达 claim。
- 已确认 kickoff：Track 指结果页配置维度；Move template 不可变，Move snapshot 可编辑且同模版可创建多个快照；不同快照永不合并。
- 已确认 kickoff：Move snapshot 可编辑威力、命中、会心等级和 eligible spread 开关；`power: null` 初始化为未配置的 `0`；未审核语义的 `accuracy: null` 同样初始化为未配置的 `0`。
- 已确认 kickoff：会心等级为 `0`～`+3`，`+3` 即必定会心；能力阶级为 `-6`～`+6`，攻击方／防御方各为独立 multi-select track，默认只选 `0`。
- 已确认 kickoff：天气只覆盖直接威力／伤害与命中；双方特性候选包含全部合法特性（含隐藏特性），默认选 Champions 最常用合法特性、无数据时全选，本轮只有适应力产生计算效果；墙只有无墙、反射壁、光墙。
- 已确认 kickoff：效果等价合并采用局部策略 A——同一 Move snapshot 下，只要生效机制与计算输入相同即可合并，即使其他机制仍在生效；保留全部原始选择来源，不能按取整后伤害碰巧相同合并。

## Tickets

- [[20260629_closed_define-effect-equivalent-scenario-merging-and-provenance-display|Define effect-equivalent Scenario merging and provenance display]]
- [[20260715_closed_define-move-snapshot-creation-and-editing-contract|Define Move snapshot creation and editing contract]]
- [[20260715_closed_define-stat-stage-tracks-and-critical-hit-interactions|Define stat-stage tracks and critical-hit interactions]]
- [[20260715_closed_research-weather-power-and-accuracy-support-matrix|Research weather power and accuracy support matrix]]
- [[20260715_closed_define-ability-tracks-and-adaptability-only-support-contract|Define ability tracks and Adaptability-only support contract]]
- [[20260715_closed_define-screen-track-and-critical-hit-interactions|Define Screen track and critical-hit interactions]]
- [[20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Integrate battle modifier ordering and specification seams]]

## Decisions so far

- [[20260629_closed_define-effect-equivalent-scenario-merging-and-provenance-display|Define effect-equivalent Scenario merging and provenance display]] — 以编译后的完整计算输入合并，并采用行内生效来源与默认折叠的其他已选项。
- [[20260715_closed_define-move-snapshot-creation-and-editing-contract|Define Move snapshot creation and editing contract]] — 采用窄栏列表钻入编辑的最小契约，明确快照创建、即时编辑、未配置、生命周期与变量威力边界。
- [[20260715_closed_define-stat-stage-tracks-and-critical-hit-interactions|Define stat-stage tracks and critical-hit interactions]] — 锁定双 stage Track、Gen 9 阶级与会心编译，以及 `+3` 的展示、KO 与效果等价契约。
- [[20260715_closed_research-weather-power-and-accuracy-support-matrix|Research weather power and accuracy support matrix]] — 建立通用晴雨修正、9 个 move-id 例外与气象球暂不计算边界的可执行矩阵。
- [[20260715_closed_define-ability-tracks-and-adaptability-only-support-contract|Define ability tracks and Adaptability-only support contract]] — 以 PokeAPI 当前合法特性构建双方 Track、Champions 最常用特性决定默认，并仅支持攻击方适应力的 `2× STAB` 与三态来源合并。
- [[20260715_closed_define-screen-track-and-critical-hit-interactions|Define Screen track and critical-hit interactions]] — 锁定显式无墙默认项、双打墙修正、会心分支、破墙招式与效果等价来源契约。
- [[20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Integrate battle modifier ordering and specification seams]] — 以 Scenario compiler 与 fixed-point kernel 两个深 seam 收口公式顺序、传播、合并、候选池、Range 与跨机制验收。

## Out of scope

- [[../20260715_open_specify-random-multi-hit-and-accuracy-mechanics|Specify random multi-hit and accuracy mechanics]] — 随机段数、整招命中与逐段命中相对独立，延后到单独 effort。
- [[../20260715_open_specify-terrain-track-and-grounded-eligibility|Specify terrain track and grounded eligibility]] — 场地与接地判定暂不进入本轮规格。
- [[../20260715_open_expand-supported-ability-effects-beyond-adaptability|Expand supported ability effects beyond Adaptability]] — 适应力之外的真实特性效果延后；当前只定义未支持状态。
- [[../20260717_open_define-ruleset-aware-move-candidate-pool-and-learnset-validation|Define ruleset-aware Move candidate pool and learnset validation]] — 当前保留全局候选池，不在本 map 校验 ruleset 合法性或 identity learnset。
- [[../20260717_open_define-range-endpoint-identity-and-merge-semantics|Define Range endpoint identity and merge semantics]] — 不同 Range 选段吸附到相同端点后的合并语义不影响当前单选段结果，延后独立处理。
- 天气的回合末伤害、防御能力修正、回复、状态免疫与招式属性变化。
- 代码实现与实现 tickets；后续从最终规格另行拆分。

## Resolution

Destination reached。全部直接子票均已关闭并归档；整合后的权威契约见 [[20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Integrate battle modifier ordering and specification seams]]。两个独立 follow-up 已明确移出本轮范围，本 map 未执行代码实现。

---
# This section is managed by the CLI. Do not edit manually.
id: "0e286ed4-14d8-49f4-a8eb-625c3c095607"
title: "Specify random multi-hit and accuracy mechanics"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-15T02:45:00Z"
updated_at: "2026-08-07T10:37:00Z"
---
## Context

从 [[archive/20260715_closed_wayfinder-core-battle-mechanics-specification|Wayfinder: Core battle mechanics specification]] 延后。随机段数相对其他当前功能独立，不应阻塞能力阶级、天气、适应力、墙或 Move Snapshot 的基础规格。

当前概率核心会很早地把一个 Scenario 压缩成单一命中概率、单一条件会心概率和一组普通／会心伤害值，再通过 Damage Distribution 卷积计算累计击倒概率。该模型适合单 Hit，但无法直接表达共享一次命中判定、逐 Hit 判定、失败终止、随机 Hit 数，以及前序 Hit 改变后序 Hit 输入的状态关系。

现有抗性果进一步暴露了这个边界：静态伤害修正会使树果在每个 Hit 或每次累计计算中重复生效；真实语义是第一个符合条件的 Hit 获得减伤并消耗树果，整组未命中时树果保留，后续 Hit 与后续技能执行均看到已消耗状态。现有产品决策仅以 warning 暂时披露该限制，见 [[archive/20260731_closed_decide-supported-effect-and-warning-semantics|Decide supported-effect and warning semantics]]。

## Question

建立一个以 Hit 为最小伤害结算单位的统一模型，能够组合：

- 单 Hit 技能；
- 整组共享一次命中判定、随后抽取随机 Hit 数的技能；
- 每个 Hit 分别判定命中、任一 miss 即停止的技能；
- 各 Hit 不同威力、独立或共享会心／随机事实的技能；
- 抗性果等只对第一个符合条件 Hit 生效、并影响后续 Hit 或后续技能执行的状态；
- Parental Bond 等在既有结构中附加 Hit 的机制。

模型需要保持可组合性，同时继续遵守 [[../docs/adr/0001-local-damage-kernel-for-generated-resources|ADR-0001]]：本地 damage kernel 保持产品限域、纯公式输入和资源无关；本票不扩张为完整战斗模拟器。

## Discussion outcome · 2026-08-11

### Core model

本票采用以下三个基础概念作为 working contract。

#### Hit

**Hit** 是一次独立伤害公式结算的最小单位。它拥有自己的威力／修正、普通或会心分支与伤害 roll。

这里的“独立”只表示公式结算边界，不表示概率独立：一个 Hit 是否可达、是否与其他 Hit 共享随机事实，以及它读取的状态，都可以依赖外层组合和前序结果。

Hit 不承担命中判定。命中判定通过后，控制流才进入对应 Hit；因此 Hit 与“命中检查”是不同概念。

#### Hit Composition

**Hit Composition（Hit 组合）** 递归组织一个或多个 Hit 及其关系。一个组合可以继续参与顺序、条件或随机组合，因此单 Hit、连续攻击技能、附加第二 Hit，以及连续两次技能执行都可以使用同一套组合规则。

Move Snapshot 的一次执行仍然是产品与查询层的外部边界，例如 OHKO／≤2HKO 中的一次或两次技能执行；它不是概率模型内部的最小组合原子。Move Template、Move Snapshot、Ability、Held Item 与 Scenario 条件共同决定要编译出的 Hit Composition。

#### Resolution State

**Resolution State** 是沿 Hit Composition 传递、会影响后续 Hit 结算的最小历史状态。它只包含当前伤害序列需要的事实，不等同于完整 Battle State。

抗性果的首个必要状态为 `available / consumed`：第一个符合既有 gate 的 Hit 在 `available` 状态下应用减伤，并把后续状态改为 `consumed`。如果控制流没有进入任何符合条件的 Hit，状态保持 `available`。

### Three relationship axes

多个 Hit 之间的关系按三个正交维度表达，避免把所有连续攻击技能归入一个粗粒度类型。

1. **控制关系**：顺序、条件进入、失败终止、跳过和随机选择子组合，决定哪些 Hit 实际执行。
2. **随机作用域**：一个随机事实由单个 Hit、一个子组合或更外层组合共享。共享命中、随机 Hit 数、逐 Hit 会心和逐 Hit damage roll 可以拥有不同作用域。
3. **状态传递**：前序 Hit 更新 Resolution State，后序 Hit 从更新后的状态继续结算；抗性果消费属于该维度。

共享随机事实与状态变化必须分开：多个 Hit 读取同一次命中结果不修改状态；第一个 Hit 消耗树果则会改变后续 Hit 的输入。

### Accuracy semantics

命中概率进入 Hit Composition 的控制层，而不是进入 Hit 的伤害公式。

当前 [[../CONTEXT|CONTEXT.md]] 中的 **Hit Fact** 暂时继续表示 Scenario 已编译出的最终命中语义（Numeric Accuracy 或 Always-hit Fact）。组合层新增一个 working concept：**Accuracy Check**，表示在组合中的某个具体位置使用一次 Hit Fact，并产生成功／失败分支。

Accuracy Check 的放置位置定义随机作用域：

- 包裹整个子组合：只判定一次，内部多个 Hit 共享结果；
- 放在每个 Hit 前：逐 Hit 判定；
- 失败分支进入组合终点：miss 即停止；
- 失败分支进入其他子组合：miss 后跳过或继续。

`100%` Numeric Accuracy 与 Always-hit Fact 继续保持不同语义。Classic Mode 保留相同组合结构，但把受支持的 Accuracy Check 编译为确定成功；Battle Odds Mode 使用实际命中概率。普通会心与 damage roll 默认属于 Hit-local 随机性，特殊机制若明确共享，可将其作用域提升到外层组合。

`Hit Fact` 与新 Hit 术语存在潜在命名冲突；是否将其改名为 Accuracy Fact，留待本票最终 domain-modeling 时决定，不在本次记录中直接修改 CONTEXT.md。

### Canonical compositions

#### Shared-accuracy random multi-hit

种子机关枪类技能组合为：

1. 整个组合外层执行一次 Accuracy Check；
2. 成功后按规则随机选择 Hit 数；
3. 顺序执行选中的 Hit；
4. 每个 Hit 默认分别结算会心与 damage roll，并传递 Resolution State。

整组 Accuracy Check 失败时不执行任何 Hit，因此不会消费抗性果。

#### Per-hit accuracy with stop-on-miss

三旋击类技能组合为：

1. 每个 Hit 前分别执行一次 Accuracy Check；
2. 成功后执行当前 Hit；
3. 失败分支立即结束当前组合；
4. 已执行 Hit 的伤害和状态变化保留；
5. 每个 Hit 可以使用不同威力或其他 Hit-local 参数。

第一段 miss 时抗性果保留；第一段命中并触发树果后，即使第二段 miss，树果仍已消耗。

#### Resistance Berry

抗性果是作用于 Hit 的状态化效果，而不是作用于整组或静态附着于所有累计伤害的修正：

- `available` + 第一个符合条件 Hit：当前 Hit 应用减伤，结束状态为 `consumed`；
- `consumed` + 后续 Hit：不再应用减伤；
- Accuracy Check 失败且未进入符合条件 Hit：保持 `available`；
- 连续分析两次 Move Snapshot 执行时，第一次结束状态传入第二次，因此第一次整组 miss 后第二次仍可触发，第一次已触发后第二次不再触发。

相同累计伤害但不同 Resolution State 的路径，在所有可能读取该状态的后续组合完成前不得合并。

#### Parental Bond

Parental Bond 应表现为对既有 Hit Composition 的结构变换：在符合资格的主 Hit 成功路径后附加第二 Hit，并让第二 Hit继承第一 Hit 结束后的 Resolution State。第二 Hit 的倍率、会心与其他精确机制由下游票单独 grilling；本票只保证组合模型足以表达该机制。

### Result projection and ADD/CDD

可组合的核心对象是 Hit Composition 与 Resolution State。执行过程的中间结果至少需要区分：

- 累计伤害；
- 当前／最终 Resolution State；
- 必要的终止或 provenance 事实。

只有在整个待查询组合结束，或已证明后续不会再读取某项状态后，才把结果投影并按总伤害聚合为 **Damage Distribution**，再查询 KO Probability。

现有 ADD／CDD 暂时视为结果层契约，而不是组织多个 Hit 的通用组合原语。普通卷积继续作为“各部分独立且不读写状态”时的合法快速路径；它不再定义所有累计伤害语义。ADD／CDD 的最终全称、原子边界和公开接口在实现前通过本票的 domain-modeling 冻结，本次记录不提前改写 CONTEXT.md。

### Expected implementation boundary

该方向与当前管线存在实质区别，但应限制为计算中层重构，而不是伤害计算器整体重写：

- 保留现有纯 damage kernel，把它作为单个 Hit 的伤害求值器；
- 保留 Track／Scenario 展开、Range endpoint、最终 Damage Distribution、KO Probability 查询和现有结果输出形状；
- 在 Scenario compiler 与最终 Damage Distribution 之间加入受限的 Hit Composition 执行层；
- 将当前单一命中概率拆为组合中的 Accuracy Check，将会心与 roll 默认留在 Hit 内；
- 将永久道具／Ability 修正继续编译为 Hit 输入，将抗性果等一次性效果编译为 Resolution State 的读取和转移；
- 执行期间按“累计伤害 + 状态”保留结果，结束后再投影成纯伤害分布。

首个执行层只需要支持单 Hit、顺序组合、Accuracy Check 和概率选择，不要求通用事件总线、任意循环图或完整 Battle State。

### Migration order

1. **Single-Hit parity**：把现有单 Hit 技能编译为 `Accuracy Check → Hit`，验证 Classic／Battle Odds、普通／会心 roll、OHKO／≤2HKO 与 Range endpoints 完全复现当前结果。
2. **Stateless multi-hit**：加入共享一次判定的随机 Hit 数，以及逐 Hit 判定／miss 终止；Resolution State 暂为空。
3. **Minimal state**：加入抗性果 `available / consumed`，验证同一组合内和连续两次技能执行间只生效一次。
4. **Downstream transforms**：在上述契约稳定后，由 [[20260805_open_implement-parental-bond|Implement Parental Bond]] 冻结并实现第二 Hit 语义。
5. **Presentation follow-up**：单独决定多 Hit 总伤害如何映射到当前普通箱体／会心须线；该 UI 语义不阻塞概率核心与 KO 正确性。

## First supported slice

本票建议首个实现切片覆盖：

- 现有所有单 Hit 技能的行为等价迁移；
- 整组共享一次 Accuracy Check 的固定／随机多 Hit；
- 逐 Hit Accuracy Check、miss 即停止、各 Hit 可有不同威力；
- 每 Hit 独立会心与 damage roll；
- 抗性果在同一多 Hit 组合和连续两次 Move Snapshot 执行中只对第一个符合条件 Hit 生效；
- OHKO 与累计 ≤2HKO 继续以完整 Move Snapshot 执行次数为查询单位。

## Out of scope

- 完整 Battle State、回合顺序、速度、换人或任意招式序列 UI；
- 通用战斗事件总线；
- 回合间回复、间接伤害和本票未明确纳入的状态变化；
- 一次性效果的完整通用库存；首片只引入抗性果所需的最小状态能力；
- 在本票中实现 Parental Bond；
- 在本票中决定多 Hit 结果图表的最终展示形状；
- 仅依据 `minHits / maxHits` 猜测共享命中、逐 Hit 命中或停止规则。

## Remaining decisions

- Hit Composition、Accuracy Check、Resolution State 及 ADD／CDD 的最终中英文命名，并同步到 CONTEXT.md；
- 多 Hit 执行拓扑和随机作用域的结构化资源来源；PokeAPI 信息不足时应显式 reviewed／unsupported，不静默推断；
- 多 Hit 的 damage range、critical reference 与平均值在现有图表中的展示契约；
- 概率路径中抗性果“可能触发”时的 Track Selection Activation、provenance 与 Scenario Merge 语义；
- 哪些后续一次性 Hit 效果值得扩展 Resolution State，避免首片演变为完整模拟器。

## Downstream consumers

- [[20260805_open_implement-parental-bond|Implement Parental Bond]] 依赖本票的 Hit Composition／第二 Hit 契约；首批冻结将 Parental Bond 与多段一并处理（见 [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §15）。本票应足以支撑该 Ability 的后续 grilling，但不在本票内实现 Parental Bond。
- 抗性果当前的 `persistent-berry` warning 可在消费语义实现并验证后移除或收窄；本票不直接改动 warning。

## Acceptance criteria

- [ ] Hit、Hit Composition、Accuracy Check 与 Resolution State 的最终领域契约已冻结并同步到 CONTEXT.md。
- [ ] 共享一次命中、随机 Hit 数、逐 Hit 命中／miss 终止、逐 Hit 威力与逐 Hit 会心／roll 的作用域均有明确组合语义。
- [ ] 抗性果在同一多 Hit 组合与连续两次 Move Snapshot 执行中的读取、消费、保留和状态重置边界均已规格化。
- [ ] 中间结果在状态相关后续结束前不会仅按伤害值提前合并；最终 Damage Distribution 与 KO Probability 的投影边界明确。
- [ ] 首个支持切片的资源元数据边界已决定，缺失语义会产生 explicit unsupported，而非静默猜测。
- [ ] 单 Hit 兼容迁移、无状态 multi-hit、抗性果最小状态与 Parental Bond 下游的实施顺序已形成可执行票单。
- [ ] 多 Hit 伤害展示和概率 provenance 的剩余产品决策已关闭或拆成独立 issue。

## Deferred constraints

- 本 issue 不属于当前 Wayfinder map 的 child frontier。
- 在未区分 Accuracy Check 作用域、控制关系与状态传递前，不把所有 multi-hit move 归为一种模型。
- 任何实现都必须保持 damage kernel 纯净，不让资源身份、UI Track 或完整战斗历史进入公式核心。

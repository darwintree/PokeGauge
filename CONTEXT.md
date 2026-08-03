# PokeLens

PokeLens 将一组宝可梦对战变量展开为可比较的伤害情景。本词表只收录跨业务、设计与实现都需要统一使用的项目语言。

## 业务逻辑

本领域描述 PokeLens 如何构造比较情景，以及如何解释击倒概率。前端区域与宝可梦游戏原生术语分别归入其他领域。

### Matchup

**Matchup（对阵）**:
有方向的攻击方与防守方组合，是一个 Scenario set 共享的对战基础；不包含 Track 取值或概率模式。
_Avoid_: Battle, Scenario, Track configuration

### Tracks

**Track**:
参与 Scenario 生成的一个比较维度；它提供当前参与比较的取值。
_Avoid_: Filter, frontend component, configuration axis

**Choice Track**:
取值为离散集合的 Track；集合中的每个值各自形成一条组合分支。
_Avoid_: Multi-select Track, option list

**Range Track**:
取值为一个闭合数值区间的 Track；整个区间是一条组合分支，用于表达结果边界，不枚举区间内的每个数值。
_Avoid_: Slider, range filter

**Move Track（招式 Track）**:
保存 Move Snapshot 的 Choice Track；每个已选 Snapshot 形成一条 Scenario 分支，未选 Snapshot 保留但不参与 Scenario 生成。
_Avoid_: Move list, Move Template Track

**Move Template（招式模板）**:
用于创建 Move Snapshot 的招式定义，提供招式身份与初始计算参数；自身不直接参与 Scenario。
_Avoid_: Move Snapshot, selected Move

**Move Snapshot（招式快照）**:
由 Move Template 创建并与其解耦的独立、可编辑招式配置。相同 Template 可以创建多个 Snapshot，每个 Snapshot 都有独立身份与选择状态。
_Avoid_: Move Template, selected Move, shared Move configuration

### Scenario model

**Scenario**:
从每条 Track 各取一条当前分支后构成的一个计算情景。
_Avoid_: Result row, chart row, template

**Scenario set**:
当前所有 Track 的分支经笛卡尔积生成的全部 Scenario。
_Avoid_: Row product rule, displayed rows

**Unavailable Scenario（不可计算 Scenario）**:
因必要输入未配置、当前条件下招式不可用或相关机制尚未支持，而不能生成伤害结果的 Scenario；它不表示零伤害。
_Avoid_: Zero-damage Scenario, empty result, dropped Scenario

**Scenario Merge**:
将应用业务规则后计算等价的多个 Scenario 合为一个结果，同时保留它们各自的 Track 来源。
_Avoid_: Equal-display merge, result deduplication

### 概率模式（Probability Mode）

**概率模式（Probability Mode）**:
击倒概率采用的计算口径；它应用于 Scenario，但不是 Track，也不改变 Scenario set 的大小。
_Avoid_: Probability Track, result filter

**经典模式（Classic Mode）**:
假定招式命中，并以 16 个等概率伤害值计算击倒概率；非必定会心不参与，必定会心则使用会心伤害值。
_Avoid_: 16-roll mode, guaranteed damage

**实战模式（Battle Odds Mode）**:
在当前支持范围内，将命中、未命中与会心概率纳入伤害分布后计算击倒概率；未命中计为零伤害。
_Avoid_: Battle Mode, Actual Probability Mode, Full Odds Mode, Realistic Mode

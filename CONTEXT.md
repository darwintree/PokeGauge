# PokeLens

PokeLens 将一组宝可梦对战变量展开为可比较的伤害情景。本词表只收录跨业务、设计与实现都需要统一使用的项目语言。

## 业务逻辑

本领域描述 PokeLens 如何构造比较情景，以及如何解释击倒概率。前端区域与宝可梦游戏原生术语分别归入其他领域。

### Scenario model

**Track**:
参与 Scenario 生成的一个比较维度；它提供当前参与比较的取值。
_Avoid_: Filter, frontend component, configuration axis

**Choice Track**:
取值为离散集合的 Track；集合中的每个值各自形成一条组合分支。
_Avoid_: Multi-select Track, option list

**Range Track**:
取值为一个闭合数值区间的 Track；整个区间是一条组合分支，用于表达结果边界，不枚举区间内的每个数值。
_Avoid_: Slider, range filter

**Scenario**:
从每条 Track 各取一条当前分支后构成的一个计算情景。
_Avoid_: Result row, chart row, template

**Scenario set**:
当前所有 Track 的分支经笛卡尔积生成的全部 Scenario。
_Avoid_: Row product rule, displayed rows

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

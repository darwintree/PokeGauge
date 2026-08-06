# PokeLens

PokeLens 将一组宝可梦对战变量展开为可比较的伤害情景。本词表只收录跨业务、设计与实现都需要统一使用的项目语言。

## 业务逻辑

本领域描述 PokeLens 如何构造比较情景，以及如何解释击倒概率。前端区域与宝可梦游戏原生术语分别归入其他领域。

### Matchup

**Matchup（对阵）**:
由一个攻击方 Battle Pokémon Identity 与一个防守方 Battle Pokémon Identity 构成的有向组合，是一个 Scenario set 共享的对战基础；不包含 Track 取值或概率模式。
_Avoid_: Battle, Species matchup, Scenario

**Battle Pokémon Identity（对战宝可梦身份）**:
Matchup 中宝可梦选择的最小单位，唯一对应一个可选择的单一对战形态。相同 Pokémon Species 的不同 Form 分别拥有独立 Identity；基础形态本身也是一个 Identity。
_Avoid_: Pokémon Species, form configuration, localized name

### Tracks

**Track**:
参与 Scenario 生成的一个比较维度；它提供当前参与比较的取值。
_Avoid_: Filter, frontend component, configuration axis

**Choice Track**:
取值为离散集合的 Track；集合中的每个值各自形成一条组合分支。
_Avoid_: Multi-select Track, option list

**Track Selection Activation**:
对于具有默认 Neutral Selection 的 Choice Track，表示一个 Selection 是否对最终结果有贡献。取值为 `active`、`inactive`、`unsupported` 或 `neutral`。
_Avoid_: Source State, Effective

**Active Selection（生效选择）**:
对最终结果有贡献的 Selection。
_Avoid_: Effective Selection

**Inactive Selection（未生效选择）**:
已支持，但最终效果等同于同 Track Neutral Selection 的 Selection。
_Avoid_: Unsupported Selection, Neutral Selection

**Unsupported Selection（暂未支持选择）**:
当前仅作为占位并按同 Track Neutral Selection 等效处理的 Selection；它不表示已判断为未生效。
_Avoid_: Inactive Selection

**Neutral Selection（中性选择）**:
Choice Track 中作为默认比较基准的 Selection。
_Avoid_: Inactive Selection, Unsupported Selection

**Range Track**:
取值为一个闭合数值区间的 Track；整个区间是一条组合分支，用于表达结果边界，不枚举区间内的每个数值。
_Avoid_: Slider, range filter

**Stat Track（能力值 Track）**:
以伤害计算实际使用的最终能力值为分支的一类 Track；分为 Offense Stat Track 与 Defense Stat Track，不把性格、SP 分配或能力阶级本身作为分支。
_Avoid_: EV Track, Build Track, Stat Stage Track

**Offense Stat Track（进攻能力值 Track）**:
攻击方的 Stat Track；其值是当前招式类别所使用的最终攻击或特攻。
_Avoid_: Attack Track, Attacker Track

**Defense Stat Track（防守能力值 Track）**:
防守方的 Stat Track；其值由最终 HP 与当前招式类别所使用的最终防御或特防共同构成。
_Avoid_: Defend Track, Defender Track, Defense-only Track

**Stat Value（能力实数值）**:
Stat Track 中的一个确定值；Offense Stat Value 是攻击或特攻的单值，Defense Stat Value 是 HP 与防御或特防的完整组合。
_Avoid_: Base Stat, EV spread, Stat Allocation

**Stat Preset（能力值预设）**:
可复用的固定 Stat Value；在 Choice Track 中，每个已选 Preset 构成一条分支。
_Avoid_: Stat Value Template, preset spread

**Stat Range（能力值区间）**:
由两个 Stat Value 端点界定的闭区间，整个区间是 Range Track 的一条分支。Defense Stat Range 的每个端点都是一个完整的 Defense Stat Value。
_Avoid_: Enumerated Stat Values, independent HP and Defense Tracks

**Stat Allocation（能力分配）**:
能够产生某个 Stat Value 的性格与 SP 分配组合；它解释 Stat Value 如何实现，但不构成独立的 Scenario 分支。
_Avoid_: Stat Value, Stat Preset, Build configuration

**Stat Value Label（能力值标签）**:
Stat Allocation 的展示值，由 Stat Value 反向求得可产生该值的 Allocation 后生成。一个 Stat Value 可以因性格修正对应多个 Label，也可以因不存在有效 Allocation 而没有 Label。
_Avoid_: Stat Value, actual value, preset name

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

**Hit Fact（命中事实）**:
一个 Scenario 中招式的最终命中语义；取值为 Numeric Accuracy 或 Always-hit Fact。
_Avoid_: Hit Probability, Move Snapshot Accuracy

**Numeric Accuracy（数值命中）**:
以百分比数值表达的 Hit Fact。数值 `100%` 与 Always-hit Fact 不是同一语义。
_Avoid_: Always-hit Fact, Hit Probability

**Always-hit Fact（必中事实）**:
不再由数值命中判定的定性 Hit Fact；它与 Numeric Accuracy `100%` 区分。
_Avoid_: 100% Numeric Accuracy, guaranteed damage

**Damage Distribution（伤害分布）**:
以伤害值及其发生概率构成的离散分布；它描述伤害结果，不依赖防守方的 HP。
_Avoid_: Damage Range, KO Probability

**Atomic Damage Distribution（原子伤害分布）**:
一次使用 Move Snapshot 所产生的 Damage Distribution，按照当前 Probability Mode 组合未命中、普通伤害与会心伤害。
_Avoid_: One-shot Damage Distribution, Actual Damage Distribution

**Convolved Damage Distribution（卷积伤害分布）**:
由一个或多个 Atomic Damage Distribution 卷积得到的累计伤害分布。
_Avoid_: Accumulated Damage Distribution, Total Damage Distribution

**KO Probability（击倒概率）**:
一个确定的 Convolved Damage Distribution 中，累计伤害达到或超过一个确定 HP 值的概率。
_Avoid_: KO Rate, Kill Chance

**KO Probability Range（击倒概率范围）**:
Stat Range 两个端点分别产生的 KO Probability 所形成的有序范围；Stat Range 本身不视为随机变量。
_Avoid_: Average KO Probability, Probability Distribution

### 伤害展示

**等效威力（Equivalent Power）**:
由 Scenario 编译结果按 kernel 阶段顺序折算出的展示数值，用于估算伤害：`伤害 ≈ 攻击 × 等效威力 / 防御`；按普通／会心分支分别折算，属性免疫显示 0，不是 kernel 直接使用的数值。
_Avoid_: 最终威力, effective power, kernel input power

## 宝可梦游戏

**Pokémon Species（宝可梦种类）**:
用于归组多个 Pokémon Form 的物种分类；它不是 Matchup 的直接选中值。
_Avoid_: Battle Pokémon Identity, selected Pokémon

**Pokémon Form（宝可梦形态）**:
同一 Pokémon Species 下的一个具体形态。只有具备独立且可选择的对战数据的 Form 才对应一个 Battle Pokémon Identity；纯展示差异不对应独立 Identity。
_Avoid_: Battle Pokémon Identity, form configuration

**Stat Points（SP，能力点数）**:
Pokémon Champions 中用于分配能力投入的点数，取代主系列游戏的努力值表达；单项能力可以投入 `0`～`32` SP。
_Avoid_: Stat Value, Base Stat, EV

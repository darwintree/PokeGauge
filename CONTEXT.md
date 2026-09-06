# PokeGauge

PokeGauge 将一组宝可梦对战变量展开为可比较的伤害情景。本词表只收录跨业务、设计与实现都需要统一使用的项目语言。

## 业务逻辑

本领域描述 PokeGauge 如何构造比较情景，以及如何解释击倒概率。前端区域与宝可梦游戏原生术语分别归入其他领域。

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
_Avoid_: Filter, frontend component, configuration axis, Picker Filter

**Picker Filter（选择器筛选）**:
Picker 内对候选目录的临时收窄；关闭 Picker 即丢弃。不是 Track，也不写入 Scenario Setup。
_Avoid_: Track, Filter (as Track), Scenario Setup preference

**Choice Track**:
取值为离散集合的 Track；集合中的每个值各自形成一条组合分支。
_Avoid_: Multi-select Track, option list

**Choice Pool（选项池）**:
一条 Choice Track 上已加入的取值集合；其中已选中的项各成一条 Scenario 分支，未选中的项仍留在池中但不生成 Scenario。
_Avoid_: Candidate pool, 候选池, 备选池, Picker Filter

**Track Selection Activation**:
对于具有默认 Neutral Selection 的 Choice Track，表示一个 Selection 是否对最终结果有贡献。取值为 `active`、`inactive`、`unsupported` 或 `neutral`。
_Avoid_: Source State, Effective

**Semi-supported Scenario（部分支持 Scenario）**:
当前计算只覆盖部分结果相关语义、仍可产出结果但必须披露缺失语义的 Scenario。
_Avoid_: Semi-supported Track Value, Unsupported Selection, partially active Scenario

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

**Assumed-Satisfied Ability Selection（假设条件已满足的特性选择）**:
对缺少战斗条件输入（如 HP%、异常状态）的 Ability，选中该 Ability 即表示该条件在本 Scenario 中已满足；Track 可用独立披露提示这一假设，但 Track Selection Activation 仍只报告机械效果是否贡献。
_Avoid_: abilityOn, charged Ability, green-dot Activation, Conditional Active state

**Range Track**:
取值为一个闭合数值区间的 Track；整个区间是一条组合分支，用于表达结果边界，不枚举区间内的每个数值。
_Avoid_: Slider, range filter

**Stat Track（能力值 Track）**:
以伤害计算实际使用的最终能力值为分支的一类 Track；分为 Offense Stat Track 与 Defense Stat Track，不把性格、SP 分配或能力阶级本身作为分支。一条 Stat Track 只有一组选中的 Stat Value（即该 Track 作为 Choice Track 时的已选中值），且至少含一个，按 Stat Value 去重；Choice 与 Range 是这组值的两种模式。选中集合与 Stat Preset 正交。
_Avoid_: EV Track, Build Track, Stat Stage Track, dual stat stores

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
可复用的固定 Stat Value（系统或用户保存）；它是 Choice 模式选项的来源，不是选中集合的身份，也不是与 Range 对位的模式名。
_Avoid_: Stat Value Template, preset spread, mode name for Choice, selected-stat identity

**Temporary Stat Value（临时能力实数值）**:
没有对应 Stat Preset 的选中 Stat Value。仅当当前包络端点缺少对应 Preset 时创建；不再作为当前端点、或被取消选中，即删除。
_Avoid_: Temporary Stat Preset, temporary range store, unsaved draft interval

**Stat Range（能力值区间）**:
当前选中 Stat Value 的轴对齐包络。进攻端点是最小与最大实数；防守端点是 `(min HP, min Def)` 与 `(max HP, max Def)` 两个完整 Defense Stat Value。仍落在包络内的选中值保持选中；缺的端点补 Temporary Stat Value。不是四个角的笛卡尔积。
_Avoid_: Enumerated Stat Values, independent HP and Defense Tracks, four-corner writeback

**Stat Allocation（能力分配）**:
能够产生某个 Stat Value 的性格与 SP 分配组合；它解释 Stat Value 如何实现，但不构成独立的 Scenario 分支。
_Avoid_: Stat Value, Stat Preset, Build configuration

**Stat Value Label（能力值标签）**:
Stat Allocation 的展示值，由 Stat Value 反向求得可产生该值的 Allocation 后生成。一个 Stat Value 可以因性格修正对应多个 Label，也可以因不存在有效 Allocation 而没有 Label。
_Avoid_: Stat Value, actual value, preset name

**Move Track（招式 Track）**:
保存 Move Snapshot 的 Choice Track；全部 Snapshot 构成该 Track 的 Choice Pool，每个已选 Snapshot 形成一条 Scenario 分支，未选 Snapshot 保留但不参与 Scenario 生成。
_Avoid_: Move list, Move Template Track

**Move Template（招式模板）**:
用于创建 Move Snapshot 的招式定义，提供招式身份与初始计算参数；自身不直接参与 Scenario。
_Avoid_: Move Snapshot, selected Move

**Move Snapshot（招式快照）**:
由 Move Template 创建的独立招式配置；允许编辑的参数与模板解耦，原生连续攻击的各段威力保持招式规则规定的固定值。相同 Template 可以创建多个 Snapshot，每个 Snapshot 都有独立身份与选择状态。
_Avoid_: Move Template, selected Move, shared Move configuration

**Scenario Move Type（场景招式属性）**:
Move Template 的原始属性经身份相关语义与 Ability 规则后，当前 Scenario 用于结算和结果展示的最终招式属性；它不改写 Move Snapshot 或 Move Track。
_Avoid_: Result Move Type, resolved move type, Move Snapshot type

### Scenario model

**Scenario Setup（情景设定）**:
由一个 Matchup、Move side 与各 Track 当前已选语义构成的可重建计算输入；它生成 Scenario set，但不包含未选候选、应用级偏好、纯展示偏好或计算结果。
_Avoid_: Scenario, full Track state, saved UI session, frozen result

**Setup Bookmark（情景书签）**:
用户主动留下的一份 Scenario Setup，用于之后复制回当前工作区继续编辑。与当前工作区不是同一对象；载入后的修改不写回该书签。
_Avoid_: History, frozen result, saved UI session, saved calculation

**Unloadable Bookmark（失效书签）**:
无法按当前资源与规则应用为 Scenario Setup 的 Setup Bookmark。它仍是列表中的一条书签，不是部分设定，也不是过期的计算结果。
_Avoid_: stale result, expired calculation, partial Setup

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

### 招式执行

**Move Execution（招式执行）**:
一次使用招式的完整过程，可能整招未命中，也可能执行多个 Hit；逐段检查的招式可因未命中提前结束。
_Avoid_: Hit, damage roll, turn

**Hit（攻击段）**:
招式执行中的一次攻击结算，拥有自己的威力、会心结果与伤害随机数；一个 Hit 不是一次完整招式使用。
_Avoid_: Move Execution, KO count

**Accuracy Check（命中检查）**:
决定招式或某一段是否命中的判定；可由整招共享一次，或逐段进行并在首次失败时终止执行。
_Avoid_: full-hit probability, Hit Fact

**Hit Composition（攻击段组合）**:
描述一次招式执行的攻击段、可能段数及命中检查顺序的规则。随机段数是同一 Scenario 内的概率，不是 Track 分支。
_Avoid_: Scenario set, move list, fixed hit count

**Resolution State（结算状态）**:
一次执行中以及连续执行之间延续的战斗状态；当前支持抗性果是否已消费，以及已支持招式造成的防御／特防下降和攻击／特攻上升在后续攻击段及下一次执行中的阶级。不同 Scenario 各自从初始状态开始。
_Avoid_: Track State, application state

### 概率模式（Probability Mode）

**概率模式（Probability Mode）**:
应用中所有 Scenario 的击倒概率所采用的计算口径；它是应用级计算偏好，不是 Track 或 Scenario Setup 的一部分，也不改变 Scenario set 的大小。
_Avoid_: Probability Track, Scenario Setup field, result filter

**经典模式（Classic Mode）**:
假定每次命中检查成功，各段独立使用 16 个等概率伤害值，保留随机段数；非必定会心与概率触发的能力变化不参与击倒概率，必定会心及必定触发的已支持能力变化照常参与。会心参考仍可展示。
_Avoid_: 16-roll mode, guaranteed damage

**实战模式（Battle Odds Mode）**:
在当前支持范围内，将命中、未命中、会心及已支持的概率能力变化纳入条件分布后计算击倒概率；未命中计为零伤害。
_Avoid_: Battle Mode, Actual Probability Mode, Full Odds Mode, Realistic Mode

**Hit Fact（命中事实）**:
一个 Scenario 中每次 Accuracy Check 使用的最终命中语义；取值为 Numeric Accuracy 或 Always-hit Fact。
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
一次 Move Execution 在给定初始状态下所产生的 Damage Distribution，按照当前 Probability Mode 组合段数、命中与逐段会心。
_Avoid_: One-shot Damage Distribution, Actual Damage Distribution

**Convolved Damage Distribution（卷积伤害分布）**:
由一个或多个 Atomic Damage Distribution 卷积得到的累计伤害分布。
_Avoid_: Accumulated Damage Distribution, Total Damage Distribution

**KO Probability（击倒概率）**:
在给定执行次数内，累计伤害达到或超过一个确定 HP 值的概率。≤2HKO 计至多两次完整 Move Execution，包括未命中的执行；后一次继承已支持的 Resolution State，不能一概视为独立同分布的卷积。
_Avoid_: KO Rate, Kill Chance

**KO Probability Range（击倒概率范围）**:
Stat Range 两个端点分别产生的 KO Probability 所形成的有序范围；Stat Range 本身不视为随机变量。
_Avoid_: Average KO Probability, Probability Distribution

### 伤害展示

**等效威力（Equivalent Power）**:
按伤害修正顺序折算的展示数值，用于估算伤害：`伤害 ≈ 攻击 × 等效威力 / 防御`。在假定全部命中检查成功的情况下，多段招式逐段计入会心与树果状态再求和，保留随机段数，展示全部普通与至少一段会心的合计或范围；属性免疫显示 0。它不是伤害公式直接使用的基础威力。
_Avoid_: 最终威力, effective power, kernel input power

## 产品表面

**Usage Tip（用法提示）**:
由一份结构维护的若干条带标题与正文的产品用法说明；每次进入结果表面时从中随机展示一条。不在 Matchup 落地页出现。不是 Unavailable Scenario 的 Notice，也不是 Track 披露。产品名不用「每日」。
_Avoid_: 每日提示, Daily Tip, Notice, Hint (as Track disclosure)

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

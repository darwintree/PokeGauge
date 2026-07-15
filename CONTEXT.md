# Pokémon Damage Calc

宝可梦对战伤害计算器。用户以最小输入获得一次 matchup 的充分伤害信息，并可选择收紧参数以缩小结果范围。

## Language

### Matchup context

**Matchup**:
一次计算上下文：进攻方、防守方及隐含的 **ruleset + battle format**（当前：Champions · VGC 双打）。Default view 下招式由系统自动挑选，不视为用户输入。
_Avoid_: Battle, fight, 对战（作名词指代计算单元时）

**Ruleset**:
一次 matchup 所依代的官方对战规则集；决定可用池、stat 公式版本、道具/特性合法性。当前固定为 **Pokémon Champions**（最新官方作品规则）。
_Avoid_: Generation picker, 世代选择（产品层用 ruleset 表述；实现层可映射到 calc 世代号）

**Battle format**:
对战形式；当前固定为 **VGC 双打**（2v2）。影响 default spread、move pick 使用率语境、常见配置预设，以及 spread move 的默认伤害修正语境；单次伤害计算仍展示为「进攻方 → 防守方」。
_Avoid_: Format selector, 赛制切换（首版不做）

**Spread move modifier**:
双打中招式命中多个目标时应用的伤害修正。仅支持多目标的 **Move template** 会在快照上提供开关，当前 VGC 双打语境默认启用；它表达本次是否应用多人目标修正，不改变招式的目标类型，单体招式不能强制启用。
_Avoid_: Always-on doubles penalty, UI-only display setting

### Move selection

**Move pick**:
系统从进攻方技能池中按使用率自动选出的招式集合（top-N）。用户未声明招式时，结果按 move pick 展开。
_Avoid_: Auto-move, 默认招式

**Champions move usage data**:
用于生成 **Move pick** 的 Pokémon Champions 双打招式使用率数据。它表达「当前 usage 语境下常见招式排序」，不表达 ruleset 合法性，也不包含 ability、held item、teammate、stat points 等配装维度。
_Avoid_: Champions ruleset data, legal pool, full build data

**Move side**:
招式 track 当前工作的伤害分类侧：物理或特殊。首版一次 matchup 只展示一个 move side；切换 move side 会清空上一侧的可见/已选招式，并恢复新侧的 move pick。
_Avoid_: Mixed moves, category mode

**Move template**（招式模版）:
用于创建 **Move snapshot** 的不可变招式定义，提供招式身份及上游的威力、命中与内在机制。创建快照时直接复制上游威力，`null` 统一映射为 `0`；模版本身不是 scenario 选项，用户编辑不会反向修改它。
_Avoid_: Selected move, Editable move, Shared move record

**Move snapshot**（招式快照）:
从 **Move template** 创建并加入 Move track 的可编辑选项；保存本次 matchup 采用的威力、命中、会心等级与 Spread move modifier 状态。一个模版可以创建多个独立快照；快照是用户刻意保留的比较单位，彼此不因效果等价而合并。
_Avoid_: Move configuration, Move variant track, Power track, Accuracy track

**Unconfigured move power**（未配置招式威力）:
Move snapshot 的威力为 `0` 的状态，表示上游未提供威力且用户尚未填写，而不表示有效的零威力招式。该快照保留在 Move track 中，但在威力变为正数前不产生伤害结果。
_Avoid_: Zero-power damage, Variable-power default, Missing move

**Unconfigured move accuracy**（未配置招式命中）:
Move snapshot 的命中为 `0` 的状态，表示上游命中为 `null` 且尚未获得审核语义或用户输入，而不表示真实的 `0%` 命中。数字命中直接复制；已审核为必中的招式初始化为 `100%` 并保留必中语义；未配置命中不产生实际概率结果。
_Avoid_: Zero-percent accuracy, Null-means-always-hit, Unsupported move

**Fixed-power damaging move**:
可进入首版全局招式搜索池的招式：分类为物理或特殊，且基础威力是正数固定值。不包含 status、OHKO、固定伤害、变量威力或 `power = null` 的招式。
_Avoid_: Any damaging move, variable-power move

### Scenario construction

**Weather**（天气）:
表示当前 matchup 天气状态的 multi-select track，选项为无天气、晴天、下雨、沙暴与下雪。本轮只表达天气对伤害／威力与命中概率的直接影响，不包含回合末伤害、防御能力修正、回复、状态免疫或招式属性变化。
_Avoid_: Weather damage simulation, Full weather state

**Screen**（墙）:
表示防守方场上保护状态的 multi-select track，选项仅为无墙、反射壁与光墙。物理招式只受反射壁影响，特殊招式只受光墙影响；双墙不会为单个 Move snapshot 产生新的有效结果，因此不是选项。
_Avoid_: Dual screens option, Screen stack, 场地保护

**Scenario**:
结果页的一行箱形图，对应各 **track** 选中项的一个组合（笛卡尔积的一项）。
_Avoid_: Template（代码/UI 层可用，领域层统一称 Scenario）

**Track**:
结果页上的一个配置维度；每个 track 独立选型，类型为**多选**或**数值范围**。
_Avoid_: Configuration axis, filter, dimension

**Multi-select track**:
可选中多项的 track；选中数 n 参与行数累乘。
_Avoid_: Multi-select axis

**Range track**:
通过数轴选取一段合法数值的 track；视为选中 **1** 项；该行的伤害 envelope 合并区间端点与 16 roll。Range track 不视为随机变量；N-hit KO 结果由两个端点分别计算，展示为概率区间。
_Avoid_: Slider axis, stat range filter

**Row product rule**:
原始 scenario 组合数 = 各 track 选中数的乘积（∏ nᵢ）。数值范围 track 的 n 恒为 1；最终展示行数还会受到 **Effect-equivalent scenario merge** 的影响。
_Avoid_: Display row count rule, Cartesian product（领域层用 track 累乘表述）

**Effect-equivalent scenario merge**（效果等价 Scenario 合并）:
同一 **Move snapshot** 下，多个原始 scenario 组合的实际生效机制与计算输入相同时，合并为一个结果行；即使仍有其他机制生效，只要部分选择无效并且剩余效果相同也应合并。合并保留原始选择来源，且不能跨 Move snapshot 合并，也不能仅因取整后的伤害碰巧相同而判定等价。
_Avoid_: No-effect-only merge, Equal-damage merge, Deduplication

### Stat configuration

**Stat stage**（能力阶级）:
对战中作用于能力值的 `-6`～`+6` 阶级修正。本轮由攻击方与防御方各自的 multi-select track 表达，默认只选 `0`，仅覆盖当前招式所使用的物攻／特攻与物防／特防，不包含速度、命中或闪避阶级；会心忽略攻击方的负阶级与防御方的正阶级，但保留另外两个方向。
_Avoid_: Ability level, 能力等级, 特性等级

**Build configuration**:
一方宝可梦在某一 track 上的取值；性格+努力、道具等分属不同 track，不含能力阶级。
_Avoid_: Scenario variant, 强化配置

**Stat value template**（实数值模版）:
按宝可梦保存的一组**最终实数值**（进攻：单 stat；防守：HP + 防）；不含性格，不保存名称。分系统、用户、临时三类；预设区多选参与 row product，与数轴选段 XOR。卡片标签由 **标签引擎** 从实数值导出，见 **Stat points**。
_Avoid_: Preset spread, 性格模版

**Stat points**（SP，能力点数）:
实数值模版卡片上的 shorthand 标签；Champions 点数 `(EV+4)/8`，受修正 stat 可选 `+/-` 后缀（HP 无后缀）。同一实数值可对应多种 spread；**分配切换**（⟳）在全枚举 spread 间循环，**仅改标签**，不影响伤害。默认标签为 stat points + stat 名 + 修正；极限值固定派生为 `EX`（进攻 `32{stat}+`，防守 `32H32{defStat}+`）。不用 `max`，满 EV 无修正写作 `32`，`32HP` 不作为默认展示。
_Avoid_: Ability points, EV display, effort label, max label

**Default view**:
用户仅提供 matchup 最小输入时展示的宽结果视图，自动包含常见 scenario 与极限情况。
_Avoid_: One-shot view, 初始页

**Detailed view**:
用户在 default 选中集基础上调整各 track 选型以收紧结果；机制与 default view 相同（track 累乘），仅选中数减少。
_Avoid_: Advanced mode, 专家模式

### Damage and KO

**Critical stage**（会心等级）:
决定招式会心概率的 `0`～`+3` 统一等级；招式、特性或其他机制只贡献等级修正，不另设“必定会心”类型。会心等级达到 `+3` 时即为必定会心；它不同于 `-6`～`+6` 的 **Stat stage**。
_Avoid_: Guaranteed-crit move type, Critical profile, 必定会心标记

**Damage range**:
通常 16 roll 下的最低 ~ 最高伤害值及其占防守方 HP 的百分比；在箱形图中以**箱体**表示。
_Avoid_: Damage spread, 伤害波动

**Crit range**:
暴击 roll 下的最低 ~ 最高伤害值；在箱形图中以**须须**及端点表示。
_Avoid_: Critical spread, 会心范围

**Damage distribution**（伤害分布）:
以伤害值为随机变量的离散分布，与防御方的 HP 总量无关。
_Avoid_: Damage range, KO probability

**Atomic Damage Distribution**（ADD，原子伤害分布）:
一次使用招式产生的无条件 **Damage distribution**；未命中记为 0 伤害，命中后按通常/暴击及各自 16 roll 的联合概率加权，并合并相同伤害值。
_Avoid_: One-shot damage distribution, Actual damage distribution

**Convolved Damage Distribution**（CDD，卷积伤害分布）:
由一个或多个 **ADD** 卷积得到的总伤害分布；单个 ADD 是只含一个因子的 CDD。
_Avoid_: Accumulated damages distribution, Total damage distribution

**KO probability**（击倒概率）:
一个确定的 **CDD** 中累计伤害值大于或等于一个确定 HP 值的概率。
_Avoid_: Exact KO Rate, Kill chance, KO rate

**KO probability range**（击倒概率范围）:
Range track 两个端点分别产生的 **KO probability** 所形成的有序范围；Range track 本身不视为随机变量。
_Avoid_: KO probability interval, Endpoint probability interval

**OHKO probability**:
以单个 **ADD** 作为 CDD 计算出的 **KO probability**。
_Avoid_: Normal-roll OHKO chance, Crit-only OHKO

**N-hit KO probability**（N 次内击倒概率）:
以 N 个 ADD 卷积所得的 CDD 计算出的 **KO probability**；包含少于 N 次就已击倒的结果。首版不计回合间回复、间接伤害、能力变化或不同招式组合。
_Avoid_: Exact N-hit KO probability, 恰好第 N 次击倒概率

### Stat controls

**Snap point**:
详细参数滑块的吸附预设：0、max、ex（对应无修正无努力 / 无修正满努力 / +修正满努力语义）。
_Avoid_: Preset, anchor

**Bulk stat**:
防守方用于承伤的 stat 组合：HP + 物防或 HP + 特防（取决于招式类别）。
_Avoid_: Defensive spread

**Offense stat**:
进攻方用于输出的 stat：物攻或特攻（取决于招式类别）。
_Avoid_: Offensive spread

### Identity and language

**Type**:
宝可梦或招式的属性（18 种标准属性）。用于识别展示（如 species typing badge），不单独表示克制倍率。
_Avoid_: Element, 元素

**Battle Pokémon identity**:
用于唯一确定一只可参战宝可梦之**种族值与属性**的标识；当不同形态会改变这些战斗数据时，必须区分到该形态，而不能只停留在 species。
_Avoid_: Species label, localized name, display label

**Upstream resource identity**:
项目内部用于引用 PokeAPI 上游实体的稳定标识；采用对应资源的 **numeric id**，显示文案再通过该资源的本地化字段派生，且不把 slug 作为持久化主键。
_Avoid_: Localized label as id, slug as primary key, dual primary key

**Supported locale**:
首版产品明确支持的显示语言集合；当前为 **zh-hans、zh-hant、en、ja**，运行时直接从对应上游资源的本地化名称中取值。
_Avoid_: Arbitrary locale support, fallback locale chain

**Search**:
用户用关键词和结构化筛选从宝可梦或招式候选池中找到目标的产品能力；目标是有广度的召回，可逐步包含别名、俗称、黑话等。当前最低可交付范围只承诺匹配当前 **Supported locale** 的本地化展示名。
_Avoid_: Exact name lookup, upstream slug lookup

### Held items

**Held item**（携带道具）:
攻击方 build configuration 在道具 track 上的一项取值；道具 track 为 **multi-select track**，但每一 scenario 行仅应用一件道具的伤害修饰。含 explicit no-item。
_Avoid_: Item, 装备

**Explicit no-item**（显式无道具）:
道具 track 中 id 为 `none` 的选项；表示刻意不带道具的配置，与「未选任何道具导致零行」区分。
_Avoid_: Empty item, 空道具

**Type boost item**（属性强化道具）:
提升特定属性招式威力的携带道具（如木炭、柔软沙子）；与攻击方属性对应。UI 默认展示本系至多 2 项，可多选参与对比。
_Avoid_: Plate, 石板, type gem

**Added type boost**（添加属性强化）:
通过「+」从全属性强化道具池中追加到可见列表、但非本系默认展示的选项。
_Avoid_: Custom boost, 扩展强化

**No-boost row**（无加成行）:
结果行所选 type boost item 与该行招式属性不一致、因而未生效加成的状态；它会按 **Effect-equivalent scenario merge** 与同一 Move snapshot 下的中性选择合并，合并行仍保留该道具的原始选择来源。
_Avoid_: Mismatched item, 错配道具

### Abilities

**Ability selection**（特性选择）:
攻击方或防御方 ability track 中的一项选择；选中后默认视为生效，不提供额外启用开关。双方默认选中当前宝可梦形态的全部合法特性，包括隐藏特性；本轮只有适应力具有已实现的计算效果。
_Avoid_: Ability activation toggle, Conditional ability simulation

**Unsupported ability effect**（未支持的特性效果）:
真实特性可以被选择，但其计算规则尚未实现的状态；当前以中性修正参与计算与效果等价合并，同时必须明确标记“效果暂未支持”。它不同于已经判断为对当前 scenario 无效的特性。
_Avoid_: No-effect ability, Inactive ability, 无效特性

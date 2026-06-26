# Pokémon Damage Calc

宝可梦对战伤害计算器。用户以最小输入获得一次 matchup 的充分伤害信息，并可选择收紧参数以缩小结果范围。

## Language

**Matchup**:
一次计算上下文：进攻方、防守方及隐含的 **ruleset + battle format**（当前：Champions · VGC 双打）。Default view 下招式由系统自动挑选，不视为用户输入。
_Avoid_: Battle, fight, 对战（作名词指代计算单元时）

**Ruleset**:
一次 matchup 所依代的官方对战规则集；决定可用池、stat 公式版本、道具/特性合法性。当前固定为 **Pokémon Champions**（最新官方作品规则）。
_Avoid_: Generation picker, 世代选择（产品层用 ruleset 表述；实现层可映射到 calc 世代号）

**Battle format**:
对战形式；当前固定为 **VGC 双打**（2v2）。影响 default spread、move pick 使用率语境与常见配置预设；不改变「进攻方 → 防守方」单次伤害计算单元。
_Avoid_: Format selector, 赛制切换（首版不做）

**Move pick**:
系统从进攻方技能池中按使用率自动选出的招式集合（top-N）。用户未声明招式时，结果按 move pick 展开。
_Avoid_: Auto-move, 默认招式

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
通过数轴选取一段合法数值的 track；视为选中 **1** 项；该行的伤害 envelope 合并区间端点与 16 roll。
_Avoid_: Slider axis, stat range filter

**Row product rule**:
展示行数 = 各 track 选中数的乘积（∏ nᵢ）。数值范围 track 的 n 恒为 1。
_Avoid_: Cartesian product（领域层用 track 累乘表述）

**Build configuration**:
一方宝可梦在某一 track 上的取值；性格+努力、道具等分属不同 track，不含能力阶数。
_Avoid_: Scenario variant, 强化配置

**Default view**:
用户仅提供 matchup 最小输入时展示的宽结果视图，自动包含常见 scenario 与极限情况。
_Avoid_: One-shot view, 初始页

**Detailed view**:
用户在 default 选中集基础上调整各 track 选型以收紧结果；机制与 default view 相同（track 累乘），仅选中数减少。
_Avoid_: Advanced mode, 专家模式

**Damage range**:
通常 16 roll 下的最低 ~ 最高伤害值及其占防守方 HP 的百分比；在箱形图中以**箱体**表示。
_Avoid_: Damage spread, 伤害波动

**Crit range**:
暴击 roll 下的最低 ~ 最高伤害值；在箱形图中以**须须**及端点表示。
_Avoid_: Critical spread, 会心范围

**OHKO probability**:
16 roll 中有多少比例的伤害值 ≥ 防守方当前 HP（一击必杀概率）。
_Avoid_: Kill chance, KO rate

**Snap point**:
详细参数滑块的吸附预设：无修正无努力、无修正满努力、（非 HP 项）+修正满努力。
_Avoid_: Preset, anchor

**Bulk stat**:
防守方用于承伤的 stat 组合：HP + 物防或 HP + 特防（取决于招式类别）。
_Avoid_: Defensive spread

**Offense stat**:
进攻方用于输出的 stat：物攻或特攻（取决于招式类别）。
_Avoid_: Offensive spread

**Type**:
宝可梦或招式的属性（18 种标准属性）。用于识别展示（如 species typing badge），不单独表示克制倍率。
_Avoid_: Element, 元素

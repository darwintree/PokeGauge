# UI Prototype Decision Map

> Bootstrap: 2026-06-25
> Goal: 多轮原型设计，确定各组件样式与交互契约

## Resolved (user-declared)

以下决策已由用户声明，不再开 ticket：

- **交互分层**：Default view（最小输入、宽结果）→ Detailed view（用户声明参数、收紧结果）
- **Stat 调整控件**：带吸附的滑块；进攻方只调 offense stat，防守方只调 HP + bulk stat；吸附点为无修正无努力 / 无修正满努力 / +修正满努力（非 HP）
- **伤害可视化**：水平箱形图；**箱体** = 通常 16 roll 范围（最低 ~ 最高）；**须须** = 暴击伤害范围（端点）；粗竖线 = 平均伤害；X 轴为伤害占 HP 百分比（0–150%）；≥100% 用红色强调并标注 OHKO
- **参考资产**：[`assets/Snipaste_2026-06-25_21-07-46-15d1a984-26bb-49be-9a1e-109a6df7cd01.png`](../../.cursor/projects/Users-conflux-Documents-code-pokemon-damage-calc/assets/Snipaste_2026-06-25_21-07-46-15d1a984-26bb-49be-9a1e-109a6df7cd01.png)（常见模板对比 mock）
- **最小输入契约（#1）**：仅双宝可梦；系统按技能池使用率自动挑选 top-N 招式并展开结果；当前阶段使用率数据 hardcode
- **配置聚合模型（#2）**：配置项分为若干 **track**（多选 | 数值范围）；数值范围视为 1 项选中；展示行数 = 各 track 选中数累乘
- **页面 IA（#5）**：同一页、无模式切换；左 sticky 参数栏（matchup + track 控件）+ 右结果主区；mobile 参数块堆叠在结果上方
- **赛制与规则集（#6）**：当前固定 **Pokémon Champions** 规则集 + **VGC 双打**；规则切换留作后续能力，首版不做

---

## #1: Matchup 最小输入契约是什么？

Blocked by: —
Type: Discuss

### Question

用户说「某宝可梦 → 某宝可梦」即可 one-shot 展示。但伤害计算至少需要：招式、物理/特殊类别、世代规则。最小输入到底包含哪些字段？缺失字段如何推断？

候选方案：
- **A.** 双宝可梦 + 用户选招式（3 字段，招式不可推断）
- **B.** 双宝可梦 + 自动选最高威力本系招式（2 字段，招式默认推断）
- **C.** 双宝可梦 + 自动展示 top-N 招式的 scenario 组（2 字段，结果按招式展开）

### Answer

**C** — 最小输入为进攻方 + 防守方两个宝可梦。系统自动从进攻方技能池中按**使用率**挑选 top-N 招式，每个招式各自展开一组 scenario 对比（见 #2）。

- 使用率来源：目标态接 Smogon / 官方统计；**当前阶段 hardcode** 各宝可梦的高使用率招式列表。
- 用户未选手招式时，不在 default view 展示单招式 deep dive，而是多招式并列对比。
- Detailed view 中用户可声明/切换具体招式，从而收紧到该招式的精确配置（见 #3）。

---

## #2: Default view 应自动生成哪些 Scenario？

Blocked by: —
Type: Prototype

### Question

参考 mock 已有：标准输出、特攻/攻击 +1/+2、携带生命宝珠。还需哪些常见/极限 scenario？

待决分支：
- 「标准输出/标准 Bulk」的默认 nature + EV 定义（community spread？种族值对称假设？）
- 极限情况是否 = offense stat 最大 snap × bulk stat 最小 snap 的单行对比？
- 道具/特性/天气/场地是否纳入 default 列表，还是仅在 detailed view 出现？
- Scenario 数量上限（信息密度 vs 可读性）
- 多招式（top-N）× 多 scenario 的结果页组织方式

**决策路径**：问题过于复杂，不在 discuss 阶段定稿；通过 UI 原型翻转对比。

### Answer

**已决（原型验证 2026-06-25）** — 结果页按 **track 累乘** 生成展示行，不再以固定 scenario 列表组织。

#### Track 模型

配置项拆为若干独立 **track**。每个 track 两种类型：

| 类型 | 交互 | 计入选中数 |
|------|------|-----------|
| **多选** | pill / checkbox 选多项 | 选中项个数 n |
| **数值范围** | 数轴选段（如物攻 min–max） | 恒为 **1**（视为选中单一选项） |

**展示行数** = ∏(各 track 选中数)

每一行 = 各 track 当前选中项的一个组合（笛卡尔积）；数值范围 track 与 16 roll（及暴击）合并为单行 envelope。

#### 当前原型中的 track（烈咬陆鲨 → 咆哮虎 fixture）

| Track | 类型 | 内容 |
|-------|------|------|
| 招式 | 多选 | top-N 使用率招式 |
| 攻击方实数值 | 多选 **或** 数值范围 | 性格+努力预设 / 数轴选段 |
| 攻击方道具 | 多选 | 无道具、生命宝珠、讲究头带… |
| 防守方配置 | 多选 | 性格+努力坦度预设 |

实数值 track 在同一时刻只启用一种输入方式（预设多选 XOR 数轴），避免重复计数。

#### 仍留给 default 集 / 实现阶段

- 各 track 的 default 选中集（default view 宽结果）
- 行数过多时的折叠/分组（presentation，不改变累乘契约）

**Prototype asset**: React scenario explorer removed (verdicts captured in issues / production). Active throwaway: [`stat-range-axis-prototype.html`](../../src/prototype/stat-range-axis-prototype.html).

---

## #3: Detailed view 如何「收紧」结果？

Blocked by: —
Type: Discuss

### Question

用户声明详细参数后，UI 行为是：
- **收敛**：多行 scenario 折叠/过滤，只保留与声明参数一致的行？
- **替换**：scenario 列表消失，单行箱形图对应当前精确配置？
- **混合**：保留对比行但高亮/置顶当前配置，其余降级或折叠？

### Answer

**与 #2 track 模型统一** — 不存在单独的 detailed 交互范式；**收紧 = 减少各 track 的选中数**：

- 多选 track：取消选项 → 累乘行数下降
- 数值范围 track：缩窄区间（仍为 1 项）→ 单行 envelope 变窄，行数不变

Default view 与各 track 的 default 选中集由实现阶段定义；同一页、同一累乘逻辑，无替换/折叠模式切换。

---

## #4: 箱形图语义如何映射 16 离散 roll？

Blocked by: —
Type: Prototype

### Question

宝可梦伤害只有 16 个离散 roll，不是连续分布。mock 中「箱体 + 须须」各代表什么？
- 须须 = min/max roll（已明确）
- 箱体 = 全部 16 roll 的范围？还是中间 band（如 25–75 百分位）？
- 平均线 = 16 roll 算术平均？

需原型验证何种映射在视觉上最直觉，且与 OHKO 标注一致。

### Answer

**已决** — 箱形图语义：
- **箱体** = 通常 16 roll 的最低 ~ 最高（非暴击）
- **须须** = 暴击伤害范围；端点圆点为暴击最低 / 最高
- **粗竖线** = 通常 roll 算术平均
- 暴击区间在通常区间上方时，用虚线桥接两段

当前 mock 以 Gen 6+ 1.5× 暴击倍率 hardcode；见 [`damage-box-plot.tsx`](../../src/components/scenario-explorer/damage-box-plot.tsx)。

---

## #5: 页面信息架构与输入区布局

Blocked by: —
Type: Prototype

### Question

Default / Detailed 是同一页渐进展开，还是分区/步骤？
- 输入区：matchup 选择器 + 详细参数面板的位置与默认折叠状态
- 结果区：箱形图对比块 vs 单 matchup 摘要的优先级
- 移动端：scenario 标签 + 箱形图如何响应式堆叠

### Answer

**已决（原型验证 2026-06-26）** — **Variant B: Sidebar refine**

- **Default / Detailed**：同一页；收紧 = 左栏减少 track 选中（同 #3），无步骤/抽屉/模式切换
- **输入区**：左栏 sticky（desktop `lg:w-72`）；顶部 matchup，其下各 track 控件；mobile 左栏变为结果上方的参数块（单列堆叠）
- **结果区**：右栏主区；标题 + 选中摘要 + 箱形图列表；结果优先于参数的视觉权重
- **移动端**：非分栏；参数块 → 结果区纵向堆叠；箱形图标签与 plot 保持现有单列宽度

**Prototype asset**: Sidebar layout verdict in production `ScenarioExplorerPage`. Stat range UI: [`stat-range-axis-prototype.html`](../../src/prototype/stat-range-axis-prototype.html).

---

## #6: 赛制与世代范围

Blocked by: —
Type: Research

### Question

计算器服务哪个世代/赛制（Gen 9 OU？VGC？全世代？）？影响 stat 公式、可用道具/特性和 default scenario 集合。

### Answer

**已决（用户声明 2026-06-26）**

| 维度 | 当前默认 | 备注 |
|------|----------|------|
| **规则集** | **Pokémon Champions** | 宝可梦最新官方作品的对战规则；决定可用宝可梦、招式、道具、特性及 stat 公式所依代的游戏世代 |
| **对战形式** | **VGC 双打** | 双打赛制（2v2）；matchup 语境下仍指「进攻方 → 防守方」单次伤害，但默认 spread / 使用率 / 常见配置按 VGC 双打生态 |
| **规则切换** | **首版不做** | 今后可能支持切换规则集或赛制；当前全局固定，UI 不暴露 selector |

#### 对其它 ticket 的影响

- **#1 move pick**：使用率与技能池按 Champions + VGC 双打语境 hardcode（非 Smogon OU 单打）
- **#2 default track 选中集**：道具、性格+努力预设应对齐 VGC 常见配置（如 Level 50、双打常见坦度/输出 spread）
- **实现**：伤害引擎在 Champions 数据就绪前可暂借 `@smogon/calc` 最近世代；产品语义以 Champions 为准

#### 明确不在首版范围

- 规则集 / 赛制切换 UI
- 单打 OU、其它非 VGC 赛制作为并列 default

---

## Fog of war

以下区域尚未开 ticket，待 frontier 推进后按需追加：

- 规则集 / 赛制切换 UI（#6 已声明后续能力）
- top-N 的 N 值与 hardcode 数据结构（若 #2 未覆盖）
- 结果页除箱形图外的辅助信息（克制、实际数值表、复制/share）
- 无障碍与色盲友好（红/橙 lethal 编码的替代方案）

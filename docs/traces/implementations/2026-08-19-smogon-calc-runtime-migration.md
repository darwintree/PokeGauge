# Implementation Trace: @smogon/calc Runtime Damage Migration

Date: 2026-08-19
Source: .issues/20260819_open_migrate-runtime-damage-calculation-to-smogon-calc.md
Language: 中文

## Entries

### 1. 展示层修正表保留为纯显示投影

Type: unresolved-implementation-decision

Context:
issue 要求删除本地 ability/item/weather/terrain/screen 修正，但同时 design.md 的结果面不变量要求公式明细 tooltip（phases）继续展示各阶段倍率。calc 的 rawDesc 不暴露 STAB/spread/effectiveness/final 的数值阶段，删除本地表会让 tooltip 失去数据源。

Decision:
删除 damage-kernel.ts 的伤害公式（calculateBranchRolls），本地修正表保留但只作为 mechanics-projection 的显示投影，不再参与伤害。伤害完全由 calc 计算。

Reason:
满足 issue 的 calc 单一伤害来源，同时保住 design.md 的结果面不变量。显示投影与伤害路径解耦，两者由同一份 calc context 驱动。

Follow-up:
若产品决定简化公式明细 tooltip，可再删除显示投影。

### 2. calc-missing 能力在展示层的拦截

Type: unresolved-implementation-decision

Context:
issue 要求 4 个 calc 缺失能力（Mega Sol/Dragonize/Eelevate/Fire Mane）显式 unsupported，绝不静默按中性计算。但编译器展示层仍会按本地逻辑应用这些能力的修正（如 Dragonize 改属性、Mega Sol 改天气），与 calc 的实际中性结果矛盾。

Decision:
将支持边界统一为 calcRecognizesAbility：展示层（compileAbilityEffect、resolveAbilityScenarioMoveType、Mega Sol 天气、地形接地）在能力不被 calc 认识时全部中性化，状态强制 unsupported。

Reason:
让展示与 calc 数值一致，满足"绝不静默给出错误中性计算"。

Follow-up:
None.

### 3. calculationIdentity 剥离 calc context

Type: unresolved-implementation-decision

Context:
CompiledDamagePoint 新增 calc context 后，calculationIdentity 序列化 outcome.calculation 会包含 calc，导致原本效果等价的选择（如 inert 能力 vs 无能力）不再合并，改变结果行数。

Decision:
calculationIdentity 只基于 branch 字段（不含 calc context）计算。

Reason:
结果合并以展示分支为准；calc context 只是伤害输入。合并组内的伤害取组内首个 outcome 的 calc context，等价选择共享同一伤害。

Follow-up:
None.

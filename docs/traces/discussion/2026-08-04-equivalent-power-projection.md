# 等效威力展示投影 讨论记录

对应 spec change: None.

## 1. 展示威力的术语与定义

问题：展示的“最终威力”应定义为哪种可解释值；当阶段化取整无法压缩为单一等价威力时，是展示分阶段值、理论等价值，还是调整标签。

决定：采用新术语“等效威力”（zh-Hans／zh-Hant：等效威力；en：Equivalent Power；ja：実質威力）。保留单一数字，定义为理论折算值，锚定关系式 `伤害 ≈ 攻击 × 等效威力 / 防御`；它不是 kernel 直接使用的变量。

## 2. 投影计算的 phase 顺序与范围

问题：等效威力包含哪些 kernel phase、按什么顺序、用哪套取整；攻击／防御 stat 修正是否折入。

决定：按 kernel 阶段顺序逐步应用同一套整数运算：`max(1, apply(power, basePowerModifier))`（Base Power 链含 item、weather base、terrain）→ `apply(spread)` → `apply(weather damage)` → `apply(STAB)` → `floor(× typeEffectiveness / 4096)` → `apply(Final 链)`，最终 `max(1, ·)`；属性免疫（typeEffectiveness=0）显示 0。攻击／防御 stat 修正（能力阶级、stat 类道具、未来特性）不折入；随机 roll、`+2` 与 levelFactor 常数也不折入。

## 3. Final 链是否纳入

问题：Life Orb、抗性树果、墙等 Final 链修正是否压进等效威力。

决定：纳入。所有非攻防的乘法因子都参与折算；tooltip 按 phase 展示明细。

## 4. 普通与会心分支的展示

问题：普通分支与必定会心分支存在差异时，展示投影如何表达。

决定：按分支投影。普通分支含墙、不含会心修正；会心分支不含墙、含 ×1.5。表头显示 `normal ?? critical`；tooltip 可显示两个分支值。

## 5. 投影 module 的位置与形态

问题：投影应作为 compileScenario 内联字段，还是独立导出。

决定：作为 damage-calculation 子模块的纯函数 `projectMoveMechanics(compiled)` 从 `lib/damage-calculation` 导出；`compileScenario` 不再构造 `effectivePower`／`modifiers`；pipeline 与 React 都从该导出消费。投影按 phase 组织明细，删除扁平 `modifiers` map（含死字段 `modifiers.screen`）。

## 6. 命中语义的 canonical 形态与展示

问题：命中展示是否直接来自 canonical probability input；always-hits、天气 override、超过 100 的封顶如何呈现；必中与 100% 是否合并。

决定：compiled 结果携带已解析命中事实（`always-hits` 或数值）；`hitProbability` 由同一解析派生。结果卡统一显示归一化有效命中概率（必中与 100% 封顶都显示 100%）；“必中”语义只保留在 Move Snapshot 与 tooltip。merge identity 继续使用 `hitProbability`，必中与 100% 仍可效果等价合并（保持 2026-07-17 讨论记录 #11／#23）。

## 7. Scenario Merge 与 identity

问题：Scenario Merge 是否直接复用同一 canonical calculation identity。

决定：保持现有 calculation identity（calculation + probability + ko）；投影是编译结果的纯函数，合并行展示由同一来源派生，不把投影加入 identity。

## 8. tooltip 说明文字

问题：tooltip 是否注明等效威力不是 kernel 变量，文案如何表达。

决定：在公式明细底部显示：“等效威力为折算数值，用于估算伤害：伤害 ≈ 攻击 × 等效威力 / 防御”。

# 伤害对比结果行信息架构讨论记录

对应 issue: [[20260626_open_damage-comparison-results-info-display-needs-refinement|Results info display]]

## 1. 结果行底部冗余摘要行

问题：每行左侧标签区底部有一行小字摘要（区间/roll 合并说明 + 道具名 + 防守方说明），对普通（非区间）结果行而言几乎只重复道具名称，是否保留？

决定：**直接删除**。区间说明已在上方单独展示；道具改用图标后不再需要这行文字。

## 2. 「无加成」标注位置

问题：道具名改为图标 + hover tooltip 后，属性强化道具对当前招式无加成时的「无加成」标注放在哪里？

决定：**图标旁的行内小字**，与图标同行展示，不需要 hover 才能看到。

## 3. OHKO 标记去重

问题：`ohkoChance` 有值时，行尾会同时渲染静态「OHKO」徽章和「X% OHKO」百分比徽章，信息重复，如何处理？

决定：**合并为单一标记**，统一用百分比形式（`X% OHKO`），去掉静态「OHKO」徽章。

## 4. 仅暴击可 OHKO 的边界情况

问题：普通 16 roll 最大伤害 < 100%、但暴击最大伤害 ≥ 100% 时，`ohkoChance`（仅基于普通 roll）为 `undefined`，无法用百分比表达，如何标注？

决定：v1 显示文字标签「仅暴击 OHKO」作为过渡；综合命中与暴击的完整 OHKO/2HKO 概率计算另开 issue 跟进（[[20260701_open_ohko-2hko-probability-should-combine-normal-and-crit-rolls|OHKO/2HKO combined probability]]），不在本 issue 范围内实现。

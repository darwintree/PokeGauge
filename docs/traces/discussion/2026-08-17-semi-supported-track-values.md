# Semi-supported Scenario 计算警告讨论记录

对应 spec change: None.

## 1. 计算支持度

问题：部分实现计算语义时，应如何描述其计算结果。

决定：把仍能产出结果但缺失部分语义的 Scenario 记为 `semi-supported`。不为 Track Value 建立 supported／semi-supported／unavailable 状态组。

## 2. 与 Selection Activation 的关系

问题：`semi-supported` 是否属于 Track Value 或 Track Selection Activation。

决定：`semi-supported` 只描述 Scenario，不属于 Track Value，也不向 `active`、`inactive`、`unsupported`、`neutral` 中加入第五种 Activation。

## 3. 本次 Track 范围

问题：哪些值会使 Scenario 成为 `semi-supported`。

决定：处理 Move Snapshot，并附带处理 Grassy Terrain；其他 Track 暂不扩大。

## 4. 结果行为

问题：Semi-supported Scenario 是否停止计算或在结果区增加近似结果标记。

决定：继续产出当前结果，不在结果区增加近似结果标记。

## 5. 警告位置

问题：警告应显示在 picker、结果区还是已创建的 Move Snapshot。

决定：Move 警告只显示在 Move Snapshot，折叠态和展开态都显示；不在 picker 或结果区重复显示。

## 6. Tooltip 交互

问题：警告如何展开，以及是否只支持鼠标悬停。

决定：使用 Tooltip 显示问题；支持 hover、键盘 focus 与触屏 tap。

## 7. 警告内容

问题：警告使用统一文案还是说明具体缺失问题，概率性效果是否显示概率。

决定：显示具体问题，但不显示触发概率。

## 8. 多问题归并

问题：同一 Move Snapshot 存在多个缺失语义时显示一个还是全部问题。

决定：只显示一个问题，按固定优先级选择：完全改变伤害公式、多段、动态威力、命中／会心概率、能力变化、场地附加语义。

## 9. Snapshot 编辑

问题：用户编辑 Move Snapshot 的威力或命中率后是否移除警告。

决定：警告由稳定 Move identity 决定，Snapshot 编辑后保留。

## 10. 多段招式

问题：哪些多段招式进入本次部分支持范围。

决定：纳入 27 个具有结构化多段元数据的候选，并静态补入 Population Bomb、Triple Dive、Twin Beam 与 Tachyon Cutter，共 31 个。

## 11. 目标防御能力变化

问题：伤害后降低目标 Defense 或 SpDef 的招式是否进入本次范围，以及是否自动从 PokeAPI 分类。

决定：纳入当前审计出的 23 个目标降防招式；使用手写 Move ID 映射，不扩展资源 schema，也不显示触发概率。

## 12. 使用者攻击能力变化

问题：改变使用者 Attack 或 SpA、从而改变本次或下一次同招伤害的招式是否进入本次范围。

决定：纳入当前审计出的 18 个招式，包括提升与降低使用者 Attack／SpA 的情况。

## 13. Grassy Terrain

问题：Grassy Terrain 缺失的哪项语义需要披露，以及是否同时处理其他 Track 的浮游联动。

决定：标明当前未计算回合结束回复；本次不处理其他 Track 的浮游联动。

## 14. 明确排除的招式类别

问题：连续使用／战斗历史威力、条件威力，以及使用后无法原样连续使用的招式是否进入本次范围。

决定：本次不纳入这些类别，也不进一步追求其他类别的完备枚举。

## 15. 高会心招式

问题：当前未承载资源 `critRate` 的招式是否标为部分支持。

决定：本次不标记；另建 issue 传递固有会心等级并验证 Battle Odds，该 issue 不涉及部分支持警告。

## 16. 原 issue 契约

问题：是否保留原 issue 的 fail-closed、高会心传递、`<=2HKO` 假设 Tooltip 与编辑风险 Tooltip 等要求。

决定：全部废弃，以本次确认的简化警告方案替换。

---
# This section is managed by the CLI. Do not edit manually.
id: "16e68b3d-91d7-441c-a913-ac51290669c8"
title: "Enforce an audited Move calculation boundary"
status: "closed"
priority: "high"
labels: ["BUG", "NEEDS-TRIAGE"]
created_at: "2026-08-12T07:49:00Z"
updated_at: "2026-08-17T15:29:00Z"
---
## Problem

部分 Scenario 已能产出有用结果，但仍有会影响伤害或 KO 概率的语义未被计算。当前 UI 没有披露这类结果所缺失的语义。

本票把包含受影响 Move identity 或 Grassy Terrain 的 Scenario 记为 `semi-supported`。它继续产出当前结果，并在造成该状态的 Move Snapshot 或 Grassy Terrain Selection 上披露一个具体的缺失语义；不再采用原先计划的 fail-closed Move 边界。

## Issue Assessment

- Impact：用户会把未披露的简化结果理解为完整游戏语义，尤其是 multi-hit 与连续两次伤害分布。
- Evidence：Move Snapshot 只有单一威力、命中率与会心阶段；当前不会组合多段伤害，也不会在两次攻击之间应用能力阶级或 Grassy Terrain 回合末回复。
- Scope：包含本票明确列出的 Move identity 或 Grassy Terrain 时，Scenario 为 `semi-supported`，并在对应值上显示单一问题警告。
- Decision：valid；采用静态受审核映射，不扩展 PokeAPI 资源 schema。

## Confirmed contract

- `semi-supported` 描述 Scenario，不是 Track Value 或 Track Selection Activation 状态。
- Semi-supported Scenario 仍产出当前结果，不在结果区增加近似结果标记。
- Move 警告只显示在 Move Snapshot 的折叠态与展开态；不在 Move picker 或结果区显示。
- 警告 Tooltip 支持 hover、键盘 focus 与触屏 tap，并使用四种 Supported locale 的具体问题文案。
- 同一 Move Snapshot 只显示一个问题。优先级为：完全改变伤害公式、多段、动态威力、命中／会心概率、能力变化、场地附加语义。
- Move 警告按稳定 Move identity 查询；用户编辑 Snapshot 的威力或命中率后仍保留。
- 本票使用手写 Move ID → 问题映射，不把警告分类字段加入生成资源、Catalog 或 Snapshot 持久化结构。
- 包含 Grassy Terrain 的 Scenario 为 `semi-supported`，对应 Selection 提示当前未计算回合结束回复；本票不处理其他 Track 的浮游联动。

## Moves that make a Scenario semi-supported

### Multi-hit：当前结果只计算一次命中

- 3 Double Slap
- 4 Comet Punch
- 24 Double Kick
- 31 Fury Attack
- 41 Twineedle
- 42 Pin Missile
- 131 Spike Cannon
- 140 Barrage
- 154 Fury Swipes
- 155 Bonemerang
- 167 Triple Kick
- 198 Bone Rush
- 292 Arm Thrust
- 331 Bullet Seed
- 333 Icicle Spear
- 350 Rock Blast
- 458 Double Hit
- 530 Dual Chop
- 541 Tail Slap
- 544 Gear Grind
- 594 Water Shuriken
- 742 Double Iron Bash
- 751 Dragon Darts
- 799 Scale Shot
- 813 Triple Axel
- 814 Dual Wingbeat
- 818 Surging Strikes
- 860 Population Bomb
- 865 Triple Dive
- 888 Twin Beam
- 911 Tachyon Cutter

### Target Defense／SpDef drop：连续攻击未应用目标能力阶级变化

- 51 Acid
- 94 Psychic
- 231 Iron Tail
- 242 Crunch
- 247 Shadow Ball
- 249 Rock Smash
- 295 Luster Purge
- 306 Crush Claw
- 405 Bug Buzz
- 411 Focus Blast
- 412 Energy Ball
- 414 Earth Power
- 430 Flash Cannon
- 465 Seed Flare
- 491 Acid Spray
- 534 Razor Shell
- 680 Fire Lash
- 708 Shadow Bone
- 710 Liquidation
- 787 Apple Acid
- 788 Grav Apple
- 823 Thunderous Kick
- 855 Lumina Crash

### User Attack／SpA change：当前或下一次同招未应用使用者能力阶级变化

- 232 Metal Claw
- 246 Ancient Power
- 276 Superpower
- 309 Meteor Mash
- 315 Overheat
- 318 Silver Wind
- 354 Psycho Boost
- 434 Draco Meteor
- 437 Leaf Storm
- 451 Charge Beam
- 466 Ominous Wind
- 552 Fiery Dance
- 612 Power-Up Punch
- 705 Fleur Cannon
- 800 Meteor Beam
- 871 Torch Song
- 874 Make It Rain
- 905 Electro Shot

## Related issues

- [[../20260715_open_specify-random-multi-hit-and-accuracy-mechanics|Specify random multi-hit and accuracy mechanics]]：完整 Hit Composition 与 multi-hit 计算模型。
- [[../20260806_open_complete-missing-pokeapi-move-behavioral-metadata-upstream|Complete missing PokeAPI move behavioral metadata upstream]]：上游 Move 行为元数据缺口。
- [[20260817_closed_propagate-intrinsic-move-critical-rate-into-snapshots|Propagate intrinsic Move critical rate into snapshots]]：单独传递招式固有会心等级；不属于本票警告范围。
- [[../20260717_open_define-ruleset-aware-move-candidate-pool-and-learnset-validation|Define ruleset-aware Move candidate pool and learnset validation]]：候选招式的 ruleset／learnset 合法性；与本票的「是否可可信计算」正交。

## Out of scope

- 实现 multi-hit、能力阶级状态转移或 Grassy Terrain 回合末回复本身。
- 连续使用／战斗历史决定威力的 Move。
- 依赖 HP、速度、重量、状态、道具或其他条件的动态威力 Move。
- 使用后失去属性或不能连续使用的 Move。
- 传递资源 `critRate`；由关联 issue 单独处理。
- 继续枚举本票未列出的机制类别。

## Verification Checklist

- [x] 31 个 multi-hit、23 个目标降防、18 个使用者攻击能力变化 Move identity 均映射到约定问题。
- [x] Move Snapshot 折叠态与展开态显示警告；picker 与结果区不显示。
- [x] Tooltip 支持 hover、focus、tap，并提供四种 Supported locale 文案。
- [x] 同一 Move Snapshot 只按约定优先级显示一个问题。
- [x] 编辑 Move Snapshot 后，Move identity 警告仍保留。
- [x] Grassy Terrain 显示未计算回合结束回复的警告，不扩大其他 Track 的浮游联动。
- [x] `semi-supported` 只作为 Scenario 描述，不成为 Track Value 或 Track Selection Activation 状态。
- [x] 代表性的支持、部分支持、不可计算与持久化恢复路径有回归覆盖。
- [x] 逐条核对 [[../docs/traces/discussion/2026-08-17-semi-supported-track-values|讨论记录]]，确认每项决定均已实现。
- [x] build、完整测试及 frontend review-and-correct 通过。

## Progress Log

- 2026-08-12：release readiness 讨论确认该问题为公开发布前必须关闭的正确性边界。
- 2026-08-17：废弃 fail-closed 方案，确认以受审核静态映射披露 Semi-supported Scenario 的缺失语义。
- 2026-08-17：完成 Move 审核映射、Scenario support 元数据、Snapshot/Grassy Terrain Tooltip 与四语回归覆盖；warning/support 不写入 Snapshot 持久化结构，恢复后按 Move identity 与 Terrain 重新派生。

# Implementation Trace: Ability immunities and type exceptions

Date: 2026-08-12
Source: `.issues/20260805_working_ability-immunities-and-type-exceptions.md`
Language: 中文

## Entries

### 1. 用 Terrain mechanics 反事实判断离地贡献

Type: unresolved-implementation-decision

Context:
冻结契约要求 Levitate／Eelevate 同时参与 grounded gate，且只有实际改变结果时 Ability 才为 `active`，但没有指定 compiler 如何判断离地对 Terrain 的独立贡献。

Decision:
compiler 分别以当前双方 Ability 编译实际 Terrain effect，再仅移除待判断一侧的离地 Ability 重新编译反事实 effect；比较 `basePowerModifier`、`makesSpread` 与 `unavailable` 三项可计算机制输出。三项任一变化即表示该侧 Ability 对 Terrain 有贡献。

Reason:
这三项完整构成当前 Terrain compiler 会传给 Scenario 可计算性和伤害公式的行为输出；`state` 是这些行为的 provenance 归类结果，不应反过来成为贡献判断输入。单侧反事实也能在双方同时离地时分别保留各自的贡献判断。

Follow-up:
None.

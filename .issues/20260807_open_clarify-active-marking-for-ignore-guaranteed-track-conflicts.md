---
# This section is managed by the CLI. Do not edit manually.
id: "b51b6c17-cb49-407b-96fa-14e447f4c481"
title: "Clarify active marking for ignore/guaranteed Track conflicts"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "WAYFINDER:GRILLING"]
created_at: "2026-08-07T10:06:00Z"
updated_at: "2026-08-07T10:08:00Z"
---
## Goal

明确一类会导致 Track／来源「冲突」的场景下，`Track Selection Activation`（尤其是 `active`／`inactive`）应如何标记：一方**无视／绕过／压制**另一方，或一方使结果变成**必定**（会心、必中等）从而吞掉其他来源的贡献。

产物应是可复用的产品契约（必要时再写入 `CONTEXT.md`／讨论记录），供后续 Ability、道具与 Stage／Screen／Weather 实现直接引用，避免每个子 issue 重新发明 provenance。

## Motivation

在 [[20260805_open_ability-stage-and-screen-bypass|Ability stage and screen bypass]] 的 grilling 中，为 Unaware／Infiltrator 的 provenance 对照了现有实现。冲突场景已有多套局部规则，但缺少一条显式的总契约。

## Observed patterns（现状调查，非最终契约）

当前代码与既有讨论里，较一致的做法是：**谁真正改变了本 Scenario 最终采用的修正，谁才 `active`；被整行抹掉的一方标 `inactive`。仅在某一伤害分支（如会心须须）上的部分忽略，不把对应 Track 翻成 `inactive`。**

| 冲突 | 被压制／被吞方 | 压制／无视方 |
| --- | --- | --- |
| `+3` 必定会心吞掉攻方负阶／防方正阶 | Stage `inactive` | （会心来自 Move Snapshot／派生，不另开 Ability 来源） |
| `+0`–`+2` 会心须须部分忽略 Stage／墙 | Stage／Screen 仍可 `active` | — |
| 破墙招／错类别墙 | Screen `inactive` | 招式非 Track 来源 |
| Battle Armor／Shell Armor vs Super Luck／Sniper／会心道具 | 会心贡献方 `inactive` | 防暴 Ability `active` |
| Utility Umbrella vs 普通晴雨火／水伤 | 天气在不再贡献时可 `inactive` | 伞在确实压制时 `active` |
| No Guard 但招式已是 Always-hit | No Guard `inactive` | — |

Unaware／Infiltrator 的 grilling 已按同一「贡献判定」采纳（见 [[../docs/traces/discussion/2026-08-07-ability-stage-and-screen-bypass|Ability Stage 与 Screen 绕过讨论记录]] §4 与 [[20260805_open_ability-stage-and-screen-bypass|Ability stage and screen bypass]]）；本 issue 负责把该规则升格为跨机制总契约，并扫清例外。stage／screen bypass **不阻塞**于本票。

## Questions to resolve

- 「整行抹掉」与「仅某一分支忽略」的判定边界是否永远按上表，有无例外。
- 多个无视／必定来源同时成立时（如 `+3` + Unaware 同时让防方正阶不生效），各方 Activation 如何分配。
- 该契约是否进入 `CONTEXT.md` 词条，还是只留讨论记录 + 实现审计清单。
- 结果主行／折叠「未生效」的展示是否一律跟随 Activation，有无信息层级例外。

## Out of scope

- 实现 Unaware／Infiltrator 本身（见 stage／screen bypass 子 issue）
- 新增 HP%／状态等 Track
- 改 damage kernel 接口

## Acceptance criteria

- [ ] 形成书面契约：无视／绕过／压制／必定类冲突下的 `active`／`inactive`／`neutral` 规则，含「整行 vs 单分支」与「无增量 → inactive」。
- [ ] 用至少上述现状表中的代表案例做一致性核对；标出并决定任何例外。
- [ ] 约定契约落点（`CONTEXT.md` 与／或 `docs/traces/discussion/…`）。
- [ ] 列出需回写或交叉引用的既有／进行中 issue（含 stage／screen bypass）。
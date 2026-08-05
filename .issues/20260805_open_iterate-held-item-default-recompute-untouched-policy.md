---
# This section is managed by the CLI. Do not edit manually.
id: "dddd1261-1c58-4c96-a8fc-6cc4ff678d13"
title: "Iterate held-item default recompute / untouched policy"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-05T02:50:00Z"
updated_at: "2026-08-05T03:24:00Z"
---
## Goal

重新评估 Held item Track 在切换 Identity、异步使用率返回、以及用户已编辑选中态时，何时允许用使用率重算「候选池 / 默认选中」。

## Current decision (baseline)

与 Move / Ability 对齐：仅当该侧 Held item Track 仍为 **untouched** 时，异步使用率可写入池与默认选中；用户改过选中或池后不得覆盖。切换 Battle Pokémon Identity（含形态道具确认切换）后，在新 Identity 上重新走默认。恢复已保存 Matchup 时以保存状态为准，不用使用率覆盖。

该基线来自三期 Held-item 决策讨论（presentation / usage defaults / form-from-item），实现阶段先按此执行。

## Why revisit

今后可能需要区分「池重建」与「默认选中重算」、在对手变更时更新默认、或对「仅改选中 vs 改池成员」采用不同 untouched 粒度。本 issue 跟踪这类迭代，避免在基线实现里偷偷改契约。

## Questions to resolve (later)

- untouched 的粒度：选中集合、池成员、还是整个 Track。
- 仅防守方 / 仅攻击方变更时，对侧 Held item 默认是否允许刷新。
- 形态确认切换与普通 Pokémon 重选是否共用同一套 preserve 规则。
- 与已保存 Matchup 恢复、分享链接还原的优先级。

## Related

- [[archive/20260731_closed_choose-default-held-items-from-usage-data]]
- [[archive/20260803_closed_decide-held-item-track-presentation-and-selection-model]]
- [[archive/20260803_closed_decide-whether-held-items-may-change-pokemon-form]]

## Non-goals

- 不在本 issue 重新决定「高使用率 = top 10」或形态道具白名单。
- 不阻塞当前按 baseline 的实现。
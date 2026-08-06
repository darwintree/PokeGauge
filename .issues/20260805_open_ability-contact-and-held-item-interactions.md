---
# This section is managed by the CLI. Do not edit manually.
id: "43fafe38-886a-46cb-a5f9-d8c483e7e424"
title: "Ability contact and held-item interactions"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T10:30:00Z"
updated_at: "2026-08-05T10:30:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Split from

[[archive/20260805_closed_ordinary-hit-ability-damage-modifiers|Ordinary-hit ability damage modifiers]]

## Goal

实现 Ability、Move contact 语义与 Held Item hooks 的普通命中组合。

## Scope

- Fluffy：接触招式减伤与 Fire 招式增伤
- Long Reach：持有方招式不再视为接触
- Klutz：压制持有方 Held Item 的普通命中 hooks

## Shared rules

- 规则依据为 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 及 Champions override。
- 运行时使用本地 kernel、4096 整数修正和既有阶段顺序；`@smogon/calc` 仅作支持范围内的测试 oracle。
- 名单内特性须从 `unsupported` 转为可审计的 `active`／`inactive`。

## Open questions

- Move contact 语义的结构化来源与审核例外。
- Fluffy 在 Fire＋contact 同时满足时的整数链与 source state。
- Long Reach × Defender Fluffy 的去接触顺序。
- Klutz 对攻击方、守方、Mega Stone、形态锁定道具、neutral item 与 berry hooks 的精确边界。

## Out of scope

- Tough Claws 的 Base Power 修正
- Unnerve 与抗性树果
- 接触触发的反伤、状态或其他击后事件
- Mold Breaker

## References

- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]]
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Acceptance criteria

- [ ] Fluffy、Long Reach 与 Klutz 的完整普通命中相关分支按最终契约实现。
- [ ] contact 与 item suppression 的编译顺序可验证。
- [ ] 不改变 Move Snapshot 或 Held Item Track 的用户选择。
- [ ] 拆分讨论记录与后续契约讨论记录可逐条审计。

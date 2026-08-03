---
# This section is managed by the CLI. Do not edit manually.
id: "6db3e9d4-c7ab-4777-a548-2453f958ac45"
title: "Define ruleset-aware Move candidate pool and learnset validation"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-07-17T03:42:00Z"
updated_at: "2026-08-03T08:24:00Z"
---
## Context

Core battle mechanics 规格保留全局 PokeAPI Move candidate pool，并只用 Champions usage 决定置顶与默认选择；当前不校验 ruleset 合法性或当前 Battle Pokémon Identity 的 learnset。

## Question

定义何时以及如何用 ruleset-aware、Battle-Pokémon-Identity-specific learnset 替代全局候选池，包括权威数据来源、缺失数据回退、Champions usage 交集、候选命名与可审计验收。

## Source

[[archive/20260715_closed_integrate-battle-modifier-ordering-and-specification-seams|Integrate battle modifier ordering and specification seams]]

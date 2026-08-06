---
# This section is managed by the CLI. Do not edit manually.
id: "d2118c5d-06c1-46d5-8981-f1eeb4798833"
title: "Complete missing PokeAPI move behavioral metadata upstream"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-06T03:01:00Z"
updated_at: "2026-08-06T10:20:00Z"
---
## Problem

PokeLens 以 PokeAPI 作为 Move 资源与行为语义的 source of truth，但 PokeAPI 当前不足以完整表达部分特性所需的 Move 行为：

- `move_flag_map.csv` 对普通 Move ID `827..919` 没有任何记录，已知漏掉 Jet Punch 的 `contact` / `punch`、Bitter Blade 的 `contact` / `slicing`、Wave Crash 与 Collision Course 的 `contact`。
- `move_flags.csv` 未定义 `slicing`。
- `move_flag_map.csv` 对 recent sound Move 同样缺失映射，已知包括 Torch Song、Alluring Voice 与 Psychic Noise；这会使 Liquid Voice 误判为 `inactive`。
- 近期 Move 普遍缺少 `move_meta`；`drain < 0` 不能完整覆盖 recoil，且没有 crash damage 的结构字段。
- PokeAPI 没有能精确表达 Sheer Force removable-secondary eligibility 的结构字段。
- REST Move resource 不暴露数据库内部的 Move attributes；PokeLens 当前可直接消费官方 CSV，因此 REST 暴露不是本地实现的前置。

缺行无法区分“明确为 false”与“尚未录入”，直接按 false 消费会把已知正例误判为 `inactive`。

## Goal

向 PokeAPI 上游提交一个或多个 PR，使 PokeLens 所需的 Move 行为在 PokeAPI 中有完整、结构化、可按 numeric Move ID 消费的记录；上游合并后更新仓库中的 PokeAPI pin。

## Source-of-truth contract

- PokeAPI 是 PokeLens 运行时与生成时 Move 语义的唯一 source of truth。
- 不为这些缺口新增本地 fallback、Showdown / calc 运行时依赖、按名称匹配或效果文本解析。
- Showdown 等资料可作为上游 PR 的核对证据，但不成为 PokeLens 的生产数据源。
- 上游希望不同数据形状时，允许拆分 PR；本地保留一张 issue 跟踪整体结果。

## Upstream scope

- [ ] 补齐近期 Move 的 `contact` / `punch` / `bite` / `pulse` attribute mappings。
- [ ] 补齐近期 Move 的 `sound` attribute mappings，至少覆盖 Torch Song、Alluring Voice 与 Psychic Noise。
- [ ] 为 `slicing` 定义结构化 attribute 并补齐 mappings。
- [ ] 补齐近期 Move meta，并与上游维护者确定 recoil / crash damage 的 PokeAPI-native 表达。
- [ ] 与上游维护者确定 removable secondary / Sheer Force eligibility 的 PokeAPI-native 结构表达。
- [ ] 只在 PokeLens 需要或上游要求时处理 REST Move attribute 暴露；当前 CSV 消费路径足够。

## Related work

- [[archive/20260805_closed_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]]
- [[20260805_open_ability-contact-and-held-item-interactions|Ability contact and held-item interactions]]
- [[20260805_open_scenario-move-type-rewriting-and-protean-family-stab|Scenario Move Type rewriting and Protean-family STAB]]
- [[../docs/research/2026-08-06-pokeapi-move-trait-coverage|PokeAPI move-trait coverage for ability gates]]

## Verification Checklist

- [x] Pinned PokeAPI 与当前 upstream 的缺口已复现并记录。
- [ ] 上游 issue / PR 已提交并链接回本 issue。
- [ ] 已对覆盖 Move candidate pool 运行数据完整性检查。
- [ ] 上游改动合并后，仓库 PokeAPI pin 已更新。
- [ ] PokeLens 生成器已直接消费新的 PokeAPI 结构数据并有回归检查。

## Progress Log

- 2026-08-06: 完成 PokeAPI pin / upstream / REST / CSV 覆盖核对，确认 PokeAPI-only 不能完整表达当前所需的 Move 行为。
- 2026-08-06: 将 Liquid Voice 需要的 recent `sound` mappings 加入上游修复范围；本地仍不增加 fallback。

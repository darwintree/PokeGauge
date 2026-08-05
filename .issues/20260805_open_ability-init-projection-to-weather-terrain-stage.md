---
# This section is managed by the CLI. Do not edit manually.
id: "18b95ccd-1145-4def-b195-4179ba9eb479"
title: "Ability init projection to Weather Terrain Stage"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T09:30:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

选中投射类特性时，只做一次初始化：写入 Weather／Terrain／Stage Track；之后以 Track 为准，特性不持续锁定。

## Scope

**天气／场地初始化**

- Drought → 大晴天
- Drizzle → 下雨
- Sand Stream／Sand Spit → 沙暴
- Snow Warning → 下雪
- Electric Surge → 电气场地

**阶级初始化**

- Intimidate（防御方）→ 攻击方 Atk −1
- Defiant → 为持有方 Stage 新增 Atk `+1` 与 `+2`
- Competitive → 为持有方 Stage 新增 SpA `+2`

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §3–§6
- 相关基建：[[20260805_open_ability-track-none|Ability Track none]]

## Open questions

- Defiant 的 `+1` 与 `+2`：Stage Track **多选进 row product**，还是别的写入方式？
- 切走投射类特性后，已写入的天气／阶级是否保留（默认：保留，因只负责初始化）？

## Out of scope

- Cloud Nine 压制天气伤、Mega Sol 自带晴天伤模（见 weather/item composition 子 issue）
- 伤害公式本身

## Acceptance criteria

- [ ] 名单内特性选中时按契约初始化对应 Track。
- [ ] 初始化后用户可改 Track；特性不强制回写。
- [ ] 讨论记录 §3–§6 可逐条审计。
---
# This section is managed by the CLI. Do not edit manually.
id: "f1fba7c1-20ce-4100-804e-2aabece3fb1d"
title: "Ordinary-hit ability damage modifiers"
status: "open"
priority: "high"
labels: ["FEATURE-REQUEST"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-05T09:25:00Z"
---
## Parent issue

[[20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现首批**普通一击**直接伤害／命中／暴击／能力值修正类特性（原调研 A 类主体，已剔 Mold Breaker），编译进现有 Scenario seams。

## Scope（机制族）

- 已有基线：Adaptability
- Atk 加倍：Huge Power、Pure Power
- 属性进攻能力：Fire Mane、Water Bubble（进攻侧）
- 招式旗标 BP：Tough Claws、Technician、Sharpness、Mega Launcher、Sheer Force、Iron Fist、Reckless、Strong Jaw
- Fairy Aura
- 防御减伤／防御能力：Thick Fat、Dry Skin（伤害侧）、Filter、Solid Rock、Purifying Salt、Heatproof、Fluffy、Fur Coat
- 暴击：Shell Armor、Battle Armor、Super Luck、Sniper
- 命中／必中：No Guard、Sand Veil、Snow Cloak、Compound Eyes、Keen Eye、Hustle、Illuminate
- 阶级／墙：Unaware、Infiltrator
- 接触／道具交互（非 Unnerve）：Long Reach、Klutz
- 天气条件进攻：Sand Force、Solar Power（可与 composition 子 issue 分工接通 Weather seam）

完整英文名与 rank 见调研笔记；产品增补／剔除以讨论记录为准。

## Explicitly not in this issue

- Mold Breaker 族
- 免疫表、绿点条件族、类型重写／Protean、Track 初始化投射、Cloud Nine／Mega Sol／Unnerve

## References

- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §1、§14
- [[../docs/research/2026-08-05-champions-ability-damage-relevance-and-first-freeze|Champions ability damage-calc relevance and first freeze]]

## Acceptance criteria

- [ ] 名单内特性从 `unsupported` 变为可编译的有效／未生效来源。
- [ ] 整数相位与现有 Gen9／Champions seams 一致；有最小可跑检查。
- [ ] 父 issue checklist 对应项可勾选。
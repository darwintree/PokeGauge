---
# This section is managed by the CLI. Do not edit manually.
id: "21a56f0a-d719-42c9-843b-45775f885211"
title: "Ability weather and item composition"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "READY-FOR-AGENT"]
created_at: "2026-08-05T09:25:00Z"
updated_at: "2026-08-11T15:42:00Z"
---
## Parent issue

[[../20260715_open_implement-pokemon-ability-effects|Implement Pokémon ability effects]]

## Goal

实现特性与 Weather／Held item 的组合语义。

## Scope

- Cloud Nine／Air Lock：压制 raw Weather Selection 对当前已支持计算机制的影响
- Mega Sol：为当前已支持天气消费者提供有效晴天
- Unnerve：令对方 qualifying resistance Berry 减伤不生效

范围固定为 Cloud Nine、Air Lock、Mega Sol 与 Unnerve。

## Frozen contract

- 任一侧 Cloud Nine／Air Lock 都压制 raw Weather 对 weather damage、Base Power、Battle Odds 命中及 Sand Force／Solar Power Weather gate 的影响；Weather Selection 保留，不压制 Mega Sol。
- raw Weather 令 Weather Ball 因天气变体尚未支持而 unavailable 时，Cloud Nine／Air Lock 压制天气后按无天气基础行为保持 calculable。
- 任一侧 Mega Sol 都以有效晴天替换而非叠加 raw Weather 的语义；raw Weather Selection 不被改写。
- Cloud Nine、Air Lock 与 Utility Umbrella 不取消 Mega Sol；保留固定 Showdown 源码中的 Electro Shot 例外。
- Mega Sol 不补齐 Weather Ball 天气属性／威力机制；Mega Sol + Weather Ball 仍可 unavailable。
- 被压制或替换的 Weather 为 `inactive`；实际改变结果的 Cloud Nine／Air Lock／Mega Sol 为 `active`。raw Weather 已是 sun 且没有增量时 Mega Sol 为 `inactive`。
- 当前只有 attacker Unnerve 能压制 defender-only resistance Berry；覆盖全部 18 枚 frozen resistance berries，包括 Chilan Berry。qualifying Berry 为 `inactive`、Unnerve 为 `active`；Berry 原本不 eligible 时双方均为 `inactive`。
- 多个独立充分且底层 hook 原本 eligible 的抑制来源全部为 `active`，不按 compiler 顺序挑选赢家；被压制来源为 `inactive`。
- 四个 Ability 移除红色 unsupported 提示；不新增绿点、开关或 partial-support 披露。

## References

- [[../docs/traces/discussion/2026-08-11-ability-weather-and-item-composition|Ability weather and item composition 讨论记录]]
- [[../docs/traces/discussion/2026-08-05-ability-effects-first-freeze-scope|特性效果首批冻结范围讨论记录]] §7、§12、§13
- [[../docs/traces/discussion/2026-08-05-ordinary-hit-ability-issue-split|普通命中特性 issue 拆分讨论记录]] §8
- Held-item frozen-85 树果与 Utility Umbrella 先例
- 天气／场地初始化投射见 [[20260805_closed_ability-init-projection-to-weather-terrain-stage|Ability init projection to Weather Terrain Stage]]

## Out of scope

- 天气／场地 Track 的初始化投射
- 树果消耗、未暴露天气与 Weather Ball 天气属性／威力机制
- 重新实现 Sand Force／Solar Power；二者只作为既有 Weather consumer 参与组合，见 [[20260805_closed_offensive-and-defensive-ability-damage-modifiers|Offensive and defensive ability damage modifiers]]
- 新增领域术语或 ADR

## Acceptance criteria

- [x] Cloud Nine／Air Lock 覆盖全部已支持 raw Weather consumer，Weather Ball suppression 与 Weather provenance 符合冻结契约。
- [x] Mega Sol 的有效晴天替换、优先级、Electro Shot 例外、Weather Ball unavailable 与 activation 符合冻结契约。
- [x] Unnerve 覆盖全部 18 枚 resistance berries，方向、Chilan 例外、Berry provenance 与 Klutz 组合可测。
- [x] 多个独立充分抑制来源均为 `active`，不受 compiler 排列顺序影响。
- [x] 四个 Ability 去除红色 unsupported 提示；无绿点、开关或 partial-support 披露。
- [x] 逐条审计讨论记录中的每项决定均已实现并由代表性 active／inactive、双方 Ability 与组合测试覆盖。
- [x] 父 issue checklist 对应项可勾选。

## Resolution

已实现 Cloud Nine／Air Lock 对 raw Weather consumer 的压制、Mega Sol 的 effective sun 替换与 Electro Shot 例外，以及 attacker Unnerve 对全部 18 枚 frozen resistance Berry 的压制。Weather、Ability 与 Held item 来源状态按独立充分贡献记录，并覆盖 Utility Umbrella、Klutz、Weather Ball、Solar Power、Sand Force 与 Sand Veil 组合。

四个 Ability 已进入支持集，Track 不再显示红色 unsupported 提示，且未新增绿点或开关。验证：`pnpm test` (47 files / 501 tests)、`pnpm build`、`pnpm lint`。

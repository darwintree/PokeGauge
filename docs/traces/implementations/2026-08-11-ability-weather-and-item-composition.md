# Implementation Trace: Ability weather and item composition

Date: 2026-08-11
Source: `.issues/20260805_working_ability-weather-and-item-composition.md` + `docs/traces/discussion/2026-08-11-ability-weather-and-item-composition.md`
Language: 中文

## Entries

### 1. Electro Shot 例外的落地语义

Type: interpretation

Context:
冻结契约要求保留固定 Showdown 源码中的 Electro Shot 例外，但讨论记录没有展开该例外在 effective Weather 解析中的具体位置。

Decision:
按锁定 Pokémon Showdown commit `71d77d3d47fd4fdc2551b7b3cf9a0cc4fd3f38fa` 的 `sim/pokemon.ts` `effectiveWeather()` 顺序实现：Mega Sol 对 Move／Weather 消费者提供 sun，但 `moveId === 905` (Electro Shot) 保留 raw Weather；Utility Umbrella 的普通天气压制不能覆盖 Mega Sol 产生的 sun。

Reason:
这与冻结契约同时要求的 Electro Shot 例外、Mega Sol 优先级和 Utility Umbrella 边界一致，也避免把上游例外误解为本地未支持的充能回合机制。

Follow-up:
None.

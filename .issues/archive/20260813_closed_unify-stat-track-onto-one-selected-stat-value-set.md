---
# This section is managed by the CLI. Do not edit manually.
id: "c9d9b851-b974-4459-a722-c299e42e916b"
title: "Unify Stat Track onto one selected Stat Value set"
status: "closed"
priority: "high"
labels: ["FEATURE-REQUEST", "WAYFINDER:TASK", "READY-FOR-AGENT"]
created_at: "2026-08-13T13:55:00Z"
updated_at: "2026-08-13T14:14:00Z"
---
## Parent map

[[../20260812_open_evaluate-range-track-defaults-and-mode-switching|Evaluate Range Track defaults and mode switching]]

## Discussion Trace

[[../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching|Stat Range / Choice 切换交互讨论记录]]

ADR: [[../docs/adr/0003-stat-track-one-selected-value-set|Stat Track has one selected Stat Value set]]

## Problem Statement

Stat Track 现在仍是两套库：Choice 选中与 Range 区间各自保存，靠 `touched` 决定切模式时要不要和解。防守从 Range 回到 Choice 还会按 HP×Def 四个角写回。结果是：折叠 Track 上看到的区间、母行展开看到的 Choice、以及真正参与 Scenario 的值可以对不上。新对阵还默认 Choice，进攻默认 `32A`+`EX`、防守默认只有 `32H0B`，和已经定稿的「先看区间」心智不一致。

## Solution

一条 Stat Track 只保留一组选中 Stat Value。Choice 与 Range 是这组值的两种模式，不是两套库。Range 是选中集合的轴对齐包络；防守端点是两个完整 Defense Stat Value，不是四个角。新对阵默认 Range，选中系统端点加该 Identity 的用户 Stat Preset。切模式只改呈现和 Scenario 基数；母行展开只读同一组选中值。

## User Stories

1. As a player opening a new Matchup, I want both Stat Tracks to start in Range, so that I first see the damage envelope instead of discrete Choice rows.
2. As a player opening a new Matchup, I want Offense Stat Track to select `0A`, `EX`, and every user Offense Stat Preset for that Battle Pokémon Identity, so that the default envelope covers zero investment, extreme investment, and my saved builds.
3. As a player opening a new Matchup, I want Defense Stat Track to select `0H0B`, `32H0B`, and every user Defense Stat Preset for that Battle Pokémon Identity, so that the default envelope covers minimum bulk, 32 HP / 0 Def, and my saved builds.
4. As a player whose user Stat Preset sits outside those system endpoints, I want the Range envelope to expand to include it, so that my saved build is visible as an endpoint or interior point.
5. As a player whose user Stat Preset sits inside those system endpoints, I want it to remain selected as an interior point, so that expanding the parent row still shows that build.
6. As a player who saves or adds a user Stat Preset in this session, I want it to enter the selected set immediately, so that I do not have to re-select a value I just created.
7. As a player switching from Choice to Range, I want to keep the same selected Stat Values, so that the interval I see is the envelope of what I already picked.
8. As a player switching from Range to Choice, I want to keep the same selected Stat Values, so that Choice does not replace my set with only the envelope endpoints.
9. As a player switching mode, I want only that axis's global mode to change, so that the other Stat Track and every other Track stay as they are.
10. As a player in Choice, I want clicking a Stat Value to toggle only that value, so that I can add or remove discrete branches without touching Range storage.
11. As a player in Choice, I want deselecting the last remaining Stat Value to do nothing, so that a Stat Track can never have an empty selected set.
12. As a player deleting a user Stat Preset that is the only selected value, I want that delete to do nothing, so that the selected set cannot become empty.
13. As a player deleting a user Stat Preset when other values remain selected, I want it removed from the selected set, so that leftover values keep defining the envelope.
14. As a player in Range, I want the visible interval to be the axis-aligned envelope of the selected set, so that the slider and chips describe the same values Choice would show.
15. As a player looking at a Defense Range, I want exactly two endpoint chips — `(min HP, min Def)` and `(max HP, max Def)` — so that I am not shown a four-corner HP×Def grid.
16. As a player entering Range when a defense envelope endpoint is missing from the selected set, I want that endpoint selected if a matching Stat Preset exists, or created as a Temporary Stat Value otherwise, so that Range always has real endpoints.
17. As a player entering Range on offense, I want no extra Temporary Stat Value when min and max are already selected, so that offense endpoints are not duplicated.
18. As a player expanding a Range parent row, I want the child rows to be the current selected set including interior points, so that expand matches Choice of the same set.
19. As a player expanding a Range parent row, I want that expand to be read-only, so that opening children does not create Temporary Stat Values or change the selected set.
20. As a player expanding only the offense Range on a parent row, I want defense to stay a Range branch, so that children split only the axis I opened.
21. As a player expanding both axes on one parent row, I want children to be the cartesian product of both selected sets, so that I can inspect every stored combination under that parent.
22. As a player dragging a Range boundary outward, I want values that remain inside the envelope to stay selected, so that old endpoints become interior points instead of being replaced.
23. As a player dragging a Range boundary inward, I want Stat Values that fall outside the new envelope to be deselected, so that the selected set cannot disagree with the visible interval.
24. As a player whose deselected envelope-outlier was a Temporary Stat Value, I want that Temporary Stat Value deleted, so that cancelled drafts do not linger in the pool.
25. As a player whose deselected envelope-outlier was a system or user Stat Preset, I want that Preset to remain in the pool but unselected, so that I can pick it again later.
26. As a player with a single selected Stat Value in Range, I want one chip and two handles, so that I can grow an interval from a point.
27. As a player dragging either handle away from a single selected value, I want the original value kept and a Temporary Stat Value created at the new position, so that a one-point Range becomes a two-point envelope without losing the start.
28. As a player crossing the two Range handles, I want the handles to swap roles, so that min and max stay ordered without clearing the set.
29. As a player who needs a Stat Value that has no matching Stat Preset, I want a Temporary Stat Value created only then, so that drafts are not created speculatively.
30. As a player who deselects a Temporary Stat Value, I want it deleted, so that unsaved drafts disappear when I no longer need them.
31. As a player who saves a Temporary Stat Value as a user Stat Preset, I want it to stay selected and survive later deselect, so that saving promotes it from draft to reusable Preset.
32. As a player creating a Stat Value that already exists as a Stat Preset, I want the existing Preset selected instead of a second Temporary Stat Value, so that the selected set is deduplicated by Stat Value.
33. As a player changing either Battle Pokémon Identity, I want both Stat Tracks reset to the new-Matchup Range defaults for the new Identities, so that leftover values from the previous Pokémon do not linger.
34. As a player changing Identity, I want other Tracks to keep following the existing catalog-transition rules, so that this work does not rewrite move, item, ability, weather, or screen preservation.
35. As a player restoring a saved Matchup, I want the saved mode and selected set restored as-is, so that a refresh does not rewrite my work into the new-Matchup defaults.
36. As a player restoring a pre-unification snapshot that was in Choice, I want the saved Choice IDs and Temporary Stat Values to become the selected set, so that my discrete picks survive.
37. As a player restoring a pre-unification snapshot that was in Range, I want the selected set rebuilt from that Range's two endpoints plus any saved picks still inside the envelope, so that the interval I last saw is kept and interior picks are not discarded.
38. As a player in Range, I want the Scenario set to treat that axis as one branch, so that the result table shows envelope rows rather than one row per selected value.
39. As a player in Choice, I want the Scenario set to treat that axis as one branch per selected Stat Value, so that I can compare discrete builds.
40. As a player reading Range damage, I want the calculation endpoints to stay minimum-offense × maximum-defense and maximum-offense × minimum-defense, so that this ticket does not change Range endpoint identity or Scenario Merge.
41. As a player using the already-shipped collapsed well and parent-row chevron, I want those controls to drive the unified selected set, so that the visual work already archived keeps working against the new model.
42. As a reviewer, I want every decision in the discussion trace audited line by line, so that implementation cannot silently drop a grill choice.

## Implementation Decisions

- The scenario module remains the only seam. Stat Track mode, selection, envelope, Identity reset, parent-row expand, pipeline cardinality, and snapshot restore all go through `TrackState` transitions already owned by that module. The Scenario Explorer hook stays a thin wrapper.
- Each Stat Track keeps one selected set: the Choice IDs plus Temporary Stat Values for that axis. Choice and Range are a mode flag on the same set. Drop the independent touched flags. Any persisted Range interval is derived from the selected set's envelope and is not a second source of truth.
- Keep the existing persisted mode tokens (`preset` for Choice, `range` for Range). Do not rename them in this ticket; old snapshots already store those tokens.
- Selected members are Stat Values, orthogonal to Stat Preset identity, and deduplicated by Stat Value. A Temporary Stat Value is created only when a needed value has no matching Preset; deselect deletes it; saving it as a user Stat Preset keeps it selected and stops delete-on-deselect.
- Defense envelope endpoints are the two complete Defense Stat Values `(min HP, min Def)` and `(max HP, max Def)`. Remove four-corner Range→Choice writeback. Offense endpoints are min and max of the selected offense values.
- Entering Range, or dragging a Range boundary, writes missing envelope endpoints into the selected set (existing Preset if present, otherwise Temporary Stat Value). Parent-row expand is read-only and must not write the selected set.
- Dragging outward keeps in-envelope members selected. Dragging inward deselects members that fall outside. A one-member Range keeps that value and adds a Temporary Stat Value at the dragged position; crossed handles swap min/max roles.
- Choice toggle and user-Preset delete cannot leave zero selected members; the last remaining value is an empty operation.
- New Matchup and Identity reset use Range mode with offense `0A`+`EX`+all user offense Presets for that Identity, and defense `0H0B`+`32H0B`+all user defense Presets for that Identity. Catalog transitions that already rebuild Stat Tracks from defaults pick up these defaults. Other Track preservation rules stay as they are.
- Restore of a current-model snapshot uses the saved mode and selected set, never the new-Matchup defaults. Restore of a dual-store snapshot: Choice mode takes the saved Choice IDs and Temporary Stat Values; Range mode rebuilds the selected set from the saved interval's two endpoints plus any saved picks still inside that envelope.
- Pipeline cardinality stays mode-based: Range contributes one envelope branch per axis; Choice contributes one branch per selected Stat Value. Parent-row expand reuses the same selected set, not a dormant second store.
- Do not change calculation endpoint pairing or Scenario Merge. That boundary stays with the Range endpoint identity issue.

## Testing Decisions

- Test external `TrackState` behavior only: after a transition, assert mode, selected Stat Values, Temporary Stat Value lifetime, derived envelope, Scenario-set size, parent-row children, and snapshot round-trip. Do not assert hook internals, component markup, or how the envelope is cached.
- Stay on the confirmed seam: the scenario module's `TrackState` lifecycle. Defaults, mode switch, toggle, range drag, Identity transition, pipeline, parent-row expand, and persistence are all observed there.
- Prior art: existing scenario pipeline, catalog-transition, parent-row expand, and snapshot round-trip tests. Extend those suites. Replace the four-corner defense reconcile examples with two-endpoint envelope examples. Keep the calculation-endpoint pairing tests unchanged; they are the guard that this ticket does not drift into Range endpoint identity.
- A good test names a player-visible transition and the resulting selected set or Scenario cardinality. A bad test inspects touched flags, dual stores, or UI class names.

## Out of Scope

- Range endpoint identity, reachable endpoints, calculation identity, and Scenario Merge. See [[../20260717_open_define-range-endpoint-identity-and-merge-semantics|Define Range endpoint identity and merge semantics]].
- Visual work already shipped: Stat Value Label chips, parent-row chevron, collapsed well + tick.
- New Stat dimensions, or making nature / SP independent Tracks.
- Whether allocation internals should use native SP.
- Sidebar Scenario Brief expand interaction.

## Further Notes

- Discussion trace items 1–8 are already in product. This ticket must keep them true against the unified selected set, not redo the visuals.
- Trace items 9–21 are the value-model contract this ticket implements.
- System Stat Preset identities already in the catalog map to `0A` / `EX` / `0H0B` / `32H0B`; reuse them. Do not invent parallel default IDs.
- Dual-store Range snapshots that had a touched interval divergent from Choice will restore the interval they last showed, not the dormant Choice set.

## Resolution

已落地为一条选中集合 + 模式旗标。生命周期在 `src/lib/scenario/stat-selection.ts`；Explorer hook 只转调。`statRange` / `defenderRanges` 仍作为派生缓存留在 `TrackState`。存储版本仍为 4，用 touched 键识别双库旧档。实现决定见 [[../docs/traces/implementations/2026-08-13-unify-stat-track-selected-set|implementation trace]]。

Grill 9–21：单选中集合、按 Stat Value 去重、防守两完整端点、进入 Range / 拖边界才补端点、母行展开只读、拖出保留 / 拖入丢弃、Temporary 生命周期、禁止空集、单点两手柄、默认 Range 且 `0A`+`EX`+用户进攻 / `0H0B`+`32H0B`+用户防守、Identity 重置为该默认、恢复按保存集合（双库 Range 按当时区间重建）。1–8 视觉/展开交互未改契约。

全套 `pnpm test`：50 files / 549 tests 通过。

## Verification Checklist

- [x] 逐条核对 [[../docs/traces/discussion/2026-08-13-stat-range-choice-mode-switching|讨论记录]] 每一条决定已实现，或已明确推迟。
- [x] 去掉两套库、`touched` 保护、以及 Range → Choice 四角覆盖。
- [x] 新对阵默认 Range，选中集合符合 trace 第 17 条。
- [x] 与 Range endpoint identity／merge issue 的边界仍成立：本票不改计算端点语义。
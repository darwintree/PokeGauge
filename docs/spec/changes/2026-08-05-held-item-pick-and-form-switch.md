---
status: accepted
date: 2026-08-05
---

# Held Item Pick and Form Switch Spec Change

## Discussion Trace

- docs/traces/discussion/2026-08-05-held-item-track-usage-defaults-and-form-switch.md

## Target Specs

- docs/spec/held-item-pick.md

## Problem

Held item Track 尚无最终 pick 契约。现有讨论曾规定选择道具不得合成另一 Battle Pokémon Identity，且默认选择不基于使用率。产品已确认：使用率驱动候选池与默认多选（对齐 Move Pick 的池边界，默认规则不同），并允许映射表内形态道具经确认后切换 Identity。需要新增 Held Item Pick 最终 spec 承载这些契约。

## Contract Delta

### Added

- Champions 默认赛季道具使用率按 Battle Pokémon Identity 解析；Mega Identity 继承 base species 使用率。
- 排序后 top 10 使用率行构成初始高使用率边界；边界内无资格、不可映射或 `nothing` 的行跳过且不 backfill。
- 非形态触发且具备该侧资格的道具进入初始候选池；默认选中该集合中全部非形态触发道具。
- `none` 不进入使用率默认；使用率不可用或默认可选集为空时回退 `["none"]`，已锁定形态道具的 Identity 除外。
- 显式 item→Identity 映射定义形态触发道具。目标 Identity 可选且从当前 Identity 合法可达时：形态道具可进入未锁定 Identity 的候选池（不受 attacker/defender frozen 池限制），默认不选中；点击为确认导航，确认后执行与 Pokémon 重选相同的 Identity transition，不把该道具加入当前 Identity 的多选集合。
- 目标不可选或非法转换的形态道具不进池、不触发。
- 已锁定形态道具的 Identity 只暴露锁定项；离开形态仅通过 Pokémon Selector。
- Held item Track 展示同构 Move Track：折叠已选 chip，展开池内多选与添加入口；空选中强制 `["none"]`；保留既有部分支持警告。
- Picker 目录为该侧 frozen 资格池，外加当前 Identity 合法的形态触发道具；搜索 + 标签「专属」「威力」「能力」「树果」（多选 AND）+「当前持有者可用」（默认开）；无 `none`；普通道具选中即入池并选中；形态道具点击走确认切换。
- untouched 时异步使用率可初始化池与默认；用户编辑后不得覆盖；Identity 变更后重走默认；恢复已保存 Matchup 以保存为准。

### Changed

- 废止「选择 Held item 不得合成另一 Battle Pokémon Identity」作为绝对禁令：映射表内形态触发道具在确认后允许切换 Identity。
- 废止「Ogerpon Mask / Mega Stone 仅在已处于目标 Identity 时以 lock 出现、且选择道具绝不切换 Identity」中与上条冲突的部分：未锁定 Identity 可经映射表暴露形态道具并确认切换；目标 Identity 上仍锁定对应道具。

### Removed

None.

## Non-Goals

- 不规定 sprite 加载路径。
- 不改变 frozen-85 伤害效果编译、结果面板信息层级、或道具资格白名单本身（形态例外仅影响 Track/Picker 暴露与 Identity transition）。
- 不引入战斗中动态变身、道具消耗或历史回合态。
- 不把 Smogon chaos 订为道具使用率源。
- 不在本 change 重开 untouched / 默认重算策略的迭代（另立 issue）。

## Compatibility

Fail fast。旧讨论中「选道具不切换 Identity」与本 change 冲突的条款以本 change 与 `held-item-pick` 最终 spec 为准。已保存 Matchup 仍按保存状态恢复，不被使用率覆盖。

## Acceptance Criteria

- Top 10 边界、默认选中、`none` 回退、以及缺失使用率行为均可验收。
- 形态映射、合法转换、确认切换、锁定与 Selector 离开路径均可验收，且不出现道具与 Identity 矛盾的稳定态。
- Picker 四标签 AND、「当前持有者可用」、排序与选中入池行为均可验收。
- untouched / Identity 变更 / 恢复 Matchup 的默认写入规则均可验收。

## Resolution

Accepted. The final contract is reflected in `docs/spec/held-item-pick.md`.

# Ability 接触与道具组合讨论记录

对应 spec change: None.

## 1. 接触 SoT

问题：Fluffy／Long Reach 的接触判定是否与 Tough Claws 一样只认 PokeAPI `NormalizedMove.flags` 的 `contact`。

决定：是。缺失 flag（如 ordinary move id 827–919）按未接触处理，相关 facet `inactive`；本票不做本地补丁，缺口留给既有 upstream issue。

## 2. Fluffy 火＋接触数值与机制

问题：两 facet 同时成立时整数链、Activation，以及与 Showdown／`@smogon/calc` 的对齐方式。

决定：机制单算两 facet——有效接触时防守 `final` `2048`，已解析招式属性为火时再 `8192`；写入时用既有 `chainModifiers` 合成单一 Ability `finalModifier`（双命中净 `4096`）。任一 facet 成立则 Fluffy `active`（含双命中净 1×）。**数值默认与 `@smogon/calc` 对齐**（calc 对两 facet 各 `finalMods.push` 再 `chainMods`）。Showdown 钉 commit 在同回调内先合成 `mod` 再一次 `chainModify` 的编码差异记入 [[../../../.issues/20260807_open_audit-showdown-vs-smogon-calc-damage-rule-mismatches|Audit Showdown vs @smogon/calc damage-rule mismatches]]，不在本票改默认。

## 3. Long Reach 作用面

问题：Long Reach 是否编译期去掉全局有效接触并改写 Tough Claws 等钩子。

决定：只实现可到达交叉——进攻方 Long Reach 取消**防守方 Fluffy** 的接触 `2048` facet（对齐 calc 的 `!attacker.hasAbility('Long Reach')`）。不回写 Move Snapshot。招式本非接触 → Long Reach `inactive`。同侧不可能同时选 Long Reach 与 Tough Claws，故「Long Reach × Tough Claws」unreachable，本票不改 Tough Claws。Showdown 删除 `contact` flag 以致理论上影响一切接触钩子、与 calc 仅挡 Fluffy 接触半伤的差异记入审计 issue。

## 4. Klutz 基本范围与压制面

问题：Klutz 压制哪一侧、哪些 Held Item hooks。

决定：只压制**持有方自己**那一侧；覆盖该侧 `compileHeldItem` 的全部普通命中 hooks（`base-power`／`battle-stat`／`final-damage`／`accuracy`／`critical-stage`／`suppress-ordinary-weather-damage`），含树果减伤、形态锁面具 BP、万能伞压天气。不改 Held Item Track 选项本身。

## 5. Klutz Activation

问题：无增量或本就 neutral 的道具时如何标 Activation。

决定：仅当若无 Klutz 该侧至少有一个 hook 会 `active` 时 Klutz 为 `active`，被压制道具标 `inactive`。`none`／Mega（本就 `neutral`）或道具本就因 gate 未生效 → Klutz `inactive`。跨机制总契约见 [[../../../.issues/20260807_open_clarify-active-marking-for-ignore-guaranteed-track-conflicts|Clarify active marking for ignore/guaranteed Track conflicts]]；本票不阻塞于该 issue。

## 6. 错侧／未命中与 UI

问题：错侧选择、未命中 gate、绿点。

决定：进攻方 Fluffy、防守方 Long Reach 保持目录可见、去红点，恒 `inactive`。Fluffy 非火且无（经 Long Reach 后的）有效接触 → `inactive`。三者均无绿点；进入支持集后去掉红点。

## 7. Fluffy 火属性来源

问题：火 facet 用快照原始属性还是 Scenario 已解析属性。

决定：用本 Scenario 已解析招式属性（与其他 type gate 同一来源），以便与 Protean／属性改写票组合。

## 8. 词表

问题：是否把「Effective Contact」写入 `CONTEXT.md`。

决定：不新增词条（Avoid 已避开 Effective 歧义）；契约只留 issue + 本讨论记录。

## 9. Oracle 与默认对齐策略

问题：双 facet 是否仍用 `@smogon/calc` 作硬 oracle。

决定：支持范围内数值默认与 `@smogon/calc` 对齐（含火＋接触）。Showdown 与 calc 的不一致及是否波及其他路径，由独立审计 issue 处理；不在本票改「默认跟 Showdown」。

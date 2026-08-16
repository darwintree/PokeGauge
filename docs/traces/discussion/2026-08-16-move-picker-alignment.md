# 招式 picker 对齐 Pokémon picker 讨论记录

对应 spec change: None.

## 1. 对齐范围

问题：招式 picker 要对齐 Pokémon picker 的哪些部分。Pokémon picker 含搜索、同种形态 / Mega 开关、属性芯片、打开时使用率闸门、当前行高亮、精灵图行。

决定：对齐属性芯片、使用率闸门（挡住列表、可跳过）和列表 HUD。招式侧没有同种形态 / Mega；物攻 / 特攻仍在 Track 上，不进 picker。STAB / 克制占用 Pokémon 那两个开关的位置。

## 2. 筛选维度

问题：「招式 filter」滤的是 Move Template 属性、Scenario Move Type、held-item 式互斥分类，还是再加 STAB / 克制谓词。

决定：芯片滤 Move Template 属性。多选为 OR；空选 = 全部。不按 Scenario Move Type 滤。STAB / 克制不是独立谓词，只写属性芯片。

## 3. Picker Filter 寿命

问题：关掉 picker 后，搜索词与芯片是否保留；是否写入 Scenario Setup。宝可梦 picker 当时会记住筛选。

决定：这是 Picker Filter，不是 Track，不写入 Scenario Setup。招式与宝可梦 picker 关掉都清空。使用率排序缓存不清。

## 4. 宝可梦 picker 关闭时清空什么

问题：宝可梦 picker 除搜索与芯片外还有同种形态 / Mega 开关；形态角标会在打开前打开「同种形态优先」。

决定：清搜索词、属性芯片、两个开关。形态角标打开：先清再把「同种形态优先」设为开。招式侧对齐为清搜索词、属性芯片、STAB / 克制按下态。

## 5. STAB / 克制如何改芯片

问题：点快捷后芯片如何变；两个快捷能否同时按下；已按下再点、手改芯片时按钮如何。

决定：点下去则芯片变成该快捷的对应集合（替换，不是往上加）。STAB = 攻击方 Battle Pokémon Identity 的全部属性。克制 = 对当前防守方 `typeEffectiveness > 1` 的全部属性（与默认 Move pick 同一张表，不含招式级例外）。手改任意属性芯片则快捷弹起，芯片停在改完后的集合。目标集合不同时后点的会改芯片，因此前一个弹起。集合相同时两个都呈按下。已按下再点同一快捷、目标集合未变：空操作。按下态派生自芯片集合是否等于该快捷的目标集合。

## 6. 快捷目标集合为空

问题：克制集合为空时，点「克制」会不会把芯片写成空集（空芯片 = 不过滤 = 显示全部，并清掉已选芯片）。

决定：目标集合为空则空操作，不改芯片、不呈按下。

## 7. Z / 极巨化与 Move Kind

问题：是否用 Kind 筛选默认隐藏 Z-Move / Max Move，或把它们放进候选池。

决定：维持现状。Z-Move 与 Max Move 继续不进 Snapshot-capable 候选池。不做 Kind 筛选。

## 8. 使用率闸门

问题：`catalog.moves` 在默认加载完成后已把当前攻击方 usage 置顶。招式 picker 是否还要 Pokémon 那种打开闸门。

决定：闸门与 Pokémon picker 一致：usage 未就绪时挡住列表，可跳过。跳过 = 威力序，且只对这一次打开有效。默认序由 picker 自己拿威力序，不在 usage 到达后被父组件改写的 `catalog.moves` 冲掉。不展示使用率百分比。

## 9. 闸门文案

问题：招式闸门是否另写一套文案。

决定：与 Pokémon picker 共用现有 `matchup.ranking.*` 文案。

## 10. 列表行

问题：行上留什么、信息层级如何。用原型 A/B/C 对比。

决定：原型 A Trailing stats。左侧 TypeBadge，本地化名 + 英文 calc 名，右侧 `威力 / 命中`。Chrome 用 Pokémon picker 的 hover 与列表边框。无粘性表头。

## 11. 行副行

问题：A 的副行是英文 calc 名；Pokémon 行副行是本地化种名。招式没有种。

决定：保留英文 calc 名。

## 12. 已在 Move Track 的模板

问题：点一行是新建 Move Snapshot。是否在 picker 里标记或禁止已有模板。

决定：不标、不禁。重复添加就是再做一个 Snapshot。

# Implementation Trace: 招式 picker 对齐

Date: 2026-08-16
Source: docs/traces/discussion/2026-08-16-move-picker-alignment.md
Language: zh-Hans

## Entries

### 1. 招式闸门排全部 usage，不截 top 10

Type: decision

Context:
`resolveDefaultMovePick` 只取当前侧前 10 条 usage 做默认池。Picker 要浏览整个 Snapshot-capable 候选池。

Decision:
新增 `rankMoveOptionsByChampionsUsage`：按 Champions 记录排序后，把池里出现过的 usage 全部置顶，其余保持传入顺序。不 slice(0, 10)，不展示百分比。

Reason:
默认 pick 的 10 条是 Track 初始 Snapshot 的来源，不是浏览闸门。截断会让第 11 条 usage 掉进默认序，和 Pokémon picker「整表按 usage 排」不一致。

Follow-up:
None.

### 2. 跳过与失败时用威力序，usage 结果接到威力序后面

Type: decision

Context:
Grill 要求默认序由 picker 自己拿威力序，且不被之后改写的 `catalog.moves` 冲掉。父组件在默认 pick 完成后会把 usage 前缀写进 `catalog.moves`。

Decision:
Picker 始终 `toSorted` 威力降序、id 升序。跳过 / 失败显示该序。usage 就绪后用 `orderOptionsByIds(powerOrdered, rankedIds)`，尾巴仍是威力序。

Reason:
父级 `catalog.moves` 只当候选集合，不当显示顺序。跳过后再收到 usage 或 catalog 重排，列表仍停在威力序。

Follow-up:
None.

### 3. 排序缓存按攻击方与招式侧失效，不按 options 引用

Type: decision

Context:
`catalog.moves` 在 usage 到达时换新数组。若按 options 引用重置闸门，打开中的 picker 会被再次挡住，跳过也会被冲掉。

Decision:
仅 `attackerId` 或 `moveCategory` 变化时清空 ranked ids 并重新进闸门。options 引用变化不重置 `ranking-load`。

Reason:
招式 usage 按攻击方 Identity；候选池随物攻 / 特攻侧切换。locale 换标签但 id 不变，沿用缓存。

Follow-up:
None.

### 4. 关闭时清 Picker Filter，父组件关 dialog 也算关闭

Type: interpretation

Context:
MoveTrack 选中一行会 `setOpen(false)`，不一定走 Dialog 的 `onOpenChange`。只在 `onOpenChange(false)` 里清筛选会把搜索词和芯片留到下次打开。

Decision:
`open` 变为 false 时清搜索词与属性芯片。宝可梦侧在 `changeOpen(false)` 里清搜索、芯片、两个开关；形态角标先清再开「同种形态优先」。

Reason:
Picker Filter 寿命是「关掉即丢弃」，与谁把 open 设为 false 无关。使用率排序缓存仍走既有 `ranking-load` close，不清。

Follow-up:
None.

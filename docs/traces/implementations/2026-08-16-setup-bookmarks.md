# Implementation Trace: Setup Bookmarks

Date: 2026-08-16
Source: grill-with-docs session (Setup Bookmark contract; ADR 0005)
Language: 中文

## Entries

### 1. 列表上的可加载判定分层

Type: decision

Context:
失效书签必须显示「失效」且不可点开。完整领域校验（招式/道具/能力值边界）需要加载该 Matchup 的 catalog。打开列表时对最多 50 条各拉一份 catalog 太重。

Decision:
列表只做 token 解码 + 攻击方/防守方身份是否仍在当前可选列表。点开时再 `getCatalogShell` + `trackStateFromScenarioSetup`；失败则不应用工作区，该条在本次列表中改为失效。

Reason:
与分享恢复同一条失败语义，但不在打开对话框时做 50 次 catalog 读取。身份已消失的书签在列表上就能标失效。

Follow-up:
None.

### 2. 载入后用 remount 替换工作区

Type: decision

Context:
`useScenarioState` 只在初次 mount 吃 `restoredTrackState`。之后改 Matchup 会走 catalog transition，把书签 Setup 冲掉。

Decision:
每次成功载入书签就递增 `workspaceEpoch` 作为 `ScenarioWorkspace` 的 `key`，带上新的 `restoredTrackState` remount；同时清掉 `?s=` 与分享导入 token，让刷新 Snapshot 立刻启用。

Reason:
复用现有「恢复进入」路径，不给 `useScenarioState` 再开一套运行中注入。

Follow-up:
None.

### 3. 领域失效在对话框关闭后仍保持不可点

Type: decision

Context:
点开后领域校验失败的条目若在关闭对话框时清空 `blockedIds`，会再次显示为可点。

Decision:
`blockedIds` 留在控件实例上，不随对话框开关清空。成功载入会 remount 工作区，集合自然丢掉。

Reason:
不把失效标记写入 localStorage，也不在打开列表时做 50 次 catalog 读取。

Follow-up:
None.

### 4. 列表做成 roster，分页代替长滚动

Type: decision

Context:
原型 A（对战精灵图 + 类型/招式辅数据）被选为方向。50 条上限下长列表完成度不够，用户点名缺分页。

Decision:
每页 6 条（一屏 roster，不再套一层滚动）。页脚只在多于一页时出现，格式为上一页 / `n / m` / 下一页。招式名和类型用已解码 token + `getMoveById` / 当前可选宝可梦列表，仍然不在打开列表时拉 catalog。

Reason:
6 条填满弹窗高度；分页是用户点名的缺口。资源表查找是同步的，不破坏「列表不做 50 次 catalog」的分层。

Follow-up:
6 条加招式换行会超出弹窗 `max-h`，列表 `overflow-hidden` 把末行切在分页条上。见条目 5。

### 5. 分页条被圆角裁切，每页改为 4 条

Type: conflict

Context:
用户截图圈出「下一页」：6 条 roster 加招式换行后，弹窗 `overflow-hidden` 把最后一行切在分页条上，按钮贴着 `rounded-xl`。

Decision:
`SETUP_BOOKMARK_PAGE_SIZE` 改为 4；招式 chips `flex-nowrap` + overflow clip 锁行高。列表 `flex-1 min-h-0 overflow-y-auto` 只作小屏兜底。页脚改用 `DialogFooter`（`p-4`、`shrink-0`），按钮离开圆角。

Reason:
分页仍是主模型；4 条能完整露在分页条上方。DialogFooter 的内边距就是为了底部圆角预留的。

Follow-up:
None.

### 6. 列表隐藏招式行

Type: interpretation

Context:
用户要求隐藏招式行。该行同时含进攻方类型、物特分类、招式 chips。

Decision:
整行去掉（含类型和分类），只留精灵图、标题、时间。顺手删掉 `getMoveById` / `TypeBadge` 等只为该行存在的查找。行高变矮后改 `items-center`。每页仍 4 条。

Reason:
那是同一行 markup；单独留类型/分类会变成半截 roster。分页尺寸不随这次改，除非再出现裁切。

Follow-up:
单页条数改为按弹窗列表高度计算。见条目 7。

### 7. 单页条数随弹窗高度变化

Type: decision

Context:
用户要求单页数量和页面高度相关。固定 4/6 条会在矮窗裁切、高窗留白。分页条出现与否会改变列表高度，量 `ul` 当前高度会抖。

Decision:
弹窗仍是 `max-h-[min(36rem,calc(100svh-2rem))]`，不拉满高度。`pageSize = floor((弹窗最大内高 - 页眉 - 分页条) / 行高)`。打开时先 `pageSize=1` 让分页条进 DOM 以便量真实高度，layout 完成后再放大；一页能放下则隐藏分页条。窗口 `resize` / `visualViewport` 会重算。

Reason:
量当前 `ul` 高度会在分页条显隐之间抖动，也会把内容高度误当成可用高度。按 CSS 最大高度预留分页条，条少时弹窗仍随内容变矮。

Follow-up:
打开时先把 pageSize 设成 1，而弹窗在 portal 里后一拍才挂上，effect 提前 return 后不再跑，单页锁死 1 条。见条目 8。

### 8. 单页锁死 1 条：portal 挂载后再量

Type: conflict

Context:
常见桌面视口下实测 11 条书签只显示 1 条、分页 `1 / 11`。同一帧用 CSS `max-height` 公式能算出 5 条，说明计算本身没问题，是没在弹窗挂上之后再跑。

Decision:
打开不再把 pageSize 打回 1；先用视口估算。弹窗 `ref` + `requestAnimationFrame` 在 portal 挂上后按 `max-height - 边框 - 页眉 - 分页条` 再量。行高收到 `py-1`，36rem 桌面大约 7 条。

Reason:
Base UI Dialog 的 popup 不一定和 `open=true` 同一 commit 进 DOM。先 1 再量，量不到就永远 1。

Follow-up:
None.

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

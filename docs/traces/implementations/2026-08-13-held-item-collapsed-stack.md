# Implementation Trace: Held Item collapsed two-row summary

Date: 2026-08-13
Source: 用户请求（攻击方与防御方道具应为双行）；`docs/spec/held-item-pick.md` Track presentation
Language: 中文

## Entries

### 1. 折叠摘要复用 TrackPanel stack，不复制 Move Track 头

Type: decision

Context:
Spec 要求 Held item Track 同构 Move Track：折叠已选、展开池。Move Track 自写两行头；Stat Track 已把同样分层收进 `TrackPanel` 的 `summaryLayout="stack"`。此前折叠道具图标挤在标题行右侧。

Decision:
`HeldItemTrack` 设 `summaryLayout="stack"`。折叠时标题行只放轴名，已选精灵图在 `border-t` 第二行并 `flex-wrap`；展开后第二行收起，编辑区接手。不把道具 Track 改成全宽拆对。

Reason:
与今天 Stat Track 的折叠分层同一条路径，改动最小。并排双列仍与能力、能力阶级一致；用户说的是每个道具 Track 自己从单行变成双行。

Follow-up:
None.

### 2. 无道具用回 CircleSlash，不跟缺图占位混用

Type: decision

Context:
精灵图热链把「无 URL / 加载失败」收成同一个 Lucide `Gem` 占位，`none` 没有 sprite 路径，折叠摘要里看起来像宝石。更早的 Track 对 `none` 用的是 `CircleSlash`（`text-hud-muted/60`）。

Decision:
`HeldItemSpriteIcon` 对 `none` 画 `CircleSlash`；缺路径或加载失败（含 unknown Mega Stone）仍用 `Gem`。

Reason:
无道具是应用哨兵，不是丢了图的道具。CircleSlash 是用户记得的旧图标，也跟 6 月 grill 一致。

Follow-up:
None.

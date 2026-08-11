# Ability Stage 与 Screen 绕过讨论记录

对应 spec change: None.

## 1. Unaware 忽略哪一侧 Stage

问题：进攻方／防守方 Unaware 分别忽略哪一侧 Stage Track。

决定：进攻方 Unaware 忽略防守方 Stage（编译时当 0）；防守方 Unaware 忽略进攻方 Stage。不修改 Stage Track 选项本身。两侧同时选 Unaware 时各自忽略对方，可叠加为两侧 Stage 皆按 0 结算。

## 2. Unaware 与会心 Stage clamp

问题：Unaware 与既有会心部分忽略（攻方 `max(stage,0)`、防方 `min(stage,0)`）如何组合。

决定：被 Unaware 盯上的那一侧 Stage 在普通与会心分支都当 0；会心 clamp 只作用于未被 Unaware 忽略的一侧。

## 3. Infiltrator 绕过范围

问题：Infiltrator 是否包含极光幕，以及与现有 Screen Track 的关系。

决定：只绕过 Track 已有的 Reflect／Light Screen；不把极光幕加入 Screen Track。破墙招／错类别／会心-only 已让墙 `inactive` 时，Infiltrator 无增量，为 `inactive`。

## 4. 绕过类 provenance（贡献判定）

问题：被绕过的 Stage／Screen 与 Unaware／Infiltrator 如何标 `active`／`inactive`。

决定：按贡献判定——Ability 改变了最终采用的 Stage／Screen 修正时 Ability 为 `active`，被抹掉的 Stage／Screen 为 `inactive`；无增量时 Ability 为 `inactive`。对齐防暴吞会心来源、万能伞压天气、`+3` 吞 Stage／墙的现有模式。跨机制总契约另见 [[../../../.issues/20260807_open_clarify-active-marking-for-ignore-guaranteed-track-conflicts|Clarify active marking for ignore/guaranteed Track conflicts]]；本票不阻塞于该总契约 issue。

## 5. Scenario Merge

问题：绕过之后是否与 Stage `0`／Screen `none` 合并。

决定：对齐现有合并——Unaware 置 0 后与同侧 `0` 合并并保留被绕过 Stage 的 `inactive` provenance；Infiltrator 抹墙后与 `none` 合并并保留墙的 `inactive` provenance。不禁止合并，不丢掉被绕过来源。

## 6. Infiltrator 侧别

问题：防守方 Ability Track 上的 Infiltrator 是否也绕过墙。

决定：仅进攻方 Infiltrator 有机械钩子；防守方 Infiltrator 恒为 `inactive`。不从防守方目录移除该特性。

## 7. 结果主行展示

问题：被绕过的 Stage／墙是否仍出现在结果主行。

决定：与 `+3`／破墙一致——被绕过的 Stage／Screen 不进主行，只进折叠「未生效」；Ability 按既有 active 来源展示。

## 8. 本票 UI 范围

问题：是否为绕过增加绿点、专用 badge 或 Track 静态说明点。

决定：只将 Unaware／Infiltrator 从 `unsupported` 转入可审计的 `active`／`inactive` 并移除红点；不新增绿点或专用绕过 UI；语义由 Activation 与未生效来源表达。

# 携带道具资源身份与候选资格讨论记录

对应 spec change: None.

## 1. 真实道具身份

问题：真实携带道具使用哪个稳定身份，Showdown slug 是否参与持久化。

决定：真实携带道具以 PokeAPI numeric id 为唯一持久化身份；Showdown slug 仅用于机制映射。Leek 对应 PokeAPI id 236（上游 slug `stick`）。

## 2. 显式无道具身份

问题：如何表示刻意不携带道具。

决定：使用应用哨兵 `none`，不把它伪装成 PokeAPI item。

## 3. 本地化名称

问题：携带道具名称的来源以及目标 locale 缺失时的处理。

决定：优先使用 PokeAPI 对应 locale 的名称；缺失时回退英文并记录资源诊断，不维护手写翻译表。

## 4. 效果白名单范围

问题：同一神兽的 Orb 与 Crystal／Globe／Core 在当前支持范围内是否都要纳入。

决定：移除 Adamant Crystal、Lustrous Globe、Griseous Core，保留对应 Orb；本轮效果白名单由 88 项缩为 85 项。

## 5. M-B 与规则外道具

问题：白名单内的 M-B proxy 项与已批准规则外项是否采用不同候选资格。

决定：85 项白名单内统一处理，不因 M-B 分类隐藏、禁用、排序或设置默认；白名单外不新增效果、兼容或警告语义。

## 6. 攻守双方候选范围

问题：攻击方与防守方是否都展示全部效果白名单。

决定：按支持效果方向静态分池；不因当前招式、属性或宝可梦未满足 activation 条件而动态隐藏候选项。

## 7. PokeAPI sprite 覆盖

问题：携带道具 sprite 是否可以统一迁移到 PokeAPI。

决定：85 项全部使用 PokeAPI sprites；同时解析扁平默认路径以及 `gen8/`、`gen9/` 世代路径，不需要其他图片来源 fallback。

## 8. Sprite 交付

问题：运行时 hotlink PokeAPI `master` 还是固定资源版本。

决定：从 PokeAPI sprites 的固定 commit 获取 85 张 PNG，并 vendoring 到应用本地，不运行时 hotlink。

## 9. 现有 Mega Stone 行为

问题：85 项效果白名单是否取代现有 Mega Stone／Unknown Mega Stone 候选与锁定行为。

决定：现有 Mega Stone／Unknown Mega Stone 锁定行为保持不变，不属于效果白名单，也不计入 85 项。

## 10. `none` 的可用性

问题：`none` 在普通与 Mega 锁定的 Held item Track 中如何出现。

决定：未锁定的双方 Track 始终提供 `none`；它可与真实道具同时选中以比较 Scenario，取消最后一项时自动回到 `none`。Mega 锁定时仅允许对应 Mega Stone／Unknown Mega Stone，不提供 `none`。

## 11. 非法与旧状态恢复

问题：如何处理旧 synthetic item id、白名单外 id、错误攻守侧 id 和旧添加记录。

决定：不迁移非法或旧 item id；包含这些 id 的已保存 Scenario 整体放弃恢复并返回 matchup 首页，旧添加记录中的未知项直接过滤。现有合法 Mega Stone 锁定状态不受影响。

## 12. 默认选择与排序

问题：本 ticket 是否决定携带道具的默认选择和排序。

决定：默认选择与排序不属于本 ticket。

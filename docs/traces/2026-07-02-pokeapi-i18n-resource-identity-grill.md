# PokeAPI i18n 资源标识讨论记录

对应 issue: [[20260702_open_introduce-pokeapi-backed-i18n-resource-identity-and-locale-data-access|Introduce PokeAPI-backed i18n resource identity and locale data access]]

## 1. 宝可梦战斗标识应落在哪一层

问题：项目需要一个能唯一确定宝可梦种族值与属性的标识；需要在 species 与具体可参战形态之间选择。

决定：使用可区分具体可参战形态的 **Battle Pokemon identity**，不能只停留在 species。

## 2. 上游资源标识的主键形式

问题：项目内部应以本地化名称、slug 还是上游资源 id 作为稳定标识。

决定：统一使用 PokeAPI 对应资源的 **numeric id** 作为 **Upstream resource identity**。

## 3. 是否保留 slug 作为持久化主键

问题：在 numeric id 之外，是否还要把上游 slug 作为并行主键持久化。

决定：不保留 slug 作为持久化主键；项目内部 identity 只使用 numeric id。

## 4. 宝可梦与招式名称的 i18n 来源

问题：Pokemon 与 move 的显示名称应来自本地别名层，还是直接来自对应上游资源的本地化字段。

决定：Pokemon 与 move 的显示名称均直接来自对应上游资源的本地化字段，不增加本地别名层。

## 5. 运行时名称组装方式

问题：是否在生成阶段预计算最终显示名，或在运行时自行设计缺失回退与拼接规则。

决定：运行时取用目标资源上已有的本地化显示名；当前不设计缺失回退。

## 6. 首版支持语言集合

问题：首版产品需要支持哪些显示语言。

决定：支持 **zh-hans、zh-hant、en、ja**。

## 7. UI 文案与资源名称的分层

问题：所有字符串是否都走同一套消息系统，还是区分 UI 文案与资源名称。

决定：UI 文案使用 `react-intl`；Pokemon 与 move 名称保留在数据层，但共享同一个当前 locale 状态。

## 8. locale 真源与初始化

问题：是否维护独立 locale store，以及首版 locale 从哪里初始化。

决定：仅保留一个 locale 真源；首次按浏览器语言匹配支持集合，之后以用户手动选择并持久化的 locale 为准。

## 9. 属性名称的维护边界

问题：18 属性名称是否也纳入 PokeAPI 资源名称策略。

决定：属性名称与其他 UI 字符串使用同一套项目内维护方案，不走 PokeAPI 资源名称策略。

## 10. 数据接入契约

问题：当前阶段应先解决真实缓存/来源，还是先钉住前端取数契约。

决定：当前只定义取数契约，不预设缓存或真实来源；允许先用 mock 实现。

## 11. 资源访问接口形状

问题：前端应使用分散的资源接口还是统一入口，以及接口应同步还是异步。

决定：提供统一的异步资源接口；内部按 `resourceType` 路由。

## 12. 资源接口的查询能力与返回形状

问题：首版接口是否需要列表/搜索能力，以及组件拿到完整 names map 还是当前 locale 的单个字符串。

决定：首版仅支持按 numeric id 读取单个资源；调用侧只拿到当前 locale 下的单个字符串，返回值仍按 `resourceType` 收窄为强类型。

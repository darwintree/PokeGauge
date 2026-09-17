# Implementation Trace: 使用率规则列表与选择器

Date: 2026-09-17
Source: 用户确认三个源的启发式编译策略，并选择 C 原型
Language: zh-hans

原型裁决：采用 C，摘要按钮打开来源与规则面板。完整原型保存于 `codex/prototype-usage-rules`（3d5a571607028ac81a48ccfd41c858150a26dbf2）。

## Entries

### 1. 规则列表按来源请求

Type: unresolved-implementation-decision

Context: 新 API 的粒度以及离线开发行为未指定。

Decision: GET `/api/usage/rules/:source` 优先读取该部署的 manifest，返回原名、短显示名和实际 compiled 状态；无 manifest 时发现上游规则并标为未编译。前端显示已编译规则及当前选择，其他规则可展开。接口失败可重试，其他来源可继续选择。

Reason: 一处上游不可用不会阻塞其他来源，不把“计划编译”误称为已编译。保留已记住的来源与规则，展开状态仅属于当前面板。设置页复用同一选择器，避免两套不同筛选逻辑。

Follow-up: None.

### 2. 编译与在线路径一致

Type: interpretation

Context: 原读取路径只有 Champions 消费产物，manifest 缓存也只有一个槽位。

Decision: 三个源都优先消费同一规则的排行与细节产物；manifest 按来源缓存，校验响应身份。Smogon 名称中的月份作为产物目录层级。

Reason: 避免规则面板与实际数据来源不一致；保持在线回退。默认编译 Champions 3 条、Smogon 最多 4 条、Pikalytics 最多 4 条；上游类别不足时不捏造规则。

Follow-up: None.

### 3. Smogon 性格投影和 Pikalytics 限流

Type: tradeoff

Context: 原始 Smogon Spreads 包含大量同一性格的分配方案；实测直接投影约 8 MB。Pikalytics 在 16 并发时返回 429。

Decision: 性格保留每种性格中占比最高的分配，在线与编译共用该投影，不相加成新的性格占比；现有默认能力预设和招式类别推断保持一致。其余类别完整保留，不使用 Champions 专用的 64 行截断。Pikalytics 最多 2 并发，429/5xx 最多重试 3 次并遵守 Retry-After。Smogon 下载官方 gzip 文件。

Reason: 去除对现有推荐无影响的重复性格行，同时避免构建向上游过量请求；失败时仍中止构建，不发布缺失细节的 manifest。

Follow-up: None.

### 4. 确认无统计与请求失败分开

Type: interpretation

Context: Pikalytics 当前赛制里 Arbok、Castform 等详情接口成功返回带 name 的对象，但 moves/items/abilities/natures 均为空数组。

Decision: 验证详情响应结构后保留空记录，表示已确认没有统计；请求失败和缺失详情响应仍使编译失败。客户端将空记录视为已完成读取，不重复回源。

Reason: 上游明确的无数据状态不能被误当成漏抓取，也不能让选中这些宝可梦的用户一直等待。

Follow-up: None.

### 5. Mega 本体记录缺失时保留形态统计

Type: unresolved-implementation-decision

Context: 用户要求 Mega 使用本体的使用率，但随后在 Smogon M-B BO3 1760 中发现超级喷火龙 Y 仍无招式。实际编译数据只有 10035 的统计，没有本体 6 的记录；该缺失情形未在上一要求中规定。

Decision: 保留本体优先；仅在本体记录不存在时，读取所选 Mega 形态的独立记录。编译和在线路径采用相同顺序，已存在的空记录不触发回退。Pikalytics 详情缓存按最终匹配的身份存储，避免没有本体时 X/Y 形态共享错误数据。

Reason: 同时满足本体优先的既定要求和上游分开统计 Mega 形态的情况，不跨来源、不借用其他 Mega 形态。

Follow-up: None.

### 6. 设置页直接展示使用率控件

Type: unresolved-implementation-decision

Context: 用户指出设置页复用紧凑摘要弹层显得压缩，要求适合设置页的样式；具体布局未指定。

Decision: 设置页采用纵向分区：三列来源按钮、完整名称的规则列表、更新状态。规则仍默认显示已编译及当前所选项，可展开更多；设置页整体滚动。宝可梦选择器保留原弹层。两个呈现方式共享选择、加载、重试和刷新逻辑。

Reason: 使用设置对话框的可用宽度，减少嵌套弹层与不必要的缩写，不引入两套数据状态。

Follow-up: None.

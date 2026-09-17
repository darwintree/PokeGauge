# Implementation Trace: 使用率统一 API 与按需详情

Date: 2026-09-17
Source: 用户确认三个统一 API 与混合编译方案
Language: zh-hans

## Entries

### 1. 排行快照与空统计的区别

Type: unresolved-implementation-decision

Context:
确认的方案区分排行编译与完整编译，但没有指定内部快照如何表示只有排行。

Decision:
将内部 `pokemon` 字段设为可选。缺省表示按需获取详情；存在时作为完整快照读取，其中 `{}` 表示有效空统计。API 不暴露存储方式。

Reason:
只改现有快照的一处字段即可避免把未抓取的详情误判为零统计，无需增加并行文件格式。

Follow-up:
None.

### 2. 冷启动与旧客户端

Type: unresolved-implementation-decision

Context:
首屏详情可能早于规则目录完成；既有代理路由已存在于主分支，统一 API 尚未发布。

Decision:
统一接口允许省略规则及 Pikalytics 月份，由目录解析默认值；正常选择后请求携带完整参数。保留旧代理路由供已部署客户端使用，删除当前 PR 内尚未发布的前端静态产物读取层。

Reason:
维持首屏加载与已发布客户端行为，同时使新客户端只消费三个统一接口。

Follow-up:
None.

### 3. 详情元数据与持久化缓存

Type: unresolved-implementation-decision

Context:
已确认的精简响应不包含原始上游来源路径和版本；现有内部记录还带有这些字段。持久化排行原先仅按来源与规则区分。

Decision:
内部记录来源使用实际 API 请求地址，season 使用所选规则，dataVersion 使用请求月份（无月份时使用规则），供现有消费者继续读取。Pikalytics 持久化缓存增加月份维度；异步结果捕获请求上下文，不向后续选择写入。

Reason:
保留现有记录接口而不扩大公开 API；月份是 Pikalytics 数据身份的一部分，必须隔离缓存。

Follow-up:
None.

### 4. 非推荐历史赛季的首次排行

Type: tradeoff

Context:
Champions 索引不含历史赛季的排名，展开列表仍允许选择未编译历史赛季。

Decision:
保留按单只详情汇总历史排行的行为，将其移到 Worker 并限制并发为 8，缓存成功读取的上游数据与汇总结果；推荐历史赛季使用构建快照。

Reason:
上游缺少已验证的历史排行批量端点。此处不新增存储或后台作业，保留可用范围；首次请求可能较慢，前端超时后仍可重试。

Follow-up:
若未编译历史排行成为常用路径，再单独解决批量数据源或后台快照生成。

### 5. Champions 单只请求跳过完整索引

Type: unresolved-implementation-decision

Context:
真实联调中索引下载触发 Worker 的 15 秒上游超时；Champions 文档说明详情支持直接使用 Showdown ID，并已用 Charizard、Basculegion 真实响应验证。

Decision:
Worker 单只详情直接使用本地生成资源的 Showdown 身份；索引仅用于排行。前端请求上限设为 45 秒，覆盖冷启动目录、排行和详情的有界上游读取。

Reason:
消除与单只详情无关的大文件依赖，避免把它的失败传播到详情；各上游请求仍有 15 秒超时。

Follow-up:
None.

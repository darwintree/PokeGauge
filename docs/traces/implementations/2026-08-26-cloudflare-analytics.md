# Implementation Trace: Cloudflare Analytics Engine 监控

Date: 2026-08-26
Source: 用户请求“使用 CF Workers 部署并用 Analytics Engine 做监控”
Language: zh-hans

## Entries

### 1. 最小产品事件与数据边界

Type: unresolved-implementation-decision

Context:
请求没有指定监控事件、数据结构或隐私边界；前文目标是建立快速反馈和分享循环。

Decision:
只记录 `page_view`、`scenario_ready`、`share`和 `feedback` 四个匿名事件，以及语言、国家/地区、来源域名和 Worker 主机名。不记录 IP、用户标识、分享 token、对阵参数或自由文本。

Reason:
这组事件能直接回答“访问是否到达结果，是否分享或反馈”，同时避免为早期监控引入账号或跨会话追踪。

Follow-up:
只在真实使用数据显示需要漏斗分析时，再评估匿名会话标识。

### 2. 静态资源优先

Type: tradeoff

Context:
Worker 可以在每个资源请求前执行并写入浏览数，但会让所有静态资源经过 Worker 脚本。

Decision:
只让 `/api/events` 路由先进入 Worker，其余静态资源由 Workers Static Assets 直接提供；页面访问由前端发送同源事件。

Reason:
保留 CDN 静态资源快速路径，同时只增加一个窄小的可验证写入边界。

Follow-up:
None.

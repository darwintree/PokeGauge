# 使用率 API

三个接口均为 `GET`，`source` 为 `champions`、`smogon` 或 `pikalytics`。

| 接口 | 响应 | 用途 |
| --- | --- | --- |
| `/api/usage/rules/:source` | `{ defaultId, rules: [{ id, label, displayName, recommended }], date? }` | 完整规则目录；默认展示推荐规则与已选规则，其余可展开 |
| `/api/usage/ranking/:source?rule=…&date=…` | `{ pokemonIds: number[] }` | 按使用率排序的本地对战身份 ID |
| `/api/usage/pokemon/:source/:pokemonId?rule=…&date=…` | `{ m?, i?, a?, n? }` | 单只宝可梦的招式、道具、特性、性格统计 |

详情字段都是 `[英文名称, 百分比或 null][]`，按上游排名排列；前端通过本地资源解析名称。空统计返回 `{}`，上游失败返回 `502`，输入无效返回 `400`，非 GET 返回 `405`。Mega 优先使用本体记录，仅在本体记录缺失时查询所选形态；本体的空统计也是有效记录。

请求应带所选 `rule`，通过 URLSearchParams 编码（Smogon 规则含 `/`）。Pikalytics 同时携带目录返回的 `date`，以固定数据月份。冷启动尚未取得目录时可省略参数，由服务端解析默认规则及月份。

## 数据来源与缓存

- Champions Current：构建时从索引生成排行，详情按需读取。
- Champions 推荐历史赛季：保留完整编译快照。其他历史赛季首次请求排行仍需批量读取单只统计，因此可能较慢；成功后缓存。
- Pikalytics：构建时每条推荐规则读取一次排行，详情按需读取。
- Smogon：推荐规则保留完整编译快照；其他规则在服务端读取并缓存整份上游统计，响应仅包含所请求的排行或单只详情。

编译产物只供服务端读取。`pokemon` 缺省表示只有排行；存在时表示完整详情快照。推荐范围由目录启发式规则决定，与详情是否已编译无关。

浏览器按来源、规则、月份、宝可梦缓存并共享单只请求；拒绝的请求会被移除，供重试。Pikalytics 持久化排行缓存也包含月份。Worker 使用一小时边缘缓存，键包含规则和月份，上游数据通过校验后才缓存。静态快照直接读取当前部署资源。边缘缓存仅在当前数据中心生效，未引入数据库或后台预热。

既有 `/api/smogon/*`、`/api/pikalytics/*` 代理路由继续支持已部署的旧客户端。

# Pikalytics 使用率数据：授权声明与接入可行性

核查日期：2026-09-11。范围：第一方页面、页面实际加载的脚本、两个公开 GET 接口、站方链接的 GitHub 项目。仅做研究，未改动应用，也未联系站方。

## 结论

技术上已经验证存在可匿名读取、返回 JSON 并开放 CORS 的使用率接口；**本次没有找到涵盖 Pikalytics 使用率数据的明确复用许可证或公开 API 使用政策**。这表示授权证据尚不足，不能据此断言禁止复用，也不能把公开访问或 CORS 当作复制、缓存、再发布的许可。建议将“技术可接入”和“数据授权待确认”分别记录；授权问题可向站方公开联系邮箱 `pikalytics@gmail.com` 询问。[公开页面](https://www.pikalytics.com/pokedex)、[隐私政策及联系信息](https://pages.flycricket.io/pikalytics/privacy.html)

## 许可与声明：已验证的证据

| 位置 | 原文短摘录 / 观察 | 能证明的范围 |
| --- | --- | --- |
| Pokedex 页脚 | “Pokemon and All Respective Names are Trademark & © of Nintendo 1996-2026” | 宝可梦名称和商标归属声明，未给出使用率数据复用许可。[页面](https://www.pikalytics.com/pokedex) |
| 页脚链接的隐私政策开头 | “collection, use, and disclosure of Personal Information” | 文档说明个人信息处理，不是统计数据许可证；提及 Terms and Conditions，但未提供该条款的直接链接。[政策](https://pages.flycricket.io/pikalytics/privacy.html) |
| 官方 calculator 仓库 README 的 Credits and license | “MIT License.”；同时称主仓库为 “main closed source repository” | MIT 声明针对发布的计算器仓库。未找到把该声明扩展到线上 Pokedex/API 使用率数据的文字。[README](https://github.com/pikalytics/pikalytics-calc#credits-and-license) |
| 计算器 README 链接的 setdex 项目 | “CLI Setdex generator for Honko Damage Calculators” | README 给出读取本地统计 JSON、生成 setdex 的用法；所见根目录仅 README、index.js、setdex_pikalytics.js，未见 LICENSE，README 未见数据复用授权。[仓库](https://github.com/GriffinLedingham/pikalytics-setdex) |
| setdex 链接的 Smogon Usage Parser | “Use this parser as you please” | 该句明确指 parser；仓库标示 GPL-3.0。可证明解析器及历史数据流程的存在，不能据此给 Pikalytics 当前全部线上数据套用 GPL。[仓库](https://github.com/GriffinLedingham/smogon-usage-parser) |

检索覆盖 Pokedex 页脚、隐私政策全文、上述第一方链接仓库，以及 `site:pikalytics.com` 下 API / license / permission / terms of use 等查询。未检出公开数据许可证、第三方 API 文档、请求频率政策或明确授权缓存/再分发的说明。主研究任务另以普通 GET 核实猜测地址 `https://pages.flycricket.io/pikalytics/terms.html` 返回 404；这只说明该地址不存在，并非证明站方没有条款。隐私页底部 Flycricket 的 Terms of Use 是文档托管服务的链接，不能直接当作 Pikalytics 数据条款。

## 实际数据接口与字段

接口来自 Pokedex HTML 加载的 [game.3e8239194bd13bb1.js](https://cdn.pikalytics.com/scripts/game.3e8239194bd13bb1.js)，不是猜测 API 路径。脚本 `buildURL` 使用 `/api/l/{date}/{format-rating}`，单宝可梦使用 `/api/p/{date}/{format-rating}/{pokemon}`，并允许附加站内语言参数。该脚本当次配置 `dataDate: "2026-05"`、默认格式 `gen9championsvgc2026regmc`、默认 cutoff `1760`。不能将这个 date 字符串当作当前统计的可靠采样月份：页面现时展示 M-C，且脚本配置月份明显落后，须再确认服务端日期语义。

| 本次实际 GET | 结果 |
| --- | --- |
| [列表：/api/l/2026-05/gen9championsvgc2026regmc-1760](https://www.pikalytics.com/api/l/2026-05/gen9championsvgc2026regmc-1760) | HTTP 200，JSON 数组，264 项。含 `name`, `rank`, `percent`, `types`, `id`, `stats`, `abilities` 等。第一项 Rillaboom 的 `rank` 为字符串 `"1"`，`percent` 为 `"37.11"`。 |
| [详情：/api/p/2026-05/gen9championsvgc2026regmc-1760/rillaboom](https://www.pikalytics.com/api/p/2026-05/gen9championsvgc2026regmc-1760/rillaboom) | HTTP 200，JSON 对象；`moves: [{move, percent, type}]`、`items: [{item, item_us, percent}]`、`abilities: [{ability, percent}]`；另有 `natures`, `spreads`, `team`, `counters`, `megas`, `ranking`, `raw_count`, `brought_count`, `brought_percent`, `format` 等。该样本 `natures` 与 `spreads` 均为空数组。 |

两次请求未附 Cookie 或凭据，附 `Origin: https://example.com`，响应均含 `content-type: application/json; charset=utf-8` 和 `access-control-allow-origin: *`。因此当次无凭据简单跨域 GET 的响应头满足浏览器读取条件；未实际在本项目浏览器执行 fetch，未检查带凭据请求或额外自定义请求头的预检。接口无公开版本契约或 SLA 的证据，未来稳定性尚未确认。

字段需要规范化：详情 `ranking` 是字符串，而 `percent` 实测为数字 `37`，列表百分比更精细；招式等子项百分比也是字符串。不要假定不同端点字段类型和精度相同。当前详情还出现 Trace 等战斗中获得的特性，且招式百分比的统计分母未提供正式定义；不能直接视为合法配招/初始特性的队伍频率。这些是返回内容的观察与接入风险判断，不是已确认的统计方法。[详情响应](https://www.pikalytics.com/api/p/2026-05/gen9championsvgc2026regmc-1760/rillaboom)

## 数据来源边界

Pokedex 同时有对战使用率、Showdown cutoff 和比赛队伍内容。页面解释 cutoff 与 Pokémon Showdown 的 Glicko 加权排名有关，比赛队伍有 Limitless 原始队伍链接。历史解析器明确读取 Smogon Usage Stats，输出 Pikalytics API 使用的数据结构。但这些线索不足以确认当前 M-C 的所有指标来自同一上游，也不足以确认当前 API 日期、招式分母、变身形态归属。[Pokedex](https://www.pikalytics.com/pokedex)、[历史解析器](https://github.com/GriffinLedingham/smogon-usage-parser)

## 本地接入影响（主研究任务的仓库核查）

现有 [move-usage.ts](../../src/lib/champions/move-usage.ts) 绑定 Champions Battle Data 的 defaultSeason/Doubles，并以 BattlePokemonId 缓存；[types.ts](../../src/lib/champions/types.ts) 也是来源专用类型。[推荐逻辑](../../src/lib/scenario/selection/recommendations.ts) 对 rank/percentage/ID 的消费可成为适配边界，现有名称 join 工具可复用。但新增来源必须明确 source、format、period、rating 的缓存身份，处理字符串百分比、缺失数组和独立形态语义。现有 Mega 继承本体使用率的行为不能直接推广到 Pikalytics。实现还会涉及 Champions 专用规格与 i18n 来源说明；本次不进行接入。

实用判断：待授权和统计语义确认后，可以做独立适配器；现阶段只能确认技术入口存在，不能承诺 Pikalytics 当前数据能无损替代现有推荐来源。

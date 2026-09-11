# Smogon 使用率数据复用证据

核查日期：2026-09-11。范围为公开汇总 usage statistics，区别于攻略文章、人工编写配招、精灵图片及原始对战日志。仅研究，未接入。

结论：**公开汇总使用率是有证据支持的可用方向，证据比 Pikalytics 线上数据更明确。** Smogon 统计维护者明确引导用户使用公开 JSON 自行分析；`@pkmn` 项目还明确将汇总统计描述为 public domain。但本次没有找到 Smogon 自身以 CC0 或其他专门数据许可证形式作出的全面授权声明，因此应准确区分各条证据的发布者和范围。

| 证据 | 已验证内容 | 适用范围与限制 |
| --- | --- | --- |
| Smogon 官方统计讨论帖，Antar，2017-01-05，FAQ 第 13 条 | 问题为 “Can I perform my own analyses?”，回答引导读者使用每月 `chaos` 目录 JSON，并说明它含生成配招统计的全部信息。[原帖 #2](https://www.smogon.com/forums/threads/official-smogon-university-usage-statistics-discussion-thread-mk-3.3591776/) | 这是统计维护者对下游自主分析的直接肯定。原始日志因隐私不提供；不能把公开汇总统计与原始日志混为一谈。该段未详细列举商用、再分发或服务请求频率条款。 |
| `pkmn/smogon` README | “aggregated stats information is freely available in the public domain” [README](https://github.com/pkmn/smogon/blob/main/README.md) | 明确针对 aggregated stats；同段将 sets/analysis 内容列为 Smogon 及贡献者的版权内容。但该项目自称 unofficial APIs，此处是 **@pkmn 的表述，不应转述成 Smogon 官方数据许可证**。 |
| `smogon/usage-stats` 官方仓库 | 仓库有 MIT LICENSE，README 说明其脚本从 Smogon Pokémon Showdown 服务器日志生成使用率、配招及环境统计。[仓库](https://github.com/smogon/usage-stats) | MIT 明确适用于该代码仓库；不能仅凭生成工具 MIT 就断言线上数据也受 MIT 授权。 |
| Smogon 公开 stats 目录 | 官方长期提供按月份组织的统计文件目录。[目录](https://www.smogon.com/stats/) | 是直接数据来源与公开可读证据；目录开放本身并非独立许可证。 |

建议本项目限定使用 `smogon.com/stats` 的公开汇总数据，并在来源说明中标注 Pokémon Showdown / Smogon、月份、格式和 rating cutoff。不要把此结论扩展到 Smogon 攻略文章、人工配招或其他站点加工的数据。缓存策略和指标规范化属于后续工程设计，不能将代码许可证当成所有内容的统一授权。

本次检索包括 Smogon 官方统计 FAQ、官方统计代码仓库，以及 `site:smogon.com` 的 usage statistics / permission / public domain / copyright 查询；未发现比上述证据更直接的官方数据许可全文。论坛中第三方 API、可视化项目的存在只证明实际使用案例，不作为数据授权依据。

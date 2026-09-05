---
# This section is managed by the CLI. Do not edit manually.
id: "90d2e3bf-ee7e-4337-b40c-4af686387e78"
title: "通过 GitHub Actions 自动同步静态素材到 R2"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-09-05T14:04:00Z"
updated_at: "2026-09-05T14:35:00Z"
---
## 目标与排期

将 PokeGauge 使用的 GitHub 图片素材迁移到自有 R2，并通过 GitHub Actions 自动同步，减少手工更新和用户浏览器对 GitHub 图片地址的依赖。

用户于 2026-09-05 要求先记录为 issue，自动同步当前暂不实施。保持待评估，不标记 READY-FOR-AGENT。随后用户单独授权首次 R2 素材迁移，要求创建 PR 后等待审批；Actions 自动同步仍由本 issue 跟踪。

## 首次迁移进度

首次迁移在独立分支 `codex/r2-static-assets` 推进：已创建 `pokegauge-static` 并绑定 `static.pokegauge.top`；前端通过构建时环境变量 `VITE_STATIC_ASSET_BASE_URL` 读取完整版本前缀。由于当前插件上传接口不能设置自定义缓存头，首次发布改由素材域名的 Cache Rule 设置浏览器与边缘 14 天 TTL。实现说明见 [迁移记录](../docs/traces/implementations/2026-09-05-r2-static-assets.md)。下面的初始配置和费用估算保留为后续自动同步的讨论依据，实施时需与现有部署衔接。

## 已确定的配置

- 使用专用 R2 bucket，计划名称为 `pokegauge-static`，绑定 `static.pokegauge.top`。
- 使用 R2 Standard，通过自定义域名提供图片，关闭 `r2.dev`。
- 图片使用 `Cache-Control: public, max-age=1209600`，即 14 天；暂不添加 `immutable`。
- CDN 遵循缓存头，不设置额外更长的 TTL。
- 使用带版本的素材路径，保留上游 sprites 目录结构；先完成上传和验证，再切换前端引用。
- 范围为宝可梦正背面 PNG、道具及 Mega 石图片，包括 gen8/gen9 道具目录。本站图标、字体、天气和场地 SVG 继续随应用打包；cries 不属于当前上传范围。

## 自动化方案（待实施时确认）

1. 每周检查上游，有更新时生成包含完整 commit SHA 的更新 PR。
2. 更新合并后自动同步 R2，同时支持手动触发。无更新时不重复上传已完成的版本。
3. 按固定 SHA 按需获取素材，仅检出需要的目录，避免下载整个动画库。
4. 根据应用资源生成清单，校验路径、图片内容及文件校验值，输出明确的缺图报告。
5. 上传到版本目录，写入正确的 Content-Type 和 14 天 Cache-Control；失败可重跑。
6. 全部素材通过验证后才允许前端引用新版本；失败时继续使用原版本，保留回滚所需旧素材。
7. 使用限定到素材 bucket 的凭据，保存在 GitHub Secrets；仅可信发布任务可以使用上传凭据。

需确定更新 PR 的触发和权限配置、旧版本保留策略，以及前端发布与素材上传的依赖关系。创建更新 PR 与更新业务生成数据的边界也需明确，不能仅因素材更新就隐式改动计算数据。

## 当前证据及前置事项

- 2026-09-05 已通过 Cloudflare 插件只读验证：`pokegauge.top` 状态 active，R2 列表当时仅返回 `genie-audio`。尚未创建项目素材 bucket、绑定素材域名或上传。
- 已确认 GitHub 仓库 `darwintree/PokeGauge` 为 public。
- 三个 submodule 已在本地更新到各自上游最新提交；详见 [更新记录](../docs/traces/implementations/2026-09-05-update-submodules.md)。
- PokeAPI：`d4f9a4af58ade123fbc0558f68b1c69daa97d9e4`。
- sprites：`da7052d875de0566a657cf78a823f034385971c2`。
- cries：`ef687b18f0ce17169b4b4c09175819f7ade92f0f`。
- 嵌套 sprites/cries 的新版本未被 PokeAPI 官方提交的 gitlink 固定。仅提交主项目的 PokeAPI gitlink 或运行普通递归 submodule update，不能复现当前嵌套版本；需要在主项目中固定供同步使用的来源 SHA。
- sprites 当前使用部分克隆和稀疏检出；CI 需显式重建该配置，不能依赖本地 Git 设置。
- 当前生成资源推导出 2,832 条候选图片路径，其中 2,810 条存在，总大小 2,981,397 bytes，约 2.84 MiB；这不等同于已证明所有路径都是可选 UI 项。
- 22 条路径在上游树中也不存在：ID `10158`、`10159`、`10264–10271`、`10301` 各自的正面和背面 PNG。道具路径齐全。需核对哪些身份实际可选，并确定缺图映射或占位策略；不可静默发布新缺图。
- 尚未重新生成应用名称、招式及其他业务数据。上游更新后构建通过；降低测试并发后 80 个测试文件、737 项测试通过。

## 开销估算（2026-09-05，实施时重新核价）

仅针对当前 2,810 张图片，按每轮全量上传估算，不包含整个 sprites 仓库或音频：

| 项目 | 用量估算 | 费用判断 |
| --- | --- | --- |
| Actions 标准 Linux runner | 当前仓库为公开仓库 | 标准托管 runner 免费 |
| 保留 10 个完整版本 | 约 28.4 MiB | 账户免费额度足够时 $0 |
| 每周上传，按每月 5 次 | 14,050 次 PUT，另有列表和校验请求 | 账户免费额度足够时 $0 |
| 每天上传，按每月 30 次 | 84,300 次 PUT，另有列表和校验请求 | 账户免费额度足够时 $0 |

R2 Standard 每月免费额度为 10 GB-month、100 万次 A 类操作、1,000 万次 B 类操作，出站流量免费。额度须结合账户其他 bucket（包括 genie-audio）的用量计算，未查询实际账期剩余额度，不能保证账户总账单为零。

超额单价：存储 $0.015/GB-month，A 类 $4.50/百万次，B 类 $0.36/百万次；Cloudflare 按计费单位向上取整，不将按比例计算的微小金额当作实际账单。

用户访问产生的回源读取另计，取决于访问量、每次加载图片数及实际缓存命中率。14 天 TTL 不保证每张图每 14 天只回源一次。此次估算没有测量 Actions 运行时间，也不包含其他 CI 任务或额外付费服务。

来源：
- [GitHub Actions 计费](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- [R2 价格与计费单位](https://developers.cloudflare.com/r2/pricing/)
- [R2 自定义域名](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [R2 与 CDN 缓存](https://developers.cloudflare.com/cache/interaction-cloudflare-products/r2/)

## 验收标准

- [ ] 素材来源 SHA 在主仓库可追踪，干净 CI 环境能复现所需文件。
- [ ] 定时检查、合并后上传、手动补跑均符合确定后的流程，重复执行不会重复发布同一版本。
- [ ] 缺图策略明确，有文件完整性校验和可审阅的同步摘要；部分失败不能触发前端切换。
- [ ] 自定义域名可访问，图片类型和 14 天缓存头正确，实际缓存行为通过验证。
- [ ] 前端图片地址统一，运行时图片请求不再依赖 GitHub，选择器、对阵、书签、道具图片验证通过。
- [ ] 凭据仅用于限定 bucket 的可信任务；提供配置、重跑及回滚说明。
- [ ] 实施时补相关测试、四语言 changeset；前端变更完成仓库要求的设计复核。

# Implementation Trace: R2 素材地址迁移

Date: 2026-09-05
Source: 用户要求环境变量配置素材路径，完成首次上传及地址替换后创建 PR，审批后再继续部署。
Language: 简体中文

当前状态：用户随后明确要求固定 URL，当前前缀为 `https://static.pokegauge.top/pokeapi`，不含 commit。第 1 条的版本路径决策已被替代；14 天 Cache Rule 保留。已配置 rclone S3 凭据，后续通过校验和增量上传。

## Entries

### 1. 一个环境变量包含完整素材版本前缀

Type: unresolved-implementation-decision

Context:
用户要求通过环境变量配置素材路径，未指定域名和版本是否拆分，也未指定开发环境默认值。

Decision:
使用 `VITE_STATIC_ASSET_BASE_URL` 包含域名和 `/pokeapi/<sprites-commit>` 前缀。跟踪的 `.env` 提供此次 R2 版本地址，开发与生产共用；允许 `.env.local` 或构建环境覆盖。统一函数仅去除末尾斜杠并追加现有相对素材路径。

Reason:
一个值就能整体替换素材来源，无需维护独立的域名和版本组合；通过 Vite 构建时替换使部署参数明确可追溯。README 说明改变 Worker 运行时变量不会改变已构建的图片地址。

Follow-up:
后续自动同步流程更新这个已跟踪的版本前缀；首次部署由用户审批 PR 后继续。

### 2. 通过素材域名 Cache Rule 设置 14 天缓存

Type: deviation

Context:
原方案通过上传对象元数据设置 Cache-Control。当前插件可上传 PNG，但其请求封装忽略额外 headers；单图上传后确认对象只有 Content-Type 元数据。本地无 Wrangler 登录，插件也无管理账号 API token 的权限。

Decision:
在 `static.pokegauge.top` 的 `/pokeapi/` PNG 路径上配置 Cache Rule，浏览器和边缘 TTL 均为 1,209,600 秒。400–599 状态不在边缘缓存。保持 R2 Standard 和关闭 r2.dev；不改动主站缓存规则。

Reason:
复用已授权的 Cloudflare 配置能力，实现用户确定的 14 天期限，不引入临时上传 Worker 或新的长期凭据。规则仅匹配本次新素材域名及图片目录。

Follow-up:
自动同步 issue 实施时可改用对象元数据，并同步调整 Cache Rule；本次由域名规则负责 TTL。

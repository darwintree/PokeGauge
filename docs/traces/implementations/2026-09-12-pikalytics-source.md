# Implementation Trace: Pikalytics usage source

Date: 2026-09-12
Source: User request to add Pikalytics usage data
Language: 简体中文

## Entries

### 1. 使用 Pikalytics 首页实际请求的 JSON 接口

Type: tradeoff

Context:
Pikalytics exposes rendered HTML pages, AI-optimized Markdown pages, and the JSON
endpoints its own front end calls. The request did not specify an endpoint.

Decision:
Use the Pokedex JSON API: /api/l/{date}/{format} for the ranked roster and
/api/p/{date}/{format}/{pokemon} for move, ability, item, and nature
breakdowns. Discover {format} and {date} from the site itself.

Reason:
The JSON API is what pikalytics.com/pokedex calls, so it is the same data the
site renders, exposes access-control-allow-origin: *, and returns the full ranked
roster (271 entries) rather than the AI index's top 50. The detail endpoint is
required because the roster endpoint only includes move/ability/item breakdowns
for rank 1.

Follow-up: None

### 2. 规则与数据日期如何确定

Type: tradeoff

Context:
Pikalytics does not publish which format/date its JSON API is keyed by. The site
itself reads both from its bundled GameConfig (defaultFormat + "-1760" suffix,
dataDate) in the game bundle.

Decision:
Fetch https://www.pikalytics.com/pokedex and read the <option ... selected> value
for the active ladder format, and https://www.pikalytics.com/ai/pokedex for the
"Data Date" it is published under. Cache the resolved pair per Worker isolate for
one hour.

Reason:
This mirrors the site's own discovery without parsing a hash-named JS bundle, and
keeps working when the active regulation or data month changes. The pokedex
response is large, so the parsed pair is cached instead of re-fetched per request.

Follow-up: None

### 3. 本地开发与生产保持一致

Type: tradeoff

Context:
The repository previously ran `vite dev` with a hand-written proxy that did not
match the deployed Worker, so /api/smogon/latest and /api/pikalytics/* behaved
differently locally and in production.

Decision:
Adopt the official @cloudflare/vite-plugin so `vite dev` runs worker/index.ts in
workerd, and remove the Vite proxy.

Reason:
This is Cloudflare's documented path for a Vite SPA with an API Worker, so local
and deployed routing, headers, and caching come from the same source.

Follow-up: 保留插件参与 `vite build` 会破坏部署资源目录，见条目 4。

### 4. Cloudflare Vite 插件只在开发时启用

Type: tradeoff

Context:
条目 3 让 `vite build` 也走 Cloudflare Vite 插件，但插件的产物布局与部署时的资源根目录不一致：它把前端输出到 `dist/client`，并生成 `.wrangler/deploy/config.json` 指向该目录。CI 的预览部署实际以 `dist/` 作为资源根目录，于是构建出的 `index.html`（引用 `/assets/*`）在根路径上不存在——整站（`/`、`/assets/*`、`/favicon-32x32.png`）404，只有 `/api/*` 正常。受影响预览：`e16c2ff4`、`45a71c10`、`7e9e8744`；同一 PR 中未引入插件的 `77c88986` 正常。

Decision:
插件只在 `vite dev` 启用（`command === "serve" && !isPreview`，并排除 `VITEST`），生产构建回到普通 Vite 输出到 `dist/`；`wrangler.jsonc` 的 `assets.directory` 保持 `./dist`。

Reason:
`vite build` 是否使用插件不影响本地与线上的行为一致性——一致性来自开发时用 workerd 跑 `worker/index.ts`。而部署时的资源根目录由 wrangler 配置决定，插件生成的 `dist/client` 布局与之冲突。回到 `dist/` 恢复到引入插件前 CI 可用的布局（`77c88986` 已验证），且不依赖 CI 是否读取生成的 deploy 配置。代价是 `vite.config.ts` 导出函数，`vitest.config.ts` 的 `mergeConfig` 需要先以 build 语义求值该函数。

Follow-up: 若后续希望生产构建也走插件，必须先确认 CI 实际使用哪个资源目录（本次未能读取 Workers Builds 日志，dashboard 被 Cloudflare 人机校验拦截）。相关加载与来源问题见 `.issues/20260912_open_使用率加载优化-所有路径.md`。

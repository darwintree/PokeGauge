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
workerd, remove the Vite proxy, and let `wrangler deploy` consume the generated
dist/pokegauge/wrangler.json.

Reason:
This is Cloudflare's documented path for a Vite SPA with an API Worker, so local
and deployed routing, headers, and caching come from the same source. The
analytics binding is preserved in the generated configuration.

Follow-up: None

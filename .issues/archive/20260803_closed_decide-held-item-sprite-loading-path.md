---
# This section is managed by the CLI. Do not edit manually.
id: "375c3b74-e8fa-432b-a2ea-29ee862d2ea5"
title: "Decide held-item sprite loading path"
status: "closed"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-03T04:30:00Z"
updated_at: "2026-08-05T06:33:00Z"
---
## Goal

确定 Held item sprite 从权威来源到产品运行时的加载路径，并明确当前本地 vendoring 是否继续作为长期契约。

## Resolution

**Done (2026-08-05 grill + implementation).**

- Phase 1: runtime pin-hotlink to PokeAPI/sprites @ `8dfa3d97e953caaafaafd4963eff7621811af08e` via `spriteSourcePath`; local `public/items/` removed.
- Shared `Gem` placeholder on missing URL / load failure.
- Spec: `docs/spec/held-item-pick.md` · change: `docs/spec/changes/2026-08-05-held-item-sprite-loading-path.md`
- Discussion: `docs/traces/discussion/2026-08-05-held-item-sprite-loading-path.md`
- Research: `docs/research/2026-08-05-sprite-hotlink-vs-local-vendoring.md`
- Phase 2 self-host: [[../20260805_open_self-host-held-item-sprites-phase-2]]
- Mega icon completion closed with the same change: [[20260805_closed_complete-mega-stone-held-item-icons]]

## Original questions (superseded)

- 图片来源、版本固定方式及资源身份由什么定义。
- 采用源文件落仓、资源生成时复制、构建时打包，还是不可变静态资源托管。
- PokeAPI numeric item id、资源文件名与 gen8/gen9 特殊路径如何关联。
- 开发、构建和部署环境中的缓存、更新、离线可用性及加载失败 fallback。
- 是否继续保留 frozen-85 spec 的本地 vendoring 和禁止运行时 hotlink 契约；若改变，需形成明确 spec change。

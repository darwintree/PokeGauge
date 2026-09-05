---
# This section is managed by the CLI. Do not edit manually.
id: "a45c75a8-a9e2-4004-9e05-9f1bd03f5fc3"
title: "Unify home Pokémon cards with Setup and clarify FORM entry"
status: "closed"
labels: []
created_at: "2026-09-05T11:22:00Z"
updated_at: "2026-09-05T11:23:00Z"
---
## Confirmed result

用户确认首页复用 workspace Setup 身份卡，保留原首页标题与选齐后自动进入 workspace 的流程。首页与 Setup 共用白底描边、下拉箭头和按压反馈的 FORM 按键。

## Prototype primary source

Branch: codex/prototype-home-form
Commit: c95b1531a5370929b400de66e5217f4f3a568d15
Run: pnpm prototype:home
URL: /?prototype=home

选择该方案是为了让首页与 Setup 连续一致，以小幅修改代替重做首页。原型代码已从正式实现移除。

## Validation

pnpm build; 11 related tests; targeted lint; desktop and mobile visual checks; FORM opens same-species selection; selecting both sides enters workspace.

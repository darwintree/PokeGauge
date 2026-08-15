---
# This section is managed by the CLI. Do not edit manually.
id: "729a59b0-c708-41b0-8113-327d6a06aa21"
title: "Replace padded 30×30 held-item pixel icons with 160×160 bag art"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-15T00:51:00Z"
updated_at: "2026-08-15T00:51:00Z"
---
## Goal

让经典 Held item 图标的画布占满程度接近现有 gen8/gen9 背包插画，消除折叠态、展开芯片和结果行里「图和边框之间空隙过大」的观感。

## Problem

当前契约钉 PokeAPI/sprites commit `8dfa3d97e953caaafaafd4963eff7621811af08e`。经典道具是 **30×30 像素画**，生命宝珠实际不透明区域约 16×16、进化石约 13×13，四周空 7–9px。gen8/gen9（伞、羽毛、面具）是 **160×160 背包插画**，长边能铺到画布的约 72–86%。芯片 CSS padding 只有 2px，空隙主要在 PNG 里。

2026-08-14 已把显示盒对齐到 30px 并给经典图加 `pixelated`；这解决了非整数缩放，**没有**解决画布留白。用户确认 gen8/9 的视觉大小合适，随后决定本轮不换素材。

## Research

[[../docs/research/2026-08-14-held-item-sprite-fill-and-alternatives]]

- PokéSprite 32×32 与 Showdown 24×24 仍是同一套库存像素画，留白同类或更差。
- Serebii SV `…/itemdex/sprites/sv/{slug 去连字符}.png` 的 160×160 与 PokeAPI gen8/9 是同一套插画。冻结 85 项里 **79/85** 有 SV 文件。
- 超进化石 SV 为 0/47；ZA 文件夹有 160×160（如 `za/gengarite.png`、`za/charizarditex.png`）。
- 无 160×160 的缺口：深海之牙、深海鳞片、不融冰、幸运拳。大葱应对 ZA `leek.png`（PokeAPI slug 仍是 `stick`）。
- 不能热链 Serebii。现有加载契约是 PokeAPI pin；换源需要 spec-change，并 vendor 或另找可 pin 的 160×160 副本。

相关但不替代本票：[[20260805_open_self-host-held-item-sprites-phase-2]] 只换 host，仍是同一批 30×30 字节。

## Non-goals

- 本轮不实现换图、不热链 Serebii、不把 30×30 做 CSS 放大当作终态（会保住像素画风格，和旁边 gen8/9 插画仍两套）。
- 不改 Held item 效果、选择模型或 Phase 1 加载失败占位。

## Acceptance ideas

- [ ] 经典道具与 gen8/9 在同一芯片尺寸下画布占满程度接近
- [ ] 来源可 pin，不运行时依赖 serebii.net
- [ ] 超进化石与 `stick`/Leek 有明确 160×160 路径或书面 fallback
- [ ] 四个无 160×160 文件的道具有明确 fallback（留 30×30 或 PGL 80×80）
- [ ] `docs/spec/held-item-pick.md` 的 sprite 契约已按 spec-change 更新
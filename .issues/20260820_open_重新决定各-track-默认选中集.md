---
# This section is managed by the CLI. Do not edit manually.
id: "3e4a338b-ec03-468d-8992-97ef97d37614"
title: "重新决定各 Track 默认选中集"
status: "open"
priority: "medium"
labels: ["FEATURE-REQUEST", "NEEDS-TRIAGE"]
created_at: "2026-08-20T16:01:00Z"
updated_at: "2026-08-20T16:01:00Z"
---
## Goal

重新决定 Scenario Explorer 各 Track 的默认选中集，**主要目的是减少首屏中已选中的选项个数**（从而压低默认展示行数 / 首屏视觉噪声）。

展示行数 = ∏(各 track 选中数)。收紧默认选中即可，无需改累乘契约或增加折叠模式。

## Context

- 入口：`defaultTrackState`（`src/lib/scenario/state.ts`），部分默认来自 catalog（招式 / 道具 / 特性等）与 preset 默认选择 helper。
- 决策地图仍把「各 track 的 default 选中集」标为留给实现阶段：`docs/decision-maps/ui-prototype.md`（#2 / #3）。
- 天气 / 场地 / 墙目前已默认 `["none"]`；招式、道具、特性、实数值等默认可能仍偏宽。

## Scope

- [ ] 盘点当前各 Track 的默认选中（池 vs 选中、攻击方 vs 防守方）
- [ ] 按「首屏尽量少选项」原则重定默认选中集（可接受结果变窄，用户再展开对比）
- [ ] 对齐 catalog / Champions 初始化与 preset 默认选择逻辑，避免晚到数据把未触碰 Track 重新撑宽
- [ ] 更新相关测试与（如有）spec / 决策地图中的 default 说明

## Out of scope

- 改 Track 累乘模型或结果行折叠 / 分组 presentation
- 改用户主动多选后的交互

## Notes

具体「每条 Track 默认选哪几个」需产品拍板；本 issue 先挂 triage。
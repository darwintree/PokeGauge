# Scenario Explorer Prototype

> **Status**: #5 closed — Sidebar refine (Variant B)

## Run

```bash
pnpm dev
```

Open: `http://localhost:5173/?prototype=scenarios`

## Verdict (#5) — Sidebar refine

- 同一页；Default / Detailed 无模式切换（收紧 = 左栏减少 track 选中）
- Desktop：左 sticky 参数栏（matchup + tracks）+ 右结果主区
- Mobile：参数块堆叠在结果上方
- 结果区视觉优先级高于参数区

Layout: [`variant-b-sidebar.tsx`](./variant-b-sidebar.tsx)

## Prior verdicts

### #2 — Track 累乘模型 (closed)

**展示行数** = 各 track 选中数累乘。

### #4 — 箱形图语义 (closed)

箱体 = 通常 16 roll；须须 = 暴击；粗竖线 = 平均。

### #6 — 赛制与规则集 (closed)

- **Ruleset**: Pokémon Champions（当前固定）
- **Format**: VGC 双打
- 规则切换：后续能力，首版不做

## Deferred

- Default 选中集 per track
- 行数过多时的折叠/分组（presentation only）

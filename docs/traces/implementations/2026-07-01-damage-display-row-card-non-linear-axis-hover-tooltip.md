# 伤害对比行：行标识卡片 / 非线性轴 / 行级 hover 落生产

对应 issue: [[58c4eca8-605e-42c3-addc-df3522635f5b|Apply damage-comparison display decisions]]
决策源: [2026-07-01-damage-display-row-track-hover-grill](../2026-07-01-damage-display-row-track-hover-grill.md)

trace 只记录实现阶段自行决定、源未明确的点；trace 已锁定的 6 条决策不重复。

## 决策

### 1. 非线性映射的具体函数与刻度

源只给「0–100 线性 72%，100–200 `sqrt` 压缩 28%，200 硬上限」。

- 刻度集 `[0, 25, 50, 75, 100, 150, 200]`：100 之后只补 150、200 两个刻度，避免 `sqrt` 段刻度过密；100% 处额外画虚线 scale-break。
- 映射：`f(p) = p/100 * 0.72`（p≤100），`f(p) = 0.72 + sqrt((p-100)/100) * 0.28`（100<p≤200）。`clamp` 到 `[0, 200]`。
- ponytail: 上限 200 对当前数据（暴击峰值 182%）留余量；若未来出现 >200 的伤害，会贴右边缘，届时上调 `AXIS_MAX` 并重平衡 `LINEAR_FRACTION`。

### 2. hover 卡片配色

源把配色 defer 到实现阶段。

- 用 shadcn `Tooltip` 默认深色 pill（`bg-foreground text-background`），不改成浅色 popover：默认样式自带 Arrow 且配色与 pill 一致，零额外样式；4 行信息用色点/竖条标记，色相与 track 对应（通常 tone、平均浅竖线、暴击紫、OHKO 红），在深底上仍可读。
- 行布局 `flex-col items-stretch`，宽度 `max-w-[18rem]` 容纳「通常 / 平均 / 暴击 / OHKO」四行。

### 3. trigger = 整条 track 的实现

`TooltipTrigger` 默认渲染 `<button>`；用 `render={<div tabIndex={0} />}` 改成 div 以承载绝对定位的箱线图子元素，同时保留 focus 触发（键盘可达）。div 即 track 容器（`relative h-10 min-w-0 flex-1`）。

### 4. 左侧标识卡片结构

源给「纵向 标签: 值 三行（招式/攻击/防御），道具内联在攻击行」。

- 三行用 `border-b` 分隔；每行 `flex items-center gap-1.5 px-3 py-1.5`。
- 行首小号 muted 标签（「招式 / 攻击 / 防御」），值跟在后面；攻击行内联道具图标 + 「无加成」。
- `showMove=false` 时省略招式行；`isRangeEnvelope` 时在攻击行下补「实数值区间 × 16 roll」脚注。
- 卡片宽 `w-60`（15rem），与右图 `gap-3`（0.75rem），数轴左 padding `15.75rem` 对齐。

### 5. 数轴 sticky

`sticky top-0 z-10`，加 `bg-background` 遮住滚动时穿过的行；保留 `mb-2` 间距。

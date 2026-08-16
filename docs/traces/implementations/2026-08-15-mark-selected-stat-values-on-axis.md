# Implementation Trace: Mark selected Stat Values on the stat axis

Date: 2026-08-15
Source: `.issues/archive/20260815_closed_mark-selected-stat-values-on-the-stat-axis.md`
Language: 中文

## Entries

### 1. 内部点用不可拖的小圆点，端点仍用现有手柄

Type: interpretation

Context:
源要求端点、内部点、Temporary 都能辨认，且不另造身份语言。数轴上已有可拖动手柄（空心圆）和 snap 刻度。Issue 5 明确禁止在轴上增删点。

Decision:
已选内部点画 `size-2` 实心圆，`pointer-events-none`。端点不重复画点，沿用现有手柄。轴上不区分 Temporary。

Reason:
手柄已经是端点身份；再叠一个点会看起来像第三个可拖控件。Temporary 身份留在 chip 的虚线上，不改手柄和轴标。

Follow-up:
None.

### 2. 无 snap 标签的内部点补轴下数字

Type: interpretation

Context:
源要 Choice 离散点与 Range 包络对读。轴上已有 snap 名（0A / EX）和端点数字。自定义内部值没有文字。

Decision:
仅给「不是端点、也不落在 snap 上」的已选值补轴下数字。snap 上的内部点靠刻度名 + 圆点对读。

Follow-up:
None.

### 3. 轴上不用虚线区分 Temporary

Type: deviation

Context:
源写「沿用现有 chip / Temporary 虚线语义」。初版把 Temporary 端点手柄和内部点改成虚线。

Decision:
撤回轴上的虚线。手柄保持实线空心圆；内部已选点一律实心圆。Temporary 仍只由 chip 虚线表达。

Reason:
「不另造身份语言」是不要在轴上再发明一套 Temporary 外观。把 chip 虚线搬到手柄上，等于改了已有端点控件。

Follow-up:
None.

### 4. 内部点改为最细空心圆，描边跟选项同色

Type: decision

Context:
原型比较了实心圆、小段、刻度，以及空心圆的大小/线宽/颜色。选定最细小空心圆（8px / 1px）。颜色要求与选项一致；选项身份色是 invest band 的 `--mod-fg`（与 chip `--chip-fg` 同一套 token），不是手柄的 ink。轴上 snap 标签仍走另一套 tier 色（32A snap 偏蓝，32A 选项是 some 青绿）。

Decision:
内部点固定为 8px、1px 描边、paper 填心的空心圆。描边用对应 Stat Value 的 invest band：`none` / `some` / `heavy` / `ex`。端点仍用原 ink 手柄，不在端点再叠一圈。原型切换从主路径拆除。

Reason:
细空心圆不容易被认成第三个手柄。描边用选项前景色，才能在轴上和下面的 0A / 32A / EX 对上。选中选项的 ink 边框在 8px 圆上会丢掉 band 身份。snap 刻度色不改，避免把轴标和选项两套语义搅在一起。

Follow-up:
若细线在区间带上看不清，再加粗或改用 band 底色填心，不改形状。

### 5. 空心圆描边加到 2px

Type: decision

Context:
落成 8px / 1px 后，细线在区间带上不够清楚。

Decision:
外径仍 8px，描边改为 2px。形状和颜色不变。

Reason:
只加粗、不放大，继续跟手柄（14px / 2px）区分。

Follow-up:
None.

### 6. 内部点改为同色实心

Type: decision

Context:
加粗空心描边后仍想对比实心。

Decision:
8px 圆改为 invest band 前景色实心填，去掉描边。手柄仍是空心 ink。

Reason:
实心用选项身份色，比空心环更容易在区间带上认出。

Follow-up:
若实心看起来像第三个手柄，再回到空心或缩小。

### 7. 实心圆收到 6px

Type: decision

Context:
8px 实心仍偏大，容易跟手柄抢身份。

Decision:
外径改为 6px，实心和选项色不变。

Reason:
只缩小、不改形状。手柄仍是 14px 空心。

Follow-up:
None.


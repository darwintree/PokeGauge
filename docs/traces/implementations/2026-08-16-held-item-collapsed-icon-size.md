# Implementation Trace: Held-item collapsed summary icon size

Date: 2026-08-16
Source: 用户请求（折叠态道具图标偏大）
Language: 中文

## Entries

### 1. 折叠摘要用 20px，不改默认 30px 画布

Type: decision

Context:
2026-08-14 把 `HeldItemSpriteIcon` 默认盒子定为 30px（对齐 PokeAPI 经典图），折叠摘要也跟默认。用户现在觉得折叠态偏大。展开芯片仍需要 30px inner 做编辑面。

Decision:
只给折叠摘要传 `className="size-5"`（20px）。默认组件、展开芯片、Picker 井、结果行都不动。20px 落在结果行 16px 和展开 30px 之间，当 glanceable peek，不跟编辑 tile 抢体量。

Reason:
用户要的是折叠态小一点，不是推翻原图像素对齐。24px 仍接近展开 inner，缩得不够；15px 是 30 的整数半，但比结果行还小。

Follow-up:
None.

# Implementation Trace: Held-item sprite display size

Date: 2026-08-14
Source: 用户请求（折叠态、展开态、结果行道具图片尺寸不自然）；`docs/spec/held-item-pick.md` 只约定加载路径，不约定显示像素
Language: 中文

## Entries

### 1. 按 PokeAPI 画布对齐，不沿用 grill 的 24px

Type: unresolved-implementation-decision

Context:
Spec 不规定显示尺寸。2026-06-29 grill 把 tile 定成 `size-9 p-1`、图标 `size-6`（24px）。当时本地 Serebii 图已换成 PokeAPI：经典道具 PNG 是 **30×30** 像素画，gen8/gen9 是 **160×160** 插画。24px 盒子对 30×30 是非整数缩小，看起来糊而且偏小；展开芯片 inner 也被 CSS 锁在 24px；结果行再套 14px/12px 墨框，图只剩 8–12px。

Decision:
`HeldItemSpriteIcon` 默认盒子 30px。经典图用 `image-rendering: pixelated`（1×/2× DPR 都是整数倍）。gen8/gen9 同盒、双线性缩放、不加 pixelated。展开芯片改为 38px（2px 垫 + 2px 边，inner 30px），图 `size-full`；`<lg` 仍 `size-11` 保触摸目标。折叠摘要用默认 30px。结果行去掉内嵌墨框：桌面条件卡 16px（对齐能力 token 的 `leading-4`），移动 caption 14px（对齐 `h-3.5` 行）。Picker 井从 28px/20px 调到 36px/30px。

Reason:
自然尺寸是原图像素，不是 24px 设计残留。结果行加框会再吃掉可画面积，和能力 token 的扁平底也不齐。

Follow-up:
None.

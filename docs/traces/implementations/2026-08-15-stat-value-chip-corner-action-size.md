# Implementation Trace: Stat Value chip corner-action size

Date: 2026-08-15
Source: `.issues/20260815_working_cap-stat-value-chip-corner-action-size-across-viewports.md`
Language: 中文

## Entries

### 1. 窄视口只放大命中热区，不放大可见角标

Type: interpretation

Context:
源要求可见角标在 ≤1023px 仍是相对 chip 的小角标；「若要保留触控命中区」则放大热区而不是可见盒。未指定热区目标尺寸。原规则把可见盒直接设成 `2rem`。

Decision:
可见尺寸固定为组件层的 `1rem`。`@media (max-width: 1023px)` 改为 `.track-option-action::before { inset: -0.5rem }`，命中盒保持原来的 `2rem`。不改同一媒体查询里 chip / 按钮的 `min-height`。

Reason:
`2rem` 可见角标会盖住约 1.75–2.5rem 的 chip；热区继续用旧值，避免顺手改触控契约。chip 本体变高不在本票范围。

Follow-up:
None.

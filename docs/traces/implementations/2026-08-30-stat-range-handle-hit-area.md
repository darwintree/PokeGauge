# Implementation Trace: 能力值数轴手柄命中区域

Date: 2026-08-30
Source: 用户关于扩大能力值数轴手柄可命中区域的请求
Language: 中文

## Entries

### 1. 命中区域尺寸

Type: unresolved-implementation-decision

Context:
需求要求扩大可命中区域，但未指定尺寸；现有可见圆点为 14px，数轴交互行高为 32px。

Decision:
将手柄按钮的命中区域扩大到 32px，保留内部可见圆点为 14px。

Reason:
32px 复用现有数轴高度，超过项目设计规范要求的 WCAG 2.2 24px 最小触控目标，同时不改变布局或视觉尺寸。

Follow-up:
None.

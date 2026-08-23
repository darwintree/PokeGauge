# Implementation Trace: Stat Track 模式切换按钮

Date: 2026-08-23
Source: 用户请求：Stat Track 展开时在标题行新增区间 / 选项切换按钮
Language: 中文

## Entries

### 1. 保留折叠摘要的既有切换交互

Type: unresolved-implementation-decision

Context:
需求要求新增按钮仅在展开时显示，但现有折叠摘要本身已经可以点击切换模式；需求没有说明是否移除这项既有能力。

Decision:
保留折叠摘要的既有切换交互，只让新增的两段式按钮在展开标题行显示。

Reason:
避免在新增入口的同时产生未请求的交互回退，并严格满足新增按钮不在折叠态显示。

Follow-up:
None.

### 2. 切换模式时退出未完成的预设草稿

Type: unresolved-implementation-decision

Context:
新增预设时界面暂时使用区间编辑器放置数值。此时直接改底层模式会造成按钮选中态与编辑面板状态不一致。

Decision:
从标题按钮切换模式时先取消未完成的草稿，再激活目标模式；草稿期间按钮显示为“区间”。

Reason:
让标题按钮、当前编辑面板与实际模式保持一致，复用已有取消草稿行为，不引入额外状态。

Follow-up:
None.

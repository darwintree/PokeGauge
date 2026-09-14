# Implementation Trace: Matchup 选择器性能

Date: 2026-09-14
Source: 用户要求调查并优化移动端 workspace 参数区宝可梦对话框的响应速度
Language: 简体中文

## Entries

### 1. 虚拟化实现与键盘兼容

Type: unresolved-implementation-decision

Context:
用户授权减少列表挂载量，但未指定虚拟化工具或窗口化后键盘焦点的处理方式。当前列表的每个宝可梦是可 Tab 到达的按钮，搜索、排序和形态快捷行均已对用户开放。

Decision:
使用 TanStack React Virtual 管理可见行和尺寸测量，沿用 PickerDialog 的滚动容器；搜索、筛选或优先级变化时从列表顶部开始。保留行按钮的 Tab/Shift+Tab 顺序，补充方向键和 Home/End 导航；将获得焦点的行保留在渲染范围内，避免滚动卸载焦点。形态快捷行保持完整展示。

Reason:
使用现成虚拟化库避免自行实现尺寸、滚动和视口观察；焦点保留与跨窗口导航防止虚拟化后无法通过键盘选择视口外的宝可梦。现有可见行为作为稳定契约保留，内部渲染结构可直接替换。

Follow-up:
浏览器验证滚动末尾、筛选后重置、键盘跨窗口选择，以及连续开关十次的性能。

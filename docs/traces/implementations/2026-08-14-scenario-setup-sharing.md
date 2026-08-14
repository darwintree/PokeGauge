# Scenario Setup 分享实现记录

Date: 2026-08-14
Source: `.issues/archive/20260721_closed_share-and-restore-scenario-setup-by-url.md`
Language: 中文

## Entries

### 1. 分享与恢复反馈入口

Type: unresolved-implementation-decision

Context:
已确认契约明确把分享入口、复制反馈、剪贴板失败和恢复错误界面留给前端实现决定。

Decision:
在结果标题旁放置一个 Share 按钮。成功后在按钮内短暂显示已复制；剪贴板不可用时使用浏览器原生 `prompt` 提供可手动复制的完整链接。无效分享链接显示阻断页，并提供移除分享参数后重新加载本地最近设定的操作。

Reason:
入口靠近当前计算结果且不占用 Track 编辑空间。原生回退不引入新组件或依赖；阻断页避免把本地设定误报为成功恢复，同时保留用户已有本地数据。

Follow-up:
None.

### 2. 首次语义编辑检测

Type: unresolved-implementation-decision

Context:
契约要求导入状态仅在首次共享语义修改后进入本地持久化，但没有规定如何区分语义修改与纯展示修改。

Decision:
用 V1 canonical share token 作为语义指纹。当前 token 与导入 token 首次不同时，移除 URL 分享参数并启用本地 snapshot 持久化；展示偏好不进入 token，因此不会触发该转换。

Reason:
这直接复用发布契约的字段边界，避免维护第二套容易漂移的字段比较逻辑。

Follow-up:
None.

# Implementation Trace: 全局概率模式兼容

Date: 2026-08-25
Source: 用户确认的“将项目信息升级为全局设置中心”实施计划
Language: 中文

## Entries

### 1. 保留 v2 分享格式中的兼容位

Type: tradeoff

Context:
概率模式不再属于 Scenario Setup，但现有 v2 分享链接的二进制格式包含一个概率位，且这些链接可能已被外部用户保存或转发。

Decision:
继续读取 v2 末尾的概率位但忽略其值；新链接仍写入固定的实战模式兼容位，不因当前设备偏好改变。

Reason:
这样既让历史链接保持可读，也避免为删除一个语义已失效的 bit 引入新的分享协议版本。全局偏好成为唯一计算来源。

Follow-up:
None.

### 2. 本地快照升级为版本 5

Type: tradeoff

Context:
本地快照直接序列化 TrackState。继续沿用版本 4 会让同一版本同时存在包含和不包含概率模式的两种结构。

Decision:
新快照使用版本 5；读取版本 3 或 4 时删除旧概率字段并迁移其余场景数据。

Reason:
显式版本边界让本地数据结构保持单一，同时保留用户已有场景。

Follow-up:
None.

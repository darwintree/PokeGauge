# Implementation Trace: 属性图标

Date: 2026-09-15
Source: 用户确认筛选使用原版文字样式，其他位置使用 Gen9 small icon
Language: zh-hans

## Entries

### 1. 图标交付路径

Type: unresolved-implementation-decision

Context:
用户确认了视觉形式，未指定素材交付方式；此前检查远端对应属性素材路径返回 404。

Decision:
将 18 张 small PNG 放入 src/assets/type-icons，使用静态导入随构建交付；本地文件名直接对应属性领域标识。尺寸沿用已预览的 20px／紧凑摘要 16px。

Reason:
素材集合很小且固定，随应用构建可以保障标签图像与代码一同交付，无需另行部署远端目录。

Follow-up:
None.

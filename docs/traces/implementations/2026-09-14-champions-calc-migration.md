# Implementation Trace: Champions calc 迁移

Date: 2026-09-14
Source: ../discussion/2026-09-14-champions-calc-migration.md
Language: 中文

## Entries

### 1. 固定源码的依赖交付

Type: unresolved-implementation-decision

Context:
已决定固定上游源码并可复现构建，但未指定如何向部署环境交付未发布的 npm 包。

Decision:
使用上游提交 e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d 的未修改 TypeScript 运行时源码，以单独锁定的 TypeScript 4.9.5 编译器构建带声明的 CommonJS 包，提交本地 tgz 依赖及重建脚本。包版本注明提交；保留 MIT 许可证。构建不打包上游网页、测试和开发工具。

Reason:
安装与部署直接读取已审核的本地包，不依赖安装时下载或执行上游构建脚本；源码不作机制补丁，之后可切回正式 npm 发布。

Follow-up:
None.


### 2. 编译器与目录外数据补全

Type: unresolved-implementation-decision

Context:
项目使用 TypeScript 6，但上游 calc 的 CommonJS 导出初始化依赖旧编译器的顺序；TypeScript 6 的产物导致 calculate 递归。Champions 目录还有只有覆盖字段的招式记录，例如齿轮飞盘缺失属性、分类及连击数据。

Decision:
构建工具使用独立的 TypeScript 4.9.5 别名依赖。运行时保持两份只读 Generation 单例；Champions 优先使用自身记录，目录外回退第九世代，补丁式招式记录合并完整基础数据。极巨化外观身份仍保留，并映射到基础物种计算名称。

Reason:
保留上游源码机制，同时让所有保留的候选身份有完整输入数据；避免把可查到名称误判为实际支持。重复构建产物校验和一致。

Follow-up:
上游正式发布时重新验证构建与目录适配。

### 3. 不完整机制与招式输入的处理

Type: unresolved-implementation-decision

Context:
上游 Champions 对部分目录外特性、道具、招式没有完整路径；另外部分招式威力与属性存在规则差异，而现有书签保存了数值威力。

Decision:
按支持审计维护缺失机制名单，在进入任何伤害、概率、展示分支前统一归一化不支持的特性和道具，结果来源仍记录原选项及 unsupported 状态。缺失专属机制的招式整体不可计算。用户可配置威力保留快照数值；原生连击的固定威力和招式属性随当前规则派生，未写回快照。

Reason:
避免某一分支偷偷应用半套机制，也避免更新引擎时默认威力覆盖用户保存的配置。对于上游 Mega Sol 的攻击方限定、Aura Guard 的接触减伤等，计算与展示采用当前固定源码的实际语义。

Follow-up:
更新 calc 时同步重审支持名单及跨规则用例。

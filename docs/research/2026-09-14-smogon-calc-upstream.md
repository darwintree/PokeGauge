# @smogon/calc 发布、维护状态与模拟器替换边界

核查日期：2026-09-14。仅研究，未迁移依赖或运行规则。本次读取 npm registry、GitHub 官方仓库及 API；提交时间采用 UTC。仓库既有研究笔记位于本目录。

结论：**npm 发布落后于活跃的上游开发，不能据此判断 damage-calc 已停止维护。** 本项目使用的 0.11.0 仍是 npm 最新版，但上游源码已经提供独立的 Champions 引擎。优先评估固定上游提交构建的 calc，比直接换成完整 Pokémon Showdown 模拟器更贴近现有伤害分布接口；这是工程建议，不是已经验证过的迁移方案。

## 发布与源码的差距

| 证据 | 核查结果 |
| --- | --- |
| [npm registry 元数据](https://registry.npmjs.org/@smogon%2fcalc) | `dist-tags.latest` 为 `0.11.0`；发布时间 `2026-03-11T19:23:04.166Z`；该版本 `gitHead` 为 `264a4ea846a0a0c7724e26c4671ff42e854b5ea1`。此前 0.10.0 发布于 2024-05-31。 |
| [发布提交到本次 HEAD 的比较](https://github.com/smogon/damage-calc/compare/264a4ea846a0a0c7724e26c4671ff42e854b5ea1...e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d) | GitHub compare API 返回 `ahead_by=112`、`total_commits=112`；HEAD 为 2026-09-11 的 `e7fd7e59`（更新配招）。112 是全仓提交数，包含 UI、配招、数据和引擎，不能称为 112 个引擎修复。 |
| [Champions 支持提交](https://github.com/smogon/damage-calc/commit/c0bee8660ff16b5490dd37204403de82b99622ff) | 2026-04-16 加入 Pokémon Champions 支持，晚于 npm 0.11.0 发布。 |
| [Mega Sol 修复和测试](https://github.com/smogon/damage-calc/commit/babd8ba88e68c02e6cfa95410898f22f1fcf0ff1)、[Dragonize 修复](https://github.com/smogon/damage-calc/commit/e7e74f3036c9793813e197e28d54cc857ae7e8dd) | 分别在 2026-04-25、2026-08-10 合入。 |
| [Champions 特性补全](https://github.com/smogon/damage-calc/commit/d952bbe79ba8022dc3bc94ca28a601332536dc2c)、[新 Mega 与 Aura Guard](https://github.com/smogon/damage-calc/commit/111407c919c2c886688db704ae97376e768b72e4) | 2026-08-20 改动 Champions 引擎的 Fluffy 和公共威吓处理；2026-09-08 修改特性、物种数据及 Champions/Gen9 伤害逻辑。并非只有配招在更新。 |

上游源码的 [calc/package.json](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/package.json) 仍写 `0.11.0`；这个源码版本字段不能证明 npm 包已包含后续提交。尚未找到下次 npm 发布的确定日程，本次也没有验证线上计算器的实际部署 SHA。

## Champions 规则与 Gen9 不是同一选择

当前固定提交的 [`GenerationNum`](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/data/interface.ts) 增加 `0`；[`Generations.get`](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/data/index.ts) 接受该值；[`calculate` 的分发表](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/calc.ts) 将 `Generations.get(0)` 对应到 `calculateChampions`，`get(9)` 仍调用 `calculateSMSSSV`。

当前源码的 [Gen9 引擎](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/gen789.ts) 也已经包含 Mega Sol、Dragonize、Eelevate、Fire Mane 的处理；例如 Eelevate 进入地面免疫判断，Fire Mane 修改火系攻击。这说明“升级后认识特性”和“采用 Champions 专属规则”是两个独立问题；不能只检查名称是否可解析就宣称规则迁移完成。[Champions 专属引擎](https://github.com/smogon/damage-calc/blob/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc/src/mechanics/champions.ts) 应作为单独候选核验。

本项目采用 calc 运行时引擎的决定见 [ADR 0007](../adr/0007-smogon-calc-runtime-damage-engine.md)，多段伤害与树果状态边界见 [ADR 0008](../adr/0008-hit-composition-and-berry-state.md)。本地适配仍以 Gen9 为前提；迁移需要特别验证精确能力值映射（目前按 Gen9、等级 50、IV31、EV0、中性性格逆推基础能力值），以及本地概率与连续命中状态组合。**不要把改成 `CALC_GEN=0` 当作完整迁移。**

## 与 Pokémon Showdown 模拟器的关系

[damage-calc 官方 README](https://github.com/smogon/damage-calc) 明确：同一仓库包含官方伤害计算器的 UI 和 `@smogon/calc` 核心，后者面向浏览器/服务端的伤害范围计算；其数据应与 Pokémon Showdown 同步，数据问题先修模拟器。它不是对模拟器整场对战 API 的薄包装。`@smogon/calc/adaptable` 可以替换数据层，但这本身不会替换伤害机制实现。

[Pokémon Showdown](https://github.com/smogon/pokemon-showdown) 则提供对战模拟、队伍工具和 Pokédex。其 [Champions 特性数据](https://github.com/smogon/pokemon-showdown/blob/master/data/mods/champions/abilities.ts) 对 Dragonize、Eelevate、Fire Mane、Mega Sol 使用 `inherit: true` 并取消非标准标记，说明已有明确的 Champions 模组入口；这不等于本次已验证每个机制都准确。

替换有三个具体约束：

1. [官方 Node API 文档](https://github.com/smogon/pokemon-showdown/blob/master/sim/README.md) 当前明确写 Node 环境支持，浏览器支持仍在推进；不能把完整模拟器当作现有前端依赖的直接替换。该文档还说明未记录 API 不遵守 semver 稳定性保证，应固定准确版本。
2. [`BattleActions` 源码](https://github.com/smogon/pokemon-showdown/blob/master/sim/battle-actions.ts) 的伤害计算依赖 Battle/Pokémon 状态和事件处理，伤害修正中调用 `battle.randomizer`。因此直接调用内部 `getDamage` 不等于拿到 calc 的完整离散伤害分布；需要另外设计随机分支枚举、状态初始化和概率接口。使用完整回合模拟更适合回合事件验证，是否作为产品内核运行需单独原型验证。
3. 模拟器同样持续修 bug。例如 [2026-07-15 修复 Rock Head 与 Mind Blown 交互](https://github.com/smogon/pokemon-showdown/commit/1058f2d31cbbe5e339a5757cf3caca2f28914b3d)。它可作为重要的独立对照实现，不能当作永远正确的真值；分歧仍需游戏机制研究或实机证据裁决。

## 建议与未验证项

短期若没有必须马上补齐的 Champions 行为，可继续固定 npm 0.11.0，但应明确其规则边界，不能期待重新安装自动获得上述修复。若现在需要 Champions 支持，建议先用固定 SHA `e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d` 构建独立候选包，验证 Gen0 能力值映射、四个缺失特性、已有单段/多段与概率契约，然后再决定接入或等待正式发布。仓库根还包含 UI，实际 npm 子包位于 `calc/`；不能未经验证就把根仓库 Git URL 当作等价安装方式。

完整模拟器更适合先用于差异测试和回合状态研究。只有当产品明确需要大量整场事件、回合推进能力，且接受浏览器部署与分布计算的额外设计成本时，再评估把它作为运行时替代。以上建议尚未经包构建、体积测量、性能测试或本地迁移回归验证；本报告不宣称源码最新版已经覆盖所有 Champions 机制。

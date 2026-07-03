# Full PokeAPI + Champions local damage kernel 讨论记录

对应 issue: [[20260703_open_integrate-full-pokeapi-and-champions-move-usage-with-local-damage-kernel|Integrate full PokeAPI and Champions move usage with local damage kernel]]

## 1. Champions 数据范围

问题：“Pokemon Champions 数据全量接入”需要明确是规则合法性数据、完整配装 usage rows，还是当前 Move pick 使用的招式使用率数据。

决定：本轮接入 championsbattledata.com 的全量 Doubles move usage，用来驱动当前 Move pick；不接 held item、ability、stat points、teammate，也不接规则合法性数据。

## 2. Pokémon 可见池与 Champions usage 的关系

问题：全量 PokeAPI 与 Champions usage 覆盖范围不同，需决定 Pokémon 搜索池是否被 Champions usage 裁剪。

决定：Pokémon 搜索池使用全量 PokeAPI Pokémon；Champions 只影响有匹配 usage 的 Pokémon 的 Move pick，缺失时用 deterministic fallback。

## 3. 计算引擎方向

问题：全量 PokeAPI 形态可能无法稳定映射到 `@smogon/calc` 的 species/move 名称，需决定继续依赖 Smogon、deep import 底层函数，还是自建计算内核。

决定：运行时改用本地精简 damage kernel，不 deep import Smogon 私有 helper；`@smogon/calc` 只作为测试 oracle。

## 4. 本地 damage kernel 精度目标

问题：自建 kernel 需要明确是完整复刻 Smogon Gen9，还是只覆盖当前产品可表达的计算。

决定：kernel 目标是当前产品等价：Level 50、Gen9-like fixed-power physical/special damage、normal/crit rolls、STAB、type effectiveness、当前 UI 暴露的道具修正和 spread move 修正。

## 5. Type chart 来源

问题：本地 kernel 需要 type effectiveness，需决定运行时使用 PokeAPI 表、Smogon 表，还是手写表。

决定：运行时手写 18 属性 type chart；测试用 PokeAPI submodule 的 `type_efficacy.csv` 交叉验证。

## 6. `@smogon/calc` 的保留方式

问题：切换本地 kernel 后，是否完全移除 `@smogon/calc`、运行时双引擎对比，或仅在测试中保留。

决定：`@smogon/calc` 短期保留为测试 oracle，不作为运行时计算依赖。

## 7. 当前 UI 道具范围

问题：本地 kernel 首版需要决定覆盖哪些 held item 效果。

决定：只覆盖当前 UI 暴露的 Life Orb、Choice Band、Choice Specs、各属性强化道具和 explicit no-item；具体实现按真实游戏公式阶段处理，并用 Smogon oracle 检验。

## 8. Spread move 修正

问题：当前 battle format 是 VGC 双打，Doubles usage 中会出现 Earthquake、Rock Slide、Dazzling Gleam 等 spread moves，需决定是否进入公式。

决定：spread move 修正进入公式；UI 暂不增加开关，但计算内核必须支持开关。

## 9. Spread move 判定来源

问题：需要确定哪些 moves 默认应用 spread modifier。

决定：由 PokeAPI `moves.csv` 的 `target_id` 结合 `move_targets.csv` 生成 move 的 spread metadata，不手写 spread move 列表。

## 10. Spread modifier 默认值与标识

问题：UI 暂不暴露开关时，spread modifier 的默认启用策略和用户可见标识需要明确。

决定：VGC 双打语境下 spread move 默认启用 spread modifier，并在 move 上标识；move option、selected move chip、结果行中的 move label 使用一致标识。

## 11. Damage kernel 输入边界

问题：kernel 应接收 numeric resource id、resource object、完整 scenario，还是纯公式输入。

决定：kernel 接收纯公式输入：攻击/防御实数值、双方属性、招式属性与威力，以及已编译的修正项；资源 lookup、道具解释和 UI 状态编译放在 adapter。

## 12. Runtime 切换策略

问题：本地 kernel 是直接切换运行时，还是先并行或只建立不启用。

决定：直接把 runtime `computeDamage` 切到本地 kernel；测试中用 Smogon oracle 保护当前支持范围。

## 13. 全量生成文件形态

问题：全量 PokeAPI 生成产物继续放单个 TS 文件、拆分 TS 文件，还是改成 JSON。

决定：先拆分为多个 generated TS 常量文件；进一步体积和加载优化 defer 到后续讨论。

## 14. Champions 来源

问题：PokeAPI 已决定从 submodule 本地 CSV 生成，Champions usage 是否也必须本地化来源。

决定：Champions 先在生成时使用在线 API，运行时读取本地生成产物。

## 15. 文档记录

问题：本次计算边界变化是否需要 ADR、implementation trace 或不记录。

决定：写 ADR 记录本地 damage kernel 架构取舍，并记录本次 grill trace。

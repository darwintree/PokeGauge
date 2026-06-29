# 携带道具 track 讨论记录

对应 issue: [[20260626_open_introduce-specific-held-item-controls-life-orb-plates-choice-series|Introduce specific held-item controls]]

UI 定稿：**方案 B**（prototype 已 throw away，细节见 §7–§9）

## 1. 属性强化道具与招式 track 的耦合

决定：**道具 track 多选**（与其他 multi-select track 相同，参与 row product）。**每一 scenario 行仅一件道具、效果互斥**（对比多个配装方案，非叠加）。错配仍出数；无加成时结果行标注「无加成」。将来合并 → [[20260629_open_merge-scenario-rows-when-item-has-no-damage-effect]]。

## 2. 讲究围巾

决定：**不纳入** v1。

## 3. 属性强化道具默认展示与扩展

决定：属性强化道具（**非石板**）；默认可见本系 ≤2；`+` 添加其余；**localStorage 按 attacker 持久化**添加项。

## 4. Catalog / pipeline

决定：`type-boost-{type}` 与 core 合并进同一 track 选项池；track **多选**，每行 `item` 单一、modifier **互斥**。catalog 注册形态（扁平 list vs 分字段）**实现阶段再定**。

## 5. Default view 选中集

决定：**仅 `none`（无道具）**。`defaultAttackerItemIds: ["none"]`。

## 6. 结果行

决定：sidebar **纯图标**；结果行也改为图标 + **hover 名称**；无加成标注「无加成」→ [[20260626_open_damage-comparison-results-info-display-needs-refinement]]。

## 7. UI 定稿（方案 B）

| 属性 | 值 |
|------|-----|
| 布局 | 单一 flex-wrap 图标池：core + 可见强化 + `+` |
| 尺寸 | **sm** — tile `size-9 p-1`，图标 `size-6` |
| 选中 | **fill** — `border-primary bg-primary/15` |
| 未选中 | `border-border hover:bg-muted/40` |
| 无道具 | **circle-slash** inline SVG（圆 + 横线，`#94a3b8`） |
| 顺序 | **核心在前**（none → life-orb → choice）→ 本系强化 → 已添加强化 |
| 非本系默认强化 | 未选中时 **虚线边框** `border-dashed` |
| `+` | 与 tile 同尺寸、虚线框；点开 4 列图标 grid picker |
| 文案 | track 区 **无可见标签**；`aria-label` 保留 |

曾评估未采纳：A ring/md、C check/lg、D 强化在前。

## 8. Catalog ID 与 calc 映射

### Core

| catalog id | @smogon/calc | sprite `public/items/` |
|------------|--------------|-------------------------|
| `none` | _(omit)_ | inline SVG circle-slash |
| `life-orb` | Life Orb | `lifeorb.png` |
| `choice-band` | Choice Band | `choiceband.png` |
| `choice-specs` | Choice Specs | `choicespecs.png` |

### Type boost（id = `type-boost-{type}`）

| type | @smogon/calc | sprite |
|------|--------------|--------|
| normal | Silk Scarf | `silkscarf.png` |
| fire | Charcoal | `charcoal.png` |
| water | Mystic Water | `mysticwater.png` |
| electric | Magnet | `magnet.png` |
| grass | Miracle Seed | `miracleseed.png` |
| ice | Never-Melt Ice | `never-meltice.png` |
| fighting | Black Belt | `blackbelt.png` |
| poison | Poison Barb | `poisonbarb.png` |
| ground | Soft Sand | `softsand.png` |
| flying | Sharp Beak | `sharpbeak.png` |
| psychic | Twisted Spoon | `twistedspoon.png` |
| bug | Silver Powder | `silverpowder.png` |
| rock | Hard Stone | `hardstone.png` |
| ghost | Spell Tag | `spelltag.png` |
| dragon | Dragon Fang | `dragonfang.png` |
| dark | Black Glasses | `blackglasses.png` |
| steel | Metal Coat | `metalcoat.png` |
| fairy | Fairy Feather | `fairyfeather.png` |

Sprites 来源 Serebii ItemDex SV，已 vendoring 至 `public/items/`。

## 9. 状态与持久化

**可见池**

1. 始终展示全部 core options（来自 catalog）
2. 默认追加攻击方 `types.slice(0, 2)` 对应之本系强化 id
3. union 用户通过 `+` 添加的 id（去重，本系优先序不变）

**选中**

- 多选 toggle；顺序按可见池排列
- 换 matchup（attackerId 变）：选中重置为 `["none"]`；可见池中的「已添加」从 storage 读取

**localStorage**

- Key: `pokemon-damage-calc:held-item-added-boosts`
- Shape: `Record<attackerId, typeBoostCatalogId[]>`
- 仅持久化 `+` 添加的强化；不持久化选中态

## 10. 实现检查清单（absorb prototype 后）

- [ ] 替换 `ConfigMultiSelect` 道具 track 为图标池组件
- [ ] 扩展 catalog + `ATTACKER_ITEM_NAMES` 含全部 `type-boost-*`
- [ ] 按 attacker 类型生成默认可见强化
- [ ] 结果行图标（defer issue）
- [ ] 删除 `?prototype=held-items` 路由与 prototype 目录

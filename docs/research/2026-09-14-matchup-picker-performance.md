# Matchup 选择器性能调查与优化

日期：2026-09-14

## 结论

主要成本来自每次打开时挂载整个宝可梦目录。CPU 采样的主要热点是 DOM 的 `appendChild` 和 `setAttribute`。同机手机宽度与桌面宽度的差距较小；触屏松手到 click 约 2ms，未测得明显的额外触屏等待。

重复开关时，关闭后的连接节点数保持稳定且 dialog 数量为零，但浏览器中未回收的节点和原生堆显著增加。对照组在每次打开前执行垃圾回收后，重复打开的增长基本消失。证据支持大量临时 DOM 与回收压力造成累积退化；没有证据将其归因于应用持续保留所有已关闭弹窗。这个对照不能排除所有浏览器或应用内存问题。

## 测量方法

- 本地生产构建、Chrome headless、同一台机器，初始对阵为大狃拉对大狃拉。
- 进入 workspace 后切换到参数页签，连续开关攻击方选择器十次；每轮关闭动画结束后再打开。
- 桌面宽度 1440px，手机宽度 390px；触屏通过浏览器输入事件派发，按下与松开之间固定约 100ms。
- 从捕获阶段 click 到对话框挂载后首次 requestAnimationFrame 回调作为渲染响应指标；另记对话框 animationend。前者不是屏幕像素实际显示时间，不包含固定的按住时间。
- 对比 CPU 正常速度与 4 倍降速；另做每轮显式 GC 的内存诊断对照。应用自身不触发 GC。
- 首次使用率排序状态与后续缓存状态不同，所以分别记录首次打开和后续打开，不将首次目录加载等同于重复挂载成本。
- 此处是受控浏览器模拟，不是 iPhone/Safari 或 Android 真机测量。

## 4 倍 CPU 降速的十轮对照

以下来自相同脚本的优化前后运行；测量期间没有并行跑测试或构建。

| 指标 | 优化前 | 虚拟列表接入后 |
| --- | ---: | ---: |
| 首次 click → rAF | 210.8ms | 32.0ms |
| 十轮 click → rAF 中位数 | 2180.5ms | 33.8ms |
| 十轮 click → rAF 最大值 | 4092.5ms | 62.6ms |
| 第十轮 click → rAF | 1813.2ms | 40.1ms |
| 十轮 click → 动画结束中位数 | 2338.4ms | 190.7ms |
| 首帧对话框内部 DOM 节点 | 12420 | 216 |

每次打开前显式 GC 的对照中，优化前 click → rAF 中位数为 454.0ms，优化后为 32.0ms。说明除了回收压力，每次挂载本身也有显著成本。

## 实现

使用 [TanStack React Virtual](https://tanstack.com/virtual/latest/docs/framework/react/react-virtual) 管理可见行、预留行和尺寸观察，复用 PickerDialog 已有滚动容器。搜索与优先级排序继续作用于完整目录；同种形态快捷行单独展示。搜索、属性筛选和优先级变化会重置列表滚动。

每行仍是可选择的按钮，保持 Tab/Shift+Tab 顺序；增加 Home/End 和上下方向键跨窗口导航。正在获得焦点的行会保留在虚拟范围中，避免滚动导致焦点节点卸载。列表提供位置与总数的辅助技术语义。

保留 160ms 的入场动画。优化收益来自减少挂载量，不依赖提前响应 touchstart 或缩短动画。新依赖和实现使初始 JS gzip 增加约 8KiB。

## 验证

- `pnpm build`：通过。
- `pnpm test`：86 个测试文件、877 项测试通过。worktree 未展开 PokeAPI 子模块，测试时临时从本机相同锁定提交 `8fe210b21c9abbe73de93670f3d5a346c80a3625` 补入 CSV，测试后清理。
- 改动文件的 oxlint 与 `git diff --check`：通过。
- 回归测试覆盖 1300 个候选时渲染窗口有界、键盘选择末尾条目、搜索窗口外候选；已有使用率排序、跳过等待、失败回退、筛选重置与形态选择测试继续通过。
- 浏览器验证手机与桌面：滚动到目录末尾、连续 30 次 Tab 与反向 Tab、Home/End、末尾退出到关闭按钮、搜索后回顶部、选择并重新打开形态入口。
- design-taste-frontend 审查：作为现有 dense game HUD 产品界面的保留式优化，视觉变化程度低、动效沿用现有值、信息密度沿用现有值。检查手机与桌面截图、内容裁切、选中状态和焦点。修正虚拟行包装导致的分隔线规则失效，再次截图确认。

## 工具反馈处理

使用 triage-comments 核对全量测试中的环境问题：

| Comment | Target | Comment Claims | Response Claims | Decision | Evidence |
| --- | --- | --- | --- | --- | --- |
| `Error: ENOENT: no such file or directory, open '../../../PokeAPI/pokeapi/data/v2/csv/type_efficacy.csv'` | type-effectiveness.test.ts 的输入文件 | Reasonable reading / Accurate / Reachable / Material=true；Grounded / Owned（产品改动缺陷）=false | 临时补齐锁定版本输入：Effective / Complexity justified / Semantic fit / Verifiable=true | 不改产品代码；修复本地测试输入后复测 | gitlink 与本机子模块 HEAD 相同；补齐 CSV 后 877 项测试通过 |

## 最终构建复测

修正分隔线后的最终构建，各条件连续开关十次，动画仍为 160ms。以下为独立复测，不与上表混合计算中位数。

| 条件 | click → rAF 中位数 | 最大值 | 第十次 | 动画结束中位数 |
| --- | ---: | ---: | ---: | ---: |
| 桌面 | 8.5ms | 11.0ms | 8.3ms | 177.0ms |
| 手机触屏 | 11.0ms | 12.9ms | 11.0ms | 177.4ms |
| 手机触屏 + 4 倍 CPU 降速 | 23.2ms | 31.5ms | 24.2ms | 181.9ms |

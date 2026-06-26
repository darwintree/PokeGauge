# Pokemon Damage Calc

Pokémon battle damage calculator.

## Map

| Topic | Where |
| --- | --- |
| App entry | [`src/main.tsx`](src/main.tsx) · [`src/App.tsx`](src/App.tsx) |
| Theme / Tailwind | [`src/index.css`](src/index.css) |
| shadcn config | [`components.json`](components.json) |
| UI components | [`src/components/ui/`](src/components/ui/) |
| Utilities | [`src/lib/`](src/lib/) |
| Design spec (light) | [`design.md`](design.md) |
| Design spec (dark) | [`design.dark.md`](design.dark.md) |
| shadcn docs | https://ui.shadcn.com/docs |
| Geist upstream | https://vercel.com/design.md · https://vercel.com/design.dark.md |

## Commands

```bash
pnpm dev
pnpm build
pnpm dlx shadcn@latest add <component>
```

Package manager: **pnpm** (`packageManager` in [`package.json`](package.json)).

## Conventions

- UI follows **Geist** via `design.md` / `design.dark.md`; shadcn tokens in `src/index.css` are the runtime layer — align them with the spec when theming.
- Pokémon domain tokens (types, effectiveness, HP) live separately from Geist/shadcn semantics.

## shadcn UI

### 现状

- **Token 层**：`src/index.css` 已接入 shadcn CSS variables + Geist；`components.json` 配置为 `base-nova`。
- **组件层**：[`src/components/ui/`](src/components/ui/) 已安装 Card、Combobox、ToggleGroup、Tabs、Slider、Label、Badge、Empty 等；[`Scenario Explorer`](src/components/scenario-explorer/) 已基于这些 primitive 构建。
- **仍保持自定义**：领域可视化（如 `DamageBoxPlot`）和 Pokémon 专用色 token，不纳入 shadcn。

### 今后

- **产品 UI 默认用 shadcn**：新页面或改控件时，先查 [`src/components/ui/`](src/components/ui/) 是否已有对应 primitive；没有则安装，而不是手写 `<button>` + popover / segmented markup。
- **安装方式**：

```bash
pnpm dlx shadcn@latest add <component>
```

生成文件应在 **`src/components/ui/`**。若 CLI 写到仓库根目录的 `@/components/ui/`，移入 `src/components/ui/` 后再用。

- **边界**：

| 用 shadcn | 保持自定义 |
| --- | --- |
| 布局（Card、Separator） | 伤害箱线图、坐标轴、图例 |
| 表单与选择（Combobox、ToggleGroup、Tabs、Slider、Label） | 属性 / 克制 / HP 等领域色 |
| 反馈（Empty、Badge） | 无对应 primitive 的一次性布局 |

- **已有控件需要改交互或样式时**：优先在 shadcn 组件上扩展（variant、className、composition），不要平行维护一套手写版本。

## Agent skills

### Issue tracker

Issues live in `.issues/` and are managed with the **dot-issues** skill. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage roles, stored as uppercase labels in dot-issues (e.g. `NEEDS-TRIAGE`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` at the repo root plus `docs/adr/`. See `docs/agents/domain.md`.

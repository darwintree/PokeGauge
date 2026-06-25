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

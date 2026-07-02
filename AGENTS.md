# Pokemon Damage Calc

Pokémon battle damage calculator.

## Project map

| Topic | Where |
| --- | --- |
| App entry | [`src/main.tsx`](src/main.tsx) · [`src/App.tsx`](src/App.tsx) |
| Scenario Explorer | [`src/components/scenario-explorer/`](src/components/scenario-explorer/) |
| Theme / Tailwind | [`src/index.css`](src/index.css) |
| shadcn config | [`components.json`](components.json) |
| UI primitives | [`src/components/ui/`](src/components/ui/) |
| Utilities | [`src/lib/`](src/lib/) |
| i18n | UI messages and locale selection live in [`src/lib/i18n/`](src/lib/i18n/); Pokémon and move names resolve through [`src/lib/resources/`](src/lib/resources/) with the current `SupportedLocale`. |
| Design spec (light) | [`design.md`](design.md) |
| Design spec (dark) | [`design.dark.md`](design.dark.md) |
| Agent issue tracker | [`docs/agents/issue-tracker.md`](docs/agents/issue-tracker.md) |
| Agent triage labels | [`docs/agents/triage-labels.md`](docs/agents/triage-labels.md) |
| Domain docs | [`CONTEXT.md`](CONTEXT.md) · [`docs/adr/`](docs/adr/) · [`docs/agents/domain.md`](docs/agents/domain.md) |
| shadcn docs | https://ui.shadcn.com/docs |
| Geist upstream | https://vercel.com/design.md · https://vercel.com/design.dark.md |

## Commands

```bash
pnpm dev
pnpm build
pnpm dlx shadcn@latest add <component>
```

Package manager: **pnpm** (`packageManager` in [`package.json`](package.json)).

## Implementation rules

- UI follows **Geist** via `design.md` / `design.dark.md`; shadcn tokens in `src/index.css` are the runtime layer, so align theme changes with the specs.
- Product UI is **shadcn-first**: use or extend primitives in `src/components/ui/`; install missing primitives with the command above.
- shadcn's `ui` alias is `@/components/ui`, and `@` resolves to `src`; generated primitives should land in `src/components/ui/`.
- Keep Pokémon domain tokens separate from Geist/shadcn semantics: types, effectiveness, stat tiers, HP, and damage visuals are domain UI.
- Keep custom domain visualization custom when no shadcn primitive matches, especially damage plots, axes, legends, type colors, effectiveness colors, and HP/status displays.
- When editing existing controls, extend the shadcn primitive through variants, `className`, or composition before introducing parallel handcrafted markup.

## Agent workflow

### Issue tracker

Issues live in `.issues/` and are managed with the **dot-issues** skill. See `docs/agents/issue-tracker.md`.

**Resolve -> archive before commit.** When work fully resolves an issue, update the issue body, then run `archive --id <uuid>` via dot-issues so it leaves the active queue. Do this before creating the git commit that lands the fix; the commit should include both the code change and the archived issue file move.

### Implementation traces

When completing an issue or executing an **AFK** task (issues labeled `ready-for-agent`), use the **implementation-with-traces** skill.

- Trace only unresolved implementation decisions: choices the source did not state or left ambiguous. Do not trace explicit requirements or routine repo conventions.
- Write traces under `docs/traces/implementations/YYYY-MM-DD-slug.md`; append entries as decisions are made.
- No unresolved decision -> no trace file.

### Triage labels

Five canonical triage roles are mapped in `docs/agents/triage-labels.md`; dot-issues stores labels uppercase, such as `NEEDS-TRIAGE`.

### Domain docs

Single-context repo: read `CONTEXT.md` and relevant ADRs under `docs/adr/` before domain-sensitive work. See `docs/agents/domain.md`.

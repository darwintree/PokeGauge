# PokeLens

Pokémon battle damage calculator.

## Project map

| Topic | Where |
| --- | --- |
| App entry | [`src/main.tsx`](src/main.tsx) · [`src/App.tsx`](src/App.tsx) |
| Scenario Explorer | [`src/features/scenario-explorer/`](src/features/scenario-explorer/) |
| Theme / Tailwind | [`src/index.css`](src/index.css) |
| shadcn config | [`components.json`](components.json) |
| UI primitives | [`src/components/ui/`](src/components/ui/) |
| Utilities | [`src/lib/`](src/lib/) |
| i18n | UI messages and locale selection live in [`src/lib/i18n/`](src/lib/i18n/); Pokémon and move names resolve through [`src/lib/resources/`](src/lib/resources/) with the current `SupportedLocale`. |
| Design spec | [`design.md`](design.md) — game HUD system, light-only (dark mode is dropped); direction: [`docs/adr/0002`](docs/adr/0002-game-hud-design-direction.md) |
| Agent issue tracker | [`docs/agents/issue-tracker.md`](docs/agents/issue-tracker.md) |
| Agent triage labels | [`docs/agents/triage-labels.md`](docs/agents/triage-labels.md) |
| Domain docs | [`CONTEXT.md`](CONTEXT.md) · [`docs/adr/`](docs/adr/) · [`docs/agents/domain.md`](docs/agents/domain.md) |
| shadcn docs | https://ui.shadcn.com/docs |

## Commands

```bash
pnpm dev
pnpm build
pnpm dlx shadcn@latest add <component>
```

Package manager: **pnpm** (`packageManager` in [`package.json`](package.json)).

## Implementation rules

- UI follows the **game HUD** system in [`design.md`](design.md) (direction: [`docs/adr/0002-game-hud-design-direction.md`](docs/adr/0002-game-hud-design-direction.md)); shadcn tokens in `src/index.css` are the runtime layer, so align theme changes with the spec. The information-hierarchy invariants in `design.md` are a product contract — do not add, remove, merge, or reorder result-surface information without an explicit request.
- Product UI is **shadcn-first**: use or extend primitives in `src/components/ui/`; install missing primitives with the command above.
- shadcn's `ui` alias is `@/components/ui`, and `@` resolves to `src`; generated primitives should land in `src/components/ui/`.
- Keep Pokémon domain tokens separate from HUD/shadcn semantics: types, effectiveness, stat tiers, HP, and damage visuals are domain UI.
- Keep custom domain visualization custom when no shadcn primitive matches, especially damage plots, axes, legends, type colors, effectiveness colors, and HP/status displays.
- When editing existing controls, extend the shadcn primitive through variants, `className`, or composition before introducing parallel handcrafted markup.

## Agent workflow

### Frontend design review

Frontend implementation, UI redesign, and interactive prototype work must use the **design-taste-frontend** skill to review the completed result before finishing the task, then apply any corrections identified by that review. This review-and-correct pass is a completion requirement, not an optional report. Work with no frontend surface (data loading, engine logic, tests, docs, etc.) does not require this review.

When using **design-taste-frontend** in this repository, ignore its statements that exclude dashboards, dense product UI, or similar application surfaces. Apply its relevant design and pre-flight rules to those surfaces as well.

### Subagent review

When a review uses sub-agents:

- Cap nesting depth at one level: review sub-agents must not spawn further sub-agents.
- Spawn with `fork_turns: "none"` so reviewers do not inherit the main conversation context.

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

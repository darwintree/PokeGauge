---
name: codex-review
description: Run codex review on a git diff — pin the scope, set model and reasoning effort, execute, report findings. Use when the user asks for a codex review, wants Codex CLI to review code, or names model/reasoning for review.
---

# Codex Review

Delegate code review to **Codex CLI** (`codex review`). This skill is the **legwork** contract: same process every run; output varies.

Not Cursor's two-axis `review` skill (`~/.agents/skills/review/SKILL.md`) — that runs Cursor sub-agents. **Codex review** runs the external CLI, which reads the diff, may execute verification commands, and returns prioritized findings.

## Prerequisites

Before running, confirm:

1. `which codex` resolves (install: `brew install codex` or Codex.app).
2. `codex doctor` shows connectivity ✓ (ChatGPT auth or API key configured).
3. The target diff is non-empty.

**Completion criterion:** all three pass, or report the blocker and stop.

## 1. Pin the diff

Pick exactly one scope flag:

| Scope | Flag |
|-------|------|
| Working tree (staged + unstaged + untracked) | `--uncommitted` |
| Branch vs base | `--base <branch>` |
| Single commit | `--commit <sha>` |

If the user didn't specify, default to `--uncommitted` when the working tree has changes; otherwise `--base main`.

Add `--title "<summary>"` when reviewing a commit.

Optional `[PROMPT]` tail — custom review instructions (e.g. focus on security, check spec file X).

**Completion criterion:** one resolved ref or flag, and `git diff` / `git show` for that scope is non-empty.

## 2. Set model and reasoning effort

Override per run with `-c` / `--config` (dotted TOML path, value parsed as TOML):

```bash
-c model='"gpt-5.4-mini"'
-c model_reasoning_effort='"high"'
```

### Defaults

When the user does **not** name a model or reasoning level, always pass:

| Key | Default |
|-----|---------|
| `model` | `gpt-5.4-mini` |
| `model_reasoning_effort` | `high` |

Do not inherit `~/.codex/config.toml` for review runs unless the user asks to use their global config or a named profile.

If the user names only one of the two, set that one explicitly and keep the other at its default above.

### Model

Set with `-c model='"MODEL"'`. Common choices:

| Model | When |
|-------|------|
| `gpt-5.4-mini` | **Skill default** — cost-efficient review at high reasoning |
| `gpt-5.5` | Deep review when user asks for frontier model |
| `gpt-5.4` | Strong everyday review |
| `gpt-5.3-codex-spark` | Ultra-fast, shallow passes |

If the user names a model, use it instead of the default.

### Reasoning effort

Set with `-c model_reasoning_effort='"LEVEL"'`.

| Level | When |
|-------|------|
| `minimal` / `low` | Lint-style sweeps, obvious bugs |
| `medium` | Default balance |
| `high` | **Skill default** — feature review, domain logic |
| `xhigh` | Security, correctness-critical, spec conformance |

If the user names a level, use it instead of the default.

### Profiles (alternative)

Pre-baked combos live in `~/.codex/config.toml` under `[profiles.NAME]`. Activate with `-p NAME`:

```bash
codex -p review review --uncommitted
```

Use profiles only when the user says "use the review profile" or names a profile explicitly. Otherwise always pass explicit `-c` overrides (defaults or user-specified).

Not every model supports every level — if the run fails on an invalid combo, step down one effort level and retry once.

**Completion criterion:** every run includes resolved `model` and `model_reasoning_effort` values (defaults, user override, or named profile) stated in the report preamble.

## 3. Run

Execute from the repo root. **Codex review is non-interactive** — do not launch the TUI.

```bash
codex review [SCOPE_FLAGS] \
  -c model='"gpt-5.4-mini"' \
  -c model_reasoning_effort='"high"' \
  ["optional prompt"]
```

Substitute `-c` values when the user overrides model or reasoning.

Shell constraints when invoked from Cursor:

- Set `block_until_ms` ≥ 180000 (review often takes 2–5 minutes).
- Request permissions `full_network` and `all` — Codex needs network and filesystem access outside the default sandbox.
- Poll background output until `exit_code` appears; do not summarize mid-run.

**Completion criterion:** command exits; stdout contains the review summary (priority tags like `[P1]`, `[P2]` plus file paths).

## 4. Report

Present to the user:

1. **Command run** — full invocation including model/reasoning overrides.
2. **Verdict** — Codex's one-line summary.
3. **Findings** — each item with priority, file:line, and description (preserve Codex wording; light cleanup only).
4. **Elapsed time** and exit code.

Do not merge or rerank Codex findings against your own judgement in the same list — if you disagree, say so in a separate **Agent notes** subsection.

**Completion criterion:** user can act on every finding without re-running Codex.

## Examples

Default (no user override):

```bash
codex review --uncommitted \
  -c model='"gpt-5.4-mini"' \
  -c model_reasoning_effort='"high"'
```

Uncommitted changes, user asks for frontier model:

```bash
codex review --uncommitted \
  -c model='"gpt-5.5"' \
  -c model_reasoning_effort='"high"'
```

Single commit — defaults plus title:

```bash
codex review --commit abc1234 \
  --title "Add scenario explorer prototype" \
  -c model='"gpt-5.4-mini"' \
  -c model_reasoning_effort='"high"'
```

User override — higher reasoning:

```bash
codex review --commit abc1234 \
  -c model='"gpt-5.4-mini"' \
  -c model_reasoning_effort='"xhigh"'
```

Branch review with custom focus:

```bash
codex review --base main \
  -c model='"gpt-5.4"' \
  -c model_reasoning_effort='"high"' \
  "Check VGC level-50 and doubles spread damage correctness against CONTEXT.md"
```

Fast triage:

```bash
codex review --uncommitted \
  -c model='"gpt-5.4-mini"' \
  -c model_reasoning_effort='"low"'
```

## Failure modes

| Symptom | Fix |
|---------|-----|
| Auth / websocket errors | `codex login`; re-run `codex doctor` |
| Empty diff | Widen scope or confirm changes exist |
| Hangs > 5 min | Poll terminal file; if still running, wait — do not kill unless user asks |
| Invalid reasoning for model | Step down effort or switch model; retry once |
| `TERM=dumb` warning | Ignore — expected in agent shells; review still works |

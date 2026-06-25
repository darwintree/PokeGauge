# Issue tracker: dot-issues

Issues for this repo live under `.issues/` and are managed with the **dot-issues** skill.

## Conventions

- Default issue base dir: `.issues`
- Stable identifier: `id` (UUID in front matter); filenames are for readability only
- Metadata changes via the skill — do not edit YAML front matter manually
- Edit Markdown bodies directly; use the skill to refresh `updated_at` after manual body edits
- Labels are stored uppercase in `.issues/labels.json`

## When a skill says "publish to the issue tracker"

Use the **dot-issues** skill to create an issue (check for duplicates first).

## When a skill says "fetch the relevant ticket"

Use the **dot-issues** skill to show, search, or list issues.

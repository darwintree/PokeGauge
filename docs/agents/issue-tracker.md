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

## Wayfinding operations

### Map and children

- A map is an issue labelled `WAYFINDER:MAP`.
- The map's `## Tickets` section is the canonical ordered list of all direct child tickets.
- `## Tickets` permanently retains resolved and archived children, but does not copy status, priority, claim, or blocking state.
- Each child contains `## Parent map` followed by exactly one wiki link back to its map.
- A child carries exactly one Wayfinder type label: `WAYFINDER:RESEARCH`, `WAYFINDER:PROTOTYPE`, `WAYFINDER:GRILLING`, or `WAYFINDER:TASK`.
- An issue absent from `## Tickets` is not a child, even if it is linked from `Out of scope`.

### Creation

Create and wire a map in separate passes:

1. Create the map.
2. Create every currently specifiable child ticket.
3. Add every direct child to the map's `## Tickets`, in intended frontier order.
4. Add `## Parent map` to each child.
5. Add blocking relationships after every referenced issue exists.

### Blocking

- A child declares dependencies under `## Blocked by` as a wiki-link list.
- Absence of `## Blocked by` means the child has no blockers.
- A child is unblocked when every listed blocker has status `closed` or has been archived.
- Do not duplicate blocking state in the map's `## Tickets`.

### Claim

- `status: open` means unclaimed.
- Claim a ticket by changing it to `status: working` before doing any work.
- Re-read the ticket after claiming to verify that the claim succeeded.
- Release an abandoned claim by changing `working` back to `open`.
- `WAYFINDER:CLAIMED` is a legacy label and must not be used for new claims.

### Frontier

The frontier is the map's direct children that:

1. have `status: open`;
2. have no blockers, or every blocker is closed/archived.

When Wayfinder chooses automatically, the first eligible ticket in the map's `## Tickets` order wins. Tickets with `status: working` are already claimed and are not on the frontier.

### Resolution

1. Append the decision or result under `## Resolution` in the child.
2. Change the child to `status: closed`.
3. Append a named link and one-line gist to the map's `## Decisions so far`.
4. Archive the child according to the repo's resolve-before-commit rule.

dot-issues automatically rewrites body links when issues are renamed or archived.

# Release Please commit rendering

Checked **2026-08-23** against Release Please `main` (`17.11.1`) and the
Conventional Commits 1.0.0 specification. Research only; no release configuration
was changed.

## Recommendation

Keep AGENTS.md's existing requirement for plain-language, user-visible commit
subjects, and clarify it as follows:

> Release Please groups changelog entries by Conventional Commit **type**, not
> scope. Use `feat:` or `fix:` for user-visible changes and an optional single,
> reader-meaningful scope, for example `feat(scenario): share setup links`.
> Comma- or slash-separated text inside `(...)` is rendered as one literal scope;
> it does not create multiple groups. Use `docs:`, `chore:`, `test:`, `build:`, or
> `ci:` for changes that should stay out of default user-facing notes. If one
> squash commit must describe several independently notable changes, add multiple
> Conventional Commit messages at the bottom of the commit message rather than
> packing several scopes into one header.

Do not add a repository-specific scope taxonomy or custom `changelog-sections`
unless the generated notes demonstrate a real readability problem. The current
defaults already implement the desired user-facing/non-user-facing split.

Reserve `user` only as an application convention when the frontend consumes
`changelog.json` and filters on `scope === "user"`. Release Please does not
enforce that convention, and its Markdown changelog and GitHub release notes
will display the marker as `**user:**`. A `feat(user)` or `fix(user)` message
should be the actual release entry, not an added restatement of another visible
`feat` or `fix`. When one commit needs several frontend entries, make the primary
message one `user` entry and append the remaining `user` messages at the bottom.

If the product needs machine-readable release history, add this root file in the
setup change and make no Release Please configuration change:

```json
{
  "repository": "darwintree/PokeGauge",
  "entries": []
}
```

The Node strategy detects and updates that exact `changelog.json` path. Do not
also configure it through `extra-files`, and do not add a separate post-release
workflow or merge.

## Findings

### 1. Entries shown by default

Release Please's default notes builder passes parsed commits to
`conventional-changelog-conventionalcommits`; the current lock resolves that preset
to `6.1.0` ([dependency declaration](https://github.com/googleapis/release-please/blob/main/package.json#L68-L82),
[lockfile resolution](https://github.com/googleapis/release-please/blob/main/package-lock.json#L1667-L1676)).
That preset displays these ordinary commit types:

| Commit type | Default heading |
| --- | --- |
| `feat`, `feature` | Features |
| `fix` | Bug Fixes |
| `perf` | Performance Improvements |
| `revert` | Reverts |

It hides `docs`, `style`, `chore`, `refactor`, `test`, `build`, and `ci` by
default. Unknown ordinary types have no matching section and are discarded.
Breaking-change notes are displayed regardless of whether their commit type is
normally hidden
([preset defaults and transform](https://github.com/conventional-changelog/conventional-changelog/blob/conventional-changelog-conventionalcommits-v6.1.0/packages/conventional-changelog-conventionalcommits/writer-opts.js#L67-L96),
[default type table](https://github.com/conventional-changelog/conventional-changelog/blob/conventional-changelog-conventionalcommits-v6.1.0/packages/conventional-changelog-conventionalcommits/writer-opts.js#L161-L177)).

This is visibility, not release triggering: `feat` produces a minor bump, `fix`
produces a patch bump, and a breaking change produces a major bump under the
normal strategy ([Release Please README](https://github.com/googleapis/release-please#how-should-i-write-my-commits)).

### 2. Effect of `feat(scope): description`

The type controls the changelog section. The default writer groups on `type` and
sorts entries by `scope` then subject
([writer options](https://github.com/conventional-changelog/conventional-changelog/blob/conventional-changelog-conventionalcommits-v6.1.0/packages/conventional-changelog-conventionalcommits/writer-opts.js#L148-L158)).
The optional scope is rendered as a bold prefix before the subject, so
`feat(scenario): share setup links` becomes an entry equivalent to
`**scenario:** share setup links` under **Features**
([commit template](https://github.com/conventional-changelog/conventional-changelog/blob/conventional-changelog-conventionalcommits-v6.1.0/packages/conventional-changelog-conventionalcommits/templates/commit.hbs)).

Release Please passes the parsed `type`, `scope`, and bare description directly
to that writer
([default notes builder](https://github.com/googleapis/release-please/blob/main/src/changelog-notes/default.ts#L73-L108)).
Therefore scopes affect the visible label and ordering, but do not create their
own groups or alter the SemVer meaning of `feat`/`fix`.

### 3. Multiple scopes

Conventional Commits defines one optional scope slot and says the scope is a noun
describing a section of the codebase
([specification rules 1 and 4](https://www.conventionalcommits.org/en/v1.0.0/#specification)).
Release Please's reference parser grammar accepts any non-newline text other than
parentheses as that single scope
([parser grammar](https://github.com/conventional-commits/parser#the-grammar)).
Consequently, `feat(a,b): ...` and `feat(a/b): ...` parse successfully, but as
the single literal scopes `a,b` and `a/b`; neither delimiter is split or given
special semantics. With the default writer, `feat(a,b): description` therefore
renders under **Features** as an entry equivalent to
`* **a,b:** description (commit link)`. It does not produce `a` and `b` entries
or headings.

Release Please does support several independently parsed changes in one raw Git
commit: append additional Conventional Commit messages at the bottom of the
commit, and each message may carry its own type and scope
([official multiple-changes example](https://github.com/googleapis/release-please#what-if-my-pr-contains-multiple-fixes-or-features)).
That is the supported representation when one squash commit needs several
release-note entries.

### 3a. Proposed `user` scope convention

`feat(user): plain user-facing note` is parsed exactly as type `feat`, scope
`user`, and subject `plain user-facing note`. It appears under **Features** as
an entry equivalent to `**user:** plain user-facing note`; `fix(user): ...`
likewise appears under **Bug Fixes**. Release Please forwards scope unchanged to
the changelog writer, whose default grouping and visibility rules inspect type,
not scope
([Release Please notes builder](https://github.com/googleapis/release-please/blob/main/src/changelog-notes/default.ts#L59-L108),
[preset grouping and transform](https://github.com/conventional-changelog/conventional-changelog/blob/conventional-changelog-conventionalcommits-v6.1.0/packages/conventional-changelog-conventionalcommits/writer-opts.js#L67-L96)).
It therefore does not natively recognize, select, or suppress a `user` scope.

Additional bottom-of-message commits are additive. Release Please splits the
message, parses every part, and gives each parsed entry the original Git commit's
SHA
([parser implementation](https://github.com/googleapis/release-please/blob/main/src/commit.ts#L356-L433)).
Consequently, a primary `feat: implementation summary` plus
`feat(user): plain user-facing note` produces **two** Features entries; the same
is true for two `fix` messages. A primary `fix` plus an additional `feat(user)`
also makes the release a minor bump under the default versioning strategy,
because that strategy considers every parsed commit and chooses the largest
change type
([default versioning strategy](https://github.com/googleapis/release-please/blob/main/src/versioning-strategies/default.ts#L49-L99)).

Recommendation: use `user` as metadata only for a consumer such as the frontend
that reads `changelog.json`. Make the primary `feat(user)`/`fix(user)` subject
the release copy when there is one notable change. For several notable changes,
make the primary message one `user` entry and append only the remaining entries.
Do not append a second release-copy entry merely to restate an already visible
primary header.

### 4. Hiding and including commits

- Configure `changelog-sections` to map a commit type to a heading and set
  `hidden: true` or `false`; the schema defines `hidden` as “Skip displaying this
  type of commit” and defaults it to false
  ([configuration schema](https://github.com/googleapis/release-please/blob/main/schemas/config.json#L30-L50)).
- `exclude-paths` skips parsing a commit when all its files match excluded paths
  ([configuration schema](https://github.com/googleapis/release-please/blob/main/schemas/config.json#L233-L238)).
- `skip-changelog` disables changelog generation for the package, rather than
  hiding one commit
  ([configuration schema](https://github.com/googleapis/release-please/blob/main/schemas/config.json#L60-L63)).
- After a squash merge, a `BEGIN_COMMIT_OVERRIDE` / `END_COMMIT_OVERRIDE` block
  in the merged PR body replaces the commit message used for notes. This can
  correct, split, include, or effectively suppress an entry by changing it to a
  hidden type; it is not supported for plain merge commits
  ([official override documentation](https://github.com/googleapis/release-please#how-can-i-fix-release-notes)).

There is no documented per-commit “hide this entry” trailer. Prefer the default
hidden types for non-user-facing work; use an override only to correct an already
merged squash commit, and change `changelog-sections` only when the whole project
wants a different type policy.

### 5. Built-in Node `changelog.json` support

The current Node strategy has dedicated support for a machine-readable root
`changelog.json`: when commits and a package name are available and changelog
generation is enabled, it adds a `ChangelogJson` update for the literal root path.
The update has `createIfMissing: false`, so Release Please silently skips an absent
file rather than creating it
([Node strategy](https://github.com/googleapis/release-please/blob/65e8682a918647d7891fc013d9f570089837aece/src/strategies/node.ts#L76-L88)).
This is built into `release-type: node`; `extra-files` is neither required nor
desirable for this file.

The upstream Node fixture initializes the file as `{"repository":
"google-cloud-node", "entries": []}`
([Node fixture](https://github.com/googleapis/release-please/blob/65e8682a918647d7891fc013d9f570089837aece/test/fixtures/strategies/node/changelog.json)),
and the updater test uses the same two-field shape
([updater test](https://github.com/googleapis/release-please/blob/65e8682a918647d7891fc013d9f570089837aece/test/updaters/changelog-json.ts#L27-L42)).
For this repository, the canonical initial content is therefore the three-line
JSON shown in the recommendation. Strictly, the updater only parses the document
and calls `parsed.entries.unshift(...)`, so its operational requirement is a
valid JSON object with an `entries` array; `repository` is preserved metadata,
not a field the updater reads
([updater implementation](https://github.com/googleapis/release-please/blob/65e8682a918647d7891fc013d9f570089837aece/src/updaters/changelog-json.ts#L64-L115)).

### 6. Resulting content and `user` scope

Release Please does not publish a separate JSON Schema for this file; its current
source and snapshots define the de facto shape. Each release is prepended to
`entries` with `changes`, `version`, `language`, `artifactName`, `id`, and
`createTime`; the root receives `updateTime`. For this project, `language` is
`JAVASCRIPT` and `artifactName` is the package name `pokegauge`. Each change has
`type`, `sha`, `message`, and `issues`, plus optional `scope` and
`breakingChangeNote`
([types and serialization](https://github.com/googleapis/release-please/blob/65e8682a918647d7891fc013d9f570089837aece/src/updaters/changelog-json.ts#L24-L36),
[release object](https://github.com/googleapis/release-please/blob/65e8682a918647d7891fc013d9f570089837aece/src/updaters/changelog-json.ts#L86-L115)).
The generated shape is equivalent to:

```json
{
  "repository": "darwintree/PokeGauge",
  "entries": [
    {
      "changes": [
        {
          "type": "feat",
          "sha": "<full commit SHA>",
          "message": "plain user-facing note",
          "issues": ["<PR number>"],
          "scope": "user"
        }
      ],
      "version": "<next version>",
      "language": "JAVASCRIPT",
      "artifactName": "pokegauge",
      "id": "<UUID>",
      "createTime": "<ISO-8601 timestamp>"
    }
  ],
  "updateTime": "<same ISO-8601 timestamp>"
}
```

For `feat(user): plain user-facing note`, the prefix is removed from `message`
and `scope: "user"` is retained as its own property
([scope handling](https://github.com/googleapis/release-please/blob/65e8682a918647d7891fc013d9f570089837aece/src/updaters/changelog-json.ts#L64-L98)).
The Node strategy filters commits through the same changelog-section visibility
rules first: by default ordinary `feat`, `fix`, `perf`, and `revert` commits are
included, hidden types are excluded unless breaking, and scope does not affect
that decision
([commit filter](https://github.com/googleapis/release-please/blob/65e8682a918647d7891fc013d9f570089837aece/src/util/filter-commits.ts#L20-L61)).
Thus `user` survives in JSON, but the earlier recommendation still holds: it is
visible metadata, not a special release-copy selector.

### 7. When the file lands; no second release merge

The updated `changelog.json` is one of the files committed into the Release
Please release PR. It becomes part of `main` when that release PR is merged,
alongside `CHANGELOG.md`, `package.json`, and the manifest version. The configured
workflow then runs on that push to `main`; the action checks for the merged
release PR and creates the tag and GitHub Release before attempting to create or
update another release PR
([current action flow](https://github.com/googleapis/release-please-action/blob/0b6b3fc0186a2f7118bfd88fab9ea481e1839504/src/index.ts#L136-L151),
[release lifecycle](https://github.com/googleapis/release-please/blob/main/docs/cli.md#creating-releases)).

Consequently, there is no second merge after the release PR: that one merge both
lands the JSON entry and supplies the commit tagged by the ensuing GitHub
Release. The one-time setup change that adds the initially empty file must of
course reach `main` before Release Please can include it in a release PR; if that
setup itself is submitted as a PR, its merge and the later release-PR merge are
two ordinary, distinct merges—not an extra JSON-specific release cycle.

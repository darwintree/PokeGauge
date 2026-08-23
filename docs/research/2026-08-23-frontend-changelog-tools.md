# Frontend changelog tools for a private Vite app

Checked **2026-08-23** against primary documentation and upstream source. The
target is narrower than release notes: every user-visible PR adds plain content
for all four PokeGauge locales, that content is durable and frontend-readable as
soon as the feature merge reaches `main`, and there is no release/version PR,
runtime service, or API fetch.

## Ranked recommendation

1. **Use one typed TypeScript module per entry, loaded with Vite
   `import.meta.glob`.** This is the closest fit: the PR adds one durable source
   file, the same merge ships it, TypeScript can require
   `Record<SupportedLocale, string>`, and there is no dependency or generator.
   Vite officially supports eager glob imports and named/default imports, and
   turns them into ordinary imports at build time
   ([Vite glob imports](https://vite.dev/guide/features#glob-import)).
2. **Use one typed array** if concurrent edits are rare. It has the fewest moving
   parts, but every PR edits the same insertion point. Move to file-per-entry
   only when that conflict becomes real.
3. **FeatureDrop** is the only library found that is materially closer than a
   release tool. Its source of truth is an owned JSON/TypeScript manifest, its
   React changelog runs locally, and it supports headless rendering and local
   read-state storage. Adopt it only if unread state, dismissal, audience gates,
   expiry, tours, or related announcement behavior is also required. For plain
   localized history, it is broader than the need.
4. **Changie** is the closest changelog-authoring CLI, but still loses to native
   TypeScript. Its YAML fragments have useful custom fields, yet normal use
   batches them into a version file and then a Markdown changelog. Frontend
   consumption and locale validation would remain custom work.
5. **Towncrier** is a reasonable plain-fragment generator but has an unstructured
   text input/output contract and a Python toolchain.
6. **Beachball**, **News Fragments**, **Conventional Changelog / release-it /
   semantic-release**, and **Release Drafter** are release machinery, not closer
   frontend content stores.

The earlier evaluations of [Changesets](2026-08-23-changesets-user-changelog.md)
and [Release Please](2026-08-23-release-please-commit-rendering.md) reach the same
boundary: both can eventually produce durable changelog output, but their normal
source and merge lifecycle is release/version-oriented rather than “feature PR
content ships now.”

## Comparison

| Option | Durable source and merge timing | Structured/localized data | Frontend consumption | Added machinery | Fit |
| --- | --- | --- | --- | --- | --- |
| Typed per-entry `.ts` + `import.meta.glob` | Entry files remain in Git and ship in the feature merge | Exact app-owned type; `Record<SupportedLocale, string>` gives locale completeness | Native build-time module import; sort the imported entries in app code | None beyond existing TypeScript/Vite | **Best** |
| One typed array | Array remains in Git and ships in the feature merge | Same exact typing | Ordinary import | None | **Best until merge conflicts matter** |
| FeatureDrop | Owned manifest remains in Git and ships in the feature merge | Typed product manifest, but its documented content fields are strings; PokeGauge must still model or resolve four locales | Purpose-built React widget or headless hooks; no service required | One runtime library and provider/storage concepts; upstream advertises zero runtime dependencies | **Only adopt for announcement behavior** |
| Changie | PR commits YAML fragments. Normal `batch <version>` creates a version file; `merge` folds it into the main changelog. Batch deletes fragments by default, with flags to keep or move them | YAML has body, component, kind, time, and arbitrary string custom fields. Four locales can be encoded, but Changie does not provide PokeGauge locale types | Generated Markdown is not a typed frontend contract; direct YAML use needs parsing/conversion | Language-agnostic Go CLI/action, YAML config, templates, batch/merge lifecycle | **Closest authoring CLI; still too much** |
| Towncrier | PR commits text fragments; a production build appends them to the news file and removes them with `git rm`. Running that inside the feature PR can avoid an extra PR, but adds a per-PR generation step | Filename gives category/issue; body is text. Custom fragment types/templates do not create a typed locale map | App must parse generated Markdown/text or import raw fragments with its own convention | Python CLI and TOML/template config; no runtime JS dependency | **Poor locale/data fit** |
| Beachball | PR commits JSON change files. `bump` generates changelogs and bumps versions locally; fragments are deleted unless kept. Standard CI adds a later publish/push step | Default file has comment, SemVer type, package, email; prompts can add custom fields. Can generate `CHANGELOG.json`, but version/package semantics dominate | JSON is consumable after a bump artifact is committed, not merely when the feature fragment merges | Node dev dependency, config, remote comparison, bump/publish workflow | **Release tool** |
| News Fragments | PR commits timestamped text fragments; `burn <version>` writes `CHANGELOG.md` and deletes them | Type comes from filename extension; body is plain text; no first-class locale object | Generated Markdown needs parsing; fragments could be imported raw only with app-owned conventions | Node CLI, Handlebars templates, and release-it plugin workflow | **JS Towncrier, but less structured** |
| Conventional Changelog | No fragment store; reads commit history since tags and writes Markdown | Conventional commit fields, not four localized bodies | Parse generated Markdown or build a custom JS pipeline | CLI/API plus a preset; relies on Git metadata/tags | **Wrong source contract** |
| release-it | Changelog is generated around version selection, commit, tag, push, and optional host release | Defaults to Git log; plugins generate textual release notes | A tracked artifact requires release-time file generation/commit | Release CLI, configuration/plugins, Git lifecycle | **Release tool** |
| semantic-release | CI analyzes merged commits, determines a version, generates notes, and tags/publishes. A tracked changelog requires `@semantic-release/changelog` plus a later bot commit via `@semantic-release/git` | Commit-derived textual notes; custom structured locale content is app-owned | Release artifact or post-merge commit, not content in the feature merge | CI credentials plus core and optional changelog/git plugins | **Directly violates timing** |
| Release Drafter | Merged PRs update a draft GitHub Release outside the checkout | PR title/body, labels, paths, templates; textual release body | Frontend would need GitHub API/runtime fetch or a separate copy/generation step | GitHub Action, permissions, release-draft state | **External release store** |

## Evidence and implications

### Native Vite baseline

Vite's glob arguments must be literal, can eagerly import every matching module,
and can select a default or named export
([official feature reference](https://vite.dev/guide/features#glob-import)). A
file-per-entry layout therefore gives the useful part of fragment tools—parallel
PRs add separate files—without a generator. Each file can export an object using
the repository's existing `SupportedLocale` union, so adding a fifth supported
locale creates a compile error in every incomplete entry instead of a runtime
content gap.

A single array is even smaller. The glob layout is justified only by actual
parallel-entry conflicts or a desire for one-file-per-PR review ownership; it is
not needed for scale or performance.

### FeatureDrop

FeatureDrop describes itself as a local library whose source of truth is a JSON
or TypeScript manifest, followed by a React provider and components
([official introduction](https://featuredrop.dev/docs/)). Its documented flow
passes that manifest and a storage adapter to the provider; the provider exposes
new/read/dismiss behavior, and the changelog supports a render-prop path for
custom UI
([architecture](https://featuredrop.dev/docs/concepts/architecture/)). The
project advertises no vendor account, no database, and zero runtime dependencies
([upstream README](https://github.com/glincker/featuredrop#readme)).

That genuinely meets the persistence and same-merge constraints. It is not an
authoring workflow for localized changelog fragments, however. PokeGauge would
still own the locale record or create one manifest per resolved locale, and its
existing shadcn/HUD surface would likely use the headless hooks rather than the
library's generic widget. Installing it solely to render an array replaces a few
local lines with a provider, storage adapter, and a much broader feature schema.

### Changie and Towncrier

Changie commits plain YAML fragments and supports component/kind plus arbitrary
custom string choices
([configuration and `Change` shape](https://changie.dev/config/)). Its official
quick start is explicitly `new` → `batch <version>` → `merge`
([quick start](https://changie.dev/guide/quick_start/)). The upstream batch
implementation says `--keep` preserves fragments; otherwise it clears them, by
deleting or optionally moving each source file
([batch source](https://github.com/miniscruff/changie/blob/main/cmd/batch.go#L1502-L1511),
[clear logic](https://github.com/miniscruff/changie/blob/main/cmd/batch.go#L2129-L2201)).
The YAML custom map could hold locale keys, but a typed frontend still needs a
YAML parser/converter and app-owned validation. Keeping the fragments merely to
import them bypasses the part Changie is for.

Towncrier deliberately accepts small text news fragments and custom fragment
types, and can be used for non-Python projects even though its CLI requires
Python
([official overview](https://towncrier.readthedocs.io/en/stable/)). A production
build removes fragments with `git rm` and appends them to Markdown or rst
([tutorial](https://towncrier.readthedocs.io/en/stable/tutorial.html#producing-news-files-in-production)).
It can avoid a second merge only if its generated news file is built and
committed in every feature PR. That still produces text, not locale-complete
frontend data.

### Beachball and News Fragments

Beachball's PR files are JSON and reviewable, but their documented default shape
is package name, SemVer change type, comment, and email; they are consumed to
decide package bumps and changelog content
([change files](https://microsoft.github.io/beachball/concepts/change-files)).
`beachball bump` both changes versions and generates changelogs, deleting change
files unless `--keep-change-files` is passed
([bump command](https://microsoft.github.io/beachball/cli/bump.html)). It can
generate `CHANGELOG.json` and add prompt fields, but these remain parts of its
package-version workflow
([configuration](https://microsoft.github.io/beachball/overview/configuration.html)).

News Fragments is the genuinely closer Node analogue to Towncrier found in the
search. Contributors commit typed-by-extension text files, then `burn <version>`
renders Handlebars Markdown and deletes the sources; its main integration is a
release-it plugin
([upstream README](https://github.com/gbtech-oss/news-fragments#readme)). It has
no structured locale contract and gives the frontend no advantage over native
TypeScript modules.

### Commit/release-derived tools

Conventional Changelog generates from Git metadata and recommends commit
conventions; its standard CLI writes Markdown based on commits since a SemVer
tag
([package README](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog/README.md)).
release-it wraps changelog generation in a workflow that normally commits, tags,
and pushes a release
([Git plugin lifecycle](https://github.com/release-it/release-it/blob/main/docs/git.md),
[release-it changelog behavior](https://github.com/release-it/release-it#changelog)).
Neither stores reviewed four-locale content in the feature PR.

semantic-release is explicitly a post-merge CI workflow that determines the
next version, generates notes, creates a tag, and publishes
([official lifecycle](https://github.com/semantic-release/semantic-release#how-does-it-work)).
Its changelog plugin only updates a local file; persisting that file requires the
Git plugin to push a release commit, which upstream itself recommends avoiding
when possible
([changelog plugin](https://github.com/semantic-release/changelog#readme),
[Git plugin](https://github.com/semantic-release/git#readme)).

Release Drafter updates a draft GitHub Release after pushes to `main` and builds
text from PR fields, labels, paths, and templates
([official README](https://github.com/release-drafter/release-drafter#readme)).
Because the durable draft is GitHub release state rather than a file in the Vite
checkout, using it in-app requires exactly the runtime API or extra materializing
step this requirement excludes.

## Decision boundary

Choose **typed per-entry modules** if avoiding concurrent edit conflicts matters;
otherwise start with **one typed array**. Reconsider FeatureDrop only when the
product also asks for read-state, expiry, audience targeting, reactions, or
other announcement orchestration. Reconsider a fragment/release tool only when
PokeGauge starts batching versioned releases for another reason.

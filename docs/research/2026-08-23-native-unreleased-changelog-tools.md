# Native support for unreleased user changelogs

Checked **2026-08-23** against official documentation and upstream source. Here,
“supports unreleased” means a user-facing entry is available after its feature PR
reaches `main`, before any version/tag/release operation.

## Result

**Changesets, Changie, and Towncrier natively retain unreleased fragments in the
repository.** Release Please does not put its generated pending changelog on
`main`; it maintains it in a Release PR. FeatureDrop is not a versioning tool,
but its checked-in manifest is directly usable by the frontend and has no
released/unreleased transition unless the application defines one.

For PokeGauge, the closest versioned option is **Changesets plus a build-time
`changeset status --output` step**. The simplest option remains an app-owned
TypeScript/JSON entry: it ships in the feature merge, has exact locale typing,
and can later be grouped under versions without changing its authoring format.

## Comparison

| Tool | Unreleased source on `main` | Machine-readable before release | Frontend/build use | What happens at release | Localization | Main side effects |
| --- | --- | --- | --- | --- | --- | --- |
| **Changesets** | Yes: one Markdown file with YAML front matter per change under `.changeset/` | **Yes:** `changeset status --output=file.json` writes JSON explicitly for other tools | Run `status` before Vite and import the generated JSON; raw fragments otherwise require front-matter parsing | `changeset version` consumes the fragments, bumps versions, and writes changelogs; the normal GitHub action uses a version PR | No first-class locale fields; summary is one Markdown body | Adds package/SemVer concepts and a generated JSON build step; release still normally adds a version PR |
| **Changie** | Yes: YAML fragments under the configured `changesDir/unreleasedDir` | Source is structured YAML; no documented JSON status output | Frontend needs YAML parsing/conversion. `changie batch --dry-run` can render pending notes without writing or deleting files | `batch <version>` combines all unreleased entries into a version file and normally deletes fragments; `--keep` retains them, `--move-dir` archives them; `merge` updates the main changelog | No locale model, but arbitrary custom string fields can hold locale values | Adds a Go/Node CLI, YAML config/templates, and batch/merge lifecycle |
| **Towncrier** | Yes: small text files whose filename encodes issue/id and type | Partly: files are plain UTF-8 text, but there is no structured JSON model | Raw fragments can be imported by an app-owned convention; `towncrier build --draft` renders all pending fragments to stdout without writes | Production `build` appends to Markdown/rst and removes fragments with `git rm` by default; `--keep` preserves them | No first-class locale model; multiple locale trees/templates would be custom | Adds Python/TOML tooling; output is prose, and normal release consumes fragments |
| **Release Please** | **No generated file on `main`.** Pending notes and version-file changes live in the maintained Release PR branch/body | Commit history is the input; the pending PR body is formatted, load-bearing GitHub state rather than an app artifact | A production build from `main` cannot import the pending generated notes without GitHub API access or rerunning Release Please/custom extraction | Merging the Release PR lands the changelog/version files, then Release Please creates a tag and GitHub Release | No first-class locale model | Requires GitHub Release PR state and an extra merge before generated notes reach app source |
| **FeatureDrop** | Yes: an owned JSON or TypeScript manifest, but entries are product announcements rather than release fragments | **Yes:** the manifest is already frontend data | Direct React provider/components or custom rendering; imported manifest is bundled normally | No native versioning/consumption step; entries remain until edited/removed and can expire via `showNewUntil` | Docs advertise localization/RTL, but the documented feature content fields are scalar strings; PokeGauge still owns its four-locale content contract | Runtime library/provider/storage concepts; useful only if unread state, dismissal, expiry, reactions, or tours are wanted |

## Evidence

### Changesets

A changeset is a Markdown file containing a summary plus YAML front matter for
package names and bump types. The intended loop is: add fragments with changes,
then run `version`, which consumes them, updates versions, and writes changelogs
([official workflow](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)).
The CLI documents `status --output` as writing a JSON object “for consumption by
other tools,” and warns to run it before `version` or `publish`
([official CLI reference](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#status)).

Therefore Changesets does natively preserve pending entries and has the cleanest
official machine-readable seam of the release-oriented choices. The JSON file is
generated, not tracked automatically; a PokeGauge build would need to run the
command before Vite. After `version`, the fragments no longer represent pending
entries, so the frontend also needs the generated released changelog/history if
it must show both states.

### Changie

Changie's config explicitly defines a directory for unreleased files, and each
YAML `Change` can contain body, component, kind, timestamp, project, and arbitrary
custom string fields
([official configuration](https://changie.dev/config/)). Its normal flow is
`changie new` → `changie batch <version>` → `changie merge`
([official quick start](https://changie.dev/guide/quick_start/)).

`batch` merges all pending fragments into one version changelog. Its official
flags include `--dry-run` (print without writing or deleting), `--keep` (do not
delete fragments), and `--move-dir` (move them)
([official batch reference](https://changie.dev/cli/changie_batch/)). This is
strong native unreleased support, but the frontend seam is YAML or rendered
Markdown rather than JSON/TypeScript.

### Towncrier

Towncrier keeps categorized text fragments in a configured directory; the
filename carries an identifier and type. `towncrier build --draft` renders all
fragments to stdout and performs no writes
([official tutorial](https://towncrier.readthedocs.io/en/stable/tutorial.html#creating-news-fragments)).
The normal build removes processed fragments, while `--keep` disables deletion
([official CLI reference](https://towncrier.readthedocs.io/en/stable/cli.html#towncrier-build)).

This meets “unreleased exists on `main`,” but its model is intentionally plain
text. It is a poor match for compile-time enforcement of PokeGauge's four locales.

### Release Please

Release Please maintains a Release PR and updates it as more commits land. Only
when that PR is merged does it update the repository changelog/version files,
tag the commit, and create a GitHub Release
([official README](https://github.com/googleapis/release-please#whats-a-release-pr)).
Its design states that the Release PR body contains the changelog notes and is
load-bearing state
([official design](https://github.com/googleapis/release-please/blob/main/docs/design.md#release-pull-request)).

Thus it exposes pending notes to maintainers on GitHub, but not natively to a Vite
application built from `main`. Solving that would require an API/build extractor
or merging the release PR, which is the timing problem under discussion.

### FeatureDrop

FeatureDrop's source of truth is an owned JSON or TypeScript manifest passed to a
React provider; its changelog component reads that manifest and tracks seen/read
state ([official introduction](https://featuredrop.dev/docs/),
[upstream README](https://github.com/glincker/featuredrop#readme)). The changelog
surfaces add unread count, dismissal, reactions, filtering, and custom rendering
([official changelog docs](https://featuredrop.dev/docs/components/changelog/)).

It solves frontend display directly, not release bookkeeping. Installing it just
to render a localized list is broader than required; it becomes justified when
PokeGauge also needs user-specific announcement state or targeting behavior.

## Recommendation

1. If versioned package/release management is genuinely required, choose
   **Changesets** and generate pending JSON with `changeset status` before the
   frontend build. Keep released history separately after `version` consumes the
   fragments.
2. If the goal is only “show users what changed, including what is not yet
   released,” keep one app-owned typed entry format and add an optional `version`
   later. This is the only option here with native four-locale compile-time
   completeness and no conversion/release side effects.
3. Choose **FeatureDrop** only when unread/dismiss/expiry/tour behavior is also a
   product requirement. Changie and Towncrier are valid fragment stores but add
   parsers and release ceremony without improving the frontend contract.

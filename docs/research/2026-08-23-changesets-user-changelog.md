# Changesets for a frontend user changelog

Checked **2026-08-23** against the official Changesets v3.0.1 documentation and
the Changesets GitHub Action v2 documentation/source. Research only; no release
or application code was changed.

## Recommendation

Use a **repo-native typed changelog array**, committed in the same PR as the
user-visible change. Do not adopt Changesets solely to feed the PokeGauge UI.

Changesets can support a private app and a changelog-only workflow, but it brings
package-version semantics, disposable Markdown fragments, a generator, and a
separate version PR. Its supported custom changelog API receives no structured
scope or locale fields and returns Markdown strings. A typed array can instead
express the product's scope and `SupportedLocale` messages directly, be checked
by TypeScript, and reach `main` with the feature's existing merge.

Reconsider Changesets if this repository later needs release batching, SemVer
version planning, tags, or package publishing in addition to the frontend
history.

## Verified lifecycle

1. A contributor commits `.changeset/<id>.md` beside a change. The YAML
   frontmatter maps package names to `major | minor | patch`; the Markdown body
   is one summary destined for the changelog
   ([getting started](https://changesets.dev/guide/getting-started#what-is-a-changeset)).
2. `changeset add` creates the fragment; it does **not** update `CHANGELOG.md`.
   `changeset version` later updates package versions and changelogs
   ([versioning guide](https://changesets.dev/guide/versioning-and-publishing#versioning)).
3. `changeset version` removes the consumed fragment files so each is used only
   once. The official FAQ explicitly warns against storing other persistent data
   in `.changeset/`
   ([FAQ](https://changesets.dev/faq#are-changesets-removed)).
4. Publishing is a separate, optional command. The official automation guide
   explicitly supports a **version-only** workflow for users who do not publish
   packages or only manage changelogs
   ([version-only workflow](https://changesets.dev/guide/automating#version-only)).

PokeGauge is a single private package with a version
([package.json](../../package.json)). Changesets supports that shape, but private
packages are not versioned by default: `privatePackages.version` must be enabled,
and `changeset version` then changes the private app's package version
([Beyond npm](https://changesets.dev/guide/beyond-npm),
[configuration](https://changesets.dev/guide/config#privatepackages)).

## GitHub Action and merge count

On pushes to the base branch, the version action runs the versioning command,
commits its output, and **creates or updates a pull request** containing the
version/changelog changes
([action/version README](https://github.com/changesets/action/blob/main/version/README.md#changesetsactionversion)).
The earlier v1 workflow states the accumulation behavior explicitly: new
changesets on the base branch update the open version PR, which maintainers merge
when ready
([action v1 README](https://github.com/changesets/action/blob/maintenance/v1/README.md#changesets-release-action)).

Therefore the standard flow does **not** avoid an extra merge:

1. merge the feature PR containing its fragment;
2. the Action creates/updates the version PR, where `CHANGELOG.md` is produced
   and fragments are deleted;
3. merge that version PR before the generated changelog reaches `main` and the
   frontend build.

This is intentional release batching, not a defect. Running `changeset version`
inside every feature PR could collapse the two merges, but it consumes all
pending fragments there and abandons the Action's accumulating version-PR model.

## Can custom output preserve scope and locales?

Not as first-class Changesets data. The supported custom changelog hook exposes
`id`, a single Markdown `summary`, package/bump `releases`, and optional commit;
`getReleaseLine` and `getDependencyReleaseLine` must return strings
([custom generator API](https://changesets.dev/guide/customize-changelog-format#writing-a-custom-changelog-generator)).
There is no documented `scope` field, locale map, arbitrary metadata field, or
typed frontend-output contract. The frontmatter's documented role is only
package names and bump types
([FAQ](https://changesets.dev/faq#what-is-a-changeset)).

A repository could encode scope/locales inside the Markdown summary and parse
that convention, but structure and validation would be repository-owned and the
generator would still flatten it to a string for `CHANGELOG.md`. A custom
version script could read fragments first, emit a `.ts`/JSON artifact, then call
`changeset version`; the Action officially allows extra version-script logic and
includes its file changes in the version PR
([action input](https://github.com/changesets/action/blob/main/README.md#api)).
That is a custom build pipeline around Changesets, still subject to fragment
deletion and the second merge, rather than a capability of its changelog API.

## Comparison

| Need | Changesets | Repo-native typed array |
| --- | --- | --- |
| Frontend-ready after feature merge | No in the standard Action flow; waits for version PR merge | Yes |
| Persistent source of history | Generated `CHANGELOG.md`; fragments are deleted | The array itself |
| Structured product scope | Must be encoded/parsing convention | Literal union/type |
| Four localized messages | Must be packed into one Markdown summary or custom side pipeline | `Record<SupportedLocale, string>` (or equivalent) |
| Compile-time locale completeness | Not provided by Changesets | Reuses the existing `SupportedLocale` boundary |
| Package version/release batching | Built in | Deliberately absent |
| Added machinery | CLI, config, fragment convention, Action/version PR, optional generator | One data module and its consuming UI |

The typed array is the smaller source of truth for this exact product need. It
also aligns with the repository's existing locale type and canonical locale set
([locales.ts](../../src/lib/i18n/locales.ts)) instead of maintaining a second,
loosely parsed content schema.

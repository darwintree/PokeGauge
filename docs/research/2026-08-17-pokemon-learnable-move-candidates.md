# Pokémon-aware Move candidate data: size, loading, and source choice

Checked **2026-08-17**. Research only; no product code or contract was changed.

> Product follow-up, 2026-08-17: implementation selected the all-version union
> described below, not the Champions-only recommendation. This means "learnable"
> is "learnable in at least one PokeAPI version group."

## Recommendation

Generate one pinned, local **Champions-ruleset** `pokemonId -> moveId[]` index from
PokeAPI's `pokemon_moves.csv`, export it from the existing dynamically imported
Move resource module, and intersect it with the existing Snapshot-capable Move
options when building the attacker's picker candidates. The Move data is required
by the same catalog load, so co-locating both payloads avoids another request.

Do not fetch `/pokemon/{id}` at runtime, add Pokémon Showdown as a client
dependency, embed learnsets in `generated/pokemon.ts`, or create one chunk per
Pokémon. The compact current index is only about **9 KB gzip / 7.4 KB Brotli** after
intersecting the current Snapshot-capable policy; a single `Set` membership pass
over the current 319 Physical options measured **0.0022 ms median** locally.

Before implementation, update the vendored PokeAPI snapshot and amend the Move
Pick contract. The repository is pinned to `6629d150` (2026-07-03), before
PokeAPI's [Regulation M-B learnset commit `227b573`](https://github.com/PokeAPI/pokeapi/commit/227b573712414a86ba299d322fa398fbb2893edc).
For example, the pinned CSV has no Champions rows for Mega Blaziken, while the
current REST response has 78.

There is one required product choice: "learnable" must name a ruleset. This
recommendation uses **Champions** because the Move defaults, usage ordering, SP
model, and adjacent product contracts are already Champions-specific. If the
Pokémon picker intentionally remains the full PokeAPI catalog, an empty/unavailable
state is required for identities outside that ruleset; silently falling back to a
different game's learnset would mix legality systems.

## Current flow and compatibility boundary

- `scripts/generate-pokeapi-resources.ts:10` already reads the pinned local PokeAPI
  CSV tree and emits generated resource modules. It currently does not read
  `pokemon_moves.csv`.
- `src/lib/resources/access.ts:67-78` dynamically imports the 937-Move resource
  module and caches it.
- `src/lib/catalog/resource-options.ts:122-184` reduces those resources to the
  531 currently Snapshot-capable damaging templates (319 Physical, 212 Special).
- `src/lib/catalog/registry.ts:59-93` creates `catalog.moves` from that global pool;
  `src/features/scenario-explorer/tracks/move/move-picker-dialog.tsx:89-100`
  only searches and type-filters the options it receives.
- Champions ranking already intersects usage rows with the supplied options
  (`src/lib/catalog/champions-defaults.ts:74-91`), so it needs no second ranking
  implementation.

The existing contract explicitly made learnset validation a non-goal
(`docs/spec/changes/2026-07-21-default-move-selection.md:36-40`), and the earlier
discussion reserved a ruleset-aware candidate pool for separate work
(`docs/traces/discussion/2026-07-17-battle-modifier-integration.md:157-165,195`).
This request therefore changes product semantics, not merely list rendering.

Also, `catalog.moves` is the canonical lookup used to create snapshots and restore
stored/shared state (`src/lib/scenario/state.ts:49`,
`src/lib/scenario/persistence/scenario-storage.ts:381`, and
`src/lib/scenario/share.ts:602`). Replacing it with only legal candidates would
make previously saved attacker/move combinations unloadable. For the literal
request—**show** only learnable moves—keep the full lookup and expose a separate
picker candidate list (or learnable-ID set). Only filter the canonical lookup if
the revised contract explicitly says illegal historical snapshots must fail.

## Data semantics

PokeAPI documents `Pokemon.moves[].version_group_details` as the versions,
methods, and levels in which that Pokémon can learn each move, and documents
version groups as collections of closely related game versions
([official Pokémon and Version Group schemas](https://pokeapi.co/docs/v2)). The
bulk database expresses the same relation in:

- `PokeAPI/pokeapi/data/v2/csv/pokemon_moves.csv` —
  `pokemon_id,version_group_id,move_id,pokemon_move_method_id,...`
- `PokeAPI/pokeapi/data/v2/csv/version_groups.csv` — `32,champions,9,32`
- `PokeAPI/pokeapi/data/v2/csv/pokemon_move_methods.csv` — `12,train`

In the pinned snapshot, Champions (`version_group_id = 32`) has **17,394 unique
Pokémon/Move pairs**, **281 Pokémon identities**, and **490 Moves**; every row uses
method 12 (`train`). PokeAPI IDs already match `BattlePokemonId` and
`UpstreamResourceId`, avoiding localized-name or Showdown-slug joins.

The current snapshot is stale and must not be shipped as the final legality
freeze. The already-fetched local `origin/master` is
[`c0a9bc75`](https://github.com/PokeAPI/pokeapi/commit/c0a9bc75af3a455cdfa27dde21e4ec95aedd3f25),
27 commits ahead of the checked-out pin. It contains **19,810** Champions pairs,
**319** Pokémon identities, and **496** Moves. Upstream added the 2,416 missing
CSV rows for Regulation M-B on 2026-07-21 in
[`227b573`](https://github.com/PokeAPI/pokeapi/commit/227b573712414a86ba299d322fa398fbb2893edc),
after the repository's pin. Pin a reviewed newer commit, regenerate, and record
the chosen regulation/version in generated diagnostics.

## Measurements

Build figures use the checked-in generated files. Relation figures use the pinned
CSV or the already-fetched `origin/master` where labeled. Transfer estimates
serialize a compact numeric `Record<pokemonId, moveId[]>`; gzip uses level 9 and
Brotli quality 11. They are estimates until the proposed module is built by Vite.

| Payload | Raw | Gzip | Brotli | Notes |
| --- | ---: | ---: | ---: | --- |
| Existing main JS | 1,428,833 B | 330,485 B | — | Current `pnpm build` |
| Existing Move chunk | 298,416 B | 53,216 B | — | Loaded by Move resource access |
| Existing Ability chunk | 53,477 B | 15,342 B | — | Current comparison point |
| Full pinned Champions relation | 69,046 B | 15,044 B | 10,307 B | 17,394 pairs; includes Status and unsupported Moves |
| Pinned Snapshot-capable intersection | 41,429 B | 8,034 B | 6,670 B | 10,323 pairs, 280 Pokémon, 294 Moves |
| Full current (`c0a9bc75`) relation | 78,644 B | 17,167 B | 11,388 B | 19,810 pairs, 319 Pokémon, 496 Moves |
| Current Snapshot-capable intersection | 47,520 B | 9,016 B | 7,386 B | 11,838 pairs, 318 Pokémon, 298 Moves |
| Pinned Physical/Special relation, policy filtered at runtime | 45,006 B | 8,647 B | 7,267 B | Best separation of source data from support policy |
| Current Physical/Special relation, policy filtered at runtime | 51,652 B | 10,113 B | 8,075 B | 12,915 pairs, 318 Pokémon; recommended payload |
| All-version Snapshot-capable union | 216,029 B | 41,800 B | 32,917 B | Broad historical semantics, not Champions legality |
| Current Showdown Champions `learnsets.ts` | 313,506 B | 25,207 B | 18,228 B | 232 blocks, 14,192 slug relations before ID joining |

The recommended generated relation is the **Physical/Special** row, not the
tighter Snapshot-capable row: generation can discard Status moves using PokeAPI's
own damage class, while the existing runtime policy remains the single authority
for reviewed variable-power and explicitly unsupported mechanics. The extra
~0.6 KB gzip on the pin avoids duplicating that policy inside the generator;
the current-regulation result should remain around 10 KB gzip and must be measured
from the actual generated Vite chunk.

For Garchomp, the pinned Champions relation has 58 moves; the current product
policy leaves 31 Physical and 12 Special candidates. Filtering all 319 Physical
options through a 58-ID `Set`, after warm-up in Node 25.8.1, took **0.0022 ms
median / 0.0047 ms p95** across 25 batches of 10,000 passes. Network and parsing,
not membership filtering, dominate this feature.

### Coverage warning

The generated Pokémon selector currently exposes **1,287** identities. Only
**273 (21.2%)** have a Champions relation in the stale pin; **1,014** do not.
One relation ID (`10326`) is absent from the stale generated Pokémon table, and
Ditto is the only pinned Champions identity with no Snapshot-capable damaging
move. A strict Champions candidate filter therefore needs a deliberate empty
state and should ideally align the Pokémon selector with the same regulation.

## Alternatives

### Live PokeAPI `/pokemon/{id}`

The REST shape is correct, but it returns every Pokémon field plus every historical
version detail and then requires client-side Champions filtering. Observed
compressed/raw response sizes were:

| Pokémon | Transfer | Raw JSON | Gzip recompression | Champions moves |
| --- | ---: | ---: | ---: | ---: |
| Bulbasaur | 6,951 B | 271,521 B | 6,804 B | 0 |
| Pikachu | 7,704 B | 290,335 B | 7,569 B | 60 |
| Garchomp | 5,734 B | 214,429 B | 5,701 B | 58 |
| Mega Blaziken | 3,552 B | 101,082 B | 3,536 B | 78 |

These one-off requests took roughly 0.41-0.45 s after connection setup in this
environment. Per-Pokémon transfer is close to the entire generated index, while
runtime fetching adds latency, offline/CORS/failure states, repeat requests, and
unversioned upstream drift. Reject.

### Existing Champions Battle Data index

The already-used [Champions Battle Data index](https://championsbattledata.com/api)
exposes `learnableMoveNames[]` according to
`docs/research/2026-07-03-champions-move-usage-join-keys.md:20-35`, so reusing it
would not introduce a new service. It is nevertheless a poor loading boundary:
the live `/api` measurement was **3,171,742 B raw / 291,477 B gzip / 287,088 B
transferred** for 236 records and 14,528 learnable names; the Garchomp endpoint
was **430,442 B raw / 12,474 B gzip / 10,793 B transferred** and took about
0.615 s. It also requires English-name joins and inherits the existing unofficial,
online failure mode. Keep it for usage ordering, not candidate eligibility.

### Pokémon Showdown data

Showdown has a dedicated current
[`data/mods/champions/learnsets.ts`](https://github.com/smogon/pokemon-showdown/blob/master/data/mods/champions/learnsets.ts)
and its client explicitly creates a separate Champions learnset table
([first-party build script](https://github.com/smogon/pokemon-showdown-client/blob/master/build-tools/build-indexes)).
It is a useful cross-check and can be fresher, but the raw source is larger and
uses Showdown species/move slugs plus mod inheritance. This repository already
chose PokeAPI numeric identities as its resource boundary; adding a second join
and inheritance engine is more code for no runtime-size win after preprocessing.
Use Showdown only as a generation-time audit unless PokeAPI coverage proves wrong.

### Separate/per-Pokémon chunks or learnsets embedded in Pokémon records

Per-Pokémon chunks reduce bytes for one attacker but create hundreds of files and
request/cache overhead. Embedding arrays in `generated/pokemon.ts` is worse here:
the build already warns that this module's dynamic import is ineffective because
other code statically imports it, so learnsets would inflate the main chunk.
A single separate learnset chunk would be viable at about 10 KB gzip, but every
current catalog load also needs the Move resource chunk. Exporting the index from
that existing module has the same transfer bytes without another request or load
state. Split it only if the app later gains routes that need Move metadata without
candidate legality.

## Minimal implementation shape

1. Amend `docs/spec/move-pick.md` to name the Champions regulation/version,
   define missing-learnset behavior, Mega/form identity behavior, and whether old
   persisted illegal snapshots remain loadable.
2. Update and pin the local PokeAPI checkout at a reviewed commit containing the
   current regulation.
3. Extend `scripts/generate-pokeapi-resources.ts` to read `pokemon_moves.csv`,
   retain version group 32 plus Physical/Special Moves, deduplicate/sort numeric
   IDs, and emit the compact index beside `GENERATED_MOVES` with provenance
   diagnostics.
4. Reuse the existing Move resource dynamic import and cache; convert only the
   active attacker's small array to a `Set`.
5. Keep `catalog.moves` as the full canonical lookup for compatibility and pass
   only the intersection to the Move picker. If strict legality is approved,
   deliberately update share/storage validation and migration behavior instead.
6. Verify the generated map against invariants (known base/form/Mega rows, every
   emitted Move exists, no duplicates, expected ruleset/method IDs), add one picker
   integration check, and record production chunk sizes from `pnpm build`.

This is a small local-data change once the semantic decision is explicit; the
costly designs—live requests, a legality engine dependency, sharding, or custom
binary encoding—do not earn their complexity at an approximately 10 KB compressed
payload.

# PokeAPI held-item sprite coverage

Checked **2026-07-31** against the live PokeAPI Item endpoint, PokeAPI repository
commit [`dbef1b8570119d49b06943bc8ba6f0288d5872d5`](https://github.com/PokeAPI/pokeapi/tree/dbef1b8570119d49b06943bc8ba6f0288d5872d5),
and PokeAPI sprites repository commit
[`8dfa3d97e953caaafaafd4963eff7621811af08e`](https://github.com/PokeAPI/sprites/tree/8dfa3d97e953caaafaafd4963eff7621811af08e).
This note audits asset coverage for the researched 88-item candidate inventory
and the later frozen 85-item scope; it is not legal advice.

## Result

- All **88/88** researched candidates have a PokeAPI Item record.
- **80/85** current-scope Item records expose a non-null `sprites.default`;
  every one of those 80 URLs returned HTTP 200, non-empty `image/png` content
  during the audit.
- The remaining **5/85** current-scope items have PNGs in generation-specific
  directories in the same official sprites repository even though their API
  `sprites.default` is null: Utility Umbrella under `gen8/`, plus Fairy Feather
  and the three Ogerpon masks under `gen9/`.
- The PokeAPI sprites repository therefore covers **85/85** current-scope items.
  Adamant Crystal, Lustrous Globe, and Griseous Core were removed from the
  product scope after the audit; those excluded candidates have no matching PNG
  anywhere in the repository's complete, non-truncated Item subtree.
- All **21** Serebii-sourced item sprites currently vendored under
  `public/items/` have a PokeAPI replacement. Fairy Feather is generation-
  specific rather than an API default.
- Showdown `leek` maps to PokeAPI Item **236**, whose API name is still `stick`.
  Its sprite is present as
  [`sprites/items/stick.png`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/sprites/items/stick.png).
- This is not a name-matching failure. PokeAPI builds Item records from its CSV
  data independently of image coverage. Its Item builder checks only the flat
  `sprites/items/<name>.png` path; it neither searches nor exposes the `gen8/`
  and `gen9/` Item directories. It therefore deliberately emits `null` for the
  five generation-specific files as well as the three truly absent files.

## Null API defaults and excluded candidates

Each linked API record returns `sprites.default: null`. The first five rows are
current-scope items with generation-specific repository files. The last three
were candidate items with no exact-name file anywhere under the pinned
repository's complete `sprites/items/` tree; they are now out of scope.

| Frozen item | PokeAPI id / name | Repository result |
| --- | --- | --- |
| Utility Umbrella | [1181 / `utility-umbrella`](https://pokeapi.co/api/v2/item/1181/) | [`gen8/utility-umbrella.png`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/sprites/items/gen8/utility-umbrella.png) |
| Fairy Feather | [2105 / `fairy-feather`](https://pokeapi.co/api/v2/item/2105/) | [`gen9/fairy-feather.png`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/sprites/items/gen9/fairy-feather.png) |
| Cornerstone Mask | [2108 / `cornerstone-mask`](https://pokeapi.co/api/v2/item/2108/) | [`gen9/cornerstone-mask.png`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/sprites/items/gen9/cornerstone-mask.png) |
| Hearthflame Mask | [2107 / `hearthflame-mask`](https://pokeapi.co/api/v2/item/2107/) | [`gen9/hearthflame-mask.png`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/sprites/items/gen9/hearthflame-mask.png) |
| Wellspring Mask | [2106 / `wellspring-mask`](https://pokeapi.co/api/v2/item/2106/) | [`gen9/wellspring-mask.png`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/sprites/items/gen9/wellspring-mask.png) |
| Adamant Crystal | [1659 / `adamant-crystal`](https://pokeapi.co/api/v2/item/1659/) | Missing |
| Lustrous Globe | [1660 / `lustrous-globe`](https://pokeapi.co/api/v2/item/1660/) | Missing |
| Griseous Core | [1661 / `griseous-core`](https://pokeapi.co/api/v2/item/1661/) | Missing |

The three missing identities must not be conflated with their older paired
items. PokeAPI separately records Adamant Orb (id 112), Lustrous Orb (id 113),
and Griseous Orb (id 442), and the repository contains their corresponding
flat `adamant-orb.png`, `lustrous-orb.png`, and `griseous-orb.png`. Those three
sprites are already counted among the 85 covered identities; they are not
files for Adamant Crystal, Lustrous Globe, or Griseous Core.

## Identity and path contract

The official Item endpoint defines `sprites.default` as the item's default
depiction. Its responses point at the official sprites repository using this
shape:

```text
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/<pokeapi-name>.png
```

For example, Item 247 (`life-orb`) points to `sprites/items/life-orb.png`.
PokeAPI documents the Item endpoint and its single-field `ItemSprites` shape in
the [official API reference](https://pokeapi.co/docs/v2#items), while the
[official sprites README](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/README.md#sprites)
identifies `sprites/items/` as the default PokeAPI item PNG collection.

Consequences:

1. The sprite filename is keyed by the PokeAPI **name**, not its numeric id.
   Numeric Item id should remain the persisted resource identity; generated
   presentation metadata must additionally record the correct flat or
   generation-specific repository path rather than trusting only
   `sprites.default`.
2. Showdown-to-PokeAPI matching cannot be only "remove hyphens": `leek` needs
   the explicit `stick` / id 236 alias, verified by the
   [live Item record](https://pokeapi.co/api/v2/item/236/).
3. The live API returns default URLs on mutable branch `master`, while its Item
   response does not expose generation-specific alternatives. A deterministic
   vendoring step should resolve paths against a recorded sprites commit and
   copy the fetched PNGs into the repository; direct runtime hotlinking would
   let upstream content or availability change independently of the app release.

## Hosting and licensing implications

PokeAPI's sprites README says that the repository hosts images to reduce load
on the API and explicitly permits consumers to download the complete contents.
That makes build-time vendoring from PokeAPI consistent with the upstream's own
distribution guidance; it does not require runtime requests to PokeAPI or
`raw.githubusercontent.com`.

The repository's
[`LICENCE.txt`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/LICENCE.txt)
states both that all image contents are copyright The Pokémon Company and that
the repository is distributed under CC0 1.0. The same CC0 text says no trademark
or patent rights are affected and disclaims responsibility for clearing other
persons' rights. Therefore, moving from Serebii copies to the PokeAPI repository
improves source consistency and auditability, but the repository notice should
not be read as independent proof that all underlying Pokémon artwork rights
were waived by their owner.

## Audit method

1. Extracted the 88 distinct canonical Showdown identities from
   [`2026-07-31-frozen-held-item-mechanics-matrix.md`](./2026-07-31-frozen-held-item-mechanics-matrix.md).
2. Loaded the live PokeAPI Item collection and matched normalized item names,
   with the explicit `leek` -> `stick` alias.
3. Requested every matched Item record and classified `sprites.default` as URL
   or null.
4. Fetched all 80 non-null URLs and required HTTP 200, `image/png`, and non-empty
   response bytes.
5. Recursively enumerated the pinned repository's complete `sprites/items/`
   Git tree without truncation. This found five of the eight null-default items
   in `gen8/` or `gen9/`; each file also returned HTTP 200, non-empty
   `image/png` content. No exact file exists for the remaining three.

## Decision consequence

A complete single-source migration of the frozen 85 sprites to PokeAPI is
possible: adopt PokeAPI for all 85, resolving both flat defaults and pinned
generation-specific paths. No secondary sprite source is needed for the current
scope.

All 21 existing Serebii assets can migrate to PokeAPI coverage now.

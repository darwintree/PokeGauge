# Held-item sprite fill and alternative packs

Checked **2026-08-14**. Compares how much of the icon box the current PokeAPI files actually paint, and whether another pack can match the gen8/gen9 bag icons the UI already treats as the right size. Not a product decision; not legal advice.

## Current files

Pinned PokeAPI/sprites commit
[`8dfa3d97e953caaafaafd4963eff7621811af08e`](https://github.com/PokeAPI/sprites/tree/8dfa3d97e953caaafaafd4963eff7621811af08e).
The [sprites README](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/README.md)
documents default item PNGs as **30×30 / 24×24**. Generation-specific
`sprites/items/gen8/` and `gen9/` files used by this app are **160×160**
and are not listed at that size in the README items table.

Opaque-bbox measurements (alpha > 8) of fetched PNGs:

| File | Canvas | Opaque | Long-side fill |
| --- | --- | --- | --- |
| `sprites/items/life-orb.png` | 30×30 | 16×16 | 53% |
| `sprites/items/eviolite.png` | 30×30 | 13×13 | 43% |
| `sprites/items/charizardite-x.png` | 30×30 | 14×14 | 47% |
| `sprites/items/choice-band.png` | 30×30 | 22×22 | 73% |
| `sprites/items/gen8/utility-umbrella.png` | 160×160 | 131×138 | 86% |
| `sprites/items/gen9/fairy-feather.png` | 160×160 | 115×111 | 72% |
| `sprites/items/gen9/wellspring-mask.png` | 160×160 | 118×112 | 74% |

The gap the UI shows between the graphic and the chip border is mostly
**inside the 30×30 PNG** (7–9px empty on each side for orbs and Mega Stones),
not the 2px CSS padding. Gen8/gen9 bag art fills ~72–86% of the same CSS box.

PokeAPI has no `gen8/` or `gen9/` 160×160 file for Life Orb, Choice Band,
Eviolite, or other classic items (those paths 404 on the pinned commit).

## Alternative packs

### PokéSprite 32×32 (`msikma/pokesprite`)

[README](https://github.com/msikma/pokesprite/blob/master/readme.md):
`/items` and `/items-outline` are **32×32** Gen 3–8 inventory icons.
Updated through Sword/Shield (March 2022); no Gen 9 Fairy Feather / Ogerpon
Masks.

Measured `items/hold-item/life-orb.png`: still **16×16 opaque in 32×32**
(50% long-side fill). The outline set adds about 1px. Same pixel-art family
and the same empty margin. It does not match gen8/gen9 bag art.

### Pokémon Showdown

[smogon/sprites](https://github.com/smogon/sprites/blob/master/Tupfile.lua)
pads item minisprites to **24×24**. Smaller canvas, same inventory pixel art.

### Serebii SV / ZA 160×160 bag icons

Serebii ItemDex hosts the same illustrated 160×160 bag style that PokeAPI
already uses for the five gen8/gen9 files. Byte-level fill of Serebii
`/itemdex/sprites/sv/utilityumbrella.png`, `fairyfeather.png`, and
`wellspringmask.png` matches the pinned PokeAPI gen8/gen9 files (71/50/52%
area fill).

HEAD of `https://www.serebii.net/itemdex/sprites/sv/{slug-without-hyphens}.png`
against the frozen 85 slugs: **79/85** exist. Missing under that name:

| Slug | 160×160 elsewhere |
| --- | --- |
| `deep-sea-tooth` | no SV/ZA; PGL 80×80 only |
| `deep-sea-scale` | no SV/ZA; PGL 80×80 only |
| `never-melt-ice` | no SV/ZA/PGL 160; root 24×24 only |
| `lucky-punch` | no SV/ZA; PGL 80×80 only |
| `thick-club` | ZA `thickclub.png` 160×160 |
| `stick` (Leek) | ZA `leek.png` 160×160 |

Mega Stones: **0/47** on the SV folder. ZA folder has 160×160
(`…/sprites/za/gengarite.png`, `charizarditex.png`). Root
`…/sprites/{name}.png` is 40×40; PGL is 80×80.

Serebii is not a pinned, hotlink-friendly source. The current sprite contract
in `docs/spec/held-item-pick.md` is PokeAPI/sprites at a fixed commit.
Runtime requests to serebii.net would reverse the 2026-08-05 source decision
in `docs/traces/discussion/2026-08-05-held-item-sprite-loading-path.md`.

## What actually matches gen8/gen9

Only the **160×160 illustrated bag icons** (SV for most held items, ZA for
Mega Stones and a couple of aliases). 24×32×30 inventory pixel packs cannot
close the margin. CSS scaling the 30×30 files would fill more of the chip but
would keep the old art style next to the five gen8/gen9 illustrations.

A production switch would need a vendored or otherwise pinned copy of those
160×160 bytes, a slug→filename map (hyphens stripped; `stick` → `leek`;
`charizardite-x` → `charizarditex`), and an explicit fallback for the four
items with no 160×160 file.

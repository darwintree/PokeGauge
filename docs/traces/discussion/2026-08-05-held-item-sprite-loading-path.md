# Discussion: Held-item sprite loading path

Date: 2026-08-05  
Related change: `docs/spec/changes/2026-08-05-held-item-sprite-loading-path.md`  
Related research: `docs/research/2026-08-05-sprite-hotlink-vs-local-vendoring.md`  
Issues (archived): `.issues/archive/20260803_closed_decide-held-item-sprite-loading-path.md`, `.issues/archive/20260805_closed_complete-mega-stone-held-item-icons.md`  
Phase 2: `.issues/20260805_open_self-host-held-item-sprites-phase-2.md`

## Settled decisions

1. Near-term delivery is runtime hotlink to PokeAPI/sprites on GitHub at a pinned commit; long-term intent is self-hosting (separate Phase 2 issue).
2. Held-item UI sprites (frozen-85 and Mega Stones, including Ogerpon Masks) all use that pin-hotlink path in Phase 1.
3. URL pin is `8dfa3d97e953caaafaafd4963eff7621811af08e` (not `master`).
4. Local `public/items/` vendoring is removed in Phase 1; no dual-read fallback to local files.
5. Missing URL or image load failure uses a single Lucide `Gem` placeholder (including `unknown-mega-stone`).
6. Runtime helper exposes a full URL; generated metadata keeps `spriteSourcePath` (including gen8/gen9) and drops `spriteFilename` plus local PNG checks.
7. Spec records Phase 1/2; Pokémon species picker may remain on mutable `master` hotlink (scale split).
8. The two open issues share one decision and one implementation close-out.

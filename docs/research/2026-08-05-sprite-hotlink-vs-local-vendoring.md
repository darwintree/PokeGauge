# Sprite delivery: hotlink vs local vendoring

Checked **2026-08-05**. Comparison of how this app can serve Pokémon-related PNGs—especially held-item icons (~100 small files) and optionally species sprites (already hotlinked). Not a product decision; not legal advice.

## Question

For sprites used in a web app, what are the concrete tradeoffs of:

| Option | Delivery |
| --- | --- |
| **(A)** Runtime hotlink | `https://raw.githubusercontent.com/PokeAPI/sprites/master/...` |
| **(B)** Vendor into repo | Copy PNGs under `public/`, same-origin static assets |
| **(C)** Middle grounds | Pin-commit hotlink; self-hosted CDN/mirror; build-time fetch |

## Sources

| Source | Role |
| --- | --- |
| [PokeAPI/sprites README @ `8dfa3d97…`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/README.md) | Upstream hosting intent; download guidance |
| [PokeAPI/sprites `LICENCE.txt` @ `8dfa3d97…`](https://github.com/PokeAPI/sprites/blob/8dfa3d97e953caaafaafd4963eff7621811af08e/LICENCE.txt) | Copyright notice + CC0 1.0 text |
| [docs/research/2026-07-31-pokeapi-held-item-sprite-coverage.md](./2026-07-31-pokeapi-held-item-sprite-coverage.md) | Path contract, `master` drift, coverage audit |
| [docs/traces/discussion/2026-07-31-held-item-resource-identity-and-eligibility.md](../traces/discussion/2026-07-31-held-item-resource-identity-and-eligibility.md) | Prior grill: vendor pinned commit for items |
| App code | Held items: `/items/…` from `public/items/`; Pokémon picker: `master/sprites/pokemon/` |
| [GitHub Changelog 2025-05-08](https://github.blog/changelog/2025-05-08-updated-rate-limits-for-unauthenticated-requests/) | Unauthenticated limits apply to `raw.githubusercontent.com` downloads |
| [GitHub Docs: REST API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) | Documented API quotas (separate from raw CDN semantics) |

## Code / inventory facts (this repo)

- **Held items (local):** `public/items/` has **~104 PNGs / ~712 KB**; UI uses same-origin `/items/${sprite}` (e.g. held-item track, picker, damage summary). Generated catalog records **85** effect-whitelist items with `spriteSourcePath` under `sprites/items/` (incl. `gen8/` / `gen9/` where needed). Extra files beyond 85 are mostly legacy unhyphenated Serebii-era names unused by `GENERATED_HELD_ITEMS`; **Mega Stone PNGs are not present** (47 stones have names only; UI falls back to `Gem`).
- **Pokémon (hotlink):** battle Pokémon picker loads  
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`  
  (mutable branch tip; no pin, no local copy).
- **Scale asymmetry:** item icons for this product are **~85–132** small PNGs (hundreds of KB). Default Pokémon sprites in the upstream tree are **hundreds–thousands** of files if the full national/form set is mirrored—orders of magnitude more bytes and git/deploy weight than the item set.

## Upstream distribution intent

PokeAPI sprites README states images are hosted there “to save load on PokéAPI,” and: if you want to use all sprites in an application, “you can just download the entire contents directly.” Install paths include `git clone` and npm/`github:PokeAPI/sprites`. That is explicit permission/encouragement to **copy**, not a requirement to **hotlink at runtime**.

Live Item API `sprites.default` URLs use the mutable `master` path shape  
`…/PokeAPI/sprites/master/sprites/items/<name>.png`  
(see prior coverage research). Five current-scope items have null API defaults but exist under `gen8/` / `gen9/` in the repo tree—another reason path resolution must not trust only live `sprites.default`.

## Licensing posture (shared across A/B/C)

`LICENCE.txt` @ pinned commit says: (1) all image contents are **Copyright The Pokémon Company**; (2) the repository is distributed under **CC0 1.0**; (3) CC0 text does **not** waive trademark/patent rights; (4) Affirmer disclaims clearing other persons’ rights. Delivery choice (hotlink vs vendor) does **not** by itself clear Pokémon Company rights; vendoring from PokeAPI mainly improves **source consistency and auditability** relative to ad-hoc third-party scrapes (prior coverage note).

## GitHub `raw.githubusercontent.com` availability

- First-party (2025-05-08 changelog): updates to rate limits for **unauthenticated** requests explicitly include **downloading files from `raw.githubusercontent.com`**. Exact numeric quotas for raw are **not** published in that changelog.
- First-party REST API rate-limit docs cover **`api.github.com`**, not a substitute contract for browser `<img>` GETs to raw. Authenticated API quotas do not automatically apply to anonymous raw CDN fetches (community reports note raw does not accept the usual browser Authorization header for `<img src>`).
- Practical implication for **(A)** / pin-hotlink: end-user browsers share GitHub’s anonymous capacity (often per egress IP: corporate NAT, school Wi‑Fi, CI, scraper neighbors). Failures surface as broken images / 429—not under this app’s control. This is a reliability risk, not a guaranteed outage schedule.

## Vite / static assets (only what’s relevant)

Files under `public/` are copied as-is to the deploy root and served same-origin (no import hashing unless you opt into the module pipeline). For ~700 KB of item PNGs, deploy-size impact is negligible next to JS bundles. Full Pokémon sprite trees would dominate git history and artifact size if committed wholesale—favor selective subset, LFS, or external hosting if that path is ever chosen.

---

## Comparison table

Ratings are relative for **this** product’s two asset classes. “Items” ≈ 85–132 icons; “Pokémon” ≈ hundreds–thousands if full-set.

| Dimension | (A) Hotlink `master` | (B) Vendor in `public/` | (C1) Pin-commit hotlink | (C2) Self-hosted CDN / mirror | (C3) Build-time fetch |
| --- | --- | --- | --- | --- | --- |
| **Reproducibility** | Weak: tip of `master` moves | Strong: bytes in git + release | Stronger than A: SHA-fixed URL | Strong if mirror is versioned | Strong if fetch pins SHA and fails build on miss |
| **Version drift** | High: upstream replace/delete without app release | None until re-vendor | Low content drift; still depends on GitHub serving that blob | Controlled by your publish pipeline | Controlled by CI pin; deploy artifact freezes bytes |
| **Offline / local dev** | Needs network + GitHub up | Works offline once cloned | Needs network | Needs network (your CDN) | Dev can use committed or previously fetched `public/` |
| **Deploy / git size** | Zero asset bytes in repo | Items: ~712 KB today—cheap. Pokémon full set: heavy | Zero in repo | Zero in app repo; CDN storage cost | Optional: don’t commit; bake into deploy only (git stays light) |
| **Runtime latency / reliability** | Extra DNS/TLS to GitHub; cache shared with world; subject to anonymous raw limits / outages | Same-origin as app; your host’s CDN/cache; no GitHub in request path | Same as A but pinned blob | Usually best if CDN is tuned; you own SLA | Same as B at runtime (assets already local to deploy) |
| **Update cost** | None (involuntary) | Manual/scripted re-copy + PR; pin commit in metadata | Bump SHA in URL templates | Re-publish mirror when pin moves | Re-run fetch job; bump pin in CI config |
| **License / compliance posture** | Still TPC copyright + CC0 notice; hotlink ≠ license grant; harder to ship NOTICE with exact bytes | Easier to record source commit + paths next to files (matches prior item decision) | Same legal cloud as A; better provenance via SHA | Same; you redistribute—document source pin | Same as B if artifacts retain provenance |
| **Ops burden** | Lowest code; highest external dependency | Low for items; high if vendoring all Pokémon into git | Low code; still GitHub-dependent | Highest (bucket, cache, invalidation, cost) | Medium (CI network, pin, cache); no runtime GitHub |
| **Consistency with current practice** | Matches **Pokémon picker** today | Matches **held items** today + discussion §8 | Neither fully; upgrades A without adopting B | New ops surface | Aligns with prior research (“deterministic vendoring step”) without requiring long-term git bulk for large sets |

### Option notes

**(A) Runtime `master` hotlink**  
- Pros: no asset pipeline; Pokémon picker already works this way.  
- Cons: mutable content; API defaults omit some item paths; GitHub anonymous raw limits are a first-party-acknowledged concern; broken images are a production dependency on a third party unrelated to app deploys. Prior item research explicitly warned against this for held items.

**(B) Vendoring under `public/`**  
- Pros: matches held-item decision (§8 of identity/eligibility trace); offline; reproducible; trivial size for ~100 icons; upstream README invites download.  
- Cons: git churn on sprite updates; **does not scale the same way to full Pokémon sprite sets** without subsetting or repo-weight policy.

**(C1) Pin-commit hotlink**  
- Fixes content drift (`…/sprites/<sha>/sprites/…`) but keeps runtime dependency on `raw.githubusercontent.com` (latency, 429, availability). Good “cheap upgrade” from A if the only goal is bit-stability; weak if the goal is reliability/offline.

**(C2) Self-hosted CDN**  
- Best when many clients need the same large library and you want cache/SLA control. Overkill for ~712 KB of item icons already on the app origin. More plausible if Pokémon sprites stay remote but must leave GitHub.

**(C3) Build-time fetch**  
- CI (or a generate script) downloads from a **pinned** sprites commit into `public/` or the deploy bundle; runtime is same-origin like B. Can avoid committing binaries (lighter git) while keeping release reproducibility. Needs network in CI and a clear pin + failure mode. Closest to “deterministic vendoring” described in the coverage research without forcing every PNG into every clone forever.

---

## Scale reminder

| Asset class | Approx. count | Approx. weight (this app) | Hotlink pain | Vendor-into-git pain |
| --- | --- | --- | --- | --- |
| Held-item icons | ~85 scope / ~104 files on disk | ~712 KB | Many small third-party requests; path edge cases (`gen8`/`gen9`) | Negligible |
| Pokémon species sprites | Hundreds–thousands (forms/variants multiply) | Not vendored today; full tree would dominate | Already accepted for picker; limit/availability risk grows with traffic × unique IDs | High unless subset, LFS, or non-git store |

Treating item icons and Pokémon sprites as the **same** hosting decision ignores this asymmetry.

## Prior decision (items only)

Discussion trace §8 already chose: fetch 85 PNGs from a **fixed PokeAPI sprites commit** and **vendor locally**—do not runtime-hotlink—for held items. This note does not reopen that as settled for Pokémon sprites; it only records that items and species are already on different strategies in code.

## Decision criteria (for a grill)

Use these questions; do not treat any row above as an automatic winner.

1. **Which failure is worse for this surface:** a missing icon until GitHub recovers, or a ~1 MB (items) / multi‑MB (Pokémon subset) bump in deploy/git?
2. **Must a given release reproduce exact pixels** months later (support screenshots, visual tests), or is “whatever `master` serves” acceptable?
3. **Is the asset set bounded (~100) or open-ended (full dex/forms)?** Bounded → B or C3 cheap; open-ended → A/C1/C2 or selective B.
4. **Do we need offline / air-gapped / flaky-network dev** for that UI?
5. **Are we willing to own CDN/mirror ops**, or only CI fetch + app origin?
6. **Must item and Pokémon strategies match**, or is split strategy (today’s split) acceptable if criteria differ by scale?
7. **Compliance workflow:** do we need a recorded source commit + path list next to redistributed bytes (favors B/C3), or is a hotlink attribution page enough for the team’s risk tolerance?
8. **Update cadence:** who bumps the pin, how often, and is involuntary upstream change desirable (A) or forbidden (B/C*)?

---

## Bottom line (facts only)

- Upstream **encourages downloading** sprites; it does not require runtime hotlinking.
- **Held items** in this repo are already **(B)** at small cost; a prior grill chose pinned vendoring for the 85-item set.
- **Pokémon picker** is already **(A)** on mutable `master`.
- **(C1)** fixes drift only; **(C3)** fixes drift + runtime GitHub dependency without necessarily bloating git; **(C2)** is an ops trade for large remote libraries.
- GitHub has **first-party** signal that unauthenticated **`raw.githubusercontent.com` downloads are rate-limited**; exact raw quotas are not spelled out in that announcement—plan for dependency risk, not a published RPS budget.
)

# PokeGauge

Pokémon battle damage calculator for comparing one Pokémon across multiple battle configurations.

## Core features

- Compare multiple moves, stats, items, abilities, and battle conditions at once.
- Include accuracy and critical hits when calculating KO probabilities.
- Explore damage across selectable stat values or a continuous stat range.

## TODO

- Support multi-hit moves.
- Support one-versus-many Pokémon comparisons.

## Development

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

`pnpm build` also compiles the usage artifacts, so it needs network access to the
Pokémon Champions Battle Data, Smogon, and Pikalytics. Use `pnpm build:offline` for a client-only build that never
reaches the network — CI uses it so pull-request checks cannot be broken by
upstream downtime, and the artifacts then fall back to proxy mode.

Deployment runs through Cloudflare Workers Builds, which is configured in the
dashboard rather than in this repository:

- **Build command**: `pnpm build` — builds the client and compiles the usage
  artifacts into `dist/usage`. The compile step must stay after `vite build`,
  because that step clears `dist/`.
- **Deploy command**: the default `npx wrangler deploy`.

Usage data changes daily, so `.github/workflows/deploy.yml` POSTs a Cloudflare
**Deploy Hook** once a day to trigger another build on a day with no commits.
That workflow needs a `CLOUDFLARE_DEPLOY_HOOK` repository secret (the hook URL is
its own credential; no API token is stored in GitHub).

To deploy from a workstation instead, run `pnpm deploy` (builds, compiles, then
`wrangler deploy`) or `pnpm deploy:dry-run` to inspect the bundle without
publishing.

Pokémon and held-item images use `VITE_STATIC_ASSET_BASE_URL`. The tracked `.env`
points to the fixed R2 prefix `https://static.pokegauge.top/pokeapi`. Override
the base URL in `.env.local` or in the build environment:

```bash
VITE_STATIC_ASSET_BASE_URL=https://static.pokegauge.top/pokeapi pnpm build
```

Vite embeds this public URL at build time. Changing a Worker runtime variable
does not update an existing build; rebuild to use a different asset base URL.
Restart `pnpm dev` after editing an env file. A Cloudflare Cache Rule for
`static.pokegauge.top/pokeapi/*.png` sets browser and edge TTLs to 1,209,600 seconds
(14 days); error responses are not cached at the edge. Upload new images before releasing features that reference them. Use rclone
(v1.59 or newer) with `copy --checksum` to upload only new or changed files to
`r2:pokegauge-static/pokeapi/sprites`. Keep source commit IDs in Git, not image URLs.
Overwriting an image keeps its URL: purge the changed URLs from Cloudflare after
uploading; already cached browser copies can remain for up to 14 days. Rolling
back the app does not roll back images; restore the old image bytes separately.

Source: [darwintree/PokeGauge](https://github.com/darwintree/PokeGauge) · License: [AGPL-3.0-only](./LICENSE)

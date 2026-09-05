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

Deploy the production build to Cloudflare Workers with `pnpm deploy`.

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

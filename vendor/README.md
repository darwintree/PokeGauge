# Pinned Smogon damage calculator

`smogon-calc-e7fd7e59.tgz` contains the unmodified calc runtime from
[`e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d`](https://github.com/smogon/damage-calc/tree/e7fd7e59f3eef7ea42fba3c8b83261cb4a14109d/calc).
Its MIT license and source commit are included in the package. The package version
is `0.11.0-pokegauge.e7fd7e59` to distinguish it from the older npm release.

Rebuild with `pnpm exec tsx scripts/build-calc-package.ts` using the repository's
locked TypeScript 4.9.5 build compiler (`typescript-calc`) and pnpm version. The script downloads the fixed commit,
compiles runtime TypeScript and declarations without modifying mechanics, and
packs only the runtime, metadata and license. Normal installs use this committed
archive and require no upstream source build.

SHA-256: `6a184dbd92d73cb2a45eee9c1456a5113416d7317448649cd1db5f0b2cb5ee78`.

Upgrade the commit, rebuild, verify both rules and update this checksum together.
Use the official npm package again once a release includes the required changes.

# Discrete Damage Convolution Library

Research for the Wayfinder decision about the internal `DamageDistribution` implementation.

Checked on 2026-07-10. Package versions and unpacked sizes below come from the npm registry through `pnpm view`; API and packaging claims link to each project's own documentation, source, or package manifest.

## Required operation

A damage distribution is a sparse probability mass function whose integer key is damage and whose value is probability. Convolving distributions is therefore polynomial multiplication: damage values add as exponents and probabilities multiply and sum as coefficients. The initial UI needs one and two attacks, while the core accepts any non-empty list.

No maintained general linear-algebra package checked here exposes this sparse PMF operation directly. Matrix multiplication is not convolution, and an FFT package supplies only a lower-level transform that would require dense padding, pointwise complex multiplication, inverse transforms, and numerical cleanup.

## Candidates

| Package | Fit for the operation | Numbers | Browser / TypeScript packaging | Maintenance and footprint signal |
| --- | --- | --- | --- | --- |
| [`polynomial` 1.6.1](https://github.com/rawify/Polynomial.js) | Best semantic fit. An object maps exponents to coefficients; `mul` performs the exact nested coefficient convolution and `pow` supports repeated equal distributions. [The implementation is sparse and exposes both operations](https://raw.githubusercontent.com/rawify/Polynomial.js/main/src/polynomial.js). | Defaults to field `R`, implemented with ordinary JavaScript `+`, `*`, `/`, and `Math.pow`; therefore its default is JS `number`, matching the agreed probability unit and precision. | The [official manifest](https://raw.githubusercontent.com/rawify/Polynomial.js/main/package.json) publishes ESM, CJS, a browser build, TypeScript declarations, and `sideEffects: false`. | Published 2025-08-16; 105,753 bytes unpacked. It has three runtime dependencies (`fraction.js`, `complex.js`, `quaternion`) even though the default real-number field does not need their alternate numeric modes. |
| [`convolution` 1.0.1](https://github.com/maximilianMairinger/convolution) | Directly returns the full `a.length + b.length - 1` 1-D convolution and supports `Float64Array`. | Ordinary JS arithmetic; `Float64Array` is available. | Publishes ESM and declarations, but its npm package declares three unrelated CLI/runtime dependencies. | Only six repository commits and one-day publishing activity in 2023; 11,338 bytes unpacked before dependencies. The small API is attractive, but the maintenance and dependency shape are weak. |
| [`mathjs` 15.2.0](https://mathjs.org/docs/reference/functions/) | No convolution function appears in the official function reference. It has `fft`/`ifft`, but using them would create an FFT convolution implementation in this app rather than delegate the operation. | Supports multiple numeric types; ordinary numbers remain JS numbers, while BigNumber/Fraction are opt-in. | ESM/CJS, declarations, `sideEffects: false`, browser support, and [custom bundling](https://mathjs.org/docs/custom_bundling.html). | Actively released (15.2.0 on 2026-04-07), but 9,434,044 bytes unpacked and nine runtime dependencies. Too broad for one operation. |
| [`ml-matrix` 6.13.0](https://github.com/mljs/matrix) | Provides matrix arithmetic and decompositions, not 1-D discrete convolution. Encoding convolution as a Toeplitz matrix would add representation work and obscure the domain operation. | Dense matrices store ordinary JS numbers. | The [package](https://www.npmjs.com/package/ml-matrix) includes declarations and ESM usage; its manifest declares `sideEffects: false`. | Very active (6.13.0 on 2026-06-23); 1,094,023 bytes unpacked plus two dependencies. Good matrix library, wrong primitive. |
| [`fft.js` 4.0.4](https://github.com/indutny/fft.js) | Radix-4/Radix-2 FFT only. It requires power-of-two dense buffers and manual forward/multiply/inverse orchestration; sparse damage gaps become allocated zeros. | Ordinary JS numbers in interleaved complex arrays; inverse results require interpreting floating-point residuals. | Tiny and has declarations, but its official usage is CommonJS and its package has no ESM export or `sideEffects` declaration. | 22,390 bytes unpacked, no dependencies, but the latest release was 2021-01-11. It is an optimization primitive; performance optimization is outside this map. |
| [`ml-convolution` 2.0.0](https://github.com/mljs/convolution) | Direct and FFT signal-filter convolution, but its public modes return same-size or cut-border output rather than the full polynomial product needed for a sum PMF. | Ordinary JS numbers. | ESM source entry plus declarations; depends on `fft.js` and `next-power-of-two`. | Last published 2019-04-15; 23,501 bytes unpacked. Its own benchmark says direct convolution is normally faster for small kernels, which also argues against FFT here. |

## Recommendation

Install **`polynomial`** and keep it fully behind the opaque `DamageDistribution` boundary.

Represent the PMF as a real-field polynomial: `{ [damage]: probability }`. `convolveDamageDistributions` reduces the non-empty list with `Polynomial#mul`; `koProbability` sums coefficients whose exponent is at least HP. Do not call `Polynomial.setField`: its documented and source-level default is `R`, so the library's default numeric behavior remains JavaScript `number` as requested.

This is the least-wrong required dependency because its multiplication is exactly the domain operation, including sparse integer damage keys and arbitrary list length. It is materially smaller and more direct than `mathjs` or `ml-matrix`, and unlike `fft.js` it does not turn a correctness feature into an optimization project.

Two constraints should stay explicit in implementation:

- `Polynomial#coeff` is public, but it must not escape the module; the domain type remains opaque.
- The package imports alternate numeric-field dependencies. Accept that dependency cost for the user-required library now; bundle optimization or replacing the dependency remains out of scope unless measurement creates a later ticket.

## Supply-chain risk assessment

### Audited artifacts

The assessment used registry metadata from `pnpm view`, the published [`polynomial@1.6.1` tarball](https://registry.npmjs.org/polynomial/-/polynomial-1.6.1.tgz), the [official source repository](https://github.com/rawify/Polynomial.js), and the manifests of its exact transitive dependencies.

- The registry reports one maintainer, `infusion <robert@raw.org>`. The same maintainer owns all three transitive packages: `complex.js@2.4.2`, `fraction.js@5.2.2`, and `quaternion@2.1.1`. This is a concentrated trust boundary rather than four independent suppliers.
- All three dependency versions are exact in the [published manifest](https://raw.githubusercontent.com/rawify/Polynomial.js/main/package.json), not semver ranges.
- The package and all three dependencies have registry signatures. No provenance attestation (`dist.attestations`) was present in the checked registry metadata.
- The registry integrity for `polynomial@1.6.1` is `sha512-/c9wkqLVwfu9KgQtGK+wZeE7Z1yWVcpFsa27PswxV8Zl6ma1UPsTq0D06lUcpi1MOLP524X3e4JzAPA/MWJscw==`; independently hashing the downloaded tarball reproduced it.
- The tarball contains 13 ordinary source, distribution, declaration, example, test, manifest, README, and license files. It contains no native addon, WebAssembly, executable bin, or install-hook file. Its only scripts are `build` and `test`; there is no `preinstall`, `install`, `postinstall`, `prepare`, or `prepublish` lifecycle script.
- The published ESM imports all three alternate-field libraries at module load. Therefore “we only use field `R`” reduces API surface but does **not** remove those packages from the browser's code trust boundary.
- The repository history is dominated by the npm maintainer (73 of 84 commits in GitHub's contributor view). The last code/release commit for 1.6.1 was 2025-08-16 and the latest repository commit was 2025-09-12. Git tags stop at 1.4.5 and GitHub reports no releases, so 1.6.1 lacks a release tag that independently binds the npm tarball to a named Git revision.

### Rating

**Overall risk: Medium.**

Install-time execution risk is **low** because the audited graph has no dependency lifecycle scripts, and this repo's `pnpm-workspace.yaml` already uses `allowBuilds` with only `esbuild: true`. pnpm documents that unlisted packages are disallowed and treated as unreviewed under [`allowBuilds`](https://pnpm.io/settings#allowbuilds).

Supplier and update risk is **medium**: one person controls the direct package and all three runtime dependencies; the package has signatures but no checked provenance attestation or 1.6.1 source tag. A compromised maintainer account could publish a future malicious version across the whole graph. Exact versions and lockfile integrity prevent that future version from entering an unchanged install, but they do not make a deliberately approved update safe.

Registry replacement risk after locking is **low but version-sensitive**. pnpm records tarball integrity in `pnpm-lock.yaml`, but this repository is pinned to pnpm 10.32.1. Its [10.x install documentation](https://pnpm.io/10.x/cli/install#--frozen-lockfile) guarantees manifest/lock consistency under `--frozen-lockfile`; the stronger documented hard-failure behavior for checksum replacement belongs to pnpm 11.4 and later. Treat the committed integrity values as evidence to review, not as a substitute for vendoring when registry independence is required.

### Repo policy observed

- `packageManager` is `pnpm@10.32.1`.
- `pnpm-lock.yaml` is committed and every current registry package resolution carries SHA-512 integrity.
- `pnpm-workspace.yaml` allows build scripts only for `esbuild`; this is already the right lifecycle posture for `polynomial`, which requires no build approval.
- There is no project `.npmrc`.
- No `minimumReleaseAge` is configured. pnpm added this setting in 10.16; before pnpm 11 its default is zero, so this repository currently has no publication cooling-off window. pnpm states that it applies to direct and transitive dependencies ([`minimumReleaseAge`](https://pnpm.io/settings#minimumreleaseage)).

### Tiered recommendation

#### Normal protection — recommended for this project

1. Add exactly `polynomial@1.6.1` with `pnpm add -E polynomial@1.6.1`; pnpm documents that `-E` saves an exact version ([`--save-exact`](https://pnpm.io/cli/add#--save-exact)). Do not use `^1.6.1`.
2. Commit the generated lockfile entries for `polynomial@1.6.1` and its three exact dependencies, and review their integrity fields in the same change.
3. Use `pnpm install --frozen-lockfile` locally when verifying dependency-only changes and in CI. It refuses manifest/lock drift; CI uses frozen mode by default when a lockfile is present ([pnpm 10 install](https://pnpm.io/10.x/cli/install#--frozen-lockfile)). If the project later upgrades to pnpm 11.4+, never use `--update-checksums` without separately auditing the replacement tarballs.
4. Keep `allowBuilds` unchanged. Do not add `polynomial`, `complex.js`, `fraction.js`, or `quaternion` because the audited versions have no install hooks.
5. Add an explicit cooling-off policy such as `minimumReleaseAge: 10080` (seven days) for future dependency resolution. It does little for this already mature exact version, but protects later additions and transitives. This setting is supported by the repository's pnpm 10.32.1 ([pnpm 10 settings](https://pnpm.io/10.x/settings#minimumreleaseage)).

This tier protects unchanged builds from a registry serving different bytes and prevents accidental updates. It does not remove availability dependence on npm for a clean install.

#### Stronger protection — use if registry compromise or disappearance is in the threat model

Vendor the four audited tarballs in a reviewed repository directory, preserve their licenses, and reference the direct package through a local tarball. pnpm officially supports local `.tar`, `.tar.gz`, and `.tgz` dependencies ([local package sources](https://pnpm.io/package-sources#local-file-system)). Override the three transitive packages to their corresponding local tarballs as well; vendoring only `polynomial-1.6.1.tgz` would still fetch its dependencies from npm.

Record the four registry SHA-512 values beside the vendored files and verify them before the initial commit. Thereafter `pnpm install --frozen-lockfile` can build from committed bytes without trusting mutable registry responses for this subgraph. This costs roughly 699 KiB unpacked across the four packages plus repository tarballs, and dependency updates become an explicit vendor-review operation.

An even narrower fork that removes the three unused numeric-field imports would reduce the trust boundary, but it creates maintained application-owned third-party code. That is not recommended unless bundle or supply-chain policy justifies owning the fork and its MIT license obligations.

## Decision outcome

After reviewing the fit and supply-chain options, the map owner chose not to introduce a third-party mathematics dependency. The agreed contract instead places generic sparse convolution in an independent local module and keeps damage-distribution semantics in a separate domain module. The resolved contract is recorded in [[../../.issues/archive/20260710_closed_decide-the-stable-actual-damage-probability-module-contract|Decide the stable actual-damage probability module contract]].

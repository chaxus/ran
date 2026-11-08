# Releasing the libraries

The publishable set is **ranuts → @alixex/ranview → ranui**, in dependency order. A release may include any non-empty subset of that set. Other workspaces are not published by this workflow. All workspaces and the published libraries require **Node 24+**. Use pnpm **11.6.0**, pinned in the root `packageManager` field; the release workflow pins npm **11.20.0** for registry operations.

## Published stable release — 2026-11-08

| Package         | Version | npm tag |
| --------------- | ------- | ------- |
| ranuts          | 0.5.4   | latest  |
| @alixex/ranview | 0.2.4   | latest  |
| ranui           | 0.5.5   | latest  |

Prepare and publish `ranui@0.5.5` with the Release libraries workflow on `main` (`publish=true`, channel `latest`, packages left empty so the workflow auto-selects unpublished versions, or `packages=ranui`). It follows `ranui@0.5.4` (2026-11-06) and ships glass select menu chrome, the public `surface` contract on pilots, and the post-0.5.4 docs/header work. Install it directly:

```sh
npm install ranui@0.5.5
# Unchanged companions stay on the previous latest:
npm install ranuts@0.5.4
npm install @alixex/ranview@0.2.4
```

Bump only the packages that changed. Keep internal dependencies as `workspace:*`: pnpm materializes the exact workspace versions in the archives. A selected package may depend on an already-published companion at that exact version; verification rejects unresolved `workspace:` ranges. Update the lockfile if needed and commit the version/changelog changes before preparing the final artifacts.

## Prepare the next release

Choose new, unpublished versions for the packages you intend to ship and update their changelogs before running these commands from the repository root with Node 24+. With `--registry`, already-published workspace versions are skipped automatically; only unpublished members of the allowlist (or of `--packages`) enter the plan.

```sh
pnpm install --frozen-lockfile
pnpm release:check --registry
pnpm release:prepare --registry
pnpm verify:release
pnpm release:dry-run
```

To target one library explicitly:

```sh
pnpm release:check --registry --packages ranui
pnpm release:prepare --registry --packages ranui
pnpm verify:release
pnpm release:dry-run --packages ranui
```

- `release:check` validates the Node baseline, package allowlist, versions, dependency order, channel and build lifecycle. With `--registry`, it keeps only unpublished versions, requires that unselected upstream companions already exist on npm at the workspace versions, and fails on network or registry errors.
- `release:prepare` builds upstream companions when needed, runs each selected library's `prepack` build in dependency order, packs it with pnpm and checks the published metadata. It writes one archive per selected package plus a SHA-512 receipt to `.release/`. Pass the same `--registry` / `--packages` flags used for `release:check`.
- `verify:release` checks the receipt, installs the prepared archives with npm in a temporary project outside the workspace, and uses real registry dependencies for anything not in the receipt. No workspace or dependency symlinks are supplied. It verifies strict declarations, ESM/SSR execution and (when `ranui` is included) a browser production build, then writes `.release/verified.json`.
- `release:dry-run` verifies the same bytes and validation record, checks registry availability again and executes npm's publication preview. It writes `.release/dry-run.json` and does not upload packages or change dist-tags.

Without `--registry` (for example CI's pack smoke), the plan stays the full three-package allowlist so local archives can be verified even when those versions are already on npm.

The `.release/` directory is ignored by Git. Dirty working trees are allowed for local previews, but actual publication requires a clean checkout both when preparing the archives and when uploading them. Stashing or reverting changes after preparation does not make those archives publishable. An archive changed after verification is rejected. Each library uses one `prepack` build hook, so direct packing also builds; publishing an already-built archive skips scripts and does not rebuild it.

Channels are inferred from the versions, or can be selected explicitly:

```sh
pnpm release:check --tag latest --registry --packages ranui
pnpm release:prepare --tag latest --registry --packages ranui
pnpm verify:release latest
pnpm release:dry-run --tag latest --packages ranui
```

`alpha`, `beta` and `rc` require matching prerelease versions on every **selected** package. `latest` requires versions without prerelease suffixes. Unselected companions may stay on another channel. A release candidate cannot accidentally become the default installation through these commands.

## GitHub Actions

The [Release libraries workflow](../.github/workflows/release.yml) is manually dispatched. Run it from `main` on the Actions page. The default channel is `latest`; the default `publish=false` performs verification only. Leave **packages** empty to auto-select workspace versions that are not yet on npm, or set it to a comma-separated list such as `ranui`.

1. First ensure the PR/main CI checks are green, including browser tests. Merge the release commits to `main`.
2. Run **Release libraries** with `publish=false` (the default) and the matching channel. The workflow builds, tests, checks types/docs, verifies a real installation and previews npm publication. Download `release-<commit>` to inspect the exact archives and receipts.
3. When ready to upload, run the workflow on **main** with `publish=true`. It repeats preparation and verification, then passes the archives to a separate `npm` environment job. That job verifies the source commit and SHA-512 receipts and publishes the prepared set in dependency order, using the selected tag and provenance.

The publish job downloads the prepared archives; it installs no workspace dependencies and performs no build. It has OIDC permission only in that job. It cannot publish a dirty checkout, a different source commit, mismatched archive bytes or an unverified release set. GitHub workflow concurrency serializes release runs.

### One-time registry configuration

Before publishing through GitHub Actions, verify the npm **trusted publisher** configuration for each of the three packages:

- Repository: `chaxus/ran`
- Workflow filename: `release.yml`
- GitHub environment: `npm`
- Allowed actions: explicitly enable **`npm publish`** (direct publishing) for all three packages.

New trusted-publisher configurations default to allowing staged publication. This workflow
uses direct `npm publish`, so staging permission alone is insufficient. Verify the allowed
action on each package's npm settings before the first upload; local dry-runs do not validate
OIDC publication authorization. This workflow does not require dist-tag management permission
for a separate `npm dist-tag` command.

Create the matching GitHub `npm` environment and configure its protection/approval rules as appropriate. No long-lived npm token is required by this workflow. Local preview works without these publication settings. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) for account-side setup.

Actual publication uses `node bin/release.ts publish --tag latest --confirm` in the workflow. That explicit command uploads packages; use `release:dry-run` for inspection.

## Failed or partial publication

npm does not publish multiple packages atomically. Inspect the workflow's `publication-<commit>-<attempt>` artifact; `published.json` records completed and identical-existing packages.

Re-run the failed **publish job** from the same workflow run while its release artifact is retained (14 days). A version is skipped only if the registry's integrity matches the verified archive exactly. A different existing version archive is rejected. Re-running the whole preparation workflow after a partial upload will intentionally fail the unpublished-version check for those versions; recover using the retained artifact rather than rebuilding or forcing an overwrite.

Never use `--force` to bypass a version conflict. If the released bytes need to change, prepare new unpublished versions for the affected packages and repeat validation. A previous release can be selected again through an npm dist-tag after review; published versions themselves remain immutable.

## Stable releases

Remove prerelease suffixes, choose new unpublished versions and use `tag=latest`. Update the release notes before repeating the complete verification flow. Removing the suffix alone does not establish API stability or browser support: retain the documented compatibility scope and require the main CI/browser checks to pass.

## Browser and installation-size gates

PR CI runs the complete functional ranui and assembled `im` suites on **Chromium, Firefox and WebKit** in separate jobs. Locally, install the three engines with `pnpm -F ranui e2e:install`, then run:

```sh
pnpm -F ranui exec playwright test --project=chromium --project=firefox --project=webkit
pnpm -F im exec playwright test --project=chromium --project=firefox --project=webkit
pnpm -F ranui test:visual
```

The functional projects always skip screenshot comparisons, independently of `CI`; they assert interactions, focus, forms, layout, transitions, SSR-independent browser execution and package bundles. `test:visual` separately compares the reviewed baselines in the pinned Linux arm64 renderer, including desktop and mobile viewports. See the [visual regression guide](../packages/ranui/test/visual/README.md) for Docker prerequisites and baseline review. Firefox, WebKit and the supplemental `Mobile Safari` viewport use functional assertions only. Playwright WebKit and mobile emulation do not certify real Safari/iOS hardware, codecs, DRM or network streaming.

`verify:release` also measures the real npm installation and writes `.release/size-report.json`, included in the release artifact. The report separates compressed library archive bytes, unpacked library bytes and the complete production `node_modules` tree. These are logical regular-file bytes, not filesystem allocation, pnpm store size or browser transfer size. It skips symlinks and fails when any limit in `bin/package-size-budgets.json` is exceeded. The combined production install limit is 75 MB; individual archive/unpacked limits are maintained separately.

Private DASH/HLS/FLV and Mermaid engines are bundled as lazy ESM chunks, including upstream notices; consumers do not install their development distributions separately. Public entries and automatic engine loading remain available. Shared libraries, including Shiki's language/theme catalog, remain runtime dependencies. A larger ranui archive can therefore coexist with a much smaller total installation. See [the measured comparison and coverage limits](./RELEASE_VALIDATION.md).

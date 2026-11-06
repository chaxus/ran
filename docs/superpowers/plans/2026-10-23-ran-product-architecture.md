# Ran product architecture implementation plan

**Goal:** Deliver independently consumable ranui and ranuts packages, reusable Ran Design guidance and one product website at https://ran.chaxus.com.

**Authorization:** The user approved the three-pillar direction, confirmed the existing ran.chaxus.com origin and authorized removing the chaxus.com personal-site application on 2026-10-23. New public routes below are a target information architecture, not claims that those pages already exist.

**Architecture:** Keep the existing monorepo and `packages/docs` application. ranpress owns static-generation mechanisms; the application owns navigation, presentation, search and localization. Neutral design sources feed portable skills and public pages without independently maintained copies.

**Tech stack:** TypeScript ESM, pnpm workspaces, ranpress, ranui and the current static hosting arrangement.

## Evidence and scope

| Fact                                               | Evidence                                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| The current product site is ran.chaxus.com         | `packages/docs/build/common/index.ts`, `packages/docs/CLAUDE.md`                                           |
| The personal site is a separate application        | `packages/site/package.json` and `packages/site/README.md` before this removal; retained in Git history    |
| Site checks are manifest-driven                    | `packages/manifest.json`, `bin/run-checks.ts`                                                              |
| The root build explicitly builds the personal site | `bin/build.sh` before removal                                                                              |
| General guidance currently lives under ranui       | `AGENTS.md`, `packages/ranui/docs/INTERFACE_GUIDE.md`                                                      |
| Claude and Codex package metadata currently differ | `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `plugins/ranui/`, `plugins/ranuts/` |

Allowed changes: product positioning; personal-site removal and its direct callers; neutral design ownership and plugin packaging; product website navigation/content/presentation with its tests. Existing component work remains a separate set of commits and evidence.

Do not alter DNS, hosting projects, external accounts, published releases or unrelated experiments. Do not rewrite historical evidence to claim that a future structure was already tested. Keep ranpress and the ran product's GitHub Pages redirect: the latter points to ran.chaxus.com and is not the personal-site deployment.

## Chunk 1: Product boundary and personal-site removal

- [x] Update `PRODUCT.md`; move its former demo-only brief to `packages/ranui/demo/PRODUCT.md`.
- [x] Remove `packages/site/` and `bin/build-site.sh`; remove the package's manifest and lockfile entries and its root build step.
- [x] Update current ranpress descriptions and docs page-model comments; leave dated audit history intact.
- [x] Run `pnpm verify:packages`, `pnpm verify:links`, `pnpm -F ranpress test`, and the built documentation site's verification.
- [x] Search active source/configuration for remaining personal-site callers. Confirm no npm dependency graph changes beyond the removed importer.
- [x] Commit this boundary independently of component and visual-baseline changes.

Removal verification: root `pnpm build` passed and generated 1,321 website pages; links, anchors, canonicals, assets and sitemap passed. ranpress passed 81 tests, ranpress and docs typechecks passed, repository links and the 10-package manifest passed. The first docs typecheck overlapped a library rebuild and saw missing transient declaration files; the sequential post-build check passed. The lockfile changed only by removing the personal-site importer. Commit: `54fc34e`.

## Chunk 2: Neutral design owner and portable plugin

- [x] Extract general sections of `packages/ranui/docs/{DESIGN,INTERACTION,ACCEPTANCE,WORKFLOW_PATTERNS,REFERENCE_RESEARCH}.md` into `design/`; keep library-specific tokens and contracts with ranui. Inventory all callers before moving sections.
- [x] Replace duplicated prose with focused links in `AGENTS.md`, package guides and public pages; retain original reference URLs, adaptation notes and evidence limitations.
- [x] Create one `plugins/ran/` distribution with design, ranui and ranuts skills. Update both marketplace entries and installation instructions together.
- [x] Bundle needed references from canonical owners with deterministic typed tooling and provenance. An installed plugin must work outside this checkout: no unresolved links to `../../design`, repository-only symlinks or dependence on another plugin's presence.
- [x] Record the exact npm package version and source provenance for bundled API/token references; match guidance to the host's installed version. Do not describe an unpublished component API as available to users.
- [x] Move the six existing eval scenarios with their actual provenance, update root scripts and CI paths, and run packaging plus behavior checks. Historical screenshots remain historical.
- [ ] Test the plugin from an isolated installation directory, including a non-ranui host and a host using the published ranui version.

## Chunk 3: One website for the three pillars

Keep source under `packages/docs`. Do not create another frontend or rename directories merely for branding. Target navigation is Design, Components and Utilities, with a clear agent-install action; Examples and reference links support these entries.

Target routes:

| Route        | Purpose                                                                  | Status                                   |
| ------------ | ------------------------------------------------------------------------ | ---------------------------------------- |
| `/`          | Product introduction, a usable composed example and the three next steps | Done (three-pillar home)                 |
| `/design/`   | Design, interaction and motion methods; examples and acceptance evidence | Done                                     |
| `/ranui/`    | Components, themes, states and generated API reference                   | Done                                     |
| `/ranuts/`   | Task-oriented utility discovery, runtime constraints and API reference   | Done                                     |
| `/agents/`   | Verified installation instructions and task examples                     | Done                                     |
| `/examples/` | A small set of complete compositions, linked to rationale and source     | Done in 2026-11-06 closeout working tree |

- [x] Implement explicit public route mapping (`packages/docs/build/urls.ts` `publicUrl` + `legacyRedirects`); nav, hreflang, search and sitemap go through it. Retired `/src/…` URLs redirect in one hop.
- [x] Rework the home renderer and `styles/home.css` around a real composition and concise next actions.
- [x] Build design and agent entry pages from the canonical sources. Locale registry honored.
- [x] Connect `/examples/` compositions to realistic states and readable code; keep page chrome lightweight where no interactive component is needed.
- [x] Verify production build, internal links/anchors, canonicals, search and no-JavaScript access to installation and reference text (ongoing gate).
- [ ] Inspect light/dark and narrow/wide screenshots for new `/examples/` pages; record keyboard and reduced-motion behaviour.
- [ ] Update PRs with separate commits only after matching evidence.

## Simplest alternatives

- Existing `packages/docs` versus a new app: reuse the existing app, generator, locale registry and search; no second deployment or framework is needed.
- Common methodology versus duplicated per-platform documents: maintain neutral sources once, generate self-contained installable references, keep platform metadata thin.
- A broad example gallery versus a few complete examples: begin with a few complete compositions that expose state, responsive layout and recovery.
- Simultaneous release versus independent artifacts: publish npm and plugin versions independently; do not make a docs change require an npm release.

## Completion criteria

The website identifies and links all three pillars; its build remains self-contained after personal-site removal. Each skill can resolve its own references after installation. Generic design guidance works without ranui; ranui guidance matches the chosen version. Fresh screenshots and recordings demonstrate the changed website and components. A passing structural test alone does not constitute visual acceptance.

## Implemented review checkpoint — 2026-10-23

The unified plugin and neutral owners are committed in `6113e2a`; design-before-implementation
brief/routing refinements are in `5a8a530`. Canonical references remain independently editable only
in design/ and ranui adapters. Both generated distributions pass freshness and portable-link checks.
The installed-package skills resolve the host's real package version rather than bundle unpublished
API facts. Isolated directory tests pass; no actual Codex/Claude plugin installation or new live
six-agent trial is claimed. Six deterministic evaluator groups pass, with historical live evidence
retained under its original provenance.

The website has localized Design and Agents entries in all eight languages and the three-pillar
homepage. Clean public URLs ship (`/ranui/…`, not `/src/ranui/…`); legacy `/src/…` redirects
remain. The complete `/examples/` section and exact plugin API/token provenance recording are
still open — tracked in [2026-11-06-optimization-closeout](./2026-11-06-optimization-closeout.md).
The website evidence is in
[the production-page review](../../../packages/docs/test/evidence/2026-10-23-product-site/README.md).
This checkpoint is a bounded implementation, not completion of every architecture item above.

## Checkpoint — 2026-11-06

Clean-route remapping is done. Working-tree closeout also lands `/examples/`, the AI chat
task guide, plugin `package-contract.json` provenance, design-hotspot burn-down for
`r-player`/docs styles, Shiki allowlisting + search API-body trim, and public-path
structure emitters with `check:langs`/`legacyUrl` mapping fixed. Remaining: full docs
production build evidence for the new pages; broader design-baseline ratchet burn-down
beyond hotspots; deepen ranuts “when to use a utility” guidance.

# Roadmap

Direction and near-term plans for the `ran` ecosystem. Subject to change.

## Positioning

`ran` is a **Web Components UI library (ranui) + companion utility library (ranuts)**, built on native custom elements with first-class TypeScript, theming, and PWA support. The monorepo also hosts experimental packages (parser, compiler, WASM, etc.), but the docs site leads with ranui/ranuts.

## In progress

### Documentation site

- **New home:** the docs site moves to a custom domain at `ran.chaxus.com` (from `chaxus.github.io/ran/`).
- **Hosting:** GitHub Pages → Cloudflare Pages (Git integration, root-path deploy — the `/ran/` base path is being removed).
- **SEO continuity:** old GitHub Pages URLs will 301-style redirect to the new domain to preserve search rankings; sitemaps resubmitted to Search Console / 百度 / Bing.

### Quality & discoverability

- Per-page unique titles/descriptions and `hreflang` for the EN/CN locales.
- Structured data (JSON-LD) and an `llms.txt` map for AI answer engines.
- Bundle/perf review (lazy-load large media).

## Later

- Independent doc subdomains for other packages as they mature (e.g. `ranc.chaxus.com`).
- Deep-dive "from scratch" build guides for the low-level packages (parser, compiler, WASM).

---

Have an idea or found something off? Open an issue.

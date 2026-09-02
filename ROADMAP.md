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

### Component coverage

ranui ships **40 custom elements**, strong on the AI/chat surface (`r-conversation`,
`r-reasoning`, `r-tool-card`, `r-attachments`, `r-voice-button`, `r-token-meter`) and on
content rendering (`r-markdown`, `r-math`, `r-mermaid`, `r-player`, `r-radar`). Measured
against a mature desktop-class catalogue, the gaps are in the ordinary application layer —
these are candidates, not commitments, and each needs a real use case before it is built:

| Group         | Missing                                                     | Notes                                                                                                                               |
| ------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Form controls | Switch, Radio, Textarea, NumberInput, DatePicker, Slider    | `r-progress` already carries a drag mode a Slider could build on.                                                                   |
| Feedback      | Alert, Tooltip, Notification (beyond `r-message`)           | Tooltip overlaps `r-popover`; decide whether it is a mode or an element.                                                            |
| Data display  | Table, Tree, Pagination, Tag/Badge, Avatar, DescriptionList | Table is the largest single piece of work here.                                                                                     |
| Layout        | Drawer/Sheet, Accordion, Resizable, Sidebar                 | `r-disclosure-row` covers part of Accordion already.                                                                                |
| Large data    | VirtualList                                                 | `r-conversation` solved its own case with `content-visibility` instead of windowing — read that before reaching for virtualization. |

Sequencing principle: **add an element only when a real screen needs it**, and prefer
extending an existing element over adding a near-duplicate (a Tooltip mode on `r-popover`
beats a second overlay implementation). Every addition costs a page in both languages, an
entry in the generated API reference, and a permanent compatibility promise.

## Later

- Independent doc subdomains for other packages as they mature (e.g. `ranc.chaxus.com`).
- Deep-dive "from scratch" build guides for the low-level packages (parser, compiler, WASM).

---

Have an idea or found something off? Open an issue.

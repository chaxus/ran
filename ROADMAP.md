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

### Task-oriented guides

The documentation is organised by **thing** — one page per element, one per utility. Nothing is
organised by **task**, and the library's most distinctive capability only exists as a task:
`r-conversation` + `r-markdown` + `r-attachments` + `r-voice-button` + `r-token-meter`, over
`ranuts/stream` and `ranuts/conversation`, is a complete AI chat interface, and a reader has to
assemble that from seven pages to find out.

The missing page is a worked build — "an AI chat UI in ranui", from an empty file to streaming,
attachments, dictation and a context meter, with the decisions stated as they are made. Held
deliberately: the shape of that guide is not settled yet (one long build, or a set of short
recipes?), and a half-considered tutorial is worse than none because it becomes the thing people
copy. Revisit once the component set behind it stops moving.

Adjacent, smaller, and worth doing before it: a page for ranuts on **when to reach for a
utility instead of the platform** — already partly answered by the choosing guide, but the
"don't use this, the browser has it" direction deserves its own treatment.

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

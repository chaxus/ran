# Roadmap

Direction and near-term plans for the `ran` ecosystem. Subject to change.
Positioning lives in [PRODUCT.md](PRODUCT.md); this file tracks unfinished work against it.

## Positioning

`ran` provides three pillars: **Ran Design** (portable product methods), **ranui** (accessible
custom elements), and **ranuts** (typed utilities). The product website is
**https://ran.chaxus.com** (`packages/docs`, built by `packages/ranpress`). The unified
`plugins/ran` agent plugin routes to design, ranui and ranuts skills.

Experimental packages may exist in the monorepo; the public site leads with the three pillars.

## In progress

### Product website closeout

Clean public routes (no `/src/` in published URLs) already ship, with legacy redirects.
Structure/nav emitters now address those public paths directly; mirrors stay mapped back
to on-disk `src/<tree>/`.

Shipped in the 2026-11-06 closeout (non-CN locales keep English prose as fallback where
full translation is not yet in place):

- `/examples/` compositions (chat composer, overlay form, content render) in all eight
  locales, plus the ranui **Build AI chat** task guide.
- Plugin `package-contract.json` provenance (`authoredAgainst` + `bundledApi: false`)
  gated by `verify:agent-plugin`.
- Design-rule hotspot burn-down for `r-player` and docs site stylesheets (remaining
  baseline entries elsewhere are ratchet debt, not blockers).

### Quality & discoverability

- Keep `llms.txt` accurate to the shipped element and utility surface.
- Bundle/perf: Shiki browser grammars are allowlisted in `r-markdown`; docs search drops
  generated API body text. Re-measure after the next docs build; media engines stay
  page-gated / lazy.

### Task-oriented guides

The AI chat worked build now lives at `/ranui/ai-chat/` (linked from `/examples/`).
Adjacent and smaller: deepen ranuts **when to reach for a utility instead of the
platform** beyond the existing choosing guide.

### Component coverage

ranui ships **41 custom elements**, strong on the AI/chat surface (`r-conversation`,
`r-reasoning`, `r-tool-card`, `r-attachments`, `r-voice-button`, `r-token-meter`) and on
content rendering (`r-markdown`, `r-math`, `r-mermaid`, `r-player`, `r-radar`). Measured
against a mature desktop-class catalogue, the gaps are in the ordinary application layer —
candidates, not commitments; each needs a real use case (often via the `im` consumer)
before it is built:

| Group         | Missing                                                     | Notes                                                                                                                               |
| ------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Form controls | Switch, Radio, Textarea, NumberInput, DatePicker, Slider    | `r-progress` already carries a drag mode a Slider could build on.                                                                   |
| Feedback      | Alert, Tooltip, Notification (beyond `r-message`)           | Tooltip overlaps `r-popover`; decide whether it is a mode or an element.                                                            |
| Data display  | Table, Tree, Pagination, Tag/Badge, Avatar, DescriptionList | Table is the largest single piece of work here.                                                                                     |
| Layout        | Drawer/Sheet, Accordion, Resizable, Sidebar                 | `r-disclosure-row` covers part of Accordion already.                                                                                |
| Large data    | VirtualList                                                 | `r-conversation` solved its own case with `content-visibility` instead of windowing — read that before reaching for virtualization. |

Sequencing principle: **add an element only when a real screen needs it**, and prefer
extending an existing element over adding a near-duplicate (a Tooltip mode on `r-popover`
beats a second overlay implementation). Every addition costs pages in every locale, an
entry in the generated API reference, and a permanent compatibility promise.

## Later

- Independent doc subdomains for other packages as they mature.
- Deep-dive "from scratch" build guides for low-level / experimental packages.

---

Have an idea or found something off? Open an issue.

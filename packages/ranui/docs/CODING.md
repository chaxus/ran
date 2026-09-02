# ranui CODING.md

> The engineering standard for **library code** — written for humans and AI agents.
> [DESIGN.md](./DESIGN.md) governs what a component looks like; this file governs how it is
> built. [CLAUDE.md](../CLAUDE.md) is the _reference_ — the canonical component skeleton,
> the utility APIs, the per-component notes — and this file is the _rules_ that skeleton
> exists to satisfy. Where they overlap, CLAUDE.md shows the code; this file says why.

## How to use this file

- Decide **who owns a piece of state** before writing the code that changes it.
- Prefer the platform: these are custom elements, and `addEventListener`, `hidden`,
  `:host`, slots and `part` all work as specified.
- Every rule below has a failure mode that is **silent**. That is the selection criterion —
  loud failures do not need a rule.
- When a rule does not fit, say so in the pull request rather than quietly bending it.

Conflict resolution order: **user goals → verified evidence → DESIGN.md → this file →
CLAUDE.md → shipped patterns → general heuristics.**

## What is machine-checked

`pnpm -F ranui verify:design` (CI, every pull request) enforces three rules from this file:

| Rule                               | Enforces                                                         | Section |
| ---------------------------------- | ---------------------------------------------------------------- | ------- |
| `shadow-mount-outside-constructor` | the shadow tree is built once, in the constructor                | §2      |
| `built-then-queried`               | a component never searches its own shadow tree for what it built | §2      |
| `mouse-only-drag`                  | drag loops are Pointer Events, not `mouse*`                      | §6      |

Plus, in CI: `pnpm -F ranui test:all` (types, unit, SSR), `pnpm verify:docs` (the generated
API and token tables cannot go stale), and a unit test that fails when a hand-written doc
names an underscore-prefixed symbol the source no longer has.

Everything else here is still binding; it is simply not mechanically decidable.

---

## 1. Layering — where code goes

| Layer         | Holds                                                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `components/` | One custom element per directory: `index.ts` + `index.less` (+ `core/` for a component with substantial internal logic, e.g. the player). |
| `utils/`      | Behaviour shared by more than one component — the builder, `EventManager`, floating/placement, form, theme, router, i18n re-export, SSR.  |
| `theme/`      | Tokens and the light/dark palettes. The single source of truth for every value in DESIGN.md.                                              |
| Entry files   | `index.ts` (barrel) plus one root file per public subpath (`theme.ts`, `i18n.ts`, `ssr.ts`, `testing.ts`, `builder.ts`, …).               |

**Promote to `utils/` on the second real use, not the first.** A shared module invented for
one caller encodes that caller's assumptions and has to be rewritten when the second arrives
— see `utils/floating.ts`, which became shared only once `r-select` and `r-popover` both
needed identical reposition-on-scroll behaviour.

**A new public subpath is a compatibility promise.** Adding one means adding it to
`package.json` `exports` and to the build config; removing one is a breaking change.

## 2. The component skeleton

The full canonical pattern is in [CLAUDE.md](../CLAUDE.md) ("Component Architecture"). The
rules it encodes:

- **Extend `RanElement`, register with `defineSSR`.** Never `customElements.define` directly
  — the SSR registry is what lets the server construct the element.
- **`ensureShadowRoot`, never `attachShadow`.** Roots are **closed** by design: page CSS
  cannot leak in, and nothing outside can look in.
- **Build the tree once, in the constructor.** A second build from `connectedCallback` adds a
  duplicate subtree on every reconnect, and its refs replace the ones the component is
  already driving.
- **Hold what you build.** Capture every element with `.ref()` while building and read it
  back with `shadowPart`. `querySelector` re-derives an element through a _string_: rename
  the class in the LESS file and the two sides drift, `!` waves the `null` through, and the
  failure surfaces far from the rename. The exception is a container whose children arrive
  later (options rendered from data, nodes a third-party library injects) — mark those with a
  comment saying what puts them there.
- **Guard `attributeChangedCallback` with `if (old === next) return;`** and keep it a
  dispatcher: it decides what to sync, it does not contain the syncing.
- **Lifecycle listeners go through `EventManager`**, aborted in `disconnectedCallback`. A
  component that is disconnected and reconnected must end up with exactly the listeners it
  started with.
- **Always observe and wire `sheet`** — it is the escape hatch consumers rely on when tokens
  and parts do not reach far enough.

## 3. State and ownership

- **One owner per value.** For a controlled value, the attribute/property _is_ the state —
  don't also keep a private copy that a handler updates, or the two drift under fast input.
  Read from the attribute (`getStringAttribute`) and reflect through the setter.
- **Reflect only what CSS or consumers need to see.** A reflected attribute is public API;
  an internal flag that becomes an attribute is a rename you can no longer make freely.
  `open` on `r-modal` and `r-select` is reflected on purpose — consumers write
  `:has(r-modal[open])` selectors against it.
- **Never mutate during render or during a notify.** Writing state from inside the callback
  that reports it is how a component ends up notifying itself in a loop.
- **A measured value is state with an expiry.** Anything derived from
  `getBoundingClientRect()` is stale after the next reflow — re-measure on `resize`, on
  `scroll` (capture phase, for portaled panels), or through a `ResizeObserver` on the element
  that actually drives the measurement.

## 4. Events

Events are the outward half of the contract, so treat a change to one as a breaking change.

- **Name for what happened**, in lowercase and unprefixed where it mirrors a platform event
  (`change`, `input`, `open`, `close`), and put the whole payload in `detail`.
- **Bubbling is a deliberate decision, and it must be stated in the JSDoc.** Form-like and
  overlay components dispatch **non-bubbling** events on themselves, so a `change` from a
  select inside a form does not read as the form's own `change`. Content and app-level
  components (`r-theme-switch`, `r-voice-button`, `r-attachments`, `r-conversation`,
  `r-markdown`, `r-math`, `r-mermaid`, `r-router`, `r-link`, …) bubble **and** are
  `composed`, because a host page legitimately listens at the container. What is not
  acceptable is picking one by accident: the choice is invisible from the outside until a
  consumer's delegated listener silently never fires.
- **`before*` events are the cancelable ones.** Dispatch `beforeopen`/`beforeclose` with
  `cancelable: true` before acting, and the past-tense pair (`open`/`afteropen`) after. Never
  make a past-tense event cancelable — there is nothing left to cancel.
- **Regenerate the API docs** (`npm run doc:api`) after touching an event, its `detail`, an
  attribute, a property, a slot or a part. CI fails if you don't.

## 5. Styles

- **Tokens, never literals.** Component tokens follow
  `--ran-{component}-{element}[-{state}]-{property}` and default to a semantic token; the
  naming rules and the reasoning are DESIGN.md §10.
- **A fallback must name a token that exists and that flips.** Both failure modes are silent
  and both are machine-checked (DESIGN.md §1).
- **No palette property in a `transition`, no `transition: all`.** CSS cannot tell an
  interaction from a theme flip (DESIGN.md §5).
- **`:host` display rules must keep `hidden` working** — add `:host([hidden]) { display: none }`
  whenever you set `display` on `:host`. Nineteen components once shipped with
  `element.hidden = true` doing nothing.
- **Expose parts for structure consumers will need**, and keep part names stable: a rename is
  a breaking change with no type error behind it.

## 6. Input, focus and accessibility

- **Pointer Events for anything draggable**, paired with `touch-action: none` on the exact
  drag surface. CSS declaring `touch-action: none` with no pointer handler behind it is a
  broken control, not a harmless no-op.
- **A hover trigger needs a tap path.** `trigger="hover"` must degrade to click on touch.
- **Keyboard parity is not optional.** Anything clickable is operable from the keyboard, with
  a visible focus ring; a control built out of non-semantic elements carries the role, the
  state and the tab stop itself.
- **Accessible names are inputs, not constants.** A user-visible or assistive-technology
  string that a component has to default must be overridable through an attribute —
  ranui has no built-in translation dictionary, so a hard-coded string is a string no
  consumer can localize (see the i18n page's "Localizing component text").

## 7. SSR

- Rendering happens in `connectedCallback` or behind a `document` guard, so server
  serialization never runs it.
- Module-level code must not touch `window` / `document` / `localStorage` — utilities are
  imported at module scope and can be evaluated on the server.
- Nothing may depend on a measurement at first paint; layout that must be right before JS
  runs belongs in CSS.
- New components are covered by `test/ssr/components/every-component.test.ts` automatically.
  If one cannot render on the server, add it to that file's exemption map **with a reason** —
  the point of the map is that the number cannot grow silently.

## 8. Testing

Test from the lowest layer that can actually catch the bug:

| Layer                            | For                                                                    |
| -------------------------------- | ---------------------------------------------------------------------- |
| Unit (`test/unit`)               | Pure logic, attribute/property reflection, event payloads              |
| Integration (`test/integration`) | Two components together, and the wiring between a component and a util |
| SSR (`test/ssr`)                 | Serialization and the absence of browser globals                       |
| E2E (`test/e2e`, Playwright)     | Real layout, painting, pointer input, focus                            |

- **Test the contract, not the internals.** Set an attribute or property, assert on the
  event and on what a user can perceive. Assertions against internal class names break on
  every refactor and prove nothing.
- **Closed roots stop test locators too.** Playwright's `getByRole` / `getByText` /
  `querySelector` find _nothing_ across the boundary — and a spec written that way passes
  while asserting on elements it never saw. Use `ranui/testing`.
- **A bug fix arrives with the test that would have caught it**, at the layer where it
  actually failed. Several of this library's rules exist because a bug was only visible in
  integration; unit coverage alone did not see it.

## 9. Documentation

- `COMPONENTS.md` and the token tables are **generated** — edit the source, run
  `npm run doc:api` / `npm run doc:style`.
- Hand-written docs are checked for private symbols that no longer exist
  (`test/unit/docs.references.test.ts`). Prose that goes stale in other ways is on you.
- A user-facing change lands with its documentation-site counterpart in
  `packages/docs/src/ranui/` **and** `packages/docs/cn/src/ranui/` — the Chinese tree is a
  manual mirror, and a page that exists in only one language advertises a 404 to the other.
- New behaviour that changes how consumers write code goes in the changelog under
  `changelogs/`.

## 10. Antipatterns

| Antipattern                                                  | Why it is wrong                                                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `root.querySelector('.ran-thing')!` for an element you built | Re-derives through a string; a rename yields `null` far from the cause. Use refs.                  |
| Building or re-building the tree in `connectedCallback`      | Duplicate subtree on reconnect; orphaned refs.                                                     |
| `customElements.define` instead of `defineSSR`               | The element cannot be constructed on the server.                                                   |
| Per-listener `removeEventListener` bookkeeping               | Drifts from what was registered. Use `EventManager` + `abort()`.                                   |
| A private mirror of a controlled value                       | Two owners, one value; they diverge under fast input.                                              |
| Reflecting internal flags as attributes                      | Turns an implementation detail into public API.                                                    |
| A hard-coded user-visible string with no attribute override  | Nobody can localize it.                                                                            |
| A colour literal in a component                              | Breaks under a custom theme, and in dark mode.                                                     |
| Adding a new hard-coded breakpoint                           | There is no shared breakpoint token; every one-off is a number someone maintains. Flag it instead. |
| Deleting a test that fails after a refactor                  | The test is the specification; change it deliberately or fix the code.                             |

## Checklist before opening a pull request

- [ ] `pnpm -F ranui test:all` and `pnpm -F ranui verify:design` pass.
- [ ] `pnpm verify:docs` passes (generated API and token tables regenerated).
- [ ] Attribute / property / event / slot / part changes are intentional and documented.
- [ ] Bubbling and cancelability of every new event were decided, not inherited by accident.
- [ ] SSR: no new module-level browser globals; the every-component test still passes.
- [ ] The DESIGN.md checklist was run for anything visible.
- [ ] EN and CN documentation pages both updated.

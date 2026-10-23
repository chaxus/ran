# Component foundation evidence

Actual registered ranui components, captured from the source preview. The [manifest](./manifest.json)
binds selected media and 36 runtime/dependency inputs to SHA-256, including the base revision and
dirty source. These are isolated component fixtures. Document application review remains pending.

The [2026-10-23 follow-up](../2026-10-23-focus-return/README.md) records the subsequent
Firefox keyboard-focus correction and current source fingerprints. The evidence below
retains this earlier iteration's bytes and verification scope.

## Inspected states

| Scope                       | Before / current evidence                                                                                                                   | Observed result                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Markdown defaults           | [before](./before-markdown.png), [current light](./after-markdown-light.png), [narrow dark error](./after-markdown-dark-error.png)          | Aligned code chrome/text, readable 14px code, quiet table rows, right-aligned numeric column, bounded local recovery                    |
| Input composition           | [before](./before-input.png), [current](./after-input.png)                                                                                  | Icon retains its native/visible label; label, control and helper stay inside automatic/fixed-height hosts                               |
| Keyboard focus              | [WebKit return](./after-button-focus.png), [popover return](./after-popover-return.png)                                                     | Visible focus on the actual button surface after Tab and dismissal                                                                      |
| Stream reading              | [selected text](./after-selected-stream.png), [normal recording](./content-normal.webm), [reduced-motion recording](./content-reduced.webm) | Exact copy payload, independent feedback, retained selection/scroll/viewports, enhanced table math/links, explicit follow-off respected |
| Closed-root selection       | [WebKit native recording](./content-webkit-native.webm)                                                                                     | Actual mouse selection survives streaming; cold highlighting waits for scoped selection release                                         |
| Pending voice/input         | [continuous recording](./input-normal.webm)                                                                                                 | Disabled activation blocked, field state retained, pending microphone request cancellable with truthful busy state                      |
| Portal/disclosure lifecycle | [normal recording](./popover-normal.webm), [reduced-motion recording](./popover-reduced.webm)                                               | Nested Escape closes one layer at a time, focus returns, reconnect retains authored controls, interrupted closing stays closed          |

Clipboard delay/rejection and speech callbacks are disclosed deterministic platform fixtures.
The content capture also compares a real native clipboard payload, including tabs/blank/final
newlines. Native pointer, keyboard, focus, selection and scrolling are real. Input recordings
retain demo navigation warmup; the reviewed fixture sequence follows it without cuts.

## Verification and authority

- ranui: 1,629 unit checks across core and documentation groups; 76 SSR checks.
- Bottom-follow utility: 21 tests. Final selected browser suite: 128 Chromium/WebKit cases,
  including normal/reduced motion, native nested Escape, source selection and immediate reversal.
- Build, TypeScript, design ratchets, generated API/token references, eight-language page parity,
  links, plugin controls and changed-file formatting passed. Existing baselines were not raised.
- Agent review: current screenshots and sampled continuous interactions inspected; independent
  reviews found and corrected label sizing, invisible focus, pending Copy blur, table enhancement,
  WebKit selection/opener and reconnect defects. Earlier rejected iterations remain in task outputs.
- Human acceptance is not established by these component proofs. Firefox is unverified because
  even blank-page launch timed out in this environment. Provider behavior, native OS IME and
  Document's complete product flows are outside this fixture scope.

Relevant runnable cases live in `../../e2e/`: `input-primitives`, `popover-dismissal`,
`disclosure-row`, `markdown-reader`, `markdown-geometry`, `conversation-follow` and
`select-interaction`. The public [acceptance contract](../../../docs/ACCEPTANCE.md) distinguishes
component, application, automated, agent and human evidence.

# Component foundation before host redesign

The user prioritized improving ran's reusable components before continuing the Document
redesign and authorized submitting reviewable PR progress before final product acceptance.
Keep the component and application acceptance scopes distinct. No merge or package publication.

## Observed baseline

Actual registered components at `6551c69` reproduced these failures in Chromium:

- A disabled button still delivered a real pointer click; an input's leading icon removed its
  visible/native label; pending microphone permission could not be canceled with Escape.
- Escape from a portaled popover action left it open; collapsing a focused disclosure lost
  focus to the document; a queued entrance frame could overwrite an already closing popup.
- Two code copies shared one feedback timer, and a detached component emitted late copy
  success. Appending to an open fence replaced its PRE, clearing selection and local scroll.
  A conversation with `follow=false` still scrolled to its floor after content resized.
- Default Markdown wrapped both tables and code in rounded frames. Its code language header
  and text had different left insets. Review these defaults with actual content and tokens.

Independent browser review also exposed label/control height overflow, invisible keyboard
focus, pending Copy blur, table math/link enhancement loss, pointer opener differences and
borrowed-content loss on reconnect. These findings stay within the owners below; correct the
component contracts and refresh affected evidence before delivery.

Before captures, recordings and reproduction inputs are retained in the task's component
audit outputs. Clipboard and speech completion are deterministic fixtures; component DOM,
pointer/keyboard input, native selection and layout are real. These are component proofs.

## Ownership and decisions

1. **Input primitives:** button owns disabled dispatch, input owns icon/label composition, and
   voice-button owns recognition intent and truthful pending/cancel feedback. Preserve native
   form semantics and existing public labels/events. Any necessary new label is overridable.
2. **Interactive surfaces:** popover/FloatingController own portal dismissal and interruptible
   transitions; disclosure-row owns focus before its body becomes inert. Respect nested popup
   ownership, handled Escape and IME. Do not add a host-specific keyboard workaround.
3. **Rendered content:** markdown owns per-source copy operations and stable code/table
   viewports. Late success/failure cannot affect replaced or disconnected content. Copy raw
   source exactly. Preserve prefix text nodes on streamed code growth; avoid disruptive async
   highlighting while native selection is active. Preserve safe rendering and lazy dependencies.
4. **Reader intent:** conversation/bottom-follower own following and paging anchors. Public
   `follow=false` gates every automatic scroll write; explicit navigation remains available.
5. **Visual defaults:** quiet table row/header structure, aligned code chrome/text, readable
   token typography and functional focus/hit bounds. Compare before/after on the same content,
   light/dark and narrow/wide surfaces. Avoid decorative enclosures, new palettes or motion.

Foundation tokens retain their existing owner. Product width, workspace navigation, storage,
queue, consent, inference and native document editing remain host concerns. Do not create a
second Markdown engine, replace FloatingController, add infrastructure, or copy application
dimensions into component defaults. Unproven tool-card selection concerns remain outside scope.

## Acceptance

Keep independent expectations and demonstrate each behavioral regression fails before the fix.
Preserve raw clipboard tabs/newlines, native selection, scroll, focus, event payloads, reconnect,
SSR and sanitizer behavior. Cover immediate reversal with normal and reduced motion; a timeout
that waits out the original defect is not a fix. For new copy feedback, test concurrent blocks,
delayed success/rejection, source replacement and disconnect.

Capture actual components with realistic content and surrounding controls, then inspect current
screenshots and continuous interactions. Bind source/dependency/runtime/state/media identity.
Independent review follows bounded implementation and integration. Report automated checks,
agent review and human decisions separately. Document application acceptance stays pending until
the verified components are integrated and its actual editor flows are freshly reviewed.

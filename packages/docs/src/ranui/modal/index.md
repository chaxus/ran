---
description: "The ranui Modal (<r-modal>) is a dialog for focused interactions, with focus trapping, scroll locking, background inerting and an imperative Modal.confirm API."
---

# Modal

Dialog component for focused interactions on top of the current page, with focus trapping, scroll locking, and background inerting.

> **Use when** you need a dialog for a focused interaction over the page, with focus trapping, scroll locking, and background inerting — drive `<r-modal>` via the `open` attribute or the imperative `Modal.confirm` / `Modal.info` helpers.

## Quick Start

### Basic Usage

Modal visibility is controlled by the `open` attribute (or the `open` property). It starts closed and renders nothing until opened, so wire a trigger to toggle it.

<Demo>
  <r-button onclick="document.getElementById('quickstart-modal').open = true">Open Modal</r-button>
  <r-modal id="quickstart-modal" title="Basic Modal">
    <p>This is the modal content.</p>
    <div slot="footer">
      <r-button type="primary" onclick="document.getElementById('quickstart-modal').open = false">OK</r-button>
    </div>
  </r-modal>
</Demo>

```html
<r-button onclick="modal.open = true">Open Modal</r-button>

<r-modal id="modal" title="Basic Modal">
  <p>This is the modal content.</p>
  <div slot="footer">
    <r-button type="primary" onclick="modal.open = false">OK</r-button>
  </div>
</r-modal>
```

## API Reference

### Properties

| Property       | Type      | Default | Description                                            |
| -------------- | --------- | ------- | ------------------------------------------------------ |
| `open`         | `boolean` | `false` | Whether the modal is visible                           |
| `title`        | `string`  | `''`    | Header title text (falls back to `Modal` when empty)   |
| `closable`     | `boolean` | `true`  | Whether the close (`x`) button is shown                |
| `maskClosable` | `boolean` | `true`  | Whether clicking the backdrop mask closes the modal    |
| `closeOnEsc`   | `boolean` | `true`  | Whether pressing `Escape` closes the modal             |
| `lockScroll`   | `boolean` | `true`  | Whether body scroll is locked while the modal is open  |
| `autoFocus`    | `boolean` | `true`  | Whether the first focusable element is focused on open |
| `sheet`        | `string`  | `''`    | CSS injected into the shadow DOM                       |

### Title `title`

```html
<r-modal open title="Delete item">
  <p>Are you sure you want to delete this item?</p>
</r-modal>
```

### Closable `closable`

Hides the header close button so the modal can only be dismissed through your own controls.

```html
<r-modal open title="Terms" closable="false">
  <p>You must accept the terms to continue.</p>
  <div slot="footer">
    <r-button type="primary">Accept</r-button>
  </div>
</r-modal>
```

### Mask Closable `maskClosable`

By default clicking the backdrop closes the modal. Set to `false` to require an explicit action.

```html
<r-modal open title="Unsaved changes" maskClosable="false">
  <p>Clicking outside will not dismiss this dialog.</p>
</r-modal>
```

### Close on Escape `closeOnEsc`

```html
<r-modal open title="Report" closeOnEsc="false">
  <p>The Escape key is disabled for this dialog.</p>
</r-modal>
```

### Lock Scroll `lockScroll`

```html
<r-modal open title="Preview" lockScroll="false">
  <p>The page behind the modal can still scroll.</p>
</r-modal>
```

### Auto Focus `autoFocus`

```html
<r-modal open title="Search" autoFocus="false">
  <input type="text" placeholder="Type to search" />
</r-modal>
```

## Slots

| Slot      | Description                                                   |
| --------- | ------------------------------------------------------------- |
| (default) | Body content of the modal                                     |
| `footer`  | Footer actions; the footer bar only shows when this is filled |

```html
<r-modal open title="Confirm">
  <p>Body content goes in the default slot.</p>
  <div slot="footer">
    <r-button onclick="modal.open = false">Cancel</r-button>
    <r-button type="primary">Confirm</r-button>
  </div>
</r-modal>
```

## Events

All close-related events carry a `trigger` in `event.detail` describing what caused the close: `'mask'`, `'button'`, `'escape'`, or `'program'`.

| Event         | Cancelable | `detail`      | Description                                       |
| ------------- | ---------- | ------------- | ------------------------------------------------- |
| `beforeopen`  | Yes        | —             | Before opening; call `preventDefault()` to cancel |
| `open`        | No         | —             | Fired when the modal opens                        |
| `afteropen`   | No         | —             | Fired after the open transition finishes          |
| `beforeclose` | Yes        | `{ trigger }` | Before closing; call `preventDefault()` to cancel |
| `close`       | No         | `{ trigger }` | Fired when the modal closes                       |
| `afterclose`  | No         | `{ trigger }` | Fired after the close transition finishes         |

```html
<r-modal id="modal" title="Example"></r-modal>

<script>
  const modal = document.getElementById('modal');

  modal.addEventListener('beforeclose', (e) => {
    if (!confirm('Discard changes?')) e.preventDefault();
  });

  modal.addEventListener('close', (e) => {
    console.log('closed via', e.detail.trigger); // 'mask' | 'button' | 'escape' | 'program'
  });
</script>
```

## Programmatic API

The `Modal` class exposes static helpers that create, mount, and resolve a modal without markup. Each returns a `Promise<{ action, trigger }>` where `action` is `'confirm'`, `'cancel'`, or `'dismiss'`.

| Method                | Description                                    |
| --------------------- | ---------------------------------------------- |
| `Modal.open(opts)`    | Open a modal with a single OK button           |
| `Modal.confirm(opts)` | Open a modal with OK and Cancel buttons        |
| `Modal.info(opts)`    | Informational modal (title defaults to `Info`) |
| `Modal.success(opts)` | Success modal (title defaults to `Success`)    |
| `Modal.warning(opts)` | Warning modal (title defaults to `Warning`)    |
| `Modal.error(opts)`   | Error modal (title defaults to `Error`)        |

Options (all optional): `title`, `content`, `okText`, `cancelText`, `showCancel`, `maskClosable`, `closeOnEsc`, `lockScroll`, `autoFocus`, `closable`, `onConfirm`, `onCancel`. `onConfirm` / `onCancel` may return `false` (or a promise resolving to `false`) to keep the modal open.

```js
import { Modal } from 'ranui/modal';

const result = await Modal.confirm({
  title: 'Delete project',
  content: 'This action cannot be undone.',
  okText: 'Delete',
  cancelText: 'Keep',
  onConfirm: async () => {
    await deleteProject();
  },
});

if (result.action === 'confirm') {
  // deleted
}
```

## CSS Parts

Style internal pieces with `::part()`.

| Part     | Description                |
| -------- | -------------------------- |
| `root`   | Outer overlay container    |
| `mask`   | Backdrop behind the dialog |
| `dialog` | The dialog box             |
| `header` | Header bar                 |
| `title`  | Title heading              |
| `close`  | Close (`x`) button         |
| `body`   | Scrollable body region     |
| `footer` | Footer action bar          |

```css
r-modal::part(dialog) {
  border-radius: 8px;
}
r-modal::part(mask) {
  background: rgba(0, 0, 0, 0.6);
}
```

## Best Practices

- **Trigger + toggle**: Open with `modal.open = true` and close with `modal.open = false`, or call `close()`.
- **Guard destructive closes**: Listen for `beforeclose` and `preventDefault()` to confirm before dismissing unsaved work.
- **Footer actions**: Put primary/secondary buttons in `slot="footer"`; the footer bar only appears when the slot has content.
- **Non-dismissible flows**: Set `closable="false"` and `maskClosable="false"` to force an explicit choice.
- **One-off dialogs**: Use `Modal.confirm` / `Modal.info` for quick prompts instead of authoring markup.

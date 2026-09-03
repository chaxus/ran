---
description: 'The ranui Attachments strip (<r-attachments>) holds, previews and validates the files staged alongside a message, and owns the object URLs it creates.'
---

# Attachments

The files staged alongside a message: `<r-attachments>` holds the list, previews it, validates
what arrives, and owns the object URLs it creates.

> **Use when** a composer needs to show what is about to be sent. It does **not** collect
> files: paste, drag-and-drop and a file picker are three separate gestures, each belonging to
> a different element of a composer, and which of them your app offers is your decision. Call
> `add()` from whichever you wire.

## Quick Start

### Basic Usage

```html
<r-attachments accept="image/*,.pdf" max-size="5242880" max-count="4"></r-attachments>
```

```js
const strip = document.querySelector('r-attachments');

// A file picker
picker.addEventListener('change', () => strip.add(picker.files));

// Paste — only when the clipboard actually carries files. Intercepting every paste
// breaks pasting text, which is what the box is mostly for.
input.addEventListener('paste', (event) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    strip.add(event.clipboardData.files);
  }
});

// Drag and drop
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  strip.add(event.dataTransfer.files);
});
```

The strip renders one row per file with a thumbnail (images), the name, the size and a remove
button. `count` is reflected onto the host, and **removed** when the strip is empty rather
than set to `0`, so an empty strip can take no space:

```css
r-attachments:not([count]) {
  display: none;
}
```

### Sending

```js
const body = new FormData();
for (const file of strip.files) body.append('files', file);
await fetch('/api/messages', { method: 'POST', body });
strip.clear();
```

`files` is just the `File` objects, in order: the shape a request body wants. `attachments`
is the richer list (`id`, `name`, `size`, `type`, `previewUrl`) when you need to render your
own view of the same state.

### Rejection is reported, never silent

A file that vanishes because it was 3 MB over a limit nobody mentioned reads as a bug in the
page. Every refusal fires an event with the file and the rule it broke:

```js
const explain = {
  'too-large': 'That file is larger than 5 MB.',
  'type-not-accepted': "That file type isn't accepted here.",
  'too-many': 'You can attach at most 4 files.',
  duplicate: 'That file is already attached.',
};

strip.addEventListener('attachmentrejected', (event) => {
  toast(explain[event.detail.reason]);
});
```

`duplicate` compares name, size and modification time together, matching what a file manager
treats as the same file. Attaching the same file twice is a slip, not an instruction.

## API Reference

### Properties

| Property      | Attribute   | Type                    | Default | Description                                                              |
| ------------- | ----------- | ----------------------- | ------- | ------------------------------------------------------------------------ |
| `accept`      | `accept`    | `string`                | `''`    | Comma-separated types or extensions, in the form `<input accept>` takes. |
| `maxSize`     | `max-size`  | `number`                | `10 MB` | Largest file accepted, in bytes.                                         |
| `maxCount`    | `max-count` | `number`                | —       | Most files that may be staged at once; unlimited when unset.             |
| `attachments` | —           | `readonly Attachment[]` | `[]`    | The staged files, in the order they arrived.                             |
| `files`       | —           | `File[]`                | `[]`    | Just the files, for building a request body.                             |
| `sheet`       | `sheet`     | `string`                | `''`    | CSS injected into the shadow root.                                       |

`attachments` and `files` are read-only views. Stage files through `add()`.

### Methods

| Method       | Returns        | Description                                                         |
| ------------ | -------------- | ------------------------------------------------------------------- |
| `add(files)` | `Attachment[]` | Stages an iterable of `File`s; returns the ones that were accepted. |
| `detach(id)` | `boolean`      | Removes one attachment by id; `false` if there was no such id.      |
| `clear()`    | `void`         | Removes everything and revokes its object URLs.                     |

::: tip It is `detach(id)`, not `remove(id)`
Every element already has a `remove()` that takes no arguments and takes itself out of the
document. Shadowing it with different semantics is a trap for anyone reaching for the standard
method.
:::

### Events

| Event                | Detail             | Dispatch          | Description                                                                                       |
| -------------------- | ------------------ | ----------------- | ------------------------------------------------------------------------------------------------- |
| `attachmentschange`  | `{ attachments }`  | bubbles, composed | The staged list changed.                                                                          |
| `attachmentrejected` | `{ file, reason }` | bubbles, composed | A file was refused. `reason` is one of `too-large`, `type-not-accepted`, `too-many`, `duplicate`. |

### Types

```ts
interface Attachment {
  id: string; // stable for this attachment's life
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null; // object URL for images, null otherwise
}

type AttachmentRejection = 'too-large' | 'type-not-accepted' | 'too-many' | 'duplicate';
```

### Parts

`list` · `attachment` · `thumb` · `icon` · `name` · `size` · `remove`

## How previews work

Previews are **object URLs, not data URLs**. Previewing costs a reference to bytes the browser
already holds; reading a 10 MB photo into a base64 string to show a 40px thumbnail costs the
string. Build the data URL later, once, in whatever sends.

Every URL the element creates it also revokes, on detach, on clear, and on disconnect. Don't
hold `previewUrl` past the attachment's life.

## Accessibility

A thumbnail's alt text is **the file name**, not "image": four attachments all announced as
"image" have told the reader nothing about which is which. Each remove button is named after
its file for the same reason.

## Styling

`<r-attachments>` exposes **17 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from, such as `:root`, a wrapper, or the element:

```css
r-attachments {
  --ran-attachment-background: var(--ran-color-bg-subtle);
}
```

Parts: `attachment` · `icon` · `list` · `name` · `remove` · `size` · `thumb`

The full list is in [style tokens](/src/ranui/style-tokens#attachments); which token to reach for is the [design system](/src/ranui/design-system/).

## Best Practices

- **Validate on the server too.** `accept` and `max-size` are a courtesy to the person
  attaching, not a security boundary.
- **Clear after a successful send**, not before. A failed request should leave the files
  staged so they can be retried.
- **Explain every rejection.** The event exists so the strip never silently swallows a file.

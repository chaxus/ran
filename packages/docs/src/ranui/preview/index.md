---
description: 'The ranui Preview (<r-preview>) renders in-browser online previews of docx, pptx, pdf and xlsx files.'
---

# Preview

Online preview component for `docx`, `pptx`, `pdf`, and `xlsx` files.

> **Use when** you need to preview `docx`, `pptx`, `pdf`, or `xlsx` files in the browser. `<r-preview>` opens a document preview modal from a file URL (now shipped as the standalone `@ranui/preview` package).

> ⚠️ **Important Notice**: The ranui package will no longer provide this component after version 0.1.10-alpha-27. Please migrate to the standalone [@ranui/preview](https://www.npmjs.com/package/@ranui/preview) package.

## Quick Start

### Installation

```bash
# Use the standalone preview package (recommended)
npm install @ranui/preview

# Or use the full ranui package (before version 0.1.10-alpha-27)
npm install ranui
```

### Basic Usage

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" data-preview-upload="preview-demo">Choose File to Preview</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">Choose File to Preview</r-button>

<script>
  let selectedUrl;
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx,.xls');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        if (selectedUrl) URL.revokeObjectURL(selectedUrl);
        selectedUrl = URL.createObjectURL(file);
        preview.setAttribute('src', selectedUrl);
      }
    };
  };
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted && selectedUrl) URL.revokeObjectURL(selectedUrl);
  });
</script>
```

## API Reference

### Properties

| Attribute / property   | Type      | Default                   | Description                                                      |
| ---------------------- | --------- | ------------------------- | ---------------------------------------------------------------- |
| `src`                  | `string`  | —                         | File URL; setting it opens the dialog                            |
| `closeable`            | `string`  | —                         | Set the string false to hide the close button and disable Escape |
| `baseUrl` / `baseurl`  | `string`  | `https://edit.chaxus.com` | Office editor page URL                                           |
| `readonly`             | `boolean` | `false`                   | Opt-in Office read-only mode                                     |
| `pdf-mode` / `pdfMode` | `string`  | `eager`                   | PDF mode: eager or virtual                                       |
| `label`                | `string`  | `Preview file`            | Accessible name of the trigger                                   |

### File Source `src`

Set the file URL to open the preview modal; an empty value won't display it.

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### Closeable `closeable`

Control the close behavior of the preview modal.

```html
<!-- Closeable by default -->
<r-preview closeable="true"></r-preview>

<!-- Not closeable -->
<r-preview closeable="false"></r-preview>
```

### Custom Preview Service `baseUrl`

When you need to customize the document preview service, you can specify the service address through the `baseUrl` property.

```html
<r-preview baseUrl="https://edit.chaxus.com"></r-preview>
```

> 💡 **Tip**: Defaults to the hosted preview service at `https://edit.chaxus.com`. To self-host it, see [OnlyOffice Web Local](https://github.com/ranuts/document).

## 0.3.0 compatibility

Version 0.3.0 keeps automatic registration and editable Office defaults. In default `eager` mode, PDF `load` fires after every page is painted. Set `pdf-mode="virtual"` (JavaScript: `pdfMode = 'virtual'`) for viewport rendering: `load` then means the first viewport and buffer are ready. Its worker stays active until close, source replacement or disconnection. Changing `readonly` or `closeable` preserves the open Office editor and unsaved edits.

```html
<r-preview pdf-mode="virtual" src="/reports/long.pdf"></r-preview>
<r-preview readonly src="/reports/annual.docx"></r-preview>
```

PDFs render locally. Office files are passed to the configured editor iframe, which can access their contents. Use your own `baseUrl` deployment for private or intranet documents.

## Migration Guide

If you're currently using the `r-preview` component from the ranui package, we recommend following these steps to migrate:

1. **Install the new package**:

   ```bash
   npm install @ranui/preview
   ```

2. **Update imports**:

   ```javascript
   // Before
   import 'ranui';

   // Now
   import '@ranui/preview';
   ```

3. **HTML usage remains the same**:
   ```html
   <r-preview src="your-file-url"></r-preview>
   ```

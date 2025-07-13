# preview

Online preview component for `docx`, `pptx`, `pdf`, and `xlsx` files

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
    <r-preview id="fdsafdsafdsafdsaf"></r-preview>
    <r-button type="primary" onclick="uploadFile('fdsafdsafdsafdsaf')">Choose File to Preview</r-button>
</div>

```html
<r-preview id="preview"></r-preview>
<r-button type="primary" onclick="uploadFile()">Choose File to Preview</r-button>

<script>
  const uploadFile = () => {
    const preview = document.getElementById('preview');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        preview.setAttribute('src', url);
      }
    };
  };
</script>
```

## API Reference

### Properties

| Property    | Type      | Default | Description                                                  |
| ----------- | --------- | ------- | ------------------------------------------------------------ |
| `src`       | `string`  | `''`    | File preview URL, automatically opens preview modal when set |
| `closeable` | `boolean` | `true`  | Whether to show the close button                             |
| `baseUrl`   | `string`  | `''`    | Custom document preview service URL                          |

### File Source `src`

Set the file URL to open the preview modal, empty value will not display

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### Closeable `closeable`

Control the close behavior of the preview modal

```html
<!-- Closeable by default -->
<r-preview closeable="true"></r-preview>

<!-- Not closeable -->
<r-preview closeable="false"></r-preview>
```

### Custom Preview Service `baseUrl`

When you need to customize the document preview service, you can specify the service address through the `baseUrl` property

```html
<r-preview baseUrl="http://localhost:5174/document"></r-preview>
```

> 💡 **Tip**: Uses built-in preview service by default. Deployment details can be found at [OnlyOffice Web Local](https://github.com/ranuts/document)

## Version History

- **Before ranui 0.1.10-alpha-24**:
  - Used multiple third-party libraries (jszip, docx-preview, exceljs, pdfjs, pptx2html) for document preview

- **After ranui 0.1.10-alpha-26**:
  - Switched to OnlyOffice WebAssembly version for better preview experience
  - Deployment details can be found at: [OnlyOffice Web Local](https://github.com/ranuts/document)

- **After ranui 0.1.10-alpha-27**:
  - 🎉 Added standalone [@ranui/preview](https://www.npmjs.com/package/@ranui/preview) package
  - Provides lighter installation option, specifically for file preview functionality
  - The ranui package will no longer include the `r-preview` component

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

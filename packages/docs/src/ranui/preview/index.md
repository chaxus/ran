# preview

Support 'docx', 'pptx', 'pdf', 'xlsx' file preview

## Version History

- **Before ranui 0.1.10-alpha-24**: 
  - Used [jszip](https://github.com/Stuk/jszip), [docx-preview](https://github.com/VolodymyrBaydalka/docxjs), [exceljs](https://github.com/exceljs/exceljs), [pdfjs](https://github.com/mozilla/pdfjs-dist), [pptx2html](https://github.com/g21589/PPTX2HTML) for document preview
- **After ranui 0.1.10-alpha-26**: Switched to OnlyOffice WebAssembly version for better document preview support
  - Deployment details can be found at: [OnlyOffice Web Local](https://github.com/ranuts/document)


## Code demo

<div style="width: 100px; margin-top:10px">
    <r-preview id="fdsafdsafdsafdsaf"></r-preview>
    <r-button type="primary" onclick="uploadFile('fdsafdsafdsafdsaf')">choose file to preview</r-button>
</div>

```html
<r-preview id="preview"></r-preview>
<r-button type="primary" onclick="uploadFile()">choose file to preview</r-button>

<script>
  const uploadFile = () => {
    const preview = document.getElementById('preview');
    const uploadFile = document.createElement('input');
    uploadFile.setAttribute('type', 'file');
    uploadFile.click();
    uploadFile.onchange = (e) => {
      const { files = [] } = uploadFile;
      if (files.length > 0) {
        preview.setAttribute('src', '');
        const file = files[0];
        const url = URL.createObjectURL(file);
        preview.setAttribute('src', url);
      }
    };
  };
</script>
```

## Attribute

### `src`

If there is a 'src' address, the popup window will be opened, and if there is no 'src', it will not be displayed

```html
<r-preview src=""></r-preview>
```

### `closeable`

'closeable' defaults to 'true' and can be closed, when set to 'false', it cannot be closed, and the close button in the upper right corner will not be displayed

```html
<r-preview closeable="false"></r-preview>
```

### `baseUrl`

When you need to customize the document preview service, you can specify the service address through the `baseUrl` attribute. By default, the component uses the built-in preview service.

Built-in deployment reference: https://github.com/ranuts/document

This parameter can also be used for debugging

```html
<r-preview baseUrl="http://localhost:5174/document"></r-preview>
```

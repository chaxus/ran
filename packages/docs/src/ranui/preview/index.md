# preview

Support 'docx', 'pptx', 'pdf', 'xlsx' file preview

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

## Version History

- Before ranui 0.1.10-alpha-24: Used docx-preview and pdfjs for document preview
- After ranui 0.1.10-alpha-24: Switched to OnlyOffice WebAssembly version for better document preview support
  - Deployment details can be found at: [OnlyOffice Web Local](https://github.com/ranuts/document)

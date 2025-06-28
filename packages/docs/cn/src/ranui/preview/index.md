# preview 文件预览

支持`docx`，`pptx`，`pdf`,`xlsx`文件的预览

## 代码演示

<div style="width: 100px; margin-top:10px">
    <r-preview id="fhdjskafk"></r-preview>
    <r-button type="primary" onclick="uploadFile('fhdjskafk')">choose file to preview</r-button>
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

## 属性

### 资源地址`src`

有 `src` 地址即可打开弹窗，没有`src`就不展示

```html
<r-preview src=""></r-preview>
```

### 是否可关闭`closeable`

`closeable` 默认为 `true` ，可以关闭，设置成 `false` 时，表示不可关闭，将不会展示右上角的关闭按钮

```html
<r-preview closeable="false"></r-preview>
```

### `baseUrl`

当您需要自定义文档预览服务时，可以通过 `baseUrl` 属性指定服务地址。默认情况下，组件会使用内置的预览服务。

内置的部署参考：https://github.com/ranuts/document

也可以通过这个参数来调试

```html
<r-preview baseUrl="http://localhost:5174/document"></r-preview>
```

## 版本历史

- **ranui 0.1.10-alpha-24 版本之前**:
  - 使用 [jszip](https://github.com/Stuk/jszip), [docx-preview](https://github.com/VolodymyrBaydalka/docxjs), [exceljs](https://github.com/exceljs/exceljs), [pdfjs](https://github.com/mozilla/pdfjs-dist), [pptx2html](https://github.com/g21589/PPTX2HTML) 进行文档的预览。
- **ranui 0.1.10-alpha-26 版本之后**: 改用 OnlyOffice WebAssembly 版本进行文档预览
  - 部署详情请参考： [OnlyOffice Web Local](https://github.com/ranuts/document)

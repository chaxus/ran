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

## 版本历史

- ranui 0.1.10-alpha-24 之前：使用 docx-preview 和 pdfjs 进行文档预览
- ranui 0.1.10-alpha-24 之后：改用 OnlyOffice WebAssembly 版本进行文档预览
  - 部署详情请参考：[OnlyOffice Web Local](https://github.com/ranuts/document)

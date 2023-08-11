# preview 预览组件

支持`docx`，`pptx`，`pdf`,`xlsx`文件的预览

## 代码演示

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview"></r-preview>
    <r-button type="primary" onclick="uploadFile('preview')">choose file to preview</r-button>
</div>

```html
<r-preview ></r-preview>
<r-button type="primary" onclick="uploadFile()">上传docx</r-button>

<script>
      const uploadFile = () => {
        const preview = document.getElementById('preview')
        const uploadFile = document.createElement('input')
        uploadFile.setAttribute('type', 'file')
        uploadFile.click()
        uploadFile.onchange = (e) => {
          const { files = [] } = uploadFile
          if (files.length > 0) {
            preview.setAttribute('src', '')
            const file = files[0]
            const url = URL.createObjectURL(file)
            preview.setAttribute('src', url)
          }
        }
      }
</script>
```

## 属性

### 资源地址`src`

有 `src` 地址即可打开弹窗，没有`src`就不展示

```html
<r-preview src=""></r-preview>
```

### 是否可关闭`closeable`

`closeable` 不设置默认为 `true` ，可以关闭，传 `false` 表示不展示关闭按钮，不可关闭

```html
<r-preview closeable="false"></r-preview>
```
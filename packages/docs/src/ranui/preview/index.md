# preview 文件预览

支持`docx`，`pptx`，`pdf`,`xlsx`文件的预览

## 代码演示

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview"></r-preview>
    <r-button type="primary" onclick="uploadFile('preview')">choose file to preview</r-button>
</div>

```html
<r-preview id="preview"></r-preview>
<r-button type="primary" onclick="uploadFile()">choose file to preview</r-button>

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
- tsx 例子

```tsx

// react 18 
import type { SyntheticEvent } from 'react';
import React, { useRef } from 'react'
import 'ranui'

const FilePreview = () => {
    const ref = useRef<HTMLDivElement | null>(null)
    const uploadFile = (e: SyntheticEvent<HTMLDivElement>) => {
        if (ref.current) {
            const uploadFile = document.createElement('input')
            uploadFile.setAttribute('type', 'file')
            uploadFile.click()
            uploadFile.onchange = (e) => {
                const { files = [] } = uploadFile
                if (files && files?.length > 0 && ref.current) {
                    ref.current.setAttribute('src', '')
                    const file = files[0]
                    const url = URL.createObjectURL(file)
                    ref.current.setAttribute('src', url)
                }
            }
        }
    }
    return (
        <div >
            <r-preview ref={ref}></r-preview>
            <r-button type="primary" onClick={uploadFile}>choose file to preview</r-button>
        </div>
    )
}
```

`jsx`中会定义所有原生组件的类型，`web-component`类型不在里面，需要进行追加

```ts
// typings.d.ts
interface RButton {
  type?: string,
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

interface RPreview {
  src?: string | Blob | ArrayBuffer,
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  ref?: React.MutableRefObject<HTMLDivElement | null>
}

declare namespace JSX {
  interface IntrinsicElements {
    'r-preview': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & RPreview
    'r-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & RButton
  }
}
```

## 属性

### 资源地址`src`

有 `src` 地址即可打开弹窗，没有`src`就不展示

```html
<r-preview src=""></r-preview>
```

### 是否可关闭`closeable`

`closeable` 默认为 `true` ，可以关闭，当设置成 `false` 时， 表示不可关闭，将不会展示右上角的关闭按钮

```html
<r-preview closeable="false"></r-preview>
```



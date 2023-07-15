# preview 预览组件

支持`docx`，`pptx`，`pdf`文件的预览

## 代码演示

预览`docx`

<div style="width: 100px;margin-top:10px">
    <r-preview id="docx"><r-icon name="preview" size="30" color="#1E90FF"></r-icon>点击预览</r-preview>
    <r-button type="primary" onclick="uploadFile('docx')">上传docx</r-button>
</div>

```xml
 <r-preview >点击预览</r-preview>
 <r-button type="primary" onclick="uploadFile()">上传docx</r-button>
```

预览`pptx`

<div style="width: 100px;margin-top:10px">
    <r-preview id="pptx"><r-icon name="preview" size="30" color="#1E90FF"></r-icon>点击预览</r-preview>
    <r-button type="primary" onclick="uploadFile('pptx')">上传pptx</r-button>
</div>

```xml
 <r-icon name="eye"></r-icon><r-preview >点击预览</r-preview>
 <r-button type="primary" onclick="uploadFile()">上传docx</r-button>
```

预览`pdf`

<div style="width: 100px;margin-top:10px">
    <r-preview id="pdf"><r-icon name="preview" size="30" color="#1E90FF"></r-icon>点击预览</r-preview>
    <r-button type="primary" onclick="uploadFile('pdf')">上传pptx</r-button>
</div>

```xml
 <r-icon name="eye"></r-icon><r-preview >点击预览</r-preview>
 <r-button type="primary" onclick="uploadFile()">上传docx</r-button>
```

## 属性

### 预览的文件地址`src`

需要注意的是，链接需要支持跨域，否则请求不了资源

<r-icon name="preview" size="30" color="#1E90FF"></r-icon>点击预览
<r-preview src="//www.ecma-international.org/wp-content/uploads/ECMA-423_1st_edition_june_2023.pdf"></r-preview>

```xml
<r-icon name="preview" size="30" color="#1E90FF"></r-icon>点击预览
 <r-preview src="//www.ecma-international.org/wp-content/uploads/ECMA-422_1st_edition_december_2022.pdf"></r-preview>
```
